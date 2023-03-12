import { createClient } from '@supabase/auth-helpers-sveltekit'
import { createClient as createSecretClient } from '@supabase/supabase-js'

export const db = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export const dbSecret = createSecretClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_SECRET_KEY
)