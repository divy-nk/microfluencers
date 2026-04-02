import { Fragment, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   BrandKlip Trust & Escrow Section — Animated
   
   Dependencies: GSAP (gsap + ScrollTrigger)
   Brand: Jet Black #0D0D0D, Accent Green #22C55E,
          Bricolage Grotesque + DM Sans
   
   Usage in Astro:
   <TrustEscrowAnimated client:visible />
   ───────────────────────────────────────────── */

const steps = [
  {
    num: "1",
    title: "Deposit via Razorpay",
    desc: "Fund your campaign through Razorpay and lock the money before creators start.",
  },
  {
    num: "2",
    title: "Locked Until BrandKlip Verifies",
    desc: "Funds stay in escrow and only release after BrandKlip verifies the video against your brief.",
  },
  {
    num: "3",
    title: "Every Payment Tracked",
    desc: "Every deposit and release is recorded so your team can verify each transaction.",
  },
];

export default function TrustEscrowAnimated() {
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const headingRef = useRef(null);
  const descRef = useRef(null);
  const razorpayRef = useRef(null);
  const cardsRef = useRef([]);
  const lineRef = useRef(null);
  const shimmerRef = useRef(null);

  useEffect(() => {
    let ctx;
    const initGSAP = async () => {
      const gsapModule = await import("gsap");
      const g = gsapModule.gsap || gsapModule.default || gsapModule;

      let ScrollTrigger;
      try {
        const stModule = await import("gsap/ScrollTrigger");
        ScrollTrigger = stModule.ScrollTrigger || stModule.default;
      } catch {
        try {
          const stModule = await import("gsap/dist/ScrollTrigger");
          ScrollTrigger = stModule.ScrollTrigger || stModule.default;
        } catch {
          // Fallback: ScrollTrigger might be on gsap itself
          ScrollTrigger = g.ScrollTrigger;
        }
      }

      if (ScrollTrigger) g.registerPlugin(ScrollTrigger);

      ctx = g.context(() => {
        const tl = g.timeline({
          scrollTrigger: ScrollTrigger
            ? {
                trigger: sectionRef.current,
                start: "top 75%",
                once: true,
              }
            : undefined,
          defaults: { ease: "power3.out" },
        });

        // Badge
        tl.fromTo(
          badgeRef.current,
          { opacity: 0, y: 10, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4 }
        );

        // Heading
        tl.fromTo(
          headingRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.15"
        );

        // Description
        tl.fromTo(
          descRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.45 },
          "-=0.2"
        );

        // Razorpay badge — fade in + shimmer
        tl.fromTo(
          razorpayRef.current,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.5 },
          "-=0.3"
        );

        // Shimmer sweep on Razorpay badge
        if (shimmerRef.current) {
          tl.fromTo(
            shimmerRef.current,
            { x: "-100%" },
            { x: "200%", duration: 0.8, ease: "power2.inOut" },
            "-=0.1"
          );
        }

        // Cards — sequential reveal with connector line drawing between
        cardsRef.current.forEach((card, i) => {
          if (!card) return;

          // Card entrance
          tl.fromTo(
            card,
            { opacity: 0, y: 24, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.45 },
            i === 0 ? "-=0.1" : "-=0.05"
          );

          // Draw connector line after each card (except last)
          if (i < steps.length - 1 && lineRef.current) {
            const lines = lineRef.current.querySelectorAll(".trust-connector-segment");
            if (lines[i]) {
              tl.fromTo(
                lines[i],
                { scaleX: 0 },
                { scaleX: 1, duration: 0.35, ease: "power2.inOut" },
                "-=0.15"
              );
            }
          }
        });

        // Number badges pop
        const nums = sectionRef.current?.querySelectorAll(".trust-step-num");
        if (nums?.length) {
          tl.fromTo(
            nums,
            { scale: 0, opacity: 0 },
            {
              scale: 1, opacity: 1,
              duration: 0.3, stagger: 0.1,
              ease: "back.out(2.5)",
            },
            "-=0.8"
          );
        }
      }, sectionRef);
    };

    initGSAP();
    return () => ctx?.revert();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700&display=swap');

        .bk-trust {
          max-width: 1120px;
          margin: 0 auto;
          padding: 80px 24px;
          font-family: 'DM Sans', sans-serif;
        }
        .bk-trust-inner {
          background: linear-gradient(165deg, #f0fdf4 0%, #f8fef8 40%, #fff 100%);
          border: 1.5px solid #dcfce7;
          border-radius: 24px;
          padding: 48px 40px;
          position: relative;
          overflow: hidden;
        }
        .bk-trust-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 32px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }
        .bk-trust-heading {
          font-family: 'Bricolage Grotesque', serif;
          font-weight: 800;
          font-size: clamp(24px, 4vw, 34px);
          line-height: 1.1;
          color: #0D0D0D;
          margin: 0;
          max-width: 480px;
          opacity: 0;
        }
        .bk-trust-desc {
          font-size: 15px;
          line-height: 1.55;
          color: #6b7280;
          margin: 12px 0 0;
          max-width: 480px;
          opacity: 0;
        }

        .bk-trust-razorpay {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          opacity: 0;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }
        .bk-trust-razorpay-shimmer {
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(34,197,94,0.06) 40%,
            rgba(34,197,94,0.12) 50%,
            rgba(34,197,94,0.06) 60%,
            transparent 100%
          );
          pointer-events: none;
          transform: translateX(-100%);
        }
        .bk-trust-razorpay-logo-img {
          height: 24px;
          width: auto;
          object-fit: contain;
          display: block;
        }
        .bk-trust-razorpay-label {
          font-size: 12px;
          color: #9ca3af;
          font-weight: 500;
        }

        /* Steps grid */
        .bk-trust-steps {
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr;
          align-items: stretch;
          gap: 0;
          position: relative;
        }
        .bk-trust-step {
          padding: 28px 24px;
          background: #fff;
          border: 1.5px solid #e5e7eb;
          border-radius: 16px;
          opacity: 0;
          position: relative;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        @media (hover: hover) and (pointer: fine) {
          .bk-trust-step:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.05);
          }
        }

        .trust-step-num {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          border: 1.5px solid #dcfce7;
          background: #f0fdf4;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Bricolage Grotesque', serif;
          font-weight: 700;
          font-size: 13px;
          color: #15803d;
          margin-bottom: 14px;
          opacity: 0;
          transform: scale(0);
        }

        .bk-trust-step-title {
          font-family: 'Bricolage Grotesque', serif;
          font-weight: 700;
          font-size: 16px;
          color: #0D0D0D;
          margin: 0 0 6px;
          line-height: 1.25;
        }
        .bk-trust-step-desc {
          font-size: 13px;
          line-height: 1.5;
          color: #6b7280;
          margin: 0;
        }

        /* Connector between cards */
        .trust-connector {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
        }
        .trust-connector-segment {
          width: 32px;
          height: 2px;
          background: linear-gradient(90deg, #22C55E, #86efac);
          border-radius: 2px;
          transform-origin: left center;
          transform: scaleX(0);
        }

        @media (max-width: 768px) {
          .bk-trust { padding: 48px 16px; }
          .bk-trust-inner { padding: 32px 20px; }
          .bk-trust-header { flex-direction: column; }
          .bk-trust-razorpay { width: 100%; }
          .bk-trust-steps {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .bk-trust-step {
            padding: 22px 18px;
          }
          .bk-trust-step-title {
            font-size: 15px;
          }
          .trust-connector {
            justify-content: center;
            padding: 4px 0;
          }
          .trust-connector-segment {
            width: 2px;
            height: 24px;
            transform-origin: top center;
          }
        }
      `}</style>

      <section className="bk-trust" ref={sectionRef}>
        <div className="bk-trust-inner">
          {/* Header */}
          <div className="bk-trust-header">
            <div>
              <div className="pill-animated brand-benefits-pill" ref={badgeRef} style={{ marginBottom: 16 }}>
                <span className="brand-benefits-pill__icon" aria-hidden="true">✦</span>
                <span className="brand-benefits-pill__label">Trust & Security</span>
              </div>
              <h2 className="bk-trust-heading" ref={headingRef}>
                Your Money Is Protected Until BrandKlip Verifies Delivery.
              </h2>
              <p className="bk-trust-desc" ref={descRef}>
                Every campaign runs on Razorpay escrow. Funds are locked the moment a campaign goes
                live. They only release after BrandKlip verifies the submission meets your brief –
                not a second before.
              </p>
            </div>
            <div className="bk-trust-razorpay" ref={razorpayRef}>
              <div className="bk-trust-razorpay-shimmer" ref={shimmerRef} />
              <img src="/razorpay-logo.png" alt="Razorpay" className="bk-trust-razorpay-logo-img" loading="lazy" decoding="async" />
              <span className="bk-trust-razorpay-label">Trusted payment partner</span>
            </div>
          </div>

          {/* Steps */}
          <div className="bk-trust-steps" ref={lineRef}>
            {steps.map((step, i) => (
              <Fragment key={i}>
                {/* Connector before card (except first) */}
                {i > 0 && (
                  <div className="trust-connector">
                    <div className="trust-connector-segment" />
                  </div>
                )}
                <div
                  className="bk-trust-step"
                  ref={(el) => (cardsRef.current[i] = el)}
                >
                  <div className="trust-step-num">{step.num}</div>
                  <h3 className="bk-trust-step-title">{step.title}</h3>
                  <p className="bk-trust-step-desc">{step.desc}</p>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}