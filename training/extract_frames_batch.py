import os
import cv2
import numpy as np

VIDEOS_DIR = "training/videos"
OUTPUT_DIR = "training/raw_frames_batch2"

HELD_OUT = {
    "video_20260816_175427.mp4",
    "video_20260816_180607.mp4",
    "video_20260816_181315.mp4",
    "video_20260816_181510.mp4",
}

ALREADY_PROCESSED = {"farm_test.mp4"}

SAMPLE_FPS = 1.0          # extract ~1 frame per second
DUPLICATE_THRESHOLD = 12.0  # higher = more tolerant of similarity; tune later if needed

os.makedirs(OUTPUT_DIR, exist_ok=True)

def frame_difference(f1, f2):
    g1 = cv2.cvtColor(f1, cv2.COLOR_BGR2GRAY)
    g2 = cv2.cvtColor(f2, cv2.COLOR_BGR2GRAY)
    diff = cv2.absdiff(g1, g2)
    return float(np.mean(diff))

video_files = [
    f for f in os.listdir(VIDEOS_DIR)
    if f.lower().endswith(".mp4") and f not in HELD_OUT and f not in ALREADY_PROCESSED
]

print(f"Found {len(video_files)} training videos to process.")

total_saved = 0

for video_name in video_files:
    video_path = os.path.join(VIDEOS_DIR, video_name)
    cap = cv2.VideoCapture(video_path)

    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    frame_interval = max(1, int(round(fps / SAMPLE_FPS)))

    base_name = os.path.splitext(video_name)[0]
    frame_idx = 0
    saved_idx = 0
    last_saved_frame = None
    video_saved_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_idx % frame_interval == 0:
            is_duplicate = False
            if last_saved_frame is not None:
                diff = frame_difference(frame, last_saved_frame)
                if diff < DUPLICATE_THRESHOLD:
                    is_duplicate = True

            if not is_duplicate:
                out_name = f"{base_name}_f{saved_idx:04d}.jpg"
                cv2.imwrite(os.path.join(OUTPUT_DIR, out_name), frame)
                last_saved_frame = frame
                saved_idx += 1
                video_saved_count += 1

        frame_idx += 1

    cap.release()
    total_saved += video_saved_count
    print(f"  {video_name}: saved {video_saved_count} frames")

print(f"\nTotal frames saved across all videos: {total_saved}")
print(f"Output folder: {OUTPUT_DIR}")