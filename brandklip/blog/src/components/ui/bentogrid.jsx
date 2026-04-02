"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";

/* ── Brand tokens ─────────────────────────────────────────── */
const C = {
  black:     "#0D0D0D",
  green:     "#22C55E",
  greenDark: "#15803D",
  greenMid:  "#16A34A",
  mintStart: "#C8F0E0",
  mintMid:   "#F0FBF6",
  white:     "#FFFFFF",
  offWhite:  "#F9FAFB",
  secondary: "#6B7280",
  muted:     "#9CA3AF",
  border:    "#E5E7EB",
  cardBg:    "#FFFFFF",
};

function BentoCard({ children, className = "", style = {}, colSpan = 1 }) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 16px 48px rgba(0,0,0,0.10)" }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={className}
      style={{
        background: C.cardBg,
        borderRadius: 20,
        border: `1px solid ${C.border}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gridColumn: `span ${colSpan}`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── Step badge ───────────────────────────────────────────── */
function StepBadge({ n }) {
  return (
    <div
      style={{
        width: 30,
        height: 30,
        borderRadius: 999,
        background: C.black,
        color: C.white,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 700,
        flexShrink: 0,
        letterSpacing: "0.02em",
      }}
    >
      {String(n).padStart(2, "0")}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CARD 1 — Creator vetting
   Animation: Creator profile card slides in, stats count up,
   then a green "Vetted ✓" badge stamps on top
   ══════════════════════════════════════════════════════════ */
function Card1() {
  const [phase, setPhase] = useState(0); // 0=idle,1=profile,2=badge
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [inView]);

  const stats = [
    { label: "Posts", val: "342" },
    { label: "Followers", val: "114K" },
    { label: "Avg Views", val: "42K" },
  ];
  const thumbs = ["🧴", "💆‍♀️", "✨"];

  return (
    <BentoCard>
      <div ref={ref} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <StepBadge n={1} />
        </div>

        {/* Profile card graphic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          style={{
            background: C.offWhite, borderRadius: 14,
            border: `1px solid ${C.border}`, padding: 16,
            position: "relative",
          }}
        >
          {/* Avatar row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.mintStart}, ${C.green})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 14, color: C.greenDark,
              fontFamily: "'DM Sans', sans-serif",
            }}>SR</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: C.black, display: "flex", alignItems: "center", gap: 4 }}>
                Sarah Reviews
                <span style={{ color: C.green, fontSize: 12 }}>✓</span>
              </div>
              <div style={{ fontSize: 11, color: C.muted }}>Beauty & Skincare</div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {stats.map((s) => (
              <div key={s.label} style={{
                flex: 1, textAlign: "center",
                background: C.white, borderRadius: 8,
                border: `1px solid ${C.border}`, padding: "6px 4px",
              }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.black }}>{s.val}</div>
                <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Thumbnails */}
          <div style={{ display: "flex", gap: 6 }}>
            {thumbs.map((t, i) => (
              <div key={i} style={{
                flex: 1, height: 52, borderRadius: 8,
                background: `linear-gradient(145deg, ${C.mintStart}80, ${C.mintMid})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20,
              }}>{t}</div>
            ))}
          </div>

          {/* Stamp badge */}
          <AnimatePresence>
            {phase >= 2 && (
              <motion.div
                initial={{ scale: 0, rotate: -12, opacity: 0 }}
                animate={{ scale: 1, rotate: -8, opacity: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                style={{
                  position: "absolute", top: 10, right: 10,
                  background: C.green, color: C.white,
                  borderRadius: 8, padding: "4px 10px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11, fontWeight: 700,
                  boxShadow: `0 4px 16px rgba(34,197,94,0.4)`,
                  letterSpacing: "0.06em",
                  border: `2px solid ${C.white}`,
                }}
              >
                VETTED ✓
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div>
          <div style={{ fontFamily: "'DM Sans', 'Sora', sans-serif", fontSize: 17, fontWeight: 700, color: C.black, marginBottom: 4 }}>
            Creators are manually vetted
          </div>
          <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.55 }}>
            Every creator is screened for niche fit, engagement quality, and content consistency before accessing brand drops.
          </div>
        </div>
      </div>
    </BentoCard>
  );
}

