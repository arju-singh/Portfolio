import { useState } from 'react';
import { motion } from 'motion/react';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import { PROFILE } from '../data/profile';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '', company: '' });
  // status: 'idle' | 'sending' | 'sent' | 'error'
  const [status, setStatus] = useState('idle');

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Fallback if the backend is unreachable — never lose the message.
  const openMailto = () => {
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name || 'someone'}`);
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name}${form.email ? ` (${form.email})` : ''}`
    );
    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('sent');
      setForm({ name: '', email: '', message: '', company: '' });
    } catch {
      // Backend unavailable (e.g. running the static build with no Functions) —
      // fall back to the user's mail client so the message still gets through.
      setStatus('error');
      openMailto();
    }
  };

  const labels = {
    idle: 'Send message',
    sending: 'Sending…',
    sent: 'Message sent ✓',
    error: 'Opening your mail app…',
  };

  return (
    <div className="contactpage">
      <PageHero
        eyebrow="Contact"
        title="Say hello"
        lead="Got a product to build, a role to fill, or just want to talk shop about AI and the web? I read every message."
        image="/images/arju-full.jpg"
        imageAlt="Arju Singh"
      />

      <section className="section">
        <div className="wrap contact__grid">
          {/* details */}
          <div className="contact__info">
            <Reveal>
              <a className="contact__email display" href={`mailto:${PROFILE.email}`} data-hover>
                {PROFILE.email}
              </a>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="contact__rows">
                <div className="contact__row">
                  <span className="contact__row-k">Phone</span>
                  <a href={`tel:${PROFILE.phone.replace(/\s/g, '')}`} data-hover>{PROFILE.phone}</a>
                </div>
                <div className="contact__row">
                  <span className="contact__row-k">Location</span>
                  <span>{PROFILE.location}</span>
                </div>
                <div className="contact__row">
                  <span className="contact__row-k">Status</span>
                  <span className="contact__status">● Available for work</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="contact__socials">
                {PROFILE.socials.map((s) => (
                  <a key={s.label} href={s.url} target="_blank" rel="noreferrer" data-hover>
                    {s.label} <span className="arrow">↗</span>
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          {/* form */}
          <motion.form
            className="contact__form"
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <label className="field">
              <span>Name</span>
              <input type="text" value={form.name} onChange={update('name')} placeholder="Your name" required />
            </label>
            <label className="field">
              <span>Email</span>
              <input type="email" value={form.email} onChange={update('email')} placeholder="you@email.com" required />
            </label>
            <label className="field">
              <span>Message</span>
              <textarea rows={5} value={form.message} onChange={update('message')} placeholder="Tell me about it…" required />
            </label>

            {/* honeypot — hidden from real users; bots that fill it are dropped */}
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={update('company')}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
            />

            <button type="submit" className="btn btn--solid contact__submit" data-hover disabled={status === 'sending'}>
              {labels[status]} <span className="arrow">↗</span>
            </button>
            <p className="contact__note">
              {status === 'sent'
                ? `Thanks — I'll get back to you soon. You can also write to ${PROFILE.email} directly.`
                : `Sent straight to my inbox — or just write to ${PROFILE.email} directly.`}
            </p>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
