import { useEffect, useRef, useState } from "react";
import sirenSound from "../assets/siren.mp3";

function DetectionCard({
  detectedObject,
  confidence,
  siren,
  crop,
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
      setSirenSince((prev) => prev || new Date());
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
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const pct = confidence
    ? Math.round(confidence * 100)
    : 0;

  const radius = 58;
  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference -
    (pct / 100) * circumference;

  const ringColor = siren
    ? "#ef4444"
    : "#4ade80";

  const timeStr = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const sinceStr = sirenSince
    ? sirenSince.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : null;

  const hasDetection =
    detectedObject &&
    detectedObject !== "none";

  return (
    <div className="detection-panel">

      {/* =================================================
          HEADER
         ================================================= */}

      <div className="detection-header">

        <div>
          <h2 className="detection-title">
            Current Detection
          </h2>

          <p className="detection-subtitle">
            Latest AI analysis result
          </p>
        </div>

        <div
          className={`detection-state ${
            siren
              ? "detection-state-threat"
              : "detection-state-safe"
          }`}
        >
          <span className="detection-state-dot" />

          {siren ? "THREAT" : "MONITORING"}
        </div>

      </div>

      {/* =================================================
          MAIN DETECTION
         ================================================= */}

      <div
        className={`detection-main ${
          siren
            ? "detection-main-threat"
            : ""
        }`}
      >

        {/* CONFIDENCE RING */}

        <div className="confidence-container">

          <svg
            className="confidence-ring"
            width="150"
            height="150"
            viewBox="0 0 150 150"
          >
            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="none"
              stroke="rgba(148,163,184,0.12)"
              strokeWidth="10"
            />

            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="none"
              stroke={ringColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 75 75)"
              style={{
                transition:
                  "stroke-dashoffset 0.5s ease",
                filter: siren
                  ? "drop-shadow(0 0 7px rgba(239,68,68,.55))"
                  : "drop-shadow(0 0 7px rgba(74,222,128,.35))",
              }}
            />
          </svg>

          <div className="confidence-center">

            <span className="confidence-value">
              {pct}%
            </span>

            <span className="confidence-label">
              Confidence
            </span>

          </div>

        </div>

        {/* DETECTION INFORMATION */}

        <div className="detection-information">

          <div className="detection-object-icon">
            {hasDetection
              ? "🎯"
              : "—"}
          </div>

          <p className="detected-label">
            Detected Object
          </p>

          <h3 className="detected-object">
            {hasDetection
              ? detectedObject
              : "No Detection"}
          </h3>

          {siren ? (
            <div className="high-threat-badge">
              <span>⚠</span>
              HIGH THREAT
            </div>
          ) : (
            <div className="safe-badge">
              <span>✓</span>
              NO ACTIVE THREAT
            </div>
          )}

        </div>

      </div>

      {/* =================================================
          SIREN STATUS
         ================================================= */}

      <div
        className={`siren-card ${
          siren
            ? "siren-card-active"
            : "siren-card-inactive"
        }`}
      >

        <div className="siren-icon">
          🚨
        </div>

        <div className="siren-information">

          <p className="siren-label">
            Siren Status
          </p>

          <div
            className={`siren-status ${
              siren
                ? "siren-status-active"
                : "siren-status-inactive"
            }`}
          >
            <span className="siren-status-dot" />

            {siren
              ? "ACTIVE"
              : "INACTIVE"}
          </div>

          {sinceStr && (
            <p className="siren-since">
              Active since {sinceStr}
            </p>
          )}

        </div>

        {siren && (
          <div className="siren-wave">
            <span />
            <span />
            <span />
          </div>
        )}

      </div>

      {/* =================================================
          INFORMATION CARDS
         ================================================= */}

      <div className="detection-info-grid">

        <div className="detection-info-card">

          <span className="detection-info-icon">
            🌾
          </span>

          <div>
            <p>Crop</p>

            <strong>
              {crop}
            </strong>
          </div>

        </div>

        <div className="detection-info-card">

          <span className="detection-info-icon">
            🕐
          </span>

          <div>
            <p>Current Time</p>

            <strong>
              {timeStr}
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
}

export default DetectionCard;