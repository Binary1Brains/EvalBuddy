import os
import json
import mysql.connector
from semantic_engine import SemanticEngine
from knowledge_graph import KnowledgeGraph
from themis_evaluator import ThemisEvaluator
from answer_parser import parse_student_answers

DB_HOST = "localhost"
DB_USER = "root"          
DB_PASSWORD = "Parijat#"
DB_NAME = "exam_eval"

semantic = SemanticEngine()
kg = KnowledgeGraph(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, database=DB_NAME)
themis = ThemisEvaluator(use_4bit=True, offload_layers=16)  # Adjust offload based on GPU memory

with open("literature_questions.json", "r") as f:
    question_bank = json.load(f)

ocr_dir = "student_ocrs"
output_dir = "evaluations"
os.makedirs(output_dir, exist_ok=True)

students = set()
for f in os.listdir(ocr_dir):
    if f.endswith("_raw.txt"):
        students.add(f.replace("_raw.txt", ""))
    if f.endswith("_corrected.txt"):
        students.add(f.replace("_corrected.txt", ""))

for student_id in students:
    print(f"\nProcessing {student_id}...")

    raw_path = os.path.join(ocr_dir, f"{student_id}_raw.txt")
    corrected_path = os.path.join(ocr_dir, f"{student_id}_corrected.txt")

    if not os.path.exists(raw_path) or not os.path.exists(corrected_path):
        print(f"  Missing OCR files for {student_id}")
        continue

    with open(raw_path, "r") as f:
        raw_text = f.read()
    with open(corrected_path, "r") as f:
        corrected_text = f.read()

    raw_answers = parse_student_answers(raw_text, question_bank)
    corrected_answers = parse_student_answers(corrected_text, question_bank)

    if not raw_answers or not corrected_answers:
        print(f"  No answers parsed for {student_id}")
        continue

    kg.create_student(student_id, student_id)

    results = []

    for raw_item, corr_item in zip(raw_answers, corrected_answers):
        qid = corr_item["qid"]
        question = corr_item["question"]
        raw_answer = raw_item["answer"]
        answer = corr_item["answer"]
        model_answer = corr_item["model_answer"]
        concepts = corr_item["concepts"]
        subject = corr_item.get("topic", "Unknown")  # from question bank

        print(f"  Evaluating {qid}...")

        themis_raw = themis.evaluate(
            question=question,
            student_answer=raw_answer,
            model_answer=model_answer,
            concepts=concepts
        )

        themis_corr = themis.evaluate(
            question=question,
            student_answer=answer,
            model_answer=model_answer,
            concepts=concepts
        )

        sem_result = semantic.evaluate(model_answer, answer, concepts) if concepts else None

        covered = themis_corr.get("covered_concepts", [])
        missing = themis_corr.get("missing_concepts", [])

        if not covered and not missing and sem_result:
            covered = sem_result["covered"]
            missing = sem_result["missing"]

        kg.mark_answer(student_id, qid, covered, missing)

        if abs(themis_raw.get("score", 0) - themis_corr.get("score", 0)) > 2.0:
            print(f"[WARN] Large score difference for {student_id} {qid}: raw={themis_raw.get('score')}, corrected={themis_corr.get('score')}")

        results.append({
            "qid": qid,
            "question": question,
            "raw_answer": raw_answer,
            "corrected_answer": answer,
            "raw_score": themis_raw.get("score"),
            "corrected_score": themis_corr.get("score"),
            "themis_feedback": themis_corr.get("feedback"),
            "themis_strengths": themis_corr.get("strengths", []),
            "themis_weaknesses": themis_corr.get("weaknesses", []),
            "covered_concepts": covered,
            "missing_concepts": missing,
            "semantic_score": sem_result["final_score"] if sem_result else None
        })

    with open(os.path.join(output_dir, f"{student_id}_eval.json"), "w") as f:
        json.dump(results, f, indent=2)

    conn = mysql.connector.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, database=DB_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM students WHERE student_id = %s", (student_id,))
    row = cursor.fetchone()
    if row:
        student_db_id = row[0]
    else:
        cursor.execute("INSERT INTO students (student_id, name) VALUES (%s, %s)", (student_id, student_id))
        student_db_id = cursor.lastrowid

    for r in results:
        cursor.execute("""
            INSERT INTO evaluation_results
            (student_id, subject, question_id, raw_score, corrected_score,
             themis_feedback, themis_strengths, themis_weaknesses,
             covered_concepts, missing_concepts, semantic_score)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            student_db_id,
            subject,  
            r["qid"],
            r["raw_score"],
            r["corrected_score"],
            r["themis_feedback"],
            json.dumps(r["themis_strengths"]),
            json.dumps(r["themis_weaknesses"]),
            json.dumps(r["covered_concepts"]),
            json.dumps(r["missing_concepts"]),
            r["semantic_score"]
        ))

    conn.commit()
    cursor.close()
    conn.close()

    weak = kg.get_weak_concepts(student_id)
    topics = kg.recommend_topics(student_id)

    print(f"  Weak concepts: {weak}")
    print(f"  Topics to review: {topics}")

kg.close()
print("\nAll evaluations completed.")
