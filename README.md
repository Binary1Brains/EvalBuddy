<a id="readme-top"></a>

[contributors-shield]: https://img.shields.io/github/contributors/Binary1Brains/EvalBuddy.svg?style=flat
[contributors-url]: https://github.com/Binary1Brains/EvalBuddy/graphs/contributors

[forks-shield]: https://img.shields.io/github/forks/Binary1Brains/EvalBuddy.svg?style=flat
[forks-url]: https://github.com/Binary1Brains/EvalBuddy/network/members

[stars-shield]: https://img.shields.io/github/stars/Binary1Brains/EvalBuddy.svg?style=flat
[stars-url]: https://github.com/Binary1Brains/EvalBuddy/stargazers

[issues-shield]: https://img.shields.io/github/issues/Binary1Brains/EvalBuddy.svg?style=flat
[issues-url]: https://github.com/Binary1Brains/EvalBuddy/issues

[license-shield]: https://img.shields.io/github/license/Binary1Brains/EvalBuddy.svg?style=flat
[license-url]: https://github.com/Binary1Brains/EvalBuddy/blob/master/LICENSE.txt

<br />
<div align="center">
  <a href="https://github.com/Binary1Brains/EvalBuddy">
    <img src="beauty/logo1.png" alt="Logo" width="190" height="190">
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

### System Workflow
| 📄 1. Login Interface | 🧠 2. Teacher Dashboard | 🕸️ 3. Knowledge Graph |
| :---: | :---: | :---: |
| [![Login Screenshot][log]](https://github.com/Binary1Brains/EvalBuddy) | [![Dashboard Screenshot][dash]](https://github.com/Binary1Brains/EvalBuddy) | [![Graph Screenshot][graph-screenshot]](https://github.com/Binary1Brains/EvalBuddy) |
| *Secure Access Layer* | *Dashboard* | *Neo4j Knowledge Mapping* |

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
* [![React][React-badge]][React-url]
* [![Vite][Vite-badge]][Vite-url]
* [![Tailwind][Tailwind-badge]][Tailwind-url]
* [![Neo4j][Neo4j-badge]][Neo4j-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

To get EvalBuddy running locally, follow these steps.

### Prerequisites

* Python 3.11+
* Neo4j Database (Local or Aura)
* CUDA-capable GPU (Recommended for LLM inference)

### Installation

(WE HEAVILY SUGGEST TO CREATE A PYTHON VENV)

1. Clone the repo
   ```sh
   git clone https://github.com/Binary1Brains/EvalBuddy.git
   cd EvalBuddy
2. Install dependencies
   ```Bash
   pip install -r requirements.txt
3. Set up your Neo4j credentials in run_evaluation.py

4. Python
kg = KnowledgeGraph("bolt://localhost:7687", "username", "password")
<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Usage
OCR Ingestion: Place student exam images in the input folder and run exam_ocr.py.

Evaluation: Run run_evaluation.py to trigger the Themis LLM and Semantic Engine.

Graph Insights: Open your Neo4j browser to view the generated :KNOWS and :WEAK_IN relationships.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Roadmap
[x] Fine-tune TrOCR on IAM-line dataset

[x] Implement 4-bit Quantization for LLM Efficiency

[x] Neo4j Knowledge Graph Integration

[x] Front End

[ ] Multi-language Handwriting Support

[ ] Multi subject support (LATEXOCR, FR-DETR)

[ ] Real-time Teacher Dashboard UI

[ ] Backend 

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Contact
| Name | LinkedIn |
| :--- | :--- |
| **Bhishal Sikdar** | [![LinkedIn][linkedin-badge]][bhishal-url] |
| **Parijat Dhar** | [![LinkedIn][linkedin-badge]][parijat-url] |
| **Soham Dutta** | [![LinkedIn][linkedin-badge]][soham-url] |
| **Sumit Dey** | [![LinkedIn][linkedin-badge]][sumit-url] |

Project Link: https://github.com/Binary1Brains/EvalBuddy
Youtube video: https://www.youtube.com/watch?v=TUpcQ1S0bWM

[Python-badge]: https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white
[Python-url]: https://www.python.org/

[PyTorch-badge]: https://img.shields.io/badge/PyTorch-EE4C2C?style=flat&logo=pytorch&logoColor=white
[PyTorch-url]: https://pytorch.org/

[HF-badge]: https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-FFD21E?style=flat&logoColor=black
[HF-url]: https://huggingface.co/

[Neo4j-badge]: https://img.shields.io/badge/Neo4j-008CC1?style=flat&logo=neo4j&logoColor=white
[Neo4j-url]: https://neo4j.com/

[OpenCV-badge]: https://img.shields.io/badge/OpenCV-5C3EE8?style=flat&logo=opencv&logoColor=white
[OpenCV-url]: https://opencv.org/

[React-badge]: https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black
[React-url]: https://reactjs.org/
[Vite-badge]: https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[Tailwind-badge]: https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[linkedin-badge]: https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white
[bhishal-url]: https://www.linkedin.com/in/bhishal-sikdar
[parijat-url]: https://www.linkedin.com/in/parijat-dhar-3b17a329a
[soham-url]: https://www.linkedin.com/in/soham-dutta-94630a29a
[sumit-url]: https://www.linkedin.com/in/sumit-dey-3686842a3
[log]: beauty/ui.jpeg
[dash]: beauty/ui1.jpeg
[graph-screenshot]: beauty/ui2.jpeg

<p align="right">(<a href="#readme-top">back to top</a>)</p>
