import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Mockup from './Mockup';
import './ProjectCard.css';

export default function ProjectCard({ project, index = 0 }) {
  return (
    <motion.article
      className="pcard"
      style={{ '--accent': project.accent }}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.7, delay: (index % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/projects/${project.slug}`} className="pcard__link" data-hover>
        <div className="pcard__visual">
          <Mockup kind={project.kind} accent={project.accent} title={project.title} />
          <span className="pcard__year">{project.year}</span>
        </div>
        <div className="pcard__meta">
          <div className="pcard__top">
            <span className="pcard__cat">{project.category}</span>
            <span className="pcard__go arrow">↗</span>
          </div>
          <h3 className="pcard__title">{project.title}</h3>
          <p className="pcard__summary">{project.summary}</p>
          <div className="pcard__tech">
            {project.tech.slice(0, 4).map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
