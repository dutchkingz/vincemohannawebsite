// src/pages/api/contact.ts
import type { APIRoute } from 'astro';
import { Resend } from 'resend';

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

  const { RESEND_API_KEY, CONTACT_TO_EMAIL } = import.meta.env;

  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    console.error('RESEND_API_KEY or CONTACT_TO_EMAIL is not configured');
    return new Response(
      JSON.stringify({ success: false, message: 'Server configuration error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const resend = new Resend(RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: 'Contact Form <onboarding@resend.dev>',
    replyTo: `${payload.name.trim()} <${payload.email.trim()}>`,
    to: CONTACT_TO_EMAIL,
    subject: `New contact message from ${payload.name.trim()}`,
    html: `
      <p><strong>From:</strong> ${payload.name.trim()} &lt;${payload.email.trim()}&gt;</p>
      <p><strong>Message:</strong></p>
      <p>${payload.message.trim().replace(/\n/g, '<br>')}</p>
    `,
  });

  if (error) {
    console.error('Resend error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to send email' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
};
