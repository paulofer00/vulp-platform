import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Cliente para o Frontend (Só lê dados)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente para o Backend/API (Gravar dados com permissão total)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);