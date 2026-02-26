/**
 * Shared Tailwind class strings for forms and badges.
 */

export const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100';

export const labelClass =
  'block text-sm font-medium text-slate-700 dark:text-slate-300';

const badgeBase =
  'inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium';

export function getBadgeClass(type: string): string {
  switch (type) {
    case 'premium':
      return `${badgeBase} bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300`;
    case 'discount':
      return `${badgeBase} bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300`;
    default:
      return `${badgeBase} bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200`;
  }
}
