# 🗂️ SUIVI DE PROJET — Migration Clartem vers Astro

> Document vivant : on le met à jour au fur et à mesure. Il sert aussi de **mémoire**
> quand on change de conversation (voir la dernière section « Reprendre ailleurs »).
>
> **Version actuelle : v33** · **Dernière mise à jour :** 23 juin 2026 — *Prêt pour la mise en ligne : `sitemap.xml` (27 URLs) + `robots.txt` déposés tels quels dans `public/` (sitemap statique, `@astrojs/sitemap` non installé volontairement). Build vérifié : `dist/` contient `_redirects` + `sitemap.xml` + `robots.txt` à la racine, URLs propres, 27/27 URLs du sitemap générées.*
>
> 📌 **Convention de versionnage :** chaque livraison incrémente le numéro. Le `.zip` et
> ce fichier sont nommés avec le suffixe `-vN` (ex. `clartem-astro-v6.zip`). À chaque
> nouvelle livraison : ajouter une entrée dans le **Journal des versions** ci-dessous et
> incrémenter `N`.

---

## 🎯 Objectif du projet

Migrer le site **clartem.com** (site statique HTML/CSS/JS devenu lourd) vers **Astro**,
**page par page**, pour l'alléger et le rendre maintenable, **sans changer le design**.

- Repo d'origine : `Clartem-agency/Site-Clartem` (GitHub)
- Activité : agence de création de sites pour coachs & thérapeutes
- Déploiement actuel : GitHub Pages (+ un dossier `netlify/` avec une fonction)

---

## 🎯 Positionnement & cible (résumé — source : brief SEO `v26`, projet parallèle)

> ⚠️ **À garder en tête pour tout choix de design, de visuel et de copie.** Le cœur de
> cible a été resserré récemment → **bannir tout registre spirituel / New Age / énergétique**
> dans les visuels comme dans les textes.

- **Cible cœur :** thérapeutes & praticiens du bien-être **laïques** (sophrologues,
  hypnothérapeutes [thérapeutiques, pas la régression], naturopathes, EMDR, psychopraticiens,
  art/musicothérapeutes, coachs spécialisés non-business, Pilates, Feldenkrais…).
- **Exclus (éthique) :** énergéticiens, Reiki, magnétiseurs, médiums, astrologie, New Age,
  **yoga / méditation spirituelle / Tai Chi / Qi Gong**, toute pratique à fond spirituel.
- **Nommer la cible :** « thérapeutes et praticiens du bien-être », « praticiens de
  l'humain », « accompagnants ». ❌ **Jamais** « Gardiens d'Âmes » (trop New Age).
- **Voix de marque « Clarté Chaleureuse » :** confiant sans arrogance, technique mais
  accessible (zéro jargon non expliqué), empathique, direct, rassurant.
- **Métaphores maison à réutiliser :** « éliminer le bruit, amplifier le **signal** » ·
  « votre **voix** digitale » · « une **voix claire** » · « cocon de confiance ».
  Signature : « Une voix claire pour le digital des thérapeutes. »
- **Vocabulaire BANNI :** New Age (vibration, énergie, chakras, aura, channeling) · jargon
  start-up (boost, scale, ROI) · promesses vagues · religieux ostentatoire.
- **Voix « nous » (sans équipe fictive)** [mini-brief Voix & Délai v1] : parler au **« nous »**
  / « chez Clartem » (voix d'entreprise, honnête). ❌ Mais **jamais** affirmer une équipe qui
  n'existe pas (« notre équipe », « nos designers », « nos experts »). Reformuler en
  *entreprise qui agit* : « **Nous** créons votre maquette » plutôt que « l'équipe crée… ».
  *(Le « je » de Frédéric reste OK dans le récit perso de la page À propos.)*
- **Règle d'intégrité (tout le site) :** aucune invention — pas de faux témoignages, faux
  résultats, chiffres non vérifiés, ni équipe fictive. La crédibilité repose là-dessus.

### 📅 Délai de livraison — CHANGÉ (⚠️ à répercuter partout)

> L'ancienne promesse **« 7 jours »** est **abandonnée**. Nouvelle formulation (déjà en
> place sur la FAQ) :

