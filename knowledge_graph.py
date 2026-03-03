from neo4j import GraphDatabase

class KnowledgeGraph:

    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def create_student(self, student_id, name):
        query = """
        MERGE (s:Student {id:$id})
        SET s.name = $name
        """
        with self.driver.session() as session:
            session.run(query, id=student_id, name=name)

    def create_concept(self, concept, topic):
        query = """
        MERGE (c:Concept {name:$name})
        SET c.topic = $topic
        """
        with self.driver.session() as session:
            session.run(query, name=concept, topic=topic)

    def create_question(self, qid, topic):
        query = """
        MERGE (q:Question {id:$id})
        SET q.topic = $topic
        """
        with self.driver.session() as session:
            session.run(query, id=qid, topic=topic)

    def link_question_concepts(self, qid, concepts):
        query = """
        MATCH (q:Question {id:$qid})
        MATCH (c:Concept {name:$concept})
        MERGE (q)-[:HAS_CONCEPT]->(c)
        """
        with self.driver.session() as session:
            for c in concepts:
                session.run(query, qid=qid, concept=c)

    def mark_answer(self, student_id, qid, covered, missing):
        with self.driver.session() as session:

            session.run("""
            MATCH (s:Student {id:$sid}), (q:Question {id:$qid})
            MERGE (s)-[:ANSWERED]->(q)
            """, sid=student_id, qid=qid)

            for c in covered:
                session.run("""
                MATCH (s:Student {id:$sid}), (c:Concept {name:$c})
                MERGE (s)-[:KNOWS]->(c)
                """, sid=student_id, c=c)

            for c in missing:
                session.run("""
                MATCH (s:Student {id:$sid}), (c:Concept {name:$c})
                MERGE (s)-[:WEAK_IN]->(c)
                """, sid=student_id, c=c)

    def get_weak_concepts(self, student_id):
        query = """
        MATCH (s:Student {id:$sid})-[:WEAK_IN]->(c:Concept)
        RETURN c.name AS weak
        """
        with self.driver.session() as session:
            return [r["weak"] for r in session.run(query, sid=student_id)]

    def recommend_topics(self, student_id):
        query = """
        MATCH (s:Student {id:$sid})-[:WEAK_IN]->(c:Concept)
        RETURN DISTINCT c.topic AS topic
        """
        with self.driver.session() as session:
            return [r["topic"] for r in session.run(query, sid=student_id)]        
        
          