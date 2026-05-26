// src/pages/api/contact.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock nodemailer before importing the module under test
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({ messageId: 'test-id' }),
    })),
  },
}));

// Import the validation logic directly (extracted so it can be tested without Astro runtime)
import { validateContactPayload } from './contact';

describe('validateContactPayload', () => {
  it('returns no errors for a valid payload', () => {
    const errors = validateContactPayload({
      name: 'Alice Tremblay',
      email: 'alice@example.com',
      message: 'Hello!',
    });
    expect(errors).toHaveLength(0);
  });

  it('returns error when name is missing', () => {
    const errors = validateContactPayload({ name: '', email: 'a@b.com', message: 'hi' });
    expect(errors).toContain('name is required');
  });

  it('returns error when email is missing', () => {
    const errors = validateContactPayload({ name: 'Alice', email: '', message: 'hi' });
    expect(errors).toContain('email is required');
  });

  it('returns error when email is invalid', () => {
    const errors = validateContactPayload({ name: 'Alice', email: 'not-an-email', message: 'hi' });
    expect(errors).toContain('email is invalid');
  });

  it('returns error when message is missing', () => {
    const errors = validateContactPayload({ name: 'Alice', email: 'a@b.com', message: '' });
    expect(errors).toContain('message is required');
  });

  it('returns multiple errors when several fields are missing', () => {
    const errors = validateContactPayload({ name: '', email: '', message: '' });
    expect(errors).toContain('name is required');
    expect(errors).toContain('email is required');
    expect(errors).toContain('message is required');
  });
});
