from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
import os
import shutil
import mysql.connector
import json
import re
from datetime import datetime

from exam_ocr import process_page
from answer_parser import parse_student_answers
from themis_evaluator import ThemisEvaluator
from semantic_engine import SemanticEngine
from knowledge_graph import KnowledgeGraph

app = FastAPI(title="EvalBuddy AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
STUDENT_OCR_DIR = "student_ocrs"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(STUDENT_OCR_DIR, exist_ok=True)

themis = ThemisEvaluator(use_4bit=True, offload_layers=16)
semantic = SemanticEngine()

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="evaluser",           # <-- Update this
        password="your_password",   # <-- Update this
        database="exam_eval"
    )

class SignupData(BaseModel):
    user_id: str
    name: str
    email: str
    password: str
    role: str

class LoginData(BaseModel):
    email: str
    password: str
    role: str


@app.post("/api/auth/signup")
def signup(data: SignupData):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (user_id, name, email, password, role) VALUES (%s, %s, %s, %s, %s)",
            (data.user_id, data.name, data.email, data.password, data.role)
        )
        if data.role == 'Student':
            cursor.execute(
                "INSERT IGNORE INTO students (student_id, name) VALUES (%s, %s)",
                (data.user_id, data.name)
            )
        conn.commit()
        return JSONResponse({"status": "success", "message": "Account created successfully!"})
    except mysql.connector.IntegrityError:
        raise HTTPException(status_code=400, detail="Email or ID already exists.")
    finally:
        cursor.close()
        conn.close()

@app.post("/api/auth/login")
def login(data: LoginData):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT user_id, name, role FROM users WHERE email = %s AND password = %s AND role = %s",
        (data.email, data.password, data.role)
    )
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if user:
        return JSONResponse({"status": "success", "user": {"id": user["user_id"], "name": user["name"], "role": user["role"]}})
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials.")


@app.post("/api/student/preview_evaluation")
async def preview_evaluation(
    student_name: str = Form(...),
    subject: str = Form(...),
    question: str = Form(...),
    image: UploadFile = File(...)
):
    file_ext = os.path.splitext(image.filename)[1]
    temp_path = os.path.join(UPLOAD_DIR, f"preview_{uuid.uuid4()}{file_ext}")
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    try:
        raw_text, corrected_text = process_page(temp_path, context=subject, student_id=student_name, page_num=1)
        student_answer = corrected_text 
        themis_result = themis.evaluate(
            question=question,
            student_answer=student_answer,
            model_answer=None, 
            concepts=None
        )

        feedback = themis_result.get("feedback", "")
        strengths = themis_result.get("strengths", [])
        weaknesses = themis_result.get("weaknesses", [])
        all_text = feedback + " " + " ".join(strengths) + " " + " ".join(weaknesses)
        
        math_keywords = ["calculus", "algebra", "geometry", "integration", "derivative", "probability", "statistics", "function", "equation", "matrix", "vector", "theorem"]
        lit_keywords = ["theme", "character", "plot", "symbolism", "metaphor", "narrative", "poetry", "prose", "essay", "thesis", "analysis"]
        keywords = math_keywords if subject.lower() == "mathematics" else lit_keywords

        found_concepts = set()
        for kw in keywords:
            if re.search(r'\b' + re.escape(kw) + r'\b', all_text, re.IGNORECASE):
                found_concepts.add(kw)

        nodes = [{"id": student_name, "name": student_name, "val": 8, "color": "#3b82f6"}]
        links = []
        for concept in found_concepts:
            nodes.append({"id": concept, "name": concept.capitalize(), "val": 5, "color": "#10b981"})
            links.append({"source": student_name, "target": concept})

        return JSONResponse({
            "score": themis_result.get("score"),
            "feedback": feedback,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "graph": {"nodes": nodes, "links": links}
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


@app.post("/api/teacher/evaluate_local_folder")
async def evaluate_local_folder(
    background_tasks: BackgroundTasks,
    subject: str = Form(...),
    total_marks: int = Form(...),
    folder_path: str = Form(...),
    question_file: UploadFile = File(...)
):
    q_file_path = os.path.join(UPLOAD_DIR, f"questions_{uuid.uuid4()}.json")
    with open(q_file_path, "wb") as buffer:
        shutil.copyfileobj(question_file.file, buffer)

    if not os.path.exists(folder_path):
        raise HTTPException(status_code=400, detail="Folder path does not exist on the server.")

    background_tasks.add_task(process_teacher_directory, folder_path, q_file_path, subject)
    return JSONResponse({"status": "success", "message": "Folder evaluation pipeline started!"})

async def process_teacher_directory(base_folder: str, question_json_path: str, subject: str):
    with open(question_json_path, "r") as f:
        question_bank = json.load(f)

    for item in os.listdir(base_folder):
        student_folder = os.path.join(base_folder, item)
        if not os.path.isdir(student_folder):
            continue

        student_id = item
        image_paths = [os.path.join(student_folder, img) for img in os.listdir(student_folder) if img.lower().endswith(('.png', '.jpg', '.jpeg'))]

        if image_paths:
            await process_student_pages(student_id, subject, image_paths, question_bank, themis, semantic)

    if os.path.exists(question_json_path):
        os.remove(question_json_path)

async def process_student_pages(student_id: str, subject: str, image_paths: list, question_bank: list, themis, semantic):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id FROM students WHERE student_id = %s", (student_id,))
    student = cursor.fetchone()
    student_db_id = student['id'] if student else None # simplified for brevity

    all_corrected = []
    for page_num, img_path in enumerate(image_paths, start=1):
        raw_text, corrected_text = process_page(img_path, context=subject, student_id=student_id, page_num=page_num)
        all_corrected.append(corrected_text)
        cursor.execute("INSERT INTO ocr_results (student_id, page_number, raw_text, corrected_text) VALUES (%s, %s, %s, %s)", (student_db_id, page_num, raw_text, corrected_text))

    combined_corrected = "\n".join(all_corrected)
    answers = parse_student_answers(combined_corrected, question_bank)

    for ans in answers:
        themis_result = themis.evaluate(question=ans["question"], student_answer=ans["answer"], model_answer=ans["model_answer"], concepts=ans["concepts"])
        
        cursor.execute("""
            INSERT INTO evaluation_results 
            (student_id, subject, question_id, corrected_score, themis_feedback, covered_concepts, missing_concepts) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (student_db_id, subject, ans["qid"], themis_result.get("score"), themis_result.get("feedback"), json.dumps(themis_result.get("covered_concepts", [])), json.dumps(themis_result.get("missing_concepts", []))))

    conn.commit()
    cursor.close()
    conn.close()


@app.get("/api/graph/{student_name}")
def get_student_graph(student_name: str):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, name FROM students WHERE student_id = %s", (student_name,))
    student = cursor.fetchone()
    if not student: return JSONResponse({"nodes": [], "links": []})

    cursor.execute("""
        SELECT c.name as concept_name, sc.relationship 
        FROM student_concept sc JOIN concept_nodes c ON sc.concept_id = c.id 
        WHERE sc.student_id = %s
    """, (student['id'],))
    relationships = cursor.fetchall()
    
    nodes = [{"id": student_name, "name": student['name'], "val": 8, "color": "#3b82f6"}]
    links = []
    for rel in relationships:
        color = "#10b981" if rel['relationship'] == 'KNOWS' else "#ef4444"
        nodes.append({"id": rel['concept_name'], "name": rel['concept_name'], "val": 6, "color": color})
        links.append({"source": student_name, "target": rel['concept_name']})
    
    cursor.close()
    conn.close()
    return JSONResponse({"nodes": nodes, "links": links})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
