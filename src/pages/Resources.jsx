import { motion } from 'motion/react';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import Marquee from '../components/Marquee';
import { RESOURCES, SKILL_GROUPS, PROFILE } from '../data/profile';
import './Resources.css';

export default function Resources() {
  return (
    <div className="resourcespage">
      <PageHero
        index="04"
        eyebrow="Resources"
        title="Take what you need"
        lead="Résumé, profiles and the toolkit — everything you might want before reaching out, in one place."
      />

      <section className="section">
        <div className="wrap">
          <div className="resources__grid">
            {RESOURCES.map((r, i) => (
              <motion.a
                key={r.title}
                className={`resource ${r.download ? 'resource--feature' : ''}`}
                href={r.url}
                target={r.url.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                download={r.download || undefined}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8% 0px' }}
                transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                data-hover
              >
                <span className="resource__tag">{r.tag}</span>
                <h3 className="resource__title">{r.title}</h3>
                <p className="resource__desc">{r.desc}</p>
                <span className="resource__action">
                  {r.action} <span className="arrow">{r.download ? '↓' : '↗'}</span>
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Toolkit marquee */}
      <section className="resourcespage__strip">
        <Marquee items={SKILL_GROUPS.flatMap((g) => g.items)} reverse speed={48} />
      </section>

      {/* Full skill matrix */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <Reveal><p className="eyebrow">Toolkit</p></Reveal>
              <Reveal delay={0.05}><h2>Full skill matrix</h2></Reveal>
            </div>
          </div>
          <div className="resources__matrix">
            {SKILL_GROUPS.map((g, i) => (
              <Reveal key={g.title} delay={(i % 3) * 0.05} className="resources__matrix-col">
                <h3>{g.title}</h3>
                <ul>
                  {g.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="resources__cta">
              <p>Prefer the PDF? Grab the full résumé — it has everything above plus certifications.</p>
              <a className="btn btn--solid" href={PROFILE.resume} download data-hover>
                Download CV <span className="arrow">↓</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