- **« en général 2 à 3 semaines »** (jamais un chiffre de jours précis).
- Le délai **démarre à la réception du contenu** (l'Atelier de Clarté complété), pas au
  paiement, et **dépend du rythme du client**.
- Angle : *« la rapidité n'est pas l'objectif, c'est la conséquence d'une préparation
  soignée »*. Garder le bénéfice vitesse **uniquement** sous l'angle *« pas des mois »*.
- **Supprimer aussi** « 24h à 48h de production » et toute formule « usine / ultra-rapide » :
  ça inquiète ce public au lieu de rassurer.
- **Le pacte (engagement réciproque)**, à intégrer où c'est pertinent : côté Clartem =
  1ʳᵉ version rapide + **réponses sous 48 h** + accompagnement ; côté client = faire l'Atelier
  sans le laisser traîner + **retours groupés sous ~5-7 j** + rester joignable.
- **Clause de pause douce** : sans nouvelle ~3 semaines, le créneau est libéré, on reprend
  quand le client est prêt. *(À mettre aussi dans les CGV / le devis, pas que dans la com.)*

**Nettoyage « 7 jours » — FAIT en v28 :**
- [x] `Layout.astro` : description par défaut + og → « 7 jours » retiré (remplacé par « qui inspire confiance » / « qui vous ressemble »).
- [x] `index.astro` : carte hero **« LIVRAISON 7 JOURS »** → **« LIVRAISON SOIGNÉE »** ; puce « en ligne en 1 semaine » → « en 2 à 3 semaines ».
- [x] `index.astro` : **« 24h à 48h de production intensive »** → « La production… » (formule « usine » supprimée).
- [x] `index.astro` : **section processus repensée** — plan « Jours 2-3/4-5/6-7 » → **phases** (badges : L'appel Clarté · À votre rythme · Conception · Allers-retours · Mise en ligne). **5ᵉ carte « Allers-retours & ajustements » ajoutée** (index re-numérotés 0→6, hauteur scroll 500→600vh, titre « 4 → 5 étapes »). Intro : « comptez en général 2 à 3 semaines, à partir de la réception de votre contenu ».
  - ⚠️ **IMAGE À AJOUTER** pour la nouvelle carte : `public/assets/plan-etape-retours.webp` (placeholder référencé ; les 4 autres cartes ont `plan-etape-1…4.webp`).
- [x] `index.astro` : FAQ home « …en seulement 7 jours ? » → « Combien de temps faut-il… ? » + réponse reformulée (2-3 semaines, « ni des mois ni bâclé ») ; « site expert en 7 jours » → « en 2 à 3 semaines ».
- ⚠️ Le **brief SEO v26** (5.6) cite encore « livraison en 7 jours » → à corriger côté projet SEO (hors Astro).
- 💡 *Copie écrite par mes soins selon le positionnement — formulations 100 % ajustables si tu veux les retoucher.*

> 📎 **Docs compagnons** (versioning séparé du nôtre) : `mini-brief-voix-et-delai-clartem`
> (v1 — voix « nous » + délai 2-3 semaines, **règles à appliquer telles quelles**) ·
> `brief_passation_seo_clartem` (v26) · `carte-maillage-clartem` (v7, le graphe des liens
> internes) · `tri_articles_clartem_tracker` (v20, le tri portfolio + articles, validé). À
> demander/joindre si on touche au blog, aux pages de service, ou aux parties parlant de
> l'agence/du délai.
>
> 🎨 *En cours :* le symbole « âme » de la timeline **À propos** est en refonte pour cette
> raison (vers un registre clarté / signal, non spirituel).

---

## 📋 Journal des versions

> Le plus récent en haut. Chaque entrée = une livraison (un `.zip`).

### v33 — 23 juin 2026 — Sitemap + robots (prêt pour la mise en ligne)

**Fichiers SEO déposés tels quels** (fournis par l'IA SEO, addendum `brief-collaboration-astro-golive-v1.md`)
- **`public/sitemap.xml`** — 27 URLs indexables, calées sur les URLs propres et `www.clartem.com`. Copié **verbatim** (non modifié, non régénéré). Exclusions volontaires côté SEO : pages légales/merci (`noindex`), checklist, study_case concept.
- **`public/robots.txt`** — autorise le crawl + pointe vers `https://www.clartem.com/sitemap.xml`. Copié **verbatim**.
- Les deux sont à la racine de `public/`, à côté de `_redirects`.

**Choix assumé** : **sitemap statique**, `@astrojs/sitemap` **NON installé** (l'intégration auto changerait l'URL du sitemap et compliquerait la soumission Search Console). Amélioration optionnelle possible plus tard.

**Vérif build** : `npm run build` = 34 pages. `dist/` contient bien `_redirects`, `sitemap.xml`, `robots.txt` à la racine ; pages en dossiers/`index.html` (URLs propres) ; **les 27 URLs du sitemap existent toutes dans `dist/` (0 manquante)**.

**→ Prêt pour la mise en ligne Netlife (côté Frédéric)** : brancher l'archive de l'ancien site, remplacer le contenu du dépôt par le projet Astro, build `npm run build` → dossier publié `dist`. Puis (IA SEO / Frédéric, hors Astro) : soumission du sitemap dans Search Console + indexation des pages clés sur la prod.

---

### v32 — 23 juin 2026 — Home allégée + correctifs liens pages de service

**Home (`index.astro`) — section « derniers articles » retirée** (décision de Frédéric)
- La section `<section id="blog-preview">` (featured + sidebar, remplie au runtime depuis l'ancien JSON) est **supprimée**. Elle affichait des liens morts + images cassées ; la home est plus légère. *(Frédéric recréera peut-être une section blog plus tard, avec de vraies images.)*
- **`public/page-cartes-blog.json` supprimé** (−140 Ko). Comme plus aucune page ne contient les conteneurs `featured-article-container` / `sidebar-articles-container` / `articles-grid`, les deux fonctions de `script.js` (lignes ~740 & ~1034) sont des **no-op gardés** (`if (!container) return;`) et ne chargent plus rien. *(Ce code mort dans `script.js` pourra être retiré à l'occasion — non urgent.)*

**Pages de service — 2 correctifs de liens**
- **Démos** : les boutons « Voir la démo » pointaient vers `/portfolio/site-portfolio-NN_xxx/` (local, **404**). Corrigés vers les **vraies URLs GitHub Pages externes** `https://clartem-agency.github.io/site-portfolio-NN_xxx/` (+ `target="_blank" rel="noopener noreferrer"`), comme dans `portfolio.astro`. Concernés : 03 (naturopathe), 05 (sophrologue), 09 (hypnothérapeute). Rappel : les sites démo sont dans des **dépôts GitHub indépendants**.
- **Offres** : le bouton « Voir le détail des offres » pointait vers `/offres/` (**page inexistante, 404**). Corrigé vers **`/#offres`** (ancre de la section Offres sur la home), dans les 4 pages de service.

**Vérifs** : `npm run build` = 34 pages, `npm run dev` OK, aucune erreur. Home sans `blog-preview`, hub→`/#offres`, démos→GitHub externes : confirmés.

---

### v31 — 23 juin 2026 — Intégration du nouveau contenu SEO (blog + services)

**Le gros morceau : tout le contenu SEO (LOT 1 + LOT 2) est intégré.**

**Démos `study_case` + redirections**
- `public/_redirects` **corrigé** : seules les **8 démos hors-cible** redirigent vers `/portfolio/` (study_case **01, 02, 04, 06, 07, 10, 11, 13**). La **05 NE redirige plus** (c'était une erreur — elle est conservée). Les 8 ajouts pages-conservées (contact/mentions/cgv/politique/checklist/merci×3) sont intacts.
- **5 démos conservées** déposées dans `public/study-case-pages/` : study_case **03, 05, 08, 09, 12** (les démos bien-être liées depuis le portfolio).
- `portfolio.astro` : liens study-case passés en **absolu** (`/study-case-pages/…html`) — sinon cassés par le `trailingSlash` des URLs propres.

**Blog en content collections (17 articles)**
- `src/content/config.ts` : schéma de la collection `blog` (title, description, headline, isPillar, isGuide, faq[]).
- `src/content/blog/*.md` : **4 piliers** (chacun avec sa FAQ = 5 Q/R), **12 clusters**, **1 guide client** (`modifier-votre-site`). Le **front-matter** porte le SEO ; le **corps** garde le `<main>` HTML d'origine (encarts, modèles, dégradés, accordéon FAQ préservés — lignes vides compactées pour qu'Astro le rende verbatim).
- `src/pages/blog/[slug].astro` : rend chaque article (Layout sombre, **JSON-LD régénéré** Article + FAQPage en **URLs propres**, canonical auto).
- `src/pages/blog/index.astro` : page `/blog/` **générée depuis la collection**, les 4 piliers mis en avant + le guide.
- `src/styles/blog.css` : styles communs (thème sombre `#0B1623`, `.prose-c`, `.card`, `.grad-text`, `.note`, `.model-quote`, `.step-num`, `.shot`, accordéon `.faq`).
- Liens internes → **propres**, mentions « 7 jours » → « 2 à 3 semaines » (CTA des articles).

**Pages de service (4)**
- `src/pages/creation-site-web-{therapeute,sophrologue,naturopathe,hypnotherapeute}.astro` (pages racine, URL propre). **JSON-LD Service** préservé (URLs `.html`→propres), Layout sombre, `src/styles/service.css`. Maillage hub→3 métiers propre. « 7 jours, 0 % TVA » → « 2 à 3 semaines, 0 % TVA » (titre, description, corps).

**Navigation**
- `Navbar.astro` : **« Blog »** existait déjà (hérité → `/blog/`). Ajout de **« Création de site »** (→ `/creation-site-web-therapeute/`) en desktop **et** mobile, après « À Propos ».

**Vérifs** : `npm run build` = **34 pages**, `npm run dev` OK (toutes 200), aucune erreur. Scan global « 7 jours » = **0** dans le contenu visible (le « 5 à 7 jours » de la FAQ = fenêtre de retours du pacte client, **correct**). JSON-LD, FAQ accordéon, canonicals propres, liens internes propres : vérifiés.

**⚠️ À DÉCIDER ENSEMBLE — la section « derniers articles » de la home**
- La home (`index.astro`) a une section featured + sidebar (`#featured-article-container` / `#sidebar-articles-container`) **remplie au runtime par `public/js/script.js`** depuis `public/page-cartes-blog.json` (les **260 anciens articles supprimés**). Résultat actuel : elle affiche des **liens vers des articles qui n'existent plus** et des **images cassées** (le dossier `public/assets/image-blog/` est **vide**) — donc déjà cassée avant cette intégration.
- Les 17 nouveaux articles sont des **guides texte sans image**, alors que ces cartes attendent une image. Je n'ai **pas bricolé d'images inexistantes sur ta home** : c'est une décision de design qui t'appartient.
- **Options** : (a) **retirer** cette section de la home ; (b) la **repointer vers les 4 piliers** (tu fournis 4 images) ; (c) la **remplacer par un CTA statique** « Explorer le blog » → `/blog/`. → On en décide et je l'applique. `page-cartes-blog.json` (obsolète, 140 Ko) et le code de rendu de `script.js` (lignes 740 & 1034) pourront être nettoyés selon l'option choisie.

---

### v30 — 18 juin 2026
- **Bascule en URLs PROPRES sur tout le site** (préparation du chantier blog/services, brief
  collab v2) : `astro.config` → `build.format: 'directory'` + `trailingSlash: 'always'`.
  **87 liens internes convertis** (`.html` → `/…/`) dans toutes les pages + Navbar + Footer +
  Layout ; canonicals désormais propres (calculés via `Astro.url`). Démos `study-case-pages/*.html`
  **laissées en `.html`** (fichiers statiques à garder).
- **`public/_redirects`** créé à partir du fichier de l'IA SEO (76 redirections) **+ 8 ajoutées**
  pour les pages conservées manquantes (contact, mentions, cgv, politique, checklist, merci ×3).
- **Google Analytics ajouté à la landing `checklist`** (uniformité ; elle était la seule sans GA).
- ✅ Build OK (12 pages en dossiers/index.html), toutes les URLs propres répondent 200, zéro `.html`
  interne restant (hors démos), aucune erreur.
- 🔜 **LOT 2 attendu** (12 clusters + guide) → construction complète du blog + pages de service.

### v29 — 18 juin 2026
- **FAQ de la home alignée sur la page FAQ retravaillée** : les 5 réponses (longues) de la
  section `#faq-preview` ont été **raccourcies** pour reprendre les versions courtes de `faq.astro`.
  Mapping par sujet (la home reste un teaser de 5 questions, aucune supprimée) :
  - Tarif → réponse courte « Tout compris, sans frais caché… »
  - Modifier soi-même → « …un CMS, aussi simple qu'un formulaire… »
  - Propriétaire → « Oui, à 100 %… actif qui vous appartient… »
  - Délai (« Combien de temps… ») → « 80 % du travail porte sur la clarté… 2 à 3 semaines »
  - Wix/Squarespace → « …les briques, pas l'architecte… »
- Suppressions au passage : l'encart « maison/plans d'architecte » et la longue liste Wix (50h).
- ⚠️ *Choix : les **liens internes vers le blog** présents dans les réponses de `faq.astro`
  n'ont PAS été repris sur la home (ils pointent vers des pages blog pas encore créées → liens
  morts sur la page la plus visitée). Le lien « Explorer le centre d'aide complet » couvre déjà
  le besoin d'aller plus loin. Dis-moi si tu veux les réintégrer une fois le blog en ligne.*

### v28 — 18 juin 2026
- **Nettoyage complet de la promesse « 7 jours » sur la home** (alignement avec le positionnement
  « en général 2 à 3 semaines, du soin pas des mois ») :
  - `Layout` : meta description par défaut + og → « 7 jours » retiré.
  - Carte hero « LIVRAISON 7 JOURS » → « LIVRAISON SOIGNÉE » ; « en ligne en 1 semaine » → « 2 à 3 semaines ».
  - **Section processus repensée** : les badges « Jours 2-3/4-5/6-7 » deviennent des **phases**
    (L'appel Clarté · À votre rythme · Conception · Allers-retours · Mise en ligne). **Ajout d'une
    5ᵉ carte « Allers-retours & ajustements »** (le mécanisme JS compte les panneaux dynamiquement,
    donc sûr) → re-indexation 0→6, hauteur scroll 500→600vh, titre « 4 → 5 étapes ». Intro qui
    annonce les 2-3 semaines à partir de la réception du contenu.
  - FAQ home : question + réponse reformulées (suppression de « 24h à 48h de production intensive »).
- ⚠️ **Image à fournir** pour la nouvelle carte : `public/assets/plan-etape-retours.webp`.

### v27 — 18 juin 2026
- **3 pages de remerciement migrées**, chacune selon sa nature :
  - `merci-formulaire-contact.astro` → **avec Layout** (nav + footer, thème clair). C'est la
    cible de la redirection du formulaire de contact. Délai « 24 à 48h » **harmonisé en 48h**.
    `noindex`. GA hérité du Layout.
  - `merci-formulaire-blog.astro` → **autonome minimal** (carte centrée, sans nav/footer ;
    confirmation de commentaire de blog). GA + `style.css` propres. 
  - `merci.astro` → **autonome sombre premium** (confettis canvas-confetti, glassmorphism,
    checkmark animé) après inscription au lead magnet. Keyframes `float`/`shineLoop` redéfinies
    en CSS (elles vivaient dans la config Tailwind du CDN, désormais retiré).
- ⚠️ *`merci-formulaire-blog` était la seule sans `noindex` à l'origine (oubli probable) — je
  l'ai aligné en `noindex, nofollow` comme les 2 autres. Dis-moi si tu préfères l'inverse.*

### v26 — 18 juin 2026
- **Landing `checklist` migrée** (`src/pages/checklist.astro`) — c'est la page de capture du
  **lead magnet** (liens Insta/LinkedIn). **Page autonome** (pas le Layout) car c'est une
  landing « focus » : pas de nav, footer minimal, police Manrope, palette propre.
- **5 couleurs ajoutées** au `tailwind.config.mjs` (`cream`, `gris-bleu`, `panel`, `night`,
  `mint`) — les teintes de la checklist (dont un fond `#0F172A` plus sombre que le `#1F2937`
  du site). Form **Brevo** (sibforms) préservé, carousel d'aperçu + lightbox conservés.
- 💡 *Proposition : ajouter Google Analytics sur cette page (absent à l'origine) pour mesurer
  les conversions venant des réseaux sociaux.*

### v25 — 18 juin 2026
- **Présentation de la date unifiée** sur les 3 pages légales (au-delà du simple format) :
  partout désormais un **sous-titre descriptif** dans l'en-tête + la date en **1ʳᵉ ligne de la
  carte** sous la forme « **Dernière mise à jour : X** » (modèle de la Politique).
- Au passage : CGV a reçu un vrai sous-titre descriptif (« Les conditions qui encadrent nos
  prestations de création de site web. ») — *wording ajustable si besoin.*

### v24 — 18 juin 2026
- **Date des Mentions légales harmonisée** : « 10/10/25 » → « 10 octobre 2025 ». Elle était
  **dans le sous-titre** (« …mises à jour le … »), pas sur une ligne dédiée — d'où le fait
  qu'elle avait été ratée en v23. Les 3 pages sont désormais au même format « JJ mois AAAA ».

### v23 — 18 juin 2026
- **Dates légales harmonisées** au format « JJ mois AAAA » minuscule (Politique
  « 15 novembre 2025 », CGV « 18 juin 2026 » ; Mentions n'en affiche pas). Chaque page garde
  sa vraie date de mise à jour.
- **Délai de réponse fixé à 48h partout** (décision fondateur déléguée) : la page contact
  passait de « garantie sous 24h » à « **sous 48h** », cohérent avec le pacte (FAQ). Raison :
  fondateur seul → 48h évite la pression, et permet de sur-livrer en répondant souvent plus vite.
- **Liens entre pages légales** : petit bloc en bas des 3 pages (Mentions · Confidentialité ·
  CGV) pour la navigation croisée.

### v22 — 18 juin 2026
- **Pages légales harmonisées au thème sombre** (elles étaient restées en thème clair
  d'origine) : hero sombre, titre blanc, carte translucide (`bg-white/5` + `border-white/10`),
  titres d'articles en bleu conservés. **Règle au passage le bug de nav illisible** (texte
  blanc sur fond clair) via `dark-nav-page`.
- **Correction légale (CGV, art. 4.2)** : le délai « livraison sous **24 à 48 heures
  ouvrées** » (formule « usine » + engagement ferme risqué) → « délai **indicatif** de
  **2 à 3 semaines**, non contractuel, dépendant de la réactivité du Client ». Aligné sur le
  mini-brief. Date de « dernière mise à jour » des CGV passée au 18 juin 2026.
  ⚠️ *Document juridique : à faire valider, mais c'était à corriger en priorité.*
- `clartem-local` → **à supprimer** (abandonnée). `checklist` = landing du lead magnet,
  à migrer plus tard.

### v21 — 18 juin 2026
- **3 pages légales migrées** : `mentions-legales`, `politique-de-confidentialite`, `cgv`
  (`src/pages/*.astro`). Pages texte simples (fond clair, aucun script propre).
- **Nouvelle prop Layout `noindex`** (défaut `false`) : ajoute `<meta name="robots"
  content="noindex, follow">`. Activée sur les 3 pages légales (comme sur l'ancien site) —
  elles ne doivent pas être indexées par Google. Les autres pages restent indexables.
- ✅ **Vérif demandée par le fondateur : il y a bien tout.** Le site ne référence que ces
  3 pages légales (footer + bandeau cookies). « Politique des cookies » du footer = un bouton
  JS (réglages), pas une page. Pas de CGU ni de page cookies séparée.

### v20 — 18 juin 2026
- **Liseré au survol — résolu (suite v18/v19).** Analyse de la **vidéo fournie** (frames
  extraites + zoom) : le liseré était sur le bord bas du **cadre image**. Après le zoom de
  carte (v19), il restait le **zoom de l'image** (`scale(1.05)`) : agrandie dans un cadre
  `overflow:hidden`, son bord bas tombait sur un sous-pixel → liseré (bug de rendu Chrome).
- Correction : **zoom de l'image retiré aussi**. Plus aucun `scale` au survol des cartes
  (le seul `transform` restant est `translateY`, en pixels entiers). Le survol reste vivant :
  soulèvement de la carte + contour bleu + ombre + voile `::after` sur l'image.
- 💡 Si on veut un jour ré-introduire un zoom d'image sans liseré : technique de **masque**
  (`mask-image`) sur `.card-image`, à tester.

### v19 — 17 juin 2026
- **Liseré au survol des cartes — RÉGLÉ.** Capture à l'appui : la ligne blanche était sur le
  **bord bas du cadre image** (jointure image/texte), pas le contour de la carte. Cause
  racine = le **micro-zoom `scale(1.01)`** de `.portfolio-card`, qui posait ce bord sur un
  sous-pixel et laissait transparaître le fond clair de la carte.
- Correction : **retrait du `scale(1.01)`** au survol. Le soulèvement (`translateY(-8px)`,
  pixels entiers) est conservé. 1 % de zoom = imperceptible → **aucun changement visible**.
- *(Les réglages GPU des v17/v18 sont conservés, sans effet de bord.)*

### v18 — 17 juin 2026
- **Suite du clignotement portfolio** : le liseré apparaît au survol de **toute la carte**
  (pas seulement l'image). Cause = le micro-zoom `scale(1.01)` de `.portfolio-card` (qui a
  une bordure + `backdrop-filter`) → bordure du bas redessinée au sous-pixel.
- Correction : **rendu GPU sur la carte** (`backface-visibility: hidden` + `will-change` +
  `translateZ(0)` ajouté au `transform` du survol). Design inchangé.
- 🔧 *Si le liseré persistait* (le combo `backdrop-filter` + micro-zoom est tenace sur
  Chrome) : le correctif garanti est de **retirer le `scale(1.01)`** (le lift `translateY`
  suffit ; le zoom de 1% est imperceptible). À faire sur demande.

### v17 — 17 juin 2026
- **Correction d'un clignotement (liseré blanc sous-pixel)** signalé sur deux endroits :
  - **Nav au scroll** : la fine bordure basse (`border-bottom`, voulue) apparaissait en fondu
    pendant que la nav change de hauteur → scintillement. Corrigé en **réservant la bordure**
    (transparente sur `#main-nav`, juste la couleur change au scroll) + **rendu GPU**
    (`translateZ(0)` + `backface-visibility: hidden`). *(style.css, global — vaut pour toutes
    les pages à nav sombre.)*
  - **Images du portfolio au survol** : l'image en `scale` dans un conteneur `overflow:hidden`
    laissait un liseré en bas → corrigé avec `translateZ(0)` + `backface-visibility: hidden`
    sur le conteneur et l'image. *(portfolio.astro)*
- Aucun changement de design : ces réglages ne font que **stabiliser le rendu**.

### v16 — 17 juin 2026
- **Portfolio simplifié** (décision fondateur) : avec 5 démos, la **barre de filtres** et le
  bouton **« Voir plus »** ne servaient plus → retirés. Les 5 cartes s'affichent directement.
- **Bug corrigé au passage** : le script inline du portfolio dupliquait la logique de nav au
  scroll et forçait la nav en **blanc** (alors que la page est sombre). Script inline supprimé
  → la nav sombre est désormais gérée proprement par le `script.js` global (comme les autres pages).

### v15 — 17 juin 2026
- **Page Portfolio migrée** (`src/pages/portfolio.astro`) avec application du **tri validé**
  (tracker SEO v20) : **5 démos bien-être gardées** (Sophrologue, Naturopathe, Hypno, Coach
  Nutrition, Masseuse), **8 cartes hors-cible retirées**.
- Nettoyage cohérent : filtres **« performance » et « design »** supprimés (catégories
  devenues vides) ; Brevo en double retiré ; cadeau **OFF** (page vitrine/conversion).
- **`solutions-par-metier`** retirée de la feuille de route → **à supprimer** dans le repo
  d'origine (jamais en ligne, pas à migrer).
- Suivi mis à jour : tri SEO **terminé**, nouvelles pages service/blog **à créer neuves**
  (pas à migrer) ; ajout du tracker de tri aux docs compagnons.

### v14 — 17 juin 2026
- **Cadeau / lead magnet rendu global et activable par page.** Le markup (bouton SVG animé
  + modale) a été déplacé de `index.astro` vers le `Layout`, derrière `{leadMagnet && (…)}`.
- Nouvelle **prop `leadMagnet`** (défaut `false`) : **ON** sur home + FAQ + À propos,
  **OFF** sur contact. La logique JS (déjà dans `script.js` global) le câble automatiquement.
- Bénéfice : un seul endroit à maintenir, et tu choisis l'affichage page par page (éviter
  l'effet « deux widgets flottants » sur les pages où ce n'est pas pertinent).

### v13 — 17 juin 2026
- **Page Contact migrée** (`src/pages/contact.astro`). Formulaire **Netlify Forms**
  (`netlify` + honeypot) et **upload Cloudinary** préservés tels quels.
- Nettoyage des **doublons** : le script de page contenait menu + cookies + Brevo, tous
  déjà gérés globalement → on n'a gardé que la **logique du formulaire**. Évite les
  double-bindings (menu qui se ferme tout seul, double chat).
- Conformité mini-brief : option « Rejoindre **l'équipe** » → « Rejoindre **Clartem** ».
- Redirection du form alignée sur notre schéma : `action="/merci-formulaire-contact.html"`.

### v12 — 17 juin 2026
- **Mini-brief « Voix & Délai » (v1) intégré au suivi** : règle de voix **« nous » sans
  équipe fictive**, règle d'intégrité (aucune invention), et délai enrichi (suppression du
  « 24h-48h de production », angle « pas des mois », pacte réciproque + clause de pause).
- **Vérification de conformité** des pages déjà migrées : **FAQ ✅ 100 % conforme** (voix
  « nous », pacte + pause présents, aucune équipe fictive, « 2-3 semaines »). **a-propos ✅**
  (le « je » du récit perso est légitime). **home ❌** : seules violations (toutes tracées
  dans la checklist délai), dont la formule « usine » 24h-48h pointée par le brief.

### v11 — 16 juin 2026
- **Page FAQ migrée** (`src/pages/faq.astro`, version refaite pour le SEO) — thème sombre,
  avec son **JSON-LD FAQPage** injecté dans le `<head>`.
- **Nouveau Layout** : ajout d'un **slot nommé `head`** → chaque page peut injecter ses
  balises `<head>` propres (JSON-LD, meta spécifiques…). Réutilisable pour les futures pages.
- **Changement de délai documenté** : « 7 jours » → « 2 à 3 semaines » (voir section
  *Délai de livraison*). Déjà à jour sur la FAQ ; **reste à répercuter sur la home**.

### v10 — 16 juin 2026
- **3 retouches de copie appliquées** (validées par le fondateur) :
  « L'Exorcisme par l'Écrit » → « **La Catharsis par l'Écrit** » (À propos, chap. 13) ·
  « retraite spirituelle » → « retraite **introspective** » (À propos) ·
  « Vous soignez les âmes » → « Vous soignez **l'humain** » (page d'accueil).
- **Audit vocabulaire terminé** sur la home + À propos : ne restent que des termes
  acceptables (« gardiens de l'humanité », non spirituel). Les mentions « âme » dans les
  commentaires de `script.js` (invisibles) sont laissées telles quelles (décidé).

### v9 — 16 juin 2026
- Correction du **terminal de la page À propos** : « RECHERCHE DE GARDIENS D'ÂMES » →
  « …DE L'HUMANITÉ » (formule « Gardiens d'Âmes » explicitement bannie par le brief).
- **Audit vocabulaire fiabilisé** (scan Unicode, pas `grep -i` qui rate les majuscules
  accentuées). 3 retouches de copie restent **en attente de validation du fondateur** :
  « L'Exorcisme par l'Écrit » (titre chap. 13), « retraite spirituelle » (À propos),
  « Vous soignez les âmes » (page d'accueil).

### v8 — 16 juin 2026
- **Page À propos migrée** (`src/pages/a-propos.astro`) — 1ʳᵉ page après la home, valide
  le système Layout en multi-pages : elle ne contient que son contenu propre + son `<style>`
  et ses scripts de page ; elle hérite de la nav, du footer, du bandeau cookies et du chat.
- **`Layout.astro` rendu paramétrable** : props `title`, `description`, `bodyClass`,
  `leadMagnet`, `noindex` (+ `canonical` calculé automatiquement). La home garde ses défauts.
- **Cadeau / lead magnet = global activable par page** : le markup (bouton SVG + modale)
  vit dans le `Layout`, derrière `{leadMagnet && (…)}` (**prop `leadMagnet`, défaut `false`**).
  Sa logique JS était déjà dans `script.js` global (avec garde-fous `if (modal && …)`, donc
  no-op si absent). Activé sur **home + FAQ + À propos** ; **OFF** sur contact (et à laisser
  OFF sur les pages légales / remerciement). Le `<head>` accepte aussi un slot nommé `head`.
- **`checklist.astro` = page AUTONOME (n'utilise PAS le Layout)** : c'est une landing « focus »
  (pas de nav, footer minimal) → elle a son propre `<html>/<head>/<body>`, sa police (Manrope,
  vs Source Code Pro ailleurs) et sa palette. **5 couleurs ajoutées au `tailwind.config.mjs`**
  pour elle : `cream`, `gris-bleu`, `panel`, `night` (#0F172A), `mint` (#34D399). *(Tailwind
  compilé s'applique quand même aux pages autonomes via l'intégration globale.)* Form **Brevo**
  (sibforms) auto-suffisant, pas de dépendance Netlify. ⚠️ *Pas de Google Analytics sur cette
  page (l'original n'en avait pas) — à ajouter si on veut tracker les conversions Insta/LinkedIn.*
- **`build.format: 'directory'` + `trailingSlash: 'always'`** (astro.config) → **URLs PROPRES**
  (ex. `/a-propos/`, pas `/a-propos.html`). Imposé par le plan SEO (brief collab v2 + `_redirects`
  qui mappe `/a-propos.html → /a-propos/`). ⚠️ Tous les liens internes et canonicals sont en URL
  propre ; les nouvelles pages (services, blog) suivent ce schéma. *(Avant v30 : `format: 'file'`
  en `.html` — basculé en v30.)*
- **Reframe « âme » → clarté / signal** sur la timeline À propos : 4 retouches de copie
  + le commentaire interne. L'orbe visuel est conservé (un point de lumière = clarté).

### v7 — 16 juin 2026
- Pas de changement de code. Ajout au suivi de la section **Positionnement & cible**
  (cible resserrée, registre spirituel/New Age exclu, voix de marque) et d'une note de
  **coordination avec le projet SEO** (réarchitecture du blog + pages de service).
- Contexte : la page **À propos** arrive en migration ; son symbole « âme » (timeline)
  est à refondre pour coller au nouveau positionnement.

### v6 — 16 juin 2026
- **Promotion du squelette global dans le `Layout`** : Navbar, Footer, bandeau cookies,
  chat Brevo + bulle proactive, et `script.js` sont désormais dans `Layout.astro`.
- `index.astro` ne contient plus que le contenu propre de la home (sections + modales).
- ➡️ La migration des autres pages est débloquée (une nouvelle page = juste son contenu).

### v5 — 16 juin 2026
- Extraction de la navigation et du pied de page en composants `Navbar.astro` et
  `Footer.astro` (à ce stade, importés dans `index.astro`).

### v4 — 16 juin 2026
- Création de ce fichier de suivi `SUIVI-PROJET.md`.

### v3 — 16 juin 2026
- Intégration de `page-cartes-blog.json` dans `public/` → l'aperçu blog de la home
  s'affiche correctement.
- Ajout du tutoriel `TUTORIEL-VITESSE.md`.

### v2 — 16 juin 2026
- **Correctif :** un `<script>` écrit dans un commentaire du frontmatter de `Layout.astro`
  cassait `npm run dev`. Commentaire réécrit sans tokens HTML/JS.

### v1 — 16 juin 2026
- Migration initiale de la page d'accueil. Suppression du **CDN Tailwind** (remplacé par
  Tailwind compilé, ~11 Ko gzip). Découpe `index.html` → `Layout.astro` (head) +
  `index.astro` (contenu). Scripts tiers conservés en `is:inline`.

---

## 🧱 Stack & décisions techniques (À LIRE pour reprendre)

| Choix | Détail | Pourquoi |
|---|---|---|
| **Astro 4** | `astro@^4.16` (pas la v5/v6) | Combo stable et éprouvé avec Tailwind v3 |
| **Tailwind v3** | `@astrojs/tailwind@^5` + `tailwindcss@^3.4` | Le site était en Tailwind v3 (via CDN) → rendu **identique**. La v4 = étape future. |
| **CDN Tailwind supprimé** | remplacé par Tailwind compilé | C'était LA cause n°1 de lourdeur (~400 Ko de JS bloquant). CSS final ≈ 11 Ko gzip. |
| **style.css / script.js** | gardés tels quels dans `public/` | On ne les touche pas pour l'instant → zéro régression |
| **`<script>` tiers** | tous marqués `is:inline` | Astro les laisse intacts (GA, ScrollReveal, Brevo) |
| **Fichiers statiques** | JSON, images, robots, sitemap → `public/` | Servis tels quels à la racine du site |

---

## 📂 Structure actuelle du projet `clartem-astro/`

```
public/
├─ assets/               ← images (À COPIER depuis le repo d'origine)
├─ css/style.css         ← CSS d'origine (inchangé)
├─ js/script.js          ← JS d'origine (inchangé)
└─ page-cartes-blog.json ← données du blog (260 articles) — intégré ✅
src/
├─ components/            ← briques réutilisables
│  ├─ Navbar.astro        ← barre de nav + menu mobile ✅
│  └─ Footer.astro        ← pied de page ✅
├─ layouts/Layout.astro  ← <head> + SQUELETTE GLOBAL (Navbar, slot, Footer,
│                            bandeau cookies, chat Brevo, script.js) ✅
└─ pages/index.astro     ← UNIQUEMENT le contenu propre de la home
                            (sections + modales lead-magnet / portfolio)
astro.config.mjs · tailwind.config.mjs · package.json
GUIDE-MIGRATION.md · TUTORIEL-VITESSE.md · ce fichier
```

---

## ✅ FAIT — Phase 1 : page d'accueil

- [x] Projet Astro initialisé (config Astro + Tailwind)
- [x] Suppression du CDN Tailwind → Tailwind compilé (couleurs custom reprises)
- [x] Découpe `index.html` → `Layout.astro` (head) + `index.astro` (contenu)
- [x] Scripts tiers conservés (`is:inline`) : GA4, ScrollReveal, Brevo
- [x] `page-cartes-blog.json` intégré dans `public/` → aperçu blog fonctionnel
- [x] Build **et** dev validés ; page testée (HTTP 200, rendu correct)
- [x] Guides écrits : migration + tutoriel vitesse

---

## 🔜 À FAIRE — feuille de route

### Phase 2 — Découper la home en composants  ⬅️ PROCHAINE ÉTAPE
On extrait chaque grosse partie de `index.astro` dans `src/components/`.

**Squelette global (dans le `Layout` → automatique sur TOUTES les pages) :** ✅ FAIT
- [x] `Navbar.astro` (barre de nav + menu mobile)
- [x] `Footer.astro`
- [x] **Promu dans le `Layout`** : Navbar + Footer + bandeau cookies + chat Brevo +
      bulle proactive + `script.js`. → Toute nouvelle page qui utilise `<Layout>` en
      hérite automatiquement. **La migration des autres pages est maintenant débloquée.**

**Composants de section (spécifiques à la home — OPTIONNEL, confort de lecture) :**
> Plus prioritaire maintenant que le squelette global est en place. À faire au besoin.
- [ ] `Hero` · `Manifesto` · `SolutionsMatrix` · `SiteConcept` · `Diagnostic`
- [ ] `MissionBridge` · `Plan` · `Objectifs` · `Portfolio` · `Offres`
- [ ] `BlogPreview` · `AboutTeaser` · `FaqPreview` · `CTA`
- [ ] Modales : aperçu guide (carousel) + lightbox mockup

### Phase 3 — Migrer les autres pages (réutilise le Layout + composants)
**Pages simples :**
- [x] `a-propos` ✅ — `src/pages/a-propos.astro` (thème sombre via `bodyClass`)
- [x] `faq` ✅ — `src/pages/faq.astro` (JSON-LD FAQPage via le slot `head`)
- [x] `contact` ✅ — `src/pages/contact.astro` (formulaire Netlify + Cloudinary)
- [x] `portfolio` ✅ — `src/pages/portfolio.astro` (**5 démos bien-être gardées**, 8 hors-cible retirées ; **filtres + bouton « voir plus » retirés** — inutiles avec 5 démos ; cadeau OFF)
- [x] ~~`solutions-par-metier`~~ → **À SUPPRIMER** du repo d'origine : vieille page jamais mise en ligne, **pas à migrer** (décision fondateur).

> 🗂️ **Tri portfolio (tracker SEO v20, validé fondateur)** — 5 gardées (Sophrologue,
> Naturopathe, Hypnothérapeute, Coach en Nutrition, Masseuse bien-être) · 8 coupées
> (Consultant Marketing, Coach Business, Coach de Carrière, Coach de Dirigeants, Coach
> Sportif, Confiance en Soi, Yoga, Décoratrice). **Ménage hors-Astro restant** : supprimer
> dans le repo d'origine les 8 `study_case_XX` + 8 `site-portfolio-XX` correspondants, avec
> **redirection 301** si l'un a du trafic (sinon → portfolio/home). Sur les pages stratégie
> gardées (03,05,08,09,12), **lisser « One-Page = notre ADN »** (porte d'entrée, pas dogme).

> 🧩 **Recette pour migrer une page** (le système est rôdé depuis la v8) :
> 1. créer `src/pages/<nom>.astro` ;
> 2. y mettre `import Layout` + `<Layout title="…" description="…" bodyClass="…">…</Layout>` ;
> 3. ne garder du HTML d'origine que **le contenu unique** (retirer nav, footer, et les
>    scripts/widgets globaux déjà fournis par le Layout) ;
> 4. garder les `<style>` et `<script>` **propres à la page** (scripts en `is:inline`) ;
> 5. convertir les chemins `assets/…` → `/assets/…` ;
> 6. tester `npm run build` **et** `npm run dev`.
- [x] `mentions-legales` ✅ · [x] `politique-de-confidentialite` ✅ · [x] `cgv` ✅ — pages légales, **`noindex`** + **restylées en thème sombre** (cohérence avec les autres pages, nav réglée). CGV : délai « 24-48h » → « 2-3 semaines » (cf. journal v22).
- [x] `checklist` ✅ — `src/pages/checklist.astro` (**landing lead magnet**, page autonome sans Layout — voir décisions)
- [x] `merci` · `merci-formulaire-blog` · `merci-formulaire-contact` ✅ — 3 pages de remerciement migrées :
      `merci` (autonome sombre : confettis + glassmorphism, après inscription lead magnet) ;
      `merci-formulaire-blog` (autonome minimal, confirmation de commentaire) ;
      `merci-formulaire-contact` (avec Layout : nav + footer, cible de la redirection du form contact).
- [x] ~~`clartem-local`~~ → **À SUPPRIMER** du repo d'origine (page « métiers locaux » abandonnée, plus d'actualité — décision fondateur).

**Le blog & les pages de service — CHANTIER EN COURS (brief collab v2 reçu, LOT 1) :**
> 📌 **Décisions verrouillées** (échange avec Frédéric, juin 2026) :
> - **URLs propres** partout (fait en v30). Articles : `/blog/<slug>/` · services : `/creation-site-web-<x>/`.
> - **PAS de Decap / Netlify Identity / Git Gateway / `/admin`** (Frédéric édite les fichiers
>   directement). MAIS blog en **content collections Markdown** (`src/content/blog/`) — juste sans couche CMS.
> - Préserver le SEO de chaque page source (`.html` fournis) : `title`, `meta description`,
>   `canonical` (→ URL propre), `h1`, **JSON-LD** (`Article` piliers+clusters ; `FAQPage` sur faq + les 4 piliers),
>   **liens internes** (maillage, → URLs propres), `alt` des images.
> - **Nav** : ajouter « **Blog** » (→ `/blog/`) + « **Création de site** » (→ hub `/creation-site-web-therapeute/`).
> - **Reconstruire `/blog/`** (index) auto depuis la collection, mettant en avant les **4 piliers**. Zéro page orpheline.
> - Voix « nous » sans équipe fictive · délai « 2 à 3 semaines » · aucune donnée inventée · home **statique** (pas touchée).
> - `_redirects` (IA SEO) → `public/_redirects` (fait en v30, complété pour contact/légales/checklist/merci).
> - Côté Frédéric/Netlify (hors Astro) : branche d'archive, suppression `articles/`, build `npm run build` → `dist`, sitemap+indexation (IA SEO).
- **Inventaire à intégrer** : 4 pages service (hub thérapeute + sophrologue/naturo/hypno) ·
  4 piliers (`creer-site-therapeute-qui-convertit`, `fiche-google-business-therapeute`,
  `site-therapeute-sur-mesure-sans-wordpress`, `prix-site-therapeute`) · **12 clusters + guide client (LOT 2, à venir)**.
- ⚠️ **Démos portfolio `study-case-pages/*.html`** : liens **laissés en `.html`** (fichiers statiques
  à garder « tels quels » → à déposer dans `public/study-case-pages/`). Le `_redirects` en redirige 3
  (05/07/11) vers `/portfolio/`. **Point à clarifier** : quelles démos sont conservées vs redirigées,
  et fournir les fichiers HTML des démos conservées (pas encore reçus).

**Formulaire de contact** (page migrée v13, mais à finaliser pour qu'il marche en prod) :
- [ ] **Héberger sur Netlify** : le formulaire utilise **Netlify Forms** (attribut `netlify`),
      qui ne fonctionne **que** sur Netlify (pas GitHub Pages). À trancher au déploiement.
- [x] ✅ **Page de remerciement `merci-formulaire-contact` migrée** (cible de la redirection
      `action="/merci-formulaire-contact.html"`) → plus de 404 après envoi. Reste juste le
      déploiement Netlify pour que le form lui-même fonctionne (voir ci-dessus).
- [ ] Vérifier les identifiants **Cloudinary** (upload de fichiers côté client, déjà en place).
- [x] ✅ Délai de **réponse** harmonisé à **48h** partout (contact + FAQ/pacte). Choix : 48h
      plutôt que 24h car le fondateur est seul → évite la pression d'un engagement trop serré
      (et rien n'empêche de répondre plus vite). « garantie » retiré côté contact (ton du pacte).
- Le dossier `netlify/functions/submit-contact.js` existe dans le repo d'origine — vérifier
      s'il est encore utilisé ou si Netlify Forms suffit.

### Phase 4 — Optimisation & mise en ligne
- [ ] **Optimisation des images** (composant `<Image>` d'Astro) → souvent le plus gros
      gain de poids réel
- [ ] Polices auto-hébergées / chargement optimisé
- [ ] `sitemap.xml` + `robots.txt`
- [ ] **Déploiement** (Netlify ou GitHub Pages — à trancher)
- [ ] (Optionnel, plus tard) passage à **Tailwind v4**

---

## ⚠️ Pièges rencontrés / à retenir

0. **Audit vocabulaire (accents)** : pour traquer les mots du registre exclu (« âme »,
   « spirituel »…), `grep -i` **rate les majuscules accentuées** (« ÂMES ») selon la locale.
   → utiliser un scan **Unicode** (Python `.lower()`) pour ne rien manquer.

1. **Frontmatter `.astro`** : ne jamais écrire `<script>`, `<slot/>` ou `...` dans les
   commentaires entre les `---` → Astro les prend pour du vrai code et plante.
   *(C'est l'erreur qu'on a corrigée le 1er jour.)*
2. **Classes Tailwind ajoutées par le JS** (ex. `bg-deep-blue`) : si elles n'apparaissent
   pas dans le HTML, Tailwind les supprime. → les ajouter à la `safelist` de
   `tailwind.config.mjs`.
3. **`fetch` relatifs** (ex. `page-cartes-blog.json`) : garder ces fichiers à la racine
   de `public/`.
4. **Emails Cloudflare** (`/cdn-cgi/l/email-protection`) : ne fonctionnent que si le site
   est derrière Cloudflare. À remplacer par les vraies adresses sinon.
5. **Mesure de vitesse** : toujours sur le **build** (`npm run preview`), jamais sur
   `npm run dev`. Détails dans `TUTORIEL-VITESSE.md`.

---

## 🔄 Reprendre dans une NOUVELLE conversation

Quand tu ouvres une nouvelle session, **joins ce fichier** (`SUIVI-PROJET.md`) + le `.zip`
du projet (ou au minimum `Layout.astro`, `index.astro`, `tailwind.config.mjs`), puis colle
ce message :

> « Je migre mon site clartem.com vers Astro, page par page, pour l'alléger sans changer
> le design. La Phase 1 (page d'accueil) est terminée. Tu trouveras tout l'état du projet
> dans le fichier SUIVI-PROJET.md que je te joins, ainsi que le projet. Je suis débutant
> en Astro, guide-moi. On en était à : [étape en cours]. »

Pense à **mettre à jour la date, les cases ☑, le numéro de version et le Journal des
versions** de ce fichier à chaque avancée, et à demander à Claude de **nommer les
fichiers livrés avec le suffixe `-vN`**.
