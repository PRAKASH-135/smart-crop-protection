import { useState } from "react";

import StatRow from "../components/StatRow";
import ThreatCharts from "../components/ThreatCharts";
import Topbar from "../components/Topbar";
import CameraFeed from "../components/CameraFeed";
import DetectionCard from "../components/DetectionCard";

function Dashboard() {
  const [detectedObject, setDetectedObject] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [siren, setSiren] = useState(false);
  const [logs, setLogs] = useState([]);
  const [crop, setCrop] = useState("wheat");

  return (
    <div className="dashboard-page">

      {/* Header + Crop Selection */}
      <Topbar
        crop={crop}
        setCrop={setCrop}
      />

      {/* Statistics */}
      <StatRow />

      {/* Live Camera + Current Detection */}
      <div className="dashboard-main-grid">

        <div className="glass-panel rounded-[20px] overflow-hidden">
          <CameraFeed
            setDetectedObject={setDetectedObject}
            setConfidence={setConfidence}
            setSiren={setSiren}
            setLogs={setLogs}
            crop={crop}
          />
        </div>

        <DetectionCard
          detectedObject={detectedObject}
          confidence={confidence}
          siren={siren}
          crop={crop}
        />

      </div>

      {/* Large Analytics Row */}
      <div className="dashboard-charts-grid">

        {/* 50% - Threat Distribution */}
        <div className="glass-panel dashboard-chart-panel">
          <ThreatCharts type="distribution" />
        </div>

        {/* 50% - Detections This Week */}
        <div className="glass-panel dashboard-chart-panel">
          <ThreatCharts type="weekly" />
        </div>

      </div>

    </div>
  );
}

export default Dashboard;