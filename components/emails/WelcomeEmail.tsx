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

/**
 * Welcome email sent after sign-up. Representative React Email template that
 * the remaining transactional emails (booking confirmations, reminders,
 * invoices, feedback) will follow.
 */
export interface WelcomeEmailProps {
  fullName: string;
}

export function WelcomeEmail({ fullName }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Verbjective</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Welcome to Verbjective</Heading>
          <Section>
            <Text style={paragraph}>Hi {fullName},</Text>
            <Text style={paragraph}>
              Thanks for joining Verbjective. You can now book sessions, track
              your progress and manage everything from your dashboard.
            </Text>
            <Text style={paragraph}>See you in class!</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default WelcomeEmail;

const main = { backgroundColor: '#f8fafc', fontFamily: 'Arial, sans-serif' };
const container = { margin: '0 auto', padding: '24px', maxWidth: '560px' };
const heading = { color: '#1a37a1', fontSize: '24px' };
const paragraph = { color: '#0f172a', fontSize: '15px', lineHeight: '24px' };
