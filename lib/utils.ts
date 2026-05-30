import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind class names with conditional logic. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Basic input sanitisation: trims and strips angle brackets to mitigate XSS. */
export function sanitizeText(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}
