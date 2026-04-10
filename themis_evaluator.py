import torch
import json
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig

class ThemisEvaluator:
    def __init__(self, model_name="PKU-ONELab/Themis", use_4bit=True, offload_layers=None):
        """
        Args:
            model_name (str): Hugging Face model name.
            use_4bit (bool): If True, load model in 4-bit quantization (requires bitsandbytes).
            offload_layers (int or None): If an integer, the first `offload_layers` layers
                                           are placed on CPU, the rest on GPU. If None,
                                           the device map is "auto". Only used with 4‑bit.
        """
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

        if use_4bit and self.device == "cuda":
            bnb_config = BitsAndBytesConfig(
                load_in_4bit=True,
                bnb_4bit_use_double_quant=True,
                bnb_4bit_quant_type="nf4",
                bnb_4bit_compute_dtype=torch.float16,
                llm_int8_enable_fp32_cpu_offload=True   # enable CPU offloading
            )
            torch_dtype = torch.float16
            print("[Themis] Loading 4‑bit quantized model with CPU offloading.")
        else:
            bnb_config = None
            torch_dtype = torch.float32
            print("[Themis] Loading full model on CPU (may be slow).")

        if offload_layers is not None and use_4bit and self.device == "cuda":
            total_layers = 32
            device_map = {
                "model.embed_tokens": 0,
                **{f"model.layers.{i}": "cpu" for i in range(offload_layers)},
                **{f"model.layers.{i}": 0 for i in range(offload_layers, total_layers)},
                "model.norm": 0,
                "lm_head": 0
            }
            print(f"[Themis] Using custom device map with {offload_layers} layers on CPU.")
        else:
            device_map = "auto" if use_4bit and self.device == "cuda" else "cpu"

        self.tokenizer = AutoTokenizer.from_pretrained(
            model_name,
            trust_remote_code=True
        )
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token

        self.model = AutoModelForCausalLM.from_pretrained(
            model_name,
            quantization_config=bnb_config,
            device_map=device_map,
            torch_dtype=torch_dtype,
            trust_remote_code=True
        )
        self.model.eval()

    def _generate(self, prompt: str, max_new_tokens: int = 512) -> str:
        inputs = self.tokenizer(
            prompt,
            return_tensors="pt",
            truncation=True,
            max_length=2048,
        ).to(self.device if self.device == "cuda" else "cpu")

        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=max_new_tokens,
                do_sample=False,
                pad_token_id=self.tokenizer.pad_token_id,
                eos_token_id=self.tokenizer.eos_token_id,
            )

        return self.tokenizer.decode(
            outputs[0][inputs.input_ids.shape[1]:],
            skip_special_tokens=True,
        )

    def correct_ocr(self, text: str, context: str = "") -> str:
        subject_hint = f" Subject: {context}." if context else ""

        prompt = (
            f"Fix OCR errors only. Do not rephrase.{subject_hint}\n"
            f"Text: {text}\n"
            "Corrected:"
        )

        response = self._generate(prompt, max_new_tokens=256).strip()

        if not response or len(response) < len(text) // 3:
            return text

        if response.lower().startswith("corrected text:"):
            response = response[len("corrected text:"):].strip()

        return response

    def evaluate(self, question, student_answer, model_answer=None,
                 rubric=None, concepts=None):

        prompt = (
            "You are an expert evaluator of student answers."
            " Assess the answer based on correctness, completeness, and clarity.\n\n"
            f"Question: {question}\n"
            f"Student Answer: {student_answer}\n"
        )

        if model_answer:
            prompt += f"Model Answer: {model_answer}\n"

        if rubric:
            prompt += f"Rubric: {rubric}\n"

        if concepts:
            prompt += f"Key concepts to cover: {', '.join(concepts)}\n"

        prompt += (
            "\nProvide your evaluation in JSON format with the following fields:\n"
            "- score: a number from 0 to 10\n"
            "- feedback: constructive comments\n"
            "- strengths: list of strengths\n"
            "- weaknesses: list of weaknesses\n"
            "- covered_concepts: list of concepts the student covered\n"
            "- missing_concepts: list of concepts that were missing\n\n"
            "JSON:"
        )

        response = self._generate(prompt, max_new_tokens=512)

        try:
            start = response.find("{")
            end = response.rfind("}") + 1
            json_str = response[start:end]
            result = json.loads(json_str)
        except Exception:
            result = {"raw": response, "error": "Could not parse JSON"}

        return result
