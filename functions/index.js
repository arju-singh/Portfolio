/**
 * Contact-form backend (HTTPS Cloud Function, 2nd gen).
 *
 * POST /api/contact  { name, email, message, company? }
 *   - validates input
 *   - stores the submission in Firestore  → collection "contacts"
 *   - enqueues an email by writing to the "mail" collection, which the Firebase
 *     "Trigger Email" extension watches and delivers. If the extension isn't
 *     installed yet, the doc just sits there harmlessly — the submission is
 *     still safely stored in "contacts", so nothing is ever lost.
 *
 * `company` is a hidden honeypot field — if a bot fills it, we drop the
 * request silently (return ok) without storing or emailing.
 *
 * Credentials: when DEPLOYED, admin.initializeApp() picks up the project's
 * service account automatically — the JSON key file is NOT needed in prod.
 * Locally (emulator) set GOOGLE_APPLICATION_CREDENTIALS to the key path.
 *
 * Config (functions/.env — see .env.example):
 *   CONTACT_TO  — where contact emails are delivered.
 */
const { onRequest } = require('firebase-functions/v2/https');
const { setGlobalOptions } = require('firebase-functions/v2');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

setGlobalOptions({ region: 'us-central1', maxInstances: 5 });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clamp = (v, n) => String(v || '').trim().slice(0, n);
const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

exports.contact = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = req.body || {};

  // Honeypot: real users never see/fill this field.
  if (clamp(body.company, 1)) {
    res.json({ ok: true });
    return;
  }

  const name = clamp(body.name, 120);
  const email = clamp(body.email, 200);
  const message = clamp(body.message, 5000);

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Please fill in your name, email and message.' });
    return;
  }
  if (!EMAIL_RE.test(email)) {
    res.status(400).json({ error: 'That email address looks invalid.' });
    return;
  }

  let id;
  try {
    const doc = await db.collection('contacts').add({
      name,
      email,
      message,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      userAgent: req.get('user-agent') || null,
      ip: req.headers['x-forwarded-for'] || req.ip || null,
    });
    id = doc.id;
  } catch (err) {
    logger.error('Firestore write failed', err);
    res.status(500).json({ error: 'Could not save your message. Please email me directly.' });
    return;
  }

  // Enqueue the email for the "Trigger Email" extension. Best-effort — if this
  // write fails the submission is still stored, so we never fail the request.
  try {
    const safe = escapeHtml(message).replace(/\n/g, '<br>');
    await db.collection('mail').add({
      to: process.env.CONTACT_TO || 'connect@arjusingh.com',
      replyTo: `${name} <${email}>`,
      message: {
        subject: `Portfolio enquiry from ${name}`,
        text: `${message}\n\n— ${name} (${email})`,
        html: `<p>${safe}</p><hr><p>— <strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p>`,
      },
      contactId: id,
    });
  } catch (err) {
    logger.error('Mail enqueue failed (submission still stored)', err);
  }

  res.json({ ok: true, id });
});
