import os
import random
import shutil

random.seed(42)

SOURCE_IMAGES = "training/weak_classes_raw/images/val"
SOURCE_LABELS = "training/weak_classes_raw/labels/val"

# Remap this export's local class ids -> our project's real class ids (classes.yaml)
CLASS_REMAP = {
    0: 2,  # Monkey -> monkey (2)
    1: 4,  # Pig    -> pig (4)
    2: 5,  # Goat   -> goat (5)
}

DEST_IMAGES_TRAIN = "training/dataset/images/train"
DEST_IMAGES_VAL = "training/dataset/images/val"
DEST_LABELS_TRAIN = "training/dataset/labels/train"
DEST_LABELS_VAL = "training/dataset/labels/val"

VAL_SPLIT = 0.2

for d in [DEST_IMAGES_TRAIN, DEST_IMAGES_VAL, DEST_LABELS_TRAIN, DEST_LABELS_VAL]:
    os.makedirs(d, exist_ok=True)

image_files = [f for f in os.listdir(SOURCE_IMAGES) if f.lower().endswith((".jpg", ".jpeg", ".png"))]
random.shuffle(image_files)

val_count = max(1, int(len(image_files) * VAL_SPLIT))
val_files = set(image_files[:val_count])

copied_train = 0
copied_val = 0
skipped_no_label = 0

for img_name in image_files:
    label_name = os.path.splitext(img_name)[0] + ".txt"
    src_img = os.path.join(SOURCE_IMAGES, img_name)
    src_label = os.path.join(SOURCE_LABELS, label_name)

    if not os.path.exists(src_label):
        skipped_no_label += 1
        continue

    # Read, remap class ids, and build new label content
    remapped_lines = []
    with open(src_label, "r") as f:
        for line in f:
            parts = line.strip().split()
            if len(parts) != 5:
                continue
            old_cls = int(parts[0])
            new_cls = CLASS_REMAP.get(old_cls)
            if new_cls is None:
                continue
            remapped_lines.append(f"{new_cls} {' '.join(parts[1:])}")

    if not remapped_lines:
        skipped_no_label += 1
        continue

    new_img_name = f"weak_{img_name}"
    new_label_name = f"weak_{label_name}"

    if img_name in val_files:
        shutil.copy2(src_img, os.path.join(DEST_IMAGES_VAL, new_img_name))
        with open(os.path.join(DEST_LABELS_VAL, new_label_name), "w") as f:
            f.write("\n".join(remapped_lines))
        copied_val += 1
    else:
        shutil.copy2(src_img, os.path.join(DEST_IMAGES_TRAIN, new_img_name))
        with open(os.path.join(DEST_LABELS_TRAIN, new_label_name), "w") as f:
            f.write("\n".join(remapped_lines))
        copied_train += 1

print(f"Copied to train: {copied_train}")
print(f"Copied to val: {copied_val}")
print(f"Skipped (no valid label): {skipped_no_label}")