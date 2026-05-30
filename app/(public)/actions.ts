'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { contactSchema } from '@/lib/validations';

export interface ContactActionState {
  status: 'idle' | 'success' | 'error';
  /** Field-level validation errors keyed by field name. */
  fieldErrors?: Partial<Record<'name' | 'email' | 'message', string>>;
}

/**
 * Public contact form submission.
 *
 * Validates input with Zod, silently drops bot submissions caught by the
 * honeypot, and inserts the enquiry into `contact_submissions` using the
 * service-role client (server-only — RLS would otherwise block anonymous
 * inserts). The service role key is never exposed to the client.
 */
export async function submitContactForm(
  _prev: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  // Honeypot: a hidden field that real users never fill in. If it has a
  // value, treat as spam and pretend success without writing anything.
  const honeypot = formData.get('company');
  if (typeof honeypot === 'string' && honeypot.trim().length > 0) {
    return { status: 'success' };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!parsed.success) {
    const fieldErrors: ContactActionState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (field === 'name' || field === 'email' || field === 'message') {
        fieldErrors[field] = issue.message;
      }
    }
    return { status: 'error', fieldErrors };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('contact_submissions').insert({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
    });

    if (error) {
      return { status: 'error' };
    }

    return { status: 'success' };
  } catch {
    return { status: 'error' };
  }
}
