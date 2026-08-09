import { useEffect } from "react";
import sirenSound from "../assets/siren.mp3";

function DetectionCard({
  detectedObject,
  confidence,
  siren
}) {

  useEffect(() => {

    const audio =
      new Audio(sirenSound);

    if (siren) {
      audio.play();
    }

  }, [siren]);

  return (

    <div className="bg-[#0b1727] rounded-2xl p-5 border border-gray-800 shadow-lg h-full">

      <h2 className="text-2xl font-semibold text-red-400 mb-6">

        Detection Status

      </h2>

      <div className="space-y-5">

        <div>

          <p className="text-gray-400">
            Detected Object
          </p>

          <h3 className="text-2xl font-bold mt-1">
            {detectedObject || "None"}
          </h3>

        </div>

        <div>

          <p className="text-gray-400">
            Confidence
          </p>

          <h3 className="text-2xl font-bold mt-1">

            {confidence
              ? `${(confidence * 100).toFixed(1)}%`
              : "0%"}

          </h3>

        </div>

        <div className={`p-4 rounded-xl border ${
          siren
            ? "bg-red-500/20 border-red-500"
            : "bg-green-500/20 border-green-500"
        }`}>

          <p className={`font-bold text-lg ${
            siren
              ? "text-red-400"
              : "text-green-400"
          }`}>

            {siren
              ? "⚠ Harmful Object Detected"
              : "✅ Safe"}

          </p>

        </div>

      </div>

    </div>
  );
}

export default DetectionCard;