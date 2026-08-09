import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type LedgerEntry = {
  id: string;
  customer_name: string;
  amount: number;
  type: 'credit' | 'debit';
  note: string | null;
  created_at: string;
};
