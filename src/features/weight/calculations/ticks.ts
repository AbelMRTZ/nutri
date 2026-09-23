export type NiceScale = {
  min: number;
  max: number;
  ticks: number[];
};

/**
 * "Nice" axis ticks (same idea as d3's `ticks`/`nice`): rounds the domain
 * outward to clean step values (1/2/5 × a power of ten) so a weight axis
 * reads e.g. 76/78/80/82 kg instead of the raw min/max of whatever data
 * happens to be in the selected range.
 */
export function computeNiceScale(minValue: number, maxValue: number, tickCount = 4): NiceScale {
  const safeTickCount = Math.max(2, tickCount);
  const rawRange = maxValue - minValue;
  // A flat or single-point series has no range to divide into ticks —
  // pad it symmetrically so the one value still lands mid-axis.
  const range = rawRange > 0 ? rawRange : 2;
  const effectiveMin = rawRange > 0 ? minValue : minValue - 1;

  const rawStep = range / (safeTickCount - 1);
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalized = rawStep / magnitude;
  const niceNormalized = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  const step = niceNormalized * magnitude;

  const niceMin = Math.floor(effectiveMin / step) * step;
  const niceMax = Math.ceil((effectiveMin + range) / step) * step;

  const ticks: number[] = [];
  for (let value = niceMin; value <= niceMax + step / 2; value += step) {
    // Floating-point steps (e.g. 0.5, 0.1) can drift by a rounding hair over several additions.
    ticks.push(Math.round(value * 100) / 100);
  }

  return { min: niceMin, max: niceMax, ticks };
}
