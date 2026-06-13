import { NavLink, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useState } from 'react';
import { PROFILE } from '../data/profile';
import { useSound } from '../hooks/SoundContext';
import AvatarLiquid from '../three/AvatarLiquid';
import './Header.css';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/work', label: 'Work' },
  { to: '/projects', label: 'Projects' },
  { to: '/resources', label: 'Resources' },
  { to: '/contact', label: 'Contact' }
];

export default function Header() {
  const { blip } = useSound();
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      className="header"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
    >
      <div className="header__inner">
        <Link to="/" className="header__brand" onClick={() => blip(660)}>
          <span className="header__avatar">
            <AvatarLiquid src="/images/arju.jpg" alt="Arju Singh" />
          </span>
          <span className="header__name">{PROFILE.name}</span>
        </Link>

        <nav className={`header__nav ${open ? 'is-open' : ''}`}>
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              onClick={() => {
                setOpen(false);
                blip(720);
              }}
              className={({ isActive }) => `header__link ${isActive ? 'is-active' : ''}`}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">
          <button
            className={`burger ${open ? 'is-open' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <span /><span />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
