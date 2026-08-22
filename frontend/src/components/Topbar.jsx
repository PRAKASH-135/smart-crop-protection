import {
  Check,
  Bell,
  CaretDown,
  SignOut,
} from "@phosphor-icons/react";

import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

function Topbar({ crop, setCrop }) {

  const navigate = useNavigate();

  const [notifications, setNotifications] =
    useState([]);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [showProfile, setShowProfile] =
    useState(false);

  /* =====================================================
     FETCH NOTIFICATIONS
     ===================================================== */

  useEffect(() => {

    const fetchNotifications = async () => {

      try {

        const token =
          localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/logs",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch notifications"
          );
        }

        const logs =
          await response.json();

        /*
         * Only harmful detections
         */

       const alerts = logs.filter(
  (log) => log.harmful === true
);

setNotifications(alerts);

      } catch (error) {

        console.error(
          "Notification fetch error:",
          error
        );

      }

    };

    fetchNotifications();

    const interval =
      setInterval(
        fetchNotifications,
        5000
      );

    return () =>
      clearInterval(interval);

  }, []);

  /* =====================================================
     CROPS
     ===================================================== */

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

  /* =====================================================
     LOGGED-IN USER
     ===================================================== */

  const storedUser =
    localStorage.getItem("user");

  let user = null;

  try {

    user = storedUser
      ? JSON.parse(storedUser)
      : null;

  } catch {

    user = null;

  }

  const userName =
    user?.name || "Owner";

  const userEmail =
    user?.email || "Owner account";

  const avatarLetter =
    userName
      .charAt(0)
      .toUpperCase();

  /* =====================================================
     LOGOUT
     ===================================================== */

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/login", {
      replace: true,
    });

  };

  return (
    <>

      {/* =================================================
          DASHBOARD HEADER
         ================================================= */}

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

          {/* SYSTEM STATUS */}

          <div className="system-status">

            <span className="status-dot" />

            System Online

          </div>


          {/* =================================================
              BRIGHTNESS
             ================================================= */}

        


          {/* =================================================
              NOTIFICATIONS
             ================================================= */}

          <div className="notification-wrapper">

            <button
              className="header-icon-button"
              type="button"
              title="Notifications"
              onClick={() =>
                setShowNotifications(
                  !showNotifications
                )
              }
            >

              <Bell
                size={25}
                weight="duotone"
              />

              {notifications.length >
                0 && (

                <span className="notification-badge">

                  {notifications.length}

                </span>

              )}

            </button>


            {/* NOTIFICATION DROPDOWN */}

            {showNotifications && (

              <div className="notification-dropdown">

                <div className="notification-header">

                  <strong>
                    Notifications
                  </strong>

                  <span>
                    {notifications.length} alerts
                  </span>

                </div>


                <div className="notification-list">

                  {notifications.length ===
                  0 ? (

                    <div className="notification-empty">

                      <Bell
                        size={24}
                        weight="duotone"
                      />

                      <span>
                        No recent alerts
                      </span>

                    </div>

                  ) : (

                    notifications.map(
                      (
                        notification,
                        index
                      ) => (

                        <div
                          className="notification-item"
                          key={
                            notification._id ||
                            index
                          }
                        >

                          <div className="notification-icon">
                            🔴
                          </div>

                          <div className="notification-content">

                            <strong>

                              {notification.object ||
                                notification.detectedObject ||
                                "Unknown object"}

                              {" detected"}

                            </strong>

                            <span>

                              {notification.threatLevel ||
                                "WARNING"}

                              {" • "}

                              {notification.crop ||
                                "Field"}

                            </span>

                          </div>

                        </div>

                      )
                    )

                  )}

                </div>


                {/* VIEW ALL */}

                <button
                  type="button"
                  className="notification-view-all"
                  onClick={() => {

                    setShowNotifications(
                      false
                    );

                    navigate("/logs");

                  }}
                >

                  View all detection logs →

                </button>

              </div>

            )}

          </div>


          {/* =================================================
              PROFILE
             ================================================= */}

          <div className="profile-wrapper">

            <button
              type="button"
              className="profile"
              onClick={() => {

                setShowProfile(
                  !showProfile
                );

                setShowNotifications(
                  false
                );

              }}
            >

              <div className="profile-avatar">

                {avatarLetter}

              </div>

              <div>

                <div className="profile-name">

                  {userName}

                </div>

                <div className="profile-role">

                  Owner

                </div>

              </div>

              <CaretDown
                size={16}
                className={
                  showProfile
                    ? "profile-arrow-open"
                    : ""
                }
              />

            </button>


            {/* PROFILE DROPDOWN */}

            {showProfile && (

              <div className="profile-dropdown">

                <div className="profile-dropdown-header">

                  <div className="profile-dropdown-avatar">

                    {avatarLetter}

                  </div>

                  <div>

                    <strong>
                      {userName}
                    </strong>

                    <span>
                      {userEmail}
                    </span>

                  </div>

                </div>


                <div className="profile-dropdown-divider" />


                {/* SETTINGS */}

                <button
                  type="button"
                  className="profile-dropdown-settings"
                  onClick={() => {

                    setShowProfile(
                      false
                    );

                    navigate(
                      "/settings"
                    );

                  }}
                >

                  ⚙️ Settings

                </button>


                {/* LOGOUT */}

                <button
                  type="button"
                  className="profile-dropdown-logout"
                  onClick={
                    handleLogout
                  }
                >

                  <SignOut
                    size={18}
                    weight="duotone"
                  />

                  Logout

                </button>

              </div>

            )}

          </div>

        </div>

      </header>


      {/* =================================================
          CROP SELECTION
         ================================================= */}

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

          const selected =
            crop === item.id;

          return (

            <button
              key={item.id}
              type="button"
              onClick={() =>
                setCrop(item.id)
              }
              className={`crop-card ${
                selected
                  ? "selected"
                  : ""
              }`}
            >

              {selected && (

                <span className="crop-check">

                  <Check
                    size={18}
                    weight="bold"
                  />

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