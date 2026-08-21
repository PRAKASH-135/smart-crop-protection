import Webcam from "react-webcam";
import { useRef, useEffect, useState } from "react";
import axios from "axios";

function CameraFeed({
  setDetectedObject,
  setConfidence,
  setSiren,
  setLogs,
  crop
}) {

  const webcamRef = useRef(null);
  const [zone, setZone] = useState({ top: 20, left: 20, width: 60, height: 60 });
  const [boxes, setBoxes] = useState([]);
  const [imgSize, setImgSize] = useState({ w: 640, h: 480 });

  useEffect(() => {

    let isMounted = true;
    let timeoutId;

    const captureAndDetect = async () => {

      if (webcamRef.current) {

        const screenshot =
          webcamRef.current.getScreenshot();

        if (screenshot) {

          const blob = await fetch(screenshot)
            .then(res => res.blob());

          const formData = new FormData();

          formData.append("image", blob, "frame.jpg");
          formData.append("crop", crop);
          formData.append("zone", JSON.stringify(zone));

          try {

            const response = await axios.post(
              "http://localhost:5000/api/analyze",
              formData
            );

            if (isMounted) {

              setDetectedObject(response.data.detectedObject);
              setConfidence(response.data.confidence);
              setSiren(response.data.siren);
              setBoxes(response.data.allDetections || []);
              setImgSize({
                w: response.data.imageWidth || 640,
                h: response.data.imageHeight || 480
              });

              setLogs(prev => [
                {
                  object: response.data.detectedObject,
                  harmful: response.data.harmful
                },
                ...prev
              ]);

            }

          } catch (error) {
            console.log("Frontend Error:", error);
          }

        }

      }

      if (isMounted) {
        timeoutId = setTimeout(captureAndDetect, 800);
      }

    };

    captureAndDetect();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };

  }, [crop, zone]);

  return (

    <div className="bg-[#0b1727] rounded-2xl p-5 border border-gray-800 shadow-lg">

      <div className="flex justify-between items-center mb-4">

        <h2 className="text-2xl font-semibold">
          Live Camera Feed
        </h2>

        <div className="text-green-400">
          ● LIVE
        </div>

      </div>

      <div style={{ position: "relative" }}>

        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="rounded-2xl w-full h-[350px] object-cover"
        />

        <div
          style={{
            position: "absolute",
            top: `${zone.top}%`,
            left: `${zone.left}%`,
            width: `${zone.width}%`,
            height: `${zone.height}%`,
            border: "3px solid red",
            pointerEvents: "none"
          }}
        />

        {boxes.map((b, i) => {
          const left = (b.boundingBox.x1 / imgSize.w) * 100;
          const top = (b.boundingBox.y1 / imgSize.h) * 100;
          const width = ((b.boundingBox.x2 - b.boundingBox.x1) / imgSize.w) * 100;
          const height = ((b.boundingBox.y2 - b.boundingBox.y1) / imgSize.h) * 100;
          const color = b.isHarmful ? "#ef4444" : "#22c55e";

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${top}%`,
                left: `${left}%`,
                width: `${width}%`,
                height: `${height}%`,
                border: `2px solid ${color}`,
                pointerEvents: "none"
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "-20px",
                  left: "0",
                  background: color,
                  color: "#000",
                  fontSize: "11px",
                  padding: "1px 6px",
                  borderRadius: "4px",
                  whiteSpace: "nowrap"
                }}
              >
                {b.label} {(b.confidence * 100).toFixed(0)}%
              </span>
            </div>
          );
        })}

      </div>

      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
        <label>Top% <input type="number" value={zone.top} onChange={e => setZone({...zone, top: +e.target.value})} style={{width:"50px"}}/></label>
        <label>Left% <input type="number" value={zone.left} onChange={e => setZone({...zone, left: +e.target.value})} style={{width:"50px"}}/></label>
        <label>W% <input type="number" value={zone.width} onChange={e => setZone({...zone, width: +e.target.value})} style={{width:"50px"}}/></label>
        <label>H% <input type="number" value={zone.height} onChange={e => setZone({...zone, height: +e.target.value})} style={{width:"50px"}}/></label>
      </div>

    </div>
  );
}

export default CameraFeed;