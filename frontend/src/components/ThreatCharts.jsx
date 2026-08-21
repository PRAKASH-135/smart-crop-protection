import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = [
  "#ef4444",
  "#f97316",
  "#a855f7",
  "#3b82f6",
  "#22c55e",
  "#eab308",
];

function ThreatCharts({ type = "distribution" }) {
  const [byObject, setByObject] = useState([]);
  const [byDay, setByDay] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://localhost:5000/api/analytics/detailed")
        .then((res) => {
          setByObject(
            res.data.byObject.map((d) => ({
              name: d._id,
              value: d.count,
            }))
          );

          setByDay(
            res.data.byDay.map((d) => ({
              day: d._id.slice(5),
              count: d.count,
            }))
          );
        })
        .catch((err) =>
          console.log("Chart data error:", err.message)
        );
    };

    fetchData();

    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, []);

  const total = byObject.reduce(
    (sum, d) => sum + d.value,
    0
  );

  // --------------------------------------------------
  // THREAT DISTRIBUTION
  // --------------------------------------------------

  if (type === "distribution") {
    return (
      <div className="chart-content">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">
              Threat Distribution
            </h3>

            <p className="chart-subtitle">
              Harmful detections by object
            </p>
          </div>

          <div className="chart-total">
            {total}
            <span>Total Threats</span>
          </div>
        </div>

        {byObject.length === 0 ? (
          <div className="chart-empty">
            No harmful detections yet.
          </div>
        ) : (
          <div className="distribution-layout">
            <div className="distribution-chart">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={byObject}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="55%"
                    outerRadius="82%"
                    paddingAngle={2}
                  >
                    {byObject.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          COLORS[
                            index % COLORS.length
                          ]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      background: "#0b1727",
                      border:
                        "1px solid rgba(101, 232, 138, 0.3)",
                      borderRadius: "10px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="donut-center">
                <strong>{total}</strong>
                <span>Total Threats</span>
              </div>
            </div>

            <div className="threat-legend">
              {byObject.map((item, index) => {
                const percentage =
                  total > 0
                    ? (
                        (item.value / total) *
                        100
                      ).toFixed(1)
                    : 0;

                return (
                  <div
                    className="threat-legend-item"
                    key={item.name}
                  >
                    <div className="legend-name">
                      <span
                        className="legend-dot"
                        style={{
                          backgroundColor:
                            COLORS[
                              index %
                                COLORS.length
                            ],
                        }}
                      />

                      <span>
                        {item.name}
                      </span>
                    </div>

                    <div className="legend-value">
                      {item.value}
                      <span>
                        ({percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // --------------------------------------------------
  // DETECTIONS THIS WEEK
  // --------------------------------------------------

  return (
    <div className="chart-content">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">
            Detections This Week
          </h3>

          <p className="chart-subtitle">
            Detection activity over time
          </p>
        </div>

        <select className="chart-select" defaultValue="week">
          <option value="week">
            This Week
          </option>

          <option value="month">
            This Month
          </option>
        </select>
      </div>

      <div className="weekly-chart">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={byDay}
            margin={{
              top: 15,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148, 163, 184, 0.12)"
            />

            <XAxis
              dataKey="day"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={{
                stroke:
                  "rgba(148, 163, 184, 0.2)",
              }}
            />

            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              contentStyle={{
                background: "#0b1727",
                border:
                  "1px solid rgba(101, 232, 138, 0.3)",
                borderRadius: "10px",
                color: "#fff",
              }}
            />

            <Line
              type="monotone"
              dataKey="count"
              stroke="#4ade80"
              strokeWidth={3}
              dot={{
                r: 5,
                fill: "#4ade80",
                strokeWidth: 0,
              }}
              activeDot={{
                r: 7,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ThreatCharts;