/**
 * Figma Generator
 * Converts a DOM Element into a simplified Figma Node JSON structure.
 * Supports: Auto Layout (Hug/Fixed), Gradients, Shadows (Drop/Inner/Text), Borders, and Typography.
 */

interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface FigmaGradientStop {
  position: number;
  color: FigmaColor;
}

interface FigmaPaint {
  type: 'SOLID' | 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'IMAGE';
  color?: FigmaColor;
  opacity?: number;
  gradientStops?: FigmaGradientStop[];
  gradientHandlePositions?: [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }];
}

interface FigmaEffect {
  type: 'DROP_SHADOW' | 'INNER_SHADOW';
  visible: boolean;
  color: FigmaColor;
  blendMode: 'NORMAL';
  offset: { x: number; y: number };
  radius: number;
  spread?: number;
}

interface FigmaNode {
  type: 'FRAME' | 'TEXT' | 'RECTANGLE' | 'VECTOR';
  name: string;
  x?: number;
  y?: number;
  width: number;
  height: number;
  visible?: boolean;
  opacity?: number;
  blendMode?: 'PASS_THROUGH' | 'NORMAL';
  children?: FigmaNode[];
  
  // Layout
  layoutMode?: 'HORIZONTAL' | 'VERTICAL' | 'NONE';
  primaryAxisAlignItems?: 'MIN' | 'MAX' | 'CENTER' | 'SPACE_BETWEEN';
  counterAxisAlignItems?: 'MIN' | 'MAX' | 'CENTER';
  primaryAxisSizingMode?: 'FIXED' | 'AUTO'; // AUTO = Hug
  counterAxisSizingMode?: 'FIXED' | 'AUTO'; // AUTO = Hug
  layoutAlign?: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'INHERIT';
  layoutGrow?: number;
  
  itemSpacing?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  
  // Style
  fills?: FigmaPaint[];
  strokes?: FigmaPaint[];
  strokeWeight?: number;
  cornerRadius?: number;
  effects?: FigmaEffect[];
  
  // Text
  characters?: string;
  fontSize?: number;
  fontName?: { family: string; style: string };
  textAlignHorizontal?: 'LEFT' | 'CENTER' | 'RIGHT';
  textAlignVertical?: 'TOP' | 'CENTER' | 'BOTTOM';
}

