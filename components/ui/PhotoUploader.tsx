'use client';

import React, { useState, useRef } from 'react';
import { Camera, X, Loader2 } from 'lucide-react';
import { uploadPlacePhoto } from '@/lib/supabase/storage';
import { useSavedPlaces } from '@/lib/context/SavedPlacesContext';

interface PhotoUploaderProps {
  placeId: string;
  onPhotoUploaded: (url: string) => void;
  className?: string;
}

export function PhotoUploader({ placeId, onPhotoUploaded, className = '' }: PhotoUploaderProps) {
  const { user } = useSavedPlaces();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setIsUploading(true);

    try {
      const result = await uploadPlacePhoto(file, user?.id, placeId);
      if (result.error) {
        setErrorMsg(result.error);
      } else if (result.url) {
        setPreviewUrl(result.url);
        onPhotoUploaded(result.url);
      }
    } catch {
      setErrorMsg('Failed to process image. Please try another photo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        className="hidden"
        id={`photo-input-${placeId}`}
      />

      {previewUrl ? (
        <div className="relative h-28 w-full overflow-hidden rounded-2xl border border-[#E8D9C0] dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Place capture" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            title="Remove photo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#E8D9C0] dark:border-slate-700 bg-[#FAF6EF] dark:bg-slate-900/60 p-3 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-[#0E7490] hover:text-[#0E7490] dark:hover:text-[#38BDF8] transition-colors"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#0E7490]" />
              <span>Optimizing & Saving Photo...</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4 text-[#0E7490] dark:text-[#38BDF8]" />
              <span>Attach Personal Photo / Memory</span>
            </>
          )}
        </button>
      )}

      {errorMsg && (
        <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
