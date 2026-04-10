import mysql.connector
import json

class KnowledgeGraph:
    def __init__(self, host, user, password, database):
        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database
        )
        self.cursor = self.conn.cursor(dictionary=True)

    def close(self):
        self.cursor.close()
        self.conn.close()

    def _get_student_internal_id(self, student_id):
        self.cursor.execute("SELECT id FROM students WHERE student_id = %s", (student_id,))
        row = self.cursor.fetchone()
        return row['id'] if row else None

    def _get_concept_internal_id(self, concept_name):
        self.cursor.execute("SELECT id FROM concept_nodes WHERE name = %s", (concept_name,))
        row = self.cursor.fetchone()
        return row['id'] if row else None

    def create_student(self, student_id, name):
        self.cursor.execute(
            "INSERT IGNORE INTO students (student_id, name) VALUES (%s, %s)",
            (student_id, name)
        )
        self.conn.commit()

    def create_concept(self, concept, topic):
        self.cursor.execute(
            "INSERT IGNORE INTO concept_nodes (name, topic) VALUES (%s, %s)",
            (concept, topic)
        )
        self.conn.commit()

    def create_question(self, qid, topic):
        pass

    def link_question_concepts(self, qid, concepts):
        pass

    def mark_answer(self, student_id, qid, covered, missing):
        sid = self._get_student_internal_id(student_id)
        if not sid:
            return
        for c in covered:
            cid = self._get_concept_internal_id(c)
            if cid:
                self.cursor.execute(
                    "INSERT IGNORE INTO student_concept (student_id, concept_id, relationship) VALUES (%s, %s, 'KNOWS')",
                    (sid, cid)
                )
        for c in missing:
            cid = self._get_concept_internal_id(c)
            if cid:
                self.cursor.execute(
                    "INSERT IGNORE INTO student_concept (student_id, concept_id, relationship) VALUES (%s, %s, 'WEAK_IN')",
                    (sid, cid)
                )
        self.conn.commit()

    def get_weak_concepts(self, student_id):
        sid = self._get_student_internal_id(student_id)
        if not sid:
            return []
        self.cursor.execute("""
            SELECT c.name
            FROM student_concept sc
            JOIN concept_nodes c ON sc.concept_id = c.id
            WHERE sc.student_id = %s AND sc.relationship = 'WEAK_IN'
        """, (sid,))
        return [row['name'] for row in self.cursor.fetchall()]

    def recommend_topics(self, student_id):
        sid = self._get_student_internal_id(student_id)
        if not sid:
            return []
        self.cursor.execute("""
            SELECT DISTINCT c.topic
            FROM student_concept sc
            JOIN concept_nodes c ON sc.concept_id = c.id
            WHERE sc.student_id = %s AND sc.relationship = 'WEAK_IN'
        """, (sid,))
        return [row['topic'] for row in self.cursor.fetchall()]
