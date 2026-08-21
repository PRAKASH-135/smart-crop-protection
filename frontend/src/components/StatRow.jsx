import { useEffect, useState } from "react";
import axios from "axios";

function StatRow() {
  const [stats, setStats] = useState({ total: 0, harmful: 0, safe: 0 });

  useEffect(() => {
    const fetchStats = () => {
      axios
        .get("http://localhost:5000/api/analytics")
        .then(res => setStats(res.data))
        .catch(err => console.log("Stats fetch error:", err.message));
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    { label: "Total Detections", value: stats.total, color: "text-white" },
    { label: "Threats Detected", value: stats.harmful, color: "text-red-400" },
    { label: "Safe Detections", value: stats.safe, color: "text-green-400" }
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-[#0b1727] rounded-xl p-4 border border-gray-800 shadow-lg">
          <p className="text-gray-400 text-sm">{c.label}</p>
          <h3 className={`text-3xl font-bold mt-1 ${c.color}`}>{c.value}</h3>
        </div>
      ))}
    </div>
  );
}
export default StatRow;