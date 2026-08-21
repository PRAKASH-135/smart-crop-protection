import {
  House,
  Monitor,
  ClipboardText,
  ChartBar,
  Camera,
  ShieldCheck,
  Bell,
  Gear,
  Leaf,
} from "@phosphor-icons/react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const items = [
    { label: "Dashboard", icon: House, path: "/" },
    { label: "Live Monitor", icon: Monitor, path: "/" },
    { label: "Detection Logs", icon: ClipboardText, path: "/logs" },
    { label: "Analytics", icon: ChartBar, path: "/" },
    { label: "Cameras", icon: Camera, path: "/" },
    { label: "Crop Rules", icon: ShieldCheck, path: "/" },
    { label: "Alerts", icon: Bell, path: "/" },
    { label: "Settings", icon: Gear, path: "/" },
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="header-brand">
          <div className="brand-logo">
            <Leaf size={24} weight="duotone" />
          </div>

          <div>
            <div className="sidebar-brand-title">
              AI CROP PROTECTION
            </div>

            <div className="sidebar-brand-subtitle">
              Intelligent Intrusion Alert System
            </div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            end={label === "Dashboard"}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">
              <Icon size={21} weight="duotone" />
            </span>

            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-title">
          Smart Farming
        </div>

        <div className="sidebar-footer-text">
          Better Protection
          <br />
          Better Tomorrow
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;