import { describe, it, expect } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

describe('AI Chat Server Route (app/api/chat)', () => {
  it('rejects empty or missing message payloads with 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it('answers Ganga Aarti questions with curated Kashi timings', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'What time is the Ganga Aarti?' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.reply).toContain('Dashashwamedh Ghat');
    expect(data.reply).toContain('Assi Ghat');
  });

  it('answers boat fare queries with accurate guidance', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'How much does a boat ride cost in Varanasi?' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.reply).toContain('₹');
    expect(data.reply).toContain('boat');
  });

  it('answers food questions in Hindi or English', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'Where to find authentic chaat and lassi?' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.reply).toContain('Chaat');
    expect(data.reply).toContain('Lassi');
  });
});
