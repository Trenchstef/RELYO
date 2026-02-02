# Configuration Supabase — RELYO

## 1. Installer les dépendances

À la racine du projet (où se trouve `package.json`) :

```bash
npm install
```

## 2. Variables d'environnement

1. Copie le fichier d'exemple :
   ```bash
   cp .env.local.example .env.local
   ```

2. Récupère tes clés dans [Supabase](https://app.supabase.com) :
   - Ouvre ton projet → **Settings** → **API**
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Colle les valeurs dans `.env.local`. Ne commite jamais ce fichier.

## 3. Utilisation dans le code

| Contexte | Fichier | Import |
|----------|---------|--------|
| Composants client, formulaires | `lib/supabase.ts` | `import { createClient } from '@/lib/supabase'` |
| Server Components, Route Handlers, Middleware | `lib/supabase-server.ts` | `import { createClient } from '@/lib/supabase-server'` |

**Composant client :**
```ts
'use client'
import { createClient } from '@/lib/supabase'

const supabase = createClient()
const { data } = await supabase.from('ma_table').select()
```

**Server Component ou API :**
```ts
import { createClient } from '@/lib/supabase-server'

const supabase = await createClient()
const { data } = await supabase.from('ma_table').select()
```

## 5. Générer les types Supabase

1. Crée un token d’accès Supabase : https://app.supabase.com/account/tokens
2. Exécute :
   ```bash
   SUPABASE_ACCESS_TOKEN=xxx npm run supabase:types
   ```
   Cela met à jour `lib/database.types.ts`.

## 4. Fichiers créés

- `lib/supabase.ts` — client navigateur (cookies gérés par le navigateur)
- `lib/supabase-server.ts` — client serveur (cookies lus/écrits via `next/headers`)
- `.env.example` / `.env.local.example` — modèles pour les variables d’environnement
