import cv2
import os
import time

os.makedirs("owner_data", exist_ok=True)

face_cascade = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")

cap = cv2.VideoCapture(0)
count = 0
target = 30
capture_interval = 0.5 # seconds between captures
last_capture_time = 0

print("Look at the camera. Slowly turn your head (left, right, up, down, center) while capturing.")
print(f"Capturing {target} samples, one every {capture_interval}s. Press 'q' to quit early.")

while count < target:
    ret, frame = cap.read()
    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    now = time.time()

    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)

        if now - last_capture_time >= capture_interval:
            face_img = gray[y:y+h, x:x+w]
            face_img = cv2.resize(face_img, (200, 200))
            cv2.imwrite(f"owner_data/owner_{count}.jpg", face_img)
            count += 1
            last_capture_time = now
            print(f"Captured {count}/{target}")

    cv2.putText(frame, f"{count}/{target}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.imshow("Enrolling Owner - Move head slowly - Press q to quit", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
print(f"Done. {count} samples saved to ai-service/owner_data/")