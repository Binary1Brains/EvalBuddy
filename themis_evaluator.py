import torch
import json
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig

class ThemisEvaluator:
    def __init__(self, model_name="PKU-ONELab/Themis", offload_layers=None):
        """
        offload_layers: if you need to free GPU memory, set e.g., offload_layers=10
        to offload first 10 layers to CPU. Otherwise None uses GPU only.
        """
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        # 4-bit quantization
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_use_double_quant=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.float16,
	    llm_int8_enable_fp32_cpu_offload=True
        )
        
        if offload_layers:
            device_map = {
                "model.embed_tokens": 0,
                **{f"model.layers.{i}": "cpu" for i in range(offload_layers)},
                **{f"model.layers.{i}": 0 for i in range(offload_layers, 32)},  # rest on GPU
                "model.norm": 0,
                "lm_head": 0
            }
        else:
            device_map = "auto"
        
        self.model = AutoModelForCausalLM.from_pretrained(
            model_name,
            quantization_config=bnb_config,
            device_map=device_map,
            trust_remote_code=True
        )
        self.tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token

    def evaluate(self, question, student_answer, model_answer=None, rubric=None, concepts=None):
        prompt = f"""You are an expert evaluator of student answers. Assess the answer based on correctness, completeness, and clarity.

Question: {question}
Student Answer: {student_answer}
"""
        if model_answer:
            prompt += f"Model Answer: {model_answer}\n"
        if rubric:
            prompt += f"Rubric: {rubric}\n"
        if concepts:
            prompt += f"Key concepts to cover: {', '.join(concepts)}\n"

        prompt += """
Provide your evaluation in JSON format with the following fields:
- score: a number from 0 to 10
- feedback: constructive comments
- strengths: list of strengths
- weaknesses: list of weaknesses
- covered_concepts: list of concepts from the key concepts that the student covered
- missing_concepts: list of concepts that were missing

JSON:"""

        inputs = self.tokenizer(prompt, return_tensors="pt", truncation=True, max_length=2048).to(self.device)
        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=512,
                temperature=0.2,
                do_sample=False,
                pad_token_id=self.tokenizer.pad_token_id,
                eos_token_id=self.tokenizer.eos_token_id
            )
        response = self.tokenizer.decode(outputs[0][inputs.input_ids.shape[1]:], skip_special_tokens=True)
        # Extract JSON
        try:
            start = response.find('{')
            end = response.rfind('}') + 1
            json_str = response[start:end]
            result = json.loads(json_str)
        except:
            result = {"raw": response, "error": "Could not parse JSON"}
        return result
