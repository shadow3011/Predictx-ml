import { useState } from "react";
import API from "../services/api";
import StatusOverlay from "./StatusOverlay";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isSignupSuccess = new URLSearchParams(window.location.search).get("signup") === "success";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, email: form.email.toLowerCase() };
      const res = await API.post("/auth/login", payload);
      localStorage.setItem("token", res.data.token);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setError("We couldn't find an account with those credentials. Please check your details and try again.");
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
          }}>Welcome Back</h2>
          <p style={{ color: "var(--text2)", fontSize: 14 }}>
            Sign in to access your forecasting dashboard.
          </p>
        </div>

        {/* Card */}
        <div className="glass" style={{ padding: "36px 32px", position: "relative", overflow: "hidden" }}>
          
          {error && (
            <StatusOverlay 
              type="error" 
              title="Login Failed" 
              message={error} 
              onConfirm={() => setError("")}
            />
          )}

          {isSignupSuccess && !error && (
            <div className="fade-up" style={{
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              color: "#10b981",
              padding: "12px",
              borderRadius: "10px",
              marginBottom: "24px",
              fontSize: "14px",
              textAlign: "center",
              fontWeight: 500,
            }}>
              Account created! Please sign in.
            </div>
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

          <form onSubmit={handleLogin}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

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
                  placeholder="••••••••"
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
                {loading ? <><div className="spinner" /><span>Signing in…</span></> : "Sign In →"}
              </button>
            </div>
          </form>

          <hr className="divider" style={{ margin: "24px 0" }} />

          <p style={{ textAlign: "center", fontSize: 14, color: "var(--text2)" }}>
            Don't have an account?{" "}
            <a href="/signup" style={{ color: "var(--gold)", fontWeight: 600, textDecoration: "none" }}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}