import { describe, it, expect } from 'vitest';
import {
  sanitizeText,
  sanitizeSearchQuery,
  sanitizeEmail,
  sanitizeRedirectUrl,
  validatePayloadSize,
  sanitizeObject,
} from './sanitize';

describe('sanitizeText', () => {
  it('strips <script> tags and contents', () => {
    const input = 'Hello <script>alert("XSS")</script> Varanasi';
    expect(sanitizeText(input)).toBe('Hello  Varanasi');
  });

  it('strips HTML tags and attributes', () => {
    const input = '<div class="banner" onclick="stealCookies()">Ghats of Kashi</div>';
    expect(sanitizeText(input)).toBe('Ghats of Kashi');
  });

  it('removes null bytes and control characters', () => {
    const input = 'Varanasi\u0000\u0008\u001F City';
    expect(sanitizeText(input)).toBe('Varanasi City');
  });

  it('enforces maximum character lengths', () => {
    const input = 'A'.repeat(600);
    const sanitized = sanitizeText(input, 50);
    expect(sanitized.length).toBe(50);
  });
});

describe('sanitizeSearchQuery', () => {
  it('accepts valid queries', () => {
    const res = sanitizeSearchQuery('Assi Ghat');
    expect(res.valid).toBe(true);
    expect(res.query).toBe('Assi Ghat');
  });

  it('rejects queries shorter than min length', () => {
    const res = sanitizeSearchQuery('A');
    expect(res.valid).toBe(false);
    expect(res.error).toContain('at least 2');
  });

  it('rejects queries longer than max length', () => {
    const longQuery = 'B'.repeat(150);
    const res = sanitizeSearchQuery(longQuery, 2, 100);
    expect(res.valid).toBe(false);
    expect(res.error).toContain('maximum');
  });

  it('cleans malicious HTML from search queries', () => {
    const res = sanitizeSearchQuery('<img src=x onerror=alert(1)>Dashashwamedh');
    expect(res.valid).toBe(true);
    expect(res.query).toBe('Dashashwamedh');
  });
});

describe('sanitizeEmail', () => {
  it('normalizes valid emails to lowercase', () => {
    expect(sanitizeEmail('Traveler.Var@EXAMPLE.COM ')).toBe('traveler.var@example.com');
  });

  it('returns null for invalid email strings', () => {
    expect(sanitizeEmail('not-an-email')).toBeNull();
    expect(sanitizeEmail('test@')).toBeNull();
    expect(sanitizeEmail('<script>@test.com')).toBeNull();
  });
});

describe('sanitizeRedirectUrl (Open Redirect Prevention)', () => {
  it('allows safe relative paths', () => {
    expect(sanitizeRedirectUrl('/saved')).toBe('/saved');
    expect(sanitizeRedirectUrl('/explore?cat=ghats')).toBe('/explore?cat=ghats');
    expect(sanitizeRedirectUrl('/place/kashi-vishwanath')).toBe('/place/kashi-vishwanath');
  });

  it('blocks external absolute URLs', () => {
    expect(sanitizeRedirectUrl('https://evil-phishing.com/login')).toBe('/saved');
    expect(sanitizeRedirectUrl('http://attacker.com')).toBe('/saved');
  });

  it('blocks protocol-relative URLs (//)', () => {
    expect(sanitizeRedirectUrl('//evil.com')).toBe('/saved');
  });

  it('blocks backslash bypasses (/\\ and \\\\)', () => {
    expect(sanitizeRedirectUrl('/\\evil.com')).toBe('/saved');
    expect(sanitizeRedirectUrl('\\evil.com')).toBe('/saved');
  });

  it('blocks javascript: and data: URIs', () => {
    expect(sanitizeRedirectUrl('javascript:alert(document.cookie)')).toBe('/saved');
    expect(sanitizeRedirectUrl('data:text/html,<script>alert(1)</script>')).toBe('/saved');
  });

  it('blocks CRLF carriage return / header injection', () => {
    expect(sanitizeRedirectUrl('/saved\r\nSet-Cookie: admin=true')).toBe('/saved');
  });
});

describe('validatePayloadSize', () => {
  it('allows content-length within threshold', () => {
    expect(validatePayloadSize('5000', 10000)).toBe(true);
  });

  it('rejects content-length exceeding threshold', () => {
    expect(validatePayloadSize('150000', 100000)).toBe(false);
  });

  it('rejects invalid or negative content-length', () => {
    expect(validatePayloadSize('-50')).toBe(false);
    expect(validatePayloadSize('not-a-number')).toBe(false);
  });
});

describe('sanitizeObject (Prototype Pollution Defense)', () => {
  it('strips __proto__, constructor, and prototype keys', () => {
    const malicious = JSON.parse('{"name":"Test","__proto__":{"isAdmin":true},"constructor":{"prototype":{"polluted":true}}}');
    const cleaned = sanitizeObject(malicious);
    expect(cleaned).toBeDefined();
    expect((cleaned as Record<string, unknown>).name).toBe('Test');
    expect(Object.prototype.hasOwnProperty.call(cleaned, '__proto__')).toBe(false);
    expect((cleaned as Record<string, unknown>).constructor).toBeUndefined();
  });
});
