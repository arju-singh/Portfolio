import React from 'react';

const SantaCap = () => (
    <svg className="santa-cap" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 38 Q8 14 32 10 Q56 14 56 38 Q40 30 32 30 Q24 30 8 38 Z" fill="#ee2d2d" />
        <ellipse cx="32" cy="40" rx="28" ry="4" fill="white" />
        <circle cx="52" cy="14" r="8" fill="white" />
    </svg>
);

const Hero = ({ isActive, goTo }) => (
    <section id="home" className={`section ${isActive ? 'active' : ''}`}>
        <div className="section-inner">
            <div className="hero-content fade-in">
                <p className="hero-greeting">Welcome to</p>
                <h1 className="hero-name">
                    Arju Singh
                    <SantaCap />
                </h1>
                <span className="hero-universe">Universe</span>

                <p className="hero-description">
                    Entrepreneur &amp; Software Engineer | Generative AI Engineer building
                    revolutionary startups with code that speaks
                </p>

                <div className="hero-cta-grid">
                    <button className="hero-cta" onClick={() => goTo('projects')}>
                        <div className="hero-cta-icon icon-orange"><i className="fa-solid fa-rocket"></i></div>
                        <div className="hero-cta-text">
                            <div className="hero-cta-title">Let's see what I build</div>
                            <div className="hero-cta-sub">View Projects</div>
                        </div>
                    </button>
                    <button className="hero-cta" onClick={() => goTo('startups')}>
                        <div className="hero-cta-icon icon-yellow"><i className="fa-solid fa-lightbulb"></i></div>
                        <div className="hero-cta-text">
                            <div className="hero-cta-title">My Ventures</div>
                            <div className="hero-cta-sub">View Startups</div>
                        </div>
                    </button>
                    <button className="hero-cta" onClick={() => goTo('skills')}>
                        <div className="hero-cta-icon icon-purple"><i className="fa-solid fa-code"></i></div>
                        <div className="hero-cta-text">
                            <div className="hero-cta-title">What I know</div>
                            <div className="hero-cta-sub">Skills &amp; Tools</div>
                        </div>
                    </button>
                    <button className="hero-cta" onClick={() => goTo('contact')}>
                        <div className="hero-cta-icon icon-blue"><i className="fa-solid fa-paper-plane"></i></div>
                        <div className="hero-cta-text">
                            <div className="hero-cta-title">How to reach me</div>
                            <div className="hero-cta-sub">Get in Touch</div>
                        </div>
                    </button>
                </div>
            </div>

            <div className="scroll-explore">
                <div className="mouse-icon"></div>
                <span>Scroll to explore</span>
            </div>
        </div>
    </section>
);

export default Hero;
