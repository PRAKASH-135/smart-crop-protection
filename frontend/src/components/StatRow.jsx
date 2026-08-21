import { useEffect, useState } from "react";
import axios from "axios";
import {
  Crosshair,
  Warning,
  BellRinging,
  Siren,
  VideoCamera,
} from "@phosphor-icons/react";

function StatRow() {
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
            "Stats fetch error:",
            err.message
          );
        });
    };

    fetchStats();

    const interval = setInterval(fetchStats, 5000);

    return () => clearInterval(interval);
  }, []);

  const cards = [
    {
      label: "Total Detections",
      value: stats.total,
      icon: Crosshair,
      change: "Live monitoring",
    },
    {
      label: "Threats Detected",
      value: stats.harmful,
      icon: Warning,
      change: "Requires attention",
    },
    {
      label: "Alerts Triggered",
      value: stats.harmful,
      icon: BellRinging,
      change: "AI generated",
    },
    {
      label: "Siren Activations",
      value: stats.harmful,
      icon: Siren,
      change: "Automatic response",
    },
    {
      label: "Active Cameras",
      value: "1 / 1",
      icon: VideoCamera,
      change: "Online",
    },
  ];

  return (
    <section className="stats-grid">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div className="stat-card" key={card.label}>
            <div className="stat-icon">
              <Icon size={25} weight="duotone" />
            </div>

            <div>
              <div className="stat-label">
                {card.label}
              </div>

              <div className="stat-value">
                {card.value}
              </div>

              <div className="stat-change">
                {card.change}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default StatRow;