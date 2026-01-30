-- Table des avis clients (RELYO)
-- Exécuter dans Supabase : Dashboard → SQL Editor → New query, puis Run

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

-- Index pour retrouver un avis par token (page /avis/[token])
CREATE INDEX IF NOT EXISTS idx_reviews_token ON reviews(token);

-- Index pour lister les avis par artisan
CREATE INDEX IF NOT EXISTS idx_reviews_artisan_id ON reviews(artisan_id);
