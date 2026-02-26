import { useState } from 'react';
import type { CalculateBondRequest, BondResponse, CouponFrequency } from '../types/bond';
import { calculateBond } from '../api/bondApi';
import { initialBondForm } from '../constants/formDefaults';

export function useBondCalculation(initialForm: CalculateBondRequest = initialBondForm) {
  const [form, setForm] = useState<CalculateBondRequest>(initialForm);
  const [result, setResult] = useState<BondResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const data = await calculateBond(form);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof CalculateBondRequest, value: number | CouponFrequency) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return {
    form,
    result,
    loading,
    error,
    handleSubmit,
    updateField,
  };
}
