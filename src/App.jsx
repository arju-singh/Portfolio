import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';

import { useLenis } from './hooks/useLenis';
import { SoundProvider } from './hooks/SoundContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import ScrollProgress from './components/ScrollProgress';
import SoundFab from './components/SoundFab';

// Routes are code-split: each page loads on demand instead of bloating the
// initial bundle.
const Home = lazy(() => import('./pages/Home'));
const Work = lazy(() => import('./pages/Work'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Resources = lazy(() => import('./pages/Resources'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } }
};

function Page({ children }) {
  return (
    <motion.div className="page" variants={pageVariants} initial="initial" animate="enter" exit="exit">
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/work" element={<Page><Work /></Page>} />
        <Route path="/projects" element={<Page><Projects /></Page>} />
        <Route path="/projects/:slug" element={<Page><ProjectDetail /></Page>} />
        <Route path="/resources" element={<Page><Resources /></Page>} />
        <Route path="/contact" element={<Page><Contact /></Page>} />
        <Route path="*" element={<Page><NotFound /></Page>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  useLenis();
  return (
    <SoundProvider>
      <Cursor />
      <ScrollProgress />
      <ScrollToTop />
      <Header />
      <main>
        <Suspense fallback={<div className="page" />}>
          <AnimatedRoutes />
        </Suspense>
      </main>
      <Footer />
      <SoundFab />
    </SoundProvider>
  );
}
