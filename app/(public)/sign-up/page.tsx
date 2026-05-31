import type { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignUpForm } from '@/components/auth/SignUpForm';

export const metadata: Metadata = {
  title: 'Create your account — Verbjective',
};

/**
 * Sign-up page. Server wrapper supporting a `?step=profile` deep link used by
 * the auth callback to drop new users straight into profile setup.
 */
export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) {
  const { step } = await searchParams;
  const initialStep = step === 'profile' ? 'profile' : undefined;

  return (
    <AuthLayout>
      <SignUpForm initialStep={initialStep} />
    </AuthLayout>
  );
}
