/**
 * ==============================================================================
 * Mapporae Security: Input Sanitization & Payload Validation
 * ==============================================================================
 * Comprehensive defenses against Cross-Site Scripting (XSS), Open Redirects,
 * Prototype Pollution, Null-Byte Injection, and Oversized Payloads.
 */

import { z } from 'zod';

/**
 * Strips HTML tags, script injection patterns, null bytes, and control characters.
 */
export function sanitizeText(input: unknown, maxLength = 500): string {
  if (typeof input !== 'string') {
    return '';
  }

  let sanitized = input
    // Remove null bytes and non-printable control characters
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g, '')
    // Remove HTML script/style tags and contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Remove all remaining HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove javascript: and data: URI schemes
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:/gi, '')
    // Remove event handlers like onload=, onerror=, onclick=
    .replace(/on\w+\s*=/gi, '')
    .trim();

  // Enforce max length constraint
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength).trim();
  }

  return sanitized;
}

/**
 * Validates and sanitizes search queries for geocoding and local discovery.
 */
export function sanitizeSearchQuery(
  rawQuery: unknown,
  minLen = 2,
  maxLen = 100
): { valid: boolean; error?: string; query: string } {
  if (!rawQuery || typeof rawQuery !== 'string') {
    return { valid: false, error: 'Query parameter "q" is required', query: '' };
  }

  const cleaned = sanitizeText(rawQuery, maxLen);

  if (cleaned.length < minLen) {
    return {
      valid: false,
      error: `Query must be at least ${minLen} characters`,
      query: cleaned,
    };
  }

  if (rawQuery.length > maxLen) {
    return {
      valid: false,
      error: `Query exceeds maximum allowed length (${maxLen} characters)`,
      query: cleaned,
    };
  }

  return { valid: true, query: cleaned };
}

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email()
  .max(100);

/**
 * Validates and normalizes email addresses.
 */
export function sanitizeEmail(rawEmail: unknown): string | null {
  const result = emailSchema.safeParse(rawEmail);
  return result.success ? result.data : null;
}

/**
 * Open Redirect Prevention:
 * Validates redirect URLs ensuring they are strictly safe relative application paths.
 * Rejects absolute URLs, protocol-relative URLs (`//evil.com`), backslash bypasses (`/\evil.com`),
 * and JavaScript/Data URIs.
 */
export function sanitizeRedirectUrl(target: string | null | undefined, defaultUrl = '/saved'): string {
  if (!target || typeof target !== 'string') {
    return defaultUrl;
  }

  const trimmed = target.trim();

  // Reject URLs with explicit protocols (http:, https:, javascript:, data:, etc.)
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return defaultUrl;
  }

  // Reject protocol-relative URLs (//) and backslash bypasses (/\ or \\)
  if (trimmed.startsWith('//') || trimmed.startsWith('/\\') || trimmed.startsWith('\\')) {
    return defaultUrl;
  }

  // Reject carriage returns / line breaks (HTTP Response Splitting)
  if (/[\r\n]/.test(trimmed)) {
    return defaultUrl;
  }

  // Must strictly start with a single '/'
  if (!trimmed.startsWith('/')) {
    return defaultUrl;
  }

  // Ensure safe path characters
  const safePathRegex = /^\/[a-zA-Z0-9/_\-?&=#.%]*$/;
  if (!safePathRegex.test(trimmed)) {
    return defaultUrl;
  }

  return trimmed;
}

/**
 * Validates payload byte sizes to prevent memory exhaustion and DoS.
 */
export function validatePayloadSize(
  contentLengthHeader: string | null | undefined,
  maxBytes = 100 * 1024 // 100 KB default
): boolean {
  if (!contentLengthHeader) {
    return true;
  }

  const parsed = parseInt(contentLengthHeader, 10);
  if (isNaN(parsed) || parsed < 0) {
    return false;
  }

  return parsed <= maxBytes;
}

/**
 * Sanitizes an object to protect against Prototype Pollution (`__proto__`, `constructor`, `prototype`).
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: unknown): T | null {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return null;
  }

  const cleanObj = Object.create(null) as T;

  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    // Drop prototype pollution keys
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      (cleanObj as Record<string, unknown>)[key] = sanitizeObject(value as Record<string, unknown>);
    } else if (typeof value === 'string') {
      (cleanObj as Record<string, unknown>)[key] = sanitizeText(value);
    } else {
      (cleanObj as Record<string, unknown>)[key] = value;
    }
  }

  return cleanObj;
}
