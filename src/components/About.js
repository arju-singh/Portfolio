import React from 'react';

const TRAITS = [
    { icon: 'fa-solid fa-brain', label: 'Quick Learner' },
    { icon: 'fa-solid fa-bug', label: 'Debug Expert' },
    { icon: 'fa-solid fa-puzzle-piece', label: 'Problem Solver' },
    { icon: 'fa-solid fa-bolt', label: 'Fast Coder', yellow: true }
];

const STARTUPS = [
    { icon: 'fa-solid fa-paw', name: 'PetsCare.Club' },
    { icon: 'fa-solid fa-globe', name: 'Land.Technology' },
    { icon: 'fa-solid fa-gavel', name: 'Lawms.in' },
    { icon: 'fa-solid fa-futbol', name: 'Kaptaan' }
];

const About = ({ isActive, goTo }) => (
    <section id="about" className={`section ${isActive ? 'active' : ''}`}>
        <div className="section-inner">
            <div className="about-grid">
                <div className="about-photo-wrap">
                    <div className="orbit"></div>
                    <div className="orbit orbit-2"></div>
                    <img src="/assets/IMG_5341.jpg" alt="Arju Singh" className="about-photo" />
                    <div className="float-icon fi-1"><i className="fa-solid fa-rocket"></i></div>
                    <div className="float-icon fi-2"><i className="fa-solid fa-lightbulb"></i></div>
                    <div className="float-icon fi-3"><i className="fa-solid fa-code"></i></div>
                </div>

                <div className="about-content">
                    <div className="section-label left-only">About Me</div>
                    <h2 className="about-title">Entrepreneur &amp; Tech Innovator</h2>

                    <p className="about-text">
                        I'm an <span className="hl-orange">Entrepreneur</span> and{' '}
                        <span className="hl-orange">Software Engineer | Generative AI Engineer</span>{' '}
                        building the future through technology. I'm working on revolutionary startups
                        that are transforming industries, along with my co-founder cum mentor{' '}
                        <span className="hl-pink">Akshay Kotish</span>.
                    </p>
                    <p className="about-text">
                        What sets me apart? I can{' '}
                        <span className="hl-orange">understand complex code in seconds</span> and
                        solve intricate problems with razor-sharp logical thinking. My ability to
                        quickly grasp any codebase and debug issues makes me a powerhouse in development.
                    </p>

                    <div className="trait-grid">
                        {TRAITS.map((t, i) => (
                            <div className="trait-card" key={i}>
                                <i className={`${t.icon} ${t.yellow ? 'trait-icon-yellow' : ''}`}></i>
                                <span>{t.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="about-startups-label">Building Startups</div>
                    <div className="startup-pills">
                        {STARTUPS.map((s, i) => (
                            <button key={i} className="startup-pill" onClick={() => goTo && goTo('startups')}>
                                <i className={s.icon}></i>
                                <span>{s.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default About;
