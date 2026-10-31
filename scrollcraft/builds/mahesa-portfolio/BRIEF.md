# BRIEF: Mahesa Rizky Putra I. — Monochrome Editorial Portfolio (Scroll-Craft Rebuild)

Status: Interviewed via interactive user selection + existing verified portfolio data.

## 1. Eight Core Decisions

1. **Vibe (3-5 words)**: Monochrome Clinical Editorial, Tactile, Architectural, Restrained Depth.
2. **Scroll Journey (Section by Section)**:
   - `01 Home (Hero)`: Multi-plane dimensional studio portrait with background lighting, receding outlined marquee, foreground portrait cutout, and floating telemetry cards moving at distinct scroll rates.
   - `02 About`: Editorial narrative wipe reveal + interactive 3D physical lanyard badge + count-up academic/clinical proof cards.
   - `03 My Experience`: Scroll-traced clinical & primary healthcare timeline across 5 healthcare institutions (Puskesmas Poncol & 4 RS PKL).
   - `04 Competencies`: Real-time calibrating capability matrix with scroll-triggered progress bars and 3D tilt cards.
   - `05 Certification`: Searchable verified credential vault with staggered entry and spotlight cards.
   - `06 Projects (Peak)`: Horizontal scroll-driven blueprint rail (`pan` act) showcasing 4 Health Informatics & Web System case studies, with an interactive view mode switch.
   - `07 Contact`: Spotlight-illuminated correspondence desk with magnetic CTA and verifiable message log.
3. **Energy Curve**:
   - Opens with high atmospheric presence (Hero dimensional separation), settles into focused editorial clarity (About & Experience), builds analytical rhythm (Competencies & Certification), peaks in spatial breadth during the Horizontal Blueprint Rail (Projects), and resolves into calm, responsive stillness (Contact).
4. **Feeling Curve (Stage by Stage)**:
   - `Act 1 (Hero)` — **Intrigue**: Four depth planes separate under the visitor's scroll wheel as the portrait advances in front of the giant outlined typography.
   - `Act 2 (About)` — **Tactile Curiosity**: A physical 3D ID lanyard drops and swings while the narrative wipes open and real GPA/practice counters tick up.
   - `Act 3 (Experience)` — **Clinical Trust**: A scroll-driven vertical filament traces down 5 verified hospital and puskesmas placements.
   - `Act 4 (Competencies)` — **Precision**: Technical and analytical proficiency bars calibrate smoothly as they enter view.
   - `Act 5 (Certification)` — **Assurance**: Official credentials assemble cleanly with interactive verification modals.
   - `Act 6 (Projects — THE PEAK)` — **Discovery & Breadth**: Vertical scroll converts into lateral travel across a wide architectural blueprint rail (`data-sc-act="pan"`, `span="3.2"`).
   - `Act 7 (Contact)` — **Resolve**: Motion stops on a grounded correspondence surface with a magnetic submit action.
5. **The Peak**:
   - *"It's the portfolio where the portrait separates into 3D depth layers as you scroll, a physical hospital ID lanyard swings beside the bio, and scrolling down through Projects glides you sideways across an architectural blueprint rail."* (Lives in Act 6 `Projects` with `span="3.2"`).
6. **Tell-Someone Sentence**:
   - *"It's the site where scrolling separates Mahesa's studio portrait in 3D space, traces his hospital medical-record placements along a live scroll spine, and pans sideways across interactive system blueprints."*
7. **Aesthetic Range & Structural Choice**:
   - **Grammar**: Hybrid Chaptered Editorial + Gallery Pan (`Chaptered editorial` with dimensional hero layering and a `pan` showcase act).
   - **Distinct Scenes vs Continuous World**: Distinct editorial chapters with subtle monochrome ground shifts (`#0B0B0D` <-> `#0F0F12`) and hard typographic chapter boundaries.
8. **Supplied Assets**:
   - Studio portrait cutout: `/assets/aistudio/3d152b29-5eee-41c9-91fe-5416a9a09854_23a27462.png`
   - Official CV PDF: `/assets/aistudio/CV_ATS_7ce604eb.pdf`
   - Verified RMIK experience, competency, certification, and project datasets in `src/data/portfolioData.ts`.

## 2. Score Table (Device Per Beat)

| Beat / Act | Section | Device Family | Span / Config | Why This Device |
|---|---|---|---|---|
| 1. Intrigue | `#home` (Hero) | `parallax` + `spotlight` + `kinetic` | `flow` (`105vh`), 4 planes (`-1.35`, `-0.65`, `-0.18`, `+0.42`) | Creates immediate multi-plane depth separation from the first scroll notch |
| 2. Tactile Curiosity | `#about` (About) | `reveal` + `count` + 3D Physics | `flow`, `data-sc-reveal="up"`, `data-sc-count` on metrics | Pairs wipe-revealed narrative and real numeric counters with the interactive 3D lanyard |
| 3. Clinical Trust | `#experience` (Experience) | `flow` (`--sc-p` spine) + `tilt` + `spotlight` | `flow` act publishing `--sc-p` to drive the timeline filament | Visually connects the 5 healthcare placements as a continuous clinical record |
| 4. Precision | `#competencies` (Competencies) | `in` (stagger) + `count` + `tilt` | `data-sc-stagger="65"`, `data-sc-tilt="5"` | Calibrates analytical/technical proficiency numbers on entry without pinning |
| 5. Assurance | `#certification` (Certification) | `reveal` + `in` + `spotlight` | `data-sc-stagger="70"`, `data-sc-spotlight` | Keeps administrative credentials brisk, searchable, and tactile |
| 6. Discovery (PEAK) | `#projects` (Projects) | `pan` + `tilt` + `spotlight` | `data-sc-act="pan"`, `data-sc-span="3.2"`, `data-sc-pan="0.05"` | Lateral travel reads as architectural range and gives the peak the largest scroll span |
| 7. Resolve | `#contact` (Contact) | `spotlight` + `magnet` + `in` | `data-sc-magnet="0.22"`, `data-sc-spotlight` | Stops camera travel and makes the page respond directly to the visitor's cursor |

## 3. Authored Silence & Reduced Motion
- No empty pinned viewports; flow sections directly following the pinned `pan` act use compact top padding so content arrives without dead scroll.
- Under `prefers-reduced-motion: reduce`, parallax transforms collapse, the horizontal `pan` rail becomes a native horizontal snap-scroll region (`overflow-x: auto`), and counters write their final values immediately.
