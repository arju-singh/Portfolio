import { Link } from 'react-router-dom';
import { PROFILE } from '../data/profile';
import Logo from './Logo';
import './Footer.css';

export default function Footer() {
  const year = 2026;
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__cta">
          <Link to="/" className="footer__logo" aria-label="Home">
            <Logo size={52} withWord />
          </Link>
          <Link className="footer__big-link" to="/contact" data-hover>
            <span className="eyebrow">Open to opportunities</span>
            <span className="footer__big display">
              Let’s build<br />something. <span className="arrow">↗</span>
            </span>
          </Link>
        </div>

        <div className="footer__grid">
          <div className="footer__col">
            <span className="footer__label">Sitemap</span>
            <Link to="/work">Work</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/resources">Resources</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer__col">
            <span className="footer__label">Elsewhere</span>
            {PROFILE.socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer">
                {s.label} <span className="arrow">↗</span>
              </a>
            ))}
          </div>
          <div className="footer__col">
            <span className="footer__label">Contact</span>
            <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            <a href={`tel:${PROFILE.phone.replace(/\s/g, '')}`}>{PROFILE.phone}</a>
            <span className="muted">{PROFILE.location}</span>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {year} {PROFILE.name}. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
