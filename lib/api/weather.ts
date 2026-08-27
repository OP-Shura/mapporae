import { WeatherData } from '@/lib/types';
import { logger } from '@/lib/logger';

/**
 * Open-Meteo Weather Adapter for Varanasi (Lat: 25.3176, Lon: 82.9739).
 * Respects free Open-Meteo usage policies (no API key required).
 * Gracefully falls back to high-fidelity mock weather data on network failure or rate limiting.
 */

const VARANASI_LAT = 25.3176;
const VARANASI_LNG = 82.9739;

export async function fetchCurrentWeather(): Promise<WeatherData> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${VARANASI_LAT}&longitude=${VARANASI_LNG}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=sunrise,sunset&timezone=Asia%2FKolkata&forecast_days=1`;

    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 900 }, // Cache for 15 mins in Next.js
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Open-Meteo HTTP ${res.status}`);
    }

    const data = await res.json();
    const current = data.current;
    const daily = data.daily;

    const weatherCode = current?.weather_code ?? 0;
    const { weatherText } = interpretWeatherCode(weatherCode);

    const sunriseIso = daily?.sunrise?.[0];
    const sunsetIso = daily?.sunset?.[0];

    const sunrise = sunriseIso ? formatTime(sunriseIso) : '05:32 AM';
    const sunset = sunsetIso ? formatTime(sunsetIso) : '06:24 PM';

    logger.info('Fetched live Varanasi weather successfully', { component: 'WeatherAPI' });

    return {
      temp: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: Math.round(current.relative_humidity_2m),
      windSpeed: Math.round(current.wind_speed_10m),
      weatherCode,
      weatherText,
      sunrise,
      sunset,
      isDay: Boolean(current.is_day),
      lastUpdated: new Date().toISOString(),
      source: 'open-meteo',
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Weather fetch error';
    logger.warn(`Open-Meteo weather fetch failed (${msg}), using resilient fallback`, { component: 'WeatherAPI', error: msg });
    return getFallbackWeather();
  }
}

export function getFallbackWeather(): WeatherData {
  return {
    temp: 28,
    feelsLike: 30,
    humidity: 62,
    windSpeed: 8,
    weatherCode: 1,
    weatherText: 'Partly Sunny & Mild',
    sunrise: '05:32 AM',
    sunset: '06:24 PM',
    isDay: true,
    lastUpdated: new Date().toISOString(),
    source: 'fallback',
  };
}

export function interpretWeatherCode(code: number): { weatherText: string } {
  switch (code) {
    case 0:
      return { weatherText: 'Clear Sky' };
    case 1:
    case 2:
      return { weatherText: 'Mainly Clear' };
    case 3:
      return { weatherText: 'Partly Cloudy' };
    case 45:
    case 48:
      return { weatherText: 'Misty / Foggy' };
    case 51:
    case 53:
    case 55:
      return { weatherText: 'Light Drizzle' };
    case 61:
    case 63:
    case 65:
      return { weatherText: 'Rain' };
    case 80:
    case 81:
    case 82:
      return { weatherText: 'Passing Showers' };
    case 95:
    case 96:
    case 99:
      return { weatherText: 'Thunderstorm' };
    default:
      return { weatherText: 'Pleasant & Warm' };
  }
}

function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });
  } catch {
    return '05:30 AM';
  }
}