export function generateFigmaJson(element: HTMLElement): string {
  
  // --- Helpers ---

  // Robust color parser handling Hex, RGB, RGBA, and CSS Level 4 space syntax
  const parseColor = (colorStr: string): FigmaColor => {
    const result = { r: 0, g: 0, b: 0, a: 1 };
    if (!colorStr || colorStr === 'transparent' || colorStr === 'none') return { r: 0, g: 0, b: 0, a: 0 };

    // Handle hex (3, 6, or 8 digits)
    if (colorStr.startsWith('#')) {
      const hex = colorStr.slice(1);
      let r = 0, g = 0, b = 0, a = 1;

      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      } else if (hex.length === 8) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
        a = parseInt(hex.substring(6, 8), 16) / 255;
      }

      return { r: r / 255, g: g / 255, b: b / 255, a };
    }

    // Handle rgb/rgba (comma or space separated)
    const numbers = colorStr.match(/(\d+(\.\d+)?|\.\d+)%?/g);
    
    if (numbers && numbers.length >= 3) {
      const parseValue = (val: string, max: number) => {
        if (val.endsWith('%')) return parseFloat(val) / 100;
        return parseFloat(val) / max;
      };

      result.r = parseValue(numbers[0], 255);
      result.g = parseValue(numbers[1], 255);
      result.b = parseValue(numbers[2], 255);
      
      if (numbers.length >= 4) {
        result.a = numbers[3].endsWith('%') ? parseFloat(numbers[3]) / 100 : parseFloat(numbers[3]);
      }
    }
    
    return result;
  };

  // Split string by comma, ignoring commas inside parentheses
  const splitSafe = (str: string): string[] => {
    const parts: string[] = [];
    let current = '';
    let depth = 0;
    for (const char of str) {
      if (char === '(') depth++;
      else if (char === ')') depth--;
      
      if (char === ',' && depth === 0) {
        parts.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    if (current) parts.push(current.trim());
    return parts;
  };

  const parseShadows = (shadowStr: string, isText: boolean = false): FigmaEffect[] => {
    if (!shadowStr || shadowStr === 'none') return [];
    
    const effects: FigmaEffect[] = [];
    const shadows = splitSafe(shadowStr);

    shadows.forEach(shadow => {
      const colorMatch = shadow.match(/rgba?\([^)]+\)|#[a-fA-F0-9]{3,8}|hsla?\([^)]+\)/);
      const color = colorMatch ? parseColor(colorMatch[0]) : { r: 0, g: 0, b: 0, a: 0.2 }; 
      
      const isInset = shadow.includes('inset');
      const cleanShadow = shadow.replace(colorMatch ? colorMatch[0] : '', '').replace('inset', '').trim();
      
      const numbers = cleanShadow.match(/(-?[\d.]+)px/g)?.map(n => parseFloat(n)) || [];

      if (numbers.length >= 2) {
        const x = numbers[0];
        const y = numbers[1];
        const blur = numbers.length > 2 ? numbers[2] : 0;
        const spread = (!isText && numbers.length > 3) ? numbers[3] : 0;

        effects.push({
          type: isInset ? 'INNER_SHADOW' : 'DROP_SHADOW',
          visible: true,
          color: color,
          blendMode: 'NORMAL',
          offset: { x, y },
          radius: blur,
          spread: spread
        });
      }
    });

    return effects;
  };

  const parseFills = (style: CSSStyleDeclaration): FigmaPaint[] => {
    const fills: FigmaPaint[] = [];

    // 1. Gradients
    const bgImage = style.backgroundImage;
    if (bgImage && bgImage.includes('linear-gradient')) {
      const content = bgImage.match(/linear-gradient\((.*)\)/)?.[1];
      if (content) {
        const parts = splitSafe(content);
        
        let angleDeg = 180;
        let stops = parts;

        const first = parts[0];
        if (first.includes('deg')) {
          angleDeg = parseFloat(first);
          stops = parts.slice(1);
        } else if (first.includes('to ')) {
          if (first.includes('top')) angleDeg = 0;
          if (first.includes('bottom')) angleDeg = 180;
          if (first.includes('left')) angleDeg = 270;
          if (first.includes('right')) angleDeg = 90;
          stops = parts.slice(1);
        } else if (!first.includes('rgb') && !first.includes('#') && !first.includes('hsl')) {
           stops = parts.slice(1);
        }

        const rad = (angleDeg - 90) * (Math.PI / 180);
        const handles: [{x:number, y:number}, {x:number, y:number}, {x:number, y:number}] = 
             [{ x: 0.5, y: 0 }, { x: 0.5, y: 1 }, { x: 1, y: 0 }];

        if (Math.abs(angleDeg % 360) === 90) { 
             handles[0] = { x: 0, y: 0.5 };
             handles[1] = { x: 1, y: 0.5 };
        } else if (Math.abs(angleDeg % 360) === 270) { 
             handles[0] = { x: 1, y: 0.5 };
             handles[1] = { x: 0, y: 0.5 };
        }
        
        const gradientStops: FigmaGradientStop[] = stops.map((stop, index) => {
          const colorMatch = stop.match(/rgba?\([^)]+\)|#[a-fA-F0-9]+|hsla?\([^)]+\)/);
          const color = colorMatch ? parseColor(colorMatch[0]) : { r: 0, g: 0, b: 0, a: 1 };
          
          let position = index / (stops.length - 1);
          const posMatch = stop.match(/([\d.]+)%/);
          if (posMatch) {
            position = parseFloat(posMatch[1]) / 100;
          }
          
          return { color, position };
        });

        fills.push({
          type: 'GRADIENT_LINEAR',
          gradientStops: gradientStops,
          gradientHandlePositions: handles,
          opacity: 1
        });
      }
    }

    // 2. Solid Color
    const bgColor = style.backgroundColor;
    const color = parseColor(bgColor);
    if (color.a > 0) {
      fills.push({
        type: 'SOLID',
        color: color,
        opacity: color.a
      });
    }

    return fills;
  };

  // --- Main Logic ---

  const getLayerName = (el: HTMLElement): string => {
    const ariaLabel = el.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;

    const tag = el.tagName.toLowerCase();
    if (tag === 'button') return 'Button';
    if (tag === 'svg') return 'Icon';
    if (tag === 'img') return 'Image';
    if (tag === 'input') return 'Input';

    if (el.classList.contains('lucide') || el.classList.contains('icon')) return 'Icon';
    if (el.classList.contains('badge')) return 'Badge';
    
    return tag === 'div' ? 'Frame' : tag.charAt(0).toUpperCase() + tag.slice(1);
  };

  const traverse = (el: HTMLElement): FigmaNode => {
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();

    // 1. Text Node
    const isText = el.childNodes.length === 1 && 
                   el.childNodes[0].nodeType === Node.TEXT_NODE && 
                   el.innerText.trim().length > 0;

    if (isText) {
      const node: FigmaNode = {
        type: 'TEXT',
        name: el.innerText,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        opacity: parseFloat(style.opacity),
        characters: el.innerText,
        fills: [{ type: 'SOLID', color: parseColor(style.color) }],
        fontSize: parseFloat(style.fontSize),
        fontName: { 
            family: style.fontFamily.split(',')[0].replace(/['"]/g, ''), 
            style: parseInt(style.fontWeight) >= 600 ? 'Bold' : 'Regular' 
        },
        textAlignHorizontal: style.textAlign === 'center' ? 'CENTER' : (style.textAlign === 'right' ? 'RIGHT' : 'LEFT'),
        textAlignVertical: 'CENTER'
      };
      
      if (style.textShadow && style.textShadow !== 'none') {
        node.effects = parseShadows(style.textShadow, true);
      }
      
      return node;
    }

    // 2. SVG / Icon
    const isSvg = el.tagName.toLowerCase() === 'svg';
    
    // 3. Frame
    const node: FigmaNode = {
      type: 'FRAME',
      name: getLayerName(el),
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      visible: style.visibility !== 'hidden' && style.display !== 'none',
      opacity: parseFloat(style.opacity),
      blendMode: 'PASS_THROUGH',
      fills: [],
      children: []
    };

    // Fills (Solid + Gradient)
    node.fills = parseFills(style);

    // Border
    if (style.borderWidth && parseFloat(style.borderWidth) > 0 && style.borderColor !== 'transparent') {
      node.strokes = [{ type: 'SOLID', color: parseColor(style.borderColor) }];
      node.strokeWeight = parseFloat(style.borderWidth);
    }

    // Radius
    if (style.borderRadius) {
      node.cornerRadius = parseFloat(style.borderRadius);
    }

    // Effects (Box Shadows)
    if (style.boxShadow && style.boxShadow !== 'none') {
      node.effects = parseShadows(style.boxShadow);
    }

    // Layout (Auto Layout)
    const isFlex = style.display === 'flex' || style.display === 'inline-flex';
    
    if (isFlex && !isSvg) {
      node.layoutMode = style.flexDirection === 'column' ? 'VERTICAL' : 'HORIZONTAL';
      node.itemSpacing = parseFloat(style.gap || '0');
      
      // Auto Layout Sizing: HUG contents (AUTO) is standard for buttons
      node.primaryAxisSizingMode = 'AUTO';
      node.counterAxisSizingMode = 'AUTO';
      
      const pl = parseFloat(style.paddingLeft || '0');
      const pr = parseFloat(style.paddingRight || '0');
      const pt = parseFloat(style.paddingTop || '0');
      const pb = parseFloat(style.paddingBottom || '0');
      
      node.paddingLeft = pl;
      node.paddingRight = pr;
      node.paddingTop = pt;
      node.paddingBottom = pb;
      
      // Alignment Mapping
      const justify = style.justifyContent;
      const align = style.alignItems;

      if (justify === 'center') node.primaryAxisAlignItems = 'CENTER';
      else if (justify === 'space-between') node.primaryAxisAlignItems = 'SPACE_BETWEEN';
      else if (justify === 'flex-end') node.primaryAxisAlignItems = 'MAX';
      else node.primaryAxisAlignItems = 'MIN';

      if (align === 'center') node.counterAxisAlignItems = 'CENTER';
      else if (align === 'flex-end') node.counterAxisAlignItems = 'MAX';
      else node.counterAxisAlignItems = 'MIN';
    } else {
      node.layoutMode = 'NONE';
    }

    // Recursion
    if (!isSvg) {
      const children = Array.from(el.children) as HTMLElement[];
      if (children.length > 0) {
        node.children = children.map(child => traverse(child));
      }
    }

    return node;
  };

  const rootNode = traverse(element);
  return JSON.stringify(rootNode, null, 2);
}