from semantic_engine import SemanticEngine

engine = SemanticEngine()

model_answer = """
Photosynthesis converts light energy into chemical energy using chlorophyll,
carbon dioxide and water, producing glucose and oxygen.
"""

student_answer = """
Plants use sunlight to prepare food and release oxygen.
"""

concepts = [
    "chlorophyll",
    "light reaction",
    "calvin cycle",
    "carbon fixation",
    "glucose synthesis"
]

result = engine.evaluate(model_answer, student_answer, concepts)

print(result)