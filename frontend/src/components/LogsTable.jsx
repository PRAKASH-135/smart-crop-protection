function LogsTable({ logs = [], onSelectLog }) {
  const emojiFor = (obj) => {
    const map = {
      person: "🧑",
      cow: "🐄",
      monkey: "🐒",
      elephant: "🐘",
      pig: "🐖",
      goat: "🐐",
      bird: "🐦",
      dog: "🐕",
      cat: "🐈",
      horse: "🐎",
      sheep: "🐑",
      none: "—",
    };

    return map[obj?.toLowerCase()] || "❓";
  };

  const formatTime = (time) => {
    if (!time) return "—";

    const date = new Date(time);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleString([], {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatConfidence = (confidence) => {
    if (
      confidence === null ||
      confidence === undefined
    ) {
      return "—";
    }

    return `${Math.round(confidence * 100)}%`;
  };

  const getThreatLevel = (log) => {
    if (!log.harmful) {
      return "SAFE";
    }

    return log.threatLevel || "WARNING";
  };

  return (
    <section className="logs-panel">

      <div className="logs-header">
        <div>
          <h2 className="logs-title">
            Detection Logs
          </h2>

          <p className="logs-subtitle">
            Monitor and review recent AI detections
          </p>
        </div>

        <div className="logs-count">
          <span>{logs.length}</span>
          Recent Records
        </div>
      </div>

      {logs.length === 0 ? (

        <div className="logs-empty">
          <div className="logs-empty-icon">
            🔍
          </div>

          <h3>
            No detections yet
          </h3>

          <p>
            Detection records will appear here
            when the AI system identifies an object.
          </p>
        </div>

      ) : (

        <div className="logs-table-wrapper">

          <table className="logs-table">

            <thead>
              <tr>
                <th>Object</th>
                <th>Crop</th>
                <th>Confidence</th>
                <th>Threat Level</th>
                <th>Status</th>
                <th>Siren</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>

              {logs.map((log, index) => {

                const threatLevel =
                  getThreatLevel(log);

                const isThreat =
                  log.harmful === true;

                return (
                  <tr
                    key={
                      log._id ||
                      `${log.time}-${index}`
                    }
                    className="log-row-clickable"
                    onClick={() =>
                      onSelectLog?.(log)
                    }
                  >

                    <td>
                      <div className="log-object">

                        <span className="log-object-icon">
                          {emojiFor(log.object)}
                        </span>

                        <div>

                          <span className="log-object-name">
                            {log.object || "Unknown"}
                          </span>

                          {log.trackId !==
                            undefined &&
                            log.trackId !== null && (
                              <span className="log-track-id">
                                Track #{log.trackId}
                              </span>
                          )}

                        </div>

                      </div>
                    </td>

                    <td>
                      <span className="log-crop">
                        🌾 {log.crop || "—"}
                      </span>
                    </td>

                    <td>

                      <div className="confidence-cell">

                        <div className="confidence-bar">

                          <div
                            className={`confidence-fill ${
                              isThreat
                                ? "confidence-threat"
                                : "confidence-safe"
                            }`}
                            style={{
                              width: `${Math.min(
                                Math.max(
                                  (log.confidence || 0) *
                                    100,
                                  0
                                ),
                                100
                              )}%`,
                            }}
                          />

                        </div>

                        <span>
                          {formatConfidence(
                            log.confidence
                          )}
                        </span>

                      </div>

                    </td>

                    <td>

                      <span
                        className={`threat-badge ${
                          threatLevel === "HIGH"
                            ? "threat-high"
                            : threatLevel === "WARNING"
                            ? "threat-warning"
                            : "threat-safe"
                        }`}
                      >

                        <span className="threat-dot" />

                        {threatLevel}

                      </span>

                    </td>

                    <td>

                      <span
                        className={`status-badge ${
                          isThreat
                            ? "status-harmful"
                            : "status-safe"
                        }`}
                      >
                        {isThreat
                          ? "Harmful"
                          : "Safe"}
                      </span>

                    </td>

                    <td>

                      {log.sirenActivated ||
                      isThreat ? (

                        <span className="siren-log-active">
                          🚨 Active
                        </span>

                      ) : (

                        <span className="siren-log-inactive">
                          —
                        </span>

                      )}

                    </td>

                    <td>

                      <span className="log-time">
                        {formatTime(log.time)}
                      </span>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>
      )}

    </section>
  );
}

export default LogsTable;