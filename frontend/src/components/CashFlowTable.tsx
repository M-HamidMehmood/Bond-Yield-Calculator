import { format, parseISO } from 'date-fns';
import type { CashFlowRow } from '../types/bond';

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

export interface CashFlowTableProps {
  schedule: CashFlowRow[];
  totalInterest?: number;
  faceValue?: number;
  marketPrice?: number;
}

export function CashFlowTable({
  schedule,
  totalInterest,
  faceValue,
  marketPrice,
}: CashFlowTableProps) {
  const showSummary =
    totalInterest !== undefined &&
    faceValue !== undefined &&
    marketPrice !== undefined;
  const totalCashInflow = showSummary
    ? totalInterest + faceValue
    : 0;
  const netProfit = showSummary ? totalCashInflow - marketPrice : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-700/50">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Cash flow schedule
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-700/30">
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300"
              >
                Period
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300"
              >
                Payment date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300"
              >
                Coupon
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300"
              >
                Cumulative interest
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300"
              >
                Remaining principal
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {schedule.map((row) => (
              <tr
                key={row.period}
                className="bg-white transition hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700/30"
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                  {row.period}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                  {format(parseISO(row.paymentDate), 'MMM d, yyyy')}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm tabular-nums text-slate-900 dark:text-slate-100">
                  ${row.couponPayment.toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm tabular-nums text-slate-900 dark:text-slate-100">
                  ${row.cumulativeInterest.toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm tabular-nums text-slate-900 dark:text-slate-100">
                  ${row.remainingPrincipal.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showSummary && (
        <div
          className="border-t border-slate-200 bg-slate-50 px-6 py-5 dark:border-slate-700 dark:bg-slate-700/40"
          aria-label="Cash flow summary"
        >
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Summary
          </h4>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-3 lg:max-w-2xl">
            <div className="flex justify-between gap-4 border-b border-slate-200/60 py-2 dark:border-slate-600/60 sm:border-0 sm:py-0">
              <dt className="text-sm text-slate-600 dark:text-slate-400">
                Total coupons
              </dt>
              <dd className="text-right tabular-nums font-medium text-slate-900 dark:text-slate-100">
                {formatCurrency(totalInterest!)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-200/60 py-2 dark:border-slate-600/60 sm:border-0 sm:py-0">
              <dt className="text-sm text-slate-600 dark:text-slate-400">
                Principal at maturity
              </dt>
              <dd className="text-right tabular-nums font-medium text-slate-900 dark:text-slate-100">
                {formatCurrency(faceValue!)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-200/60 py-2 dark:border-slate-600/60 sm:border-0 sm:py-0">
              <dt className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Total cash inflow
              </dt>
              <dd className="text-right tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                {formatCurrency(totalCashInflow)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-slate-200/60 py-2 dark:border-slate-600/60 sm:border-0 sm:py-0">
              <dt className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Net profit (vs market price)
              </dt>
              <dd
                className={`text-right tabular-nums font-semibold ${
                  netProfit >= 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-900 dark:text-slate-100'
                }`}
              >
                {formatCurrency(netProfit)}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Total cash received (coupons + principal) minus what you pay today.
          </p>
        </div>
      )}
    </div>
  );
}
