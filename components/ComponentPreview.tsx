import React, { useState, useEffect, useRef } from 'react';
import { Check, Copy, Eye, Code2, Moon, Sun, Framer } from 'lucide-react';
import { cn } from '../utils';

interface ComponentPreviewProps {
  title: string;
  description?: string;
  code: string;
  children: React.ReactNode;
  className?: string;
  framerUrl?: string;
  framerCode?: string;
}

export const ComponentPreview: React.FC<ComponentPreviewProps> = ({
  title,
  description,
  code,
  children,
  className,
  framerUrl,
  framerCode
}) => {
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(""); // Stores "Framer", "React"
  const [isDark, setIsDark] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setCopyFeedback("Code");
    setTimeout(() => setCopied(false), 2000);
    setShowMenu(false);
  };

  const handleVisualCopy = async (platform: 'framer' | 'generic') => {
    // 1. If we have raw Framer code (Code Component), copy that first.
    if (platform === 'framer' && framerCode) {
        navigator.clipboard.writeText(framerCode);
        setCopied(true);
        setCopyFeedback("Code");
        setTimeout(() => setCopied(false), 2000);
        setShowMenu(false);
        return;
    }

    // 2. If we have a URL (Smart Component), copy that.
    if (platform === 'framer' && framerUrl) {
      navigator.clipboard.writeText(framerUrl);
      setCopied(true);
      setCopyFeedback("Link");
      setTimeout(() => setCopied(false), 2000);
      setShowMenu(false);
      return;
    }

    // 3. Fallback: Visual HTML copy
    if (!previewRef.current || !previewRef.current.firstElementChild) return;

    try {
      const original = previewRef.current.firstElementChild as HTMLElement;
      // Deep clone to modify without affecting UI
      const clone = original.cloneNode(true) as HTMLElement;

      // Recursive function to capture and inline computed styles
      const inlineStyles = (source: Element, target: HTMLElement) => {
        if (source.nodeType !== Node.ELEMENT_NODE) return;
        
        const computed = window.getComputedStyle(source);
        
        const properties = [
            // Layout
            'display', 'position', 'flexDirection', 'justifyContent', 'alignItems', 'flexWrap', 'gap',
            'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
            'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
            'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
            'boxSizing', 'transform',
            
            // Visuals
            'backgroundColor', 'backgroundImage',
            'color', 'opacity',
            'boxShadow', 'filter', 'backdropFilter',
            
            // Borders
            'borderWidth', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
            'borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
            'borderStyle', 'borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle',
            'borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius',
            
            // Typography
            'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 
            'textAlign', 'textTransform', 'textDecoration', 'whiteSpace',
            
            // SVG specific
            'fill', 'stroke', 'strokeWidth', 'strokeLinecap', 'strokeLinejoin'
        ];

        let styleString = '';
        properties.forEach(prop => {
            // @ts-ignore
            let value = computed[prop];
            
            if (prop === 'display' && value === 'inline-flex') {
                value = 'flex';
            }

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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 mb-10 shadow-sm scroll-mt-24 transition-colors" id={title.toLowerCase().replace(/\s+/g, '-')}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
          {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setView('preview')}
              className={cn(
                "p-1.5 rounded-md text-slate-500 dark:text-slate-400 transition-all text-xs font-medium flex items-center gap-1.5",
                view === 'preview' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <Eye size={14} />
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button
              onClick={() => setView('code')}
              className={cn(
                "p-1.5 rounded-md text-slate-500 dark:text-slate-400 transition-all text-xs font-medium flex items-center gap-1.5",
                view === 'code' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <Code2 size={14} />
              <span className="hidden sm:inline">Code</span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>

          <div className="flex items-center gap-1 relative" ref={menuRef}>
             <button
              onClick={() => setIsDark(!isDark)}
              className={cn(
                "p-2 rounded-md transition-colors",
                isDark 
                  ? "text-brand-600 bg-brand-50 dark:bg-slate-800 dark:text-white" 
                  : "text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200"
              )}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={cn(
                "p-2 rounded-md transition-colors flex items-center gap-2",
                showMenu 
                    ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800" 
                    : "text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200"
              )}
              title="Copy Component"
            >
              {copied ? (
                 <span className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <Check size={16} className="mr-1" /> {copyFeedback}
                 </span>
              ) : (
                 <Copy size={16} />
              )}
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 p-1">
                 <div className="text-[10px] font-semibold text-slate-400 px-3 py-1.5 uppercase tracking-wider">Copy for</div>
                 
                 <button onClick={() => handleVisualCopy('framer')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-left group">
                    <Framer size={14} className="text-slate-400 group-hover:text-black dark:group-hover:text-white" /> <span>Framer</span>
                 </button>
                 
                 <div className="h-px bg-slate-100 dark:bg-slate-700 my-1 mx-2"></div>
                 
                 <button onClick={handleCopyCode} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-left group">
                    <Code2 size={14} className="text-slate-400 group-hover:text-[#61DAFB]" /> <span>React</span>
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative">
        {view === 'preview' ? (
          <div 
            ref={previewRef}
            className={cn(
              "p-8 md:p-12 min-h-[200px] flex items-center justify-center transition-colors duration-300",
              isDark 
                ? "dark bg-slate-950 bg-[radial-gradient(#1e293b_1px,transparent_1px)]" 
                : "bg-slate-50/50 dark:bg-slate-950 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)]",
              "[background-size:16px_16px]",
              className
            )}
          >
            {children}
          </div>
        ) : (
          <div className={cn(
            "relative overflow-hidden border-t transition-colors",
            isDark 
              ? "bg-slate-950 border-slate-800 text-slate-300" 
              : "bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 text-slate-800"
          )}>
            <div className="p-4 overflow-x-auto">
              <pre className="font-mono text-sm leading-relaxed">
                <code>{code.trim()}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};