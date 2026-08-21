import os
import time
import uuid
import cv2
from fastapi import FastAPI, File, UploadFile
from ultralytics import YOLO

app = FastAPI()

model = YOLO("models/crop_protection.pt")

face_cascade = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")
recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read("owner_model.yml")

OWNER_CONFIDENCE_THRESHOLD = 85 # lower = stricter match (LBPH: lower distance = better match)

def check_owner(img, x1, y1, x2, y2):
    h, w = img.shape[:2]
    x1c, y1c = max(0, int(x1)), max(0, int(y1))
    x2c, y2c = min(w, int(x2)), min(h, int(y2))

    if x2c <= x1c or y2c <= y1c:
        return False, None

    region = img[y1c:y2c, x1c:x2c]
    gray = cv2.cvtColor(region, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    if len(faces) == 0:
        return False, None

    fx, fy, fw, fh = faces[0]
    face_img = cv2.resize(gray[fy:fy+fh, fx:fx+fw], (200, 200))

    label, confidence = recognizer.predict(face_img)
    is_owner = confidence < OWNER_CONFIDENCE_THRESHOLD
    return is_owner, round(confidence, 1)

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    file_location = f"temp_{uuid.uuid4().hex}.jpg"

    with open(file_location, "wb") as buffer:
        buffer.write(await file.read())

    try:
        start = time.time()
        results = model.track(file_location, persist=True, verbose=False)
        elapsed = time.time() - start
        print(f"Inference time: {elapsed:.3f}s")

        img = cv2.imread(file_location)
        img_h, img_w = img.shape[:2]

        detections = []
        for r in results:
            for box in r.boxes:
                cls = int(box.cls[0])
                label = model.names[cls]
                confidence = float(box.conf[0])
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                track_id = int(box.id[0]) if box.id is not None else None

                detection = {
                    "label": label,
                    "confidence": round(confidence, 4),
                    "trackId": track_id,
                    "boundingBox": {
                        "x1": round(x1, 1),
                        "y1": round(y1, 1),
                        "x2": round(x2, 1),
                        "y2": round(y2, 1),
                    }
                }

                if label == "person":
                    is_owner, face_confidence = check_owner(img, x1, y1, x2, y2)
                    detection["isOwner"] = is_owner
                    detection["faceConfidence"] = face_confidence

                detections.append(detection)

        return {
            "detections": detections,
            "imageWidth": img_w,
            "imageHeight": img_h
        }
    finally:
        if os.path.exists(file_location):
            os.remove(file_location)