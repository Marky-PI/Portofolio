import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export interface ButtonColorfulProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  darkMode?: boolean;
}

export function ButtonColorful({
  className = '',
  label = 'Explore Components',
  darkMode = false,
  ...props
}: ButtonColorfulProps) {
  return (
    <button
      type="button"
      className={`relative h-10 px-4 rounded-xl overflow-hidden text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 group cursor-pointer whitespace-nowrap shrink-0 ${
        darkMode ? 'bg-zinc-100' : 'bg-zinc-900'
      } ${className}`}
      {...props}
    >
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-40 group-hover:opacity-80 blur transition-opacity duration-500" />

      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        <span className={darkMode ? 'text-zinc-900' : 'text-white'}>
          {label}
        </span>
        <ArrowUpRight
          className={`w-3.5 h-3.5 ${
            darkMode ? 'text-zinc-900/90' : 'text-white/90'
          }`}
        />
      </div>
    </button>
  );
}
