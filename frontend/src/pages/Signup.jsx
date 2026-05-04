import { useState } from "react";
import API from "../services/api";
import StatusOverlay from "./StatusOverlay";

export default function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const { username, email, password } = form;
    if (username.length < 3) return "Username must be at least 3 characters.";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address.";

    if (password.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(password)) return "Password must have an uppercase letter.";
    if (!/[a-z]/.test(password)) return "Password must have a lowercase letter.";
    if (!/[0-9]/.test(password)) return "Password must have a number.";
    if (!/[^A-Za-z0-9]/.test(password)) return "Password must have a special character.";

    return null;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    
    const localError = validateForm();
    if (localError) {
      setError(localError);
      return;
    }

    setLoading(true);
    try {
      const payload = { ...form, email: form.email.toLowerCase() };
      await API.post("/auth/signup", payload);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || "Signup failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "calc(100vh - 64px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 20px",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo area */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, margin: "0 auto 16px",
            background: "linear-gradient(135deg,#F5B042,#E8760A)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, fontWeight: 900, color: "#000",
          }}>P</div>
          <h2 style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "1.75rem", fontWeight: 800, marginBottom: 8,
          }}>Create Account</h2>
          <p style={{ color: "var(--text2)", fontSize: 14 }}>
            Join PredictX and start forecasting commodity prices.
          </p>
        </div>

        {/* Card */}
        <div className="glass" style={{ padding: "36px 32px", position: "relative", overflow: "hidden" }}>
          
          {isSuccess && (
            <StatusOverlay 
              type="success" 
              title="Success!" 
              message="Your account has been created" 
              onConfirm={() => window.location.href = "/login"}
            />
          )}

          {error && (
            <div className="fade-up" style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "#ef4444",
              padding: "12px",
              borderRadius: "10px",
              marginBottom: "24px",
              fontSize: "14px",
              textAlign: "center",
              fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSignup}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Username */}
              <div>
                <label className="label" style={{ display: "block", marginBottom: 8 }}>Username</label>
                <input
                  type="text" required
                  className="inp"
                  placeholder="johndoe"
                  style={{ padding: "12px 16px", borderRadius: 10, fontSize: 15 }}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>

              {/* Email */}
              <div>
                <label className="label" style={{ display: "block", marginBottom: 8 }}>Email</label>
                <input
                  type="email" required
                  className="inp"
                  placeholder="you@example.com"
                  style={{ padding: "12px 16px", borderRadius: 10, fontSize: 15 }}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              {/* Password */}
              <div>
                <label className="label" style={{ display: "block", marginBottom: 8 }}>Password</label>
                <input
                  type="password" required
                  className="inp"
                  placeholder="Min 8 chars, 1 uppercase, 1 special"
                  style={{ padding: "12px 16px", borderRadius: 10, fontSize: 15 }}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-gold"
                style={{
                  width: "100%", padding: "14px", borderRadius: 10,
                  fontSize: 16, marginTop: 8,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                }}
              >
                {loading ? <><div className="spinner" /><span>Creating account…</span></> : "Create Account →"}
              </button>
            </div>
          </form>

          <hr className="divider" style={{ margin: "24px 0" }} />

          <p style={{ textAlign: "center", fontSize: 14, color: "var(--text2)" }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "var(--gold)", fontWeight: 600, textDecoration: "none" }}>
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}