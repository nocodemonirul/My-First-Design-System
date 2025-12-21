import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Box, 
  MousePointer2, 
  Moon, 
  Sun,
  Search,
  ChevronRight,
  ChevronDown,
  Mail,
  ArrowRight,
  Plus,
  Trash2,
  Check,
  AlertCircle
} from 'lucide-react';

import { Button } from './components/Button';
import { ComponentPreview } from './components/ComponentPreview';
import { ButtonFramerCode } from './system/framer-templates';
import { cn } from './utils';

// --- Documentation Pages ---

const IntroPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => (
  <div className="space-y-6 max-w-3xl">
    <div className="mb-10">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Introduction</h1>
      <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
        This is the new <strong>SusButton</strong> component. It replaces all previous button components with a single, unified primitive that handles Primary, Secondary, Tertiary, Success, and Fail states across 5 sizes.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <div 
        onClick={() => onNavigate('button')}
        className="group p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-md transition-all cursor-pointer"
      >
        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg flex items-center justify-center mb-4 group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors">
          <MousePointer2 size={20} />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Button</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">The new unified component.</p>
      </div>
    </div>
  </div>
);

const ButtonPage = ({ theme }: { theme: "light" | "dark" }) => (
  <div className="space-y-12 max-w-4xl pb-20">
    <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Button</h1>
      <p className="text-slate-600 dark:text-slate-400 text-lg">
        A single component with granular control over Type, Size, and Icon Placement.
      </p>
    </div>

    {/* 1. Types */}
    <div id="types" className="scroll-mt-24">
      <ComponentPreview 
        title="Types" 
        description="The 5 visual styles available."
        framerCode={ButtonFramerCode}
        code={`
<Button theme="${theme}" type="primary" label="Primary" />
<Button theme="${theme}" type="secondary" label="Secondary" />
<Button theme="${theme}" type="tertiary" label="Tertiary" />
<Button theme="${theme}" type="success" label="Success" />
<Button theme="${theme}" type="fail" label="Fail" />
        `}
      >
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <Button theme={theme} type="primary" label="Primary" />
          <Button theme={theme} type="secondary" label="Secondary" />
          <Button theme={theme} type="tertiary" label="Tertiary" />
          <Button theme={theme} type="success" label="Success" />
          <Button theme={theme} type="fail" label="Fail" />
        </div>
      </ComponentPreview>
    </div>

    {/* 2. Sizes */}
    <div id="sizes" className="scroll-mt-24">
      <ComponentPreview 
        title="Sizes" 
        description="Available in XL, L, M, S, and XS."
        framerCode={ButtonFramerCode}
        code={`
<Button theme="${theme}" size="xl" label="XL Button" />
<Button theme="${theme}" size="l" label="Large" />
<Button theme="${theme}" size="m" label="Medium" />
<Button theme="${theme}" size="s" label="Small" />
<Button theme="${theme}" size="xs" label="XS" />
        `}
      >
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <Button theme={theme} size="xl" label="XL Button" />
          <Button theme={theme} size="l" label="Large" />
          <Button theme={theme} size="m" label="Medium" />
          <Button theme={theme} size="s" label="Small" />
          <Button theme={theme} size="xs" label="XS" />
        </div>
      </ComponentPreview>
    </div>

    {/* 3. Icons */}
    <div id="icons" className="scroll-mt-24">
      <ComponentPreview 
        title="Icons" 
        description="Support for Left, Right, and Icon Only layouts."
        framerCode={ButtonFramerCode}
        code={`
<Button theme="${theme}" iconPlacement="left" leftIcon={<Mail size={16}/>} label="Email" />
<Button theme="${theme}" iconPlacement="right" rightIcon={<ArrowRight size={16}/>} label="Next" />
<Button theme="${theme}" iconPlacement="iconOnly" leftIcon={<Plus size={20}/>} />
        `}
      >
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <Button theme={theme} iconPlacement="left" leftIcon={<Mail size={16}/>} label="Email" />
          <Button theme={theme} iconPlacement="right" rightIcon={<ArrowRight size={16}/>} label="Next" />
          <Button theme={theme} iconPlacement="iconOnly" leftIcon={<Plus size={20}/>} />
        </div>
      </ComponentPreview>
    </div>

     {/* 4. States */}
     <div id="states" className="scroll-mt-24">
      <ComponentPreview 
        title="States" 
        description="Disabled state visualization."
        framerCode={ButtonFramerCode}
        code={`
<Button theme="${theme}" disabled label="Disabled" />
<Button theme="${theme}" disabled type="secondary" label="Disabled" />
        `}
      >
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <Button theme={theme} disabled label="Disabled" />
          <Button theme={theme} disabled type="secondary" label="Disabled" />
        </div>
      </ComponentPreview>
    </div>

    {/* 5. Contexts */}
    <div id="contexts" className="scroll-mt-24">
      <ComponentPreview 
        title="Contextual Usage" 
        description="Real world examples."
        framerCode={ButtonFramerCode}
        code={`
<Button theme="${theme}" type="fail" iconPlacement="left" leftIcon={<Trash2 size={16}/>} label="Delete" />
<Button theme="${theme}" type="success" iconPlacement="right" rightIcon={<Check size={16}/>} label="Complete" />
        `}
      >
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <Button theme={theme} type="fail" iconPlacement="left" leftIcon={<Trash2 size={16}/>} label="Delete" />
          <Button theme={theme} type="success" iconPlacement="right" rightIcon={<Check size={16}/>} label="Complete" />
        </div>
      </ComponentPreview>
    </div>

  </div>
);

