import {
  Check,
  Bell,
  Sun,
  CaretDown,
} from "@phosphor-icons/react";

function Topbar({ crop, setCrop }) {
  const crops = [
    {
      id: "wheat",
      label: "Wheat",
      sub: "Field Crop",
      emoji: "🌾",
    },
    {
      id: "rice",
      label: "Rice",
      sub: "Paddy Crop",
      emoji: "🌾",
    },
    {
      id: "sugarcane",
      label: "Sugarcane",
      sub: "Cash Crop",
      emoji: "🎋",
    },
    {
      id: "maize",
      label: "Maize",
      sub: "Field Crop",
      emoji: "🌽",
    },
  ];

  return (
    <>
      <header className="dashboard-header">
        <div className="header-brand">
          <div className="brand-logo">
            <span>🌱</span>
          </div>

          <div>
            <div className="header-title">
              AI CROP PROTECTION
            </div>

            <div className="header-subtitle">
              Intelligent Intrusion Alert System
            </div>
          </div>
        </div>

        <div className="header-actions">
          <div className="system-status">
            <span className="status-dot" />
            System Online
          </div>

          <button className="header-icon-button" type="button">
            <Sun size={26} weight="duotone" />
          </button>

          <button className="header-icon-button" type="button">
            <Bell size={25} weight="duotone" />

            <span className="notification-badge">
              8
            </span>
          </button>

          <div className="profile">
            <div className="profile-avatar">
              P
            </div>

            <div>
              <div className="profile-name">
                Prakash
              </div>

              <div className="profile-role">
                Admin
              </div>
            </div>

            <CaretDown size={16} />
          </div>
        </div>
      </header>

      <section className="glass-panel crop-panel">
        <div className="crop-intro">
          <div className="crop-intro-title">
            Select Crop
          </div>

          <div className="crop-intro-text">
            Choose the crop you want to monitor
          </div>
        </div>

        {crops.map((item) => {
          const selected = crop === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCrop(item.id)}
              className={`crop-card ${selected ? "selected" : ""}`}
            >
              {selected && (
                <span className="crop-check">
                  <Check size={18} weight="bold" />
                </span>
              )}

              <div className="crop-icon">
                {item.emoji}
              </div>

              <div className="crop-name">
                {item.label}
              </div>

              <div className="crop-subtitle">
                {item.sub}
              </div>
            </button>
          );
        })}
      </section>
    </>
  );
}

export default Topbar;