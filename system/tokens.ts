/**
 * DESIGN TOKENS
 * Source of truth for the system.
 */

export const MotionTokens = {
  duration: {
    short: 0.1,  // 100ms
    medium: 0.2, // 200ms
    long: 0.3    // 300ms
  },
  ease: {
    standard: [0.2, 0, 0, 1], // ease-out-cubic equivalent
    accelerate: [0.4, 0, 1, 1], // ease-in
    decelerate: [0, 0, 0.2, 1], // ease-out
  },
  scale: {
    hover: 1.02,
    pressed: 0.96, // Slightly more tactile than 0.98
    active: 0.98
  }
};

export const ShapeTokens = {
  radiusSmall: "rounded-md",
  radiusMedium: "rounded-lg",
  radiusLarge: "rounded-xl",
  pill: "rounded-full",
  circle: "rounded-full",
  square: "rounded-none",
};

export const TypographyTokens = {
  labelSmall: "text-xs font-medium tracking-wide",
  labelMedium: "text-sm font-medium tracking-wide",
  labelLarge: "text-base font-semibold tracking-wide",
};

export const SizeTokens = {
  sm: {
    height: "h-8",
    px: "px-3",
    icon: 16,
  },
  md: {
    height: "h-10",
    px: "px-5",
    icon: 18,
  },
  lg: {
    height: "h-12",
    px: "px-7",
    icon: 20,
  }
};

export const ElevationTokens = {
  level0: "shadow-none",
  level1: "shadow-sm",
  level2: "shadow",
  level3: "shadow-md",
  level4: "shadow-lg",
  level5: "shadow-xl",
};
