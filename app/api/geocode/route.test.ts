import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from './route';

function createMockRequest(url: string): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost:3000'));
}

describe('Geocoding Server Route (app/api/geocode)', () => {
  it('returns 400 when query parameter "q" is missing', async () => {
    const req = createMockRequest('http://localhost:3000/api/geocode');
    const res = await GET(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe('Query parameter "q" is required');
  });

  it('returns 400 when query parameter "q" is less than 2 characters', async () => {
    const req = createMockRequest('http://localhost:3000/api/geocode?q=a');
    const res = await GET(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe('Query must be at least 2 characters');
  });

  it('returns 400 when query parameter "q" exceeds 100 characters', async () => {
    const longQuery = 'v'.repeat(101);
    const req = createMockRequest(`http://localhost:3000/api/geocode?q=${longQuery}`);
    const res = await GET(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe('Query exceeds maximum allowed length (100 characters)');
  });

  it('returns matching local presets instantly for Varanasi landmark query', async () => {
    const req = createMockRequest('http://localhost:3000/api/geocode?q=Ghat');
    const res = await GET(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.source).toBe('preset');
    expect(data.cached).toBe(true);
    expect(Array.isArray(data.results)).toBe(true);
    expect(data.results.length).toBeGreaterThan(0);
  });
});
