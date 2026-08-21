import { useState } from "react";
import Topbar from "../components/Topbar";
import CameraFeed from "../components/CameraFeed";
import DetectionCard from "../components/DetectionCard";
import LogsTable from "../components/LogsTable";
import Analytics from "../components/Analytics";

function Dashboard() {
  const [detectedObject, setDetectedObject] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [siren, setSiren] = useState(false);
  const [logs, setLogs] = useState([]);
  const [crop, setCrop] = useState("wheat");

  return (
    <div className="p-6 overflow-auto bg-[#07111f] text-white min-h-screen">
      <Topbar
        crop={crop}
        setCrop={setCrop}
      />
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="col-span-2">
          <CameraFeed
            setDetectedObject={setDetectedObject}
            setConfidence={setConfidence}
            setSiren={setSiren}
            setLogs={setLogs}
            crop={crop}
          />
        </div>
        <div>
          <DetectionCard
            detectedObject={detectedObject}
            confidence={confidence}
            siren={siren}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="col-span-2">
          <LogsTable logs={logs} />
        </div>
        <div>
          <Analytics />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;