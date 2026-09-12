import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import twilio from 'twilio';

const app = express();
app.use(cors({ origin: ['https://satyampandey5565-pixel.github.io'], methods: ['POST','GET'] }));
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

const PORT = process.env.PORT || 3000;
const TO_EMAIL = process.env.TO_EMAIL || 'satyampandey5565@gmail.com';
const TO_PHONE = process.env.TO_PHONE || '9372398447';

function clean(value, max = 2000) {
  return String(value ?? '').trim().slice(0, max);
}

app.get('/health', (_req, res) => res.json({ ok: true, service: '/mo enquiry API' }));

app.post('/api/contact', async (req, res) => {
  try {
    if (clean(req.body.website_trap)) return res.json({ ok: true });

    const name = clean(req.body.name, 120);
    const phone = clean(req.body.phone, 60);
    const email = clean(req.body.email, 160);
    const company = clean(req.body.company, 160);
    const meetingDate = clean(req.body.meeting_date, 40);
    const meetingTime = clean(req.body.meeting_time, 40);
    const service = clean(req.body.service, 120);
    const budget = clean(req.body.budget, 80);
    const website = clean(req.body.website, 300);
    const message = clean(req.body.message, 5000);

    if (!name || !phone || !email || !meetingDate || !meetingTime || !message) {
      return res.status(400).json({ ok: false, error: 'Please complete all required fields.' });
    }

    const subject = `New /mo project enquiry — ${name}${company ? ` · ${company}` : ''}`;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:680px;color:#111">
        <h1 style="margin-bottom:6px">New /mo project enquiry</h1>
        <p style="color:#666">Someone submitted the project form on the /mo website.</p>
        <hr>
        <p><b>Name:</b> ${escapeHtml(name)}</p>
        <p><b>Phone:</b> ${escapeHtml(phone)}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        <p><b>Company / brand:</b> ${escapeHtml(company || '—')}</p>
        <p><b>Meeting:</b> ${escapeHtml(meetingDate)} at ${escapeHtml(meetingTime)}</p>
        <p><b>Service:</b> ${escapeHtml(service || '—')}</p>
        <p><b>Budget:</b> ${escapeHtml(budget || '—')}</p>
        <p><b>Website / Instagram:</b> ${escapeHtml(website || '—')}</p>
        <h3>Project</h3>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      </div>`;

    const tasks = [];

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      tasks.push(resend.emails.send({
        from: process.env.FROM_EMAIL || 'mo enquiries <onboarding@resend.dev>',
        to: [TO_EMAIL],
        replyTo: email,
        subject,
        html
      }));
    }

    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM) {
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      tasks.push(client.messages.create({
        body: `/mo enquiry: ${name}${company ? ` (${company})` : ''}. ${service || 'Project'} — ${meetingDate} ${meetingTime}. ${phone}. ${email}`,
        from: process.env.TWILIO_FROM,
        to: TO_PHONE.startsWith('+') ? TO_PHONE : `+91${TO_PHONE}`
      }));
    }

    if (!tasks.length) return res.status(503).json({ ok: false, error: 'Notification service is not configured yet.' });

    const results = await Promise.allSettled(tasks);
    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length === results.length) return res.status(502).json({ ok: false, error: 'We could not deliver the enquiry notifications.' });

    return res.json({ ok: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, error: 'Something went wrong. Please try again.' });
  }
});

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
}

app.listen(PORT, () => console.log(`/mo enquiry API listening on ${PORT}`));
