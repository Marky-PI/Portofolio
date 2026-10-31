import React, { useEffect, useState } from 'react';
import { CheckCircle2, Maximize2, X } from 'lucide-react';
import {
  COMPETENCY_CREDENTIALS_DATA,
  type CompetencyCredentialItem,
} from '../data/portfolioData';

interface CompetenciesSectionProps {
  darkMode: boolean;
}

export const CompetenciesSection: React.FC<CompetenciesSectionProps> = ({
  darkMode,
}) => {
  const [selectedCredential, setSelectedCredential] =
    useState<CompetencyCredentialItem | null>(null);

  useEffect(() => {
    if (!selectedCredential) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCredential(null);
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCredential]);

  return (
    <section
      id="competencies"
      data-sc-act="flow"
      aria-labelledby="competencies-heading"
      className={`py-24 sm:py-32 px-4 sm:px-8 lg:px-12 xl:px-16 transition-colors duration-300 ${
        darkMode
          ? 'bg-transparent text-zinc-100'
          : 'bg-transparent text-zinc-900'
      }`}
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Section Header */}
        <div
          data-sc-in
          className="flex flex-col items-center justify-center text-center pb-10 border-b border-current/10"
        >
          <h2
            id="competencies-heading"
            className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-balance text-center mb-4"
          >
            My Competencies
          </h2>
          <p
            className={`text-base sm:text-lg max-w-2xl leading-relaxed text-center ${
              darkMode ? 'text-zinc-300' : 'text-zinc-600'
            }`}
          >
            Bukti kredensial dan legalitas profesi resmi yang mencerminkan standar kompetensi nasional, integritas keilmuan, serta kesiapan profesional dalam tata kelola rekam medis dan sistem informasi kesehatan.
          </p>
        </div>

        {/* Two-Row Credential Showcase (Sertifikat Kompetensi & STR) */}
        <div
          data-sc-in
          data-sc-stagger="110"
          className="mt-12 space-y-10 sm:space-y-12"
        >
          {COMPETENCY_CREDENTIALS_DATA.map((item) => (
            <article
              key={item.id}
              data-sc-spotlight
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center rounded-3xl border p-6 sm:p-8 lg:p-10 backdrop-blur-md transition-all duration-300 ${
                darkMode
                  ? 'bg-zinc-900/65 border-white/12 hover:border-white/25 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_20px_50px_rgba(0,0,0,0.45)]'
                  : 'bg-white/90 border-zinc-900/12 hover:border-zinc-900/25 shadow-sm'
              }`}
            >
              {/* Left Column: Official Document Image */}
              <div className="lg:col-span-5">
                <button
                  type="button"
                  onClick={() => setSelectedCredential(item)}
                  aria-label={`Perbesar dokumen ${item.title}`}
                  data-sc-tilt="4"
                  className={`group relative w-full overflow-hidden rounded-2xl border text-left transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 ${
                    darkMode
                      ? 'bg-zinc-950/80 border-white/15 hover:border-white/40 shadow-[0_16px_40px_rgba(0,0,0,0.5)] focus-visible:ring-white/60'
                      : 'bg-white border-zinc-900/15 hover:border-zinc-900/40 shadow-md focus-visible:ring-zinc-900/60'
                  }`}
                >
                  <img
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-end justify-end p-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono uppercase tracking-wider bg-zinc-950/90 text-zinc-100 border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Maximize2 aria-hidden="true" className="w-3.5 h-3.5" />
                      <span>Perbesar</span>
                    </span>
                  </div>
                </button>
              </div>

              {/* Right Column: Narrative & Verified Metadata */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-widest opacity-70 tabular-nums">
                  <span>{item.index}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.badge}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.validity}</span>
                </div>

                <h3 className="font-display font-bold text-xl sm:text-2xl lg:text-3xl tracking-tight mt-2.5 text-balance">
                  {item.title}
                </h3>

                <p
                  className={`text-sm sm:text-base leading-relaxed mt-4 text-justify sm:text-left ${
                    darkMode ? 'text-zinc-300' : 'text-zinc-700'
                  }`}
                >
                  {item.description}
                </p>

                <div
                  className={`mt-6 pt-5 border-t grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs ${
                    darkMode ? 'border-white/12' : 'border-zinc-900/12'
                  }`}
                >
                  <div>
                    <span className="block font-mono uppercase tracking-wider opacity-60">
                      Nomor Dokumen
                    </span>
                    <span className="font-mono font-semibold mt-1 block tabular-nums break-all">
                      {item.documentNumber}
                    </span>
                  </div>

                  <div>
                    <span className="block font-mono uppercase tracking-wider opacity-60">
                      Diterbitkan
                    </span>
                    <span className="font-semibold mt-1 block">
                      {item.issueDate}
                    </span>
                  </div>

                  <div>
                    <span className="block font-mono uppercase tracking-wider opacity-60">
                      Kualifikasi
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-semibold mt-1">
                      <CheckCircle2 aria-hidden="true" className="w-3.5 h-3.5 shrink-0" />
                      <span>Level 5 (Ahli Madya)</span>
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal for Document Inspection */}
      {selectedCredential && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="credential-lightbox-title"
          onClick={() => setSelectedCredential(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-4xl rounded-3xl border p-5 sm:p-6 max-h-[92vh] flex flex-col shadow-2xl ${
              darkMode
                ? 'bg-zinc-950 border-white/20 text-zinc-100'
                : 'bg-white border-zinc-900/15 text-zinc-900'
            }`}
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-current/10">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest opacity-65">
                  {selectedCredential.badge} · NOMOR:{' '}
                  {selectedCredential.documentNumber}
                </p>
                <h3
                  id="credential-lightbox-title"
                  className="font-display font-bold text-lg sm:text-xl mt-1"
                >
                  {selectedCredential.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCredential(null)}
                aria-label="Tutup Pratinjau Dokumen"
                className="w-10 h-10 rounded-full border border-current/20 flex items-center justify-center hover:bg-current/10 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2"
              >
                <X aria-hidden="true" className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 overflow-auto flex-1 flex items-center justify-center rounded-2xl bg-black/25 p-2">
              <img
                src={selectedCredential.imageSrc}
                alt={selectedCredential.imageAlt}
                className="max-h-[72vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
