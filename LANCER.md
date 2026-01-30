# Lancer RELYO

## 1. Vérifier Node.js

Ouvre un **terminal** (Terminal sur Mac, ou terminal intégré dans Cursor : `Ctrl+`` ou **Terminal → New Terminal**).

Vérifie que Node.js est installé :

```bash
node -v
npm -v
```

Si une version s’affiche (ex. `v20.x`), passe à l’étape 2.

Si tu vois `command not found` :
- Installe Node.js : https://nodejs.org/ (version LTS)
- Ou avec Homebrew : `brew install node`

## 2. Aller dans le dossier du projet

```bash
cd /Users/stephanetrenchant/relyo
```

(Si ton projet RELYO est ailleurs, utilise ce chemin à la place.)

## 3. Installer les dépendances

```bash
npm install
```

Attends la fin de l’installation (peut prendre 1–2 minutes).

## 4. Lancer l’app

```bash
npm run dev
```

Tu dois voir quelque chose comme :

```
▲ Next.js 14.x.x
- Local: http://localhost:3000
```

## 5. Ouvrir dans le navigateur

Ouvre : **http://localhost:3000**

Tu devrais voir la page d’accueil RELYO (fond bleu ciel, lien « Connexion artisan »).

---

## Si ça ne marche pas

- **`npm: command not found`** → Node.js n’est pas installé ou pas dans le PATH. Installe Node (lien ci‑dessus).
- **`EADDRINUSE: port 3000`** → Le port 3000 est déjà utilisé. Arrête l’autre app ou lance sur un autre port : `npm run dev -- -p 3001` puis ouvre http://localhost:3001
- **Page blanche ou erreur** → Ouvre la console du navigateur (F12 → Console) et note le message d’erreur.
- **Erreur au build** → Copie le message d’erreur du terminal et partage‑le pour qu’on puisse corriger.
