import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, X } from 'lucide-react';
import { EXPERIENCE_DATA, ExperienceItem } from '../data/portfolioData';
import { filterExperiencesByCategory } from '../utils/portfolioLogic';

interface ExperienceSectionProps {
  darkMode: boolean;
}

const CATEGORY_TABS = [
  { id: 'All', label: 'All' },
  { id: 'Academic & Clinical', label: 'Rumah Sakit' },
  { id: 'Primary Healthcare', label: 'Puskesmas' },
] as const;

function isPknExperience(exp: ExperienceItem): boolean {
  return exp.role.includes('PKN') || exp.category === 'Primary Healthcare';
}

function getExperienceTypeLabel(exp: ExperienceItem): string {
  return isPknExperience(exp) ? 'PUSKESMAS' : 'RUMAH SAKIT';
}

function getExperienceIcon(exp: ExperienceItem) {
  const isPkn = isPknExperience(exp);
  const iconSrc = isPkn
    ? '/assets/icons/clinic.png'
    : '/assets/icons/hospital.png';
  const altText = isPkn ? 'Ikon Puskesmas' : 'Ikon Rumah Sakit';

  return (
    <img
      src={iconSrc}
      alt={altText}
      className="w-8 h-8 sm:w-9 sm:h-9 object-contain select-none"
      style={{ filter: 'brightness(0) invert(1)' }}
    />
  );
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  darkMode,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeExperience, setActiveExperience] =
    useState<ExperienceItem | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const filteredExperiences = filterExperiencesByCategory(
    EXPERIENCE_DATA,
    selectedCategory
  );

  // Close floating modal on Escape key & lock body scroll while open
  useEffect(() => {
    if (!activeExperience) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveExperience(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeExperience]);

  const openModal = (exp: ExperienceItem, idx: number) => {
    setActiveExperience(exp);
    setActiveIndex(idx);
  };

  return (
    <section
      id="experience"
      data-sc-act="flow"
      aria-labelledby="experience-heading"
      className={`py-24 sm:py-32 px-4 sm:px-8 lg:px-12 xl:px-16 transition-colors duration-300 ${
        darkMode
          ? 'bg-transparent text-zinc-100'
          : 'bg-transparent text-zinc-900'
      }`}
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Section Header & Category Filter */}
        <div
          data-sc-in
          className="flex flex-col items-center text-center pb-10 border-b border-current/10 mb-12 sm:mb-14"
        >
          <h2
            id="experience-heading"
            className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-balance mb-4"
          >
            My Experience
          </h2>
          <p
            className={`text-base sm:text-lg max-w-2xl leading-relaxed mb-8 ${
              darkMode ? 'text-zinc-300' : 'text-zinc-600'
            }`}
          >
            Rekam jejak Praktik Kerja Lapangan (PKL) dan Praktik Kerja Nyata
            (PKN) dalam pengelolaan rekam medis, pengkodean klinis ICD-10 &
            ICD-9-CM, serta sistem informasi kesehatan.
          </p>

          {/* Interactive Filter Controls */}
          <div
            role="group"
            aria-label="Filter Kategori Pengalaman"
            className={`inline-flex items-center gap-1 p-1.5 rounded-xl border overflow-x-auto max-w-full shrink-0 backdrop-blur-md ${
              darkMode
                ? 'bg-zinc-900/80 border-white/15'
                : 'bg-white/85 border-zinc-900/15 shadow-xs'
            }`}
          >
            {CATEGORY_TABS.map((tab) => {
              const active = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`min-h-10 px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 active:scale-[0.98] cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 ${
                    active
                      ? darkMode
                        ? 'bg-white text-zinc-950 font-semibold shadow-sm focus-visible:ring-white/60'
                        : 'bg-zinc-950 text-white font-semibold shadow-sm focus-visible:ring-zinc-900/60'
                      : darkMode
                        ? 'text-zinc-300 hover:text-white hover:bg-white/10 focus-visible:ring-white/60'
                        : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-900/5 focus-visible:ring-zinc-900/60'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Experience Feature Cards Grid with Grayscale Photo Backgrounds */}
        <div
          data-sc-in
          data-sc-stagger="70"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8"
        >
          {filteredExperiences.map((exp) => {
            const globalIndex = Math.max(
              0,
              EXPERIENCE_DATA.findIndex((item) => item.id === exp.id)
            );

            return (
              <article
                key={exp.id}
                onClick={() => openModal(exp, globalIndex)}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                aria-label={`Buka detail pengalaman ${exp.role}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(exp, globalIndex);
                  }
                }}
                className="group relative min-h-[360px] rounded-3xl overflow-hidden bg-zinc-950 border border-white/15 hover:border-white/35 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-[0_18px_45px_rgba(0,0,0,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                {/* Grayscale Photo Background with Lowered Opacity */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden bg-black">
                  {exp.image && (
                    <img
                      src={exp.image}
                      alt={exp.role}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center grayscale contrast-110 opacity-45 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700 ease-out select-none pointer-events-none"
                    />
                  )}
                  {/* Readability Scrim Overlay */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/65 to-black/45 group-hover:from-black/85 group-hover:via-black/55 group-hover:to-black/35 transition-colors duration-300"
                  />
                </div>

                {/* Card Content Overlay */}
                <div className="relative z-10 p-7 sm:p-8 rounded-3xl h-full flex flex-col">
                  {/* Top Icon & Category Badge */}
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="p-2.5 rounded-2xl bg-black/60 border border-white/20 backdrop-blur-md shadow-lg flex items-center justify-center">
                      {getExperienceIcon(exp)}
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-black/60 text-zinc-100 border border-white/15 backdrop-blur-md">
                      {getExperienceTypeLabel(exp)}
                    </span>
                  </div>

                  {/* Period & Location */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-zinc-200 mb-2 drop-shadow-sm">
                    <span>{exp.period}</span>
                    <span aria-hidden="true">·</span>
                    <span>{exp.location}</span>
                  </div>

                  {/* Experience Role Title */}
                  <h3 className="font-display text-xl sm:text-2xl font-bold mb-3 text-white tracking-tight leading-snug drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    {exp.role}
                  </h3>

                  {/* Summary */}
                  <p className="leading-relaxed flex-grow text-zinc-100/95 text-sm sm:text-base font-normal drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
                    {exp.summary}
                  </p>

                  {/* Learn More CTA */}
                  <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-sm font-bold text-white">
                    <span className="mr-2 tracking-wide">Learn more</span>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/15 border border-white/20 group-hover:bg-white group-hover:text-black transition-all duration-300">
                      <svg
                        className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Floating Window (Modal Dialog) for Experience Details */}
      {activeExperience && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="experience-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <div
            onClick={() => setActiveExperience(null)}
            className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            aria-hidden="true"
          />

          {/* Floating Window Content */}
          <div className="relative z-10 w-full max-w-2xl rounded-3xl overflow-hidden border border-white/20 bg-zinc-950 text-white shadow-[0_25px_70px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-200">
            {/* Top Grayscale Photo Banner */}
            <div className="relative h-44 sm:h-52 overflow-hidden border-b border-white/15 bg-black">
              {activeExperience.image && (
                <img
                  src={activeExperience.image}
                  alt={activeExperience.role}
                  className="w-full h-full object-cover object-center grayscale contrast-110 opacity-55 select-none pointer-events-none"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/50 to-black/30" />

              <div className="relative z-10 h-full px-6 sm:px-8 py-5 flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-black/65 border border-white/20 backdrop-blur-md flex items-center justify-center">
                    {getExperienceIcon(activeExperience)}
                  </div>
                  <div>
                    <span className="inline-block font-mono text-xs uppercase tracking-widest text-zinc-200 drop-shadow">
                      {getExperienceTypeLabel(activeExperience)}
                    </span>
                    <p className="text-xs font-mono text-zinc-300 mt-0.5 drop-shadow">
                      Detail Pengalaman & Kontribusi
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveExperience(null)}
                  aria-label="Tutup jendela detail"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/65 hover:bg-white hover:text-black text-zinc-100 border border-white/20 backdrop-blur-md transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-300 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  {activeExperience.period}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  {activeExperience.location}
                </span>
              </div>

              <h3
                id="experience-modal-title"
                className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug mb-4"
              >
                {activeExperience.role}
              </h3>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6">
                {activeExperience.summary}
              </p>

              <div className="pt-6 border-t border-white/10">
                <p className="font-mono text-xs uppercase tracking-wider text-zinc-400 mb-4">
                  Kontribusi & Kegiatan Utama
                </p>
                <ul className="space-y-3">
                  {activeExperience.highlights.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-sm sm:text-base leading-relaxed text-zinc-100"
                    >
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-white/10 font-mono text-xs font-semibold text-white shrink-0 mt-0.5 tabular-nums">
                        0{i + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveExperience(null)}
                  className="px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
