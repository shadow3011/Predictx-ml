const FEATURES = [
  {
    icon: "📡",
    title: "Real-Time Data",
    desc: "Pulls live commodity prices via Yahoo Finance — 1 year of daily OHLCV data powering every forecast.",
  },
  {
    icon: "🤖",
    title: "ML Forecasting",
    desc: "Trained on historical trends using regression-based models. Predicts the next 30 days and shows the nearest 5.",
  },
  {
    icon: "💱",
    title: "Multi-Currency",
    desc: "Instant conversion to INR, USD, EUR, or GBP so you can analyse prices in your preferred currency.",
  },
  {
    icon: "📊",
    title: "Accuracy Score",
    desc: "Every prediction includes a MAPE-based accuracy score validated against 10 days of withheld test data.",
  },
];

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 24px 80px" }}>

      {/* Header */}
      <div style={{ marginBottom: 52, textAlign: "center" }}>
        <div className="label" style={{ marginBottom: 12 }}>About the Platform</div>
        <h1 style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
          fontWeight: 800, lineHeight: 1.2, marginBottom: 18,
        }}>
          What is <span className="grad-gold">PredictX</span>?
        </h1>
        <p style={{ color: "var(--text2)", maxWidth: 560, margin: "0 auto", lineHeight: 1.8, fontSize: 15 }}>
          PredictX is an intelligent analytical platform that analyses historical commodity prices
          and generates future price forecasts — built for clarity, speed, and global usability.
        </p>
      </div>

      {/* Feature grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16, marginBottom: 40 }}>
        {FEATURES.map((f) => (
          <div key={f.title} className="glass glass-hover" style={{ padding: "28px 26px" }}>
            <div style={{ fontSize: "2rem", marginBottom: 14 }}>{f.icon}</div>
            <div style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 700, fontSize: 17, marginBottom: 10,
            }}>{f.title}</div>
            <div style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.75 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Call-out banner */}
      <div className="glass" style={{
        padding: "28px 32px",
        border: "1px solid rgba(245,176,66,0.2)",
        background: "rgba(245,176,66,0.04)",
        display: "flex", alignItems: "flex-start", gap: 20,
      }}>
        <div style={{ fontSize: "2rem", flexShrink: 0 }}>⚡</div>
        <div>
          <div style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontWeight: 700, fontSize: 17, marginBottom: 8, color: "var(--gold)",
          }}>
            Reliability First
          </div>
          <div style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.75 }}>
            Every forecast is validated against recent market data using Mean Absolute Percentage Error (MAPE).
            The accuracy badge you see on every prediction reflects how close the model's test predictions
            were to actual historical prices — giving you a transparent, trustworthy signal.
          </div>
        </div>
      </div>

      {/* Supported commodities */}
      <div style={{ marginTop: 40 }}>
        <div className="label" style={{ marginBottom: 18 }}>Supported Commodities</div>
        <div style={{ display: "flex", gap: 14 }}>
          {[
            { icon: "🥇", name: "Gold" },
            { icon: "🥈", name: "Silver" },
            { icon: "🛢️", name: "Crude Oil" },
          ].map(c => (
            <div key={c.name} className="glass" style={{ flex: 1, padding: "18px 16px", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{c.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}