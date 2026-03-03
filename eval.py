import torch
import evaluate
from transformers import VisionEncoderDecoderModel, TrOCRProcessor
from datasets import load_dataset

device = "cuda" if torch.cuda.is_available() else "cpu"

model = VisionEncoderDecoderModel.from_pretrained(
    "/home/parijat/machine_learning/CU/trocr-handwriting/checkpoint-12000"
).to(device)

processor = TrOCRProcessor.from_pretrained(
    "microsoft/trocr-small-handwritten"
)

model.eval()

dataset = load_dataset("Teklia/IAM-line", split="validation")

cer_metric = evaluate.load("cer")

predictions = []
references = []

for sample in dataset:
    image = sample["image"].convert("RGB")
    pixel_values = processor(image, return_tensors="pt").pixel_values.to(device)

    with torch.no_grad():
        generated_ids = model.generate(pixel_values, max_length=128, num_beams=4)

    pred_text = processor.batch_decode(
        generated_ids, skip_special_tokens=True
    )[0]

    predictions.append(pred_text)
    references.append(sample["text"])

cer = cer_metric.compute(predictions=predictions, references=references)

print("CER:", cer)
