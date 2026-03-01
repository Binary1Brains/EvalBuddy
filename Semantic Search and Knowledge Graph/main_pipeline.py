from semantic_engine import SemanticEngine
from knowledge_graph import KnowledgeGraph

engine = SemanticEngine()

kg = KnowledgeGraph("bolt://localhost:7687", "neo4j", "neo4j123")

student_id = "S1"
student_name = "Rahul"
question_id = "Q1"
topic = "Photosynthesis"

concepts = [
    "chlorophyll",
    "light reaction",
    "calvin cycle",
    "carbon fixation",
    "glucose synthesis"
]

model_answer = """
Photosynthesis converts light energy into chemical energy using chlorophyll.
Light reactions generate ATP and oxygen. The Calvin cycle fixes carbon dioxide
to synthesize glucose.
"""

student_answer = "Plants use sunlight to prepare food and release oxygen."

kg.create_student(student_id, student_name)
kg.create_question(question_id, topic)

for c in concepts:
    kg.create_concept(c, topic)

kg.link_question_concepts(question_id, concepts)

result = engine.evaluate(model_answer, student_answer, concepts)

kg.mark_answer(
    student_id,
    question_id,
    result["covered"],
    result["missing"]
)

print("Weak Concepts:", kg.get_weak_concepts(student_id))
print("Recommended Topics:", kg.recommend_topics(student_id))

kg.close()