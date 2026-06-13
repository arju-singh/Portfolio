import { motion } from 'motion/react';
import { RevealText } from './Reveal';
import './PageHero.css';

export default function PageHero({ eyebrow, title, lead, index, image, imageAlt = '' }) {
  return (
    <header className="phero">
      <div className="wrap">
        {index && <span className="phero__index">{index}</span>}
        {image && (
          <motion.div
            className="phero__media"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={image} alt={imageAlt} loading="lazy" width="640" height="640" />
          </motion.div>
        )}
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {eyebrow}
        </motion.p>
        <h1 className="phero__title display">
          <RevealText text={title} />
        </h1>
        {lead && (
          <motion.p
            className="phero__lead"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
          >
            {lead}
          </motion.p>
        )}
      </div>
    </header>
  );
}
