import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   BrandKlip Outcomes Bento Grid
   Brand: Jet Black #0D0D0D, Accent Green #22C55E,
          Pure White #FFFFFF, Bricolage Grotesque + DM Sans
   ───────────────────────────────────────────── */

// ── Intersection Observer Hook ──
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = (event) => setIsMobile(event.matches);

    setIsMobile(media.matches);
    if (media.addEventListener) {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }

    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, [breakpoint]);

  return isMobile;
}

// ── Milestone Progress Bar (Card 2 - Real-time Tracking) ──
function MilestoneTracker({ inView, isMobile }) {
  const activeMint = "#1FA97A";
  const steps = [
    { label: "Applied", short: "Applied" },
    { label: "Ordered", short: "Ordered" },
    { label: "Approved", short: "Approved" },
    { label: "Agreed", short: "Agreed" },
    { label: "Submitted", short: "Submitted" },
    { label: "Verified", short: "Verified" },
  ];
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!inView || isMobile) return;
    const id = setInterval(() => {
      setActive((p) => (p >= steps.length - 1 ? 0 : p + 1));
    }, 1800);
    return () => clearInterval(id);
  }, [inView, isMobile]);

  return (
    <div style={{ width: "100%", padding: "0" }}>
      {/* Progress line */}
      <div style={{
        position: "relative", display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", width: "100%",
      }}>
        {/* Background track */}
        <div style={{
          position: "absolute", top: isMobile ? 11 : 13, left: isMobile ? 10 : 16, right: isMobile ? 10 : 16, height: 3,
          background: "#e5e7eb", borderRadius: 2,
        }} />
        {/* Active track */}
        <div style={{
          position: "absolute", top: isMobile ? 11 : 13, left: isMobile ? 10 : 16, height: 3,
          background: activeMint, borderRadius: 2,
          width: `${(active / (steps.length - 1)) * (isMobile ? 92 : 89.33)}%`,
          transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }} />
        {steps.map((s, i) => (
          <div key={i} style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            zIndex: 1, flex: "1 1 0",
          }}>
            <div style={{
              width: i <= active ? (isMobile ? 22 : 28) : (isMobile ? 18 : 22),
              height: i <= active ? (isMobile ? 22 : 28) : (isMobile ? 18 : 22),
              borderRadius: "50%",
              background: i <= active ? activeMint : "#fff",
              border: i <= active ? "none" : "2.5px solid #d1d5db",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: i === active ? "0 0 0 5px rgba(31,169,122,0.2)" : "none",
            }}>
              {i <= active && (
                <svg width={isMobile ? "10" : "12"} height={isMobile ? "10" : "12"} viewBox="0 0 16 16" fill="none">
                  <path d="M3 8.5L6.5 12L13 4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            {!isMobile && (
              <span style={{
                fontSize: 10, fontFamily: "'DM Sans', sans-serif",
                color: i <= active ? "#0D0D0D" : "#9ca3af",
                fontWeight: i <= active ? 600 : 400,
                marginTop: 6, transition: "all 0.3s ease",
                textAlign: "center", lineHeight: 1.2,
              }}>{s.short}</span>
            )}
          </div>
        ))}
      </div>
      {isMobile && (
        <div style={{
          marginTop: 10,
          textAlign: "center",
          fontSize: 11,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          color: "#4b5563",
        }}>
          Stage: <span style={{ color: "#0D0D0D" }}>{steps[active].short}</span>
        </div>
      )}
    </div>
  );
}

