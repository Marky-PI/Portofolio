import React, { useState } from 'react';
import { PROFILE_DATA, type NavSectionId } from '../data/portfolioData';
import { getMarqueeDurationSeconds } from '../utils/portfolioLogic';

interface HeroSectionProps {
  darkMode: boolean;
  onNavigate?: (sectionId: NavSectionId) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  darkMode,
}) => {
  const [imageError, setImageError] = useState<boolean>(false);

  const marqueeDuration = getMarqueeDurationSeconds('normal');
  const slowMarqueeDuration = getMarqueeDurationSeconds('slow');
  const marqueeItems = [
    'PORTOFOLIO',
    'PORTOFOLIO',
    'PORTOFOLIO',
    'PORTOFOLIO',
  ];
  const domainRibbonItems = [
    'MAHESA RIZKY PUTRA IRDIANSYAH',
    'MAHESA RIZKY PUTRA IRDIANSYAH',
    'MAHESA RIZKY PUTRA IRDIANSYAH',
    'MAHESA RIZKY PUTRA IRDIANSYAH',
    'MAHESA RIZKY PUTRA IRDIANSYAH',
    'MAHESA RIZKY PUTRA IRDIANSYAH',
  ];

  return (
    <section
      id="home"
      data-sc-act="flow"
      data-sc-spotlight
      aria-label="Beranda Portofolio Mahesa"
      className={`relative min-h-screen w-full overflow-hidden flex flex-col justify-end transition-colors duration-500 ${
        darkMode ? 'bg-black text-zinc-100' : 'bg-[#EAEAEF] text-zinc-900'
      }`}
    >
      {/* PLANE 0 (z-0): Dedicated Black Studio Base for First Page */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-0 ${
          darkMode
            ? '[background:radial-gradient(125%_125%_at_50%_10%,#000000_40%,#09090b_100%)]'
            : '[background:radial-gradient(125%_125%_at_50%_10%,#ffffff_40%,#EAEAEF_100%)]'
        }`}
      />

      {/* PLANE 1A (z-10, data-sc-parallax="-1.1"): Upper Counter-Marquee Telemetry Strip */}
      <div
        aria-hidden="true"
        data-sc-parallax="-1.1"
        className="pointer-events-none absolute inset-x-0 top-[26%] z-10 overflow-hidden flex items-center opacity-35"
      >
        <div
          className="animate-marquee-right shrink-0"
          style={
            {
              '--marquee-duration': `${slowMarqueeDuration}s`,
            } as React.CSSProperties
          }
        >
          {[0, 1].map((groupIndex) => (
            <div key={groupIndex} className="flex items-center shrink-0">
              {domainRibbonItems.map((phrase, idx) => (
                <span
                  key={`${groupIndex}-${idx}`}
                  className="font-mono text-xs sm:text-sm tracking-[0.32em] uppercase pr-12 select-none whitespace-nowrap inline-flex items-center gap-12 shrink-0"
                >
                  <span>{phrase}</span>
                  <span aria-hidden="true" className="opacity-40">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* PLANE 1B (z-10, data-sc-parallax="-0.82"): Giant Running Text "PORTOFOLIO" Strictly Behind Portrait */}
      <div
        aria-hidden="true"
        data-sc-parallax="-0.82"
        className="pointer-events-none absolute inset-x-0 top-[52%] -translate-y-1/2 z-10 overflow-hidden flex items-center"
      >
        <div
          className="animate-marquee-left shrink-0"
          style={
            { '--marquee-duration': `${marqueeDuration}s` } as React.CSSProperties
          }
        >
          {[0, 1].map((groupIndex) => (
            <div
              key={groupIndex}
              className="flex items-center shrink-0"
              aria-hidden="true"
            >
              {marqueeItems.map((word, idx) => (
                <span
                  key={`${groupIndex}-${idx}`}
                  className={`font-display font-extrabold text-[clamp(7rem,19.5vw,18.5rem)] leading-none tracking-[0.04em] uppercase pr-14 sm:pr-24 select-none shrink-0 ${
                    darkMode ? 'stroke-text-dark' : 'stroke-text-light'
                  }`}
                >
                  {word}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* PLANE 2 (z-20, data-sc-parallax="-0.22"): Centered Foreground Studio Portrait Cutout */}
      <div className="relative z-20 w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 pt-24 flex flex-col items-center justify-end min-h-screen pointer-events-none">
        <div
          data-sc-parallax="-0.22"
          className="relative w-full flex justify-center items-end overflow-visible"
        >
          {!imageError ? (
            <img
              src={PROFILE_DATA.portraitSrc}
              alt="Potret Mahesa Rizky Putra Irdiansyah"
              width={1024}
              height={576}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="sc-hero-portrait w-auto max-w-none h-[66vh] sm:h-[78vh] lg:h-[86vh] max-h-[840px] object-contain object-bottom select-none transition-opacity duration-500 drop-shadow-[0_24px_48px_rgba(0,0,0,0.28)]"
            />
          ) : (
            <div
              className={`w-80 h-[65vh] rounded-t-3xl border flex flex-col items-center justify-center p-8 text-center ${
                darkMode
                  ? 'bg-zinc-900 border-white/15 text-zinc-200'
                  : 'bg-zinc-200 border-zinc-900/15 text-zinc-800'
              }`}
            >
              <span className="font-display text-5xl font-bold mb-3">M</span>
              <p className="font-display font-semibold text-lg">
                {PROFILE_DATA.fullName}
              </p>
              <p className="text-xs opacity-75 mt-1">
                {PROFILE_DATA.institution}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* PLANE 3 (z-30): 21st.dev ibelick/tailwind-css-background-snippet Curved Gradient Cover (Blue #63e replaced with Black) to seamlessly mask the portrait bottom edge */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-30 ${
          darkMode
            ? '[background:radial-gradient(125%_125%_at_50%_10%,transparent_44%,#000000_74%,#0a0a0a_100%)]'
            : '[background:radial-gradient(125%_125%_at_50%_10%,transparent_44%,#EAEAEF_76%,#EAEAEF_100%)]'
        }`}
      />
    </section>
  );
};
