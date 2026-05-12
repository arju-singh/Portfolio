import React, { useState, useEffect, useCallback, useRef } from 'react';

const TESTIMONIALS = [
    {
        title: 'A Genius at Work',
        text: "Arju is a Genius. Her ability to understand complex problems and deliver elegant solutions is unmatched. Building startups together has been one of the best decisions I've made.",
        name: 'Akshay Kotish',
        role: 'Co-Founder, AKLPL',
        initials: 'AK',
        avatarClass: 'av-1'
    },
    {
        title: 'Exceptional Problem Solver',
        text: "Arju's design skills and technical expertise are remarkable. She transformed our ideas into a stunning platform that our users absolutely love. Highly recommended!",
        name: 'Shamandeep Singh',
        role: 'Co-Founder, Land Technology',
        initials: 'SS',
        avatarClass: 'av-2'
    },
    {
        title: 'Talented & Reliable',
        text: "Professional, creative, and incredibly talented. Arju delivered ahead of schedule with quality that exceeded our expectations. A real asset to any project.",
        name: 'Mintu',
        role: 'Cyber Security Expert',
        initials: 'MT',
        avatarClass: 'av-3'
    }
];

const Testimonials = ({ isActive }) => {
    const [index, setIndex] = useState(0);
    const intervalRef = useRef(null);

    const next = useCallback(() => setIndex(i => (i + 1) % TESTIMONIALS.length), []);
    const prev = useCallback(() => setIndex(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length), []);

    useEffect(() => {
        if (!isActive) return;
        intervalRef.current = setInterval(next, 6000);
        return () => clearInterval(intervalRef.current);
    }, [isActive, next]);

    const t = TESTIMONIALS[index];

    return (
        <section id="testimonials" className={`section ${isActive ? 'active' : ''}`}>
            <div className="section-inner">
                <div className="section-header">
                    <div className="section-label">Testimonials</div>
                    <h2 className="section-title">What people say</h2>
                </div>

                <div className="testimonial-stage">
                    <div className="testimonial-card">
                        <div className="quote-icon"><i className="fa-solid fa-quote-left"></i></div>
                        <h3 className="testimonial-title">"{t.title}"</h3>
                        <p className="testimonial-text">{t.text}</p>
                        <div className="author-row">
                            <div className={`author-avatar ${t.avatarClass}`}>{t.initials}</div>
                            <div className="author-info">
                                <div className="name">{t.name}</div>
                                <div className="role">{t.role}</div>
                            </div>
                        </div>
                    </div>

                    <div className="slider-stage">
                        <div className="slider-pill">
                            <button className="slider-btn" onClick={prev} aria-label="Previous">
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>
                            <div className="testimonial-dots">
                                {TESTIMONIALS.map((_, i) => (
                                    <button
                                        key={i}
                                        className={`t-dot ${i === index ? 'active' : ''}`}
                                        onClick={() => setIndex(i)}
                                        aria-label={`Testimonial ${i + 1}`}
                                    />
                                ))}
                            </div>
                            <button className="slider-btn" onClick={next} aria-label="Next">
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
