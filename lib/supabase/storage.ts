/**
 * ==============================================================================
 * Mapporae Storage: Photo Upload & Compression Utilities
 * ==============================================================================
 * Manages user-contributed place photos with client-side image compression,
 * MIME type sanitization, and fallback to local Base64 storage when offline.
 */

import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';

export interface PhotoUploadResult {
  url: string;
  isLocal: boolean;
  error?: string;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB raw limit

/**
 * Compresses an image file in the browser using HTML5 Canvas to optimize performance
 */
export async function compressImage(
  file: File,
  maxWidth = 1400,
  quality = 0.82
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Basic MIME validation
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return reject(new Error('Invalid image format. Supported formats: JPEG, PNG, WEBP.'));
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return reject(new Error('Image exceeds maximum allowed size of 5 MB.'));
    }

    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(file);
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          blob => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to parse image file.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Converts a Blob to a Base64 Data URL for local offline persistence
 */
export async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Uploads a photo to Supabase storage or converts to local data URL when offline
 */
export async function uploadPlacePhoto(
  file: File,
  userId?: string,
  placeId?: string
): Promise<PhotoUploadResult> {
  try {
    const compressedBlob = await compressImage(file);
    const supabase = getSupabaseBrowserClient();

    // If Supabase is active and user is signed in, try cloud storage
    if (isSupabaseConfigured && supabase && userId) {
      const cleanPlaceId = placeId ? placeId.replace(/[^a-zA-Z0-9_-]/g, '') : 'general';
      const fileName = `${userId}/${cleanPlaceId}_${Date.now()}.jpg`;

      const { data, error } = await supabase.storage
        .from('place-photos')
        .upload(fileName, compressedBlob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('place-photos')
          .getPublicUrl(fileName);

        return {
          url: publicUrlData.publicUrl,
          isLocal: false,
        };
      }
    }

    // Fallback: Store locally as compressed Base64 Data URL
    const localDataUrl = await blobToDataUrl(compressedBlob);
    return {
      url: localDataUrl,
      isLocal: true,
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : 'Photo upload failed';
    return {
      url: '',
      isLocal: true,
      error: errMsg,
    };
  }
}
