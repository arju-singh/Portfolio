import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="notfound">
      <div className="wrap notfound__inner">
        <motion.h1
          className="notfound__code display"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          404
        </motion.h1>
        <p className="notfound__msg">This page drifted off the grid.</p>
        <Link to="/" className="btn btn--solid" data-hover>
          Back home <span className="arrow">↗</span>
        </Link>
      </div>
    </div>
  );
}
