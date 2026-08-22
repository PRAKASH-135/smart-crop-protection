import { useEffect, useState } from "react";
import axios from "axios";
import ThreatCharts from "../components/ThreatCharts";

function AnalyticsPage() {
  const [stats, setStats] = useState({
    total: 0,
    harmful: 0,
    safe: 0,
  });

  useEffect(() => {
    const fetchStats = () => {
      axios
        .get("http://localhost:5000/api/analytics")
        .then((res) => {
          setStats(res.data);
        })
        .catch((err) => {
          console.log(
            "Analytics error:",
            err.message
          );
        });
    };

    fetchStats();

    const interval = setInterval(
      fetchStats,
      5000
    );

    return () => clearInterval(interval);
  }, []);

  const safePercentage =
    stats.total > 0
      ? Math.round(
          (stats.safe / stats.total) * 100
        )
      : 0;

  const threatPercentage =
    stats.total > 0
      ? Math.round(
          (stats.harmful / stats.total) * 100
        )
      : 0;

  return (
    <div className="analytics-page">

      {/* HEADER */}

      <div className="analytics-page-header">

        <div>
          <h1 className="analytics-page-title">
            Analytics & Insights
          </h1>

          <p className="analytics-page-subtitle">
            Monitor crop protection activity and
            detection trends
          </p>
        </div>

        <div className="analytics-live">
          <span />
          LIVE DATA
        </div>

      </div>

      {/* SUMMARY CARDS */}

      <div className="analytics-summary-grid">

        <div className="analytics-summary-card">
          <span>Total Detections</span>
          <strong>{stats.total}</strong>
          <small>All recorded detections</small>
        </div>

        <div className="analytics-summary-card analytics-threat">
          <span>Threats Detected</span>
          <strong>{stats.harmful}</strong>
          <small>
            {threatPercentage}% of detections
          </small>
        </div>

        <div className="analytics-summary-card analytics-safe">
          <span>Safe Detections</span>
          <strong>{stats.safe}</strong>
          <small>
            {safePercentage}% of detections
          </small>
        </div>

        <div className="analytics-summary-card">
          <span>Threat Ratio</span>
          <strong>
            {threatPercentage}%
          </strong>
          <small>
            Harmful vs total detections
          </small>
        </div>

      </div>

      {/* CHARTS */}

      <div className="analytics-charts-grid">

        <div className="analytics-chart-card">
          <ThreatCharts type="distribution" />
        </div>

        <div className="analytics-chart-card">
          <ThreatCharts type="weekly" />
        </div>

      </div>

    </div>
  );
}

export default AnalyticsPage;