import os
import json
from semantic_engine import SemanticEngine
from knowledge_graph import KnowledgeGraph
from themis_evaluator import ThemisEvaluator
from answer_parser import parse_student_answers

semantic = SemanticEngine()   # optional, used as fallback for concepts
kg = KnowledgeGraph("bolt://localhost:7687", "neo4j", "please_dont_check_diff")
themis = ThemisEvaluator(offload_layers=10)

with open("literature_questions.json", "r") as f:
    question_bank = json.load(f)
# After loading question_bank, pre-populate the knowledge graph
for q in question_bank:
    kg.create_question(q["id"], q.get("topic", "English Literature"))
    for concept in q["concepts"]:
        kg.create_concept(concept, q.get("topic", "English Literature"))
    kg.link_question_concepts(q["id"], q["concepts"])
# Directories
ocr_dir = "student_ocrs"        
output_dir = "evaluations"  
os.makedirs(output_dir, exist_ok=True)

for filename in os.listdir(ocr_dir):
    if not filename.endswith(".txt"):
        continue
    student_id = filename.replace(".txt", "")
    print(f"\nProcessing {student_id}...")

    with open(os.path.join(ocr_dir, filename), "r") as f:
        student_text = f.read()

    student_answers = parse_student_answers(student_text, question_bank)
    if not student_answers:
        print(f"  No answers parsed for {student_id}")
        continue
    kg.create_student(student_id, student_id)  # you can use a real name if available

    results = []
    for item in student_answers:
        qid = item["qid"]
        question = item["question"]
        answer = item["answer"]
        model_answer = item["model_answer"]
        concepts = item["concepts"]

        print(f"  Evaluating {qid}...")
        themis_result = themis.evaluate(
            question=question,
            student_answer=answer,
            model_answer=model_answer,
            concepts=concepts
        )
        sem_result = semantic.evaluate(model_answer, answer, concepts) if concepts else None
        covered = themis_result.get("covered_concepts", [])
        missing = themis_result.get("missing_concepts", [])
        if not covered and not missing and sem_result:
            covered = sem_result["covered"]
            missing = sem_result["missing"]

        kg.mark_answer(student_id, qid, covered, missing)
        results.append({
            "qid": qid,
            "question": question,
            "answer": answer,
            "themis_score": themis_result.get("score"),
            "themis_feedback": themis_result.get("feedback"),
            "themis_strengths": themis_result.get("strengths", []),
            "themis_weaknesses": themis_result.get("weaknesses", []),
            "covered_concepts": covered,
            "missing_concepts": missing,
            "semantic_score": sem_result["final_score"] if sem_result else None
        })

    with open(os.path.join(output_dir, f"{student_id}_eval.json"), "w") as f:
        json.dump(results, f, indent=2)

    weak = kg.get_weak_concepts(student_id)
    topics = kg.recommend_topics(student_id)
    print(f"  Weak concepts: {weak}")
    print(f"  Topics to review: {topics}")

kg.close()
print("\nAll evaluations completed.")
