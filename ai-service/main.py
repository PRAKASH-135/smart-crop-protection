import os
import time
import uuid
import cv2
import numpy as np

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# PATHS
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

OWNER_DATA_DIR = os.path.join(
    BASE_DIR,
    "owner_data"
)

OWNER_MODEL_PATH = os.path.join(
    BASE_DIR,
    "owner_model.yml"
)

TEMP_OWNER_DATA_DIR = os.path.join(
    BASE_DIR,
    "owner_data_new"
)

CASCADE_PATH = os.path.join(
    BASE_DIR,
    "haarcascade_frontalface_default.xml"
)

os.makedirs(
    OWNER_DATA_DIR,
    exist_ok=True
)

os.makedirs(
    TEMP_OWNER_DATA_DIR,
    exist_ok=True
)

# =========================================================
# AI MODELS
# =========================================================

model = YOLO(
    os.path.join(
        BASE_DIR,
        "models",
        "crop_protection.pt"
    )
)

face_cascade = cv2.CascadeClassifier(
    CASCADE_PATH
)

recognizer = cv2.face.LBPHFaceRecognizer_create()

# Load existing owner model
if os.path.exists(
    OWNER_MODEL_PATH
):

    recognizer.read(
        OWNER_MODEL_PATH
    )

    print(
        "Owner face model loaded."
    )

else:

    print(
        "Owner face model not found."
    )


OWNER_CONFIDENCE_THRESHOLD = 85


# =========================================================
# OWNER FACE RECOGNITION
# =========================================================

def check_owner(
    img,
    x1,
    y1,
    x2,
    y2
):

    h, w = img.shape[:2]

    x1c = max(
        0,
        int(x1)
    )

    y1c = max(
        0,
        int(y1)
    )

    x2c = min(
        w,
        int(x2)
    )

    y2c = min(
        h,
        int(y2)
    )

    if (
        x2c <= x1c
        or y2c <= y1c
    ):

        return False, None

    region = img[
        y1c:y2c,
        x1c:x2c
    ]

    gray = cv2.cvtColor(
        region,
        cv2.COLOR_BGR2GRAY
    )

    faces = face_cascade.detectMultiScale(
        gray,
        1.3,
        5
    )

    if len(faces) == 0:

        return False, None

    fx, fy, fw, fh = faces[0]

    face_img = cv2.resize(
        gray[
            fy:fy + fh,
            fx:fx + fw
        ],
        (200, 200)
    )

    try:

        label, confidence = (
            recognizer.predict(
                face_img
            )
        )

    except cv2.error:

        return False, None

    is_owner = (
        confidence <
        OWNER_CONFIDENCE_THRESHOLD
    )

    return (
        is_owner,
        round(
            confidence,
            1
        )
    )


# =========================================================
# OWNER FACE ENROLLMENT
# =========================================================

