type PixelColor = "lime" | "bloodred" | "sky";
type PixelShade = "white" | "black";

interface CyberpunkButtonProps {
  buttonColor?: PixelColor;
  pixelColor?: PixelShade;
  buttonText?: string;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  as?: "button" | "div";
  trailingLogoSrc?: string;
  trailingLogoAlt?: string;
  trailingLogoHeight?: number;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const colorMap: Record<PixelColor, string> = {
  lime: "#c8f0e0",
  bloodred: "#f03030",
  sky: "#3275f8",
};

const gradientMap: Record<PixelColor, string> = {
  lime: "linear-gradient(to bottom, #c8f0e0, #f0fbf6)",
  bloodred: "linear-gradient(to bottom, #f03030, #e11d2e)",
  sky: "linear-gradient(to bottom, #4a8af9, #2563eb)",
};

const pixelShadeMap: Record<PixelShade, { active: string; inactive: string }> = {
  white: {
    active: "rgba(255,255,255,1)",
    inactive: "rgba(255,255,255,0.55)",
  },
  black: {
    active: "rgba(15,15,15,1)",
    inactive: "rgba(15,15,15,0.55)",
  },
};

const sizeMap = {
  sm: {
    height: "44px",
    trackWidth: "42px",
    textSize: "14px",
    leftPadding: "58px",
    rightPadding: "16px",
    borderRadiusOuter: "11px",
    borderRadiusInner: "7px",
  },
  md: {
    height: "50px",
    trackWidth: "48px",
    textSize: "15px",
    leftPadding: "66px",
    rightPadding: "20px",
    borderRadiusOuter: "12px",
    borderRadiusInner: "8px",
  },
  lg: {
    height: "58px",
    trackWidth: "56px",
    textSize: "16px",
    leftPadding: "72px",
    rightPadding: "24px",
    borderRadiusOuter: "12px",
    borderRadiusInner: "8px",
  },
} as const;

const cyberpunkButtonStyles = `
  .cyberpunk-btn {
    position: relative;
    display: flex;
    align-items: center;
    outline: none;
    overflow: hidden;
  }

  .cyberpunk-btn__label {
    transition: opacity 0.3s, transform 0.3s;
    opacity: 1;
    transform: translateX(0);
  }

  .cyberpunk-btn:not(:disabled):not([aria-disabled="true"]):is(:hover, :active, :focus-visible) .cyberpunk-btn__label {
    opacity: 0;
    transform: translateX(-8px);
  }

  .cyberpunk-btn__track {
    transition: width 0.5s cubic-bezier(0.2, 0, 0, 1);
    background-image: none;
  }

  .cyberpunk-btn:not(:disabled):not([aria-disabled="true"]):is(:hover, :active, :focus-visible) .cyberpunk-btn__track {
    width: calc(100% - 8px) !important;
    background-image: var(--cp-gradient);
  }

  .cyberpunk-btn__grid--hover {
    display: none;
  }

  .cyberpunk-btn:not(:disabled):not([aria-disabled="true"]):is(:hover, :active, :focus-visible) .cyberpunk-btn__grid--rest {
    display: none;
  }

  .cyberpunk-btn:not(:disabled):not([aria-disabled="true"]):is(:hover, :active, :focus-visible) .cyberpunk-btn__grid--hover {
    display: grid;
  }

  .cyberpunk-btn__pixel {
    width: 3px;
    height: 3px;
    border-radius: 1px;
    background-color: transparent;
  }

  .cyberpunk-btn__pixel--rest {
    background-color: var(--cp-pixel-inactive);
    animation: cpRestShimmer 1.1s linear infinite;
    animation-delay: calc(var(--cp-phase, 0) * 110ms);
  }

  .cyberpunk-btn__pixel--hover {
    background-color: var(--cp-pixel-inactive);
    animation: cpHoverSweep 720ms linear infinite;
    animation-delay: calc(var(--cp-arrow-index, 0) * 120ms);
  }

  @keyframes cpRestShimmer {
    0%,
    72%,
    100% {
      background-color: var(--cp-pixel-inactive);
    }
    73%,
    78% {
      background-color: var(--cp-pixel-active);
    }
  }

  @keyframes cpHoverSweep {
    0%,
    65%,
    100% {
      background-color: var(--cp-pixel-inactive);
    }
    66%,
    86% {
      background-color: var(--cp-pixel-active);
    }
  }
`;

export default function CyberpunkButton({
  buttonColor = "lime",
  pixelColor = "white",
  buttonText = "Pay securely",
  size = "lg",
  fullWidth = true,
  as = "button",
  trailingLogoSrc,
  trailingLogoAlt = "logo",
  trailingLogoHeight = 13,
  onClick,
  disabled = false,
  className = "",
}: CyberpunkButtonProps) {
  const rows = 5;
  const gap = 2;
  const spacing = 5;
  const centerRow = 2;
  const colsHovered = 30;
  const arrowCols = spacing;

  const getPixelState = (rowIndex: number, colIndex: number) => {
    const rowOffset = rowIndex - centerRow;
    const diagonalShift = Math.abs(rowOffset);
    const arrowIndex = Math.floor(colIndex / spacing);
    const phase = colIndex % spacing;

    const isHead = rowIndex === centerRow && (phase === spacing - 1 || phase === spacing - 2);
    const isDiagonal =
      rowIndex !== centerRow && (phase === spacing - 1 - diagonalShift || phase === spacing - 2 - diagonalShift);

    return { active: isHead || isDiagonal, arrowIndex, phase };
  };

  const effectivePixelShade: PixelShade = buttonColor === "lime" ? "black" : pixelColor;
  const pixelColors = pixelShadeMap[effectivePixelShade];
  const sizeStyles = sizeMap[size];
  const ComponentTag = as;
  const isButtonTag = ComponentTag === "button";

  return (
    <>
      <style>{cyberpunkButtonStyles}</style>
      <ComponentTag
        type={isButtonTag ? "button" : undefined}
        disabled={isButtonTag ? disabled : undefined}
        aria-disabled={!isButtonTag ? disabled : undefined}
        onClick={onClick}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          width: fullWidth ? "100%" : "fit-content",
          backgroundColor: "#0f1115",
          borderRadius: sizeStyles.borderRadiusOuter,
          padding: "4px",
          border: "1px solid #1f2937",
          height: sizeStyles.height,
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "border-color 0.3s, transform 0.2s, opacity 0.2s",
          outline: "none",
          overflow: "hidden",
          opacity: disabled ? 0.45 : 1,
          boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
          ["--cp-gradient" as string]: gradientMap[buttonColor],
          ["--cp-pixel-active" as string]: pixelColors.active,
          ["--cp-pixel-inactive" as string]: pixelColors.inactive,
        }}
        className={`cyberpunk-btn ${className}`}
      >
        <div
          className="cyberpunk-btn__label"
          style={{
            paddingLeft: sizeStyles.leftPadding,
            paddingRight: sizeStyles.rightPadding,
            whiteSpace: "nowrap",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: sizeStyles.textSize,
              fontWeight: 700,
              letterSpacing: "0",
              fontFamily: '"DM Sans", system-ui, sans-serif',
            }}
          >
            {buttonText}
          </span>
          {trailingLogoSrc ? (
            <img
              src={trailingLogoSrc}
              alt={trailingLogoAlt}
              style={{ height: `${trailingLogoHeight}px`, width: "auto", display: "block" }}
              loading="lazy"
            />
          ) : null}
        </div>

