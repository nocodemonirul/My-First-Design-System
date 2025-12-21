import { ElevationTokens } from "./tokens";

/**
 * CENTRAL BUTTON MODEL
 * Single source of truth for all button definitions.
 * Used by React components and (future) Code Generators for Figma/Framer.
 */

// 1. Style Definitions (Tailwind Classes)
export const ButtonStyles = {
  variants: {
    // Primary (Filled)
    filled: "bg-brand-600 text-white shadow-sm border border-transparent hover:bg-brand-700 active:bg-brand-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none dark:bg-white dark:text-brand-950 dark:hover:bg-slate-200 dark:active:bg-slate-300 dark:disabled:bg-slate-800 dark:disabled:text-slate-600",
    
    // Tonal (Alternative Secondary)
    tonal: "bg-brand-100 text-brand-900 border border-transparent hover:bg-brand-200 active:bg-brand-300 disabled:bg-slate-100 disabled:text-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:active:bg-slate-600 dark:disabled:bg-slate-800 dark:disabled:text-slate-500",

    // Elevated (Surface + Shadow)
    elevated: `bg-white text-brand-700 ${ElevationTokens.level2} border border-slate-100 hover:${ElevationTokens.level3} hover:bg-slate-50 active:${ElevationTokens.level1} disabled:shadow-none disabled:bg-slate-50 disabled:text-slate-300 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800 dark:hover:bg-slate-800 dark:disabled:bg-slate-800`,

    // Secondary (Outline)
    outline: "bg-transparent text-brand-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 disabled:border-slate-200 disabled:text-slate-300 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:border-slate-500 dark:active:bg-slate-800 dark:disabled:border-slate-800 dark:disabled:text-slate-600",
    
    // Tertiary (Ghost)
    ghost: "bg-transparent text-brand-700 border border-transparent hover:bg-slate-100 active:bg-slate-200 disabled:text-slate-300 dark:text-slate-100 dark:hover:bg-slate-800 dark:active:bg-slate-700 dark:disabled:text-slate-600",
    
    // Link Color (Brand)
    link: "bg-transparent text-brand-600 border border-transparent hover:underline p-0 h-auto font-medium disabled:text-slate-300 dark:text-white dark:hover:text-slate-200",

    // Link Grey
    'link-gray': "bg-transparent text-slate-500 border border-transparent hover:underline hover:text-slate-700 p-0 h-auto font-medium disabled:text-slate-300 dark:text-slate-400 dark:hover:text-slate-200",

    // Primary Destructive (Filled Red)
    danger: "bg-red-600 text-white shadow-sm border border-transparent hover:bg-red-700 active:bg-red-800 disabled:bg-slate-200 disabled:text-slate-400 dark:bg-red-600 dark:hover:bg-red-500 dark:disabled:bg-slate-800",

    // Secondary Destructive (Outline Red)
    'danger-outline': "bg-transparent text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 active:bg-red-100 disabled:border-slate-200 disabled:text-slate-300 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-950/30 dark:hover:border-red-800",

    // Tertiary Destructive (Ghost Red)
    'danger-ghost': "bg-transparent text-red-600 border border-transparent hover:bg-red-50 active:bg-red-100 disabled:text-slate-300 dark:text-red-400 dark:hover:bg-red-950/30",

    // FAB Specific Overrides (used in composition)
    'fab-base': "shadow-lg hover:shadow-xl active:shadow-md transition-all duration-300",
  }
};

// 2. Canonical Schema (For Generators/Documentation)
export const ButtonModel = {
  type: "button",
  description: "Triggers an action or event.",
  variants: Object.keys(ButtonStyles.variants).filter(k => k !== 'fab-base'),
  sizes: ["sm", "md", "lg"],
  shapes: ["default", "pill", "square", "circle"],
  states: ["enabled", "hover", "pressed", "focused", "disabled", "loading"],
  props: {
    variant: { type: "string", options: Object.keys(ButtonStyles.variants), default: "filled" },
    size: { type: "string", options: ["sm", "md", "lg"], default: "md" },
    label: { type: "string", default: "Button" },
    icon: { type: "boolean", default: false },
    fab: { type: "boolean", default: false },
    iconOnly: { type: "boolean", default: false }
  }
};