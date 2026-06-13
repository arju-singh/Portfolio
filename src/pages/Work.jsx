import { motion } from 'motion/react';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import { EXPERIENCE, EDUCATION, CERTIFICATIONS } from '../data/profile';
import './Work.css';

export default function Work() {
  return (
    <div className="workpage">
      <PageHero
        index="01"
        eyebrow="Experience"
        title="The work"
        lead="Five years across product engineering, founding startups, government tech and teaching — building and shipping real software end-to-end."
      />

      <section className="section">
        <div className="wrap">
          <ol className="timeline">
            {EXPERIENCE.map((job, i) => (
              <motion.li
                key={job.company}
                className="timeline__item"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="timeline__period">
                  <span>{job.period}</span>
                  <span className="timeline__loc">{job.location}</span>
                </div>
                <div className="timeline__body">
                  <div className="timeline__marker" aria-hidden="true" />
                  <h3 className="timeline__role">{job.role}</h3>
                  <p className="timeline__company">{job.company}</p>
                  <ul className="timeline__points">
                    {job.points.map((p, k) => (
                      <li key={k}>{p}</li>
                    ))}
                  </ul>
                  <div className="timeline__tech">
                    {job.tech.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Education + Certs */}
      <section className="section workpage__edu">
        <div className="wrap workpage__edu-grid">
          <div>
            <Reveal><p className="eyebrow">Education</p></Reveal>
            <Reveal delay={0.05}>
              <div className="edu-card">
                <h3>{EDUCATION.degree}</h3>
                <p className="muted">{EDUCATION.school}</p>
                <span className="edu-card__period">{EDUCATION.period}</span>
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal><p className="eyebrow">Certifications & awards</p></Reveal>
            <ul className="cert-list">
              {CERTIFICATIONS.map((c, i) => (
                <Reveal key={c.title} delay={i * 0.06} as="li">
                  <a className="cert" href={c.url} target="_blank" rel="noreferrer" data-hover>
                    <div>
                      <h4>{c.title}</h4>
                      <p className="muted">{c.issuer}</p>
                      {c.id && <span className="cert__id">ID · {c.id}</span>}
                    </div>
                    <div className="cert__right">
                      <span className="cert__date">{c.date}</span>
                      <span className="arrow">↗</span>
                    </div>
                  </a>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
