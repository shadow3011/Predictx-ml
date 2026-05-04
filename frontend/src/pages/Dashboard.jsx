import {
  Chart as ChartJS, LineElement, CategoryScale, LinearScale,
  PointElement, Tooltip, Legend, Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const COMMODITIES = [
  { name: "Gold (Troy Ounce)", icon: "🥇", ticker: "GC=F", color: "#F5B042" },
  { name: "Silver (Troy Ounce)", icon: "🥈", ticker: "SI=F", color: "#C0C0D0" },
  { name: "MCX Crude", icon: "🛢️", ticker: "CL=F", color: "#60A5FA" },
];
const CURRENCIES = [
  { code: "INR", symbol: "₹" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
];

export default function Dashboard({
  commodity, currency, setCommodity, setCurrency,
  getPrediction, downloadCSV, result, history, loading, error
}) {
  const forecastData = result?.forecast
    ? (Array.isArray(result.forecast[0]) ? result.forecast.map(p => p[0]) : result.forecast)
    : [];

  const selCom = COMMODITIES.find(c => c.name === commodity);
  const selCur = CURRENCIES.find(c => c.code === currency);
  const sym = selCur?.symbol || "";

  const fmt = (v) => `${sym}${Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px 80px" }}>

      {/* ── Hero ── */}
      <div style={{ textAlign: "center", marginBottom: "52px" }}>
        <h1 style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: "clamp(2rem, 5vw, 2.8rem)",
          fontWeight: 800, lineHeight: 1.15, marginBottom: 16,
        }}>
          Market <span className="grad-gold">Intelligence</span>
        </h1>
        <p style={{ color: "var(--text2)", maxWidth: 480, margin: "0 auto", lineHeight: 1.75, fontSize: 15 }}>
          Select a commodity and currency to generate real-time AI price forecasts.
        </p>
      </div>

      {/* ── Commodity Selector ── */}
      <div style={{ marginBottom: 32 }}>
        <div className="label" style={{ marginBottom: 14 }}>Select Commodity</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {COMMODITIES.map(c => {
            const active = commodity === c.name;
            return (
              <button
                key={c.name}
                onClick={() => setCommodity(c.name)}
                className="glass glass-hover"
                style={{
                  padding: "22px 12px",
                  border: active ? `1px solid ${c.color}55` : "1px solid var(--border)",
                  background: active ? `${c.color}0A` : "var(--card)",
                  boxShadow: active ? `0 0 30px ${c.color}18` : "none",
                  borderRadius: 14, cursor: "pointer",
                  textAlign: "center", transition: "all 0.3s",
                }}
              >
                <div style={{ fontSize: "2.2rem", marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: active ? c.color : "var(--text)" }}>
                  {c.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Currency Selector ── */}
      <div style={{ marginBottom: 36 }}>
        <div className="label" style={{ marginBottom: 14 }}>Select Currency</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {CURRENCIES.map(c => {
            const active = currency === c.code;
            return (
              <button
                key={c.code}
                onClick={() => setCurrency(c.code)}
                style={{
                  padding: "10px 26px", borderRadius: 8, fontSize: 14,
                  fontWeight: active ? 700 : 500, fontFamily: "Inter, sans-serif",
                  cursor: "pointer", transition: "all 0.25s",
                  border: active ? "1px solid var(--border-gold)" : "1px solid rgba(255,255,255,0.07)",
                  background: active ? "var(--gold-dim)" : "rgba(255,255,255,0.02)",
                  color: active ? "var(--gold)" : "var(--text2)",
                }}
              >
                {c.symbol} {c.code}
              </button>
            );
          })}
        </div>
      </div>


      {/* ── Error Display ── */}
      {error && (
        <div className="fade-up" style={{
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          color: "#ef4444",
          padding: "14px 20px",
          borderRadius: 12,
          marginBottom: 32,
          fontSize: 14,
          fontWeight: 500,
          display: "flex", alignItems: "center", gap: 10
        }}>
          <span>⚠️</span> {error}
        </div>
      )}

      {/* ── Action Buttons ── */}
      <div style={{ display: "flex", gap: 12, marginBottom: 48 }}>
        <button
          onClick={getPrediction}
          disabled={loading}
          className="btn-gold"
          style={{
            flex: 1, padding: "15px 0", borderRadius: 12, fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10
          }}
        >
          {loading
            ? <><div className="spinner" /><span>Analyzing Markets…</span></>
            : <><span>Generate Forecast</span></>}
        </button>
        <button
          onClick={downloadCSV}
          className="btn-ghost"
          style={{
            minWidth: 140, padding: "15px 20px", borderRadius: 12, fontSize: 15,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            flexShrink: 0,
          }}
        >
          ⬇ Download CSV
        </button>
      </div>

      {/* ── Results ── */}
      {result && !loading && (
        <div className="fade-up">

          {/* Header row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div className="label" style={{ marginBottom: 8 }}>5-Day Price Forecast</div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>
                {selCom?.icon} {commodity} &nbsp;
                <span style={{ color: "var(--text2)", fontWeight: 500 }}>/ {currency}</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="label" style={{ marginBottom: 8 }}>Model Accuracy</div>
              <div className="badge-gold" style={{ fontSize: 17, padding: "5px 18px", display: "inline-block" }}>
                {result.accuracy}%
              </div>
            </div>
          </div>

          {/* Forecast Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 24 }}>
            {forecastData.map((price, i) => (
              <div key={i} className="glass" style={{ padding: "16px 8px", textAlign: "center" }}>
                <div className="label" style={{ marginBottom: 8, fontSize: 10 }}>Day {i + 1}</div>
                <div style={{ fontWeight: 800, fontSize: 14, color: "var(--gold)" }}>
                  {fmt(price)}
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="glass" style={{ padding: "28px 24px", marginBottom: 40 }}>
            <Line
              data={{
                labels: forecastData.map((_, i) => `Day ${i + 1}`),
                datasets: [{
                  label: `${commodity} (${currency})`,
                  data: forecastData,
                  borderColor: "#F5B042",
                  backgroundColor: "rgba(245,176,66,0.07)",
                  tension: 0.4, fill: true,
                  pointRadius: 6,
                  pointBackgroundColor: "#F5B042",
                  pointBorderColor: "#060B18",
                  pointBorderWidth: 2,
                  borderWidth: 2.5,
                }],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { labels: { color: "#8B9EC7", font: { family: "Inter", size: 13 } } },
                  tooltip: {
                    backgroundColor: "#0D1525",
                    borderColor: "rgba(245,176,66,0.2)",
                    borderWidth: 1,
                    titleColor: "#F5B042",
                    bodyColor: "#F0F4FF",
                    padding: 12, cornerRadius: 8,
                    callbacks: { label: (ctx) => ` ${fmt(ctx.raw)}` },
                  },
                },
                scales: {
                  x: {
                    ticks: { color: "#4A5A7A", font: { family: "Inter" } },
                    grid: { color: "rgba(255,255,255,0.03)" },
                    border: { color: "rgba(255,255,255,0.04)" },
                  },
                  y: {
                    min: forecastData.length ? Math.min(...forecastData) * 0.98 : 0,
                    max: forecastData.length ? Math.max(...forecastData) * 1.02 : 1,
                    ticks: {
                      color: "#4A5A7A", font: { family: "Inter" },
                      callback: (v) => fmt(v),
                    },
                    grid: { color: "rgba(255,255,255,0.03)" },
                    border: { color: "rgba(255,255,255,0.04)" },
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* ── History ── */}
      {history.length > 0 && (
        <div>
          <div className="label" style={{ marginBottom: 14 }}>Recent Predictions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 220, overflowY: "auto" }}>
            {history.map((item, i) => {
              const c = COMMODITIES.find(x => x.name === item.commodity);
              return (
                <div key={i} className="glass" style={{
                  padding: "14px 20px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: 22 }}>{c?.icon || "📊"}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{item.commodity}</div>
                      <div style={{ color: "var(--muted)", fontSize: 12 }}>{item.currency}</div>
                    </div>
                  </div>
                  <div className="badge-emerald" style={{ padding: "4px 14px", fontSize: 13 }}>
                    {item.accuracy}% Acc
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}