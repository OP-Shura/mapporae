import { describe, it, expect } from 'vitest';
import { interpretWeatherCode, getFallbackWeather } from './weather';

describe('Weather API Utilities', () => {
  describe('interpretWeatherCode', () => {
    it('returns Clear Sky for code 0', () => {
      expect(interpretWeatherCode(0)).toEqual({ weatherText: 'Clear Sky' });
    });

    it('returns Mainly Clear for codes 1 and 2', () => {
      expect(interpretWeatherCode(1)).toEqual({ weatherText: 'Mainly Clear' });
      expect(interpretWeatherCode(2)).toEqual({ weatherText: 'Mainly Clear' });
    });

    it('returns Partly Cloudy for code 3', () => {
      expect(interpretWeatherCode(3)).toEqual({ weatherText: 'Partly Cloudy' });
    });

    it('returns Misty / Foggy for codes 45 and 48', () => {
      expect(interpretWeatherCode(45)).toEqual({ weatherText: 'Misty / Foggy' });
      expect(interpretWeatherCode(48)).toEqual({ weatherText: 'Misty / Foggy' });
    });

    it('returns Rain for rain codes (61, 63, 65)', () => {
      expect(interpretWeatherCode(61)).toEqual({ weatherText: 'Rain' });
      expect(interpretWeatherCode(63)).toEqual({ weatherText: 'Rain' });
      expect(interpretWeatherCode(65)).toEqual({ weatherText: 'Rain' });
    });

    it('returns Thunderstorm for codes 95, 96, 99', () => {
      expect(interpretWeatherCode(95)).toEqual({ weatherText: 'Thunderstorm' });
      expect(interpretWeatherCode(96)).toEqual({ weatherText: 'Thunderstorm' });
      expect(interpretWeatherCode(99)).toEqual({ weatherText: 'Thunderstorm' });
    });

    it('returns fallback description for unknown code', () => {
      expect(interpretWeatherCode(999)).toEqual({ weatherText: 'Pleasant & Warm' });
    });
  });

  describe('getFallbackWeather', () => {
    it('provides valid complete fallback weather data for Varanasi', () => {
      const fallback = getFallbackWeather();
      expect(fallback.temp).toBeDefined();
      expect(fallback.feelsLike).toBeDefined();
      expect(fallback.humidity).toBeGreaterThan(0);
      expect(fallback.source).toBe('fallback');
      expect(fallback.sunrise).toBe('05:32 AM');
      expect(fallback.sunset).toBe('06:24 PM');
    });
  });
});
