import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer';
import { createElement, type ReactElement } from 'react';
import { InvoiceDocument, type InvoiceData } from '@/components/pdf/InvoiceDocument';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Invoice helpers: number generation, due-date calculation, PDF rendering and
 * storage upload. PDFs are generated with `@react-pdf/renderer` and stored in
 * the private `invoices` Supabase Storage bucket; the resulting URL is saved to
 * the `invoices.pdf_url` column by the caller.
 */

export const INVOICE_STORAGE_BUCKET = 'invoices';

/** Number of days from issue date until an invoice is due. */
export const DEFAULT_DUE_DAYS = 7;

/** Generate a human-readable invoice number, e.g. "VBJ-20260529-0F3A". */
export function generateInvoiceNumber(date: Date = new Date()): string {
  const stamp = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `VBJ-${stamp}-${random}`;
}

/** Compute a due date a fixed number of days after issue. */
export function computeDueDate(
  issuedAt: Date = new Date(),
  days: number = DEFAULT_DUE_DAYS,
): Date {
  const due = new Date(issuedAt);
  due.setDate(due.getDate() + days);
  return due;
}

/** Render an invoice to a PDF buffer. */
export async function renderInvoicePdf(data: InvoiceData): Promise<Buffer> {
  // InvoiceDocument renders a <Document>; cast to the element type expected by
  // @react-pdf's renderToBuffer.
  const element = createElement(InvoiceDocument, { data }) as ReactElement<
    DocumentProps
  >;
  return renderToBuffer(element);
}

/**
 * Render and upload an invoice PDF to Supabase Storage, returning a signed URL.
 * Uses the service-role admin client (server-only).
 */
export async function generateAndStoreInvoicePdf(
  data: InvoiceData,
): Promise<{ path: string; signedUrl: string }> {
  const pdf = await renderInvoicePdf(data);
  const admin = createAdminClient();
  const path = `${data.studentId}/${data.invoiceNumber}.pdf`;

  const { error: uploadError } = await admin.storage
    .from(INVOICE_STORAGE_BUCKET)
    .upload(path, pdf, { contentType: 'application/pdf', upsert: true });

  if (uploadError) {
    throw new Error(`Invoice upload failed: ${uploadError.message}`);
  }

  const { data: signed, error: signError } = await admin.storage
    .from(INVOICE_STORAGE_BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 30);

  if (signError || !signed) {
    throw new Error(`Could not sign invoice URL: ${signError?.message}`);
  }

  return { path, signedUrl: signed.signedUrl };
}
