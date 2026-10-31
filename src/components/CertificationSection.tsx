import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Maximize2, X } from 'lucide-react';
import {
  CERTIFICATION_DATA,
  type CertificationItem,
} from '../data/portfolioData';

interface CertificationSectionProps {
  darkMode: boolean;
}

export const CertificationSection: React.FC<CertificationSectionProps> = ({
  darkMode,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>(
    'right'
  );
  const [descEntered, setDescEntered] = useState<boolean>(true);
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(
    null
  );

  const touchStartX = useRef<number | null>(null);

  const total = CERTIFICATION_DATA.length;
  const prevIndex = (activeIndex - 1 + total) % total;
  const nextIndex = (activeIndex + 1) % total;
  const activeCert = CERTIFICATION_DATA[activeIndex];

  const triggerSlide = (newIndex: number, direction: 'right' | 'left') => {
    setSlideDirection(direction);
    setDescEntered(false);
    setActiveIndex(newIndex);
  };

  useEffect(() => {
    if (!descEntered) {
      const rafId = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setDescEntered(true);
        });
      });
      return () => cancelAnimationFrame(rafId);
    }
  }, [descEntered, activeIndex]);

  useEffect(() => {
    if (!selectedCert) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCert(null);
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleEsc);
    };
  }, [selectedCert]);

  const handlePrev = () => {
    triggerSlide((activeIndex - 1 + total) % total, 'left');
  };

  const handleNext = () => {
    triggerSlide((activeIndex + 1) % total, 'right');
  };

  const handleSelectIndex = (idx: number) => {
    if (idx === activeIndex) return;
    const dir = idx > activeIndex ? 'right' : 'left';
    triggerSlide(idx, dir);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diffX) > 40) {
      if (diffX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <section
      id="certification"
      data-sc-act="flow"
      aria-labelledby="certification-heading"
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
            id="certification-heading"
            className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-balance text-center"
          >
            My Certification
          </h2>
        </div>

        {/* 3-Card Persistent Coverflow Carousel */}
        <div data-sc-in className="mt-12 sm:mt-16">
          <div className="relative flex items-center justify-between gap-2 sm:gap-6">
            {/* Left Arrow Button (Geser Kiri) */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Lihat Sertifikat Sebelumnya (Geser Kiri)"
              data-sc-magnet="0.25"
              className={`z-40 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border transition-all cursor-pointer shrink-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 ${
                darkMode
                  ? 'bg-zinc-900/85 border-white/15 text-zinc-100 hover:bg-white hover:text-zinc-950 shadow-lg focus-visible:ring-white/60'
                  : 'bg-white/90 border-zinc-900/15 text-zinc-900 hover:bg-zinc-950 hover:text-white shadow-md focus-visible:ring-zinc-900/60'
              }`}
            >
              <ArrowLeft aria-hidden="true" className="w-5 h-5" />
            </button>

            {/* 3-Certificate Stage — All 3 Cards Stay Mounted & Smoothly Translate */}
            <div
              tabIndex={0}
              onKeyDown={handleKeyDown}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              aria-label="Karusel Sertifikat Resmi. Gunakan panah kiri dan kanan untuk berpindah."
              className="relative w-full max-w-[1120px] mx-auto aspect-[16/9] sm:aspect-[16/8.2] max-h-[480px] select-none outline-none"
            >
              {CERTIFICATION_DATA.map((cert, idx) => {
                const isCenter = idx === activeIndex;
                const isLeft = idx === prevIndex;

                // Position & scale choreography for Left (-1), Center (0), and Right (+1) slots
                let transformValue =
                  'translate3d(-50%, 0%, 0) scale(1)';
                let zIndexValue = 30;
                let opacityValue = 1;

                if (isLeft) {
                  transformValue =
                    'translate3d(-92%, 4%, 0) scale(0.78)';
                  zIndexValue = slideDirection === 'right' ? 20 : 10;
                  opacityValue = 0.72;
                } else if (!isCenter) {
                  // Right slot (nextIndex)
                  transformValue =
                    'translate3d(-8%, 4%, 0) scale(0.78)';
                  zIndexValue = slideDirection === 'left' ? 20 : 10;
                  opacityValue = 0.72;
                }

                return (
                  <button
                    key={cert.id}
                    type="button"
                    onClick={() => {
                      if (isCenter) {
                        setSelectedCert(cert);
                      } else if (isLeft) {
                        handlePrev();
                      } else {
                        handleNext();
                      }
                    }}
                    aria-label={
                      isCenter
                        ? `Perbesar ${cert.title}`
                        : `Geser ke ${cert.title}`
                    }
                    style={{
                      left: '50%',
                      bottom: '0.5rem',
                      transform: transformValue,
                      zIndex: zIndexValue,
                      opacity: opacityValue,
                      transition:
                        'transform 560ms cubic-bezier(0.22, 1, 0.36, 1), opacity 560ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 560ms ease',
                    }}
                    className={`group absolute w-[70%] sm:w-[62%] overflow-hidden rounded-xl border cursor-pointer will-change-transform ${
                      isCenter
                        ? darkMode
                          ? 'bg-zinc-900 border-white/25 shadow-[0_28px_70px_rgba(0,0,0,0.78)]'
                          : 'bg-white border-zinc-900/25 shadow-[0_24px_60px_rgba(0,0,0,0.24)]'
                        : darkMode
                          ? 'bg-zinc-900 border-white/15 shadow-[0_12px_30px_rgba(0,0,0,0.55)] hover:opacity-95'
                          : 'bg-white border-zinc-900/15 shadow-md hover:opacity-95'
                    }`}
                  >
                    <img
                      src={cert.imageSrc}
                      alt={cert.title}
                      className="w-full aspect-[1.414/1] object-cover pointer-events-none"
                    />

                    {isCenter ? (
                      <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-end justify-between p-3 sm:p-4">
                        {cert.images.length > 1 ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider bg-zinc-950/85 text-zinc-100 border border-white/15">
                            {cert.images.length} Halaman
                          </span>
                        ) : (
                          <span />
                        )}

                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono uppercase tracking-wider bg-zinc-950/85 text-zinc-100 border border-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>
                            {cert.images.length > 1
                              ? 'Perbesar (2 Halaman)'
                              : 'Perbesar'}
                          </span>
                        </span>
                      </div>
                    ) : (
                      <div className="pointer-events-none absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Arrow Button (Geser Kanan) */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Lihat Sertifikat Berikutnya (Geser Kanan)"
              data-sc-magnet="0.25"
              className={`z-40 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full border transition-all cursor-pointer shrink-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 ${
                darkMode
                  ? 'bg-zinc-900/85 border-white/15 text-zinc-100 hover:bg-white hover:text-zinc-950 shadow-lg focus-visible:ring-white/60'
                  : 'bg-white/90 border-zinc-900/15 text-zinc-900 hover:bg-zinc-950 hover:text-white shadow-md focus-visible:ring-zinc-900/60'
              }`}
            >
              <ArrowRight aria-hidden="true" className="w-5 h-5" />
            </button>
          </div>

          {/* Slide Indicators (Expanded Touch Hit Area per UI/UX Pro Max) */}
          <div className="mt-4 flex items-center justify-center gap-1">
            {CERTIFICATION_DATA.map((item, idx) => {
              const isCurrent = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectIndex(idx)}
                  aria-label={`Tampilkan sertifikat ${idx + 1}: ${item.title}`}
                  aria-current={isCurrent ? 'true' : undefined}
                  className="py-3 px-1.5 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/50 rounded-lg"
                >
                  <span
                    className={`h-1.5 rounded-full transition-all block ${
                      isCurrent
                        ? darkMode
                          ? 'w-8 bg-white'
                          : 'w-8 bg-zinc-900'
                        : darkMode
                          ? 'w-2 bg-white/25 hover:bg-white/50'
                          : 'w-2 bg-zinc-900/25 hover:bg-zinc-900/50'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Active Certificate Description Box Below (with Smooth Directional Slide) */}
          <article
            data-sc-spotlight
            style={{
              transform: descEntered
                ? 'translate3d(0, 0, 0)'
                : slideDirection === 'right'
                  ? 'translate3d(44px, 0, 0)'
                  : 'translate3d(-44px, 0, 0)',
              opacity: descEntered ? 1 : 0,
              transition: descEntered
                ? 'transform 460ms cubic-bezier(0.22, 1, 0.36, 1), opacity 460ms ease'
                : 'none',
            }}
            className={`mt-6 max-w-[1120px] mx-auto rounded-3xl border p-6 sm:p-8 backdrop-blur-md will-change-transform ${
              darkMode
                ? 'bg-zinc-900/65 border-white/12 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_20px_50px_rgba(0,0,0,0.45)]'
                : 'bg-white/90 border-zinc-900/12 shadow-sm'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono uppercase tracking-widest opacity-65 tabular-nums">
              <div className="flex flex-wrap items-center gap-2">
                <span>0{activeIndex + 1}</span>
                <span aria-hidden="true">·</span>
                <span>{activeCert.category}</span>
                <span aria-hidden="true">·</span>
                <span>{activeCert.issueDate}</span>
                <span aria-hidden="true">·</span>
                <span>{activeCert.duration}</span>
              </div>
              <span>NOMOR: {activeCert.credentialId}</span>
            </div>

            <h3 className="font-display font-bold text-xl sm:text-2xl tracking-tight mt-3">
              {activeCert.title}
            </h3>

            <p className="text-xs sm:text-sm font-medium opacity-75 mt-1">
              {activeCert.issuer}
            </p>

            <p
              className={`text-sm sm:text-base leading-relaxed mt-4 text-justify ${
                darkMode ? 'text-zinc-300' : 'text-zinc-700'
              }`}
            >
              {activeCert.summary}
            </p>

            <div className="mt-6 pt-5 border-t border-current/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 text-xs opacity-75">
                <CheckCircle2 aria-hidden="true" className="w-4 h-4 shrink-0" />
                <span>{activeCert.verifiedSkills.join(' · ')}</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCert(activeCert)}
                className={`min-h-11 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 active:scale-[0.98] cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 ${
                  darkMode
                    ? 'border-white/20 text-zinc-100 hover:bg-white hover:text-zinc-950 focus-visible:ring-white/60'
                    : 'border-zinc-900/20 text-zinc-900 hover:bg-zinc-950 hover:text-white focus-visible:ring-zinc-900/60'
                }`}
              >
                <Maximize2 aria-hidden="true" className="w-3.5 h-3.5" />
                <span>
                  {activeCert.images.length > 1
                    ? 'Perbesar Sertifikat (2 Halaman)'
                    : 'Perbesar Sertifikat'}
                </span>
              </button>
            </div>
          </article>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal (Supports Multi-Page Vertical Scroll for QGIS) */}
      {selectedCert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cert-modal-title"
          onClick={() => setSelectedCert(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-4xl rounded-2xl border p-4 sm:p-6 max-h-[92vh] flex flex-col ${
              darkMode
                ? 'bg-zinc-900 border-white/15 text-zinc-100'
                : 'bg-white border-zinc-900/15 text-zinc-900'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-current/10 shrink-0">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest opacity-60">
                  NOMOR: {selectedCert.credentialId} · {selectedCert.issueDate}
                  {selectedCert.images.length > 1
                    ? ` · ${selectedCert.images.length} HALAMAN (GULIR KE BAWAH)`
                    : ''}
                </p>
                <h3
                  id="cert-modal-title"
                  className="font-display font-bold text-lg sm:text-xl mt-1"
                >
                  {selectedCert.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                aria-label="Tutup Pratinjau Sertifikat"
                className="w-10 h-10 rounded-full border border-current/20 flex items-center justify-center hover:bg-current/10 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2"
              >
                <X aria-hidden="true" className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Document Pages Container */}
            <div className="mt-4 overflow-y-auto flex-1 rounded-xl bg-black/20 p-3 sm:p-4 space-y-6">
              {selectedCert.images.map((imgSrc, pageIdx) => (
                <div key={imgSrc} className="flex flex-col items-center">
                  {selectedCert.images.length > 1 && (
                    <div className="w-full flex items-center justify-between text-xs font-mono uppercase tracking-widest opacity-65 mb-2 px-1">
                      <span>
                        Halaman {pageIdx + 1} dari {selectedCert.images.length}
                      </span>
                      <span>
                        {pageIdx === 0
                          ? 'Sertifikat Utama'
                          : 'Lampiran Materi Pelatihan (10 JPL)'}
                      </span>
                    </div>
                  )}
                  <img
                    src={imgSrc}
                    alt={`${selectedCert.title} - Halaman ${pageIdx + 1}`}
                    className="w-full h-auto max-h-[75vh] object-contain rounded-lg border border-white/10"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
