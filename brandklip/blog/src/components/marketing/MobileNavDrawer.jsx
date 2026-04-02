"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

export function MobileNavDrawer({ signupHref, triggerSelector = ".menu-toggle" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activePath, setActivePath] = useState("");

  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const rowsRef = useRef([]);
  const triggerRef = useRef(null);
  const tlRef = useRef(null);

  const links = useMemo(
    () => [
      { label: "For Creators", href: "/creators", dataNavLink: "/creators" },
      { label: "Docs", href: "/blog", dataNavLink: "/blog" },
      { label: "Contact", href: "/contact", dataNavLink: "/contact" },
      { label: "Join for Free", href: signupHref },
    ],
    [signupHref]
  );

  useEffect(() => {
    const normalizedPath = (window.location.pathname || "/").replace(/\/$/, "") || "/";
    setActivePath(normalizedPath);
  }, []);

  useEffect(() => {
    const trigger = document.querySelector(triggerSelector);
    if (!trigger) return;

    triggerRef.current = trigger;

    const handleOpen = () => setIsOpen(true);
    trigger.addEventListener("click", handleOpen);

    return () => {
      trigger.removeEventListener("click", handleOpen);
    };
  }, [triggerSelector]);

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    trigger.setAttribute("aria-expanded", String(isOpen));
    trigger.classList.toggle("is-open", isOpen);
  }, [isOpen]);

  useEffect(() => {
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    const rows = rowsRef.current.filter(Boolean);

    if (!backdrop || !panel || rows.length === 0) return;

    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }

    gsap.set(backdrop, { autoAlpha: 0, display: "none" });
    gsap.set(panel, { autoAlpha: 0, y: -14, scale: 0.96, display: "none" });
    gsap.set(rows, { autoAlpha: 0, x: -14 });

    const tl = gsap.timeline({ paused: true });
    tl.to(backdrop, { autoAlpha: 1, display: "block", duration: 0.22, ease: "power2.out" })
      .to(
        panel,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          display: "block",
          duration: 0.38,
          ease: "expo.out",
        },
        "-=0.12"
      )
      .to(
        rows,
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.28,
          stagger: 0.055,
          ease: "power3.out",
        },
        "-=0.22"
      );

    tlRef.current = tl;

    return () => {
      tl.kill();
      tlRef.current = null;
    };
  }, [links.length]);

  useEffect(() => {
    const tl = tlRef.current;
    const backdrop = backdropRef.current;
    const panel = panelRef.current;

    if (!tl || !backdrop || !panel) return;

    if (isOpen) {
      gsap.set([backdrop, panel], { display: "block" });
      tl.play(0);
      return;
    }

    if (tl.progress() === 0) {
      gsap.set([backdrop, panel], { display: "none" });
      return;
    }

    tl.eventCallback("onReverseComplete", () => {
      gsap.set([backdrop, panel], { display: "none" });
      tl.eventCallback("onReverseComplete", null);
    });
    tl.reverse();
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (event) => {
      if (event.matches) setIsOpen(false);
    };

    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  const handleClose = () => setIsOpen(false);

  const handleRowEnter = (index) => {
    const row = rowsRef.current[index];
    if (!row) return;

    gsap.to(row, { x: 5, color: "#ffffff", duration: 0.18, ease: "power2.out" });
    gsap.to(row.querySelector(".chevron"), {
      x: 3,
      color: "rgba(255,255,255,0.8)",
      duration: 0.18,
      ease: "power2.out",
    });
  };

  const handleRowLeave = (index) => {
    const row = rowsRef.current[index];
    if (!row) return;

    const targetHref = links[index]?.href || "";
    const normalizedHref = targetHref.startsWith("/")
      ? targetHref.replace(/\/$/, "") || "/"
      : "";
    const isActive = normalizedHref && normalizedHref === activePath;

    gsap.to(row, {
      x: 0,
      color: isActive ? "#ffffff" : "rgba(255,255,255,0.82)",
      duration: 0.22,
      ease: "power2.inOut",
    });
    gsap.to(row.querySelector(".chevron"), {
      x: 0,
      color: "rgba(255,255,255,0.32)",
      duration: 0.22,
      ease: "power2.inOut",
    });
  };

  return (
    <div>
      <div
        ref={backdropRef}
        onClick={handleClose}
        style={{
          display: "none",
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.45)",
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
          zIndex: 59,
        }}
      />

      <div
        id="mobile-nav-drawer"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        style={{
          display: "none",
          position: "fixed",
          top: 12,
          left: 12,
          right: 12,
          zIndex: 60,
          borderRadius: 20,
          overflow: "hidden",
          background: "rgba(24, 23, 20, 0.84)",
          backdropFilter: "blur(32px) saturate(180%)",
          WebkitBackdropFilter: "blur(32px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px 12px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <a
            href="/"
            onClick={handleClose}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              color: "#fff",
            }}
          >
            <img
              src="/logo-black.png"
              alt="BrandKlip"
              style={{ height: 30, width: "auto", filter: "invert(1)" }}
            />
            <span
              style={{
                fontFamily: "Bricolage Grotesque, sans-serif",
                fontWeight: 700,
                fontSize: 28,
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              BrandKlip
            </span>
          </a>

          <button
            onClick={handleClose}
            aria-label="Close menu"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.07)",
              color: "rgba(255,255,255,0.65)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "4px 20px 12px" }}>
          {links.map((link, index) => {
            const normalizedHref = link.href.startsWith("/")
              ? link.href.replace(/\/$/, "") || "/"
              : "";
            const isActive = normalizedHref && normalizedHref === activePath;

            return (
              <a
                key={link.href}
                ref={(el) => {
                  rowsRef.current[index] = el;
                }}
                href={link.href}
                data-nav-link={link.dataNavLink}
                onClick={handleClose}
                onMouseEnter={() => handleRowEnter(index)}
                onMouseLeave={() => handleRowLeave(index)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "17px 0",
                  fontSize: 22,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#ffffff" : "rgba(255,255,255,0.82)",
                  textDecoration: "none",
                  borderBottom:
                    index < links.length - 1
                      ? "1px solid rgba(255,255,255,0.07)"
                      : "none",
                  letterSpacing: "-0.01em",
                  willChange: "transform",
                }}
              >
                {link.label}
                <span
                  className="chevron"
                  style={{
                    fontSize: 20,
                    color: "rgba(255,255,255,0.32)",
                    lineHeight: 1,
                  }}
                >
                  ›
                </span>
              </a>
            );
          })}
        </div>

        <div style={{ height: 8 }} />
      </div>
    </div>
  );
}
