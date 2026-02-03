-- Bucket public pour les logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Policies storage pour le bucket logos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'logos_select_public'
  ) THEN
    CREATE POLICY "logos_select_public"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'logos');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'logos_insert_own'
  ) THEN
    CREATE POLICY "logos_insert_own"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'logos' AND auth.uid() = owner);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'logos_update_own'
  ) THEN
    CREATE POLICY "logos_update_own"
      ON storage.objects FOR UPDATE
      USING (bucket_id = 'logos' AND auth.uid() = owner);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'logos_delete_own'
  ) THEN
    CREATE POLICY "logos_delete_own"
      ON storage.objects FOR DELETE
      USING (bucket_id = 'logos' AND auth.uid() = owner);
  END IF;
END$$;
