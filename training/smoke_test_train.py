from ultralytics import YOLO

model = YOLO("yolov8s.pt")

results = model.train(
    data="training/dataset/dataset.yaml",
    epochs=2,
    imgsz=320,
    batch=8,
    fraction=0.1,       # use only ~10% of the dataset, just to test the pipeline fast
    workers=0,          # avoids multiprocessing issues on Windows
    project="training/runs",
    name="smoke_test",
    exist_ok=True,
)

print("Smoke test training complete.")
print(f"Best weights saved at: {results.save_dir}")