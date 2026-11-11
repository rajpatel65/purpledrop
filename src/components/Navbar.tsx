import { Link, NavLink } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { Menu, X, ArrowRight, ChevronDown, Shield, Calculator, SearchCheck } from 'lucide-react';
import { Logo } from './Logo';

const NAV_LINKS = [
  { to: '/services', label: 'Services' },
  { to: '/process', label: 'Process' },
  { to: '/results', label: 'Results' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
  { to: '/resources', label: 'Reads' },
];

const FREE_TOOLS = [
  { to: '/soc2', label: 'SOC2 Readiness Assessment', description: '42-question self-assessment across nine sections. Not an audit.', icon: Shield },
  { to: '/scorecard', label: 'Security Scorecard', description: 'Six public checks after email verification. On-screen results.', icon: SearchCheck },
  { to: '/calculator', label: 'Lead Value Calculator', description: 'Your leads, close rate and job value. A monthly what-if estimate.', icon: Calculator },
];

function linkClass(isActive: boolean) {
  return `relative text-sm font-medium transition-colors ${
    isActive
      ? 'text-ink after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-violet'
      : 'text-ink-soft hover:text-ink'
  }`;
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="container-page flex h-18 items-center justify-between py-4">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => linkClass(isActive)}>
              {link.label}
            </NavLink>
          ))}

          <div className="relative" ref={toolsRef}>
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              aria-expanded={toolsOpen}
              aria-haspopup="true"
              className="flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink transition-colors"
            >
              Free Tools
              <ChevronDown className={`h-4 w-4 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
            </button>

            {toolsOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-line bg-paper shadow-lg py-2 animate-in fade-in zoom-in-95 duration-150" role="menu">
                {FREE_TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.to}
                      to={tool.to}
                      onClick={() => setToolsOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 text-left hover:bg-violet-tint transition-colors"
                      role="menuitem"
                    >
                      <div className="flex-shrink-0 mt-0.5 p-2 rounded-lg bg-violet-tint text-violet">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-ink">{tool.label}</p>
                        <p className="text-xs text-ink-soft mt-0.5">{tool.description}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/contact" className="btn-primary">
            Free 30-min call
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className="rounded-lg border border-line p-2 text-ink"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-paper lg:hidden" aria-label="Mobile">
          <div className="container-page flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-base font-medium ${isActive ? 'bg-violet-tint text-ink' : 'text-ink-soft'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-line">
              <p className="px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">Free Tools</p>
              {FREE_TOOLS.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.to}
                    to={tool.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-ink-soft hover:bg-violet-tint hover:text-ink transition-colors"
                  >
                    <Icon className="h-5 w-5 text-violet flex-shrink-0" />
                    <span>{tool.label}</span>
                  </Link>
                );
              })}
            </div>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="btn-primary mt-4 w-full"
            >
              Free 30-min call
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
                              }
