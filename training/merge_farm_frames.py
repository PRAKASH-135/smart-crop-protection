import os
import random
import shutil

random.seed(42)

SOURCE_DIR = "training/raw_frames"

DEST_IMAGES_TRAIN = "training/dataset/images/train"
DEST_IMAGES_VAL = "training/dataset/images/val"
DEST_LABELS_TRAIN = "training/dataset/labels/train"
DEST_LABELS_VAL = "training/dataset/labels/val"

VAL_SPLIT = 0.2

for d in [DEST_IMAGES_TRAIN, DEST_IMAGES_VAL, DEST_LABELS_TRAIN, DEST_LABELS_VAL]:
    os.makedirs(d, exist_ok=True)

image_files = [f for f in os.listdir(SOURCE_DIR) if f.lower().endswith((".jpg", ".jpeg", ".png"))]
random.shuffle(image_files)

val_count = max(1, int(len(image_files) * VAL_SPLIT))
val_files = set(image_files[:val_count])

copied_train = 0
copied_val = 0
skipped_no_label = 0

for img_name in image_files:
    label_name = os.path.splitext(img_name)[0] + ".txt"
    src_img = os.path.join(SOURCE_DIR, img_name)
    src_label = os.path.join(SOURCE_DIR, label_name)

    if not os.path.exists(src_label):
        skipped_no_label += 1
        continue

    # prefix filenames so they never collide with public-dataset filenames
    new_img_name = f"farm_{img_name}"
    new_label_name = f"farm_{label_name}"

    if img_name in val_files:
        shutil.copy2(src_img, os.path.join(DEST_IMAGES_VAL, new_img_name))
        shutil.copy2(src_label, os.path.join(DEST_LABELS_VAL, new_label_name))
        copied_val += 1
    else:
        shutil.copy2(src_img, os.path.join(DEST_IMAGES_TRAIN, new_img_name))
        shutil.copy2(src_label, os.path.join(DEST_LABELS_TRAIN, new_label_name))
        copied_train += 1

print(f"Copied to train: {copied_train}")
print(f"Copied to val: {copied_val}")
print(f"Skipped (no matching label): {skipped_no_label}")