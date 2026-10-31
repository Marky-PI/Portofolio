import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PROFILE_DATA, type NavSectionId } from '../data/portfolioData';
import { ButtonColorful } from './ButtonColorful';
import { Lanyard3DCard } from './Lanyard3DCard';
import { PdfViewerModal } from './PdfViewerModal';

const CV_PDF_URL = '/assets/aistudio/CV_ATS_7ce604eb.pdf';

interface AboutSectionProps {
  darkMode: boolean;
  onNavigate: (sectionId: NavSectionId) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  darkMode,
  onNavigate,
}) => {
  const [cvModalOpen, setCvModalOpen] = useState(false);

  return (
    <section
      id="about"
      data-sc-act="flow"
      aria-labelledby="about-heading"
      className={`relative overflow-hidden pt-20 sm:pt-28 pb-24 sm:pb-32 px-4 sm:px-8 lg:px-12 xl:px-16 transition-colors duration-300 ${
        darkMode
          ? 'bg-transparent text-zinc-100'
          : 'bg-transparent text-zinc-900'
      }`}
    >
      {/* Seamless top blend from the black Hero section into the continuous BeamsBackground */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-32 z-0 ${
          darkMode
            ? 'bg-gradient-to-b from-[#0a0a0a] to-transparent'
            : 'bg-gradient-to-b from-[#EAEAEF] to-transparent'
        }`}
      />
      <div className="max-w-[1600px] mx-auto">
        {/* 2-Column Editorial Split: Left holds Heading + Description, Right holds Hanging 3D Lanyard from Top Edge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Heading, Narrative & CTA */}
          <div
            data-sc-in
            data-sc-stagger="65"
            className="lg:col-span-7 flex flex-col justify-between space-y-8 pt-2"
          >
            <div
              data-sc-reveal="right"
              data-sc-reveal-at="0.02 0.35"
              className="pb-8 border-b border-current/10"
            >
              <h2
                id="about-heading"
                className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-balance"
              >
                About Me
              </h2>
            </div>

            <div className="space-y-5">
              <p className="font-display text-xl sm:text-2xl font-medium leading-snug tracking-tight">
                {PROFILE_DATA.bioLead}
              </p>
              {PROFILE_DATA.bioParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={`text-sm sm:text-base leading-relaxed ${
                    darkMode ? 'text-zinc-300' : 'text-zinc-600'
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <ButtonColorful
                label="Ringkasan Curriculum Vitae"
                darkMode={darkMode}
                onClick={() => setCvModalOpen(true)}
              />

              <button
                type="button"
                onClick={() => onNavigate('projects')}
                className={`min-h-11 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wide border transition-all duration-200 active:scale-[0.98] cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 ${
                  darkMode
                    ? 'border-white/20 bg-white/[0.04] text-zinc-100 hover:bg-white/10 hover:border-white/35 focus-visible:ring-white/60'
                    : 'border-zinc-900/20 bg-white/60 text-zinc-900 hover:bg-zinc-900/5 hover:border-zinc-900/35 focus-visible:ring-zinc-900/60'
                }`}
              >
                <span>Eksplorasi Karya</span>
                <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column Spacer on Desktop; Full-Width Lanyard Overlay spans the entire About section so dragging never clips */}
          <div
            className="hidden lg:block lg:col-span-5 h-[520px] pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* Full-Bleed 3D Lanyard Layer: spans 100% of the About section width so the lanyard can be dragged anywhere without box clipping */}
        <div className="relative -mx-4 sm:-mx-8 lg:mx-0 lg:absolute lg:inset-x-0 lg:top-0 z-20 pointer-events-none">
          <Lanyard3DCard />
        </div>

        {/* 4-Column Horizontal Row of Domain Proof Cards with Scroll-Craft Count-Up & 3D Tilt */}
        <div
          data-sc-in
          data-sc-stagger="75"
          className="mt-10 pt-10 border-t border-current/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {PROFILE_DATA.metrics.map((metric) => {
            const isFive = metric.value === '5';
            const isGpa = metric.value === '3,79';
            return (
              <div
                key={metric.label}
                data-sc-tilt="6"
                data-sc-spotlight
                className={`rounded-2xl border px-6 py-5 backdrop-blur-md transition-all duration-300 ${
                  darkMode
                    ? 'bg-zinc-900/65 border-white/12 text-zinc-100 hover:border-white/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_12px_30px_rgba(0,0,0,0.35)]'
                    : 'bg-white/90 border-zinc-900/12 text-zinc-950 shadow-sm hover:border-zinc-900/30'
                }`}
              >
                <p className="font-display font-bold text-2xl sm:text-3xl tracking-tight tabular-nums">
                  {isFive ? (
                    <span data-sc-count="0 5" data-sc-count-at="0.12 0.48">
                      5
                    </span>
                  ) : isGpa ? (
                    <span data-sc-count="0 3.79" data-sc-count-at="0.12 0.48">
                      3.79
                    </span>
                  ) : (
                    metric.value
                  )}
                </p>
                <p className="font-sans font-medium text-sm sm:text-base mt-1.5">
                  {metric.label}
                </p>
                <p
                  className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                    darkMode ? 'text-zinc-400' : 'text-zinc-600'
                  }`}
                >
                  {metric.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Curriculum Vitae PDF Viewer Modal */}
      <PdfViewerModal
        open={cvModalOpen}
        onClose={() => setCvModalOpen(false)}
        pdfUrl={CV_PDF_URL}
        title="Mahesa Rizky Putra Irdiansyah"
        darkMode={darkMode}
      />
    </section>
  );
};
