"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

export function MobileNavExpand({ loginHref, signupHref, triggerSelector = ".menu-toggle" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activePath, setActivePath] = useState("");

  const rootRef = useRef(null);
  const innerRef = useRef(null);
  const dividerRef = useRef(null);
  const triggerRef = useRef(null);
  const linkRefs = useRef([]);
  const tlRef = useRef(null);

  const links = useMemo(
    () => [
      { label: "For Creators", href: "/creators", dataNavLink: "/creators" },
      { label: "Pricing", href: "/pricing", dataNavLink: "/pricing" },
      { label: "Docs", href: "/blog", dataNavLink: "/blog" },
      { label: "Login", href: loginHref, suppressExternalIcon: true },
      { label: "Join for Free", href: signupHref, suppressExternalIcon: true },
    ],
    [loginHref, signupHref]
  );

  useEffect(() => {
    const normalizedPath = (window.location.pathname || "/").replace(/\/$/, "") || "/";
    setActivePath(normalizedPath);
  }, []);

  useEffect(() => {
    const trigger = document.querySelector(triggerSelector);
    if (!trigger) return;

    triggerRef.current = trigger;

    const handleToggle = () => {
      setIsOpen((prev) => !prev);
    };

    trigger.addEventListener("click", handleToggle);
    return () => {
      trigger.removeEventListener("click", handleToggle);
    };
  }, [triggerSelector]);

  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    trigger.setAttribute("aria-expanded", String(isOpen));
    trigger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    trigger.classList.toggle("is-open", isOpen);
  }, [isOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 721px)");
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

  useEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    const divider = dividerRef.current;
    const rows = linkRefs.current.filter(Boolean);

    if (!root || !inner || !divider || rows.length === 0) return;

    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }

    gsap.killTweensOf([root, divider, rows]);

    if (isOpen) {
      gsap.set(root, { height: "auto" });
      const expandedHeight = root.offsetHeight;
      gsap.set(root, { height: 0 });
      gsap.set(inner, { y: 0 });
      gsap.set(divider, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(rows, { autoAlpha: 0, y: 10 });

      const tl = gsap.timeline();
      tl.to(root, {
        height: expandedHeight,
        duration: 0.36,
        ease: "power3.out",
      })
        .to(
          divider,
          {
            scaleX: 1,
            duration: 0.2,
            ease: "power2.out",
          },
          "-=0.12"
        )
        .to(
          rows,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.24,
            stagger: 0.06,
            ease: "power2.out",
          },
          "-=0.06"
        )
        .to(
          inner,
          {
            y: -2,
            duration: 0.08,
            ease: "power1.out",
          },
          "-=0.02"
        )
        .to(inner, {
          y: 0,
          duration: 0.18,
          ease: "back.out(2.2)",
        })
        .set(root, { height: "auto" });

      tlRef.current = tl;
      return;
    }

    const currentHeight = root.offsetHeight;
    gsap.set(root, { height: currentHeight });

    const tl = gsap.timeline();
    tl.to(rows, {
      autoAlpha: 0,
      y: 10,
      duration: 0.16,
      stagger: { each: 0.04, from: "end" },
      ease: "power2.in",
    })
      .to(
        divider,
        {
          scaleX: 0,
          duration: 0.16,
          ease: "power2.in",
        },
        "-=0.1"
      )
      .to(
        root,
        {
          height: 0,
          duration: 0.28,
          ease: "power3.inOut",
        },
        "-=0.08"
      );

    tlRef.current = tl;
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleRowEnter = (index) => {
    const row = linkRefs.current[index];
    if (!row) return;

    const chevron = row.querySelector(".mobile-nav-expand-chevron");
    gsap.to(row, { x: 4, duration: 0.18, ease: "power2.out" });
    if (chevron) {
      gsap.to(chevron, { color: "rgba(13, 13, 13, 0.85)", duration: 0.18, ease: "power2.out" });
    }
  };

  const handleRowLeave = (index, isActive) => {
    const row = linkRefs.current[index];
    if (!row) return;

    const chevron = row.querySelector(".mobile-nav-expand-chevron");
    gsap.to(row, { x: 0, duration: 0.2, ease: "power2.inOut" });
    if (chevron) {
      gsap.to(chevron, {
        color: isActive ? "rgba(13, 13, 13, 0.62)" : "rgba(13, 13, 13, 0.38)",
        duration: 0.2,
        ease: "power2.inOut",
      });
    }
  };

  return (
    <div
      id="mobile-nav-expand"
      className="mobile-nav-expand"
      ref={rootRef}
      aria-hidden={!isOpen}
    >
      <div className="mobile-nav-expand-inner" ref={innerRef}>
        <div className="mobile-nav-expand-divider" ref={dividerRef} />
        <div className="mobile-nav-expand-links">
          {links.map((link, index) => {
            const normalizedHref = link.href.startsWith("/")
              ? link.href.replace(/\/$/, "") || "/"
              : "";
            const isActive = normalizedHref && normalizedHref === activePath;

            return (
              <a
                key={link.href}
                ref={(el) => {
                  linkRefs.current[index] = el;
                }}
                href={link.href}
                data-nav-link={link.dataNavLink}
                data-no-external-icon={link.suppressExternalIcon ? "true" : undefined}
                className={`mobile-nav-expand-link${isActive ? " is-active" : ""}`}
                onClick={handleClose}
                onMouseEnter={() => handleRowEnter(index)}
                onMouseLeave={() => handleRowLeave(index, isActive)}
              >
                <span>{link.label}</span>
                <span className="mobile-nav-expand-chevron" aria-hidden="true">
                  ›
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
