import React, { useEffect, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { NAV_ITEMS, type NavSectionId } from '../data/portfolioData';

interface NavbarProps {
  activeSection: NavSectionId;
  onNavigate: (sectionId: NavSectionId) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  darkMode,
  onToggleDarkMode,
}) => {
  const [hoveredId, setHoveredId] = useState<NavSectionId | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const brandItem = NAV_ITEMS.find((item) => item.isBrand)!;
  const centerItems = NAV_ITEMS.filter((item) => !item.isBrand && !item.isCta);
  const ctaItem = NAV_ITEMS.find((item) => item.isCta)!;

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: NavSectionId
  ) => {
    e.preventDefault();
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-4 sm:top-6 inset-x-0 z-50 px-4 sm:px-8 lg:px-12 xl:px-16 pointer-events-none">
      <div
        className={`relative overflow-hidden max-w-[1600px] mx-auto pointer-events-auto rounded-[22px] backdrop-blur-2xl backdrop-saturate-[190%] border transition-all duration-300 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sm:gap-8 ${
          darkMode
            ? 'bg-gradient-to-br from-white/[0.14] via-zinc-900/45 to-white/[0.08] border-white/25 text-zinc-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),inset_0_-1px_2px_rgba(255,255,255,0.08),0_16px_40px_rgba(0,0,0,0.55)]'
            : 'bg-gradient-to-br from-white/55 via-white/25 to-white/45 border-white/75 text-zinc-900 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.95),inset_0_-1px_2px_rgba(255,255,255,0.45),0_12px_36px_-4px_rgba(0,0,0,0.10),0_2px_10px_rgba(0,0,0,0.04)]'
        }`}
      >
        {/* Top Specular Liquid Sheen Reflection */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent ${
            darkMode ? 'via-white/50' : 'via-white'
          } to-transparent`}
        />
        {/* Subtle Bottom Caustic Reflection */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-12 bottom-0 h-[1px] bg-gradient-to-r from-transparent ${
            darkMode ? 'via-white/20' : 'via-white/80'
          } to-transparent`}
        />

        {/* Zone 1: Brand (Mahesa) */}
        <a
          href={`#${brandItem.id}`}
          onClick={(e) => handleNavClick(e, brandItem.id)}
          className="relative z-10 group flex items-center gap-3 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4"
          aria-label="Mahesa — Kembali ke Beranda"
        >
          <span
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-serif italic font-bold text-base transition-transform duration-200 group-hover:scale-105 ${
              darkMode
                ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                : 'bg-zinc-950 text-white shadow-sm'
            }`}
          >
            M
          </span>
          <span className="font-display font-bold text-sm sm:text-base tracking-[0.18em] uppercase transition-opacity duration-200 group-hover:opacity-80">
            {brandItem.label}
          </span>
        </a>

        {/* Zone 2: Center Navigation Links (About - Experience - Competencies - Certification - Projects) */}
        <nav
          aria-label="Navigasi Utama Portofolio"
          className="relative z-10 hidden lg:flex items-center gap-1 xl:gap-2"
          onMouseLeave={() => setHoveredId(null)}
        >
          {centerItems.map((item) => {
            const isActive = activeSection === item.id;
            const isHovered = hoveredId === item.id;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={(e) => handleNavClick(e, item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                className={`relative min-h-10 px-3.5 py-2 rounded-xl inline-flex items-center text-xs xl:text-[13px] font-medium tracking-[0.12em] uppercase whitespace-nowrap shrink-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 ${
                  isActive
                    ? darkMode
                      ? 'text-white font-semibold focus-visible:ring-white/60'
                      : 'text-zinc-950 font-semibold focus-visible:ring-zinc-900/60'
                    : darkMode
                      ? 'text-zinc-300 hover:text-white focus-visible:ring-white/60'
                      : 'text-zinc-700 hover:text-zinc-950 focus-visible:ring-zinc-900/60'
                }`}
              >
                {/* Liquid Glass Droplet Hover Pill Indicator */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 rounded-xl transition-all duration-200 ${
                    isHovered
                      ? darkMode
                        ? 'bg-white/15 border border-white/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)] opacity-100 scale-100'
                        : 'bg-white/60 border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_2px_8px_rgba(0,0,0,0.05)] opacity-100 scale-100'
                      : isActive
                        ? darkMode
                          ? 'bg-white/10 border border-white/15 opacity-100 scale-100'
                          : 'bg-white/40 border border-white/60 opacity-100 scale-100'
                        : 'opacity-0 scale-95'
                  }`}
                />

                {/* Menu Text */}
                <span className="relative z-10 inline-block transition-transform duration-200">
                  {item.label}
                </span>

                {/* Smooth Bottom Line Indicator */}
                <span
                  aria-hidden="true"
                  className={`absolute bottom-1 left-3.5 right-3.5 h-[1.5px] transition-transform duration-200 origin-center ${
                    darkMode ? 'bg-zinc-100' : 'bg-zinc-900'
                  } ${
                    isActive || isHovered ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Theme Toggle & Contact Me Button */}
        <div className="relative z-10 flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label={
              darkMode
                ? 'Ubah ke Tema Monokrom Terang'
                : 'Ubah ke Tema Monokrom Gelap'
            }
            aria-pressed={darkMode}
            className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 ${
              darkMode
                ? 'border-white/20 bg-white/10 text-zinc-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] hover:bg-white/20 focus-visible:ring-white/60'
                : 'border-white/80 bg-white/45 text-zinc-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.04)] hover:bg-white/70 focus-visible:ring-zinc-900/60'
            }`}
          >
            {darkMode ? (
              <Sun aria-hidden="true" className="w-4 h-4" />
            ) : (
              <Moon aria-hidden="true" className="w-4 h-4" />
            )}
          </button>

          <a
            href={`#${ctaItem.id}`}
            aria-current={activeSection === ctaItem.id ? 'page' : undefined}
            onClick={(e) => handleNavClick(e, ctaItem.id)}
            className={`hidden sm:inline-flex items-center justify-center min-h-11 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap shrink-0 border transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 ${
              activeSection === ctaItem.id
                ? darkMode
                  ? 'bg-white text-zinc-950 border-white shadow-sm focus-visible:ring-white/60'
                  : 'bg-zinc-950 text-white border-zinc-950 shadow-sm focus-visible:ring-zinc-900/60'
                : darkMode
                  ? 'border-white/30 bg-white/10 text-zinc-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] hover:bg-white hover:text-zinc-950 focus-visible:ring-white/60'
                  : 'border-zinc-900/80 bg-white/35 text-zinc-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)] hover:bg-zinc-950 hover:text-white focus-visible:ring-zinc-900/60'
            }`}
          >
            {ctaItem.label}
          </a>

          {/* Mobile Hamburger Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Tutup Menu Navigasi' : 'Buka Menu Navigasi'}
            aria-expanded={mobileMenuOpen}
            className={`lg:hidden w-11 h-11 rounded-xl border flex items-center justify-center transition-all active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 ${
              darkMode
                ? 'border-white/20 bg-white/10 text-zinc-100 hover:bg-white/20 focus-visible:ring-white/60'
                : 'border-white/80 bg-white/45 text-zinc-900 hover:bg-white/70 focus-visible:ring-zinc-900/60'
            }`}
          >
            {mobileMenuOpen ? (
              <X aria-hidden="true" className="w-4 h-4" />
            ) : (
              <Menu aria-hidden="true" className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Glass Drawer */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden max-w-[1600px] mx-auto mt-2 pointer-events-auto rounded-2xl backdrop-blur-xl border p-4 transition-all ${
            darkMode
              ? 'bg-zinc-900/95 border-white/15 text-zinc-100 shadow-2xl'
              : 'bg-white/95 border-zinc-900/10 text-zinc-900 shadow-xl'
          }`}
        >
          <div className="flex flex-col gap-1">
            {centerItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`min-h-11 px-4 py-2.5 rounded-xl flex items-center text-xs font-semibold tracking-[0.14em] uppercase transition-colors ${
                    isActive
                      ? darkMode
                        ? 'bg-white/15 text-white'
                        : 'bg-zinc-900/10 text-zinc-950'
                      : darkMode
                        ? 'text-zinc-300 hover:bg-white/10'
                        : 'text-zinc-600 hover:bg-zinc-900/5'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
            <a
              href={`#${ctaItem.id}`}
              aria-current={activeSection === ctaItem.id ? 'page' : undefined}
              onClick={(e) => handleNavClick(e, ctaItem.id)}
              className={`mt-2 min-h-11 px-4 py-2.5 rounded-xl flex items-center justify-center text-center text-xs font-semibold tracking-wider uppercase border transition-colors ${
                darkMode
                  ? 'bg-white text-zinc-950 border-white'
                  : 'bg-zinc-950 text-white border-zinc-950'
              }`}
            >
              {ctaItem.label}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
