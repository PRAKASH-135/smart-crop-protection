import cv2
import os


VIDEO_PATH = "training/videos/farm_test.mp4"
OUTPUT_DIR = "training/raw_frames"

FRAME_INTERVAL = 10


os.makedirs(OUTPUT_DIR, exist_ok=True)

cap = cv2.VideoCapture(VIDEO_PATH)

if not cap.isOpened():
    print("Error: Could not open video.")
    exit()


frame_count = 0
saved_count = 0


while True:

    success, frame = cap.read()

    if not success:
        break

    if frame_count % FRAME_INTERVAL == 0:

        filename = os.path.join(
            OUTPUT_DIR,
            f"frame_{saved_count:05d}.jpg"
        )

        cv2.imwrite(filename, frame)

        saved_count += 1

    frame_count += 1


cap.release()

print(f"Total frames processed: {frame_count}")
print(f"Frames saved: {saved_count}")