// ── Verification Animation (Card 3) ──
function VerificationAnim({ inView, isMobile }) {
  const [phase, setPhase] = useState(0); // 0=scanning, 1=checking, 2=approved
  useEffect(() => {
    if (!inView) return;

    if (isMobile) {
      setPhase(2);
      return;
    }

    const cycle = () => {
      setPhase(0);
      setTimeout(() => setPhase(1), 1500);
      setTimeout(() => setPhase(2), 3000);
    };
    cycle();
    const id = setInterval(cycle, 5000);
    return () => clearInterval(id);
  }, [inView, isMobile]);

  return (
    <div style={{
      width: "100%", display: "flex", flexDirection: "column",
      alignItems: "center", gap: 12, padding: "8px 0",
    }}>
      {/* Video frame mockup */}
      <div style={{
        width: isMobile ? 124 : 140, height: isMobile ? 72 : 80, borderRadius: 10,
        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
        border: phase === 2 ? "2.5px solid #22C55E" : "2px solid #e5e7eb",
        position: "relative", overflow: "hidden",
        transition: "border 0.4s ease",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {/* Play icon */}
        <svg width={isMobile ? "24" : "28"} height={isMobile ? "24" : "28"} viewBox="0 0 24 24" fill="none" style={{ opacity: 0.35 }}>
          <path d="M8 5.14v13.72a1 1 0 001.5.86l11-6.86a1 1 0 000-1.72l-11-6.86a1 1 0 00-1.5.86z" fill="#0D0D0D" />
        </svg>
        {/* Scanning line */}
        {phase === 0 && (
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: "linear-gradient(90deg, transparent, #22C55E, transparent)",
            animation: "scanDown 1.5s ease-in-out infinite",
          }} />
        )}
        {/* Check overlay */}
        {phase === 2 && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(34,197,94,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "fadeIn 0.4s ease",
          }}>
            <div style={{
              width: isMobile ? 28 : 32, height: isMobile ? 28 : 32, borderRadius: "50%", background: "#22C55E",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}>
              <svg width={isMobile ? "16" : "18"} height={isMobile ? "16" : "18"} viewBox="0 0 16 16" fill="none">
                <path d="M3 8.5L6.5 12L13 4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        )}
      </div>
      {/* Status text */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        fontFamily: "'DM Sans', sans-serif", fontSize: isMobile ? 11 : 12, fontWeight: 600,
        color: phase === 2 ? "#22C55E" : "#6b7280",
        transition: "color 0.3s ease",
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: "50%",
          background: phase === 2 ? "#22C55E" : phase === 1 ? "#f59e0b" : "#9ca3af",
          transition: "background 0.3s ease",
          animation: phase < 2 ? "pulse 1s ease infinite" : "none",
        }} />
        {phase === 0 ? "Scanning video..." : phase === 1 ? "Checking brief alignment..." : "Approved ✓"}
      </div>
    </div>
  );
}

