
#!/usr/bin/env python3.11
"""
Unified OCR pipeline with YOLO layout detection, line‑level TrOCR,
Pix2Text math, PaddleOCR fallback, and SymSpell correction only.
No Themis (to avoid OOM and complexity).

Handles:
  - Math (class 5/6) → Pix2Text → LaTeX
  - Text (classes 0‑3, 9) → TrOCR + Paddle fallback + SymSpell
  - Flowcharts (class 6) → external tool (MayogaDev/FlowChart-Recognition)
"""

import os
import cv2
import torch
import numpy as np
from PIL import Image
import string
import json
import subprocess
import uuid
import csv
import re
import shutil
from datetime import datetime

from ultralytics import YOLO
from paddleocr import PaddleOCR
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from pix2text import Pix2Text
from symspellpy import SymSpell
import nltk

LAYOUT_MODEL_PATH     = "models/layout.pt"
FLOWCHART_PYTHON      = "/home/parijat/flowchart_env/bin/python"
FLOWCHART_SCRIPT      = "/home/parijat/machine_learning/CU_test/FlowChart-Recognition/flowchart_recognition.py"
TROCR_CHECKPOINT      = "/home/parijat/machine_learning/CU_test/trocr-handwriting/checkpoint-12000"
SYMSPELL_DICT         = "/home/parijat/machine_learning/CU_test/frequency_dictionary_en_82_765.txt"

flowchart_model = None  

try:
    nltk.data.find("corpora/words.zip")
except LookupError:
    nltk.download("words")
from nltk.corpus import words as nltk_words
english_words = set(nltk_words.words())

sym_spell = SymSpell(max_dictionary_edit_distance=2, prefix_length=7)
if not sym_spell.load_dictionary(SYMSPELL_DICT, term_index=0, count_index=1):
    print(f"[WARN] SymSpell dictionary not found at {SYMSPELL_DICT}")

def correct_text(raw_text, context="", student_id="", page_num=0, line_num=0):
    suggestions = sym_spell.lookup_compound(raw_text, max_edit_distance=2)
    return suggestions[0].term if suggestions else raw_text


print("[INFO] Loading YOLO layout model …")
layout_model = YOLO(LAYOUT_MODEL_PATH)

print("[INFO] Loading PaddleOCR …")
paddle = PaddleOCR(use_angle_cls=True, lang="en")

print("[INFO] Loading TrOCR …")
device = "cuda" if torch.cuda.is_available() else "cpu"
processor = TrOCRProcessor.from_pretrained("microsoft/trocr-small-handwritten")
trocr_model = VisionEncoderDecoderModel.from_pretrained(
    TROCR_CHECKPOINT,
    config=f"{TROCR_CHECKPOINT}/config.json",
).to(device)
if device == "cuda":
    trocr_model = trocr_model.half()
trocr_model.eval()

print("[INFO] Loading Pix2Text …")
p2t = Pix2Text(device="cpu", rec_model_backend="torch")
torch.set_grad_enabled(False)

def resize_if_needed(img, max_dim=1600):
    h, w = img.shape[:2]
    if max(h, w) > max_dim:
        scale = max_dim / max(h, w)
        img = cv2.resize(img, (int(w*scale), int(h*scale)))
    return img

def trocr_read(crop):
    rgb = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(rgb)
    pixel_values = processor(images=pil_img, return_tensors="pt").pixel_values.to(device)
    if device == "cuda":
        pixel_values = pixel_values.half()
    with torch.no_grad():
        generated_ids = trocr_model.generate(
            pixel_values,
            max_new_tokens=256,
            num_beams=4,
            early_stopping=True,
            no_repeat_ngram_size=3,
        )
    return processor.batch_decode(generated_ids, skip_special_tokens=True)[0]

def paddle_read(crop):
    result = paddle.ocr(crop, cls=True)
    lines = []
    if result is None:
        return ""
    for r in result:
        if r is None:
            continue
        for item in r:
            if isinstance(item, (list, tuple)) and len(item) >= 2:
                text_part = item[1]
                if isinstance(text_part, (list, tuple)) and len(text_part) >= 1:
                    lines.append(str(text_part[0]))
                else:
                    lines.append(str(text_part))
            else:
                lines.append(str(item))
    return "\n".join(lines)

