def parse_student_answers(text, question_bank):
    """
    Split student's text into answer blocks and align with question_bank.
    Returns list of dicts with keys: qid, question, answer, model_answer, concepts.
    """
    blocks = [block.strip() for block in text.split('\n\n') if block.strip()]
    answers = []
    for i, block in enumerate(blocks):
        if i < len(question_bank):
            q = question_bank[i]
            answers.append({
                "qid": q["id"],
                "question": q["question"],
                "answer": block,
                "model_answer": q.get("model_answer", ""),
                "concepts": q.get("concepts", [])
            })
    return answers
