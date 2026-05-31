import { requireSession } from '@/lib/auth';

/**
 * Protected segment layout. Acts as a server-side guard in addition to the
 * edge middleware: any unauthenticated request is redirected to /sign-in.
 *
 * Guards on session only (not profile) so brand-new users who haven't finished
 * profile setup can still reach /welcome and /onboarding. Individual dashboard
 * pages enforce profile/role requirements themselves.
 */
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSession();
  return <>{children}</>;
}
