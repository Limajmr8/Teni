import { createAdminClient } from '@/lib/supabase/admin';

export const logError = async (message: string, context: Record<string, unknown>) => {
  try {
    const supabase = createAdminClient();
    await supabase.from('logs').insert({ level: 'error', message, context_json: context });
  } catch {
    // Swallow logging errors to avoid crashing API routes.
  }
};
