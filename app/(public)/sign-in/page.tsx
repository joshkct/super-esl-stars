import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignInForm } from '@/components/auth/SignInForm';

export const metadata: Metadata = {
  title: 'Sign in — Verbjective',
};

/**
 * Sign-in page. Server wrapper that reads any `verbjective_redirect` cookie set
 * by the middleware so the client form can return the user to their intended
 * destination after verification.
 */
export default async function SignInPage() {
  const cookieStore = await cookies();
  const redirect = cookieStore.get('verbjective_redirect')?.value;

  return (
    <AuthLayout>
      <SignInForm initialRedirect={redirect} />
    </AuthLayout>
  );
}
