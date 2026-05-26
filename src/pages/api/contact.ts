// src/pages/api/contact.ts
import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

// Exported so it can be unit tested independently of Astro
export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export function validateContactPayload(payload: ContactPayload): string[] {
  const errors: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!payload.name || payload.name.trim() === '') {
    errors.push('name is required');
  }
  if (!payload.email || payload.email.trim() === '') {
    errors.push('email is required');
  } else if (!emailRegex.test(payload.email.trim())) {
    errors.push('email is invalid');
  }
  if (!payload.message || payload.message.trim() === '') {
    errors.push('message is required');
  }

  return errors;
}

// This endpoint must not be statically pre-rendered — it needs to run on the server
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ success: false, message: 'Invalid JSON body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const payload = body as ContactPayload;
  const errors = validateContactPayload(payload);

  if (errors.length > 0) {
    return new Response(
      JSON.stringify({ success: false, message: errors.join(', ') }),
      { status: 422, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    CONTACT_TO_EMAIL,
  } = import.meta.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !CONTACT_TO_EMAIL) {
    console.error('SMTP environment variables are not configured');
    return new Response(
      JSON.stringify({ success: false, message: 'Server configuration error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"${payload.name.trim()}" <${SMTP_USER}>`,
    replyTo: payload.email.trim(),
    to: CONTACT_TO_EMAIL,
    subject: `New contact message from ${payload.name.trim()}`,
    text: `From: ${payload.name.trim()} <${payload.email.trim()}>\n\n${payload.message.trim()}`,
    html: `
      <p><strong>From:</strong> ${payload.name.trim()} &lt;${payload.email.trim()}&gt;</p>
      <p><strong>Message:</strong></p>
      <p>${payload.message.trim().replace(/\n/g, '<br>')}</p>
    `,
  });

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
};
