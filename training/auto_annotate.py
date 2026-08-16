import os
from ultralytics import YOLO

IMAGES_DIR = "training/raw_frames_batch2"
CONF_THRESHOLD = 0.35

# COCO class name -> our project's class id (see training/config/classes.yaml)
COCO_TO_OUR_CLASS = {
    "person": 0,
    "cow": 1,
    "elephant": 3,
    "bird": 6,
    "dog": 7,
}

model = YOLO("yolov8n.pt")

image_files = [f for f in os.listdir(IMAGES_DIR) if f.lower().endswith((".jpg", ".jpeg", ".png"))]
print(f"Running auto-annotation on {len(image_files)} images...")

total_boxes = 0
images_with_boxes = 0

for img_name in image_files:
    img_path = os.path.join(IMAGES_DIR, img_name)
    results = model(img_path, conf=CONF_THRESHOLD, verbose=False)

    lines = []
    for r in results:
        for box in r.boxes:
            cls_id = int(box.cls[0])
            coco_name = model.names[cls_id]

            if coco_name not in COCO_TO_OUR_CLASS:
                continue

            our_class_id = COCO_TO_OUR_CLASS[coco_name]
            x_center, y_center, w, h = box.xywhn[0].tolist()
            lines.append(f"{our_class_id} {x_center:.6f} {y_center:.6f} {w:.6f} {h:.6f}")

    label_path = os.path.join(IMAGES_DIR, os.path.splitext(img_name)[0] + ".txt")
    with open(label_path, "w") as f:
        f.write("\n".join(lines))

    if lines:
        images_with_boxes += 1
        total_boxes += len(lines)

print(f"Done. {images_with_boxes}/{len(image_files)} images got at least one auto-detected box.")
print(f"Total auto-detected boxes: {total_boxes}")
print("Remember: monkey, pig, and goat are NOT auto-detected — those need fully manual boxes.")