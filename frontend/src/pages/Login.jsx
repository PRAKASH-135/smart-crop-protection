import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("LOGIN BUTTON CLICKED");

    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      console.log("Sending login request...");

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log(
        "Login response:",
        response.data
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Login successful!");

      window.location.href = "/";

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      setError(
        error.response?.data?.error ||
        "Login failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-bg" />

      <div className="login-content">

        {/* BRAND */}

        <div className="login-brand">

          <div className="login-brand-logo">
            🌱
          </div>

          <h1>
            <span>AI</span> CROP PROTECTION
          </h1>

          <p>
            Intelligent Intrusion Alert System
          </p>

        </div>

        {/* LOGIN CARD */}

        <div className="login-card">

          <div className="login-card-header">

            <h2>
              Welcome Back!
            </h2>

            <p>
              Login to continue
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            {/* PASSWORD */}

            <label>
              Password
            </label>

            <div className="password-box">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
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
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

            {/* OPTIONS */}

            <div className="login-options">

              <label className="remember">

                <input
                  type="checkbox"
                />

                <span>
                  Remember me
                </span>

              </label>

              <button
                type="button"
                className="forgot"
              >
                Forgot password?
              </button>

            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "➜ Login"}
            </button>

          </form>

          {/* DIVIDER */}

          <div className="login-divider">

            <span />

            <b>OR</b>

            <span />

          </div>

          {/* GOOGLE */}

          <button
            type="button"
            className="social-button"
          >
            G&nbsp;&nbsp; Continue with Google
          </button>

          {/* MICROSOFT */}

          <button
            type="button"
            className="social-button"
          >
            ▦&nbsp;&nbsp; Continue with Microsoft
          </button>

          {/* REGISTER */}

          <div className="register-text">

            Don't have an account?

            <button
              type="button"
              onClick={() =>
                window.location.href =
                  "/register"
              }
            >
              Register
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;