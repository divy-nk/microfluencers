/**
 * Animation Utilities for BrandKlip Marketing Website
 * Reusable GSAP configurations and presets
 */

export const animationConfig = {
  durations: {
    instant: 0.15,
    fast: 0.25,
    normal: 0.4,
    medium: 0.6,
    slow: 0.8,
    verySlow: 1.2,
  },
  easings: {
    smooth: "power2.out",
    smoothIn: "power2.in",
    smoothInOut: "power2.inOut",
    bounce: "elastic.out(1, 0.5)",
    bounceSoft: "elastic.out(1, 0.75)",
    snap: "power4.inOut",
    gentle: "sine.inOut",
    ease: "power3.out",
    sharp: "power4.out",
  },
  staggers: {
    tight: 0.05,
    normal: 0.1,
    relaxed: 0.15,
    lazy: 0.2,
  },
};

// Scroll reveal animations with different patterns
export const scrollRevealVariants = {
  fadeUp: {
    y: 40,
    opacity: 0,
  },
  fadeDown: {
    y: -40,
    opacity: 0,
  },
  fadeLeft: {
    x: -60,
    opacity: 0,
  },
  fadeRight: {
    x: 60,
    opacity: 0,
  },
  scale: {
    scale: 0.9,
    opacity: 0,
  },
  scaleUp: {
    scale: 1.1,
    opacity: 0,
  },
  blur: {
    filter: "blur(10px)",
    opacity: 0,
  },
  rotateIn: {
    rotation: -15,
    scale: 0.9,
    opacity: 0,
  },
};

// Card hover animation preset
export const cardHoverAnimation = {
  y: -8,
  scale: 1.02,
  boxShadow: "0 20px 40px rgba(15, 23, 42, 0.15)",
  duration: animationConfig.durations.normal,
  ease: animationConfig.easings.smooth,
};

// Brand colors for animations
export const brandColors = {
  green: "#22c55e",
  greenLight: "rgba(34, 197, 94, 0.2)",
  mint: "#c8f0e0",
  mintLight: "#f0fbf6",
  black: "#0d0d0d",
  white: "#ffffff",
};

// Number Counter Animation Utility
export const animateNumber = (element: Element, start: number, end: number, duration: number = 2000) => {
  let startTime: number | null = null;
  const originalValue = element.textContent || '';

  const formatNumber = (num: number): string => {
    if (originalValue.includes('K')) {
      if (num >= 1000) {
        return Math.round(num/1000).toString() + 'K';
      }
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

  const animate = (timestamp: number) => {
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
