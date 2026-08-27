import { describe, it, expect } from 'vitest';
import { calculateAQIStatus, getFallbackAirQuality } from './air-quality';

describe('Air Quality API Utilities', () => {
  describe('calculateAQIStatus', () => {
    it('categorizes AQI <= 50 as Good', () => {
      const result = calculateAQIStatus(35);
      expect(result.status).toBe('Good');
      expect(result.statusText).toBe('Clean & Fresh');
      expect(result.badgeColor).toContain('emerald');
    });

    it('categorizes AQI 51 - 100 as Moderate', () => {
      const result = calculateAQIStatus(75);
      expect(result.status).toBe('Moderate');
      expect(result.statusText).toBe('Acceptable Air');
      expect(result.badgeColor).toContain('amber');
    });

    it('categorizes AQI 101 - 150 as Poor', () => {
      const result = calculateAQIStatus(125);
      expect(result.status).toBe('Poor');
      expect(result.statusText).toBe('Unhealthy for Sensitive Groups');
      expect(result.badgeColor).toContain('orange');
    });

    it('categorizes AQI > 150 as Unhealthy', () => {
      const result = calculateAQIStatus(185);
      expect(result.status).toBe('Unhealthy');
      expect(result.statusText).toBe('Elevated Dust / Smoke');
      expect(result.badgeColor).toContain('rose');
    });
  });

  describe('getFallbackAirQuality', () => {
    it('returns valid fallback air quality structure', () => {
      const fallback = getFallbackAirQuality();
      expect(fallback.aqi).toBe(68);
      expect(fallback.pm25).toBe(36);
      expect(fallback.status).toBe('Moderate');
      expect(fallback.source).toBe('fallback');
    });
  });
});
