import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/public/Navbar';
import { Hero } from '@/components/public/Hero';
import { HowItWorks } from '@/components/public/HowItWorks';
import { AboutTutor } from '@/components/public/AboutTutor';
import { Pricing } from '@/components/public/Pricing';
import { PricingSkeleton } from '@/components/public/PricingSkeleton';
import { Testimonials } from '@/components/public/Testimonials';
import { FAQ } from '@/components/public/FAQ';
import { ContactForm } from '@/components/public/ContactForm';
import { Footer } from '@/components/public/Footer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://verbjective.com';

export const metadata: Metadata = {
  title: 'Verbjective — Professional English Tutoring',
  description:
    'Master English with live one-on-one tutoring built around your goals. Flexible scheduling, all levels welcome, and a tutor who genuinely cares.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'Verbjective — Professional English Tutoring',
    description:
      'Live one-on-one English lessons tailored to your goals. Flexible scheduling for every level.',
    type: 'website',
    url: SITE_URL,
    siteName: 'Verbjective',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Verbjective — Professional English Tutoring',
    description:
      'Live one-on-one English lessons tailored to your goals. Flexible scheduling for every level.',
  },
};

/**
 * Public landing page. Composes the marketing sections; pricing is streamed
 * via Suspense with a skeleton fallback while data is fetched from Supabase.
 */
export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <AboutTutor />
        <Suspense fallback={<PricingSkeleton />}>
          <Pricing />
        </Suspense>
        <Testimonials />
        <FAQ />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