def math_read(crop):
    rgb = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
    h, w = rgb.shape[:2]
    if max(h, w) < 300:
        scale = 2.0
        new_w, new_h = int(w * scale), int(h * scale)
        rgb = cv2.resize(rgb, (new_w, new_h), interpolation=cv2.INTER_CUBIC)

    temp_path = f"/tmp/math_{uuid.uuid4()}.png"
    cv2.imwrite(temp_path, rgb)

    try:
        result = p2t.recognize(temp_path)
        if isinstance(result, str):
            text = result.strip()
        elif isinstance(result, dict):
            text = result.get("text", "").strip()
        elif isinstance(result, list) and result:
            parts = []
            for r in result:
                if isinstance(r, dict):
                    parts.append(r.get("text", ""))
                else:
                    parts.append(str(r))
            text = " ".join(parts).strip()
        else:
            text = ""
        text = re.sub(r'\blambda\b', r'\\lambda', text)
        text = re.sub(r'->', r'\\to', text)
        print(f"[MATH_READ] Raw result from Pix2Text: {result}")
        print(f"[MATH_READ] Extracted text: '{text}'")
        return text
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

def process_flowchart_external(crop):
    temp_img = f"/tmp/flowchart_{uuid.uuid4()}.png"
    cv2.imwrite(temp_img, cv2.cvtColor(crop, cv2.COLOR_BGR2RGB))

    temp_dir = f"/tmp/flowchart_out_{uuid.uuid4()}"
    os.makedirs(temp_dir, exist_ok=True)

    try:
        subprocess.run(
            [FLOWCHART_PYTHON, FLOWCHART_SCRIPT, "-f", temp_img, "-p", "30", "-a", "35"],
            cwd=temp_dir,
            capture_output=True,
            text=True,
            timeout=30,
            check=True,
        )

        json_path = os.path.join(temp_dir, "data.json")
        with open(json_path, "r") as f:
            data = json.load(f)

        nodes = {}
        connections = []
        for node in data.get("Node", []):
            node_id = node.get("Id")
            nodes[node_id] = {
                "text": node.get("Name", ""),
                "shape": node.get("Shape", ""),
                "position": node.get("Position", ""),
            }
            if node.get("Line"):
                connections.append({"from": node_id, "to": node.get("Line")})

        description = []
        for node_id, info in nodes.items():
            description.append(f"Node {node_id}: {info['text']} ({info['shape']})")
        for conn in connections:
            description.append(f"Connection: {conn['from']} → {conn['to']}")

        return "\n".join(description) if description else "[FLOWCHART] empty"

    except subprocess.TimeoutExpired:
        return "[FLOWCHART] timeout"
    except subprocess.CalledProcessError as e:
        return "[FLOWCHART] tool error"
    except Exception as e:
        return "[FLOWCHART] processing error"
    finally:
        if os.path.exists(temp_img):
            os.remove(temp_img)
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)


def detect_layout(img):
    results = layout_model(img)[0]
    boxes = results.boxes.xyxy.cpu().numpy()
    classes = results.boxes.cls.cpu().numpy().astype(int)
    return [(tuple(map(int, b)), cls) for b, cls in zip(boxes, classes)]

