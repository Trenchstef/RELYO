# Base de données RELYO

## Créer la table `reviews`

### Option 1 : Supabase Dashboard (recommandé pour démarrer)

1. Ouvre [Supabase](https://app.supabase.com) → ton projet.
2. Va dans **SQL Editor** → **New query**.
3. Copie-colle le contenu de **`supabase/seed-or-run.sql`**.
4. Clique sur **Run**.

La table `reviews` et les index seront créés.

### Option 2 : Supabase CLI

Si tu as installé [Supabase CLI](https://supabase.com/docs/guides/cli) et lié le projet :

```bash
supabase db push
```

Les fichiers dans `supabase/migrations/` seront appliqués.

---

## Structure de la table `reviews`

| Colonne      | Type        | Description                          |
|-------------|-------------|--------------------------------------|
| `id`        | uuid        | Clé primaire (générée)               |
| `created_at`| timestamptz | Date de création                     |
| `artisan_id`| uuid        | Référence vers `auth.users(id)`      |
| `client_name` | text      | Nom du client                        |
| `token`     | uuid        | Token pour la page /avis/[token]     |
| `rating`    | int2        | Note (ex. 1–5)                       |
| `comment`   | text        | Commentaire du client                |
| `status`    | text        | Ex. `pending`, `published` (défaut: `pending`) |
