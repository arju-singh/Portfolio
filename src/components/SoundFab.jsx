import { motion } from 'motion/react';
import { useSound } from '../hooks/SoundContext';
import './SoundFab.css';

/**
 * SoundFab — a floating, circular music toggle (bottom-right).
 * Click to play the ambient sound, click again to stop. The equalizer bars
 * animate while it's playing and rest flat when stopped.
 */
export default function SoundFab() {
  const { enabled, toggle } = useSound();

  return (
    <motion.button
      type="button"
      className={`sound-fab ${enabled ? 'is-on' : ''}`}
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? 'Stop music' : 'Play music'}
      title={enabled ? 'Stop music' : 'Play music'}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6, type: 'spring', stiffness: 380, damping: 22 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.92 }}
    >
      <span className="sound-fab__bars" aria-hidden="true">
        <i /><i /><i /><i />
      </span>
    </motion.button>
  );
}