// ── License Badge Animation (Card 4) ──
function LicenseBadge({ inView, isMobile }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (inView) setTimeout(() => setShow(true), 400);
  }, [inView]);

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 10, padding: "8px 0",
    }}>
      {/* License document mockup */}
      <div style={{
        width: isMobile ? 92 : 100, padding: isMobile ? "12px 14px" : "14px 16px",
        background: "#fff", borderRadius: 10,
        border: "1.5px solid #e5e7eb",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(12px)",
        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ height: 3, width: "80%", borderRadius: 2, background: "#e5e7eb" }} />
          <div style={{ height: 3, width: "60%", borderRadius: 2, background: "#e5e7eb" }} />
          <div style={{ height: 3, width: "70%", borderRadius: 2, background: "#e5e7eb" }} />
          <div style={{ height: 3, width: "40%", borderRadius: 2, background: "#e5e7eb" }} />
        </div>
        {/* Stamp */}
        <div style={{
          marginTop: 10, display: "flex", justifyContent: "center",
        }}>
          <div style={{
            width: isMobile ? 42 : 48, height: isMobile ? 42 : 48, borderRadius: "50%",
            border: "2.5px solid #22C55E",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: show ? 1 : 0,
            transform: show ? "scale(1) rotate(0deg)" : "scale(0.5) rotate(-20deg)",
            transition: "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s",
          }}>
            <span style={{
              fontSize: isMobile ? 7 : 8, fontWeight: 800, color: "#22C55E",
              fontFamily: "'DM Sans', sans-serif",
              textTransform: "uppercase", letterSpacing: "0.05em",
              textAlign: "center", lineHeight: 1.1,
            }}>FULL<br />RIGHTS</span>
          </div>
        </div>
      </div>
      {/* Usage chips */}
      <div style={{
        display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "center",
      }}>
        {["Ads", "Social", "PDPs", "Email"].map((tag, i) => (
          <span key={tag} style={{
            fontSize: isMobile ? 9 : 10, fontFamily: "'DM Sans', sans-serif",
            padding: "3px 8px", borderRadius: 20,
            background: "#f0fdf4", color: "#15803d", fontWeight: 600,
            border: "1px solid #bbf7d0",
            opacity: show ? 1 : 0,
            transform: show ? "translateY(0)" : "translateY(8px)",
            transition: `all 0.4s ease ${0.5 + i * 0.1}s`,
          }}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

// ── Main Bento Grid ──
export default function BrandKlipBentoGrid() {
  const [sectionRef, sectionInView] = useInView(0.08);
  const isMobile = useIsMobile(768);

  return (
    <>
      <style>{`
        @keyframes scanDown {
          0% { transform: translateY(0); }
          50% { transform: translateY(77px); }
          100% { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes popIn {
          from { transform: scale(0); } to { transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .bk-bento-section {
          max-width: 1120px;
          margin: 0 auto;
          padding: 36px 24px 64px;
          font-family: 'DM Sans', sans-serif;
        }
        .bk-bento-header {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 14px;
        }
        .bk-bento-title {
          font-family: 'Bricolage Grotesque', serif;
          font-weight: 800;
          font-size: clamp(30px, 5vw, 44px);
          line-height: 1.1;
          color: #0D0D0D;
          margin: 0 0 8px;
          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;
          filter: none !important;
          -webkit-text-fill-color: #0D0D0D !important;
        }
        .bk-bento-subtitle {
          font-size: 16px;
          color: #5f6b7a;
          max-width: 520px;
          line-height: 1.55;
          margin: 0 auto 14px;
          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;
          filter: none !important;
          -webkit-text-fill-color: #5f6b7a !important;
        }

        .bk-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 16px;
        }

        .bk-card {
          border-radius: 20px;
          padding: 32px 28px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border: 1.5px solid #e5e7eb;
          background: #fff;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
          transform: translateY(0) scale(1);
          transition-property: transform, box-shadow, opacity;
          transition-duration: 320ms, 320ms, 550ms;
          transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1), cubic-bezier(0.22, 1, 0.36, 1), ease;
          transition-delay: 0s, 0s, var(--bk-reveal-delay, 0s);
          will-change: transform, box-shadow;
          transform-origin: center center;
          cursor: default;
        }
        @media (hover: hover) and (pointer: fine) {
          .bk-card:hover {
            transform: translateY(-2px) scale(1.006);
            box-shadow: 0 16px 34px rgba(15, 23, 42, 0.11);
          }
        }

        /* Card 1 - Pay-per-video - Large left */
        .bk-card-1 {
          min-height: 380px;
        }
        /* Card 2 - Real-time tracking - Right top */
        .bk-card-2 {
          min-height: 380px;
          background: #fff;
          border-color: #e5e7eb;
        }
        /* Card 3 - Verification - Left bottom */
        .bk-card-3 {
          min-height: 340px;
        }
        /* Card 4 - Reusable assets - Right bottom */
        .bk-card-4 {
          min-height: 340px;
        }

        .bk-card-number {
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 14px;
          width: 36px;
          height: 36px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          flex-shrink: 0;
          background: rgba(200, 240, 224, 0.28);
          color: #4b5563;
          border: 1px solid #e5e7eb;
          line-height: 1;
          transition: background-color 250ms ease, border-color 250ms ease, color 250ms ease;
        }

        @media (hover: hover) and (pointer: fine) {
          .bk-card:hover .bk-card-number {
            background: rgba(200, 240, 224, 0.5);
            border-color: rgba(34, 197, 94, 0.2);
            color: #0D0D0D;
          }
        }

        .bk-card-heading {
          font-family: 'Bricolage Grotesque', serif;
          font-weight: 700;
          font-size: 22px;
          line-height: 1.2;
          margin: 0 0 6px;
        }
        .bk-card-1 .bk-card-heading { color: #0D0D0D; }
        .bk-card-2 .bk-card-heading { color: #0D0D0D; }
        .bk-card-3 .bk-card-heading { color: #0D0D0D; }
        .bk-card-4 .bk-card-heading { color: #0D0D0D; }

        .bk-card-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .bk-card-1 .bk-card-label { color: #9ca3af; }
        .bk-card-2 .bk-card-label { color: #9ca3af; }
        .bk-card-3 .bk-card-label { color: #9ca3af; }
        .bk-card-4 .bk-card-label { color: #9ca3af; }

        .bk-card-desc {
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
        }
        .bk-card-1 .bk-card-desc { color: #6b7280; }
        .bk-card-2 .bk-card-desc { color: #6b7280; }
        .bk-card-3 .bk-card-desc { color: #4b5563; }
        .bk-card-4 .bk-card-desc { color: #6b7280; }

        .bk-card-visual {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 20px;
        }

        /* Price display */
        .bk-price-display {
          display: flex;
          align-items: stretch;
          gap: 14px;
          width: 100%;
          margin-top: 8px;
        }
        .bk-price-block {
          padding: 16px 20px;
          border-radius: 14px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          flex: 1;
        }
        .bk-price-amount {
          font-family: 'Bricolage Grotesque', serif;
          font-weight: 800;
          font-size: 30px;
          line-height: 1.05;
          color: #86cdb7;
        }
        .bk-price-per {
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
        }
        .bk-price-emoji-block {
          flex: 0 0 170px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          gap: 6px;
        }
        .bk-price-emoji-title {
          font-size: 12px;
          font-weight: 700;
          color: #4b5563;
          letter-spacing: 0.01em;
        }
        .bk-price-emoji-sub {
          font-size: 11px;
          line-height: 1.35;
          color: #9ca3af;
        }
        .bk-price-tag-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: 16px;
        }
        .bk-price-tag {
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 20px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          color: #6b7280;
          font-weight: 500;
        }
        .bk-price-tag.strikethrough {
          text-decoration: line-through;
          opacity: 0.35;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .bk-bento-section { padding: 32px 16px 54px; }
          .bk-bento-header { margin-bottom: 10px; }
          .bk-grid {
            grid-template-columns: 1fr;
          }
          .bk-card { min-height: auto !important; padding: 24px 20px; }
          .bk-card-heading { font-size: 20px; }
          .bk-price-amount { font-size: 28px; }
          .bk-price-display { flex-direction: column; gap: 10px; }
          .bk-price-emoji-block {
            flex: 1 1 auto;
            width: 100%;
            align-items: flex-start !important;
            text-align: left;
            gap: 4px;
          }
          .bk-card-visual {
            margin-top: 14px;
            min-height: 118px;
            align-items: flex-start;
          }
          .bk-card-2 .bk-card-visual,
          .bk-card-3 .bk-card-visual,
          .bk-card-4 .bk-card-visual {
            min-height: 132px;
          }
          .bk-bento-subtitle { margin-bottom: 12px; }
        }

        @media (max-width: 480px) {
          .bk-bento-section { padding: 28px 14px 46px; }
          .bk-card {
            padding: 20px 16px;
            border-radius: 18px;
          }
          .bk-card-heading {
            font-size: 18px;
            line-height: 1.25;
          }
          .bk-card-desc {
            font-size: 13px;
            line-height: 1.45;
          }
          .bk-price-amount { font-size: 24px; }
          .bk-price-tag-row { margin-top: 12px; }
          .bk-card-visual { min-height: 108px; }
          .bk-card-2 .bk-card-visual,
          .bk-card-3 .bk-card-visual,
          .bk-card-4 .bk-card-visual { min-height: 118px; }
        }
      `}</style>

        <section className="bk-bento-section" ref={sectionRef}>
          <div className="bk-bento-header" style={{ position: "relative", zIndex: 2 }}>
          <div className="pill-animated brand-benefits-pill" style={{ marginBottom: 14 }}>
            <span className="brand-benefits-pill__icon" aria-hidden="true">✦</span>
            <span className="brand-benefits-pill__label">The Outcomes</span>
          </div>
          <h2
            className="bk-bento-title"
            style={{
              color: "#0D0D0D",
              opacity: 1,
              visibility: "visible",
              transform: "none",
              filter: "none",
              WebkitTextFillColor: "#0D0D0D",
              textShadow: "0 1px 0 rgba(255, 255, 255, 0.35)",
            }}
          >
            What Brands Actually<br />Get With BrandKlip.
          </h2>
          <p
            className="bk-bento-subtitle"
            style={{
              color: "#4f5b67",
              opacity: 1,
              visibility: "visible",
              transform: "none",
              filter: "none",
              WebkitTextFillColor: "#4f5b67",
            }}
          >
            No fluff. No vague promises. Here's what changes when you run campaigns through BrandKlip.
          </p>
        </div>

        <div className="bk-grid">
          {/* ── Card 1: Pay-per-video ── */}
          <div
            className="bk-card bk-card-1"
            style={{
              "--bk-reveal-delay": "0.1s",
              opacity: sectionInView ? 1 : 0,
            }}
          >
            <span className="bk-card-number">1</span>
            <div className="bk-card-label">Pricing</div>
            <h3 className="bk-card-heading">Pay per video.<br />Nothing else.</h3>
            <p className="bk-card-desc">
              Flat fee per approved video. No subscriptions. No retainers. No agency markup. You only pay when you're happy.
            </p>
            <div className="bk-card-visual" style={{ flexDirection: "column", alignItems: "stretch" }}>
              <div className="bk-price-display">
                <div className="bk-price-block">
                  <div className="bk-price-amount">
                    Pay on<br />delivery
                  </div>
                  <div className="bk-price-per">Flat per-video billing. No upfront payout risk.</div>
                </div>
                <div className="bk-price-block bk-price-emoji-block" style={{ padding: "14px 12px" }}>
                  <div style={{ fontSize: 28, lineHeight: 1 }}>🎬</div>
                  <div className="bk-price-emoji-title">Brand payout</div>
                  <div className="bk-price-emoji-sub">Brand only pays out after creator content is verified.</div>
                </div>
              </div>
              <div className="bk-price-tag-row">
                <span className="bk-price-tag strikethrough">Subscriptions</span>
                <span className="bk-price-tag strikethrough">Retainers</span>
                <span className="bk-price-tag strikethrough">Agency fees</span>
                <span className="bk-price-tag" style={{ color: "#1f9d74", borderColor: "rgba(31,157,116,0.35)" }}>Pay on delivery ✓</span>
              </div>
            </div>
          </div>

          {/* ── Card 2: Real-time Tracking ── */}
          <div
            className="bk-card bk-card-2"
            style={{
              "--bk-reveal-delay": "0.25s",
              opacity: sectionInView ? 1 : 0,
            }}
          >
            <span className="bk-card-number">2</span>
            <div className="bk-card-label">Visibility</div>
            <h3 className="bk-card-heading">Track every creator.<br />Every step.</h3>
            <p className="bk-card-desc">
              Live dashboard shows exactly where each creator is — from application to final delivery. No more "where's my content?" emails.
            </p>
            <div className="bk-card-visual">
              {/* Fake dashboard frame */}
              <div style={{
                width: "100%", borderRadius: 14,
                background: "#f9fafb", border: "1.5px solid #e5e7eb",
                padding: "16px 14px 14px", overflow: "hidden",
              }}>
                {/* Top bar */}
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 14 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444" }} />
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#f59e0b" }} />
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e" }} />
                  <span style={{
                    marginLeft: 8, fontSize: 10, color: "#9ca3af",
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                  }}>Creator Pipeline — @priya_beauty</span>
                </div>
                <MilestoneTracker inView={sectionInView} isMobile={isMobile} />
              </div>
            </div>
          </div>

          {/* ── Card 3: BrandKlip Verification ── */}
          <div
            className="bk-card bk-card-3"
            style={{
              "--bk-reveal-delay": "0.4s",
              opacity: sectionInView ? 1 : 0,
            }}
          >
            <span className="bk-card-number">3</span>
            <div className="bk-card-label">Quality</div>
            <h3 className="bk-card-heading">We verify every video.<br />You focus on business.</h3>
            <p className="bk-card-desc">
              BrandKlip's team manually reviews every submission against your brief. Misaligned? We request a reshoot — not you.
            </p>
            <div className="bk-card-visual">
              <VerificationAnim inView={sectionInView} isMobile={isMobile} />
            </div>
          </div>

          {/* ── Card 4: Reusable Assets ── */}
          <div
            className="bk-card bk-card-4"
            style={{
              "--bk-reveal-delay": "0.55s",
              opacity: sectionInView ? 1 : 0,
            }}
          >
            <span className="bk-card-number">4</span>
            <div className="bk-card-label">Ownership</div>
            <h3 className="bk-card-heading">Licensed forever.<br />Use everywhere.</h3>
            <p className="bk-card-desc">
              Every approved video comes with full usage rights. Creators sign licensing upfront — use your content on ads, PDPs, socials, email. No legal grey areas.
            </p>
            <div className="bk-card-visual">
              <LicenseBadge inView={sectionInView} isMobile={isMobile} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}