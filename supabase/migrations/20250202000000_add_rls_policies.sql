-- Activer RLS sur la table reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Les artisans lisent uniquement leurs propres avis
CREATE POLICY IF NOT EXISTS "reviews_select_own"
  ON reviews FOR SELECT
  USING (auth.uid() = artisan_id);

-- Les artisans créent uniquement leurs propres avis
CREATE POLICY IF NOT EXISTS "reviews_insert_own"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = artisan_id);

-- Les artisans mettent à jour uniquement leurs propres avis
CREATE POLICY IF NOT EXISTS "reviews_update_own"
  ON reviews FOR UPDATE
  USING (auth.uid() = artisan_id);

-- Les artisans suppriment uniquement leurs propres avis
CREATE POLICY IF NOT EXISTS "reviews_delete_own"
  ON reviews FOR DELETE
  USING (auth.uid() = artisan_id);
