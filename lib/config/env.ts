import { z } from 'zod';

const isPlaceholder = (val?: string | null) => {
  if (!val) return true;
  const lower = val.toLowerCase().trim();
  return (
    lower === '' ||
    lower.includes('your-project') ||
    lower.includes('your-supabase') ||
    lower.includes('your-anon-key') ||
    lower.includes('replace-with') ||
    lower.includes('your-domain.example')
  );
};

export const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url()
    .optional()
    .transform(val => (isPlaceholder(val) ? undefined : val)),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(10)
    .optional()
    .transform(val => (isPlaceholder(val) ? undefined : val)),
  NOMINATIM_USER_AGENT: z
    .string()
    .optional()
    .transform(val => (isPlaceholder(val) ? undefined : val)),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
});

export type Env = z.infer<typeof envSchema>;

export type ValidatedEnv = Env & { isSupabaseConfigured: boolean };

function parseEnv(): ValidatedEnv {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NOMINATIM_USER_AGENT: process.env.NOMINATIM_USER_AGENT,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!result.success) {
    // Graceful fallback for invalid/empty configurations
    return {
      NEXT_PUBLIC_SUPABASE_URL: undefined,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: undefined,
      NOMINATIM_USER_AGENT: undefined,
      NODE_ENV: (process.env.NODE_ENV as 'development' | 'test' | 'production') || 'development',
      isSupabaseConfigured: false,
    };
  }

  const data = result.data;
  const isSupabaseConfigured = Boolean(
    data.NEXT_PUBLIC_SUPABASE_URL &&
    data.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    data.NEXT_PUBLIC_SUPABASE_URL.startsWith('http')
  );

  return {
    ...data,
    isSupabaseConfigured,
  };
}

export const env = parseEnv();

export function getEnv(): ValidatedEnv {
  return env;
}
