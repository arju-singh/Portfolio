# Arju Singh — Portfolio

A Framer-style portfolio built with **React + Vite**, **motion** (Framer Motion),
**three.js**, and **react-countup**. Scroll-triggered reveals, an infinite CSS
marquee, animated counters, a generative Web Audio ambient layer, and styled-JSX
app mockups (no PNG screenshots).

## Stack

- **React 18 + React Router** — multi-page SPA with animated page transitions
- **motion/react** — `whileInView` reveals, layout animations, page transitions
- **three.js** — animated particle/wave hero background (`src/three/ParticleField.jsx`)
- **react-countup** — scroll-spy stat counters
- **Web Audio API** — generative ambient engine + live analyser visualizer (`src/hooks/SoundContext.jsx`)
- **Lenis** — smooth scroll (`src/hooks/useLenis.js`)
- Custom bespoke ring cursor (`src/components/Cursor.jsx`)

## Pages

| Route | Page |
| --- | --- |
| `/` | Home — hero, marquee, about + stats, capabilities, featured work |
| `/work` | Experience timeline, education, certifications |
| `/projects` | Filterable project grid |
| `/projects/:slug` | Project detail with mockup |
| `/sound` | Interactive Web Audio experience + playable pad |
| `/resources` | Résumé/CV download, profiles, full skill matrix |
| `/contact` | Contact details + mailto form |

## Run

```bash
npm install
npm run dev      # http://localhost:3479
npm run build
npm run preview
```

## Content

Everything is data-driven from **`src/data/profile.js`** — profile, stats, skills,
experience, projects, certifications and resources. Edit that one file to update the
whole site. The résumé PDF lives at `public/Arju_Singh_CV.pdf`.

## Notes

- Respects `prefers-reduced-motion` (smooth scroll, three.js wave and reveals back off).
- The custom cursor and three.js layer disable themselves on touch / coarse pointers.
- The mockup "app screenshots" are real styled JSX (`src/components/Mockup.jsx`), not images.
- No audio files — the ambient layer is synthesized live with the Web Audio API.
