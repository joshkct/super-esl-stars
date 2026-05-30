import { Resend } from 'resend';
import type { ReactElement } from 'react';

/**
 * Reusable transactional email utility built on Resend + React Email.
 *
 * SERVER-ONLY. Requires `RESEND_API_KEY` and `EMAIL_FROM` env vars. Email
 * templates live in `/components/emails` and are passed to `sendEmail` as
 * rendered React elements.
 */

let client: Resend | null = null;

function getResend(): Resend {
  if (!client) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error('RESEND_API_KEY is not set');
    client = new Resend(apiKey);
  }
  return client;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: ReactElement;
  replyTo?: string;
  attachments?: { filename: string; content: Buffer | string }[];
}

export async function sendEmail(options: SendEmailOptions) {
  const from = process.env.EMAIL_FROM;
  if (!from) throw new Error('EMAIL_FROM is not set');

  const { data, error } = await getResend().emails.send({
    from,
    to: options.to,
    subject: options.subject,
    react: options.react,
    replyTo: options.replyTo,
    attachments: options.attachments,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
}
