# ⚡ Tutoriel : mesurer la vitesse de ton site (et comparer avec clartem.com)

Ce guide t'explique comment mesurer correctement la performance de ta version Astro
en local, et la comparer à ton site actuel `clartem.com`.

---

## ⚠️ La règle d'or : ne JAMAIS mesurer sur `npm run dev`

Le mode `dev` n'est **pas** optimisé : pas de minification, rechargement à chaud,
Tailwind qui recompile à la volée… Il paraîtra **plus lent que la réalité** et te
donnera des chiffres faux.

➡️ Pour mesurer, on teste toujours la **version de production** :

```bash
npm run build      # génère le site final optimisé dans le dossier dist/
npm run preview    # sert ce dist/ en local -> ouvre l'URL affichée dans le terminal
```

C'est cette URL de **preview** que tu vas analyser.

---

## 1. Mesurer en local avec Lighthouse (intégré à Chrome)

Lighthouse est l'outil de référence, déjà inclus dans Chrome.

1. Ouvre l'URL de preview dans une **fenêtre de navigation privée** (Ctrl + Maj + N).
   👉 **Indispensable** : tes extensions Chrome faussent le score si tu testes dans
   une fenêtre normale.
2. Appuie sur **F12** pour ouvrir les outils de développement.
3. Va dans l'onglet **Lighthouse**.
4. Règle : Mode = **Navigation**, Appareil = **Mobile** (le plus important, la majorité
   des visiteurs sont sur mobile), Catégories = au moins **Performance**.
5. Clique sur **Analyze page load** (Analyser le chargement).

### Les chiffres à regarder

| Métrique | Ce que c'est | Bon score |
|---|---|---|
| **Performance** | Note globale sur 100 | 90+ = excellent |
| **FCP** (First Contentful Paint) | Temps avant le 1er élément affiché | < 1,8 s |
| **LCP** (Largest Contentful Paint) | Temps avant l'élément principal affiché | < 2,5 s |
| **TBT** (Total Blocking Time) | Temps où la page est "figée" par du JS | < 200 ms |
| **CLS** (Cumulative Layout Shift) | Stabilité visuelle (ça ne "saute" pas) | < 0,1 |

👉 Le plus gros gain attendu de la migration est sur le **TBT** et le **LCP** : avant,
le navigateur devait télécharger + exécuter le compilateur Tailwind (~400 Ko de JS qui
**bloque** l'affichage) avant de dessiner la page. Maintenant, c'est juste un fichier
CSS statique de ~11 Ko.

---

## 2. Comparer honnêtement avec clartem.com

**La bonne méthode = même machine, mêmes conditions.**

Lighthouse peut analyser **n'importe quelle URL**, pas seulement localhost. Donc :

1. Lance Lighthouse sur ton **preview local** (étape 1) → note les chiffres.
2. Dans la même fenêtre privée, va sur **`https://clartem.com`** et relance Lighthouse
   (mêmes réglages : Mobile, Performance).
3. Compare les deux. Comme c'est la même machine et le même réseau, la comparaison est
   fiable.

⚠️ À ne PAS faire : comparer un Lighthouse local avec un score PageSpeed Insights. Ce
ne sont pas les mêmes conditions (PageSpeed tourne sur les serveurs de Google avec un
bridage réseau simulé), donc les chiffres ne sont pas comparables entre eux.

---

## 3. Bonus : PageSpeed Insights (pour le site EN LIGNE)

Pour `clartem.com` uniquement (pas localhost, qui n'est pas accessible publiquement) :

➡️ Va sur **https://pagespeed.web.dev**, tape `clartem.com`, lance l'analyse.

Avantage : en plus du score Lighthouse, tu obtiens des **données réelles d'utilisateurs**
(les "Core Web Vitals" mesurés sur de vrais visiteurs des 28 derniers jours). Pratique
pour suivre l'évolution une fois la nouvelle version mise en ligne.

---

## 4. Voir le "poids" de la page (onglet Network)

Pour visualiser concrètement ce que la migration a allégé :

1. F12 → onglet **Network** (Réseau).
2. Coche **Disable cache** (pour simuler une première visite).
3. Recharge la page (Ctrl + R).
4. En bas, regarde le résumé : **nombre de requêtes** et **poids total transféré**.

Compare entre ton preview local et clartem.com. Tu devrais notamment voir disparaître
la grosse requête vers `cdn.tailwindcss.com`.

---

## Récapitulatif express

```bash
# 1. Construire la version optimisée
npm run build

# 2. La servir en local
npm run preview

# 3. Ouvrir l'URL en navigation privée -> F12 -> Lighthouse -> Mobile -> Analyser
# 4. Refaire la même analyse sur clartem.com pour comparer
```

Note tes scores quelque part : ils te serviront de "avant / après" pour mesurer
l'impact de chaque optimisation qu'on fera ensuite.
