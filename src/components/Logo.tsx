import { Link } from 'react-router-dom';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" aria-label="purpleDrop — home" className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M16 2.5C16 2.5 6.5 13.2 6.5 20.5a9.5 9.5 0 0 0 19 0c0-7.3-9.5-18-9.5-18Z"
          fill="#6D28D9"
        />
        <ellipse cx="12.6" cy="21.4" rx="2.1" ry="3" fill="#FAF6EF" opacity="0.85" />
      </svg>
      <span className="font-serif text-[1.35rem] font-semibold tracking-tight text-ink">
        purple<span className="text-violet">Drop</span>
      </span>
    </Link>
  );
}
