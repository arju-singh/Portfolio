import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROFILE, STATS } from '../data/profile';
import './AboutSection.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * AboutSection — the image is pinned on the left while the About content scrolls
 * past on the right; once the content finishes, the pin releases and the page
 * scrolls on normally. GSAP ScrollTrigger drives the pin + per-block reveals,
 * kept in sync with the site's Lenis smooth scroll. Stats use react-countup.
 *
 * Pinning is desktop-only; on narrow screens (and reduced-motion) it stacks and
 * scrolls as a normal section.
 */
export default function AboutSection() {
  const root = useRef(null);
  const media = useRef(null);
  const content = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wide = window.matchMedia('(min-width: 901px)').matches;
    if (reduce || !wide) return;

    const lenis = window.__lenis;
    const onScroll = () => ScrollTrigger.update();
    if (lenis) lenis.on('scroll', onScroll);

    const ctx = gsap.context(() => {
      // Pin the image for exactly the distance the taller content needs to
      // finish scrolling past it, then release.
      ScrollTrigger.create({
        trigger: media.current,
        start: 'top top+=110',
        end: () => `+=${Math.max(0, content.current.offsetHeight - media.current.offsetHeight)}`,
        pin: media.current,
        pinSpacing: false,
        invalidateOnRefresh: true,
      });

      // Reveal each content block as it enters the viewport.
      gsap.utils.toArray('[data-about-reveal]', content.current).forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 42,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }, root);

    ScrollTrigger.refresh();

    return () => {
      if (lenis) lenis.off('scroll', onScroll);
      ctx.revert();
    };
  }, []);

  return (
    <section className="section home__about about2" ref={root}>
      <div className="wrap about2__wrap">
        <div className="about2__media-col">
          <div className="about2__media" ref={media}>
            <img src="/images/arju-full.jpg" alt="Arju Singh" loading="lazy" width="1700" height="1275" />
          </div>
        </div>

        <div className="about2__content" ref={content}>
          <p className="eyebrow" data-about-reveal>About</p>
          <h2 className="about2__head display" data-about-reveal>{PROFILE.summary}</h2>

          <div className="about2__stats">
            {STATS.map((s) => (
              <div className="about2__stat" data-about-reveal key={s.label}>
                <strong className="about2__stat-num">
                  <CountUp end={s.value} enableScrollSpy scrollSpyOnce duration={2.2} />
                  {s.suffix}
                </strong>
                <span className="about2__stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          <div data-about-reveal>
            <Link to="/work" className="home__about-link" data-hover>
              See the full journey <span className="arrow">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
