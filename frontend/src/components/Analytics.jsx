import { useEffect, useState } from "react";
import axios from "axios";

function Analytics() {
  const [stats, setStats] = useState({ total: 0, harmful: 0, safe: 0 });

  useEffect(() => {
    const fetchStats = () => {
      axios
        .get("http://localhost:5000/api/analytics")
        .then(res => {
          setStats(res.data);
        })
        .catch(err => {
          console.log("Analytics fetch error:", err.message);
        });
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0b1727] rounded-2xl p-5 border border-gray-800 shadow-lg">
      <h2 className="text-2xl font-semibold mb-5">
        Analytics
      </h2>
      <div className="space-y-5">
        <div className="bg-[#111f35] p-4 rounded-xl">
          <p className="text-gray-400">
            Total Detections
          </p>
          <h3 className="text-3xl font-bold mt-2">
            {stats.total}
          </h3>
        </div>
        <div className="bg-[#111f35] p-4 rounded-xl">
          <p className="text-gray-400">
            Alerts Triggered
          </p>
          <h3 className="text-3xl font-bold mt-2 text-red-400">
            {stats.harmful}
          </h3>
        </div>
        <div className="bg-[#111f35] p-4 rounded-xl">
          <p className="text-gray-400">
            Safe Detections
          </p>
          <h3 className="text-3xl font-bold mt-2 text-green-400">
            {stats.safe}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default Analytics;