/* ══════════════════════════════════════════════════════════
   CARD 2 — Creators buy from your store
   Animation: Flow diagram with arrows — nodes light up
   sequentially: "Creator buys" → "Creator shoots" → "Verified"
   ══════════════════════════════════════════════════════════ */
function Card2() {
  const [activeStep, setActiveStep] = useState(-1);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-60px" });
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!inView) return;
    let step = 0;
    setActiveStep(0);
    intervalRef.current = setInterval(() => {
      step = (step + 1) % 3;
      setActiveStep(step);
    }, 900);
    return () => clearInterval(intervalRef.current);
  }, [inView]);

  const steps = [
    { label: "Creator buys", icon: "🛍️" },
    { label: "Creator shoots", icon: "🎬" },
    { label: "Verified", icon: "✅" },
  ];

  return (
    <BentoCard>
      <div ref={ref} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
        <StepBadge n={2} />

        {/* Flow nodes */}
        <div style={{
          background: C.offWhite, borderRadius: 14,
          border: `1px solid ${C.border}`, padding: 20,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 6, minHeight: 100,
        }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < 2 ? "1" : "auto", gap: 6 }}>
              <motion.div
                animate={{
                  background: activeStep === i ? C.green : C.white,
                  borderColor: activeStep === i ? C.green : C.border,
                  scale: activeStep === i ? 1.07 : 1,
                  boxShadow: activeStep === i ? `0 4px 18px rgba(34,197,94,0.3)` : "none",
                }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                style={{
                  borderRadius: 10, border: `1.5px solid ${C.border}`,
                  padding: "8px 12px", background: C.white,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  minWidth: 70,
                }}
              >
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                <motion.span
                  animate={{ color: activeStep === i ? C.white : C.black }}
                  style={{ fontSize: 10, fontWeight: 600, textAlign: "center", lineHeight: 1.3 }}
                >
                  {s.label}
                </motion.span>
              </motion.div>

              {i < 2 && (
                <motion.div
                  animate={{ opacity: activeStep > i ? 1 : 0.25, scaleX: activeStep > i ? 1 : 0.6 }}
                  style={{ color: C.green, fontSize: 16, transformOrigin: "left" }}
                >
                  →
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* "No inventory shipped blindly" label */}
        <motion.div
          animate={{ opacity: activeStep === 2 ? 1 : 0.4 }}
          style={{
            background: activeStep === 2 ? `${C.mintStart}60` : C.offWhite,
            border: `1px solid ${activeStep === 2 ? C.green : C.border}`,
            borderRadius: 8, padding: "8px 12px", textAlign: "center",
            fontSize: 12, fontWeight: 600, color: C.greenDark,
            transition: "all 0.4s ease",
          }}
        >
          No inventory shipped blindly
        </motion.div>

        <div>
          <div style={{ fontFamily: "'DM Sans', 'Sora', sans-serif", fontSize: 17, fontWeight: 700, color: C.black, marginBottom: 4 }}>
            Creators buy from your store
          </div>
          <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.55 }}>
            No blind shipping. Creators purchase with their own money first — removing inventory risk entirely from your side.
          </div>
        </div>
      </div>
    </BentoCard>
  );
}

/* ══════════════════════════════════════════════════════════
   CARD 3 — Brief-based content review (wide, col-span 2)
   Animation: 3 UGC video thumbnails slide in staggered,
   then a review badge animates on hover/auto with
   pass/revision states cycling
   ══════════════════════════════════════════════════════════ */
