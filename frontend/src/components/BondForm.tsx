import type { CalculateBondRequest, CouponFrequency } from '../types/bond';
import { inputClass, labelClass } from '../constants/classes';

export interface BondFormProps {
  form: CalculateBondRequest;
  onChange: (field: keyof CalculateBondRequest, value: number | CouponFrequency) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export function BondForm({ form, onChange, onSubmit, loading }: BondFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8"
    >
      <h2 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">
        Bond parameters
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="faceValue" className={labelClass}>
            Face value
          </label>
          <input
            id="faceValue"
            type="number"
            min="1"
            step="1"
            className={`mt-1 ${inputClass}`}
            value={form.faceValue}
            onChange={(e) => onChange('faceValue', Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <div>
          <label htmlFor="couponRate" className={labelClass}>
            Annual coupon rate (%)
          </label>
          <input
            id="couponRate"
            type="number"
            min="0"
            max="100"
            step="1"
            className={`mt-1 ${inputClass}`}
            value={form.annualCouponRatePercent}
            onChange={(e) => onChange('annualCouponRatePercent', Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
          />
        </div>
        <div>
          <label htmlFor="marketPrice" className={labelClass}>
            Market price
          </label>
          <input
            id="marketPrice"
            type="number"
            min="1"
            step="1"
            className={`mt-1 ${inputClass}`}
            value={form.marketPrice}
            onChange={(e) => onChange('marketPrice', Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <div>
          <label htmlFor="yearsToMaturity" className={labelClass}>
            Years to maturity
          </label>
          <input
            id="yearsToMaturity"
            type="number"
            min="1"
            step="1"
            className={`mt-1 ${inputClass}`}
            value={form.yearsToMaturity}
            onChange={(e) => onChange('yearsToMaturity', Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <div>
          <label htmlFor="frequency" className={labelClass}>
            Coupon frequency
          </label>
          <select
            id="frequency"
            className={`mt-1 ${inputClass} pr-8`}
            value={form.couponFrequency}
            onChange={(e) => onChange('couponFrequency', e.target.value as CouponFrequency)}
          >
            <option value="annual">Annual</option>
            <option value="semi-annual">Semi-annual</option>
          </select>
        </div>
      </div>
      <div className="mt-8">
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          aria-disabled={loading}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 font-medium text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed dark:focus:ring-offset-slate-800"
        >
          {loading ? 'Calculating…' : 'Calculate'}
        </button>
      </div>
    </form>
  );
}
