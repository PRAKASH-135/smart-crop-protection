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
  SignOut,
} from "@phosphor-icons/react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const items = [
    {
      label: "Dashboard",
      icon: House,
      path: "/",
    },
    {
      label: "Detection Logs",
      icon: ClipboardText,
      path: "/logs",
    },
    {
      label: "Analytics",
      icon: ChartBar,
      path: "/analytics",
    },
    {
      label: "Crop Rules",
      icon: ShieldCheck,
      path: "/crop-rules",
    },
    {
      label: "Settings",
      icon: Gear,
      path: "/settings",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside className="app-sidebar">

      {/* BRAND */}

      <div className="sidebar-brand">

        <div className="header-brand">

          <div className="brand-logo">
            <Leaf
              size={24}
              weight="duotone"
            />
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

      {/* NAVIGATION */}

      <nav className="sidebar-nav">

        {items.map(
          ({
            label,
            icon: Icon,
            path,
          }) => (

            <NavLink
              key={label}
              to={path}
              end={label === "Dashboard"}
              className={({ isActive }) =>
                `sidebar-item ${
                  isActive ? "active" : ""
                }`
              }
            >

              <span className="sidebar-icon">

                <Icon
                  size={21}
                  weight="duotone"
                />

              </span>

              <span>
                {label}
              </span>

            </NavLink>

          )
        )}

      </nav>

      {/* FOOTER */}

      <div className="sidebar-footer">

        <div className="sidebar-footer-title">
          Smart Farming
        </div>

        <div className="sidebar-footer-text">
          Better Protection
          <br />
          Better Tomorrow
        </div>

        {/* LOGOUT */}

        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >

          <SignOut
            size={20}
            weight="duotone"
          />

          <span>
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;