// --- App Shell ---

interface NavItem {
  id: string;
  label: string;
  icon?: any;
  children?: { id: string; label: string; }[];
}

export default function App() {
  const [activePage, setActivePage] = useState('intro');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['button']);

  // Initialize Theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId);
    if (!navItems.find(item => item.id === pageId)?.children) {
      setIsMobileMenuOpen(false);
      window.scrollTo(0, 0);
    }
  };

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const navItems: NavItem[] = [
    { id: 'intro', label: 'Introduction', icon: Box },
    { 
      id: 'button', 
      label: 'Button', 
      icon: MousePointer2,
      children: [
        { id: 'types', label: 'Types' },
        { id: 'sizes', label: 'Sizes' },
        { id: 'icons', label: 'Icons' },
        { id: 'states', label: 'States' },
      ]
    }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentTheme = isDarkMode ? 'dark' : 'light';

  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 transition-colors duration-200">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-50 flex items-center justify-between px-4 transition-colors duration-200">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900 dark:text-white">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black">
            <MousePointer2 size={20} />
          </div>
          SUS
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-400">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-all duration-300 ease-in-out lg:translate-x-0 pt-20 lg:pt-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="hidden lg:flex h-16 items-center px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
             <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900 dark:text-white">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black">
                <MousePointer2 size={20} />
              </div>
              SUS
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
             <div className="px-2 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-500 transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-6">Components</p>
            {navItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => {
                    handleNavClick(item.id);
                    if (item.children) toggleMenu(item.id);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    activePage === item.id 
                      ? "bg-black dark:bg-white text-white dark:text-black" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className={activePage === item.id ? "text-white dark:text-black" : "text-slate-400"} />
                    {item.label}
                  </div>
                  {item.children && (
                    <div className="text-opacity-50">
                      {expandedMenus.includes(item.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                  )}
                </button>
                
                {/* Sub-menu */}
                {item.children && expandedMenus.includes(item.id) && (
                  <div className="ml-9 mt-1 space-y-1 border-l border-slate-200 dark:border-slate-800 pl-2">
                    {item.children.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (activePage !== item.id) handleNavClick(item.id);
                          setTimeout(() => scrollToSection(subItem.id), 10);
                          if(window.innerWidth < 1024) setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-md transition-colors"
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sidebar Footer / Theme Toggle */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
             <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="flex items-center gap-3">
                  {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                  <span>{isDarkMode ? 'Dark' : 'Light'}</span>
                </span>
                <span className="relative inline-flex h-5 w-9 items-center rounded-full bg-slate-300 dark:bg-slate-700">
                  <span className={cn(
                    "inline-block h-3 w-3 transform rounded-full bg-white transition",
                    isDarkMode ? "translate-x-5" : "translate-x-1"
                  )} />
                </span>
              </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64 pt-16 lg:pt-0 bg-white dark:bg-slate-950 transition-colors duration-200">
        <div className="max-w-5xl mx-auto p-4 md:p-12 min-h-screen">
          {activePage === 'button' ? <ButtonPage theme={currentTheme} /> : <IntroPage onNavigate={handleNavClick} />}
        </div>
        
        <footer className="max-w-5xl mx-auto px-6 md:px-12 pb-12 pt-6 border-t border-slate-100 dark:border-slate-900 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
            <p>&copy; 2024 SUS Design System.</p>
          </div>
        </footer>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}