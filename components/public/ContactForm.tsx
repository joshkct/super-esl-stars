'use client';

import { useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Clock, Mail, CalendarDays, CheckCircle2, AlertCircle } from 'lucide-react';
import { contactSchema, type ContactInput } from '@/lib/validations';
import { submitContactForm } from '@/app/(public)/actions';
import { cn } from '@/lib/utils';

type SubmitState = 'idle' | 'success' | 'error';

/**
 * Public contact form. Validates client-side with React Hook Form + Zod, then
 * submits to a server action that inserts into `contact_submissions` (service
 * role, server-only). Includes an off-screen honeypot for spam protection.
 */
export function ContactForm() {
  const t = useTranslations('contact');
  const honeypotRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '' },
  });

  const onSubmit = handleSubmit((data) => {
    setSubmitState('idle');
    const formData = new FormData();
    formData.set('name', data.name);
    formData.set('email', data.email);
    formData.set('message', data.message);
    formData.set('company', honeypotRef.current?.value ?? '');

    startTransition(async () => {
      const result = await submitContactForm({ status: 'idle' }, formData);
      if (result.status === 'success') {
        setSubmitState('success');
        reset();
      } else {
        setSubmitState('error');
      }
    });
  });

  const detailBlocks = [
    {
      Icon: Mail,
      label: t('details.emailLabel'),
      value: t('details.email'),
    },
    {
      Icon: Clock,
      label: t('details.responseLabel'),
      value: t('details.response'),
    },
    {
      Icon: CalendarDays,
      label: t('details.availabilityLabel'),
      value: t('details.availability'),
    },
  ];

  const fieldClass = (hasError: boolean) =>
    cn(
      'mt-1.5 w-full rounded-md border bg-surface px-4 py-3 text-ink placeholder:text-text-secondary/60 transition-colors',
      hasError
        ? 'border-red-400 focus:border-red-500'
        : 'border-ink/15 focus:border-gold',
    );

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-surface py-24"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Left: intro + details */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            {t('label')}
          </p>
          <h2
            id="contact-heading"
            className="mt-3 font-serif text-4xl font-bold leading-tight text-ink sm:text-5xl"
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-text-secondary">{t('subtitle')}</p>

          <ul className="mt-10 space-y-6">
            {detailBlocks.map(({ Icon, label, value }) => (
              <li key={label} className="flex items-start gap-4">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gold/15 text-gold">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
                    {label}
                  </p>
                  <p className="mt-0.5 text-ink">{value}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: form */}
        <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-ink/10 bg-cream p-7 shadow-sm">
          {/* Honeypot — visually hidden off-screen, not display:none. */}
          <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
            <label htmlFor="company">Company</label>
            <input
              id="company"
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              ref={honeypotRef}
            />
          </div>

          <div>
            <label htmlFor="name" className="text-sm font-semibold text-ink">
              {t('form.nameLabel')}
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder={t('form.namePlaceholder')}
              aria-invalid={!!errors.name}
              className={fieldClass(!!errors.name)}
              {...register('name')}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="mt-5">
            <label htmlFor="email" className="text-sm font-semibold text-ink">
              {t('form.emailLabel')}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={t('form.emailPlaceholder')}
              aria-invalid={!!errors.email}
              className={fieldClass(!!errors.email)}
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="mt-5">
            <label htmlFor="message" className="text-sm font-semibold text-ink">
              {t('form.messageLabel')}
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder={t('form.messagePlaceholder')}
              aria-invalid={!!errors.message}
              className={cn(fieldClass(!!errors.message), 'resize-y')}
              {...register('message')}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">
                {errors.message.message}
              </p>
            )}
          </div>

          {submitState === 'success' && (
            <div
              role="status"
              className="mt-5 flex items-start gap-3 rounded-md bg-success/10 px-4 py-3 text-success"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
              <div>
                <p className="font-semibold">{t('form.successTitle')}</p>
                <p className="text-sm">{t('form.successBody')}</p>
              </div>
            </div>
          )}

          {submitState === 'error' && (
            <div
              role="alert"
              className="mt-5 flex items-start gap-3 rounded-md bg-red-50 px-4 py-3 text-red-700"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
              <p className="text-sm">{t('form.errorBody')}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-gold px-6 py-3.5 text-base font-semibold text-ink shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? t('form.submitting') : t('form.submit')}
          </button>
        </form>
      </div>
    </section>
  );
}