@app.post(
    "/enroll-owner"
)
async def enroll_owner(
    files: list[
        UploadFile
    ] = File(...)
):

    print(
        f"Owner enrollment started. "
        f"Received {len(files)} images."
    )

    # -----------------------------------------------------
    # Minimum number of uploaded images
    # -----------------------------------------------------

    if len(files) < 10:

        return {
            "success": False,
            "message":
                "Please provide at least 10 face samples.",
            "samples": 0
        }

    # -----------------------------------------------------
    # Clear temporary enrollment directory
    # -----------------------------------------------------

    for filename in os.listdir(
        TEMP_OWNER_DATA_DIR
    ):

        file_path = os.path.join(
            TEMP_OWNER_DATA_DIR,
            filename
        )

        try:

            if os.path.isfile(
                file_path
            ):

                os.remove(
                    file_path
                )

        except OSError:
            pass

    saved_count = 0

    # -----------------------------------------------------
    # Process uploaded webcam frames
    # -----------------------------------------------------

    for index, file in enumerate(
        files
    ):

        try:

            image_bytes = (
                await file.read()
            )

            image_array = np.frombuffer(
                image_bytes,
                dtype=np.uint8
            )

            frame = cv2.imdecode(
                image_array,
                cv2.IMREAD_COLOR
            )

            if frame is None:

                continue

            gray = cv2.cvtColor(
                frame,
                cv2.COLOR_BGR2GRAY
            )

            faces = face_cascade.detectMultiScale(
                gray,
                1.3,
                5
            )

            if len(faces) == 0:

                print(
                    f"Sample {index + 1}: "
                    "No face detected."
                )

                continue

            # -------------------------------------------------
            # Select largest detected face
            # -------------------------------------------------

            x, y, w, h = max(
                faces,
                key=lambda f:
                    f[2] * f[3]
            )

            face_img = gray[
                y:y + h,
                x:x + w
            ]

            face_img = cv2.resize(
                face_img,
                (200, 200)
            )

            output_path = os.path.join(
                TEMP_OWNER_DATA_DIR,
                f"new_owner_{saved_count}.jpg"
            )

            cv2.imwrite(
                output_path,
                face_img
            )

            saved_count += 1

            print(
                f"Valid face sample: "
                f"{saved_count}"
            )

        except Exception as error:

            print(
                "Enrollment image error:",
                error
            )

    print(
        f"Valid samples collected: "
        f"{saved_count}"
    )

    # -----------------------------------------------------
    # Check minimum valid samples
    # -----------------------------------------------------

    if saved_count < 10:

        print(
            "Enrollment failed. "
            "Existing owner data was NOT changed."
        )

        return {
            "success": False,

            "message":
                "Not enough valid face samples. "
                "Please scan your face again.",

            "samples":
                saved_count
        }

    # -----------------------------------------------------
    # Prepare training data
    # -----------------------------------------------------

    training_faces = []
    training_labels = []

    for filename in sorted(
        os.listdir(
            TEMP_OWNER_DATA_DIR
        )
    ):

        if not filename.endswith(
            ".jpg"
        ):

            continue

        image_path = os.path.join(
            TEMP_OWNER_DATA_DIR,
            filename
        )

        img = cv2.imread(
            image_path,
            cv2.IMREAD_GRAYSCALE
        )

        if img is None:

            continue

        training_faces.append(
            img
        )

        # 0 = owner
        training_labels.append(
            0
        )

    # -----------------------------------------------------
    # Verify training data
    # -----------------------------------------------------

    if len(
        training_faces
    ) < 10:

        print(
            "Training failed. "
            "Existing owner model was NOT changed."
        )

        return {
            "success": False,

            "message":
                "Unable to prepare enough "
                "face samples for training.",

            "samples":
                len(training_faces)
        }

    # -----------------------------------------------------
    # Train new LBPH model
    # -----------------------------------------------------

    try:

        new_recognizer = (
            cv2.face
            .LBPHFaceRecognizer_create()
        )

        new_recognizer.train(
            training_faces,
            np.array(
                training_labels
            )
        )

    except Exception as error:

        print(
            "Owner model training error:",
            error
        )

        return {
            "success": False,

            "message":
                "Owner face model training failed.",

            "samples":
                len(training_faces)
        }

    # -----------------------------------------------------
    # Save new model to temporary location
    # -----------------------------------------------------

    temporary_model_path = os.path.join(
        BASE_DIR,
        "owner_model_new.yml"
    )

    try:

        new_recognizer.save(
            temporary_model_path
        )

    except Exception as error:

        print(
            "Model save error:",
            error
        )

        return {
            "success": False,

            "message":
                "Failed to save new owner model.",

            "samples":
                len(training_faces)
        }

    # -----------------------------------------------------
    # Replace existing model ONLY after successful training
    # -----------------------------------------------------

    try:

        os.replace(
            temporary_model_path,
            OWNER_MODEL_PATH
        )

    except Exception as error:

        print(
            "Model replacement error:",
            error
        )

        return {
            "success": False,

            "message":
                "Failed to update owner model.",

            "samples":
                len(training_faces)
        }

    # -----------------------------------------------------
    # Replace owner image dataset
    # -----------------------------------------------------

    try:

        # Remove old owner images
        for filename in os.listdir(
            OWNER_DATA_DIR
        ):

            if filename.endswith(
                ".jpg"
            ):

                old_path = os.path.join(
                    OWNER_DATA_DIR,
                    filename
                )

                os.remove(
                    old_path
                )

        # Move new samples into owner_data
        for filename in os.listdir(
            TEMP_OWNER_DATA_DIR
        ):

            source_path = os.path.join(
                TEMP_OWNER_DATA_DIR,
                filename
            )

            destination_name = (
                f"owner_{filename.replace('new_owner_', '')}"
            )

            destination_path = os.path.join(
                OWNER_DATA_DIR,
                destination_name
            )

            os.replace(
                source_path,
                destination_path
            )

    except Exception as error:

        print(
            "Owner image replacement error:",
            error
        )

    # -----------------------------------------------------
    # Reload global recognizer
    # -----------------------------------------------------

    global recognizer

    recognizer = new_recognizer

    print(
        "Owner model successfully updated."
    )

    print(
        f"Trained on "
        f"{len(training_faces)} samples."
    )

    return {

        "success":
            True,

        "message":
            "Owner face enrolled successfully.",

        "samples":
            len(training_faces)
    }


# =========================================================
# YOLO DETECTION
# =========================================================

@app.post(
    "/detect"
)
async def detect(
    file: UploadFile = File(...)
):

    file_location = os.path.join(
        BASE_DIR,
        f"temp_{uuid.uuid4().hex}.jpg"
    )

    with open(
        file_location,
        "wb"
    ) as buffer:

        buffer.write(
            await file.read()
        )

    try:

        start = time.time()

        results = model.track(
            file_location,
            persist=True,
            verbose=False
        )

        elapsed = (
            time.time() -
            start
        )

        print(
            f"Inference time: "
            f"{elapsed:.3f}s"
        )

        img = cv2.imread(
            file_location
        )

        img_h, img_w = (
            img.shape[:2]
        )

        detections = []

        for r in results:

            for box in r.boxes:

                cls = int(
                    box.cls[0]
                )

                label = model.names[
                    cls
                ]

                confidence = float(
                    box.conf[0]
                )

                x1, y1, x2, y2 = (
                    box.xyxy[0].tolist()
                )

                track_id = (
                    int(box.id[0])
                    if box.id is not None
                    else None
                )

                detection = {

                    "label":
                        label,

                    "confidence":
                        round(
                            confidence,
                            4
                        ),

                    "trackId":
                        track_id,

                    "boundingBox": {

                        "x1":
                            round(
                                x1,
                                1
                            ),

                        "y1":
                            round(
                                y1,
                                1
                            ),

                        "x2":
                            round(
                                x2,
                                1
                            ),

                        "y2":
                            round(
                                y2,
                                1
                            )
                    }
                }

                if label == "person":

                    (
                        is_owner,
                        face_confidence
                    ) = check_owner(
                        img,
                        x1,
                        y1,
                        x2,
                        y2
                    )

                    detection[
                        "isOwner"
                    ] = is_owner

                    detection[
                        "faceConfidence"
                    ] = face_confidence

                detections.append(
                    detection
                )

        return {

            "detections":
                detections,

            "imageWidth":
                img_w,

            "imageHeight":
                img_h
        }

    finally:

        if os.path.exists(
            file_location
        ):

            os.remove(
                file_location
            )