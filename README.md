# EvalBuddy  
### Intelligent Descriptive Answer Evaluation & Suggestion Platform

EvalBuddy is an AI-powered system that evaluates descriptive answers using semantic understanding, concept coverage detection, OCR-based answer extraction, and knowledge graph-driven learning analytics.

This platform moves beyond keyword matching and enables meaning-level evaluation, structured feedback, and personalized study recommendations.

---

## Problem Statement

Traditional evaluation systems rely on keyword matching and surface-level scoring.  
They fail to:

- Understand semantic meaning  
- Detect missing concepts  
- Provide structured feedback  
- Track topic-wise mastery  

EvalBuddy addresses these challenges using Natural Language Processing, Transformer models, and Knowledge Graphs.

---

## Core Features

### Semantic Answer Evaluation
- Converts model and student answers into embeddings
- Uses cosine similarity to measure semantic closeness
- Evaluates understanding even with different wording

### Concept Coverage Detection
- Detects presence of predefined key concepts
- Identifies covered and missing topics
- Enables structured scoring

### OCR-Based Answer Extraction
- Reads handwritten or scanned answer sheets
- Uses Transformer-based OCR model (TrOCR)
- Converts images to clean text for evaluation

### Knowledge Graph Tracking
- Stores student-topic relationships
- Tracks mastery levels
- Identifies weak concepts
- Enables intelligent study recommendations

---

## System Architecture
Student Input (Text or Image)
↓
OCR Engine (if image input)
↓
Answer Parser
↓
Semantic Engine
↓
Concept Coverage Detector
↓
Knowledge Graph Update
↓
Final Evaluation & Feedback

---

## Repository Structure

semantic_engine.py → Semantic similarity and concept detection
knowledge_graph.py → Neo4j-based learning graph logic
exam_ocr.py → OCR for scanned/handwritten answers
answer_parser.py → Answer preprocessing and parsing
eval.py / run_evaluation.py → Evaluation orchestration
themis_evaluator.py → Custom scoring logic
literature_questions.json → Sample dataset
pretraining.py → Data preparation/training logic
trocr-handwriting/ → OCR model checkpoint
requirements.txt → Project dependencies

---

## Technologies Used

- Python
- Sentence Transformers
- HuggingFace Transformers
- TrOCR (OCR model)
- Neo4j (Knowledge Graph)
- NLTK
- Cosine Similarity
- JSON-based datasets

---

## Evaluation Metrics

- Semantic Similarity Score
- Concept Coverage Percentage
- Missing Concept Detection
- Final Composite Score
- Learning Progress Tracking

---

## How It Works

### Step 1: Semantic Embedding
Model and student answers are converted into dense vector representations using a transformer model.

### Step 2: Similarity Computation
Cosine similarity is calculated to measure conceptual alignment.

### Step 3: Concept Detection
The system checks whether required key concepts are present in the student response.

### Step 4: Knowledge Graph Update
Student-topic mastery relationships are updated in Neo4j.

---

## Installation

### Clone Repository
git clone https://github.com/Binary1Brains/EvalBuddy.git
cd EvalBuddy

### Install Dependencies
pip install -r requirements.txt

### Setup Neo4j
- Install Neo4j Desktop
- Create a local database
- Update connection credentials in knowledge_graph.py

### Run Evaluation
python run_evaluation.py
