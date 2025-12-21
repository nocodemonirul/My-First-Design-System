export const ButtonFramerCode = `import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import * as PhosphorIcons from "https://esm.sh/phosphor-react@1.4.1?external=react"

/**
 * 1. CONFIGURATION & TOKENS
 * Visual rules for the button system.
 */
const SIZES = {
    xl: { fontSize: 20, lineHeight: "24px", padding: "16px 32px", height: 56, gap: 12, icon: 24 },
    l: { fontSize: 16, lineHeight: "20px", padding: "12px 24px", height: 48, gap: 8, icon: 20 },
    m: { fontSize: 16, lineHeight: "20px", padding: "10px 20px", height: 40, gap: 8, icon: 20 },
    s: { fontSize: 14, lineHeight: "18px", padding: "8px 16px", height: 32, gap: 6, icon: 16 },
    xs: { fontSize: 14, lineHeight: "18px", padding: "6px 12px", height: 28, gap: 4, icon: 16 },
}

const THEMES = {
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

/**
 * 2. THE COMPONENT
 */
export default function SusButton(props) {
    const {
        label,
        type,
        size,
        radius,
        theme,
        iconPlacement,
        iconSource,
        iconName,
        iconSize,
        customIcon,
        textColor,
        iconColor,
        disabled,
        style: externalStyle
    } = props

    // State for visual interactions
    const [isHovered, setIsHovered] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)

    // Resolve tokens
    const currentTheme = THEMES[theme] || THEMES.light
    const variantStyle = currentTheme[type] || currentTheme.primary
    const sizeStyle = SIZES[size] || SIZES.m

    // Resolve Colors (Override > Theme)
    const activeTextColor = textColor ? textColor : variantStyle.text
    
    // Resolve Icon Color
    // Default to White in both modes as requested, unless overridden by iconColor prop
    let defaultIconColor = "#FFFFFF";

    // Safety check: For Dark Mode Primary (White BG), default to Black if user hasn't specified a color
    // This ensures visibility while respecting the general "White" rule for other dark mode elements
    if (theme === 'dark' && type === 'primary' && !iconColor) {
        defaultIconColor = "#000000";
    }

    const activeIconColor = iconColor || defaultIconColor;

    // Resolve Icon Size
    const activeIconSize = iconSize === "auto" ? sizeStyle.icon : parseInt(iconSize, 10);

    // --- ICON RESOLUTION LOGIC ---
    let FinalIcon = null;

    if (iconSource === "library") {
        // --- 1. Library (Phosphor) Logic ---
        const key = iconName || "ArrowRight";
        let SelectedIcon = null;

        if (PhosphorIcons[key]) {
            SelectedIcon = PhosphorIcons[key];
        } else if (PhosphorIcons.default && PhosphorIcons.default[key]) {
            SelectedIcon = PhosphorIcons.default[key];
        } else {
            // Fallback to star if name not found
            SelectedIcon = PhosphorIcons["Star"] || (PhosphorIcons.default && PhosphorIcons.default["Star"]);
        }

        if (SelectedIcon) {
            FinalIcon = (
                <SelectedIcon 
                    size={activeIconSize} 
                    color={activeIconColor}
                    weight="bold" 
                    style={{ display: "block" }} 
                />
            );
        }
    } else {
        // --- 2. Custom Connector Logic ---
        const FallbackElement = (
            <svg 
                width={activeIconSize} 
                height={activeIconSize} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ opacity: 0.3 }}
            >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
        );
        
        // Wrap in div to enforce color via currentColor for SVGs that use it
        // We also apply width/height here to ensure layout space is reserved
        FinalIcon = (
            <div style={{ 
                color: activeIconColor, 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                width: activeIconSize,
                height: activeIconSize
            }}>
                {customIcon ? customIcon : FallbackElement}
            </div>
        );
    }

    // Icon Only Logic
    const isIconOnly = iconPlacement === "iconOnly"
    const calculatedWidth = isIconOnly ? sizeStyle.height : "auto"
    const calculatedPadding = isIconOnly ? 0 : sizeStyle.padding

    // Radius Calculation
    const getRadius = (r) => {
        if (r === "pill") return "9999px"
        if (r === "shape") return "0px"
        return r + "px"
    }
    const actualRadius = getRadius(radius)

    // Base CSS styles
    const containerStyle = {
        ...externalStyle,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 500,
        borderRadius: actualRadius,
        outline: "none",
        border: \`1px solid \${variantStyle.border}\`,
        backgroundColor: isHovered ? variantStyle.hover : variantStyle.bg,
        color: activeTextColor,
        boxShadow: isFocused ? \`0 0 0 3px \${currentTheme.focusRing}44\` : "none",
        padding: calculatedPadding,
        width: calculatedWidth,
        height: sizeStyle.height,
        gap: sizeStyle.gap,
        fontSize: sizeStyle.fontSize,
        lineHeight: sizeStyle.lineHeight,
        boxSizing: "border-box",
        userSelect: "none",
        whiteSpace: "nowrap",
    }

    const finalContent = isIconOnly ? (
        FinalIcon
    ) : (
        <>
            {iconPlacement === "left" && FinalIcon}
            <span>{label}</span>
            {iconPlacement === "right" && FinalIcon}
        </>
    )

    return (
        <button
            style={containerStyle}
            onMouseEnter={() => !disabled && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
        >
            {finalContent}
        </button>
    )
}

/**
 * 3. DEFAULT PROPS
 */
SusButton.defaultProps = {
    label: "Button",
    type: "primary",
    size: "m",
    radius: "8",
    theme: "light",
    iconPlacement: "none",
    iconSource: "library",
    iconName: "ArrowRight",
    iconSize: "auto",
    disabled: false,
}

/**
 * 4. FRAMER PROPERTY CONTROLS
 */
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
    radius: {
        type: ControlType.Enum,
        title: "Radius",
        options: ["shape", "4", "8", "16", "pill"],
        optionTitles: ["Square", "4px", "8px", "16px", "Pill"],
        defaultValue: "8",
    },
    label: {
        type: ControlType.String,
        title: "Text",
        hidden: (props) => props.iconPlacement === "iconOnly",
        defaultValue: "Button"
    },
    textColor: {
        type: ControlType.Enum,
        title: "Text Color",
        options: ["", "#000000", "#FFFFFF"],
        optionTitles: ["Default", "Black", "White"],
        defaultValue: ""
    },
    iconPlacement: {
        type: ControlType.Enum,
        title: "Layout",
        options: ["none", "left", "right", "iconOnly"],
        optionTitles: ["Text Only", "Left Icon", "Right Icon", "Icon Only"],
    },
    iconSource: {
        type: ControlType.SegmentedEnum,
        title: "Icon Src",
        options: ["library", "custom"],
        optionTitles: ["Library", "Custom"],
        hidden: (props) => props.iconPlacement === "none",
        defaultValue: "library"
    },
    iconName: {
        type: ControlType.Enum,
        title: "Icon",
        options: [
            // Arrows
            "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "ArrowClockwise",
            // Actions
            "Plus", "Minus", "X", "Check", "CheckCircle", "Trash", "Pencil", "Gear", 
            "Download", "Upload", "ShareNetwork", "Link",
            // Navigation
            "House", "List", "SquaresFour", "MagnifyingGlass",
            // Status/Media
            "Bell", "Warning", "Info", "Play", "Pause", "Stop", "DotsThree",
            // Communication
            "Envelope", "Phone", "PaperPlane", "Chat",
            // Social/User
            "User", "Users", "Heart", "Star", "ThumbsUp", "ThumbsDown"
        ],
        optionTitles: [
            "Arrow Right", "Arrow Left", "Arrow Up", "Arrow Down", "Refresh",
            "Plus", "Minus", "Close", "Check", "Check Circle", "Trash", "Edit", "Settings", 
            "Download", "Upload", "Share", "Link",
            "Home", "Menu", "Grid", "Search",
            "Bell", "Warning", "Info", "Play", "Pause", "Stop", "More",
            "Mail", "Phone", "Send", "Chat",
            "User", "Users", "Heart", "Star", "Like", "Dislike"
        ],
        hidden: (props) => props.iconPlacement === "none" || props.iconSource === "custom",
        defaultValue: "ArrowRight"
    },
    iconSize: {
        type: ControlType.Enum,
        title: "Icon Size",
        options: ["auto", "16", "24", "32", "40", "48"],
        optionTitles: ["Auto", "16px", "24px", "32px", "40px", "48px"],
        hidden: (props) => props.iconPlacement === "none",
        defaultValue: "auto"
    },
    customIcon: {
        type: ControlType.ComponentInstance,
        title: "Connector",
        hidden: (props) => props.iconPlacement === "none" || props.iconSource === "library",
    },
    iconColor: {
        type: ControlType.Color,
        title: "Icon Color",
        hidden: (props) => props.iconPlacement === "none",
    },
    disabled: {
        type: ControlType.Boolean,
        title: "Disabled",
    },
})`