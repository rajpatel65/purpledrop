import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export interface StickyMobileCTAProps {
  label?: string;
  href?: string;
  showOnPaths?: string[];
}

export function StickyMobileCTA({
  label = 'Request a free 30-minute call',
  href = '/contact',
  showOnPaths = ['/', '/services', '/process', '/results', '/pricing', '/about', '/scorecard', '/calculator', '/soc2'],
}: StickyMobileCTAProps) {
  // Router-provided path (SSR-safe) instead of window.location, which is
  // unavailable during prerender.
  const { pathname } = useLocation();
  const shouldShow = showOnPaths.some(path => pathname === path || pathname.startsWith(path + '/'));

  if (!shouldShow) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-line shadow-lg">
      <Link
        to={href}
        className="block w-full px-4 py-4 bg-violet text-paper text-center font-semibold text-base rounded-none hover:bg-violet-deep transition-colors"
      >
        {label}
        <ArrowRight className="inline-block ml-2 h-5 w-5" />
      </Link>
    </div>
  );
}
