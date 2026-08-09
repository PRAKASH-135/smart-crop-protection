import Webcam from "react-webcam";
import { useRef, useEffect } from "react";
import axios from "axios";

function CameraFeed({
  setDetectedObject,
  setConfidence,
  setSiren,
  setLogs,
  crop
}) {

  const webcamRef = useRef(null);

  useEffect(() => {

    const interval = setInterval(async () => {

      if (webcamRef.current) {

        const screenshot =
          webcamRef.current.getScreenshot();

        if (!screenshot) return;

        const blob = await fetch(screenshot)
          .then(res => res.blob());

        const formData = new FormData();

        // send image
        formData.append(
          "image",
          blob,
          "frame.jpg"
        );

        // send crop
        formData.append(
          "crop",
          crop
        );

        try {

          const response = await axios.post(
            "http://localhost:5000/api/analyze",
            formData
          );

          console.log(response.data);

          // update detection card
          setDetectedObject(
            response.data.detectedObject
          );

          setConfidence(
            response.data.confidence
          );

          setSiren(
            response.data.siren
          );

          // update logs
          setLogs(prev => [
            {
              object:
                response.data.detectedObject,

              harmful:
                response.data.harmful
            },
            ...prev
          ]);

        } catch (error) {

          console.log(
            "Frontend Error:",
            error
          );

        }

      }

    }, 4000);

    return () => clearInterval(interval);

  }, [crop]);

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

      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-2xl w-full h-[350px] object-cover"
      />

    </div>
  );
}

export default CameraFeed;