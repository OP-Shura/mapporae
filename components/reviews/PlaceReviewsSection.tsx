'use client';

import React, { useState, useEffect } from 'react';
import { PlaceReview, fetchPlaceReviews, submitPlaceReview } from '@/lib/api/reviews';
import { useSavedPlaces } from '@/lib/context/SavedPlacesContext';
import { useLanguage } from '@/lib/context/LanguageContext';
import { PhotoUploader } from '@/components/ui/PhotoUploader';
import { 
  Star, 
  MessageSquare, 
  Sparkles, 
  Send, 
  Loader2, 
  ShieldCheck, 
  LogIn,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface PlaceReviewsSectionProps {
  placeId: string;
  placeName: string;
}

export function PlaceReviewsSection({ placeId, placeName }: PlaceReviewsSectionProps) {
  const { user } = useSavedPlaces();
  const { isHindi } = useLanguage();

  const [reviews, setReviews] = useState<PlaceReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [visitorTip, setVisitorTip] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadReviews() {
      setIsLoading(true);
      const data = await fetchPlaceReviews(placeId);
      if (isMounted) {
        setReviews(data);
        setIsLoading(false);
      }
    }
    loadReviews();
    return () => {
      isMounted = false;
    };
  }, [placeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    const result = await submitPlaceReview({
      placeId,
      rating,
      comment,
      visitorTip: visitorTip.trim() || undefined,
      photos: uploadedPhotos,
    });

    setIsSubmitting(false);

    if (result.error) {
      setErrorMsg(result.error);
    } else if (result.review) {
      setReviews(prev => [result.review!, ...prev]);
      setComment('');
      setVisitorTip('');
      setUploadedPhotos([]);
      setSuccessMsg(isHindi ? 'समीक्षा सफलतापूर्वक प्रकाशित हुई!' : 'Review posted successfully!');
      setIsFormOpen(false);
    }
  };

  const handlePhotoUploaded = (url: string) => {
    setUploadedPhotos(prev => [...prev, url]);
  };

  return (
    <div className="space-y-6 pt-6 border-t border-[#E8D9C0] dark:border-slate-800">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
              <MessageSquare className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-[#172554] dark:text-white">
              {isHindi ? 'यात्री समीक्षाएं एवं सुझाव' : 'Community Reviews & Visitor Tips'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isHindi
              ? `${reviews.length} यात्रियों द्वारा साझा किए गए प्रामाणिक अनुभव`
              : `${reviews.length} authentic impressions from verified visitors`}
          </p>
        </div>

        {user ? (
          <button
            type="button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-[#172554] dark:bg-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1E3A8A] transition-all"
          >
            <Star className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{isFormOpen ? (isHindi ? 'रद्द करें' : 'Cancel') : (isHindi ? 'समीक्षा लिखें' : 'Write Review')}</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <LogIn className="w-3.5 h-3.5 text-[#0E7490]" />
            <span>{isHindi ? 'समीक्षा लिखने हेतु साइन इन करें' : 'Sign in to leave a review'}</span>
          </div>
        )}
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 p-3 text-xs text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Review Submission Form */}
      {isFormOpen && user && (
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[#E8D9C0] dark:border-slate-800 bg-[#FAF6EF] dark:bg-slate-900 p-5 sm:p-6 space-y-4 shadow-sm animate-in fade-in zoom-in-95 duration-200"
        >
          <h4 className="text-sm font-bold text-[#172554] dark:text-white">
            {isHindi ? `${placeName} के लिए अपनी समीक्षा लिखें` : `Share your experience at ${placeName}`}
          </h4>

          {/* Star Rating Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              {isHindi ? 'रेटिंग चुनें' : 'Your Rating'}
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => {
                const isFilled = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-slate-300 hover:scale-110 transition-transform"
                    aria-label={`${star} star`}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        isFilled
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  </button>
                );
              })}
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 ml-2">
                {rating} / 5 {isHindi ? 'सितारे' : 'Stars'}
              </span>
            </div>
          </div>

          {/* Review Comment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              {isHindi ? 'आपकी समीक्षा (अनुभव)' : 'Review / Experience'}
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder={
                isHindi
                  ? 'यहां का वातावरण, समय, दर्शन या भीड़ कैसी थी?'
                  : 'How was the atmosphere, crowd, darshan, or experience?'
              }
              className="w-full rounded-2xl border border-[#E8D9C0] dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-[#0E7490]"
              maxLength={1000}
            />
          </div>

          {/* Visitor Tip */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              {isHindi ? 'अन्य यात्रियों के लिए उपयोगी सुझाव (वैकल्पिक)' : 'Visitor Tip / Advice for Others (Optional)'}
            </label>
            <input
              type="text"
              value={visitorTip}
              onChange={e => setVisitorTip(e.target.value)}
              placeholder={
                isHindi
                  ? 'उदा: सुबह 6 बजे से पहले आएं, जूते रखने की सुविधा पास में है...'
                  : 'e.g. Arrive before 6 AM for peace, locker available near gate...'
              }
              className="w-full rounded-2xl border border-[#E8D9C0] dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-[#0E7490]"
              maxLength={500}
            />
          </div>

          {/* Photo Uploader */}
          <div>
            <PhotoUploader placeId={placeId} onPhotoUploaded={handlePhotoUploaded} />
          </div>

          {errorMsg && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="rounded-2xl border border-[#E8D9C0] dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              {isHindi ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="flex items-center gap-1.5 rounded-2xl bg-[#0E7490] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#155E75] disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isHindi ? 'प्रकाशित हो रहा है...' : 'Posting...'}</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'समीक्षा प्रकाशित करें' : 'Publish Review'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="flex items-center justify-center p-8 text-xs text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin text-[#0E7490] mr-2" />
          <span>{isHindi ? 'समीक्षाएं लोड हो रही हैं...' : 'Loading community reviews...'}</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#E8D9C0] dark:border-slate-800 p-8 text-center bg-[#FAF6EF]/50 dark:bg-slate-900/40">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {isHindi
              ? 'इस स्थान के लिए अभी कोई समीक्षा नहीं है। पहले समीक्षाकर्ता बनें!'
              : 'No community reviews posted yet. Be the first to share your experience!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div
              key={review.id}
              className="rounded-3xl border border-[#E8D9C0] dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E0F2FE] dark:bg-slate-800 font-bold text-[11px] text-[#0E7490] dark:text-[#38BDF8]">
                    {review.userEmail?.slice(0, 1).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#172554] dark:text-white">
                      {review.userEmail}
                    </span>
                    <div className="flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{isHindi ? 'सत्यापित यात्री' : 'Verified'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating ? 'fill-amber-400' : 'text-slate-200 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 ml-1">
                    {new Date(review.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {review.comment}
              </p>

              {review.visitorTip && (
                <div className="flex items-start gap-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 p-2.5 text-xs text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900/60">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-tight">
                    <strong>{isHindi ? 'सुझाव: ' : 'Tip: '}</strong>
                    {review.visitorTip}
                  </span>
                </div>
              )}

              {review.photos && review.photos.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pt-1">
                  {review.photos.map((photo, pIdx) => (
                    <div
                      key={pIdx}
                      className="relative h-16 w-16 overflow-hidden rounded-xl border border-[#E8D9C0] dark:border-slate-700 shrink-0"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo} alt="User submission" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
