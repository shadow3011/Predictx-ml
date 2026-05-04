const COMMODITIES = [
  { name: "Gold",      icon: "🥇" },
  { name: "Silver",    icon: "🥈" },
  { name: "Crude Oil", icon: "🛢️" },
];

export default function HistoryPage({ history }) {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div className="label" style={{ marginBottom: 10 }}>Session Log</div>
        <h1 style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: "2rem", fontWeight: 800,
        }}>
          Prediction <span className="grad-gold">History</span>
        </h1>
      </div>

      {history.length === 0 ? (
        /* Empty state */
        <div className="glass" style={{
          textAlign: "center", padding: "64px 40px",
        }}>
          <div style={{ fontSize: "3.5rem", marginBottom: 20 }}>📊</div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 10 }}>No predictions yet</div>
          <div style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.7 }}>
            Head to the Dashboard, select a commodity, and hit{" "}
            <span style={{ color: "var(--gold)" }}>Generate Forecast</span>.
          </div>
          <a
            href="/"
            style={{
              display: "inline-block", marginTop: 28,
              padding: "11px 28px", borderRadius: 10,
              background: "linear-gradient(135deg,#F5B042,#E8760A)",
              color: "#000", fontWeight: 700, fontSize: 14,
              textDecoration: "none",
            }}
          >
            ⚡ Go to Dashboard
          </a>
        </div>
      ) : (
        <div>
          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 28 }}>
            <div className="glass" style={{ padding: "20px 24px" }}>
              <div className="label" style={{ marginBottom: 8 }}>Total Predictions</div>
              <div style={{ fontWeight: 800, fontSize: 28, color: "var(--gold)" }}>{history.length}</div>
            </div>
            <div className="glass" style={{ padding: "20px 24px" }}>
              <div className="label" style={{ marginBottom: 8 }}>Avg. Accuracy</div>
              <div style={{ fontWeight: 800, fontSize: 28, color: "var(--emerald)" }}>
                {(history.reduce((s, h) => s + Number(h.accuracy), 0) / history.length).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {history.map((item, i) => {
              const c = COMMODITIES.find(x => x.name === item.commodity);
              return (
                <div
                  key={i}
                  className="glass glass-hover"
                  style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {/* Index */}
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "rgba(245,176,66,0.08)",
                      border: "1px solid rgba(245,176,66,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, color: "var(--muted)",
                    }}>
                      {history.length - i}
                    </div>
                    <span style={{ fontSize: "1.6rem" }}>{c?.icon || "📈"}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{item.commodity}</div>
                      <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 2, letterSpacing: "0.06em" }}>
                        {item.currency}
                      </div>
                    </div>
                  </div>
                  <div className="badge-emerald" style={{ padding: "5px 16px", fontSize: 13 }}>
                    {item.accuracy}% Accuracy
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