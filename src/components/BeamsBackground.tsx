import React, { useEffect, useRef } from 'react';

export interface AnimatedGradientBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  intensity?: 'subtle' | 'medium' | 'strong';
  darkMode?: boolean;
}

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  tierIndex: number; // 0: medium grey, 1: silver grey, 2: light grey, 3: pure white
  pulse: number;
  pulseSpeed: number;
}

// Monochrome lightness tiers (White & Grey shades)
const DARK_MODE_LIGHTNESS = [52, 68, 84, 98] as const;
const LIGHT_MODE_LIGHTNESS = [22, 32, 42, 54] as const;

// Pre-bake a soft-feathered monochrome beam sprite once per lightness tier
// so the animation loop never needs expensive per-frame ctx.filter="blur(35px)"
function createBeamSprites(darkMode: boolean): HTMLCanvasElement[] {
  const tiers = darkMode ? DARK_MODE_LIGHTNESS : LIGHT_MODE_LIGHTNESS;
  const spriteW = 96;
  const spriteH = 256;

  return tiers.map((lightness) => {
    const offscreen = document.createElement('canvas');
    offscreen.width = spriteW;
    offscreen.height = spriteH;
    const octx = offscreen.getContext('2d');
    if (!octx) return offscreen;

    // 1. Vertical beam intensity profile
    const vGrad = octx.createLinearGradient(0, 0, 0, spriteH);
    vGrad.addColorStop(0, `hsla(0, 0%, ${lightness}%, 0)`);
    vGrad.addColorStop(0.15, `hsla(0, 0%, ${lightness}%, 0.5)`);
    vGrad.addColorStop(0.4, `hsla(0, 0%, ${lightness}%, 1)`);
    vGrad.addColorStop(0.6, `hsla(0, 0%, ${lightness}%, 1)`);
    vGrad.addColorStop(0.85, `hsla(0, 0%, ${lightness}%, 0.5)`);
    vGrad.addColorStop(1, `hsla(0, 0%, ${lightness}%, 0)`);

    octx.fillStyle = vGrad;
    octx.fillRect(0, 0, spriteW, spriteH);

    // 2. Multiply with horizontal soft-feathered edges (replaces runtime Gaussian blur)
    octx.globalCompositeOperation = 'destination-in';
    const hGrad = octx.createLinearGradient(0, 0, spriteW, 0);
    hGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    hGrad.addColorStop(0.22, 'rgba(0, 0, 0, 0.45)');
    hGrad.addColorStop(0.5, 'rgba(0, 0, 0, 1)');
    hGrad.addColorStop(0.78, 'rgba(0, 0, 0, 0.45)');
    hGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    octx.fillStyle = hGrad;
    octx.fillRect(0, 0, spriteW, spriteH);
    octx.globalCompositeOperation = 'source-over';

    return offscreen;
  });
}

function createBeam(width: number, height: number, index: number): Beam {
  const angle = -35 + Math.random() * 10;
  return {
    x: Math.random() * width * 1.4 - width * 0.2,
    y: Math.random() * height * 1.4 - height * 0.2,
    width: 75 + Math.random() * 110,
    length: height * 2.1,
    angle,
    speed: 0.9 + Math.random() * 1.4,
    opacity: 0.11 + Math.random() * 0.15,
    tierIndex: index % 4,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.03 + Math.random() * 0.035,
  };
}

export function BeamsBackground({
  className = '',
  intensity = 'strong',
  darkMode = true,
}: AnimatedGradientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const opacityMultiplier = {
      subtle: 0.65,
      medium: 0.85,
      strong: 1,
    }[intensity];

    // Render at 0.35x viewport resolution — soft beams need zero high-frequency pixels,
    // cutting pixel fill-rate cost by ~90% compared to full-DPR rendering
    const RENDER_SCALE = 0.35;
    const TOTAL_BEAMS = 18;
    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    let logicalW = window.innerWidth;
    let logicalH = window.innerHeight;

    const sprites = createBeamSprites(darkMode);

    const updateCanvasSize = () => {
      logicalW = window.innerWidth;
      logicalH = window.innerHeight;
      canvas.width = Math.max(1, Math.round(logicalW * RENDER_SCALE));
      canvas.height = Math.max(1, Math.round(logicalH * RENDER_SCALE));
      ctx.setTransform(RENDER_SCALE, 0, 0, RENDER_SCALE, 0, 0);

      beamsRef.current = Array.from({ length: TOTAL_BEAMS }, (_, idx) =>
        createBeam(logicalW, logicalH, idx)
      );
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    function resetBeam(beam: Beam, index: number) {
      const column = index % 3;
      const spacing = logicalW / 3;

      beam.y = logicalH + 100;
      beam.x =
        column * spacing +
        spacing / 2 +
        (Math.random() - 0.5) * spacing * 0.5;
      beam.width = 90 + Math.random() * 110;
      beam.speed = 0.8 + Math.random() * 0.7;
      beam.tierIndex = index % 4;
      beam.opacity = 0.14 + Math.random() * 0.12;
      return beam;
    }

    let lastFrameTime = 0;

    function animate(now: number) {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (document.hidden) return;
      if (now - lastFrameTime < FRAME_INTERVAL) return;
      lastFrameTime = now;

      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, logicalW, logicalH);

      const beams = beamsRef.current;
      for (let i = 0; i < beams.length; i++) {
        const beam = beams[i]!;
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;

        if (beam.y + beam.length < -100) {
          resetBeam(beam, i);
        }

        const pulsingOpacity =
          beam.opacity *
          (0.8 + Math.sin(beam.pulse) * 0.2) *
          opacityMultiplier;

        const sprite = sprites[beam.tierIndex];
        if (!sprite) continue;

        ctx.save();
        ctx.translate(beam.x, beam.y);
        ctx.rotate((beam.angle * Math.PI) / 180);
        ctx.globalAlpha = pulsingOpacity;
        ctx.drawImage(sprite, -beam.width / 2, 0, beam.width, beam.length);
        ctx.restore();
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [intensity, darkMode]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden transition-colors duration-500 ${
        darkMode ? 'bg-neutral-950' : 'bg-[#EAEAEF]'
      } ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          filter: 'blur(18px)',
          transform: 'translateZ(0)',
        }}
      />
    </div>
  );
}

export default BeamsBackground;
