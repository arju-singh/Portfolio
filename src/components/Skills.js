import React from 'react';

const EXPERIENCE = [
    {
        icon: 'fa-solid fa-building-columns',
        color: 'exp-purple',
        title: 'Software Development Intern',
        org: 'Ministry of Housing & Urban Affairs'
    },
    {
        icon: 'fa-solid fa-chalkboard-user',
        color: 'exp-pink',
        title: 'Software Instructor',
        org: 'Mega TechBot'
    },
    {
        icon: 'fa-solid fa-paw',
        color: 'exp-cyan',
        title: 'Founder',
        org: 'PetsCare.Club'
    }
];

const TECH = [
    'fa-brands fa-html5',
    'fa-brands fa-css3-alt',
    'fa-brands fa-js',
    'fa-brands fa-react',
    'fa-brands fa-node',
    'fa-brands fa-git-alt',
    'fa-brands fa-github',
    'fa-brands fa-figma',
    'fa-brands fa-sass',
    'fa-brands fa-python'
];

const Skills = ({ isActive }) => (
    <section id="skills" className={`section ${isActive ? 'active' : ''}`}>
        <div className="section-inner">
            <div className="section-header">
                <div className="section-label">Code &amp; Creations</div>
                <h2 className="section-title">Explore My Work</h2>
            </div>

            <div className="skills-pair">
                <a className="creation-card" href="https://github.com/deadxolo" target="_blank" rel="noopener noreferrer">
                    <div className="creation-icon icon-dark"><i className="fa-brands fa-github"></i></div>
                    <div className="creation-content">
                        <h3>GitHub Profile</h3>
                        <p>Check out my repositories, contributions and open source projects</p>
                        <span className="creation-link">github.com/deadxolo <i className="fa-solid fa-arrow-right"></i></span>
                    </div>
                </a>

                <a className="creation-card" href="https://flappybird.arjusingh.com" target="_blank" rel="noopener noreferrer">
                    <div className="creation-icon icon-pink"><i className="fa-solid fa-gamepad"></i></div>
                    <div className="creation-content">
                        <h3>Flappy Arju</h3>
                        <p>Play my custom Flappy Bird game — a fun side project I built</p>
                        <span className="creation-link">flappybird.arjusingh.com <i className="fa-solid fa-arrow-right"></i></span>
                    </div>
                </a>
            </div>

            <h3 className="work-title">Work Experience</h3>
            <div className="exp-grid">
                {EXPERIENCE.map((e, i) => (
                    <div className="exp-card" key={i}>
                        <div className={`exp-icon ${e.color}`}><i className={e.icon}></i></div>
                        <div className="exp-content">
                            <h5>{e.title}</h5>
                            <div className="org">{e.org}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="tech-strip">
                {TECH.map((icon, i) => (
                    <div className="tech-icon" key={i}><i className={icon}></i></div>
                ))}
            </div>
        </div>
    </section>
);

export default Skills;
