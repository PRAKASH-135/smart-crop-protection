import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from "recharts";

const COLORS = ["#ef4444", "#f97316", "#a855f7", "#3b82f6", "#22c55e", "#eab308"];

function ThreatCharts() {
  const [byObject, setByObject] = useState([]);
  const [byDay, setByDay] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      axios.get("http://localhost:5000/api/analytics/detailed")
        .then(res => {
          setByObject(res.data.byObject.map(d => ({ name: d._id, value: d.count })));
          setByDay(res.data.byDay.map(d => ({ day: d._id.slice(5), count: d.count })));
        })
        .catch(err => console.log("Chart data error:", err.message));
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const total = byObject.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="grid grid-cols-2 gap-4">

      <div className="bg-[#0b1727] rounded-xl p-4 border border-gray-800 shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Threat Distribution</h3>
        {byObject.length === 0 ? (
          <p className="text-gray-500 text-sm">No harmful detections yet.</p>
        ) : (
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byObject}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {byObject.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#111f35", border: "1px solid #374151" }} />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center text-gray-400 text-sm mt-1">{total} total threats</p>
          </div>
        )}
      </div>

      <div className="bg-[#0b1727] rounded-xl p-4 border border-gray-800 shadow-lg">
        <h3 className="text-lg font-semibold mb-2">Detections This Week</h3>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={byDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip contentStyle={{ background: "#111f35", border: "1px solid #374151" }} />
              <Line type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

export default ThreatCharts;