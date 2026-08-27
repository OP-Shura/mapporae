/**
 * ==============================================================================
 * Mapporae Reviews API: Community Reviews & Ratings Engine
 * ==============================================================================
 * Manages fetching, submitting, and deleting verified place reviews in Supabase.
 */

import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { sanitizeText } from '@/lib/security/sanitize';

export interface PlaceReview {
  id: string;
  placeId: string;
  userId: string;
  userEmail?: string;
  rating: number;
  comment: string;
  visitorTip?: string;
  photos?: string[];
  createdAt: string;
  isVerified?: boolean;
}

export interface NewPlaceReviewInput {
  placeId: string;
  rating: number;
  comment: string;
  visitorTip?: string;
  photos?: string[];
}

/**
 * Fetches verified community reviews for a place
 */
export async function fetchPlaceReviews(placeId: string): Promise<PlaceReview[]> {
  const supabase = getSupabaseBrowserClient();

  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('place_reviews')
      .select('*')
      .eq('place_id', placeId)
      .order('created_at', { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map(r => ({
      id: r.id,
      placeId: r.place_id,
      userId: r.user_id,
      userEmail: r.user_email ? maskEmail(r.user_email) : 'Verified Traveler',
      rating: r.rating,
      comment: r.comment,
      visitorTip: r.visitor_tip || undefined,
      photos: r.photos || [],
      createdAt: r.created_at,
      isVerified: true,
    }));
  } catch {
    return [];
  }
}

/**
 * Submits a new user review with input sanitization
 */
export async function submitPlaceReview(
  input: NewPlaceReviewInput
): Promise<{ review?: PlaceReview; error?: string }> {
  const cleanComment = sanitizeText(input?.comment || '').trim();
  const cleanTip = input?.visitorTip ? sanitizeText(input.visitorTip).trim() : null;

  if (!cleanComment || cleanComment.length < 5) {
    return { error: 'Review comment must be at least 5 characters long.' };
  }

  if (typeof input.rating !== 'number' || input.rating < 1 || input.rating > 5) {
    return { error: 'Rating must be between 1 and 5 stars.' };
  }

  const supabase = getSupabaseBrowserClient();

  if (!isSupabaseConfigured || !supabase) {
    return { error: 'Database service is currently unavailable.' };
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    return { error: 'You must be signed in to submit a review.' };
  }

  try {
    const { data, error } = await supabase
      .from('place_reviews')
      .insert({
        place_id: input.placeId,
        user_id: userData.user.id,
        user_email: userData.user.email,
        rating: Math.round(input.rating),
        comment: cleanComment.slice(0, 1000),
        visitor_tip: cleanTip ? cleanTip.slice(0, 500) : null,
        photos: input.photos || [],
      })
      .select()
      .single();

    if (error || !data) {
      return { error: error?.message || 'Failed to submit review.' };
    }

    return {
      review: {
        id: data.id,
        placeId: data.place_id,
        userId: data.user_id,
        userEmail: data.user_email ? maskEmail(data.user_email) : 'You',
        rating: data.rating,
        comment: data.comment,
        visitorTip: data.visitor_tip || undefined,
        photos: data.photos || [],
        createdAt: data.created_at,
        isVerified: true,
      },
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Review submission failed.';
    return { error: msg };
  }
}

/**
 * Deletes a user's own review
 */
export async function deletePlaceReview(reviewId: string): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    const { error } = await supabase
      .from('place_reviews')
      .delete()
      .eq('id', reviewId);

    return !error;
  } catch {
    return false;
  }
}

/**
 * Masks email address for user privacy (e.g. j***@gmail.com)
 */
function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  if (!name || !domain) return 'Traveler';
  const visible = name.slice(0, 2);
  return `${visible}***@${domain}`;
}
