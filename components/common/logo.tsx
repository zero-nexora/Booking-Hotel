import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { icon: 20, textClass: "text-sm" },
  md: { icon: 26, textClass: "text-base" },
  lg: { icon: 34, textClass: "text-xl" },
};

export function Logo({
  variant = "default",
  size = "md",
  className,
}: LogoProps) {
  const { icon, textClass } = sizes[size];

  const iconColor =
    variant === "light"
      ? "#ffffff"
      : variant === "dark"
        ? "#0f172a"
        : "currentColor";

  const goldColor = "#C9A84C";

  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      {/* Icon mark: abstract hotel building / key combination */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Building shape */}
        <rect
          x="6"
          y="10"
          width="20"
          height="18"
          rx="1"
          fill={goldColor}
          opacity="0.15"
        />
        <rect
          x="6"
          y="10"
          width="20"
          height="18"
          rx="1"
          stroke={goldColor}
          strokeWidth="1.5"
        />

        {/* Tower / spire */}
        <rect
          x="13"
          y="4"
          width="6"
          height="8"
          rx="0.5"
          fill={goldColor}
          opacity="0.25"
        />
        <rect
          x="13"
          y="4"
          width="6"
          height="8"
          rx="0.5"
          stroke={goldColor}
          strokeWidth="1.5"
        />

        {/* Windows row 1 */}
        <rect
          x="9"
          y="14"
          width="3"
          height="3"
          rx="0.3"
          fill={goldColor}
          opacity="0.7"
        />
        <rect
          x="14.5"
          y="14"
          width="3"
          height="3"
          rx="0.3"
          fill={goldColor}
          opacity="0.9"
        />
        <rect
          x="20"
          y="14"
          width="3"
          height="3"
          rx="0.3"
          fill={goldColor}
          opacity="0.7"
        />

        {/* Windows row 2 */}
        <rect
          x="9"
          y="20"
          width="3"
          height="3"
          rx="0.3"
          fill={goldColor}
          opacity="0.5"
        />
        <rect
          x="20"
          y="20"
          width="3"
          height="3"
          rx="0.3"
          fill={goldColor}
          opacity="0.6"
        />

        {/* Door */}
        <rect
          x="13.5"
          y="22"
          width="5"
          height="6"
          rx="0.5"
          fill={iconColor}
          opacity="0.12"
          stroke={goldColor}
          strokeWidth="1.2"
        />

        {/* Cap / roof line */}
        <line
          x1="4"
          y1="10"
          x2="28"
          y2="10"
          stroke={goldColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Top accent diamond */}
        <rect
          x="15"
          y="2"
          width="2"
          height="2"
          rx="0.5"
          transform="rotate(45 16 3)"
          fill={goldColor}
        />
      </svg>

      {/* Wordmark */}
      <div className={cn("flex flex-col leading-none", textClass)}>
        <span
          className={cn(
            "font-bold tracking-[0.06em] uppercase",
            variant === "light"
              ? "text-white"
              : variant === "dark"
                ? "text-slate-900"
                : "text-foreground",
          )}
          style={{ letterSpacing: "0.08em" }}
        >
          Stay
          <span style={{ color: goldColor }}>wise</span>
        </span>
        {size !== "sm" && (
          <span
            className="text-[9px] tracking-[0.18em] uppercase font-medium mt-0.5"
            style={{
              color:
                variant === "light"
                  ? "rgba(255,255,255,0.55)"
                  : variant === "dark"
                    ? "rgba(15,23,42,0.45)"
                    : undefined,
            }}
          >
            {size === "lg" ? "Luxury Hotels" : "Hotels"}
          </span>
        )}
      </div>
    </div>
  );
}
