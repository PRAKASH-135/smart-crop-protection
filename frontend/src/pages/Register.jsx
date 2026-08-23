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

  /* =====================================================
     CLEANUP CAMERA
     ===================================================== */

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());

        streamRef.current = null;
      }
    };
  }, []);

  /* =====================================================
     START FACE SCAN
     ===================================================== */

  const startFaceScan = async () => {
    try {
      setScanning(true);
      setFaceScanned(false);

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        alert(
          "Camera access is not supported by this browser."
        );

        setScanning(false);
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: {
              ideal: 640,
            },
            height: {
              ideal: 480,
            },
          },
          audio: false,
        });

      streamRef.current = stream;

      if (!videoRef.current) {
        alert("Camera preview is not ready.");

        stream
          .getTracks()
          .forEach((track) => track.stop());

        streamRef.current = null;
        setScanning(false);

        return;
      }

      const video = videoRef.current;

      video.srcObject = stream;

      /* ---------------------------------------------
         Wait for camera metadata
         --------------------------------------------- */

      await new Promise((resolve, reject) => {
        if (
          video.readyState >= 2 &&
          video.videoWidth > 0 &&
          video.videoHeight > 0
        ) {
          video
            .play()
            .then(resolve)
            .catch(reject);

          return;
        }

        video.onloadedmetadata = async () => {
          try {
            await video.play();
            resolve();
          } catch (error) {
            reject(error);
          }
        };
      });

      const capturedImages = [];

      console.log(
        "Camera ready:",
        video.videoWidth,
        "x",
        video.videoHeight
      );

      /* ---------------------------------------------
         Capture 30 face samples
         --------------------------------------------- */

      for (let i = 0; i < 30; i++) {
        const canvas =
          document.createElement("canvas");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context =
          canvas.getContext("2d");

        if (!context) {
          continue;
        }

        context.drawImage(
          video,
          0,
          0,
          canvas.width,
          canvas.height
        );

        const blob =
          await new Promise((resolve) => {
            canvas.toBlob(
              resolve,
              "image/jpeg",
              0.85
            );
          });

        if (blob) {
          capturedImages.push(blob);

          console.log(
            `Captured sample ${i + 1}/30`
          );
        }

        await new Promise((resolve) =>
          setTimeout(resolve, 500)
        );
      }

      console.log(
        "Total captured:",
        capturedImages.length
      );

      /* ---------------------------------------------
         Stop camera
         --------------------------------------------- */

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());

        streamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      /* ---------------------------------------------
         Check samples
         --------------------------------------------- */

      if (capturedImages.length < 10) {
        alert(
          "Unable to capture enough face samples. Please try again."
        );

        setFaceScanned(false);
        setScanning(false);

        return;
      }

      /* ---------------------------------------------
         Create FormData
         --------------------------------------------- */

      const formData = new FormData();

      capturedImages.forEach(
        (image, index) => {
          formData.append(
            "files",
            image,
            `face_${index}.jpg`
          );
        }
      );

      console.log(
        "Sending face samples to AI service..."
      );

      /* ---------------------------------------------
         Send to FastAPI
         --------------------------------------------- */

      const response =
        await axios.post(
          "http://127.0.0.1:8000/enroll-owner",
          formData
        );

      console.log(
        "AI enrollment response:",
        response.data
      );

      /* ---------------------------------------------
         Handle response
         --------------------------------------------- */

      if (response.data.success) {
        setFaceScanned(true);

        alert(
          `Face enrollment successful. ${response.data.samples} samples saved.`
        );
      } else {
        setFaceScanned(false);

        alert(
          response.data.message ||
          "Face enrollment failed."
        );
      }

    } catch (error) {
      console.error(
        "Face enrollment error:",
        error
      );

      setFaceScanned(false);

      alert(
        error.response?.data?.message ||
        "Face enrollment failed. Please try again."
      );

    } finally {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());

        streamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      setScanning(false);
    }
  };

  /* =====================================================
     NEXT STEP
     ===================================================== */

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

  /* =====================================================
     PREVIOUS STEP
     ===================================================== */

  const previousStep = () => {
    setStep((current) =>
      Math.max(current - 1, 1)
    );
  };

  /* =====================================================
     COMPLETE REGISTRATION
     ===================================================== */

  const completeRegistration = async () => {
    try {
      if (!faceScanned) {
        alert(
          "Please complete the face scan before registering."
        );

        return;
      }

      console.log(
        "Face enrollment verified. Creating owner account..."
      );

      const response =
        await axios.post(
          "http://localhost:5000/api/auth/register",
          {
            name,
            email,
            password,
            location,
            faceScanned: true,
          }
        );

      console.log(
        "Registration response:",
        response.data
      );

      alert(
        response.data.message ||
        "Registration successful!"
      );

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

      <div className="register-bg" />

      <div className="register-content">

        {/* =================================================
            BACK TO LOGIN
            ================================================= */}

        <button
          type="button"
          className="register-back"
          onClick={() =>
            window.location.href = "/login"
          }
        >
          ← Back to Login
        </button>

        {/* =================================================
            BRAND
            ================================================= */}

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

        {/* =================================================
            STEPS
            ================================================= */}

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

                <label htmlFor="owner-name">
                  Name
                </label>

                <div className="register-input">

                  <span>♙</span>

                  <input
                    id="owner-name"
                    type="text"
                    name="name"
                    autoComplete="name"
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

                <label htmlFor="owner-email">
                  Email
                </label>

                <div className="register-input">

                  <span>✉</span>

                  <input
                    id="owner-email"
                    type="email"
                    name="email"
                    autoComplete="email"
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

                <label htmlFor="owner-password">
                  Password
                </label>

                <div className="register-input">

                  <span>🔒</span>

                  <input
                    id="owner-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    autoComplete="new-password"
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

                <label htmlFor="confirm-password">
                  Confirm Password
                </label>

                <div className="register-input">

                  <span>🔒</span>

                  <input
                    id="confirm-password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    autoComplete="new-password"
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

                <label htmlFor="system-location">
                  System Location
                </label>

                <div className="register-input">

                  <span>⌖</span>

                  <input
                    id="system-location"
                    type="text"
                    name="location"
                    autoComplete="address-line1"
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

            {/* =================================================
                FACE SCAN
                ================================================= */}

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

                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="face-video"
                  style={{
                    display: scanning
                      ? "block"
                      : "none",
                  }}
                />

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
                  type="button"
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
                type="button"
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
                type="button"
                className="register-secondary"
                onClick={previousStep}
              >
                ← Back
              </button>

              <button
                type="button"
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
                type="button"
                className="register-secondary"
                onClick={previousStep}
              >
                ← Back
              </button>

              <button
                type="button"
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
              type="button"
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