import os
import cv2
from ultralytics import YOLO

HELD_OUT_VIDEOS = [
    "training/videos/video_20260816_175427.mp4",
    "training/videos/video_20260816_180607.mp4",
    "training/videos/video_20260816_181315.mp4",
    "training/videos/video_20260816_181510.mp4",
]

OUTPUT_DIR = "training/comparison_output"
FRAMES_PER_VIDEO = 5  # sample this many evenly-spaced frames per video

os.makedirs(OUTPUT_DIR, exist_ok=True)

old_model = YOLO("yolov8n.pt")
new_model = YOLO("training/models/crop_protection_v2.pt")

for video_path in HELD_OUT_VIDEOS:
    if not os.path.exists(video_path):
        print(f"Skipping missing file: {video_path}")
        continue

    video_name = os.path.splitext(os.path.basename(video_path))[0]
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    if total_frames == 0:
        print(f"Skipping unreadable video: {video_path}")
        continue

    step = max(1, total_frames // FRAMES_PER_VIDEO)

    for i in range(FRAMES_PER_VIDEO):
        frame_idx = i * step
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
        ret, frame = cap.read()
        if not ret:
            continue

        old_result = old_model(frame, verbose=False)[0]
        new_result = new_model(frame, verbose=False)[0]

        old_annotated = old_result.plot()
        new_annotated = new_result.plot()

        # resize to same height, stack side by side
        h = min(old_annotated.shape[0], new_annotated.shape[0])
        old_resized = cv2.resize(old_annotated, (int(old_annotated.shape[1] * h / old_annotated.shape[0]), h))
        new_resized = cv2.resize(new_annotated, (int(new_annotated.shape[1] * h / new_annotated.shape[0]), h))

        cv2.putText(old_resized, "OLD (yolov8n)", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        cv2.putText(new_resized, "NEW (custom v2)", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        combined = cv2.hconcat([old_resized, new_resized])
        out_path = os.path.join(OUTPUT_DIR, f"{video_name}_frame{frame_idx}.jpg")
        cv2.imwrite(out_path, combined)

    cap.release()
    print(f"Processed: {video_name}")

print(f"\nComparison images saved to: {OUTPUT_DIR}")