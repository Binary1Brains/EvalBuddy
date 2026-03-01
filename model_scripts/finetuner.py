
import torch
from PIL import ImageOps
from datasets import load_dataset
from transformers import (
    VisionEncoderDecoderModel,
    TrOCRProcessor,
    Seq2SeqTrainer,
    Seq2SeqTrainingArguments
)
from torchvision import transforms
import evaluate              
import numpy as np

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"[INFO] Using device: {device}")
dataset = load_dataset("Teklia/IAM-line")
print(dataset)
print("Train size:", len(dataset["train"]))
print("Validation size:", len(dataset["validation"]))
print("Test size:", len(dataset["test"]))
train_dataset = list(dataset["train"])
val_dataset = list(dataset["validation"])

processor = TrOCRProcessor.from_pretrained("microsoft/trocr-small-handwritten")
model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-small-handwritten")
model.to(device)
model.gradient_checkpointing_enable()

model.config.decoder_start_token_id = processor.tokenizer.cls_token_id
model.config.pad_token_id = processor.tokenizer.pad_token_id
model.config.eos_token_id = processor.tokenizer.sep_token_id
model.config.vocab_size = model.config.decoder.vocab_size
transform = transforms.Compose([
    transforms.Lambda(lambda img: img.convert("RGB")),
    transforms.RandomRotation(degrees=2),
    transforms.GaussianBlur(kernel_size=(3,3), sigma=(0.1, 1.0)),
])

def collate_fn(batch):
    images = [transform(item["image"]) for item in batch]
    texts = [item["text"] for item in batch]

    pixel_values = processor(images=images, return_tensors="pt").pixel_values

    labels = processor.tokenizer(
        texts,
        padding="longest",
        truncation=True,
        max_length=256,
        return_tensors="pt"
    ).input_ids

    labels[labels == processor.tokenizer.pad_token_id] = -100

    return {
        "pixel_values": pixel_values,
        "labels": labels,
    }

cer_metric = evaluate.load("cer")
def compute_metrics(eval_pred):
    predictions, labels = eval_pred
    labels = np.where(labels != -100, labels, processor.tokenizer.pad_token_id)
    pred_str = processor.tokenizer.batch_decode(predictions, skip_special_tokens=True)
    label_str = processor.tokenizer.batch_decode(labels, skip_special_tokens=True)
    
    cer = cer_metric.compute(predictions=pred_str, references=label_str)
    return {"cer": cer}

training_args = Seq2SeqTrainingArguments(
    output_dir="./trocr-handwriting",
    per_device_train_batch_size=2, # increase if you have a chonky pc 
    per_device_eval_batch_size=2, # check previous comment (by chonky i mean powerfull)
    gradient_accumulation_steps=4, # Fire hazard
    predict_with_generate=True,
    evaluation_strategy="steps",
    eval_steps=250, # same as above
    save_steps=500,
    logging_steps=100,
    num_train_epochs=15,
    fp16=True,
    save_total_limit=2,
    dataloader_num_workers=2, # look above
    remove_unused_columns=False,
    learning_rate=2e-5, # Checking my code so diligently
    warmup_steps=500, # Fan of Tsoding ?
    lr_scheduler_type="linear",
    load_best_model_at_end=True,      
    metric_for_best_model="cer",        
    greater_is_better=False,            
)

trainer = Seq2SeqTrainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    data_collator=collate_fn,
    compute_metrics=compute_metrics,
    tokenizer=processor.tokenizer,
)

trainer.train()
