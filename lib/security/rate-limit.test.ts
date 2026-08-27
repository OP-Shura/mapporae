import { describe, it, expect, beforeEach } from 'vitest';
import { RateLimiter, getClientIp, getRateLimitHeaders, RATE_LIMIT_POLICIES } from './rate-limit';

describe('RateLimiter', () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    limiter = new RateLimiter();
  });

  it('allows requests within policy limits', () => {
    const policy = { maxRequests: 3, windowMs: 1000, prefix: 'test' };
    const res1 = limiter.check('user-1', policy);
    expect(res1.allowed).toBe(true);
    expect(res1.remaining).toBe(2);
    expect(res1.limit).toBe(3);

    const res2 = limiter.check('user-1', policy);
    expect(res2.allowed).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = limiter.check('user-1', policy);
    expect(res3.allowed).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it('blocks requests when exceeding maxRequests', () => {
    const policy = { maxRequests: 2, windowMs: 1000, prefix: 'test' };
    limiter.check('user-2', policy);
    limiter.check('user-2', policy);

    const blocked = limiter.check('user-2', policy);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
  });

  it('enforces separate limits for different identifiers', () => {
    const policy = { maxRequests: 1, windowMs: 1000, prefix: 'test' };
    const resA = limiter.check('ip-A', policy);
    const resB = limiter.check('ip-B', policy);

    expect(resA.allowed).toBe(true);
    expect(resB.allowed).toBe(true);

    expect(limiter.check('ip-A', policy).allowed).toBe(false);
    expect(limiter.check('ip-B', policy).allowed).toBe(false);
  });

  it('enforces exact auth policy (max 5 requests per 15 minutes)', () => {
    const ip = '192.168.1.100';
    for (let i = 0; i < 5; i++) {
      const res = limiter.check(ip, RATE_LIMIT_POLICIES.AUTH);
      expect(res.allowed).toBe(true);
      expect(res.limit).toBe(5);
    }

    const blocked = limiter.check(ip, RATE_LIMIT_POLICIES.AUTH);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
  });

  it('resets key correctly', () => {
    const policy = { maxRequests: 1, windowMs: 5000, prefix: 'auth' };
    limiter.check('user-reset', policy);
    expect(limiter.check('user-reset', policy).allowed).toBe(false);

    limiter.reset('user-reset', 'auth');
    expect(limiter.check('user-reset', policy).allowed).toBe(true);
  });
});

describe('getClientIp', () => {
  it('extracts first IP from x-forwarded-for header', () => {
    const headers = new Headers({
      'x-forwarded-for': '203.0.113.195, 70.41.3.18, 150.172.238.178',
    });
    expect(getClientIp(headers)).toBe('203.0.113.195');
  });

  it('falls back to x-real-ip when x-forwarded-for is missing', () => {
    const headers = new Headers({
      'x-real-ip': '198.51.100.42',
    });
    expect(getClientIp(headers)).toBe('198.51.100.42');
  });

  it('falls back to default 127.0.0.1 if no IP headers are present or invalid', () => {
    const headers = new Headers();
    expect(getClientIp(headers)).toBe('127.0.0.1');

    const invalidHeaders = new Headers({ 'x-forwarded-for': 'invalid-ip-string-that-is-malicious' });
    expect(getClientIp(invalidHeaders)).toBe('127.0.0.1');
  });
});

describe('getRateLimitHeaders', () => {
  it('produces valid headers when allowed', () => {
    const headers = getRateLimitHeaders({
      allowed: true,
      limit: 60,
      remaining: 59,
      resetTimeMs: Date.now() + 60000,
      retryAfterSec: 0,
    });

    expect(headers['X-RateLimit-Limit']).toBe('60');
    expect(headers['X-RateLimit-Remaining']).toBe('59');
    expect(headers['X-RateLimit-Reset']).toBeDefined();
    expect(headers['Retry-After']).toBeUndefined();
  });

  it('includes Retry-After when rate limited', () => {
    const headers = getRateLimitHeaders({
      allowed: false,
      limit: 5,
      remaining: 0,
      resetTimeMs: Date.now() + 900000,
      retryAfterSec: 900,
    });

    expect(headers['X-RateLimit-Limit']).toBe('5');
    expect(headers['X-RateLimit-Remaining']).toBe('0');
    expect(headers['Retry-After']).toBe('900');
  });
});
