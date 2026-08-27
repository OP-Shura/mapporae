import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from './LanguageContext';

describe('LanguageContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to English', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LanguageProvider>{children}</LanguageProvider>
    );
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.language).toBe('en');
    expect(result.current.isHindi).toBe(false);
    expect(result.current.t('nav.home')).toBe('Home');
  });

  it('switches to Hindi and translates strings', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LanguageProvider>{children}</LanguageProvider>
    );
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => {
      result.current.setLanguage('hi');
    });

    expect(result.current.language).toBe('hi');
    expect(result.current.isHindi).toBe(true);
    expect(result.current.t('nav.home')).toBe('मुख्य पृष्ठ');
    expect(result.current.t('nav.explore')).toBe('अन्वेषण और मानचित्र');
  });

  it('toggles language back and forth', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <LanguageProvider>{children}</LanguageProvider>
    );
    const { result } = renderHook(() => useLanguage(), { wrapper });

    act(() => {
      result.current.toggleLanguage();
    });
    expect(result.current.language).toBe('hi');

    act(() => {
      result.current.toggleLanguage();
    });
    expect(result.current.language).toBe('en');
  });
});
