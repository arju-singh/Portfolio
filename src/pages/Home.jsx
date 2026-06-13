import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

// Deferred: the three.js background loads after first paint, never blocking it.
const ParticleField = lazy(() => import('../three/ParticleField'));
import Marquee from '../components/Marquee';
import Reveal, { RevealText } from '../components/Reveal';
import ProjectCard from '../components/ProjectCard';
import AboutSection from '../components/AboutSection';
import { PROFILE, MARQUEE, PROJECTS, SKILL_GROUPS } from '../data/profile';
import './Home.css';

export default function Home() {
  const featured = PROJECTS.slice(0, 4);

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <Suspense fallback={null}>
          <ParticleField color="#c8ff4d" />
        </Suspense>
        <div className="hero__overlay" />
        <div className="wrap hero__inner">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Available for work
          </motion.p>

          <h1 className="hero__title display">
            <RevealText text="Arju Singh" delay={0.25} />
          </h1>

          <div className="hero__roles">
            {PROFILE.roles.map((r, i) => (
              <motion.span
                key={r}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
              >
                {r}
                {i < PROFILE.roles.length - 1 && <i className="hero__sep">/</i>}
              </motion.span>
            ))}
          </div>

          <motion.p
            className="hero__lead"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
          >
            {PROFILE.tagline}
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.7 }}
          >
            <Link to="/projects" className="btn btn--solid" data-hover>
              View work <span className="arrow">↗</span>
            </Link>
            <Link to="/contact" className="btn btn--ghost" data-hover>
              Get in touch
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="hero__scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <span>Scroll</span>
          <i />
        </motion.div>
      </section>

      {/* MARQUEE */}
      <section className="home__marquee">
        <Marquee items={MARQUEE} speed={42} />
      </section>

      {/* ABOUT + STATS — pinned image, scrolling content (GSAP ScrollTrigger) */}
      <AboutSection />

      {/* SKILLS STRIP */}
      <section className="section home__skills">
        <div className="wrap">
          <div className="section-head">
            <div>
              <Reveal><p className="eyebrow">Capabilities</p></Reveal>
              <Reveal delay={0.05}><h2>What I work with</h2></Reveal>
            </div>
            <Reveal delay={0.1}>
              <p>A full-stack toolkit — from MERN product engineering to generative-AI integrations and design.</p>
            </Reveal>
          </div>
          <div className="home__skills-grid">
            {SKILL_GROUPS.map((g, i) => (
              <Reveal key={g.title} delay={(i % 3) * 0.06} className="home__skill">
                <h3>{g.title}</h3>
                <ul>
                  {g.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className="section home__work">
        <div className="wrap">
          <div className="section-head">
            <div>
              <Reveal><p className="eyebrow">Selected work</p></Reveal>
              <Reveal delay={0.05}><h2>Featured projects</h2></Reveal>
            </div>
            <Reveal delay={0.1}>
              <Link to="/projects" className="btn btn--ghost" data-hover>
                All projects <span className="arrow">↗</span>
              </Link>
            </Reveal>
          </div>

          <div className="home__work-grid">
            {featured.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
