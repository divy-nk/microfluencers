import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   BrandKlip Final CTA — "Your First Campaign Costs ₹0"
   
   Dependencies: GSAP (gsap + ScrollTrigger)
   Brand: Jet Black #0D0D0D, Accent Green #22C55E,
          Bricolage Grotesque + DM Sans
   
   Features:
   - ₹5,000 → ₹0 countdown on scroll-enter
   - "3 of 5 spots remaining" with live pulse dot
   - CTA button with radial glow breathing
   
   Usage in Astro:
   <FinalCTAAnimated client:visible />
   ───────────────────────────────────────────── */

export default function FinalCTAAnimated() {
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const headingRef = useRef(null);
  const priceRef = useRef(null);
  const descRef = useRef(null);
  const spotsRef = useRef(null);
  const dotRef = useRef(null);
  const ctaWrapRef = useRef(null);
  const demoBtnRef = useRef(null);
  const [priceDisplay, setPriceDisplay] = useState("₹5,000");

  useEffect(() => {
    let ctx;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches ||
      navigator.maxTouchPoints > 0;

    if (prefersReducedMotion || isTouchDevice) {
      setPriceDisplay("₹0");
      return undefined;
    }

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
          ScrollTrigger = g.ScrollTrigger;
        }
      }

      if (ScrollTrigger) g.registerPlugin(ScrollTrigger);

      ctx = g.context(() => {
        const tl = g.timeline({
          scrollTrigger: ScrollTrigger
            ? {
                trigger: sectionRef.current,
                start: "top 70%",
                once: true,
              }
            : undefined,
          defaults: { ease: "power3.out" },
        });

        // Badge entrance
        tl.fromTo(
          badgeRef.current,
          { opacity: 0, y: 8, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4 }
        );

        // Heading fade up
        tl.fromTo(
          headingRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.15"
        );

        // Price countdown — ₹5,000 → ₹0
        const priceObj = { val: 5000 };
        tl.to(
          priceObj,
          {
            val: 0,
            duration: 1.6,
            ease: "power2.inOut",
            onUpdate: () => {
              const v = Math.round(priceObj.val);
              if (v === 0) {
                setPriceDisplay("₹0");
              } else {
                setPriceDisplay("₹" + v.toLocaleString("en-IN"));
              }
            },
          },
          "-=0.3"
        );

        // Price scale pop at zero
        tl.fromTo(
          priceRef.current,
          { scale: 1 },
          {
            scale: 1.06,
            duration: 0.15,
            ease: "power2.out",
            yoyo: true,
            repeat: 1,
          },
          "-=0.05"
        );

        // Description
        tl.fromTo(
          descRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.45 },
          "-=0.3"
        );

        // CTA buttons
        tl.fromTo(
          ctaWrapRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" },
          "-=0.2"
        );

        // Spots remaining
        tl.fromTo(
          spotsRef.current,
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.35 },
          "-=0.3"
        );

        // Infinite animations

        // Pulse dot
        g.to(dotRef.current, {
          scale: 1.8,
          opacity: 0,
          duration: 1.2,
          repeat: -1,
          ease: "power2.out",
        });
      }, sectionRef);
    };

    initGSAP();
    return () => ctx?.revert();
  }, []);

  return (
    <>
      <style>{`
        .bk-final-cta {
          max-width: 720px;
          margin: 0 auto;
          padding: 80px 24px 60px;
          text-align: center;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          z-index: 2;
          background: transparent;
        }

        #cta.cta-island::before {
          opacity: 1;
          filter: blur(12px);
          background: radial-gradient(130% 84% at 50% 112%, rgba(34, 197, 94, 0.38) 0%, rgba(34, 197, 94, 0.15) 36%, rgba(34, 197, 94, 0) 74%);
        }

        #cta.cta-island::after {
          opacity: 1;
          background: radial-gradient(142% 98% at 50% 108%, rgba(200, 240, 224, 0.64) 0%, rgba(200, 240, 224, 0.30) 40%, rgba(200, 240, 224, 0) 78%);
        }

        .bk-final-heading {
          font-family: 'Bricolage Grotesque', serif;
          font-weight: 800;
          font-size: clamp(30px, 6vw, 52px);
          line-height: 1.08;
          color: #0D0D0D;
          margin: 0 0 4px;
          opacity: 1;
        }

        .bk-final-price {
          display: inline-block;
          color: #9fdcc5;
          will-change: transform;
          font-variant-numeric: tabular-nums;
        }

        .bk-final-desc {
          font-size: clamp(14px, 2vw, 16px);
          line-height: 1.6;
          color: #6b7280;
          max-width: 500px;
          margin: 20px auto 32px;
          opacity: 1;
        }

        .bk-final-cta-buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          opacity: 1;
        }

        .bk-final-primary-link {
          display: inline-flex;
          text-decoration: none;
        }

        .bk-final-primary-link.micro-cta {
          min-height: 52px;
          padding: 0.95rem 1.6rem;
        }

        /* Secondary CTA */
        .bk-final-btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 16px 24px;
          border-radius: 50px;
          background: #fff;
          color: #0D0D0D;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          border: 1.5px solid #e5e7eb;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .bk-final-btn-secondary-label {
          line-height: 1;
        }

        .bk-final-btn-secondary-icon {
          display: none;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          margin-left: 10px;
          border-radius: 999px;
          background: #ececec;
          color: #0D0D0D;
          flex-shrink: 0;
        }

        .bk-final-btn-secondary-icon svg {
          width: 14px;
          height: 14px;
          stroke: currentColor;
          stroke-width: 2.2;
          fill: none;
        }

        @media (hover: hover) and (pointer: fine) {
          .bk-final-btn-secondary:hover {
            transform: translateY(-2px);
            border-color: #d1d5db;
            box-shadow: 0 6px 20px rgba(0,0,0,0.06);
          }
        }

        /* Spots remaining */
        .bk-final-spots {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 20px;
          font-size: 13px;
          font-weight: 600;
          color: #22C55E;
          opacity: 1;
        }
        .bk-final-spots-dot-wrap {
          position: relative;
          width: 10px;
          height: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bk-final-spots-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22C55E;
        }
        .bk-final-spots-dot-ping {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22C55E;
          will-change: transform, opacity;
        }

        @media (max-width: 640px) {
          .bk-final-cta { padding: 60px 16px 40px; }
          .bk-final-heading {
            font-size: clamp(30px, 11vw, 40px);
            line-height: 1.12;
            text-wrap: balance;
          }
          .bk-final-desc {
            margin: 16px auto 24px;
            text-wrap: pretty;
          }
          .bk-final-cta-buttons {
            flex-direction: column;
            align-items: center;
            width: 100%;
            max-width: 340px;
            margin: 0 auto;
            gap: 10px;
          }
          .bk-final-primary-link {
            width: 100%;
            flex: 1 1 auto;
            min-width: 0;
            margin: 0;
            justify-content: center;
          }
          .bk-final-primary-link.micro-cta {
            min-height: 48px;
            padding: 0 12px;
            font-size: 14px;
            box-shadow: none;
          }
          .bk-final-btn-secondary {
            width: 100%;
            flex: 1 1 auto;
            min-width: 0;
            min-height: 48px;
            padding: 0 12px;
            font-size: 14px;
            justify-content: center;
            border: 1.5px solid #dadde1;
            background: #f4f4f4;
            box-shadow: none;
          }
          .bk-final-btn-secondary-icon {
            display: inline-flex;
            width: 34px;
            height: 34px;
            margin-left: 8px;
            background: #e6e6e6;
          }
          .bk-final-spots { margin-top: 16px; }
        }
      `}</style>

      <section className="bk-final-cta" ref={sectionRef}>
        {/* Badge */}
        <div className="pill-animated brand-benefits-pill" ref={badgeRef} style={{ marginBottom: 24 }}>
          <span className="brand-benefits-pill__icon" aria-hidden="true">✦</span>
          <span className="brand-benefits-pill__label">Founding Brands</span>
        </div>

        {/* Heading with animated price */}
        <h2 className="bk-final-heading" ref={headingRef}>
          Your first campaign{" "}
          <br />
          costs{" "}
          <span className="bk-final-price" ref={priceRef}>
            {priceDisplay}
          </span>{" "}
          to start.
        </h2>

        {/* Description */}
        <p className="bk-final-desc" ref={descRef}>
          We're onboarding 5 founding brands with free campaign credits worth ₹5000 INR.
          No agency fees. No lock-in. Just real UGC from vetted Indian creators –
          paid only on delivery.
        </p>

        {/* Buttons */}
        <div className="bk-final-cta-buttons" ref={ctaWrapRef}>
          <a href="/signup" className="bk-final-primary-link micro-cta">
            <span>Claim your Spot</span>
            <span className="micro-cta__icon" aria-hidden="true">→</span>
          </a>
          <a href="/contact" className="bk-final-btn-secondary" ref={demoBtnRef}>
            <span className="bk-final-btn-secondary-label">Request a Demo</span>
            <span className="bk-final-btn-secondary-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.94.33 1.86.62 2.74a2 2 0 0 1-.45 2.11L8 9.85a16 16 0 0 0 6.15 6.15l1.28-1.28a2 2 0 0 1 2.11-.45c.88.29 1.8.5 2.74.62A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
          </a>
        </div>

        {/* Spots remaining with pulse */}
        <div className="bk-final-spots" ref={spotsRef}>
          <div className="bk-final-spots-dot-wrap">
            <div className="bk-final-spots-dot" />
            <div className="bk-final-spots-dot-ping" ref={dotRef} />
          </div>
          3 of 5 spots remaining
        </div>
      </section>
    </>
  );
}