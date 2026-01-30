-- Table des avis clients (RELYO)
-- Copie ce fichier dans Supabase : Dashboard → SQL Editor → New query → Coller → Run

CREATE TABLE IF NOT EXISTS reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  artisan_id uuid REFERENCES auth.users(id),
  client_name text,
  token uuid DEFAULT gen_random_uuid(),
  rating int2,
  comment text,
  status text DEFAULT 'pending'
);

CREATE INDEX IF NOT EXISTS idx_reviews_token ON reviews(token);
CREATE INDEX IF NOT EXISTS idx_reviews_artisan_id ON reviews(artisan_id);
