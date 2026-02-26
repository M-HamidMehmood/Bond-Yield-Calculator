import type { BondResponse } from '../types/bond';
import { getBadgeClass } from '../constants/classes';

export interface BondResultsProps {
  result: BondResponse;
}

export function BondResults({ result }: BondResultsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
      <h2 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">
        Results
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Current yield
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
            {result.currentYieldPercent.toFixed(2)}%
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">YTM</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
            {result.ytmPercent.toFixed(2)}%
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Total interest
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
            ${result.totalInterest.toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Premium / discount
          </p>
          <p className="mt-2">
            <span className={getBadgeClass(result.premiumOrDiscount)}>
              {result.premiumOrDiscount}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
