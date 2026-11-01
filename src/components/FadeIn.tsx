import { useInView } from '../hooks/useInView';

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export function FadeIn({ children, className = '', delay = 0, y = 26 }: FadeInProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity 0.8s ${ease} ${delay}s, transform 0.8s ${ease} ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
