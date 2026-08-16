import os
import cv2
import yaml

IMAGES_DIRS = ["training/dataset/images/train", "training/dataset/images/val"]
LABELS_DIRS = ["training/dataset/labels/train", "training/dataset/labels/val"]
OUTPUT_DIR = "training/sanity_check_farm_output"

with open("training/config/classes.yaml", "r") as f:
    class_names = yaml.safe_load(f)["names"]

os.makedirs(OUTPUT_DIR, exist_ok=True)

count = 0
for images_dir, labels_dir in zip(IMAGES_DIRS, LABELS_DIRS):
    for img_name in os.listdir(images_dir):
        if not img_name.startswith("farm_"):
            continue

        img_path = os.path.join(images_dir, img_name)
        label_path = os.path.join(labels_dir, os.path.splitext(img_name)[0] + ".txt")

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

        cv2.imwrite(os.path.join(OUTPUT_DIR, img_name), img)
        count += 1

print(f"Saved {count} farm-frame preview images to {OUTPUT_DIR}")