def segment_lines(image, min_line_height=20):
    _, binary = cv2.threshold(image, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    h, w = binary.shape
    projection = np.sum(binary, axis=1) // 255
    gap_threshold = 0.05 * w
    gap_rows = projection < gap_threshold
    lines = []
    in_line, start = False, 0
    for i, is_gap in enumerate(gap_rows):
        if not in_line and not is_gap:
            in_line, start = True, i
        elif in_line and is_gap:
            in_line = False
            if i - start >= min_line_height:
                lines.append((start, i))
    if in_line and h - start >= min_line_height:
        lines.append((start, h))
    return lines

def crop_image_slice(image, y0, y1, padding=5):
    return image[max(y0-padding, 0): min(y1+padding, image.shape[0]), :]

def looks_like_math(text):
    math_tokens = [
        "\\", "^", "_", "=", "+", "-", "*", "/",
        "sum", "lim", "frac", "int", "sqrt",
        "alpha", "beta", "lambda", "theta"
    ]
    for token in math_tokens:
        if token in text:
            return True
    digit_ratio = sum(c.isdigit() for c in text) / max(len(text), 1)
    return digit_ratio > 0.25

def process_region(img, box, cls, context="", student_id="", page_num=0, region_idx=0):
    x1, y1, x2, y2 = box
    crop = img[y1:y2, x1:x2]
    h, w = crop.shape[:2]
    print(f"[DEBUG] Region {region_idx}: class={cls}, size={w}x{h}, aspect={w/h:.2f}")

    if cls == 5:
        raw_text = math_read(crop)
        return raw_text, raw_text

    if cls == 6:
        cv2.imwrite("/tmp/flowchart_crop.png", crop)
        print(f"[DEBUG] Crop saved to /tmp/flowchart_crop.png, exists: {os.path.exists('/tmp/flowchart_crop.png')}, shape: {crop.shape}")

        flowchart_text = process_flowchart_external(crop)
        if flowchart_text and not flowchart_text.startswith("[FLOWCHART]") and len(flowchart_text) > 10:
            print(f"[INFO] Region {region_idx} processed as flowchart.")
            return flowchart_text, flowchart_text
        print(f"[INFO] Region {region_idx} processed as math.")
        raw_text = math_read(crop)
        return raw_text, raw_text

    if cls == 4:
        if flowchart_model is not None:
            elements = detect_flowchart_elements(crop)
            if elements:
                raw_lines, corr_lines = [], []
                for (fx1, fy1, fx2, fy2), fcls in elements:
                    shape_crop = crop[fy1:fy2, fx1:fx2]
                    raw_shape = trocr_read(shape_crop)
                    if len(raw_shape.strip()) < 3:
                        raw_shape = paddle_read(shape_crop)
                    corr_shape = correct_text(raw_shape, context, student_id, page_num, f"flow_{region_idx}_{fcls}")
                    raw_lines.append(f"Shape {fcls}: {raw_shape}")
                    corr_lines.append(f"Shape {fcls}: {corr_shape}")
                return "\n".join(raw_lines), "\n".join(corr_lines)
        raw_text = process_flowchart_external(crop)
        return raw_text, raw_text

    if cls in [0, 1, 2, 3]:
        gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
        lines = segment_lines(gray)
        if lines:
            raw_lines, corr_lines = [], []
            for line_idx, (y0, y1) in enumerate(lines):
                line_img = crop_image_slice(gray, y0, y1, padding=5)
                line_bgr = cv2.cvtColor(line_img, cv2.COLOR_GRAY2BGR)
                raw_line = trocr_read(line_bgr)
                if len(raw_line.strip()) < 3:
                    raw_line = paddle_read(line_bgr)
                corr_line = correct_text(raw_line, context, student_id, page_num, f"{region_idx}_{line_idx+1}")
                raw_lines.append(raw_line)
                corr_lines.append(corr_line)
            return "\n".join(raw_lines), "\n".join(corr_lines)
        else:
            raw_text = trocr_read(crop)
            if len(raw_text.strip()) < 3:
                raw_text = paddle_read(crop)
            return raw_text, correct_text(raw_text, context, student_id, page_num, region_idx)

    gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
    lines = segment_lines(gray)
    if lines:
        raw_lines, corr_lines = [], []
        for line_idx, (y0, y1) in enumerate(lines):
            line_img = crop_image_slice(gray, y0, y1, padding=5)
            line_bgr = cv2.cvtColor(line_img, cv2.COLOR_GRAY2BGR)
            raw_line = trocr_read(line_bgr)
            if len(raw_line.strip()) < 3:
                raw_line = paddle_read(line_bgr)
            corr_line = correct_text(raw_line, context, student_id, page_num, f"{region_idx}_{line_idx+1}")
            raw_lines.append(raw_line)
            corr_lines.append(corr_line)
        return "\n".join(raw_lines), "\n".join(corr_lines)
    else:
        if w * h > 100000:
            flowchart_text = process_flowchart_external(crop)
            if flowchart_text and not flowchart_text.startswith("[FLOWCHART]") and len(flowchart_text) > 10:
                print(f"[INFO] Region {region_idx} treated as flowchart (large region).")
                return flowchart_text, flowchart_text
        raw_text = trocr_read(crop)
        if len(raw_text.strip()) < 3:
            raw_text = paddle_read(crop)
        return raw_text, correct_text(raw_text, context, student_id, page_num, region_idx)

def preprocess_image(image_path, max_size=1600):
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

def fallback_text_ocr(image_path, context="", student_id="", page_num=0):
    preprocessed = preprocess_image(image_path)
    lines = segment_lines(preprocessed)
    raw_lines, corr_lines = [], []
    if not lines:
        h = preprocessed.shape[0]
        num_slices = 20
        slice_height = h // num_slices
        for i in range(num_slices):
            y0 = i * slice_height
            y1 = h if i == num_slices-1 else (i+1)*slice_height
            slice_img = crop_image_slice(preprocessed, y0, y1, padding=2)
            raw = trocr_read(cv2.cvtColor(slice_img, cv2.COLOR_GRAY2BGR))
            corr = correct_text(raw, context, student_id, page_num, i+1)
            raw_lines.append(raw)
            corr_lines.append(corr)
    else:
        for idx, (y0, y1) in enumerate(lines):
            slice_img = crop_image_slice(preprocessed, y0, y1, padding=5)
            slice_bgr = cv2.cvtColor(slice_img, cv2.COLOR_GRAY2BGR)
            raw = trocr_read(slice_bgr)
            corr = correct_text(raw, context, student_id, page_num, idx+1)
            raw_lines.append(raw)
            corr_lines.append(corr)
    return "\n".join(raw_lines), "\n".join(corr_lines)

def process_page(image_path, context="", student_id="", page_num=0):
    img = cv2.imread(image_path)
    if img is None:
        return "", ""
    img = resize_if_needed(img)

    layout_regions = detect_layout(img)
    if not layout_regions:
        return fallback_text_ocr(image_path, context, student_id, page_num)

    layout_regions = sorted(layout_regions, key=lambda r: (r[0][1], r[0][0]))
    raw_lines, corr_lines = [], []

    for idx, (box, cls) in enumerate(layout_regions):
        raw, corr = process_region(img, box, cls, context, student_id, page_num, idx+1)
        raw_lines.append(raw)
        corr_lines.append(corr)

    if len(raw_lines) < 3:
        if any(cls in [5, 6] for _, cls in layout_regions):
            return "\n".join(raw_lines), "\n".join(corr_lines)
        raw_fb, corr_fb = fallback_text_ocr(image_path, context, student_id, page_num)
        if raw_fb.count("\n") + 1 > len(raw_lines):
            return raw_fb, corr_fb

    return "\n".join(raw_lines), "\n".join(corr_lines)

def main():
    output_dir = "student_ocrs"
    os.makedirs(output_dir, exist_ok=True)

    n_students = int(input("Enter number of students: "))
    for s in range(1, n_students + 1):
        name = input(f"\nStudent {s} name/ID: ").strip()
        subject = input(f"Subject for {name} (or leave blank): ").strip()
        pages = int(input(f"Number of pages for {name}: "))

        raw_all, corr_all = [], []
        for p in range(1, pages + 1):
            path = input(f"Path to page {p} image: ").strip()
            if not os.path.exists(path):
                print(f"[ERROR] File not found: {path}")
                continue
            print(f"[INFO] Processing page {p}…")
            raw_page, corr_page = process_page(path, context=subject, student_id=name, page_num=p)
            raw_all.append(raw_page)
            corr_all.append(corr_page)

        safe_name = name.replace(" ", "_")
        raw_file = os.path.join(output_dir, f"{safe_name}_raw.txt")
        corr_file = os.path.join(output_dir, f"{safe_name}_corrected.txt")

        with open(raw_file, "w", encoding="utf-8") as f:
            f.write("\n".join(raw_all))
        with open(corr_file, "w", encoding="utf-8") as f:
            f.write("\n".join(corr_all))

        print(f"[SUCCESS] OCR done for {name}.")
        print(f"[DEBUG] Wrote raw file: {raw_file}, first line: {raw_all[0][:100]}")

if __name__ == "__main__":
    main()
