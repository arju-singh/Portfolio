import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PageHero from '../components/PageHero';
import ProjectCard from '../components/ProjectCard';
import { PROJECTS } from '../data/profile';
import './Projects.css';

const FILTERS = ['All', 'Live Startup', 'Key Project'];

export default function Projects() {
  const [filter, setFilter] = useState('All');

  const list = useMemo(() => {
    if (filter === 'All') return PROJECTS;
    return PROJECTS.filter((p) => p.category.startsWith(filter));
  }, [filter]);

  return (
    <div className="projectspage">
      <PageHero
        index="02"
        eyebrow="Projects"
        title="Things I built"
        lead="Live startups and a set of key projects — each shipped end-to-end, from product strategy and UI/UX through full-stack engineering and AI."
      />

      <section className="section">
        <div className="wrap">
          <div className="projects__filters">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`projects__filter ${filter === f ? 'is-active' : ''}`}
                onClick={() => setFilter(f)}
                data-hover
              >
                {f}
                <span className="projects__count">
                  {f === 'All' ? PROJECTS.length : PROJECTS.filter((p) => p.category.startsWith(f)).length}
                </span>
              </button>
            ))}
          </div>

          <motion.div layout className="projects__grid">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <motion.div
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProjectCard project={p} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
