import cv2
import os
import numpy as np

recognizer = cv2.face.LBPHFaceRecognizer_create()

faces = []
labels = []

for filename in os.listdir("owner_data"):
    if filename.endswith(".jpg"):
        img = cv2.imread(f"owner_data/{filename}", cv2.IMREAD_GRAYSCALE)
        faces.append(img)
        labels.append(0)  # 0 = owner

recognizer.train(faces, np.array(labels))
recognizer.save("owner_model.yml")

print(f"Trained on {len(faces)} samples. Saved to owner_model.yml")