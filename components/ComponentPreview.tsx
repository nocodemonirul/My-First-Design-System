import React, { useState, useEffect, useRef } from 'react';
import { Check, Copy, Eye, Code2, Framer, Atom, Moon, Sun } from 'lucide-react';
import { cn } from '../utils';

export interface PreviewVariant {
  name: string;
  component: React.ReactNode;
  code?: string;
}

interface ComponentPreviewProps {
  title: string;
  description?: string;
  code: string;
  children?: React.ReactNode;
  className?: string;
  framerUrl?: string;
  framerCode?: string;
  reactComponentCode?: string;
  themeMode?: 'light' | 'dark';
  variants?: PreviewVariant[];
}

export const ComponentPreview: React.FC<ComponentPreviewProps> = ({
  title,
  description,
  code,
  children,
  className,
  framerUrl,
  framerCode,
  reactComponentCode,
  themeMode,
  variants
}) => {
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState("");
  const [isDark, setIsDark] = useState(themeMode === 'dark');
  const [showMenu, setShowMenu] = useState(false);
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsDark(themeMode === 'dark');
  }, [themeMode]);

  const handleCopyCode = () => {
    // Priority: React Source Code > Variant Code > Usage Code
    let textToCopy = reactComponentCode ? reactComponentCode.trim() : code.trim();
    
    // If using variants and NO react source code is provided, try to use the variant's specific code
    if (!reactComponentCode && variants && variants[activeVariantIndex]?.code) {
        textToCopy = variants[activeVariantIndex].code!.trim();
    }
    
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setCopyFeedback("React");
    setTimeout(() => setCopied(false), 2000);
    setShowMenu(false);
  };

  const handleVisualCopy = async (platform: 'framer' | 'generic') => {
    if (platform === 'framer' && framerCode) {
        navigator.clipboard.writeText(framerCode);
        setCopied(true);
        setCopyFeedback("Code");
        setTimeout(() => setCopied(false), 2000);
        setShowMenu(false);
        return;
    }

    if (platform === 'framer' && framerUrl) {
      navigator.clipboard.writeText(framerUrl);
      setCopied(true);
      setCopyFeedback("Link");
      setTimeout(() => setCopied(false), 2000);
      setShowMenu(false);
      return;
    }

    if (!previewRef.current || !previewRef.current.firstElementChild) return;

    try {
      const original = previewRef.current.firstElementChild as HTMLElement;
      const clone = original.cloneNode(true) as HTMLElement;

      const inlineStyles = (source: Element, target: HTMLElement) => {
        if (source.nodeType !== Node.ELEMENT_NODE) return;
        
        const computed = window.getComputedStyle(source);
        const properties = [
            'display', 'position', 'flexDirection', 'justifyContent', 'alignItems', 'flexWrap', 'gap',
            'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
            'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
            'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
            'boxSizing', 'transform', 'backgroundColor', 'backgroundImage',
            'color', 'opacity', 'boxShadow', 'filter', 'backdropFilter',
            'borderWidth', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
            'borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
            'borderStyle', 'borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle',
            'borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius',
            'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 
            'textAlign', 'textTransform', 'textDecoration', 'whiteSpace',
            'fill', 'stroke', 'strokeWidth', 'strokeLinecap', 'strokeLinejoin'
        ];

        let styleString = '';
        properties.forEach(prop => {
            // @ts-ignore
            let value = computed[prop];
            if (prop === 'display' && value === 'inline-flex') value = 'flex';
            if (value && value !== 'normal' && value !== 'auto' && value !== 'rgba(0, 0, 0, 0)' && value !== '0px') {
                const key = prop.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
                styleString += `${key}:${value};`;
            }
        });
        
        const rect = source.getBoundingClientRect();
        if (source.tagName.toLowerCase() === 'svg') {
           styleString += `width:${rect.width}px;height:${rect.height}px;`;
        }
        
        styleString += `box-sizing:border-box;`;
        target.setAttribute('style', styleString);

        const sourceChildren = Array.from(source.children);
        const targetChildren = Array.from(target.children);
        sourceChildren.forEach((child, index) => {
            if (targetChildren[index]) {
                inlineStyles(child, targetChildren[index] as HTMLElement);
            }
        });
      };

      inlineStyles(original, clone);

      const wrapper = document.createElement('div');
      wrapper.appendChild(clone);
      const htmlContent = `<body>${wrapper.innerHTML}</body>`;
      
      const clipboardItems: { [key: string]: Blob } = {};
      clipboardItems['text/html'] = new Blob([htmlContent], { type: 'text/html' });
      clipboardItems['text/plain'] = new Blob([code.trim()], { type: 'text/plain' });

      const data = [new ClipboardItem(clipboardItems)];
      await navigator.clipboard.write(data);
      
      setCopied(true);
      setCopyFeedback(platform === 'framer' ? 'Framer' : 'HTML');
      setTimeout(() => setCopied(false), 2000);
      setShowMenu(false);

    } catch (err) {
      console.error('Visual copy failed, falling back to code', err);
      handleCopyCode();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderWithTheme = (node: React.ReactNode) => {
    if (React.isValidElement(node)) {
        return React.cloneElement(node as React.ReactElement<any>, { theme: isDark ? 'dark' : 'light' });
    }
    return node;
  };

  return (
    <div className="group border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 mb-12 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 overflow-hidden" id={title.toLowerCase().replace(/\s+/g, '-')}>
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between px-5 py-4 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 gap-4 md:gap-0">
        
        {/* Title & Description */}
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">{title}</h3>
          {description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 self-start md:self-auto">
            {/* View Toggle */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
                <button
                    onClick={() => setView('preview')}
                    className={cn(
                        "px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-all duration-200",
                        view === 'preview' 
                            ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/5" 
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    )}
                >
                    <Eye size={14} className={view === 'preview' ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"} />
                    Preview
                </button>
                <button
                    onClick={() => setView('code')}
                    className={cn(
                        "px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-all duration-200",
                        view === 'code' 
                            ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/5" 
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    )}
                >
                    <Code2 size={14} className={view === 'code' ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"} />
                    Code
                </button>
            </div>

            <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1"></div>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={cn(
                "p-2 rounded-lg transition-all duration-200 border border-transparent",
                 "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-800"
              )}
               title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
               {isDark ? <Sun size={18} /> : <Moon size={18} />} 
            </button>

            {/* Copy / Menu */}
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className={cn(
                      "p-2 rounded-lg transition-all duration-200 border border-transparent",
                      showMenu 
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                        : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-800"
                    )}
                    title="Options"
                >
                    {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                </button>

                {/* Dropdown */}
                {showMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-1">
                     <div className="text-[10px] font-bold text-slate-400 px-3 py-2 uppercase tracking-wider">Copy format</div>
                     <button onClick={() => handleVisualCopy('framer')} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left group">
                        <Framer size={14} className="text-slate-400 group-hover:text-black dark:group-hover:text-white" /> <span>Framer Component</span>
                     </button>
                     <button onClick={handleCopyCode} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left group">
                        <Atom size={14} className="text-slate-400 group-hover:text-blue-500" /> <span>React Code</span>
                     </button>
                  </div>
                )}
            </div>
        </div>
      </div>

      {/* VARIANT TABS */}
      {view === 'preview' && variants && variants.length > 0 && (
          <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2">
                  {variants.map((variant, index) => (
                      <button
                          key={index}
                          onClick={() => setActiveVariantIndex(index)}
                          className={cn(
                              "px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 whitespace-nowrap border",
                              activeVariantIndex === index
                                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm"
                                  : "bg-white dark:bg-transparent text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white"
                          )}
                      >
                          {variant.name}
                      </button>
                  ))}
              </div>
          </div>
      )}

      {/* CONTENT AREA */}
      <div className="relative">
        {view === 'preview' ? (
          <div 
            ref={previewRef}
            className={cn(
              "p-8 sm:p-12 md:p-16 min-h-[280px] flex items-center justify-center transition-colors duration-300",
              isDark 
                ? "bg-slate-950 text-white bg-[radial-gradient(#334155_1px,transparent_1px)]" 
                : "bg-slate-50 text-slate-900 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)]",
              "[background-size:24px_24px]",
              className
            )}
          >
            <div className="scale-100 transition-transform duration-300">
               {variants && variants.length > 0 
                 ? renderWithTheme(variants[activeVariantIndex].component) 
                 : renderWithTheme(children)}
            </div>
          </div>
        ) : (
          <div className={cn(
            "relative overflow-hidden transition-colors border-t border-slate-100 dark:border-slate-800",
            isDark 
              ? "bg-slate-950 text-slate-300" 
              : "bg-slate-50 text-slate-800"
          )}>
            <div className="w-full grid">
              <div className="p-4 sm:p-6 overflow-x-auto w-full max-h-[50vh] sm:max-h-[60vh] overflow-y-auto custom-scrollbar">
                <pre className="font-mono text-xs sm:text-sm leading-relaxed">
                  <code>
                    {reactComponentCode 
                        ? reactComponentCode.trim() 
                        : (variants && variants[activeVariantIndex]?.code 
                            ? variants[activeVariantIndex].code?.trim() 
                            : code.trim())
                    }
                  </code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
