import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';

export { isSupabaseConfigured };

/**
 * Supabase client instance accessor for backward compatibility.
 * Prefer using `getSupabaseBrowserClient()` or `createSupabaseServerClient()`.
 */
export const supabase = getSupabaseBrowserClient();
