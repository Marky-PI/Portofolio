import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { NAV_ITEMS, PROFILE_DATA, type NavSectionId } from './data/portfolioData';
import { interpolateScrollY } from './utils/portfolioLogic';
import { Navbar } from './components/Navbar';
import { ScrollCraftHud } from './components/ScrollCraftHud';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ExperienceSection } from './components/ExperienceSection';
import { CompetenciesSection } from './components/CompetenciesSection';
import { CertificationSection } from './components/CertificationSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ContactSection } from './components/ContactSection';
import { BeamsBackground } from './components/BeamsBackground';

declare global {
  interface Window {
    ScrollCraft?: {
      mount: (
        root?: Document | Element | string,
        opts?: { lerp?: number }
      ) => {
        layout: () => void;
        read: () => void;
        destroy: () => void;
      };
    };
  }
}

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSectionId>('home');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const isAnimatingScrollRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Mount & synchronize the Scroll-Craft engine with React lifecycle
  useEffect(() => {
    let instance: ReturnType<NonNullable<typeof window.ScrollCraft>['mount']> | null =
      null;

    const mountEngine = () => {
      if (instance) {
        instance.destroy();
        instance = null;
      }
      if (window.ScrollCraft) {
        instance = window.ScrollCraft.mount(document);
      }
    };

    mountEngine();

    const handleRefresh = () => {
      if (instance) {
        instance.layout();
      } else {
        mountEngine();
      }
    };

    window.addEventListener('sc:refresh', handleRefresh);
    return () => {
      window.removeEventListener('sc:refresh', handleRefresh);
      if (instance) {
        instance.destroy();
      }
    };
  }, [darkMode]);

  useEffect(() => {
    const sectionIds: NavSectionId[] = NAV_ITEMS.map((item) => item.id);
    const handleScroll = () => {
      if (isAnimatingScrollRef.current) return;
      const scrollPosition = window.scrollY + 240;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection((prev) => (prev === id ? prev : id));
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const handleNavigate = (sectionId: NavSectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (!element) return;

    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    const startY = window.scrollY;
    const rect = element.getBoundingClientRect();
    const rawTargetY = sectionId === 'home' ? 0 : Math.max(0, startY + rect.top);
    const maxScrollY = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
    const targetY = Math.min(rawTargetY, maxScrollY);
    const distance = Math.abs(targetY - startY);

    if (distance < 4) {
      window.scrollTo(0, targetY);
      return;
    }

    // Dynamic duration between 650ms and 1050ms based on scroll distance
    const duration = Math.min(1050, Math.max(650, distance * 0.35));
    const startTime = performance.now();
    isAnimatingScrollRef.current = true;

    // Temporarily disable native CSS scroll-smooth so custom RAF easing is butter-smooth
    const htmlEl = document.documentElement;
    const prevScrollBehavior = htmlEl.style.scrollBehavior;
    htmlEl.style.scrollBehavior = 'auto';

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const nextY = interpolateScrollY(startY, targetY, progress);

      window.scrollTo(0, nextY);

      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(step);
      } else {
        window.scrollTo(0, targetY);
        htmlEl.style.scrollBehavior = prevScrollBehavior;
        isAnimatingScrollRef.current = false;
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = requestAnimationFrame(step);
  };

  return (
    <div
      className={`relative min-h-screen font-sans transition-colors duration-300 ${
        darkMode ? 'bg-neutral-950 text-zinc-100' : 'bg-[#EAEAEF] text-zinc-900'
      }`}
    >
      {/* UI/UX Pro Max Skip-to-Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2.5 focus:rounded-xl focus:bg-white focus:text-zinc-950 focus:font-semibold focus:text-xs focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-zinc-400"
      >
        Lewati ke Konten Utama
      </a>

      {/* 21st.dev Continuous Fixed Beams Background Layer */}
      <BeamsBackground darkMode={darkMode} intensity="strong" />

      {/* Scroll-Craft Progress Ribbon, Studio Grain & Right-Edge Telemetry Spine */}
      <ScrollCraftHud
        activeSection={activeSection}
        darkMode={darkMode}
        onNavigate={handleNavigate}
      />

      {/* Persistent Liquid Glass Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
      />

      {/* Main Content Sections */}
      <main id="main-content" tabIndex={-1} className="relative z-10 outline-none">
        <HeroSection darkMode={darkMode} onNavigate={handleNavigate} />
        <AboutSection darkMode={darkMode} onNavigate={handleNavigate} />
        <ExperienceSection darkMode={darkMode} />
        <CompetenciesSection darkMode={darkMode} />
        <CertificationSection darkMode={darkMode} />
        <ProjectsSection darkMode={darkMode} />
        <ContactSection darkMode={darkMode} />
      </main>

      {/* Clean Monochrome Editorial Footer */}
      <footer
        className={`relative z-10 py-10 px-4 sm:px-8 lg:px-12 xl:px-16 transition-colors duration-300 ${
          darkMode ? 'bg-transparent text-zinc-400' : 'bg-transparent text-zinc-600'
        }`}
      >
        <div className="max-w-[1600px] mx-auto pt-8 border-t border-current/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-current tracking-wide">
              {PROFILE_DATA.fullName}
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleNavigate('home')}
            className={`min-h-11 px-4 py-2 rounded-xl border inline-flex items-center gap-2 font-mono uppercase tracking-wider transition-all duration-200 active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 ${
              darkMode
                ? 'border-white/15 text-zinc-300 hover:text-white hover:bg-white/10 focus-visible:ring-white/60'
                : 'border-zinc-900/15 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-900/5 focus-visible:ring-zinc-900/60'
            }`}
          >
            <span>Kembali ke Atas</span>
            <ArrowUp aria-hidden="true" className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </div>
  );
}