        <div
          className="cyberpunk-btn__track"
          style={{
            position: "absolute",
            left: "4px",
            top: "4px",
            bottom: "4px",
            width: sizeStyles.trackWidth,
            borderRadius: sizeStyles.borderRadiusInner,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            backgroundColor: colorMap[buttonColor],
            backgroundImage: "none",
          }}
        >
          <div className="cyberpunk-btn__grid--rest" style={{ display: "grid", gap: `${gap}px` }}>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <div key={`rest-${rowIndex}`} style={{ display: "flex", gap: `${gap}px` }}>
                {Array.from({ length: arrowCols }).map((_, colIndex) => {
                  const { active, phase } = getPixelState(rowIndex, colIndex);
                  return (
                    <div
                      key={`rest-${rowIndex}-${colIndex}`}
                      className={`cyberpunk-btn__pixel ${active ? "cyberpunk-btn__pixel--rest" : ""}`}
                      style={{ ["--cp-phase" as string]: String(phase) }}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          <div className="cyberpunk-btn__grid--hover" style={{ gap: `${gap}px` }}>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <div key={`hover-${rowIndex}`} style={{ display: "flex", gap: `${gap}px` }}>
                {Array.from({ length: colsHovered }).map((_, colIndex) => {
                  const { active, arrowIndex } = getPixelState(rowIndex, colIndex);
                  return (
                    <div
                      key={`hover-${rowIndex}-${colIndex}`}
                      className={`cyberpunk-btn__pixel ${active ? "cyberpunk-btn__pixel--hover" : ""}`}
                      style={{ ["--cp-arrow-index" as string]: String(arrowIndex) }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </ComponentTag>
    </>
  );
}
