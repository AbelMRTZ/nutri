import {
  calculateActivityCalories,
  calculateRunningSpeedKmh,
  HIKING_MET,
  interpolateRunningMet,
  RUNNING_MET_TABLE,
  STRENGTH_MET,
} from './calories';

describe('calculateActivityCalories', () => {
  it('applies (MET-1) x weight x (minutes/60)', () => {
    // Fuerza Moderada (MET 5), 80kg, 45 minutes: (5-1) x 80 x (45/60) = 240
    expect(calculateActivityCalories(STRENGTH_MET.moderate, 80, 45)).toBeCloseTo(240, 5);
  });

  it('matches a known Senderismo example', () => {
    // Trail (MET 9), 70kg, 90 minutes: (9-1) x 70 x 1.5 = 840
    expect(calculateActivityCalories(HIKING_MET.trail, 70, 90)).toBeCloseTo(840, 5);
  });
});

describe('calculateRunningSpeedKmh', () => {
  it('divides distance by hours', () => {
    expect(calculateRunningSpeedKmh(10, 60)).toBeCloseTo(10, 5);
    expect(calculateRunningSpeedKmh(5, 30)).toBeCloseTo(10, 5);
  });
});

describe('interpolateRunningMet', () => {
  it('returns the exact MET for a tabulated speed', () => {
    for (const point of RUNNING_MET_TABLE) {
      expect(interpolateRunningMet(point.speedKmh)).toBeCloseTo(point.met, 5);
    }
  });

  it('linearly interpolates between two table points', () => {
    // Midpoint between 8.0km/h (8.3 MET) and 8.4km/h (9.0 MET) -> 8.2km/h -> 8.65 MET
    expect(interpolateRunningMet(8.2)).toBeCloseTo(8.65, 5);
  });

  it('interpolates proportionally, not just at the midpoint', () => {
    // 25% of the way from 12.0 (11.5 MET) to 12.9 (11.8 MET)
    const quarterSpeed = 12.0 + (12.9 - 12.0) * 0.25;
    expect(interpolateRunningMet(quarterSpeed)).toBeCloseTo(11.5 + (11.8 - 11.5) * 0.25, 5);
  });

  it('clamps to the lowest MET below the table range', () => {
    expect(interpolateRunningMet(5)).toBe(8.3);
    expect(interpolateRunningMet(0)).toBe(8.3);
  });

  it('clamps to the highest MET above the table range', () => {
    expect(interpolateRunningMet(30)).toBe(23.0);
  });
});
