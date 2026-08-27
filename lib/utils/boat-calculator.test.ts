import { describe, it, expect } from 'vitest';
import { calculateBoatFare, BOAT_TYPES, TRIP_TYPES } from './boat-calculator';

describe('BoatFareCalculator (lib/utils/boat-calculator)', () => {
  it('defines valid boat types and trip types', () => {
    expect(BOAT_TYPES.length).toBeGreaterThanOrEqual(4);
    expect(TRIP_TYPES.length).toBeGreaterThanOrEqual(4);
  });

  it('calculates fair price for private sunrise rowing boat', () => {
    const result = calculateBoatFare({
      boatType: 'rowing',
      tripType: 'sunrise_cruise',
      passengers: 2,
      isPrivate: true,
    });

    expect(result.minPrice).toBe(800);
    expect(result.maxPrice).toBe(1200);
    expect(result.recommendedPrice).toBeGreaterThanOrEqual(800);
    expect(result.recommendedPrice).toBeLessThanOrEqual(1200);
    expect(result.durationMinutes).toBe(90);
    expect(result.tips.length).toBeGreaterThan(0);
  });

  it('calculates shared per-person tariff correctly', () => {
    const result = calculateBoatFare({
      boatType: 'motor',
      tripType: 'aarti_anchor',
      passengers: 3,
      isPrivate: false,
    });

    expect(result.minPrice).toBe(750); // 250 * 3
    expect(result.maxPrice).toBe(1200); // 400 * 3
    expect(result.durationMinutes).toBe(90);
  });

  it('handles bounds and large passenger groups gracefully', () => {
    const result = calculateBoatFare({
      boatType: 'bajra',
      tripType: 'full_circuit',
      passengers: 30,
      isPrivate: true,
    });

    expect(result.minPrice).toBe(7000);
    expect(result.maxPrice).toBe(11000);
    expect(result.durationMinutes).toBe(150);
    expect(result.distanceKm).toBe(12.0);
  });
});
