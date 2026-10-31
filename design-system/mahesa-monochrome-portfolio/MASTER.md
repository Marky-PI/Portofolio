# Design System Master — Mahesa Monochrome Portfolio

> Generated & persisted via **UI/UX Pro Max (`ui-ux-pro-max`)** Design Intelligence Skill.
> **Scope**: Global Source of Truth across all 7 portfolio sections (`Home`, `About`, `Experience`, `Competencies`, `Certification`, `Projects`, `Contact`).

---

## 1. Product & Visual Direction
- **Product Type**: Personal & Clinical Health Informatics Portfolio (`Rekam Medis & Informasi Kesehatan`)
- **Primary Style**: **Minimalism & Swiss Style** + **Dark Mode (OLED)** + **Liquid Glass Chrome**
- **Secondary Style**: **Motion-Driven (Scroll-Craft)** + **Accessible & Ethical (WCAG 2.2 AA)**
- **Core Aesthetic**: Studio monochrome palette with high-contrast editorial typography, specular glass surfaces, grayscale clinical photography, and restrained physics/scroll choreography.

---

## 2. Color & Surface Tokens

| Token Role | Dark Mode (Default OLED) | Light Mode (Monochrome Editorial) | Contrast Target |
| :--- | :--- | :--- | :--- |
| **Canvas Base** | `#000000` / `#09090B` (`neutral-950`) | `#EAEAEF` / `#FFFFFF` | — |
| **Elevated Card Surface** | `rgba(24, 24, 27, 0.68)` (`bg-zinc-900/65`) + `backdrop-blur-md` | `rgba(255, 255, 255, 0.88)` (`bg-white/90`) + `backdrop-blur-md` | Surface separation |
| **Modal / Floating Surface** | `#09090B` (`bg-zinc-950`) + `border-white/20` | `#FFFFFF` (`bg-white`) + `border-zinc-900/15` | Scrim `bg-black/80 backdrop-blur-md` |
| **Primary Text** | `#F4F4F5` (`text-zinc-100`) / `#FFFFFF` | `#18181B` (`text-zinc-900`) / `#09090B` | ≥ 12:1 (AAA) |
| **Secondary Body Text** | `#D4D4D8` (`text-zinc-300`) | `#3F3F46` (`text-zinc-700`) | ≥ 7:1 (AAA) |
| **Muted Metadata / Mono** | `#A1A1AA` (`text-zinc-400`) | `#52525B` (`text-zinc-600`) | ≥ 4.5:1 (AA) |
| **Hairline Border** | `rgba(255, 255, 255, 0.14)` (`border-white/15`) | `rgba(24, 24, 27, 0.12)` (`border-zinc-900/12`) | 3:1 interactive boundary |
| **Hover Border** | `rgba(255, 255, 255, 0.35)` (`border-white/35`) | `rgba(24, 24, 27, 0.30)` (`border-zinc-900/30`) | Clear hover state |
| **Semantic Error** | `#F87171` (`text-red-400`) / `#EF4444` | `#DC2626` (`text-red-600`) | ≥ 4.5:1 + `role="alert"` |

---

## 3. Typography System

- **Display & Headings (`--font-display`)**: `Montserrat`, sans-serif (`font-bold` 700 / `font-extrabold` 800, `tracking-tight`, `text-balance`).
- **Body & UI Controls (`--font-sans`)**: `Helvetica`, `Helvetica Neue`, `Arial`, sans-serif (`font-normal` 400 / `font-medium` 500, `leading-relaxed` 1.625).
- **Technical Telemetry & Metadata (`--font-mono`)**: `JetBrains Mono`, monospace (`uppercase`, `tracking-widest`, `tabular-nums`).

---

## 4. Layout, Spacing & Touch Ergonomics

- **Container Max Width**: `max-w-[1600px] mx-auto` with adaptive horizontal gutters `px-4 sm:px-8 lg:px-12 xl:px-16`.
- **Section Vertical Rhythm**: `py-24 sm:py-32` with `pb-10 border-b border-current/10` header dividers.
- **Touch Target Minimum**: All interactive buttons, icon controls, filter pills, and form inputs maintain ≥ `44×44px` (`min-h-11`) hit area and `touch-action: manipulation`.
- **Card Radius Scale**:
  - Feature / Showcase Cards & Modals: `rounded-3xl` (`24px`)
  - Secondary Content / Form Cards: `rounded-2xl` (`16px`)
  - Buttons & Inputs: `rounded-xl` (`12px`)

---

## 5. Accessibility & Motion Standards (UI/UX Pro Max Priority 1–3)

1. **Keyboard Navigation**: Skip-to-content link (`#main-content`), visible `:focus-visible` rings (`focus-visible:ring-2`), and `Escape` key dismissal on all modals/drawers.
2. **Reduced Motion**: Respect `prefers-reduced-motion: reduce` across CSS marquees, carousels, and transitions.
3. **Form Semantics**: Explicit `<label htmlFor>`, `autoComplete`, `aria-invalid`, and `aria-describedby` linked to inline error messages.
4. **Decorative vs Meaningful Icons**: Decorative icons beside text carry `aria-hidden="true"`; standalone icon buttons provide descriptive `aria-label`.
