import { Linkedin } from 'lucide-react';
import { FadeIn } from './FadeIn';

export interface TeamCardProps {
  name: string;
  title: string;
  bio: string;
  photo?: string;
  linkedin?: string;
  index: number;
}

export function TeamCard({ name, title, bio, photo, linkedin, index }: TeamCardProps) {
  return (
    <FadeIn delay={index * 0.08}>
      <div className="group text-center p-6 bg-paper border border-line rounded-2xl hover:border-violet/30 hover:shadow-card-hover transition-all duration-300">
        <div className="relative w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden bg-cream flex items-center justify-center">
          {photo ? (
            <img src={photo} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-violet/5 flex items-center justify-center">
              <span className="font-serif text-3xl font-medium text-violet">
                {name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
        </div>
        <h3 className="font-semibold text-lg text-ink mb-1">{name}</h3>
        <p className="text-sm text-violet font-medium mb-3">{title}</p>
        <p className="text-sm text-ink-soft leading-relaxed mb-4">{bio}</p>
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-violet hover:text-violet-deep transition-colors"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </a>
        )}
      </div>
    </FadeIn>
  );
}