import type { CalculateBondRequest, BondResponse } from '../types/bond';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export async function calculateBond(
  body: CalculateBondRequest,
): Promise<BondResponse> {
  const res = await fetch(`${API_BASE}/bond/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      const json = JSON.parse(text);
      if (json.message) {
        message = Array.isArray(json.message) ? json.message.join(' ') : json.message;
      }
    } catch {
      // use text as-is
    }
    throw new Error(message || `Request failed: ${res.status}`);
  }

  return res.json();
}
