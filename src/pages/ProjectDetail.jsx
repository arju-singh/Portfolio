import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Mockup from '../components/Mockup';
import Reveal from '../components/Reveal';
import { PROJECTS } from '../data/profile';
import './ProjectDetail.css';

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const idx = PROJECTS.findIndex((p) => p.slug === slug);
  const project = PROJECTS[idx];

  if (!project) {
    return (
      <div className="pdetail pdetail--missing wrap">
        <h1 className="display">Project not found</h1>
        <Link to="/projects" className="btn btn--ghost">← Back to projects</Link>
      </div>
    );
  }

  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  return (
    <div className="pdetail" style={{ '--accent': project.accent }}>
      <div className="pdetail__glow" />
      <div className="wrap pdetail__top">
        <button className="pdetail__back" onClick={() => navigate(-1)} data-hover>
          ← Back
        </button>

        <Reveal as="div">
          <span className="pdetail__cat">{project.category}</span>
        </Reveal>
        <h1 className="pdetail__title display">{project.title}</h1>
        <p className="pdetail__summary">{project.summary}</p>

        <div className="pdetail__actions">
          {project.link && (
            <a className="btn btn--solid" href={project.link} target="_blank" rel="noreferrer" data-hover>
              Visit live site <span className="arrow">↗</span>
            </a>
          )}
          <Link className="btn btn--ghost" to="/projects" data-hover>
            All projects
          </Link>
        </div>
      </div>

      <motion.div
        className="wrap pdetail__visual"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <Mockup kind={project.kind} accent={project.accent} title={project.title} />
      </motion.div>

      <div className="wrap pdetail__grid">
        <div className="pdetail__overview">
          <Reveal><p className="eyebrow">Overview</p></Reveal>
          <Reveal delay={0.05}>
            <p className="pdetail__desc">{project.description}</p>
          </Reveal>
        </div>

        <aside className="pdetail__meta">
          <Reveal>
            <div className="pdetail__metrics">
              {project.metrics.map((m) => (
                <div key={m.v} className="pdetail__metric">
                  <strong>{m.k}</strong>
                  <span>{m.v}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="pdetail__stack">
              <span className="pdetail__stack-label">Stack</span>
              <div className="pdetail__tech">
                {project.tech.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
              <span className="pdetail__year">Year · {project.year}</span>
            </div>
          </Reveal>
        </aside>
      </div>

      <Link to={`/projects/${next.slug}`} className="pdetail__next" data-hover>
        <div className="wrap pdetail__next-inner">
          <span className="eyebrow">Next project</span>
          <span className="pdetail__next-title display">
            {next.title} <span className="arrow">↗</span>
          </span>
        </div>
      </Link>
    </div>
  );
}
