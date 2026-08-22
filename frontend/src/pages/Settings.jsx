import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Gear,
  Bell,
  Camera,
  Brain,
  Envelope,
  ShieldCheck,
  CheckCircle,
} from "@phosphor-icons/react";

function Settings() {
  const [monitoring, setMonitoring] = useState(true);
  const [autoSiren, setAutoSiren] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const [confidence, setConfidence] = useState(50);
  const [threatDuration, setThreatDuration] = useState(10);

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  /* =====================================================
     GET TOKEN
     ===================================================== */

  const getToken = () => {
    return localStorage.getItem("token");
  };

  /* =====================================================
     LOAD SETTINGS
     ===================================================== */

  useEffect(() => {
    const token = getToken();

    axios
      .get(
        "http://localhost:5000/api/settings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      .then((res) => {
        console.log(
          "Settings loaded:",
          res.data
        );

        const data = res.data;

        setMonitoring(
          data.monitoring
        );

        setAutoSiren(
          data.autoSiren
        );

        setEmailAlerts(
          data.emailAlerts
        );

        setConfidence(
          data.confidence
        );

        setThreatDuration(
          data.threatDuration
        );
      })

      .catch((error) => {
        console.error(
          "Settings fetch error:",
          error
        );

        if (error.response) {
          console.error(
            "Backend response:",
            error.response.data
          );
        }
      })

      .finally(() => {
        setLoading(false);
      });

  }, []);

  /* =====================================================
     SAVE SETTINGS
     ===================================================== */

  const saveSettings = async () => {
    try {
      const token = getToken();

      const settingsData = {
        monitoring,
        autoSiren,
        emailAlerts,
        confidence,
        threatDuration,
      };

      console.log(
        "Saving settings:",
        settingsData
      );

      const response = await axios.put(
        "http://localhost:5000/api/settings",
        settingsData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Settings saved:",
        response.data
      );

      /* ===============================================
         USE VALUES RETURNED FROM BACKEND
         =============================================== */

      const savedSettings =
        response.data.settings;

      setMonitoring(
        savedSettings.monitoring
      );

      setAutoSiren(
        savedSettings.autoSiren
      );

      setEmailAlerts(
        savedSettings.emailAlerts
      );

      setConfidence(
        savedSettings.confidence
      );

      setThreatDuration(
        savedSettings.threatDuration
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);

    } catch (error) {
      console.error(
        "Settings save failed:",
        error
      );

      if (error.response) {
        console.error(
          "Backend response:",
          error.response.data
        );
      }
    }
  };

  /* =====================================================
     TOGGLE
     ===================================================== */

  const Toggle = ({
    enabled,
    setEnabled,
  }) => {
    return (
      <button
        type="button"
        className={`settings-toggle ${
          enabled ? "enabled" : ""
        }`}
        onClick={() =>
          setEnabled(!enabled)
        }
      >
        <span />
      </button>
    );
  };

  /* =====================================================
     LOADING
     ===================================================== */

  if (loading) {
    return (
      <div className="settings-page">
        <div className="settings-loading">
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">

      {/* =================================================
          HEADER
         ================================================= */}

      <div className="settings-page-header">

        <div>

          <h1 className="settings-title">
            Settings
          </h1>

          <p className="settings-subtitle">
            Configure your AI crop protection
            system
          </p>

        </div>

        {saved && (
          <div className="settings-saved">

            <CheckCircle
              size={18}
              weight="fill"
            />

            Settings saved

          </div>
        )}

      </div>

      {/* =================================================
          SETTINGS GRID
         ================================================= */}

      <div className="settings-grid">

        {/* SYSTEM */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon">

              <Gear
                size={22}
                weight="duotone"
              />

            </div>

            <div>

              <h2>
                System
              </h2>

              <p>
                Core monitoring controls
              </p>

            </div>

          </div>

          {/* MONITORING */}

          <div className="settings-row">

            <div className="settings-row-info">

              <strong>
                System Monitoring
              </strong>

              <span>
                Enable real-time AI
                monitoring
              </span>

            </div>

            <Toggle
              enabled={monitoring}
              setEnabled={setMonitoring}
            />

          </div>

          {/* SIREN */}

          <div className="settings-row">

            <div className="settings-row-info">

              <strong>
                Automatic Siren
              </strong>

              <span>
                Activate siren for
                harmful detections
              </span>

            </div>

            <Toggle
              enabled={autoSiren}
              setEnabled={setAutoSiren}
            />

          </div>

          {/* EMAIL */}

          <div className="settings-row">

            <div className="settings-row-info">

              <strong>
                Email Alerts
              </strong>

              <span>
                Send threat notifications
                to owner
              </span>

            </div>

            <Toggle
              enabled={emailAlerts}
              setEnabled={setEmailAlerts}
            />

          </div>

        </section>

        {/* DETECTION */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon">

              <Brain
                size={22}
                weight="duotone"
              />

            </div>

            <div>

              <h2>
                Detection
              </h2>

              <p>
                AI detection configuration
              </p>

            </div>

          </div>

          {/* CONFIDENCE */}

          <div className="settings-input-row">

            <div>

              <strong>
                Confidence Threshold
              </strong>

              <span>
                Minimum confidence
                required
              </span>

            </div>

            <div className="settings-number">

              <input
                type="number"
                min="1"
                max="100"
                value={confidence}
                onChange={(e) =>
                  setConfidence(
                    Number(
                      e.target.value
                    )
                  )
                }
              />

              <span>
                %
              </span>

            </div>

          </div>

          <div className="settings-range">

            <input
              type="range"
              min="1"
              max="100"
              value={confidence}
              onChange={(e) =>
                setConfidence(
                  Number(
                    e.target.value
                  )
                )
              }
            />

          </div>

          {/* THREAT DURATION */}

          <div className="settings-input-row">

            <div>

              <strong>
                High Threat Duration
              </strong>

              <span>
                Time before WARNING
                becomes HIGH
              </span>

            </div>

            <div className="settings-number">

              <input
                type="number"
                min="1"
                max="60"
                value={threatDuration}
                onChange={(e) =>
                  setThreatDuration(
                    Number(
                      e.target.value
                    )
                  )
                }
              />

              <span>
                sec
              </span>

            </div>

          </div>

        </section>

        {/* NOTIFICATIONS */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon">

              <Bell
                size={22}
                weight="duotone"
              />

            </div>

            <div>

              <h2>
                Notifications
              </h2>

              <p>
                Alert delivery information
              </p>

            </div>

          </div>

          <div className="settings-info-row">

            <Envelope
              size={20}
              weight="duotone"
            />

            <div>

              <strong>
                Owner Email
              </strong>

              <span>
                Configured in backend
              </span>

            </div>

            <span className="configured">
              Configured
            </span>

          </div>

          <div className="settings-info-row">

            <Bell
              size={20}
              weight="duotone"
            />

            <div>

              <strong>
                Email Cooldown
              </strong>

              <span>
                Prevents repeated alerts
              </span>

            </div>

            <strong>
              60 sec
            </strong>

          </div>

        </section>

        {/* CAMERA */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-card-icon">

              <Camera
                size={22}
                weight="duotone"
              />

            </div>

            <div>

              <h2>
                Camera
              </h2>

              <p>
                Connected camera information
              </p>

            </div>

          </div>

          <div className="camera-status-box">

            <div className="camera-status-icon">

              <Camera
                size={25}
                weight="duotone"
              />

            </div>

            <div>

              <strong>
                CAM-01
              </strong>

              <span>
                Primary monitoring camera
              </span>

            </div>

            <div className="camera-online">

              <span />

              Connected

            </div>

          </div>

        </section>

        {/* SYSTEM INFORMATION */}

        <section className="settings-card settings-full">

          <div className="settings-card-header">

            <div className="settings-card-icon">

              <ShieldCheck
                size={22}
                weight="duotone"
              />

            </div>

            <div>

              <h2>
                System Information
              </h2>

              <p>
                Current technology stack
              </p>

            </div>

          </div>

          <div className="system-info-grid">

            <div>
              <span>
                AI Model
              </span>

              <strong>
                YOLOv8
              </strong>
            </div>

            <div>
              <span>
                Backend
              </span>

              <strong>
                Node.js + Express
              </strong>
            </div>

            <div>
              <span>
                Database
              </span>

              <strong>
                MongoDB
              </strong>
            </div>

            <div>
              <span>
                AI Service
              </span>

              <strong>
                FastAPI
              </strong>
            </div>

          </div>

        </section>

      </div>

      {/* =================================================
          SAVE BUTTON
         ================================================= */}

      <div className="settings-actions">

        <button
          type="button"
          className="settings-save-button"
          onClick={saveSettings}
        >

          <CheckCircle
            size={20}
            weight="duotone"
          />

          Save Settings

        </button>

      </div>

    </div>
  );
}

export default Settings;