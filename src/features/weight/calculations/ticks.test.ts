import { computeNiceScale } from './ticks';

describe('computeNiceScale', () => {
  it('rounds a tight range out to whole-number ticks', () => {
    expect(computeNiceScale(77.5, 80.5, 4)).toEqual({ min: 77, max: 81, ticks: [77, 78, 79, 80, 81] });
  });

  it('pads a single repeated value symmetrically so it lands mid-axis', () => {
    expect(computeNiceScale(78, 78, 4)).toEqual({ min: 77, max: 79, ticks: [77, 78, 79] });
  });

  it('picks a coarser step (5s) for a wide range', () => {
    expect(computeNiceScale(60, 140, 4)).toEqual({ min: 50, max: 150, ticks: [50, 100, 150] });
  });

  it('picks a clean step for a round range', () => {
    expect(computeNiceScale(0, 10, 3)).toEqual({ min: 0, max: 10, ticks: [0, 5, 10] });
  });

  it('clamps tickCount to a minimum of 2', () => {
    expect(computeNiceScale(0, 10, 1)).toEqual({ min: 0, max: 10, ticks: [0, 10] });
  });
});
