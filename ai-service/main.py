from fastapi import FastAPI, File, UploadFile
from ultralytics import YOLO
import shutil

app = FastAPI()

model = YOLO("yolov8n.pt")

@app.post("/detect")
async def detect(file: UploadFile = File(...)):

    file_location = "temp.jpg"

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    results = model(file_location)

    detected_label = "None"
    confidence = 0

    for r in results:
        for box in r.boxes:

            cls = int(box.cls[0])

            detected_label = model.names[cls]

            confidence = float(box.conf[0])

    return {
        "label": detected_label,
        "confidence": confidence
    }