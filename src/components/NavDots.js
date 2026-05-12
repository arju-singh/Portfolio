import React from 'react';

const NavDots = ({ sections, activeId, onSelect }) => (
    <nav className="nav-dots" aria-label="Section navigation">
        {sections.map((s) => (
            <button
                key={s.id}
                className={`nav-dot ${activeId === s.id ? 'active' : ''}`}
                data-label={s.label}
                onClick={() => onSelect(s.id)}
                aria-label={`Go to ${s.label}`}
                aria-current={activeId === s.id ? 'true' : 'false'}
            />
        ))}
    </nav>
);

export default NavDots;
