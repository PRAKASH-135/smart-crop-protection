function DetectionDetails({ log, onClose }) {
  if (!log) {
    return null;
  }

  const confidence =
    log.confidence !== undefined &&
    log.confidence !== null
      ? Math.round(log.confidence * 100)
      : 0;

  const threatLevel = log.harmful
    ? log.threatLevel || "WARNING"
    : "SAFE";

  const formatTime = (time) => {
    if (!time) {
      return "—";
    }

    const date = new Date(time);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const objectName =
    log.object || "Unknown";

  const isHigh =
    threatLevel === "HIGH";

  const isWarning =
    threatLevel === "WARNING";

  return (
    <div className="detection-modal-overlay">

      <div className="detection-modal">

        {/* HEADER */}

        <div className="detection-modal-header">

          <div>
            <p className="detection-modal-label">
              DETECTION DETAILS
            </p>

            <h2 className="detection-modal-title">
              {objectName}
            </h2>
          </div>

          <button
            type="button"
            className="detection-modal-close"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        {/* OBJECT SUMMARY */}

        <div
          className={`detection-summary ${
            log.harmful
              ? "detection-summary-threat"
              : "detection-summary-safe"
          }`}
        >

          <div className="detection-summary-icon">
            {objectName.toLowerCase() ===
            "cow"
              ? "🐄"
              : objectName.toLowerCase() ===
                "elephant"
              ? "🐘"
              : objectName.toLowerCase() ===
                "goat"
              ? "🐐"
              : objectName.toLowerCase() ===
                "bird"
              ? "🐦"
              : objectName.toLowerCase() ===
                "person"
              ? "🧑"
              : "🔍"}
          </div>

          <div className="detection-summary-info">

            <span className="detection-summary-object">
              {objectName}
            </span>

            <span
              className={`detection-summary-threat ${
                isHigh
                  ? "summary-high"
                  : isWarning
                  ? "summary-warning"
                  : "summary-safe"
              }`}
            >
              {threatLevel}
            </span>

          </div>

        </div>

        {/* INFORMATION */}

        <div className="detection-details-grid">

          <div className="detection-detail-item">
            <span>Confidence</span>
            <strong>{confidence}%</strong>
          </div>

          <div className="detection-detail-item">
            <span>Crop</span>
            <strong className="capitalize">
              {log.crop || "—"}
            </strong>
          </div>

          <div className="detection-detail-item">
            <span>Status</span>

            <strong
              className={
                log.harmful
                  ? "detail-danger"
                  : "detail-safe"
              }
            >
              {log.harmful
                ? "Harmful"
                : "Safe"}
            </strong>
          </div>

          <div className="detection-detail-item">
            <span>Siren</span>

            <strong
              className={
                log.sirenActivated
                  ? "detail-danger"
                  : "detail-muted"
              }
            >
              {log.sirenActivated
                ? "🚨 Active"
                : "Inactive"}
            </strong>
          </div>

          <div className="detection-detail-item">
            <span>Track ID</span>

            <strong>
              {log.trackId !== undefined &&
              log.trackId !== null
                ? `#${log.trackId}`
                : "—"}
            </strong>
          </div>

          <div className="detection-detail-item">
            <span>Crop Zone</span>

            <strong
              className={
                log.insideCropZone
                  ? "detail-safe"
                  : "detail-muted"
              }
            >
              {log.insideCropZone
                ? "Inside"
                : "Outside"}
            </strong>
          </div>

        </div>

        {/* TIME */}

        <div className="detection-time-section">

          <span>
            Detection Time
          </span>

          <strong>
            {formatTime(log.time)}
          </strong>

        </div>

        {/* BOUNDING BOX */}

        {log.boundingBox && (
          <div className="bounding-box-section">

            <div className="bounding-box-title">
              Bounding Box
            </div>

            <div className="bounding-box-grid">

              <div>
                <span>X1</span>
                <strong>
                  {Math.round(
                    log.boundingBox.x1 ?? 0
                  )}
                </strong>
              </div>

              <div>
                <span>Y1</span>
                <strong>
                  {Math.round(
                    log.boundingBox.y1 ?? 0
                  )}
                </strong>
              </div>

              <div>
                <span>X2</span>
                <strong>
                  {Math.round(
                    log.boundingBox.x2 ?? 0
                  )}
                </strong>
              </div>

              <div>
                <span>Y2</span>
                <strong>
                  {Math.round(
                    log.boundingBox.y2 ?? 0
                  )}
                </strong>
              </div>

            </div>

          </div>
        )}

        {/* FOOTER */}

        <button
          type="button"
          className="detection-modal-done"
          onClick={onClose}
        >
          Close Details
        </button>

      </div>

    </div>
  );
}

export default DetectionDetails;