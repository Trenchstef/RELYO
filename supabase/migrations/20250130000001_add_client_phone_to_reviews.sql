-- Ajout du téléphone client pour les demandes d'avis
ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS client_phone text;
