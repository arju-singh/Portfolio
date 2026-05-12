import React, { useMemo } from 'react';

const Background = () => {
    const particles = useMemo(() => (
        Array.from({ length: 60 }, () => {
            const dx = (Math.random() - 0.5) * 200;
            const dy = -Math.random() * 240 - 80;
            const duration = 12 + Math.random() * 18;
            const delay = -Math.random() * duration;
            return {
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                size: 1 + Math.random() * 3,
                dx: `${dx}px`,
                dy: `${dy}px`,
                duration: `${duration}s`,
                delay: `${delay}s`,
                opacity: 0.4 + Math.random() * 0.5
            };
        })
    ), []);

    const winds = useMemo(() => (
        Array.from({ length: 8 }, () => ({
            top: `${Math.random() * 100}%`,
            width: `${100 + Math.random() * 200}px`,
            duration: `${6 + Math.random() * 10}s`,
            delay: `${-Math.random() * 10}s`
        }))
    ), []);

    return (
        <div className="metaverse-bg" aria-hidden="true">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
            <div className="orb orb-4"></div>

            <div className="wind-container">
                {winds.map((w, i) => (
                    <div
                        key={i}
                        className="wind"
                        style={{
                            top: w.top,
                            width: w.width,
                            animationDuration: w.duration,
                            animationDelay: w.delay
                        }}
                    />
                ))}
            </div>

            <div className="particles-layer">
                {particles.map((p, i) => (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            top: p.top,
                            left: p.left,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            opacity: p.opacity,
                            animationDuration: p.duration,
                            animationDelay: p.delay,
                            '--dx': p.dx,
                            '--dy': p.dy
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Background;
