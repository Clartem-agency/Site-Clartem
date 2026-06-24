# 🚀 Migration Clartem → Astro — Page d'accueil

Ce dossier contient ta **page d'accueil** convertie en Astro, prête à lancer.
Le rendu visuel est **identique** à ton site actuel : on a juste changé la "tuyauterie"
pour qu'il soit beaucoup plus léger.

---

## 1. Ce qui a été fait (et pourquoi)

Ton site était lourd surtout à cause d'**une seule ligne** :

```html
<script src="https://cdn.tailwindcss.com"></script>
```

Ce "CDN Tailwind" télécharge un **compilateur entier (~400 Ko de JS)** qui s'exécute
**dans le navigateur de chaque visiteur**, à chaque visite, et **bloque l'affichage**
le temps de générer le CSS. C'est pratique pour bricoler, mais déconseillé en production.

➡️ On l'a remplacé par un **vrai Tailwind compilé une fois** au build. Résultat : un
fichier CSS statique de **~11 Ko (gzippé)** au lieu du compilateur. Même design, page
beaucoup plus rapide.

| Avant | Après |
|---|---|
| `index.html` = 6 336 lignes monolithiques | `Layout.astro` (le `<head>`) + `index.astro` (le contenu) |
| Tailwind CDN exécuté chez le visiteur | Tailwind compilé au build (11 Ko gzip) |
| Config Tailwind inline dans le HTML | `tailwind.config.mjs` propre |

**Ce qui n'a PAS changé** (gardé tel quel pour ne rien casser) :
- ton `style.css` → `public/css/style.css`
- ton `script.js` → `public/js/script.js`
- Google Analytics, ScrollReveal, le chat Brevo + la bulle proactive, les modales.

---

## 2. Lancer le projet en local

**Prérequis :** [Node.js](https://nodejs.org) version 18.20+ ou 20+ installé.

Dans un terminal, à la racine de ce dossier :

```bash
npm install      # installe Astro + Tailwind (à faire une seule fois)
npm run dev      # démarre le serveur de dev -> http://localhost:4321
```

Ouvre **http://localhost:4321** dans ton navigateur. Astro recharge la page
automatiquement à chaque modification.

Pour générer la version finale optimisée :

```bash
npm run build    # crée le dossier dist/ (le site final)
npm run preview  # prévisualise ce dist/ en local
```

---

## 3. ⚠️ ÉTAPE OBLIGATOIRE : copier tes images

Je n'avais pas tes images (logo, fond hero, portfolio, mockups...). Le site
s'affichera **sans images** tant que tu n'as pas fait ceci :

➡️ Copie **tout le contenu de ton dossier `assets/`** (du repo GitHub) dans :

```
public/assets/
```

Les chemins sont déjà branchés en racine (`/assets/...`), donc une fois copiées,
tout s'affiche.

---

## 4. Structure du projet

```
clartem-astro/
├─ public/                  ← fichiers servis tels quels (chemins en /...)
│  ├─ assets/               ← 📌 COLLE TES IMAGES ICI
│  ├─ css/style.css         ← ton CSS (inchangé)
│  └─ js/script.js          ← ton JS (inchangé)
├─ src/
│  ├─ layouts/Layout.astro  ← tout le <head> + structure <body>
│  └─ pages/index.astro     ← le contenu de ta page d'accueil
├─ astro.config.mjs         ← config Astro (intégration Tailwind)
├─ tailwind.config.mjs      ← tes couleurs custom + réglages Tailwind
└─ package.json
```

**Le concept clé d'Astro à retenir :** une *page* (`index.astro`) injecte son contenu
dans un *layout* (`Layout.astro`) via la balise `<slot />`. Le layout contient tout ce
qui est commun (le `<head>`, plus tard le menu et le footer).

---

## 5. Points d'attention (à connaître)

- **`is:inline` sur les `<script>`** : Astro optimise/bundle les `<script>` par défaut.
  Pour les scripts tiers (GA, ScrollReveal, Brevo), on a ajouté `is:inline` pour
  qu'Astro les laisse **exactement** comme avant. Ne le retire pas sur ceux-là.

- **Classes Tailwind ajoutées par le JS** : ton `script.js` ajoute des classes comme
  `bg-deep-blue`, `hidden`, `rotate-180`. Comme elles n'apparaissent pas toujours dans
  le HTML, Tailwind pourrait les supprimer. Elles sont protégées dans la `safelist` de
  `tailwind.config.mjs`. Si tu ajoutes plus tard une classe Tailwind **uniquement via JS**
  et qu'elle ne s'applique pas → ajoute-la à la `safelist`.

- **Emails Cloudflare** : les liens `/cdn-cgi/l/email-protection` et le script
  `email-decode.min.js` sont injectés par **Cloudflare**. Ils ne fonctionnent que si ton
  site est servi derrière Cloudflare. Sur un autre hébergeur, remplace-les par tes vraies
  adresses email.

---

## 6. La suite (quand tu veux)

Cette étape 1 = "ça marche, le CDN est parti". Ensuite, dans l'ordre conseillé :

1. **Découper `index.astro` en composants** (`Navbar.astro`, `Hero.astro`, `Footer.astro`...).
   C'est là qu'Astro devient vraiment puissant et que le code redevient lisible.
2. **Migrer les autres pages** (a-propos, blog, contact, faq, portfolio, study-cases...)
   en réutilisant le même `Layout`.
3. **Déployer** (Netlify ou GitHub Pages). Astro a des adaptateurs dédiés.

Dis-moi quand tu as réussi à lancer `npm run dev`, et par quelle étape tu veux continuer.
