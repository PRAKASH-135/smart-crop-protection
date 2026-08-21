import { useEffect, useRef, useState } from "react";
import sirenSound from "../assets/siren.mp3";

function DetectionCard({
  detectedObject,
  confidence,
  siren,
  crop
}) {
  const audioRef = useRef(null);
  const [sirenSince, setSirenSince] = useState(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(sirenSound);
      audioRef.current.loop = true;
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (siren) {
      audio.play().catch(() => {});
      setSirenSince(prev => prev || new Date());
    } else {
      audio.pause();
      audio.currentTime = 0;
      setSirenSince(null);
    }
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [siren]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const pct = confidence ? Math.round(confidence * 100) : 0;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const ringColor = siren ? "#ef4444" : "#22c55e";

  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const sinceStr = sirenSince
    ? sirenSince.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className="space-y-4 h-full">

      <div className="bg-[#0b1727] rounded-2xl p-5 border border-gray-800 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-300 mb-4">
          Current Detection
        </h2>

        <div className="flex items-center gap-4">
          <div className="relative" style={{ width: 130, height: 130 }}>
            <svg width="130" height="130" viewBox="0 0 130 130">
              <circle cx="65" cy="65" r={radius} fill="none" stroke="#1f2937" strokeWidth="10" />
              <circle
                cx="65" cy="65" r={radius} fill="none"
                stroke={ringColor} strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 65 65)"
                style={{ transition: "stroke-dashoffset 0.4s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-2xl">
              {detectedObject === "none" || !detectedObject ? "—" : "🎯"}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold capitalize">
              {detectedObject || "None"}
            </h3>
            {siren && (
              <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/40">
                HIGH THREAT
              </span>
            )}
            <p className="text-gray-400 text-sm mt-2">Confidence</p>
            <p className={`text-3xl font-bold ${siren ? "text-red-400" : "text-green-400"}`}>
              {pct}%
            </p>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl p-5 border shadow-lg ${
        siren ? "bg-red-500/10 border-red-500" : "bg-[#0b1727] border-gray-800"
      }`}>
        <p className="text-gray-400 text-sm">Siren Status</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-2xl">🚨</span>
          <span className={`text-xl font-bold ${siren ? "text-red-400" : "text-gray-500"}`}>
            {siren ? "ACTIVE" : "INACTIVE"}
          </span>
        </div>
        {sinceStr && (
          <p className="text-gray-500 text-xs mt-1">Since {sinceStr}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0b1727] rounded-xl p-3 border border-gray-800">
          <p className="text-gray-500 text-xs">Crop</p>
          <p className="font-semibold capitalize">{crop}</p>
        </div>
        <div className="bg-[#0b1727] rounded-xl p-3 border border-gray-800">
          <p className="text-gray-500 text-xs">Time</p>
          <p className="font-semibold">{timeStr}</p>
        </div>
      </div>

    </div>
  );
}
export default DetectionCard;