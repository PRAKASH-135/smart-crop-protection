import os
import random
import cv2
import yaml

random.seed(1)

IMAGES_DIR = "training/dataset/images/train"
LABELS_DIR = "training/dataset/labels/train"
OUTPUT_DIR = "training/sanity_check_output"
NUM_SAMPLES = 12

with open("training/config/classes.yaml", "r") as f:
    class_names = yaml.safe_load(f)["names"]

os.makedirs(OUTPUT_DIR, exist_ok=True)

all_images = [f for f in os.listdir(IMAGES_DIR) if f.lower().endswith((".jpg", ".jpeg", ".png"))]
sample = random.sample(all_images, min(NUM_SAMPLES, len(all_images)))

for img_name in sample:
    img_path = os.path.join(IMAGES_DIR, img_name)
    label_path = os.path.join(LABELS_DIR, os.path.splitext(img_name)[0] + ".txt")

    img = cv2.imread(img_path)
    h, w = img.shape[:2]

    if os.path.exists(label_path):
        with open(label_path, "r") as f:
            for line in f:
                parts = line.strip().split()
                if len(parts) != 5:
                    continue
                cls_id, cx, cy, bw, bh = int(parts[0]), *map(float, parts[1:])

                x1 = int((cx - bw / 2) * w)
                y1 = int((cy - bh / 2) * h)
                x2 = int((cx + bw / 2) * w)
                y2 = int((cy + bh / 2) * h)

                label = class_names.get(cls_id, f"UNKNOWN({cls_id})")
                cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(img, label, (x1, max(y1 - 8, 0)), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    out_path = os.path.join(OUTPUT_DIR, img_name)
    cv2.imwrite(out_path, img)

print(f"Saved {len(sample)} annotated preview images to {OUTPUT_DIR}")