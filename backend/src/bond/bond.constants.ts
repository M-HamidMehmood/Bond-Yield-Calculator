/**
 * YTM (yield-to-maturity) solver configuration.
 * Max is the upper bound for the solver; 100% allows distressed / edge-case bonds.
 */
export const YTM_YIELD_MIN = 0;
export const YTM_YIELD_MAX = 100;
export const YTM_PRICE_TOLERANCE = 0.01; // $0.01 of market price
export const YTM_MAX_ITERATIONS = 100;

/** Tolerance for "par" (market price equals face value). */
export const PAR_TOLERANCE = 1e-6;
