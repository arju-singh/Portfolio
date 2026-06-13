import { motion } from 'motion/react';

// Scroll-triggered reveal — the signature Framer fade/slide-up.
export default function Reveal({ children, delay = 0, y = 28, as = 'div', once = true, className }) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-12% 0px -10% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

// Per-word/line staggered reveal for headings.
export function RevealText({ text, className, delay = 0, splitBy = ' ' }) {
  const parts = text.split(splitBy);
  return (
    <span className={className} aria-label={text} style={{ display: 'inline' }}>
      {parts.map((part, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '110%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '-8% 0px' }}
            transition={{ duration: 0.85, delay: delay + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            {part}
            {i < parts.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
