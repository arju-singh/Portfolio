import React, { useState } from 'react';

const Contact = ({ isActive }) => {
    const [formData, setFormData] = useState({ name: '', email: '', job: '', company: '', message: '' });
    const [formStatus, setFormStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormStatus('');
        try {
            const fd = new FormData();
            Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
            fd.append('_captcha', 'false');
            fd.append('_subject', 'New Contact Form Submission from Portfolio');
            const res = await fetch('https://formsubmit.co/ajax/connect@arjusingh.com', { method: 'POST', body: fd });
            const data = await res.json();
            if (res.ok && data.success) {
                setFormStatus('✓ Message sent! I\'ll get back to you soon.');
                setFormData({ name: '', email: '', job: '', company: '', message: '' });
                setTimeout(() => setFormStatus(''), 5000);
            } else {
                throw new Error(data.message || 'Failed');
            }
        } catch (err) {
            setFormStatus('✗ Something went wrong. Email me at connect@arjusingh.com');
        } finally {
            setIsSubmitting(false);
        }
    };

    const year = new Date().getFullYear();

    return (
        <section id="contact" className={`section ${isActive ? 'active' : ''}`}>
            <div className="section-inner">
                <div className="contact-wrapper">
                    <div className="contact-left">
                        <div className="section-label left-only">Get In Touch</div>
                        <h2 className="contact-title">Let's create something amazing</h2>
                        <p className="contact-sub">Have a project in mind? I'd love to hear from you.</p>

                        <div className="contact-info-list">
                            <a href="mailto:connect@arjusingh.com" className="info-card">
                                <div className="info-icon ii-pink"><i className="fa-solid fa-envelope"></i></div>
                                <div>
                                    <div className="label">Email</div>
                                    <div className="value">connect@arjusingh.com</div>
                                </div>
                            </a>
                            <a href="https://www.linkedin.com/in/arju-singh-0ab697228/" target="_blank" rel="noopener noreferrer" className="info-card">
                                <div className="info-icon ii-blue"><i className="fa-brands fa-linkedin-in"></i></div>
                                <div>
                                    <div className="label">LinkedIn</div>
                                    <div className="value">Connect with me</div>
                                </div>
                            </a>
                            <a href="https://github.com/deadxolo" target="_blank" rel="noopener noreferrer" className="info-card">
                                <div className="info-icon ii-dark"><i className="fa-brands fa-github"></i></div>
                                <div>
                                    <div className="label">GitHub</div>
                                    <div className="value">View my code</div>
                                </div>
                            </a>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="contact-form-card">
                        <div className="form-row">
                            <div className="field">
                                <label htmlFor="cf-name">Your Name</label>
                                <input id="cf-name" type="text" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="field">
                                <label htmlFor="cf-email">Email</label>
                                <input id="cf-email" type="email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="field">
                                <label htmlFor="cf-job">Job Title</label>
                                <input id="cf-job" type="text" name="job" value={formData.job} onChange={handleChange} />
                            </div>
                            <div className="field">
                                <label htmlFor="cf-company">Company</label>
                                <input id="cf-company" type="text" name="company" value={formData.company} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="field" style={{ marginBottom: 28 }}>
                            <label htmlFor="cf-message">Message</label>
                            <textarea id="cf-message" name="message" rows="2" value={formData.message} onChange={handleChange} required />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting
                                ? <><i className="fa-solid fa-spinner fa-spin"></i> Sending...</>
                                : <>Send Message <i className="fa-solid fa-paper-plane"></i></>}
                        </button>
                        {formStatus && (
                            <p className="form-status" style={{ color: formStatus.startsWith('✓') ? '#34d399' : '#f87171' }}>
                                {formStatus}
                            </p>
                        )}
                    </form>
                </div>

                <div className="contact-footer">
                    <span className="cf-logo">AS</span>
                    <span>Entrepreneur &amp; Tech Innovator</span>
                    <span>© {year} Arju Singh</span>
                </div>
            </div>
        </section>
    );
};

export default Contact;
