import warnings
import fiftyone as fo
import fiftyone.zoo as foz

CLASS_MAP = {
    "monkey": "Monkey",
    "pig": "Pig",
    "goat": "Goat",
}

SAMPLES_PER_CLASS = 400
EXPORT_DIR = "training/weak_classes_raw"

oi_classes = list(CLASS_MAP.values())

print(f"Downloading up to {SAMPLES_PER_CLASS} images per class for: {oi_classes}")

dataset = foz.load_zoo_dataset(
    "open-images-v7",
    split="train",
    label_types=["detections"],
    classes=oi_classes,
    max_samples=SAMPLES_PER_CLASS * len(oi_classes),
    only_matching=True,
)

print(f"Downloaded {len(dataset)} images total.")

with warnings.catch_warnings():
    warnings.filterwarnings("ignore", category=UserWarning, module="fiftyone.utils.yolo")
    dataset.export(
        export_dir=EXPORT_DIR,
        dataset_type=fo.types.YOLOv5Dataset,
        label_field="ground_truth",
        classes=oi_classes,
    )

print(f"Export complete. Files are in: {EXPORT_DIR}")