import Webcam from "react-webcam";
import { useRef, useEffect, useState } from "react";
import axios from "axios";

function CameraFeed({
  setDetectedObject,
  setConfidence,
  setSiren,
  setLogs,
  crop,
}) {
  const webcamRef = useRef(null);

  const [zone, setZone] = useState({
    top: 20,
    left: 20,
    width: 60,
    height: 60,
  });

  const [boxes, setBoxes] = useState([]);

  const [imgSize, setImgSize] = useState({
    w: 640,
    h: 480,
  });

  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const captureAndDetect = async () => {
      if (webcamRef.current) {
        const screenshot =
          webcamRef.current.getScreenshot();

        if (screenshot) {
          try {
            const blob = await fetch(screenshot).then(
              (res) => res.blob()
            );

            const formData = new FormData();

            formData.append(
              "image",
              blob,
              "frame.jpg"
            );

            formData.append("crop", crop);

            formData.append(
              "zone",
              JSON.stringify(zone)
            );

            const token = localStorage.getItem("token");

const response = await axios.post(
  "http://localhost:5000/api/analyze",
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

            if (isMounted) {
              setDetectedObject(
                response.data.detectedObject
              );

              setConfidence(
                response.data.confidence
              );

              setSiren(response.data.siren);

              setBoxes(
                response.data.allDetections || []
              );

              setImgSize({
                w:
                  response.data.imageWidth ||
                  640,
                h:
                  response.data.imageHeight ||
                  480,
              });

              setLogs((prev) => [
                {
                  object:
                    response.data.detectedObject,
                  harmful:
                    response.data.harmful,
                },
                ...prev,
              ]);
            }
          } catch (error) {
            console.log(
              "Frontend Error:",
              error
            );
          }
        }
      }

      if (isMounted) {
        timeoutId = setTimeout(
          captureAndDetect,
          800
        );
      }
    };

    captureAndDetect();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [crop, zone]);

  return (
    <div className="camera-panel">

      {/* CAMERA HEADER */}
      <div className="camera-header">

        <div>
          <div className="camera-title">
            Live Camera Feed
          </div>

          <div className="camera-subtitle">
            Real-time AI intrusion monitoring
          </div>
        </div>

        <div className="camera-live-status">
          <span className="camera-live-dot" />
          LIVE
        </div>

      </div>

      {/* CAMERA VIEW */}
      <div className="camera-view">

        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="camera-video"
        />

        {/* CAMERA OVERLAY */}
        <div className="camera-overlay">

          <div className="camera-label">
            CAM-01
          </div>

          <div className="camera-resolution">
            AI MONITORING
          </div>

        </div>

        {/* CROP ZONE */}
        <div
          className="crop-zone"
          style={{
            top: `${zone.top}%`,
            left: `${zone.left}%`,
            width: `${zone.width}%`,
            height: `${zone.height}%`,
          }}
        >
          <span className="crop-zone-label">
            CROP ZONE
          </span>
        </div>

        {/* YOLO DETECTION BOXES */}
        {boxes.map((b, i) => {
          const left =
            (b.boundingBox.x1 /
              imgSize.w) *
            100;

          const top =
            (b.boundingBox.y1 /
              imgSize.h) *
            100;

          const width =
            ((b.boundingBox.x2 -
              b.boundingBox.x1) /
              imgSize.w) *
            100;

          const height =
            ((b.boundingBox.y2 -
              b.boundingBox.y1) /
              imgSize.h) *
            100;

          const isThreat = b.isHarmful;

          return (
            <div
              key={i}
              className={`detection-box ${
                isThreat
                  ? "detection-threat"
                  : "detection-safe"
              }`}
              style={{
                top: `${top}%`,
                left: `${left}%`,
                width: `${width}%`,
                height: `${height}%`,
              }}
            >
              <div className="detection-label">
                <span>
                  {b.displayLabel || b.label}
                </span>

                <span>
                  {(b.confidence * 100).toFixed(
                    0
                  )}
                  %
                </span>
              </div>
            </div>
          );
        })}

        {/* CAMERA CORNERS */}
        <span className="camera-corner top-left" />
        <span className="camera-corner top-right" />
        <span className="camera-corner bottom-left" />
        <span className="camera-corner bottom-right" />

      </div>

      {/* CAMERA FOOTER */}
      <div className="camera-footer">

        <div className="camera-info">
          <span className="camera-info-dot" />

          <span>
            Camera connected
          </span>
        </div>

        <div className="camera-info">
          Crop:
          <strong>
            {crop}
          </strong>
        </div>

        <div className="camera-info">
          Detections:
          <strong>
            {boxes.length}
          </strong>
        </div>

      </div>

      {/* HIDDEN ZONE CONTROLS
          Kept for functionality but visually minimized */}
      <details className="zone-controls">
        <summary>
          Advanced Crop Zone
        </summary>

        <div className="zone-control-grid">

          <label>
            Top %
            <input
              type="number"
              value={zone.top}
              onChange={(e) =>
                setZone({
                  ...zone,
                  top: +e.target.value,
                })
              }
            />
          </label>

          <label>
            Left %
            <input
              type="number"
              value={zone.left}
              onChange={(e) =>
                setZone({
                  ...zone,
                  left: +e.target.value,
                })
              }
            />
          </label>

          <label>
            Width %
            <input
              type="number"
              value={zone.width}
              onChange={(e) =>
                setZone({
                  ...zone,
                  width: +e.target.value,
                })
              }
            />
          </label>

          <label>
            Height %
            <input
              type="number"
              value={zone.height}
              onChange={(e) =>
                setZone({
                  ...zone,
                  height: +e.target.value,
                })
              }
            />
          </label>

        </div>
      </details>

    </div>
  );
}

export default CameraFeed;