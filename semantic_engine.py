from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)
from nltk.tokenize import sent_tokenize

class SemanticEngine:
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

    def similarity(self, model_answer, student_answer):
        e1 = self.model.encode([model_answer])
        e2 = self.model.encode([student_answer])
        return round(float(cosine_similarity(e1, e2)[0][0]), 3)

    def concept_coverage(self, concepts, student_answer, threshold=0.6):
        chunks = sent_tokenize(student_answer)
        chunk_vecs = self.model.encode(chunks)
        concept_vecs = self.model.encode(concepts)

        covered, missing = [], []

        for i, c in enumerate(concepts):
            sim = max(cosine_similarity([concept_vecs[i]], chunk_vecs)[0])
            if sim >= threshold:
                covered.append(c)
            else:
                missing.append(c)

        coverage = round(len(covered) / len(concepts) * 100, 2)

        return coverage, covered, missing

    def evaluate(self, model_answer, student_answer, concepts):
        sim = self.similarity(model_answer, student_answer)
        cov, covered, missing = self.concept_coverage(concepts, student_answer)
        final = round(sim * 0.6 + (cov / 100) * 0.4, 3)

        return {
            "semantic_score": sim,
            "concept_coverage": cov,
            "covered": covered,
            "missing": missing,
            "final_score": final
        }