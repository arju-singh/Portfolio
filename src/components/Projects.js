import React from 'react';

const PROJECTS = [
    {
        icon: 'fa-solid fa-heart',
        color: 'pi-pink',
        title: 'Hope Charity Website',
        description: 'A fully responsive charity platform designed to connect donors with meaningful causes. Features secure donation integration with multiple payment options.',
        tags: [
            { label: 'HTML5', color: 'tag-c1' },
            { label: 'CSS3', color: 'tag-c2' },
            { label: 'JavaScript', color: 'tag-c3' },
            { label: 'Payment API', color: 'tag-c4' },
            { label: 'Responsive', color: 'tag-c5' }
        ]
    },
    {
        icon: 'fa-solid fa-bag-shopping',
        color: 'pi-teal',
        title: 'E-Commerce App UI',
        description: 'Complete mobile app design featuring 50+ meticulously crafted screens. Includes intuitive product catalog with filters, smart cart system.',
        tags: [
            { label: 'Figma', color: 'tag-c4' },
            { label: 'UI/UX', color: 'tag-c5' },
            { label: 'Prototyping', color: 'tag-c2' },
            { label: 'Mobile Design', color: 'tag-c3' },
            { label: 'User Research', color: 'tag-c1' }
        ]
    },
    {
        icon: 'fa-solid fa-chart-column',
        color: 'pi-orange',
        title: 'Analytics Dashboard',
        description: 'Powerful real-time data visualization platform for business intelligence. Features interactive charts with drill-down capabilities, customizable reports.',
        tags: [
            { label: 'React', color: 'tag-c2' },
            { label: 'Chart.js', color: 'tag-c4' },
            { label: 'Node.js', color: 'tag-c3' },
            { label: 'MongoDB', color: 'tag-c5' },
            { label: 'REST API', color: 'tag-c1' }
        ]
    },
    {
        icon: 'fa-solid fa-list-check',
        color: 'pi-magenta',
        title: 'Task Management System',
        description: 'Enterprise-grade collaborative task manager with intuitive drag-drop kanban boards, real-time synchronization across all devices, team workflows.',
        tags: [
            { label: 'React', color: 'tag-c4' },
            { label: 'Firebase', color: 'tag-c1' },
            { label: 'Real-time DB', color: 'tag-c2' },
            { label: 'Cloud Functions', color: 'tag-c5' },
            { label: 'PWA', color: 'tag-c3' }
        ]
    }
];

const Projects = ({ isActive }) => (
    <section id="projects" className={`section ${isActive ? 'active' : ''}`}>
        <div className="section-inner">
            <div className="section-header">
                <div className="section-label">Featured Work</div>
                <h2 className="section-title">My Projects</h2>
            </div>

            <div className="projects-grid">
                {PROJECTS.map((p, i) => (
                    <article className="project-card" key={i}>
                        <div className={`project-icon ${p.color}`}><i className={p.icon}></i></div>
                        <div className="project-content">
                            <h3>{p.title}</h3>
                            <p>{p.description}</p>
                            <div className="tag-row">
                                {p.tags.map((t, ti) => (
                                    <span className={`tag ${t.color}`} key={ti}>{t.label}</span>
                                ))}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    </section>
);

export default Projects;
