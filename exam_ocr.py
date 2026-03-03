#!/usr/bin/env python3.11
"""
Multi-page handwritten exam OCR pipeline with spell correction
Uses projection-based line segmentation + TrOCR (recognition) + SymSpell
Saves one text file per student
"""

import cv2
import numpy as np
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image
import torch
import os
from symspellpy import SymSpell

print("[INFO] Loading models...")

device = 'cuda' if torch.cuda.is_available() else 'cpu'
processor = TrOCRProcessor.from_pretrained("microsoft/trocr-small-handwritten")

# Load fine-tuned model weights
model = VisionEncoderDecoderModel.from_pretrained(
    "/home/parijat/machine_learning/CU/trocr-handwriting/checkpoint-12000",
    config="/home/parijat/machine_learning/CU/trocr-handwriting/checkpoint-12000/config.json"
).to(device)
model.eval()                                   # FIX: remove gradient checkpointing

# Spell correction
sym_spell = SymSpell(max_dictionary_edit_distance=2, prefix_length=7)
dictionary_path = "/home/parijat/machine_learning/CU/frequency_dictionary_en_82_765.txt"
if not sym_spell.load_dictionary(dictionary_path, term_index=0, count_index=1):
    print(f"[WARN] Could not load dictionary at {dictionary_path}")

# ======================== ADD: Line segmentation functions ========================
def preprocess_image(image_path, max_size=1600):
    """Grayscale, denoise, CLAHE enhance for OCR"""
    img = cv2.imread(image_path)
    h, w = img.shape[:2]
    if max(h, w) > max_size:
        scale = max_size / max(h, w)
        img = cv2.resize(img, (int(w*scale), int(h*scale)))

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
    gray = clahe.apply(gray)
    gray = cv2.fastNlMeansDenoising(gray, h=15)
    return gray

def segment_lines(image, min_gap_height=10, min_line_height=20):
    """
    image: grayscale numpy array
    returns list of (y0, y1) tuples for each detected line
    """
    # Binarize (inverse: text as white on black)
    _, binary = cv2.threshold(image, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    h, w = binary.shape

    # Horizontal projection: count ink pixels per row
    projection = np.sum(binary, axis=1) // 255   # 0–w

    # Threshold: rows with less than 5% ink are considered gaps
    gap_threshold = 0.05 * w
    gap_rows = projection < gap_threshold

    # Identify contiguous non-gap blocks (lines)
    lines = []
    in_line = False
    start = 0
    for i, is_gap in enumerate(gap_rows):
        if not in_line and not is_gap:
            in_line = True
            start = i
        elif in_line and is_gap:
            in_line = False
            end = i
            if end - start >= min_line_height:
                lines.append((start, end))
    if in_line:
        if h - start >= min_line_height:
            lines.append((start, h))

    return lines

def crop_image_slice(image, y0, y1, padding=5):
    """Crop horizontal slice of image with padding"""
    y0 = max(y0 - padding, 0)
    y1 = min(y1 + padding, image.shape[0])
    return image[y0:y1, :]

def recognize_image(image):
    """Recognize a cropped image using TrOCR + spell correction + beam search"""
    pil_img = Image.fromarray(image).convert("RGB")
    pixel_values = processor(pil_img, return_tensors="pt").pixel_values.to(device)
    with torch.no_grad():
        # ADD: beam search for better accuracy
        generated_ids = model.generate(
            pixel_values,
            max_new_tokens=256,
            num_beams=4,
            early_stopping=True,
            no_repeat_ngram_size=3
        )
    text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]

    # Spell correction
    suggestions = sym_spell.lookup_compound(text, max_edit_distance=2)
    if suggestions:
        text = suggestions[0].term
    return text

def slice_and_recognize(image, num_slices=15):
    """Fallback: split image into horizontal slices and OCR each"""
    h, w = image.shape[:2]
    slice_height = h // num_slices
    texts = []
    for i in range(num_slices):
        y0 = i * slice_height
        y1 = h if i == num_slices - 1 else (i + 1) * slice_height
        slice_img = crop_image_slice(image, y0, y1, padding=2)
        try:
            line_text = recognize_image(slice_img)
        except Exception as e:
            print(f"[WARN] Slice OCR failed: {e}")
            line_text = ""
        texts.append(line_text)
    return "\n".join(texts)

def process_page(image_path):
    """Process one image page and return recognized text"""
    preprocessed = preprocess_image(image_path)   # grayscale
    lines = segment_lines(preprocessed)

    if not lines:
        # Fallback: slice full page
        print(f"[INFO] No lines detected, using fallback slicing for {image_path}.")
        return slice_and_recognize(preprocessed, num_slices=20)

    page_text = ""
    for y0, y1 in lines:
        slice_img = crop_image_slice(preprocessed, y0, y1, padding=5)
        try:
            line_text = recognize_image(slice_img)
        except Exception as e:
            print(f"[WARN] Line recognition failed: {e}")
            line_text = ""
        page_text += line_text + "\n"
    return page_text

# ======================== Main function ========================
def main():
    output_dir = "student_ocrs"
    os.makedirs(output_dir, exist_ok=True)

    n_students = int(input("Enter number of students: "))
    for s in range(1, n_students + 1):
        student_name = input(f"\nStudent {s} name/ID: ").strip()
        n_pages = int(input(f"Number of pages for {student_name}: "))

        page_texts = []
        for p in range(1, n_pages + 1):
            image_path = input(f"Path to page {p} image: ").strip()
            if not os.path.exists(image_path):
                print(f"[ERROR] File not found: {image_path}")
                continue
            print(f"[INFO] Processing page {p}...")
            page_text = process_page(image_path)
            page_texts.append(page_text)

        final_text = "\n".join(page_texts)
        output_file = os.path.join(output_dir, f"{student_name.replace(' ','_')}.txt")
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(final_text)

        print(f"[SUCCESS] OCR done for {student_name}. Saved to {output_file}")

if __name__ == "__main__":
    main()
