-- Accès public par token pour la page /avis/[token]
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'reviews_select_by_token'
  ) THEN
    CREATE POLICY "reviews_select_by_token"
      ON reviews FOR SELECT
      USING (token IS NOT NULL);
  END IF;
END$$;

-- Autoriser la mise à jour publique d'un avis via son token
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'reviews_update_by_token'
  ) THEN
    CREATE POLICY "reviews_update_by_token"
      ON reviews FOR UPDATE
      USING (token IS NOT NULL AND rating IS NULL)
      WITH CHECK (token IS NOT NULL AND rating IS NOT NULL);
  END IF;
END$$;
