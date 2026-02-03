-- Table des profils artisans
CREATE TABLE IF NOT EXISTS artisan_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text,
  logo_url text,
  google_place_id text,
  google_place_label text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE artisan_profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'profiles_select_own'
  ) THEN
    CREATE POLICY "profiles_select_own"
      ON artisan_profiles FOR SELECT
      USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'profiles_insert_own'
  ) THEN
    CREATE POLICY "profiles_insert_own"
      ON artisan_profiles FOR INSERT
      WITH CHECK (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'profiles_update_own'
  ) THEN
    CREATE POLICY "profiles_update_own"
      ON artisan_profiles FOR UPDATE
      USING (auth.uid() = id);
  END IF;
END$$;
