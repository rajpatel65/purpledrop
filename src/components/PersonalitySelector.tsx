import { useState, useCallback } from 'react';
import { TrendingUp, Eye, Route, BarChart3 } from 'lucide-react';
import { FadeIn } from './FadeIn';

const PERSONALITIES = [
  {
    id: 'd',
    label: 'Show me the ROI',
    desc: 'What does this cost and what changes?',
    target: '#services',
    icon: TrendingUp,
  },
  {
    id: 'i',
    label: 'Show me the proof',
    desc: 'What does AI actually say right now?',
    target: '#learn',
    icon: Eye,
  },
  {
    id: 's',
    label: 'Walk me through it',
    desc: 'How does this actually work?',
    target: '#process',
    icon: Route,
  },
  {
    id: 'c',
    label: 'Show me the data',
    desc: "What's the methodology?",
    target: '#learn',
    icon: BarChart3,
  },
] as const;

const STORAGE_KEY = 'purpledrop-personality';

function getStoredId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function PersonalitySelector() {
  const [selected, setSelected] = useState<string | null>(getStoredId);

  const handleSelect = useCallback((id: string, target: string) => {
    setSelected(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* localStorage unavailable — skip persistence */
    }
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      el.classList.remove('section-highlight');
      // Force reflow so the animation restarts if clicked again
      void (el as HTMLElement).offsetWidth;
      el.classList.add('section-highlight');
      setTimeout(() => el.classList.remove('section-highlight'), 2500);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, id: string, target: string) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSelect(id, target);
      }
    },
    [handleSelect],
  );

  return (
    <section className="border-b border-line bg-cream/50 py-16">
      <div className="container-page">
        <FadeIn>
          <p className="eyebrow text-center">First, tell us what you need</p>
          <h2 className="mt-4 text-center font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            What matters most to you?
          </h2>
          <p className="mt-3 text-center text-sm text-ink-soft">
            Pick one — we&apos;ll show you the parts that answer your question.
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div
            role="radiogroup"
            aria-label="What matters most to you"
            className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4"
          >
            {PERSONALITIES.map((p) => {
              const Icon = p.icon;
              const isActive = selected === p.id;
              return (
                <button
                  key={p.id}
                  role="radio"
                  aria-checked={isActive}
                  tabIndex={0}
                  onClick={() => handleSelect(p.id, p.target)}
                  onKeyDown={(e) => handleKeyDown(e, p.id, p.target)}
                  className={`group flex flex-col items-start gap-3 rounded-2xl border p-6 text-left transition-all duration-300 ${
                    isActive
                      ? 'border-violet bg-violet-tint shadow-md'
                      : 'border-line bg-paper hover:border-violet/40 hover:shadow-soft'
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-300 ${
                      isActive ? 'bg-violet text-paper' : 'bg-cream text-violet group-hover:bg-violet-tint'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p
                      className={`text-sm font-semibold transition-colors ${
                        isActive ? 'text-violet-deep' : 'text-ink'
                      }`}
                    >
                      {p.label}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-soft">{p.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
