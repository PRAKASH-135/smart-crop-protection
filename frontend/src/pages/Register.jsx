import { useEffect, useRef, useState } from "react";
import axios from "axios";

function Register() {
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");

  

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [scanning, setScanning] = useState(false);
  const [faceScanned, setFaceScanned] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  const startFaceScan = async () => {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setScanning(true);

      // Frontend demo scan
      setTimeout(() => {
        setScanning(false);
        setFaceScanned(true);

        if (streamRef.current) {
          streamRef.current
            .getTracks()
            .forEach((track) => track.stop());
        }
      }, 3000);

    } catch (error) {
      console.error(
        "Camera access error:",
        error
      );

      alert(
        "Camera access was denied or is unavailable."
      );
    }
  };

  const nextStep = () => {
    if (step === 1) {

      if (!name.trim()) {
        alert("Please enter your name.");
        return;
      }

      if (!email.trim()) {
        alert("Please enter your email.");
        return;
      }

      if (!password.trim()) {
        alert("Please create a password.");
        return;
      }

      if (password.length < 6) {
        alert(
          "Password must be at least 6 characters."
        );
        return;
      }

      if (!confirmPassword.trim()) {
        alert(
          "Please confirm your password."
        );
        return;
      }

      if (password !== confirmPassword) {
        alert(
          "Passwords do not match."
        );
        return;
      }

      if (!location.trim()) {
        alert(
          "Please enter your system location."
        );
        return;
      }

      if (!faceScanned) {
        alert(
          "Please complete the face scan."
        );
        return;
      }
    }

    setStep((current) =>
      Math.min(current + 1, 4)
    );
  };

  const previousStep = () => {
    setStep((current) =>
      Math.max(current - 1, 1)
    );
  };

 const completeRegistration = async () => {
  try {

    const response = await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        name,
        email,
        password,
        location,
        faceScanned,
      }
    );

    alert(response.data.message);

    window.location.href = "/login";

  } catch (error) {

    console.error(
      "Registration error:",
      error
    );

    alert(
      error.response?.data?.error ||
      "Registration failed. Please try again."
    );
  }
};

  return (
    <div className="register-page">

      {/* Background */}

      <div className="register-bg" />

      <div className="register-content">

        {/* Back to Login */}

        <button
          className="register-back"
          onClick={() =>
            window.location.href = "/login"
          }
        >
          ← Back to Login
        </button>

        {/* BRAND */}

        <div className="register-brand">

          <div className="register-logo">
            🌱
          </div>

          <h1>
            Owner Registration
          </h1>

          <p>
            Register owner details for secure access
          </p>

        </div>

        {/* STEPS */}

        <div className="register-steps">

          {[
            "Owner Details",
            "Face Scan",
            "Review",
            "Complete",
          ].map((title, index) => {

            const number = index + 1;

            return (
              <div
                className="register-step-wrapper"
                key={title}
              >

                <div
                  className={`register-step ${
                    step >= number
                      ? "active"
                      : ""
                  }`}
                >
                  {number}
                </div>

                <span
                  className={
                    step >= number
                      ? "active"
                      : ""
                  }
                >
                  {title}
                </span>

                {number < 4 && (
                  <div
                    className={`register-step-line ${
                      step > number
                        ? "active"
                        : ""
                    }`}
                  />
                )}

              </div>
            );
          })}

        </div>

        {/* =================================================
            STEP 1
           ================================================= */}

        {step === 1 && (

          <div className="register-card">

            {/* OWNER DETAILS */}

            <div className="register-details">

              <h2>
                Owner Details
              </h2>

              <p className="register-section-text">
                Enter your details to create your
                secure owner profile.
              </p>

              {/* NAME */}

              <div className="register-field">

                <label>
                  Name
                </label>

                <div className="register-input">

                  <span>♙</span>

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div className="register-field">

                <label>
                  Email
                </label>

                <div className="register-input">

                  <span>✉</span>

                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div className="register-field">

                <label>
                  Password
                </label>

                <div className="register-input">

                  <span>🔒</span>

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    style={{
                      border: "none",
                      background:
                        "transparent",
                      color: "#8fa9a0",
                      cursor: "pointer",
                    }}
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>

              {/* CONFIRM PASSWORD */}

              <div className="register-field">

                <label>
                  Confirm Password
                </label>

                <div className="register-input">

                  <span>🔒</span>

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    style={{
                      border: "none",
                      background:
                        "transparent",
                      color: "#8fa9a0",
                      cursor: "pointer",
                    }}
                  >
                    {showConfirmPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>

              {/* LOCATION */}

              <div className="register-field">

                <label>
                  System Location
                </label>

                <div className="register-input">

                  <span>⌖</span>

                  <input
                    type="text"
                    placeholder="Enter system / farm location"
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
                    }
                  />

                </div>

                <small>
                  Example: North Field, Farm House,
                  Sector 12
                </small>

              </div>

            </div>

            {/* FACE SCAN */}

            <div className="register-face-section">

              <h2>
                Face Scan
              </h2>

              <p className="register-section-text">
                Look at the camera and stay still
              </p>

              <div className="face-scan-box">

                {!scanning && !faceScanned && (
                  <div className="face-placeholder">

                    <div className="face-circle">
                      👤
                    </div>

                  </div>
                )}

                {scanning && (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="face-video"
                  />
                )}

                {faceScanned && (
                  <div className="face-success">

                    <div className="face-success-icon">
                      ✓
                    </div>

                    <strong>
                      Face Scan Complete
                    </strong>

                    <span>
                      Identity captured
                    </span>

                  </div>
                )}

                <div className="face-corners">

                  <i className="corner top-left" />

                  <i className="corner top-right" />

                  <i className="corner bottom-left" />

                  <i className="corner bottom-right" />

                </div>

              </div>

              {!faceScanned && (
                <button
                  className="face-scan-button"
                  onClick={startFaceScan}
                  disabled={scanning}
                >
                  📷{" "}
                  {scanning
                    ? "Scanning..."
                    : "Start Face Scan"}
                </button>
              )}

              {faceScanned && (
                <div className="scan-complete">
                  ✓ Face scan completed
                </div>
              )}

            </div>

            {/* NEXT */}

            <div className="register-actions">

              <button
                className="register-next"
                onClick={nextStep}
              >
                Next →
              </button>

            </div>

          </div>
        )}

        {/* =================================================
            STEP 2
           ================================================= */}

        {step === 2 && (

          <div className="register-simple-card">

            <h2>
              Face Scan
            </h2>

            <p>
              Your face scan has been completed.
            </p>

            <div className="review-success">
              ✓
            </div>

            <h3>
              Face Successfully Registered
            </h3>

            <p>
              Your face data will be associated
              with the owner account.
            </p>

            <div className="register-actions">

              <button
                className="register-secondary"
                onClick={previousStep}
              >
                ← Back
              </button>

              <button
                className="register-next"
                onClick={nextStep}
              >
                Continue →
              </button>

            </div>

          </div>
        )}

        {/* =================================================
            STEP 3
           ================================================= */}

        {step === 3 && (

          <div className="register-simple-card">

            <h2>
              Review Details
            </h2>

            <p>
              Check your information before
              completing registration.
            </p>

            <div className="review-details">

              <div>
                <span>Name</span>
                <strong>{name}</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{email}</strong>
              </div>

              <div>
                <span>System Location</span>
                <strong>{location}</strong>
              </div>

              <div>
                <span>Face Scan</span>
                <strong className="review-green">
                  ✓ Completed
                </strong>
              </div>

            </div>

            <div className="register-actions">

              <button
                className="register-secondary"
                onClick={previousStep}
              >
                ← Back
              </button>

              <button
                className="register-next"
                onClick={nextStep}
              >
                Confirm →
              </button>

            </div>

          </div>
        )}

        {/* =================================================
            STEP 4
           ================================================= */}

        {step === 4 && (

          <div className="register-simple-card complete-card">

            <div className="complete-icon">
              ✓
            </div>

            <h2>
              Registration Complete
            </h2>

            <p>
              Your owner account has been successfully
              prepared.
            </p>

            <button
              className="register-next"
              onClick={completeRegistration}
            >
              Continue to Login →
            </button>

          </div>
        )}

      </div>

    </div>
  );
}

export default Register;