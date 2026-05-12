import React, { useState, useCallback, useEffect, useRef } from 'react';
import './App.css';
import Background from './components/Background';
import TopBar from './components/TopBar';
import NavDots from './components/NavDots';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Startups from './components/Startups';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

const SECTIONS = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'startups', label: 'Startups' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'contact', label: 'Contact' }
];

const NAV_COOLDOWN = 800;

function App() {
    const [activeId, setActiveId] = useState('home');
    const lastNavRef = useRef(0);
    const touchStartRef = useRef(null);

    const goTo = useCallback((id) => {
        if (SECTIONS.some(s => s.id === id)) {
            setActiveId(id);
            lastNavRef.current = Date.now();
        }
    }, []);

    const advance = useCallback((dir) => {
        const now = Date.now();
        if (now - lastNavRef.current < NAV_COOLDOWN) return;
        setActiveId(curr => {
            const idx = SECTIONS.findIndex(s => s.id === curr);
            const next = idx + dir;
            if (next < 0 || next >= SECTIONS.length) return curr;
            lastNavRef.current = now;
            return SECTIONS[next].id;
        });
    }, []);

    useEffect(() => {
        const isInnerScrollable = (target) => {
            let el = target;
            while (el && el !== document.body) {
                if (el.classList && el.classList.contains('section')) {
                    return el.scrollHeight > el.clientHeight + 4;
                }
                el = el.parentElement;
            }
            return false;
        };

        const atInnerEdge = (target, dir) => {
            let el = target;
            while (el && el !== document.body) {
                if (el.classList && el.classList.contains('section')) {
                    if (dir > 0) return el.scrollTop + el.clientHeight >= el.scrollHeight - 4;
                    return el.scrollTop <= 4;
                }
                el = el.parentElement;
            }
            return true;
        };

        const handleWheel = (e) => {
            if (Math.abs(e.deltaY) < 8) return;
            const dir = e.deltaY > 0 ? 1 : -1;
            if (isInnerScrollable(e.target) && !atInnerEdge(e.target, dir)) return;
            e.preventDefault();
            advance(dir);
        };

        const handleKey = (e) => {
            if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); advance(1); }
            else if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); advance(-1); }
            else if (e.key === 'Home') { e.preventDefault(); setActiveId(SECTIONS[0].id); lastNavRef.current = Date.now(); }
            else if (e.key === 'End') { e.preventDefault(); setActiveId(SECTIONS[SECTIONS.length - 1].id); lastNavRef.current = Date.now(); }
        };

        const handleTouchStart = (e) => {
            touchStartRef.current = e.touches[0].clientY;
        };
        const handleTouchEnd = (e) => {
            if (touchStartRef.current == null) return;
            const dy = touchStartRef.current - e.changedTouches[0].clientY;
            touchStartRef.current = null;
            if (Math.abs(dy) < 60) return;
            if (isInnerScrollable(e.target) && !atInnerEdge(e.target, dy > 0 ? 1 : -1)) return;
            advance(dy > 0 ? 1 : -1);
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('keydown', handleKey);
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('keydown', handleKey);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [advance]);

    return (
        <div className="App">
            <Background />
            <TopBar onLogoClick={() => goTo('home')} />
            <NavDots sections={SECTIONS} activeId={activeId} onSelect={goTo} />

            <main className="sections">
                <Hero isActive={activeId === 'home'} goTo={goTo} />
                <About isActive={activeId === 'about'} goTo={goTo} />
                <Skills isActive={activeId === 'skills'} />
                <Projects isActive={activeId === 'projects'} />
                <Startups isActive={activeId === 'startups'} />
                <Testimonials isActive={activeId === 'testimonials'} />
                <Contact isActive={activeId === 'contact'} />
            </main>

            <Footer />
        </div>
    );
}

export default App;
