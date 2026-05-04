import { Routes, Route, NavLink } from "react-router-dom";
import React, { useState, useEffect } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { isLoggedIn, logout } from "./utils/auth";
import API from "./services/api";

import Dashboard from "./pages/Dashboard";
import HistoryPage from "./pages/HistoryPage";
import AboutPage from "./pages/AboutPage";

function App() {
  const [commodity, setCommodity] = useState("Gold");
  const [currency, setCurrency] = useState("INR");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("predict_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  useEffect(() => {
    // Detect "full restart" (first load of the browser session)
    const wasRestarted = sessionStorage.getItem("app_restarted");
    
    if (!wasRestarted) {
      // Clear previous login state and flag as restarted
      localStorage.removeItem("token");
      localStorage.removeItem("predict_history");
      sessionStorage.setItem("app_restarted", "true");
      
      // Force redirect to signup if not already there
      if (window.location.pathname !== "/signup" && window.location.pathname !== "/login") {
        window.location.href = "/signup";
      }
    } else if (!isLoggedIn() && window.location.pathname !== "/signup" && window.location.pathname !== "/login") {
      // Normal guest fallback
      window.location.href = "/signup";
    }
  }, []);

  // Auto-refresh forecast when currency or commodity changes (if result already displayed)
  useEffect(() => {
    if (result && !loading) {
      getPrediction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, commodity]);

  const getPrediction = async () => {
    try {
      setLoading(true);
      const response = await API.post("/predict", { commodity, currency });
      const data = response.data;
      setResult(data);
      const newEntry = { commodity, currency, accuracy: data.accuracy };
      setHistory((prev) => {
        const updated = [newEntry, ...prev];
        localStorage.setItem("predict_history", JSON.stringify(updated));
        return updated;
      });
      setError("");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => logout(), 2000);
      } else {
        setError("Market analysis failed. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!result) {
      setError("No forecast data available to download. Please generate a forecast first.");
      return;
    }
    let csv = "Day,Price\n";
    result.forecast.forEach((p, i) => { csv += `${i + 1},${p}\n`; });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "forecast.csv"; a.click();
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {/* Background orbs */}
      <div className="bg-orbs" />

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(6,11,24,0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "0 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "64px",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/logo.png" alt="PredictX Logo" style={{
            width: 32, height: 32,
            borderRadius: "8px",
          }} />
          <span style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 800, fontSize: "20px",
            background: "linear-gradient(135deg,#F5B042,#FFD060)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>PredictX</span>
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {[
            { to: "/", label: "Dashboard" },
            { to: "/history", label: "History" },
            { to: "/about", label: "About" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              style={({ isActive }) => ({
                fontSize: "14px", fontWeight: 600,
                textDecoration: "none",
                color: isActive ? "#F5B042" : "#8B9EC7",
                transition: "color 0.2s",
              })}
              onMouseEnter={e => { if (!e.currentTarget.classList.contains("active")) e.currentTarget.style.color = "#F0F4FF"; }}
              onMouseLeave={e => { if (!e.currentTarget.getAttribute("aria-current")) e.currentTarget.style.color = "#8B9EC7"; }}
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* Auth area */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {isLoggedIn() ? (
            <button
              onClick={logout}
              className="btn-ghost"
              style={{ padding: "8px 20px", borderRadius: "8px", fontSize: "14px" }}
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink to="/login" style={{ fontSize: "14px", fontWeight: 600, color: "#8B9EC7", textDecoration: "none" }}>
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="btn-gold"
                style={{ padding: "8px 20px", borderRadius: "8px", fontSize: "14px", textDecoration: "none", display: "inline-block" }}
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </nav>

      {/* ── ROUTES ── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn()
                ? <Dashboard commodity={commodity} currency={currency} setCommodity={setCommodity} setCurrency={setCurrency} getPrediction={getPrediction} downloadCSV={downloadCSV} result={result} history={history} loading={loading} error={error} />
                : <Signup />
            }
          />
          <Route path="/login"   element={<Login />} />
          <Route path="/signup"  element={<Signup />} />
          <Route path="/history" element={<HistoryPage history={history} />} />
          <Route path="/about"   element={<AboutPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;