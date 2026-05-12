import React from 'react';

const STARTUPS = [
    {
        icon: 'fa-solid fa-paw',
        color: 'sl-1',
        name: 'PetsCare.Club',
        status: 'Live',
        url: 'https://petscare.club',
        description: 'Pet care platform connecting owners with vets, groomers & pet communities.'
    },
    {
        icon: 'fa-solid fa-building',
        color: 'sl-2',
        name: 'Land.Technology',
        status: 'Live',
        url: 'https://land.technology',
        description: 'PropTech platform with AI valuations, virtual tours & property management.'
    },
    {
        icon: 'fa-solid fa-gavel',
        color: 'sl-3',
        name: 'Lawms.in',
        status: 'Live',
        url: 'https://lawms.in',
        description: 'Legal management system with case tracking, document automation & billing.'
    },
    {
        icon: 'fa-solid fa-futbol',
        color: 'sl-4',
        name: 'Kaptaan',
        status: 'Beta',
        url: '#',
        description: 'Fantasy sports platform with real-time analytics & multiplayer leagues.'
    }
];

const Startups = ({ isActive }) => (
    <section id="startups" className={`section ${isActive ? 'active' : ''}`}>
        <div className="section-inner">
            <div className="section-header">
                <div className="section-label">My Ventures</div>
                <h2 className="section-title">Startups</h2>
            </div>

            <div className="startups-grid">
                {STARTUPS.map((s, i) => (
                    <a
                        className="startup-card"
                        key={i}
                        href={s.url}
                        target={s.url.startsWith('http') ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                    >
                        <div className={`startup-logo ${s.color}`}><i className={s.icon}></i></div>
                        <div className="startup-content">
                            <h3>{s.name}</h3>
                            <p>{s.description}</p>
                        </div>
                        <span className={`status-badge ${s.status === 'Live' ? 'status-live' : 'status-beta'}`}>
                            {s.status}
                        </span>
                    </a>
                ))}
            </div>
        </div>
    </section>
);

export default Startups;
