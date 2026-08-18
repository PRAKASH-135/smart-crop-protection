import os
import time
import uuid
from fastapi import FastAPI, File, UploadFile
from ultralytics import YOLO

app = FastAPI()

model = YOLO("models/crop_protection.pt")

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    file_location = f"temp_{uuid.uuid4().hex}.jpg"

    with open(file_location, "wb") as buffer:
        buffer.write(await file.read())

    try:
        start = time.time()
        results = model(file_location)
        elapsed = time.time() - start
        print(f"Inference time: {elapsed:.3f}s")

        detections = []
        for r in results:
            for box in r.boxes:
                cls = int(box.cls[0])
                label = model.names[cls]
                confidence = float(box.conf[0])
                x1, y1, x2, y2 = box.xyxy[0].tolist()

                detections.append({
                    "label": label,
                    "confidence": round(confidence, 4),
                    "boundingBox": {
                        "x1": round(x1, 1),
                        "y1": round(y1, 1),
                        "x2": round(x2, 1),
                        "y2": round(y2, 1),
                    }
                })

        return {"detections": detections}
    finally:
        if os.path.exists(file_location):
            os.remove(file_location)