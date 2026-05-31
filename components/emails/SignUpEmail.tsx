import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import messages from '@/messages/en.json';

/**
 * Transactional sign-up verification email. Strings live in
 * `messages/en.json` under `emails.signUp`; read statically here because the
 * template may be rendered (via @react-email/render) outside a next-intl
 * request scope, e.g. from a Supabase auth hook backed by Resend.
 */
const t = messages.emails.signUp;

/** Email subject line for the sign-up verification code. */
export const signUpEmailSubject = t.subject;

export interface SignUpEmailProps {
  /** The 6-digit one-time code. */
  code: string;
}

export function SignUpEmail({ code }: SignUpEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={wordmark}>Verbjective</Text>
          <Heading style={heading}>{t.heading}</Heading>
          <Text style={paragraph}>{t.intro}</Text>

          <Section style={codeWrap}>
            <Text style={codeLabel}>{t.codeLabel}</Text>
            <Text style={codeText}>{code}</Text>
          </Section>

          <Text style={notice}>{t.expiryNotice}</Text>
          <Text style={paragraph}>{t.whatNext}</Text>
          <Text style={footer}>{t.footer}</Text>
        </Container>
      </Body>
    </Html>
  );
}

export default SignUpEmail;

const INK = '#1b2a4a';
const GOLD = '#c9a84c';
const CREAM = '#f8f6f1';

const main = { backgroundColor: CREAM, fontFamily: 'Arial, sans-serif', padding: '24px 0' };
const container = {
  margin: '0 auto',
  padding: '32px',
  maxWidth: '480px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
};
const wordmark = { color: GOLD, fontSize: '22px', fontWeight: 700, margin: '0 0 16px' };
const heading = { color: INK, fontSize: '24px', margin: '0 0 8px' };
const paragraph = { color: '#4b5563', fontSize: '15px', lineHeight: '24px', margin: '0 0 24px' };
const codeWrap = {
  backgroundColor: INK,
  borderRadius: '10px',
  padding: '20px',
  textAlign: 'center' as const,
};
const codeLabel = {
  color: 'rgba(255,255,255,0.7)',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
  margin: '0 0 8px',
};
const codeText = {
  color: GOLD,
  fontSize: '34px',
  fontWeight: 700,
  letterSpacing: '0.4em',
  fontFamily: 'Menlo, Consolas, monospace',
  margin: 0,
};
const notice = { color: INK, fontSize: '14px', fontWeight: 600, margin: '24px 0 16px' };
const footer = { color: '#9ca3af', fontSize: '12px', borderTop: '1px solid #e5e7eb', paddingTop: '16px', margin: 0 };
