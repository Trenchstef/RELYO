-- Activer RLS sur la table reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies artisan (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'reviews_select_own'
  ) THEN
    CREATE POLICY "reviews_select_own"
      ON reviews FOR SELECT
      USING (auth.uid() = artisan_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'reviews_insert_own'
  ) THEN
    CREATE POLICY "reviews_insert_own"
      ON reviews FOR INSERT
      WITH CHECK (auth.uid() = artisan_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'reviews_update_own'
  ) THEN
    CREATE POLICY "reviews_update_own"
      ON reviews FOR UPDATE
      USING (auth.uid() = artisan_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'reviews_delete_own'
  ) THEN
    CREATE POLICY "reviews_delete_own"
      ON reviews FOR DELETE
      USING (auth.uid() = artisan_id);
  END IF;
END$$;
