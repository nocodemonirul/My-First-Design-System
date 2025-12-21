import React from "react"
// import { addPropertyControls, ControlType } from "framer" // Uncomment if using inside Framer

/**
 * 1. CONFIGURATION & TOKENS
 * These constants define the visual rules of the system.
 */
const SIZES = {
    xl: { fontSize: 20, lineHeight: "24px", padding: "16px 32px", height: 56, gap: 12 },
    l: { fontSize: 16, lineHeight: "20px", padding: "12px 24px", height: 48, gap: 8 },
    m: { fontSize: 16, lineHeight: "20px", padding: "10px 20px", height: 40, gap: 8 },
    s: { fontSize: 14, lineHeight: "18px", padding: "8px 16px", height: 32, gap: 6 },
    xs: { fontSize: 14, lineHeight: "18px", padding: "6px 12px", height: 28, gap: 4 },
}

const THEMES: any = {
    light: {
        primary: { bg: "#000000", text: "#FFFFFF", border: "transparent", hover: "#333333" },
        secondary: { bg: "#F3F4F6", text: "#000000", border: "transparent", hover: "#E5E7EB" },
        tertiary: { bg: "transparent", text: "#000000", border: "#D1D5DB", hover: "#F9FAFB" },
        success: { bg: "#10B981", text: "#FFFFFF", border: "transparent", hover: "#059669" },
        fail: { bg: "#EF4444", text: "#FFFFFF", border: "transparent", hover: "#DC2626" },
        focusRing: "#3B82F6",
    },
    dark: {
        primary: { bg: "#FFFFFF", text: "#000000", border: "transparent", hover: "#E5E7EB" },
        secondary: { bg: "#374151", text: "#FFFFFF", border: "transparent", hover: "#4B5563" },
        tertiary: { bg: "transparent", text: "#FFFFFF", border: "#4B5563", hover: "#1F2937" },
        success: { bg: "#059669", text: "#FFFFFF", border: "transparent", hover: "#10B981" },
        fail: { bg: "#DC2626", text: "#FFFFFF", border: "transparent", hover: "#EF4444" },
        focusRing: "#60A5FA",
    }
}

export interface ButtonProps {
    label?: string;
    type?: "primary" | "secondary" | "tertiary" | "success" | "fail";
    size?: "xl" | "l" | "m" | "s" | "xs";
    theme?: "light" | "dark";
    iconPlacement?: "none" | "left" | "right" | "iconOnly";
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
    style?: React.CSSProperties;
}

/**
 * 2. THE COMPONENT
 */
export function Button(props: ButtonProps) {
    const {
        label = "Button",
        type = "primary",
        size = "m",
        theme = "light",
        iconPlacement = "none",
        leftIcon,
        rightIcon,
        disabled = false,
        onClick,
        style: externalStyle // Allow for Framer positioning
    } = props

    // State for interactions (Hover/Focus)
    const [isHovered, setIsHovered] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)

    // Resolve styles based on current props/state
    const currentTheme = THEMES[theme] || THEMES.light
    const variantStyle = currentTheme[type] || currentTheme.primary
    const sizeStyle = SIZES[size] || SIZES.m

    // Base Style Object
    const containerStyle: React.CSSProperties = {
        ...externalStyle,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 500,
        borderRadius: "8px",
        outline: "none",
        border: `1px solid ${variantStyle.border}`,
        backgroundColor: isHovered ? variantStyle.hover : variantStyle.bg,
        color: variantStyle.text,
        boxShadow: isFocused ? `0 0 0 3px ${currentTheme.focusRing}44` : "none",
        padding: sizeStyle.padding,
        height: sizeStyle.height,
        gap: sizeStyle.gap,
        fontSize: sizeStyle.fontSize,
        lineHeight: sizeStyle.lineHeight,
        boxSizing: "border-box",
        userSelect: "none",
        whiteSpace: "nowrap",
    }

    // Logic for Icon Only Mode
    const isIconOnly = iconPlacement === "iconOnly"
    const finalContent = isIconOnly ? (
        leftIcon || rightIcon
    ) : (
        <>
            {iconPlacement === "left" && leftIcon}
            <span>{label}</span>
            {iconPlacement === "right" && rightIcon}
        </>
    )

    return (
        <button
            style={containerStyle}
            onMouseEnter={() => !disabled && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
        >
            {finalContent}
        </button>
    )
}

/**
 * 4. FRAMER PROPERTY CONTROLS
 * Uncomment the block below if pasting into Framer.
 */
/*
addPropertyControls(SusButton, {
    theme: {
        type: ControlType.Enum,
        title: "Theme",
        options: ["light", "dark"],
        optionTitles: ["☀️ Light", "🌙 Dark"],
        defaultValue: "light",
    },
    type: {
        type: ControlType.Enum,
        title: "Type",
        options: ["primary", "secondary", "tertiary", "success", "fail"],
        optionTitles: ["Primary", "Secondary", "Tertiary", "Success", "Fail"],
    },
    size: {
        type: ControlType.Enum,
        title: "Size",
        options: ["xl", "l", "m", "s", "xs"],
        optionTitles: ["XL", "L", "M", "S", "XS"],
    },
    label: {
        type: ControlType.String,
        title: "Label",
        hidden: (props) => props.iconPlacement === "iconOnly",
    },
    iconPlacement: {
        type: ControlType.Enum,
        title: "Icon",
        options: ["none", "left", "right", "iconOnly"],
        optionTitles: ["None", "Left", "Right", "Only Icon"],
    },
    leftIcon: {
        type: ControlType.ComponentInstance,
        title: "Left Icon",
        hidden: (props) => props.iconPlacement !== "left" && props.iconPlacement !== "iconOnly",
    },
    rightIcon: {
        type: ControlType.ComponentInstance,
        title: "Right Icon",
        hidden: (props) => props.iconPlacement !== "right",
    },
    disabled: {
        type: ControlType.Boolean,
        title: "Disabled",
    },
})
*/