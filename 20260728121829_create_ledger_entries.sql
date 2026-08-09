/*
# Create ledger_entries table (Patthi / Udhaar-Jama Book)

1. New Tables
  - `ledger_entries`
    - `id` (uuid, primary key)
    - `customer_name` (text, not null) — name of the person in the transaction
    - `amount` (numeric, not null) — transaction amount
    - `type` (text, not null) — either 'credit' (Jama) or 'debit' (Udhaar)
    - `note` (text, nullable) — optional note
    - `created_at` (timestamptz, default now())

2. Security
  - Enable RLS on `ledger_entries`
  - Allow anon + authenticated full CRUD (single-tenant app, no login required)
*/

CREATE TABLE IF NOT EXISTS ledger_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  amount numeric NOT NULL,
  type text NOT NULL CHECK (type IN ('credit', 'debit')),
  note text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_ledger" ON ledger_entries;
CREATE POLICY "anon_select_ledger" ON ledger_entries FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_ledger" ON ledger_entries;
CREATE POLICY "anon_insert_ledger" ON ledger_entries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_ledger" ON ledger_entries;
CREATE POLICY "anon_update_ledger" ON ledger_entries FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_ledger" ON ledger_entries;
CREATE POLICY "anon_delete_ledger" ON ledger_entries FOR DELETE
  TO anon, authenticated USING (true);