function Card3() {
  const [reviewState, setReviewState] = useState(0); // 0=pending, 1=approved, 2=revision
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    const cycle = () => {
      setReviewState(s => (s + 1) % 3);
    };
    const t = setInterval(cycle, 2200);
    return () => clearInterval(t);
  }, [inView]);

  const videos = [
    { bg: `linear-gradient(145deg, #d4e9d4, #a8d5a2)`, emoji: "🧴", label: "Day in my life" },
    { bg: `linear-gradient(145deg, ${C.mintStart}, #9fd4c4)`, emoji: "💄", label: "Skincare routine" },
    { bg: `linear-gradient(145deg, #e8d5f0, #c9a8e0)`, emoji: "✨", label: "GRWM haul" },
  ];

  const reviewBadge = [
    { text: "Under Review", color: "#EAB308", bg: "#FEF9C3", border: "#FDE047" },
    { text: "Approved ✓", color: C.greenDark, bg: C.mintStart, border: C.green },
    { text: "Needs Revision", color: "#DC2626", bg: "#FEE2E2", border: "#FCA5A5" },
  ];
  const badge = reviewBadge[reviewState];

  return (
    <BentoCard colSpan={2}>
      <div
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, flex: 1 }}
      >
        <StepBadge n={3} />

        {/* Video thumbnails */}
        <div style={{ display: "flex", gap: 10, position: "relative" }}>
          {videos.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, type: "spring", stiffness: 200, damping: 20 }}
              whileHover={{ scale: 1.04, y: -4 }}
              style={{
                flex: 1, height: 130, borderRadius: 12,
                background: v.bg, position: "relative",
                overflow: "hidden", cursor: "pointer",
                border: `1px solid rgba(0,0,0,0.06)`,
              }}
            >
              {/* Play button */}
              <div style={{
                position: "absolute", inset: 0, display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "rgba(255,255,255,0.85)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13,
                }}>▶</div>
              </div>
              {/* Bottom label */}
              <div style={{
                position: "absolute", bottom: 6, left: 6, right: 6,
                background: "rgba(0,0,0,0.55)", borderRadius: 6,
                padding: "3px 7px", fontSize: 9, color: "#fff", fontWeight: 500,
              }}>
                {v.label}
              </div>
              {/* Emoji top-left */}
              <div style={{ position: "absolute", top: 8, left: 8, fontSize: 16 }}>{v.emoji}</div>
            </motion.div>
          ))}

          {/* Review badge — floats over videos */}
          <motion.div
            animate={{
              background: badge.bg,
              borderColor: badge.border,
              color: badge.color,
            }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute", bottom: -14, left: "50%", transform: "translateX(-50%)",
              padding: "5px 14px", borderRadius: 20,
              border: `1.5px solid ${badge.border}`,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              zIndex: 2,
            }}
          >
            {badge.text}
          </motion.div>
        </div>

        {/* Brief check progress bar */}
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, fontWeight: 500 }}>Brief compliance check</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {[
              { label: "Product clearly visible", pct: 100 },
              { label: "Hook in first 3 seconds", pct: reviewState === 2 ? 55 : 100 },
              { label: "Call to action included", pct: reviewState === 0 ? 70 : 100 },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 10, color: C.secondary, width: 160, flexShrink: 0 }}>{item.label}</div>
                <div style={{ flex: 1, height: 5, borderRadius: 10, background: C.border, overflow: "hidden" }}>
                  <motion.div
                    animate={{ width: `${item.pct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{
                      height: "100%", borderRadius: 10,
                      background: item.pct === 100 ? C.green : item.pct > 60 ? "#EAB308" : "#EF4444",
                    }}
                  />
                </div>
                <span style={{ fontSize: 10, color: item.pct === 100 ? C.greenDark : C.muted, width: 28, textAlign: "right" }}>
                  {item.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: "'DM Sans', 'Sora', sans-serif", fontSize: 17, fontWeight: 700, color: C.black, marginBottom: 4 }}>
            Brief-based content review
          </div>
          <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.55 }}>
            Submissions are checked against your brief. Content that misses standards is revised before payout is ever released.
          </div>
        </div>
      </div>
    </BentoCard>
  );
}

/* ══════════════════════════════════════════════════════════
   CARD 4 — Approved content becomes licensed
   Animation: Wallet balance counts up, then assets unlock
   one by one with a shimmer effect on the amount
   ══════════════════════════════════════════════════════════ */
function Card4() {
  const [phase, setPhase] = useState(0);
  const [walletAmt, setWalletAmt] = useState(0);
  const [unlockedAssets, setUnlockedAssets] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;

    // Count wallet up
    const target = 15200;
    const dur = 1200;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setWalletAmt(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(tick);
      else setPhase(1);
    };
    const raf = requestAnimationFrame(tick);

    // Unlock assets one by one
    const timers = [0, 1, 2, 3, 4].map((i) =>
      setTimeout(() => setUnlockedAssets(i + 1), 1400 + i * 280)
    );

    return () => { cancelAnimationFrame(raf); timers.forEach(clearTimeout); };
  }, [inView]);

  const assetTypes = ["Reel", "Story", "TikTok", "UGC Ad", "PDP"];

  return (
    <BentoCard>
      <div ref={ref} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
        <StepBadge n={4} />

        {/* Wallet card */}
        <div style={{
          background: C.offWhite, borderRadius: 14,
          border: `1px solid ${C.border}`, padding: 18,
          position: "relative", overflow: "hidden",
        }}>
          {/* Shimmer overlay */}
          {phase >= 1 && (
            <motion.div
              initial={{ x: "-100%", opacity: 0.6 }}
              animate={{ x: "200%", opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              style={{
                position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.18), transparent)",
                pointerEvents: "none", zIndex: 1,
              }}
            />
          )}

          <div style={{ fontSize: 10, fontWeight: 600, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
            Campaign Wallet
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{
              fontFamily: "'DM Sans', 'Sora', sans-serif",
              fontSize: 26, fontWeight: 800, color: C.black,
            }}>
              ₹{walletAmt.toLocaleString("en-IN")}
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={phase >= 1 ? { scale: 1 } : {}}
              transition={{ type: "spring", stiffness: 360, damping: 18, delay: 0.1 }}
              style={{
                width: 28, height: 28, borderRadius: "50%",
                background: C.green, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 13,
              }}
            >✓</motion.div>
          </div>

          {/* Line items */}
          {[
            { label: "Creator Fees", val: "₹0 upfront" },
            { label: "Approved Assets", val: `${unlockedAssets}` },
            { label: "Usage Rights", val: "Included" },
          ].map((row, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between",
              fontSize: 12, padding: "4px 0",
              borderTop: i === 0 ? `1px solid ${C.border}` : "none",
              color: i === 0 ? C.greenDark : C.secondary,
              fontWeight: i === 0 ? 600 : 400,
            }}>
              <span>{row.label}</span>
              <span style={{ fontWeight: 600, color: C.black }}>{row.val}</span>
            </div>
          ))}
        </div>

        {/* Asset unlock pills */}
        <div>
          <div style={{ fontSize: 11, color: C.muted, fontWeight: 500, marginBottom: 8 }}>Unlocked content</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {assetTypes.map((type, i) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={i < unlockedAssets ? { opacity: 1, scale: 1 } : { opacity: 0.25, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                style={{
                  padding: "4px 10px", borderRadius: 20,
                  background: i < unlockedAssets ? C.mintStart : C.border,
                  border: `1px solid ${i < unlockedAssets ? C.green : C.border}`,
                  fontSize: 11, fontWeight: 600,
                  color: i < unlockedAssets ? C.greenDark : C.muted,
                }}
              >
                {i < unlockedAssets ? "✓ " : ""}{type}
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: "'DM Sans', 'Sora', sans-serif", fontSize: 17, fontWeight: 700, color: C.black, marginBottom: 4 }}>
            Approved content becomes licensed
          </div>
          <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.55 }}>
            Once approved, payout releases and you receive reusable UGC with full usage rights for ads, PDPs, and social.
          </div>
        </div>
      </div>
    </BentoCard>
  );
}

/* ══════════════════════════════════════════════════════════
   BONUS CARD — Live stats strip (full width, short)
   ══════════════════════════════════════════════════════════ */
function StatsCard() {
  const stats = [
    { val: "₹0", label: "Upfront creator fees" },
    { val: "100%", label: "Content verified pre-payout" },
    { val: "14+", label: "Asset types per campaign" },
    { val: "48h", label: "Average review turnaround" },
  ];

  React.useEffect(() => {
    // Number counter animations
    const numberElements = document.querySelectorAll('[data-counter]');
    
    const animateNumber = (element, start, end, duration = 2000) => {
      let startTime = null;
      const originalValue = element.textContent || '';
      
      const formatNumber = (num) => {
        if (originalValue.includes('K')) {
          return Math.round(num).toString() + 'K';
        } else if (originalValue.includes('%')) {
          return Math.round(num).toString() + '%';
        } else if (originalValue.includes('h')) {
          return Math.round(num).toString() + 'h';
        } else if (originalValue.includes('₹')) {
          return '₹' + Math.round(num).toString();
        } else if (originalValue.includes('+')) {
          return Math.round(num).toString() + '+';
        }
        return Math.round(num).toString();
      };

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function - ease out cubic
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        const current = start + (end - start) * easedProgress;
        element.textContent = formatNumber(current);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    };

    // Set up intersection observer for number counters
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          const originalText = entry.target.textContent || '';
          let targetNumber = 0;
          
          if (originalText === '100%') targetNumber = 100;
          else if (originalText === '14+') targetNumber = 14;
          else if (originalText === '48h') targetNumber = 48;
          
          if (targetNumber > 0) {
            animateNumber(entry.target, 0, targetNumber, 1800);
          }
        }
      });
    }, { threshold: 0.5 });

    numberElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <BentoCard colSpan={3} style={{ background: C.black }}>
      <div style={{
        padding: "20px 28px", display: "flex",
        alignItems: "center", justifyContent: "space-around",
        gap: 12, flexWrap: "wrap",
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: "center", flex: 1, minWidth: 100 }}>
            <div 
              data-counter 
              style={{
                fontFamily: "'DM Sans', 'Sora', sans-serif",
                fontSize: 24, fontWeight: 800, color: C.green, lineHeight: 1,
              }}
            >{s.val}</div>
            <div style={{ fontSize: 11, color: "#6B7280", marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </BentoCard>
  );
}

/* ── Root export ──────────────────────────────────────────── */
export default function BrandKlipBento() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&display=swap');

        @media (prefers-reduced-motion: reduce) {
          * { animation-play-state: paused !important; transition: none !important; }
        }
      `}</style>

      <section style={{
        background: `linear-gradient(160deg, ${C.mintStart}55 0%, ${C.white} 45%)`,
        padding: "72px 24px",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{
            display: "inline-flex", alignItems: "center",
            border: `1px solid ${C.border}`, borderRadius: 100,
            padding: "5px 14px", marginBottom: 18,
            fontSize: 12, fontWeight: 500, color: C.secondary,
            background: C.white,
          }}>
            THE PROCESS
          </div>
          <h2 style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 800, color: C.black,
            lineHeight: 1.1, marginBottom: 14,
          }}>
            How BrandKlip<br />Actually Works.
          </h2>
          <p style={{ fontSize: 16, color: C.secondary, maxWidth: 500, margin: "0 auto" }}>
            A straightforward 4-step workflow designed to protect brand spend and content quality.
          </p>
        </div>

        {/* Bento grid */}
        <div style={{
          maxWidth: 980, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}>
          <Card1 />
          <Card2 />
          <Card4 />
          <Card3 />
          <StatsCard />
        </div>
      </section>
    </>
  );
}