<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<br />
<div align="center">
  <a href="https://github.com/Binary1Brains/EvalBuddy">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">EvalBuddy</h3>

  <p align="center">
    An End-to-End Automated Grading and Knowledge Mapping System.
    <br />
    From Handwritten Ink to Actionable Pedagogical Insights.
    <br />
    <a href="https://github.com/Binary1Brains/EvalBuddy"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Binary1Brains/EvalBuddy">View Demo</a>
    &middot;
    <a href="https://github.com/Binary1Brains/EvalBuddy/issues">Report Bug</a>
    &middot;
    <a href="https://github.com/Binary1Brains/EvalBuddy/issues">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#key-features">Key Features</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

[![EvalBuddy Screen Shot][product-screenshot]](https://github.com/Binary1Brains/EvalBuddy)

EvalBuddy is designed to solve the "21st Century Grading Problem." While most assessment is digital, a vast amount of education still happens on paper. EvalBuddy bridges this gap by using a multi-stage AI pipeline to transcribe, evaluate, and map student knowledge.

### Key Features:
* **Handwriting to Text:** Fine-tuned `TrOCR` (Vision Transformer) handles complex student handwriting.
* **Intelligent Evaluation:** Uses the `Themis` LLM for qualitative grading and feedback.
* **Semantic Analysis:** Mathematical concept coverage checking via `Sentence-Transformers`.
* **Knowledge Mapping:** Results are stored in a `Neo4j` Graph Database to visualize learning gaps and recommend study topics.

### Built With

* [![Python][Python-badge]][Python-url]
* [![PyTorch][PyTorch-badge]][PyTorch-url]
* [![HuggingFace][HF-badge]][HF-url]
* [![Neo4j][Neo4j-badge]][Neo4j-url]
* [![OpenCV][OpenCV-badge]][OpenCV-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

To get EvalBuddy running locally, follow these steps.

### Prerequisites

* Python 3.11+
* Neo4j Database (Local or Aura)
* CUDA-capable GPU (Recommended for LLM inference)

### Installation

1. Clone the repo
   ```sh
   git clone [https://github.com/Binary1Brains/EvalBuddy.git](https://github.com/Binary1Brains/EvalBuddy.git)
Install dependencies

Bash
pip install torch transformers sentence-transformers neo4j opencv-python symspellpy
Set up your Neo4j credentials in run_evaluation.py

Python
kg = KnowledgeGraph("bolt://localhost:7687", "username", "password")
<p align="right">(<a href="#readme-top">back to top</a>)</p>

Usage
OCR Ingestion: Place student exam images in the input folder and run exam_ocr.py.

Evaluation: Run run_evaluation.py to trigger the Themis LLM and Semantic Engine.

Graph Insights: Open your Neo4j browser to view the generated :KNOWS and :WEAK_IN relationships.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

Roadmap
[x] Fine-tune TrOCR on IAM-line dataset

[x] Implement 4-bit Quantization for LLM Efficiency

[x] Neo4j Knowledge Graph Integration

[ ] Multi-language Handwriting Support

[ ] Real-time Teacher Dashboard UI

<p align="right">(<a href="#readme-top">back to top</a>)</p>

Contact
Bhishal Sikdar - LinkedIn
Parijat Dhar - LinkedIn
Soham Dutta - LinkedIn
Sumit Dey - LinkedIn

Project Link: https://github.com/Binary1Brains/EvalBuddy

<p align="right">(<a href="#readme-top">back to top</a>)</p>
