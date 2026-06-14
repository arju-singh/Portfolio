import { useState } from 'react';
import Mockup from './Mockup';

// Renders a real project screenshot when `project.image` is set and loads
// successfully. If the file is missing or fails to load, it gracefully falls
// back to the generated CSS mockup so the layout never breaks.
export default function ProjectVisual({ project, className = '' }) {
  const [failed, setFailed] = useState(false);
  const showImage = project.image && !failed;

  if (showImage) {
    return (
      <img
        className={`project-img ${className}`}
        src={project.image}
        alt={`${project.title} — screenshot`}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  return <Mockup kind={project.kind} accent={project.accent} title={project.title} />;
}
