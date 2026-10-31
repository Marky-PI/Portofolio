import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  type HTMLAttributes,
  type MouseEvent,
  type KeyboardEvent,
} from 'react';
import { motion } from 'motion/react';
import { Maximize2, X } from 'lucide-react';
import {
  ACHIEVEMENTS_CAROUSEL_DATA,
  type AchievementCarouselItem,
} from '../data/portfolioData';

export interface CalendlyCarouselProps extends HTMLAttributes<HTMLDivElement> {
  items: AchievementCarouselItem[];
  autoPlayInterval?: number;
  pauseOnHover?: boolean;
  darkMode?: boolean;
  onInspectItem?: (item: AchievementCarouselItem) => void;
}

type ScreenTier = 'mobile' | 'tablet' | 'desktop';

const VISIBLE_OFFSETS = [-4, -3, -2, -1, 0, 1, 2, 3, 4] as const;

const TRANSITION_SPRING = {
  type: 'spring',
  stiffness: 220,
  damping: 26,
  mass: 0.75,
} as const;

export function CalendlyCarousel({
  items,
  autoPlayInterval = 6000,
  pauseOnHover = true,
  darkMode = true,
  onInspectItem,
  className = '',
  ...props
}: CalendlyCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const elapsedRef = useRef<number>(0);

  const [page, setPage] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [tier, setTier] = useState<ScreenTier>('desktop');
  const [viewportWidth, setViewportWidth] = useState<number>(1200);

  const total = items.length;
  const activeIndex = ((page % total) + total) % total;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setViewportWidth(width);

      if (width < 768) {
        setTier('mobile');
      } else if (width < 1120) {
        setTier('tablet');
      } else {
        setTier('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if ((pauseOnHover && (isHovered || isFocused)) || prefersReducedMotion) {
      lastTimeRef.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }

      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      elapsedRef.current += delta;

      if (elapsedRef.current >= autoPlayInterval) {
        elapsedRef.current = 0;
        lastTimeRef.current = null;
        setProgress(0);
        setPage((curr) => curr + 1);
        return;
      }

      setProgress(Math.min((elapsedRef.current / autoPlayInterval) * 100, 100));
      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      lastTimeRef.current = null;
    };
  }, [page, pauseOnHover, isHovered, isFocused, autoPlayInterval]);

  const handlePrev = useCallback(() => {
    elapsedRef.current = 0;
    lastTimeRef.current = null;
    setProgress(0);
    setPage((curr) => curr - 1);
  }, []);

  const handleNext = useCallback(() => {
    elapsedRef.current = 0;
    lastTimeRef.current = null;
    setProgress(0);
    setPage((curr) => curr + 1);
  }, []);

  const handleSelectTab = (event: MouseEvent<HTMLButtonElement>) => {
    const indexStr = event.currentTarget.dataset.index;

    if (indexStr !== undefined) {
      const targetIdx = Number.parseInt(indexStr, 10);
      let diff = targetIdx - activeIndex;

      if (diff > total / 2) {
        diff -= total;
      } else if (diff < -total / 2) {
        diff += total;
      }

      elapsedRef.current = 0;
      lastTimeRef.current = null;
      setProgress(0);
      setPage((curr) => curr + diff);
    }
  };

  const handleSelectCard = (event: MouseEvent<HTMLDivElement>) => {
    const offsetStr = event.currentTarget.dataset.offset;

    if (offsetStr !== undefined) {
      const offset = Number.parseInt(offsetStr, 10);

      if (offset !== 0) {
        elapsedRef.current = 0;
        lastTimeRef.current = null;
        setProgress(0);
        setPage((curr) => curr + offset);
      }
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      handlePrev();
    } else if (event.key === 'ArrowRight') {
      handleNext();
    }
  };

  const activeDimensions = {
    desktop: { width: 762, height: 513 },
    tablet: { width: 580, height: 470 },
    mobile: { width: Math.min(345, viewportWidth - 48), height: 550 },
  }[tier];

  const cardSurfaceClass = darkMode
    ? 'bg-[#18181D] text-zinc-100 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.4)]'
    : 'bg-white text-zinc-900 border border-zinc-900/10 shadow-[0_10px_30px_rgba(95,109,119,0.08),0_4px_12px_rgba(95,109,119,0.06)]';

  const bridgeColorClass = darkMode ? 'text-[#18181D]' : 'text-white';
  const badgeBgClass = darkMode
    ? 'bg-zinc-800/95 text-zinc-100'
    : 'bg-zinc-100 text-zinc-900';
  const badgeRoleBgClass = darkMode
    ? 'bg-zinc-800/95 text-zinc-400'
    : 'bg-zinc-100 text-zinc-600';
  const badgeConnectorColor = darkMode ? 'text-zinc-800/95' : 'text-zinc-100';

  return (
    <div
      ref={containerRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="My Achievements"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={() => setIsFocused(false)}
      className={`relative w-full max-w-[1240px] mx-auto flex flex-col items-center select-none outline-none focus-visible:ring-2 focus-visible:ring-current/50 rounded-3xl py-4 overflow-hidden ${className}`}
      {...props}
    >
      <div
        id="carousel-view-panel"
        role="tabpanel"
        aria-live="polite"
        className="relative w-full flex items-center justify-center"
        style={{ height: activeDimensions.height }}
      >
        {VISIBLE_OFFSETS.map((offset) => {
          const virtualIndex = page + offset;
          const itemIndex = ((virtualIndex % total) + total) % total;
          const item = items[itemIndex];
          const isActive = offset === 0;

          const getVariant = () => {
            if (tier === 'mobile') {
              const activeW = activeDimensions.width;
              const activeH = activeDimensions.height;
              const gap = 16;
              const peekW = 60;
              const peekH = 410;

              if (offset === 0) {
                return {
                  x: -activeW / 2,
                  y: -activeH / 2,
                  width: activeW,
                  height: activeH,
                  opacity: 1,
                  zIndex: 0,
                  pointerEvents: 'auto' as const,
                };
              }

              if (offset === -1) {
                return {
                  x: -activeW / 2 - gap - peekW,
                  y: -peekH / 2,
                  width: peekW,
                  height: peekH,
                  opacity: 1,
                  zIndex: 100,
                  pointerEvents: 'auto' as const,
                };
              }

              if (offset === 1) {
                return {
                  x: activeW / 2 + gap,
                  y: -peekH / 2,
                  width: peekW,
                  height: peekH,
                  opacity: 1,
                  zIndex: 100,
                  pointerEvents: 'auto' as const,
                };
              }

              return {
                x: offset < 0 ? -activeW / 2 - 220 : activeW / 2 + 220,
                y: -peekH / 2,
                width: peekW,
                height: peekH,
                opacity: 0,
                zIndex: 0,
                pointerEvents: 'none' as const,
              };
            }

            if (tier === 'tablet') {
              const activeW = activeDimensions.width;
              const activeH = activeDimensions.height;
              const gap = 18;
              const sideW = 100;
              const sideH = 340;

              if (offset === 0) {
                return {
                  x: -activeW / 2,
                  y: -activeH / 2,
                  width: activeW,
                  height: activeH,
                  opacity: 1,
                  zIndex: 0,
                  pointerEvents: 'auto' as const,
                };
              }

              if (offset === -1) {
                return {
                  x: -activeW / 2 - gap - sideW,
                  y: -sideH / 2,
                  width: sideW,
                  height: sideH,
                  opacity: 1,
                  zIndex: 100,
                  pointerEvents: 'auto' as const,
                };
              }

              if (offset === 1) {
                return {
                  x: activeW / 2 + gap,
                  y: -sideH / 2,
                  width: sideW,
                  height: sideH,
                  opacity: 1,
                  zIndex: 100,
                  pointerEvents: 'auto' as const,
                };
              }

              return {
                x: offset < 0 ? -activeW / 2 - 240 : activeW / 2 + 240,
                y: -sideH / 2,
                width: 74,
                height: 205,
                opacity: 0,
                zIndex: 0,
                pointerEvents: 'none' as const,
              };
            }

            switch (offset) {
              case 0:
                return {
                  x: -381,
                  y: -256.5,
                  width: 762,
                  height: 513,
                  opacity: 1,
                  zIndex: 0,
                  pointerEvents: 'auto' as const,
                };
              case -1:
                return {
                  x: -506,
                  y: -172,
                  width: 105,
                  height: 344,
                  opacity: 1,
                  zIndex: 100,
                  pointerEvents: 'auto' as const,
                };
              case 1:
                return {
                  x: 401,
                  y: -172,
                  width: 105,
                  height: 344,
                  opacity: 1,
                  zIndex: 100,
                  pointerEvents: 'auto' as const,
                };
              case -2:
                return {
                  x: -596,
                  y: -102.5,
                  width: 74,
                  height: 205,
                  opacity: 1,
                  zIndex: 100,
                  pointerEvents: 'auto' as const,
                };
              case 2:
                return {
                  x: 522,
                  y: -102.5,
                  width: 74,
                  height: 205,
                  opacity: 1,
                  zIndex: 100,
                  pointerEvents: 'auto' as const,
                };
              case -3:
                return {
                  x: -720,
                  y: -102.5,
                  width: 74,
                  height: 205,
                  opacity: 0,
                  zIndex: 0,
                  pointerEvents: 'none' as const,
                };
              case 3:
                return {
                  x: 646,
                  y: -102.5,
                  width: 74,
                  height: 205,
                  opacity: 0,
                  zIndex: 0,
                  pointerEvents: 'none' as const,
                };
              default:
                return {
                  x: offset < 0 ? -860 : 860,
                  y: -102.5,
                  width: 74,
                  height: 205,
                  opacity: 0,
                  zIndex: 0,
                  pointerEvents: 'none' as const,
                };
            }
          };

          return (
            <motion.div
              key={virtualIndex}
              data-offset={offset}
              onClick={handleSelectCard}
              initial={false}
              animate={getVariant()}
              transition={TRANSITION_SPRING}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                willChange: 'transform',
              }}
              className={`rounded-[28px] sm:rounded-[32px] overflow-visible ${cardSurfaceClass} ${
                !isActive ? 'cursor-pointer' : ''
              }`}
            >
              {offset === -1 && (
                <div
                  aria-hidden="true"
                  className={`absolute top-0 bottom-0 flex items-center pointer-events-none z-[100] ${bridgeColorClass}`}
                  style={{
                    width: 22,
                    height: 42,
                    margin: 'auto 0',
                    left: 'calc(100% - 1px)',
                  }}
                >
                  <svg
                    viewBox="0 0 20 37.3338"
                    preserveAspectRatio="none"
                    className="size-full fill-current overflow-visible block"
                  >
                    <path d="M0 0C0 0 1.2422 13.5759 10 13.5759C18.7578 13.5759 20 0 20 0V37.3338C20 37.3338 18.7578 23.7578 10 23.7578C1.2422 23.7578 0 37.3338 0 37.3338V0Z" />
                  </svg>
                </div>
              )}

              {offset === 1 && (
                <div
                  aria-hidden="true"
                  className={`absolute top-0 bottom-0 flex items-center pointer-events-none z-[100] ${bridgeColorClass}`}
                  style={{
                    width: 22,
                    height: 42,
                    margin: 'auto 0',
                    right: 'calc(100% - 1px)',
                  }}
                >
                  <svg
                    viewBox="0 0 20 37.3338"
                    preserveAspectRatio="none"
                    className="size-full fill-current overflow-visible block"
                  >
                    <path d="M0 0C0 0 1.2422 13.5759 10 13.5759C18.7578 13.5759 20 0 20 0V37.3338C20 37.3338 18.7578 23.7578 10 23.7578C1.2422 23.7578 0 37.3338 0 37.3338V0Z" />
                  </svg>
                </div>
              )}

              {offset === -2 && tier === 'desktop' && (
                <div
                  aria-hidden="true"
                  className={`absolute top-0 bottom-0 flex items-center pointer-events-none z-[100] ${bridgeColorClass}`}
                  style={{
                    width: 18,
                    height: 28,
                    margin: 'auto 0',
                    left: 'calc(100% - 1px)',
                  }}
                >
                  <svg
                    viewBox="0 0 16 28"
                    preserveAspectRatio="none"
                    className="size-full fill-current overflow-visible block"
                  >
                    <path d="M0 0C0 0 0.993759 10.1818 8 10.1818C15.0062 10.1818 16 0 16 0V28C16 28 15.0062 17.8182 8 17.8182C0.993759 17.8182 0 28 0 28V0Z" />
                  </svg>
                </div>
              )}

              {offset === 2 && tier === 'desktop' && (
                <div
                  aria-hidden="true"
                  className={`absolute top-0 bottom-0 flex items-center pointer-events-none z-[100] ${bridgeColorClass}`}
                  style={{
                    width: 18,
                    height: 28,
                    margin: 'auto 0',
                    right: 'calc(100% - 1px)',
                  }}
                >
                  <svg
                    viewBox="0 0 16 28"
                    preserveAspectRatio="none"
                    className="size-full fill-current overflow-visible block"
                  >
                    <path d="M0 0C0 0 0.993759 10.1818 8 10.1818C15.0062 10.1818 16 0 16 0V28C16 28 15.0062 17.8182 8 17.8182C0.993759 17.8182 0 28 0 28V0Z" />
                  </svg>
                </div>
              )}

              <div
                className="size-full overflow-hidden relative"
                style={{ borderRadius: 'inherit' }}
              >
                {/* Side Card Thumbnail State */}
                <motion.div
                  initial={false}
                  animate={{ opacity: isActive ? 0 : 1 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className={`absolute inset-0 p-2 ${
                    isActive ? 'pointer-events-none' : ''
                  }`}
                >
                  <div
                    className={`size-full rounded-[20px] sm:rounded-[24px] overflow-hidden relative ${
                      darkMode ? 'bg-zinc-900' : 'bg-zinc-100'
                    }`}
                  >
                    <img
                      alt={item.alt || item.author}
                      src={item.defaultImage}
                      draggable={false}
                      className="size-full object-cover"
                    />
                  </div>
                </motion.div>

                {/* Active Center Card Content State */}
                <div
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                    width: activeDimensions.width,
                    height: activeDimensions.height,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      x: isActive ? 0 : offset < 0 ? -822 : 822,
                    }}
                    transition={TRANSITION_SPRING}
                    className={`size-full flex flex-col md:flex-row p-4 sm:p-5 md:p-6 lg:p-7 gap-3 sm:gap-4 md:gap-6 ${
                      !isActive ? 'pointer-events-none' : ''
                    }`}
                  >
                    <div className="flex-1 min-w-0 flex flex-col items-center md:items-start text-center md:text-left justify-between py-1 gap-2 sm:gap-3">
                      <h3
                        title={item.stat}
                        className="font-display text-base sm:text-xl md:text-2xl font-bold tracking-tight leading-snug w-full"
                      >
                        {item.stat}
                      </h3>

                      <div className="relative w-full min-w-0 my-auto py-1">
                        <span
                          aria-hidden="true"
                          className="font-serif text-xl sm:text-2xl lg:text-3xl opacity-35 absolute right-full top-0 pr-1 select-none pointer-events-none hidden md:inline"
                        >
                          “
                        </span>

                        <p
                          className={`text-xs sm:text-sm leading-relaxed ${
                            darkMode ? 'text-zinc-300' : 'text-zinc-700'
                          }`}
                        >
                          “{item.quote}”
                        </p>
                      </div>

                      <div className="flex min-w-0 w-full max-w-full overflow-hidden items-center md:items-start justify-center md:justify-start">
                        <div className="flex flex-col items-center md:items-start min-w-0 max-w-full">
                          <span
                            className={`w-fit inline-flex items-center justify-center rounded-[4px] font-mono font-medium py-1 px-2.5 text-[11px] sm:text-xs shrink-0 select-none ${badgeBgClass}`}
                          >
                            <span className="whitespace-nowrap font-semibold">
                              {item.author}
                            </span>
                          </span>

                          <div
                            className={`shrink-0 flex items-center justify-center md:justify-start px-3 h-[6px] -my-[1px] relative z-10 ${badgeConnectorColor}`}
                          >
                            <svg
                              className="block shrink-0 fill-current overflow-visible"
                              preserveAspectRatio="none"
                              viewBox="0 -2 14 12"
                              width="14"
                              height="10"
                            >
                              <path d="M0 -2 V0 C0 0 5.09091 0.49688 5.09091 4 C5.09091 7.50312 0 8 0 8 V10 H14 V8 C14 8 8.90909 7.50312 8.90909 4 C8.90909 0.49688 14 0 14 0 V-2 Z" />
                            </svg>
                          </div>

                          <span
                            className={`w-fit inline-flex items-center justify-center rounded-[4px] font-mono font-medium py-1 px-2.5 text-[10px] sm:text-xs max-w-full select-none ${badgeRoleBgClass}`}
                          >
                            <span title={item.role} className="truncate">
                              {item.role}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspectItem?.(item);
                      }}
                      aria-label={`Perbesar dokumen ${item.stat}`}
                      className={`group relative shrink-0 overflow-hidden rounded-[18px] sm:rounded-[22px] w-full md:w-[clamp(180px,40%,300px)] flex-1 md:flex-initial md:h-full max-h-[210px] md:max-h-none cursor-pointer border ${
                        darkMode
                          ? 'bg-zinc-950 border-white/10'
                          : 'bg-zinc-100 border-zinc-900/10'
                      }`}
                    >
                      <img
                        alt={item.alt || item.author}
                        src={item.selectedImage}
                        draggable={false}
                        className="size-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-end justify-end p-2.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider bg-zinc-950/85 text-zinc-100 border border-white/15 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Maximize2 className="w-3 h-3" />
                          <span>Perbesar</span>
                        </span>
                      </div>
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div
        role="tablist"
        aria-label="Daftar Pencapaian"
        className="flex items-center gap-1.5 mt-6"
      >
        {items.map((item, idx) => {
          const isSelected = idx === activeIndex;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              data-index={idx}
              id={`carousel-tab-${idx}`}
              aria-controls="carousel-view-panel"
              onClick={handleSelectTab}
              aria-selected={isSelected}
              aria-label={`Pencapaian ${idx + 1}: ${item.stat}`}
              tabIndex={isSelected ? 0 : -1}
              className={`h-[8px] rounded-[3px] overflow-hidden border-0 p-0 cursor-pointer transition-[width] duration-300 ease-out outline-none ${
                isSelected
                  ? darkMode
                    ? 'w-[80px] bg-zinc-800'
                    : 'w-[80px] bg-zinc-300'
                  : darkMode
                    ? 'w-[8px] bg-zinc-800 hover:bg-zinc-600'
                    : 'w-[8px] bg-zinc-300 hover:bg-zinc-400'
              }`}
            >
              {isSelected && (
                <div
                  className={`h-full rounded-[3px] ${
                    darkMode ? 'bg-white' : 'bg-zinc-950'
                  }`}
                  style={{
                    transformOrigin: '0% 50%',
                    transform: `scaleX(${progress / 100})`,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface ProjectsSectionProps {
  darkMode: boolean;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  darkMode,
}) => {
  const [selectedAchievement, setSelectedAchievement] =
    useState<AchievementCarouselItem | null>(null);

  useEffect(() => {
    if (!selectedAchievement) return;
    const handleEsc = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedAchievement(null);
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleEsc);
    };
  }, [selectedAchievement]);

  return (
    <section
      id="projects"
      data-sc-act="flow"
      aria-labelledby="projects-heading"
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
          className="flex flex-col items-center justify-center text-center pb-10 border-b border-current/10 w-full"
        >
          <h2
            id="projects-heading"
            className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-balance text-center"
          >
            My Achievements
          </h2>
        </div>

        {/* 21st.dev Connected Carousel */}
        <div data-sc-in className="mt-12">
          <CalendlyCarousel
            items={ACHIEVEMENTS_CAROUSEL_DATA}
            autoPlayInterval={6000}
            pauseOnHover={true}
            darkMode={darkMode}
            onInspectItem={(item) => setSelectedAchievement(item)}
          />
        </div>
      </div>

      {/* Fullscreen Lightbox Modal for Hak Cipta Document */}
      {selectedAchievement && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="achievement-modal-title"
          onClick={() => setSelectedAchievement(null)}
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
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-current/10 shrink-0">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest opacity-65">
                  {selectedAchievement.author} · {selectedAchievement.role}
                </p>
                <h3
                  id="achievement-modal-title"
                  className="font-display font-bold text-lg sm:text-xl mt-1"
                >
                  {selectedAchievement.stat}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAchievement(null)}
                aria-label="Tutup Pratinjau Dokumen Hak Cipta"
                className="w-10 h-10 rounded-full border border-current/20 flex items-center justify-center hover:bg-current/10 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2"
              >
                <X aria-hidden="true" className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 overflow-y-auto flex-1 flex items-center justify-center rounded-2xl bg-black/25 p-3">
              <img
                src={selectedAchievement.selectedImage}
                alt={selectedAchievement.alt}
                className="max-h-[75vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
