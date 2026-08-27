import { describe, it, expect } from 'vitest';
import { submitPlaceReview, fetchPlaceReviews } from './reviews';

describe('Place Reviews API (lib/api/reviews)', () => {
  it('rejects short review comments (< 5 characters)', async () => {
    const result = await submitPlaceReview({
      placeId: 'assi-ghat',
      rating: 5,
      comment: 'hi',
    });
    expect(result.error).toBeDefined();
    expect(result.error).toContain('at least 5 characters');
  });

  it('rejects invalid ratings outside 1 to 5 range', async () => {
    const result = await submitPlaceReview({
      placeId: 'assi-ghat',
      rating: 6,
      comment: 'Awesome sunrise view on the ghat.',
    });
    expect(result.error).toBeDefined();
    expect(result.error).toContain('between 1 and 5');
  });

  it('handles fetchPlaceReviews gracefully in unauthenticated or test environment', async () => {
    const reviews = await fetchPlaceReviews('assi-ghat');
    expect(Array.isArray(reviews)).toBe(true);
  });
});
