document.addEventListener('DOMContentLoaded', function () {


    // ==================================================================
    // LOGIQUE DU MENU NAVIGATION (Transparent au Scroll)
    // ==================================================================
    const nav = document.getElementById('main-nav');

    function handleScroll() {
        if (window.scrollY > 50) { // Seuil augmenté à 50px pour ne pas changer trop vite
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    if (nav) {
        // Écouteur d'événement au scroll
        window.addEventListener('scroll', handleScroll);

        // Appel immédiat au chargement (au cas où on rafraîchit la page au milieu)
        handleScroll();
    }






    // ==================================================================
    // GESTION INTELLIGENTE DU MENU MOBILE (HYBRIDE)
    // Compatible avec :
    // 1. Les nouvelles pages (Menu Premium Overlay)
    // 2. Les anciennes pages de blog (Ancien menu déroulant)
    // ==================================================================

    const mobileBtn = document.getElementById('mobile-menu-button');
    const newOverlay = document.getElementById('mobile-menu-overlay'); // Le nouveau (Premium)
    const oldMenu = document.getElementById('mobile-menu'); // L'ancien (Blog & Archives)

    if (mobileBtn) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Évite les conflits de clic

            // CAS 1 : C'est une page avec le NOUVEAU MENU PREMIUM
            if (newOverlay) {
                const isClosed = !newOverlay.classList.contains('open');

                if (isClosed) {
                    // Ouverture
                    newOverlay.classList.add('open');
                    document.body.classList.add('menu-open'); // Active l'animation du burger en croix
                } else {
                    // Fermeture
                    newOverlay.classList.remove('open');
                    document.body.classList.remove('menu-open');
                }
            }

            // CAS 2 : C'est une vieille page de blog (ANCIEN MENU)
            else if (oldMenu) {
                oldMenu.classList.toggle('hidden');

                // Petit correctif visuel pour l'ancien menu : 
                // Si on est tout en haut de page, on met le fond blanc pour que le menu soit lisible
                if (nav && !nav.classList.contains('scrolled')) {
                    nav.classList.add('scrolled');
                } else if (nav && window.scrollY <= 50 && oldMenu.classList.contains('hidden')) {
                    // Si on referme le menu et qu'on est en haut, on remet transparent
                    nav.classList.remove('scrolled');
                }
            }
        });

        // GESTION DU CLIC SUR LES LIENS (Pour fermer le menu après clic)

        // Pour le nouveau menu
        if (newOverlay) {
            const newLinks = newOverlay.querySelectorAll('.mobile-link');
            newLinks.forEach(link => {
                link.addEventListener('click', () => {
                    newOverlay.classList.remove('open');
                    document.body.classList.remove('menu-open');
                });
            });
        }

        // Pour l'ancien menu
        if (oldMenu) {
            const oldLinks = oldMenu.querySelectorAll('a');
            oldLinks.forEach(link => {
                link.addEventListener('click', () => {
                    oldMenu.classList.add('hidden');
                });
            });
        }
    }









    // ==================================================================
    // ANIMATIONS AVEC SCROLLREVEAL (VERSION SÉCURISÉE POUR TOUT LE SITE)
    // ==================================================================
    if (typeof ScrollReveal !== 'undefined') {

        // Fonction d'initialisation
        const initScrollReveal = () => {
            const srConfig = {
                origin: 'bottom',
                distance: '30px',
                duration: 800,
                delay: 0,
                opacity: 0,
                scale: 1,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                reset: false,

                // --- CORRECTION 1 : DÉCLENCHEMENT PLUS SENSIBLE ---
                // On passe de 0.2 à 0.1 (10% de visibilité suffit)
                viewFactor: 0.1,

                // --- CORRECTION 2 : GESTION MOBILE ---
                // Parfois, désactiver le calcul précis sur mobile aide
                mobile: true,
                useDelay: 'always' // Force le délai même si on scroll vite
            };


            const sr = ScrollReveal(srConfig);

            // 1. Vos sélecteurs globaux
            sr.reveal('[data-sr]', { interval: 100 });
            sr.reveal('[data-sr-delay="100"]', { delay: 300 });
            sr.reveal('[data-sr-delay="200"]', { delay: 400 });
            sr.reveal('[data-sr-delay="300"]', { delay: 500 });
            sr.reveal('[data-sr-origin="right"]', { origin: 'right', distance: '60px', duration: 1000, delay: 200 });
            sr.reveal('[data-sr-origin="left"]', { origin: 'left', distance: '60px', duration: 1000, delay: 200 });






            // --- NOUVEAU : ANIMATIONS 3D TIMELINE ---

            // Cartes de GAUCHE (Arrivent de la gauche avec rotation)
            sr.reveal('[data-sr-3d-left]', {
                duration: 1500,          // Animation lente et majestueuse
                distance: '100px',       // Vient de loin
                origin: 'left',          // Vient de la gauche
                opacity: 0,

                // LA TOUCHE 3D :
                rotate: { x: 20, y: 50, z: 0 }, // x=20 (bascule un peu arrière), y=50 (pivote côté)

                scale: 0.85,             // Commence un peu plus petit
                easing: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)', // Effet rebond doux
                viewFactor: 0.3,
                mobile: false // Désactivé sur mobile pour éviter les débordements (voir note plus bas)
            });

            // Cartes de DROITE (Arrivent de la droite avec rotation inverse)
            sr.reveal('[data-sr-3d-right]', {
                duration: 1500,
                distance: '100px',
                origin: 'right',         // Vient de la droite
                opacity: 0,

                // ROTATION INVERSÉE sur Y (-50)
                rotate: { x: 20, y: -50, z: 0 },

                scale: 0.85,
                easing: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
                viewFactor: 0.3,
                mobile: false
            });

            // FALLBACK MOBILE (Animation simple verticale pour les téléphones)
            // ScrollReveal gère cela automatiquement si mobile: false, 
            // mais on peut forcer une animation simple ici si vous préférez :
            if (window.innerWidth < 768) {
                sr.reveal('[data-sr-3d-left], [data-sr-3d-right]', {
                    origin: 'bottom',
                    distance: '50px',
                    duration: 800,
                    rotate: { x: 0, y: 0, z: 0 },
                    opacity: 0
                });
            }





            // 2. --- ANIMATION SPÉCIFIQUE CONCEPT (ROTATION 3D) ---
            sr.reveal('.concept-card', {
                duration: 1200,
                distance: '100px',
                origin: 'bottom',
                opacity: 0,
                scale: 0.85,
                rotate: { x: 60, y: 0, z: -10 }, // Rotation 3D
                interval: 200,
                easing: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
                viewFactor: 0.5,

                afterReveal: function (el) {
                    // On met une chaîne vide '' au lieu de 'none'. 
                    // Cela supprime l'attribut style inline et rend la main au CSS/Tailwind.
                    el.style.transform = '';

                    // On supprime aussi la transition JS pour laisser Tailwind (duration-500) gérer la vitesse
                    el.style.transition = '';
                }
            });

            // =========================================================
            //  CORRECTION ICI : J'ai déplacé le code Diagnostic DANS la fonction
            // =========================================================

            // 3. --- ANIMATION SPÉCIFIQUE DIAGNOSTIC (LE DÉPLIAGE 3D) ---
            sr.reveal('#diagnostic-card', {
                duration: 1500, // Assez lent pour être majestueux
                distance: '100px', // Vient du bas
                origin: 'bottom',
                opacity: 0,
                scale: 0.9, // Commence un peu plus petit

                // C'est ici l'effet "Feuille/Tablette" : Rotation sur l'axe X
                rotate: { x: 40, y: 0, z: 0 },

                // Une courbe d'animation "Back" pour un petit effet de rebond à la fin
                easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',

                viewFactor: 0.3, // Déclenche quand 30% de la carte est visible

                // Une fois l'animation finie, on lance l'effet de scan lumineux + reset
                afterReveal: function (el) {
                    el.style.transform = 'none'; // Nettoyage pour la netteté du texte
                    el.classList.add('diagnostic-scanned'); // Lance le flash lumineux
                }
            });

            // 4. --- CASCADE DES SYMPTÔMES (À L'INTÉRIEUR DE LA CARTE) ---
            sr.reveal('#diagnostic-card .group', {
                delay: 600, // Attend que la carte soit presque en place
                interval: 200, // 200ms entre chaque symptôme
                origin: 'left', // Ils glissent de la gauche
                distance: '20px',
                opacity: 0,
                duration: 800,
                easing: 'ease-out'
            });


            // =========================================================
            //  CORRECTION : FILET DE SÉCURITÉ ANTI-BUG SCROLL RAPIDE
            // =========================================================

            // 1. Force un recalcul quand on arrête de scroller
            let isScrolling;
            window.addEventListener('scroll', () => {
                window.clearTimeout(isScrolling);
                isScrolling = setTimeout(() => {
                    // Quand le scroll s'arrête depuis 100ms, on force ScrollReveal à vérifier
                    try { sr.delegate(); } catch (e) { }
                }, 100);
            }, { passive: true });

            // 2. Vérification de secours toutes les secondes
            // Si un élément est visible à l'écran mais a encore opacity: 0, on le force.
            setInterval(() => {
                const revealElements = document.querySelectorAll('[data-sr-id]');
                const windowHeight = window.innerHeight;

                revealElements.forEach(el => {
                    const rect = el.getBoundingClientRect();
                    // Si l'élément est dans l'écran
                    if (rect.top < windowHeight - 50 && rect.bottom > 0) {
                        // Et qu'il est toujours invisible (opacity proche de 0)
                        if (getComputedStyle(el).opacity < 0.1) {
                            // On force l'affichage manuellement
                            el.style.opacity = '1';
                            el.style.transform = 'translate(0,0) scale(1)';
                            el.style.visibility = 'visible';
                        }
                    }
                });
            }, 1000);




            // Force un recalcul après un court instant (sécurité anti-bug)
            setTimeout(() => {
                try { sr.delegate(); } catch (e) { }
            }, 500);
        };

        // Logique de chargement intelligente
        if (document.readyState === 'complete') {
            initScrollReveal();
        } else {
            window.addEventListener('load', initScrollReveal);
        }
    }









    // ==================================================================
    // LOGIQUE POUR L'ACCORDÉON FAQ (VERSION CARTES SÉPARÉES)
    // ==================================================================
    const faqToggles = document.querySelectorAll('.faq-toggle');

    if (faqToggles.length > 0) {
        faqToggles.forEach(clickedToggle => {
            clickedToggle.addEventListener('click', () => {
                const answerToOpen = clickedToggle.nextElementSibling;
                const iconToRotate = clickedToggle.querySelector('svg');
                // On récupère le conteneur du rond pour changer sa couleur si besoin
                const iconContainer = clickedToggle.querySelector('.w-8');

                const isAlreadyOpen = answerToOpen.style.maxHeight;

                // Étape 1 : Fermer tous les autres tiroirs (Logique accordéon strict)
                faqToggles.forEach(toggle => {
                    if (toggle !== clickedToggle) {
                        const answer = toggle.nextElementSibling;
                        const icon = toggle.querySelector('svg');
                        const container = toggle.querySelector('.w-8');

                        answer.style.maxHeight = null;
                        icon.classList.remove('rotate-180');
                        toggle.classList.remove('active');

                        // Reset style icône inactif
                        if (container) {
                            // On laisse les classes hover gérer le retour, 
                            // ou on force le style par défaut si on avait ajouté des classes via JS
                        }
                    }
                });

                // Étape 2 : Basculer l'état du cliqué
                if (!isAlreadyOpen) {
                    // OUVRIR
                    answerToOpen.style.maxHeight = answerToOpen.scrollHeight + "px";
                    iconToRotate.classList.add('rotate-180');
                    clickedToggle.classList.add('active');
                } else {
                    // FERMER
                    answerToOpen.style.maxHeight = null;
                    iconToRotate.classList.remove('rotate-180');
                    clickedToggle.classList.remove('active');
                }
            });
        });
    }







    // ==================================================================
    // LOGIQUE POUR L'ACCORDÉON DANS LA CARTE PRIX (IMPACT, ANCRAGE & EXPANSION)
    // Mise à jour : Un seul menu ouvert à la fois par carte
    // ==================================================================
    const pricingToggles = document.querySelectorAll('.pricing-toggle');

    if (pricingToggles.length > 0) {
        pricingToggles.forEach(toggle => {
            toggle.addEventListener('click', function () {
                // 1. Identifier la carte parente (pour ne pas fermer les menus des autres offres)
                // Dans votre HTML, chaque carte a la classe "group"
                const parentCard = this.closest('.group');

                // 2. Si on a trouvé la carte parente, on ferme les autres menus de CETTE carte
                if (parentCard) {
                    // On cherche tous les boutons déjà actifs DANS cette carte
                    const activeTogglesInCard = parentCard.querySelectorAll('.pricing-toggle.active');

                    activeTogglesInCard.forEach(otherToggle => {
                        // Si ce n'est pas le bouton sur lequel on vient de cliquer, on le ferme
                        if (otherToggle !== this) {
                            otherToggle.classList.remove('active');
                            const otherContent = otherToggle.nextElementSibling;
                            otherContent.style.maxHeight = null;
                            otherContent.classList.remove('anim-active');
                        }
                    });
                }

                // 3. Basculer l'état du menu cliqué (Ouvrir/Fermer)
                this.classList.toggle('active');
                const content = this.nextElementSibling;

                if (content.style.maxHeight) {
                    // Si ouvert -> on ferme
                    content.style.maxHeight = null;
                    content.classList.remove('anim-active');
                } else {
                    // Si fermé -> on ouvre
                    content.style.maxHeight = content.scrollHeight + "px";
                    content.classList.add('anim-active');
                }
            });
        });
    }





    // ==================================================================
    // ANIMATION DES IMAGES + SYNC SCROLLREVEAL
    // ==================================================================
    const lazyImages = document.querySelectorAll('img.lazy-load');
    const handleImageLoad = (img) => {
        const onLoaded = () => {
            img.classList.add('loaded');
            // CORRECTION : On dit à ScrollReveal de recalculer la hauteur de la page
            // car l'image vient d'apparaître
            if (typeof ScrollReveal !== 'undefined') {
                window.dispatchEvent(new Event('resize'));
            }
        };

        if (img.complete) {
            onLoaded();
        } else {
            img.addEventListener('load', onLoaded, { once: true });
        }
    };
    lazyImages.forEach(handleImageLoad);




    // ==================================================================
    // LOGIQUE FILTRE ET "VOIR PLUS" DU PORTFOLIO (SI EXISTANT)
    // ==================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioGrid = document.getElementById('portfolio-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const loadMoreContainer = document.getElementById('load-more-container');

    if (filterButtons.length > 0 && portfolioGrid && loadMoreBtn) {
        const itemsToShowInitially = 6;
        const itemsToLoadOnClick = 6;
        let currentlyVisibleCount;

        const applyVisibility = () => {
            const visibleItems = Array.from(portfolioGrid.querySelectorAll('.portfolio-item:not(.hidden)'));
            visibleItems.forEach((item, index) => {
                if (index < currentlyVisibleCount) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
            if (visibleItems.length > currentlyVisibleCount) {
                loadMoreContainer.style.display = 'block';
            } else {
                loadMoreContainer.style.display = 'none';
            }
        };

        loadMoreBtn.addEventListener('click', () => {
            currentlyVisibleCount += itemsToLoadOnClick;
            applyVisibility();
        });

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                filterButtons.forEach(btn => btn.classList.remove('bg-deep-blue', 'text-white'));
                button.classList.add('bg-deep-blue', 'text-white');
                const allItems = portfolioGrid.querySelectorAll('.portfolio-item');
                allItems.forEach(item => {
                    item.style.display = '';
                    const category = item.dataset.category;
                    if (filter === 'all' || filter === category) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
                currentlyVisibleCount = itemsToShowInitially;
                applyVisibility();
            });
        });

        document.querySelector('.filter-btn[data-filter="all"]').click();
    }














    // ==================================================================
    // LOGIQUE POUR L'EFFET STACKING CARDS (SECTION PLAN) - CORRIGÉE
    // ==================================================================
    const planSection = document.getElementById('plan');
    const stackingContainer = document.getElementById('stacking-container');

    if (planSection && stackingContainer) {
        const panels = Array.from(planSection.querySelectorAll('.panel'));
        const numPanels = panels.length;

        // On réduit le délai de démarrage pour que l'animation réagisse tout de suite
        const START_DELAY = 0.05;
        const END_DELAY = 0.05;

        const handleScroll = () => {
            const rect = stackingContainer.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Calcul de la progression du scroll dans la section (de 0 à 1)
            const start = rect.top * -1;
            const end = stackingContainer.offsetHeight - viewportHeight;
            let progress = start / end;
            progress = Math.max(0, Math.min(1, progress));

            // Calcul de la progression de l'animation
            const animationDuration = 1.0 - START_DELAY - END_DELAY;
            let animProgress = (progress - START_DELAY) / animationDuration;
            animProgress = Math.max(0, Math.min(1, animProgress));

            // On étale la progression sur le nombre de cartes
            // Si on a 6 cartes, on veut 5 transitions (0->1, 1->2, etc.)
            const panelProgress = animProgress * (numPanels - 1);

            panels.forEach((panel, i) => {
                // 1. Z-INDEX : On inverse la logique précédente.
                // La carte 0 est tout au fond (z=0), la suivante par-dessus (z=1), etc.
                panel.style.zIndex = i;

                // 2. OPACITÉ & CLIC : Toujours visibles et cliquables
                panel.style.opacity = '1';
                panel.style.pointerEvents = 'auto';

                // 3. CALCUL DE LA POSITION
                // 'offset' détermine où en est CETTE carte par rapport au scroll global.
                // offset < -1  : La carte est en attente en bas (invisible)
                // -1 < offset < 0 : La carte est en train de monter (animation d'entrée)
                // offset > 0   : La carte est en place et se fait recouvrir (animation de recul)
                const offset = panelProgress - i;

                if (offset < -1) {
                    // CAS 1 : Carte future (cachée en bas de l'écran)
                    panel.style.transform = `translateY(120vh) scale(1)`;
                }
                else if (offset < 0) {
                    // CAS 2 : Carte qui arrive (slide du bas vers le centre)
                    // On convertit l'offset (-1 à 0) en pourcentage de hauteur (100vh à 0vh)
                    const yPos = Math.abs(offset) * 100;
                    panel.style.transform = `translateY(${yPos}vh) scale(1)`;
                }
                else {
                    // CAS 3 : Carte installée (Active ou Passée)
                    // Elle reste fixe au centre (0px) mais réduit légèrement sa taille
                    // pour créer un effet de profondeur "pile de cartes"

                    // On limite l'effet de profondeur aux 3 dernières cartes pour économiser les ressources
                    const depth = Math.min(offset, 3);
                    const scale = Math.max(0.9, 1 - (depth * 0.05)); // Réduit de 5% par carte par-dessus

                    panel.style.transform = `translateY(0px) scale(${scale})`;
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Appel initial
    }










    // ==================================================================
    // NOUVEAU : LOGIQUE POUR L'ANIMATION DE LA SECTION "EMPATHIE" (VERSION 2)
    // ==================================================================
    const empathyContainer = document.getElementById('empathy-scroll-container');
    if (empathyContainer && window.innerWidth >= 768) {
        const empathyImage = document.getElementById('empathy-image-container');
        const empathyTextItems = empathyContainer.querySelectorAll('.empathy-reveal-item');

        // Paramètres de l'animation de l'image
        const IMAGE_ANIM_START = 0.0; // L'animation commence dès le début du scroll
        const IMAGE_ANIM_END = 0.35;  // L'animation se termine à 35% du scroll
        const IMAGE_ANIM_DURATION = IMAGE_ANIM_END - IMAGE_ANIM_START;

        // Seuils d'apparition pour les textes (commencent APRES la fin de l'animation de l'image)
        const textThresholds = [
            0.40, // Étape 0: Titre "Une approche..."
            0.55, // Étape 1: Item 1 "Je respecte..."
            0.70, // Étape 2: Item 2 "Je comprends..."
            0.85  // Étape 3: Item 3 "Je parle..."
        ];

        const handleEmpathyScroll = () => {
            const rect = empathyContainer.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;

            const scrollAmount = -rect.top;
            const scrollHeight = empathyContainer.offsetHeight - window.innerHeight;

            let progress = scrollAmount / scrollHeight;
            progress = Math.max(0, Math.min(1, progress));

            // --- Animation continue de l'image ---
            if (empathyImage) {
                // Calcule la progression spécifique à l'animation de l'image
                let imageProgress = (progress - IMAGE_ANIM_START) / IMAGE_ANIM_DURATION;
                imageProgress = Math.max(0, Math.min(1, imageProgress)); // Bloque entre 0 et 1

                // Calcule la position X. Commence à 100% de la largeur de la vue et va vers 0.
                const translateX = window.innerWidth * (1 - imageProgress);

                // MODIFIÉ : La ligne qui contrôlait l'opacité a été supprimée.
                empathyImage.style.transform = `translateX(${translateX}px)`;
            }

            // --- Animation en escalier des textes ---
            empathyTextItems.forEach(el => {
                const step = parseInt(el.dataset.step, 10);
                if (progress >= textThresholds[step]) {
                    el.classList.add('is-visible');
                } else {
                    el.classList.remove('is-visible');
                }
            });
        };

        window.addEventListener('scroll', handleEmpathyScroll, { passive: true });
        handleEmpathyScroll(); // Appel initial pour positionner correctement au chargement
    }

    // ==================================================================
    // NOUVEAU : LOGIQUE POUR L'ANIMATION DE LA SECTION "AUTORITÉ" (VERSION 2)
    // ==================================================================
    const authorityContainer = document.getElementById('authority-scroll-container');
    if (authorityContainer && window.innerWidth >= 768) {
        const authorityImage = document.getElementById('authority-image-container');
        const authorityTextItems = authorityContainer.querySelectorAll('.authority-reveal-item');

        // Paramètres de l'animation de l'image
        const IMAGE_ANIM_START = 0.0;
        const IMAGE_ANIM_END = 0.35;
        const IMAGE_ANIM_DURATION = IMAGE_ANIM_END - IMAGE_ANIM_START;

        // ==================================================================
        //                      *** CORRECTION ICI ***
        // Les anciens seuils commençaient trop tôt. Les nouveaux seuils
        // commencent après la fin de l'animation de l'image (0.35).
        // ==================================================================
        const textThresholds = [
            0.40, // Étape 0: Titre "Un guide..."
            0.55, // Étape 1: Item 1 "Un processus..."
            0.70, // Étape 2: Item 2 "Une expertise..."
            0.85  // Étape 3: Item 3 "Un objectif..."
        ];

        const handleAuthorityScroll = () => {
            const rect = authorityContainer.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;

            const scrollAmount = -rect.top;
            const scrollHeight = authorityContainer.offsetHeight - window.innerHeight;

            let progress = scrollAmount / scrollHeight;
            progress = Math.max(0, Math.min(1, progress));

            // --- Animation continue de l'image ---
            if (authorityImage) {
                let imageProgress = (progress - IMAGE_ANIM_START) / IMAGE_ANIM_DURATION;
                imageProgress = Math.max(0, Math.min(1, imageProgress));

                // Calcule la position X. Commence à -100% (gauche) et va vers 0.
                const translateX = -window.innerWidth * (1 - imageProgress);

                // MODIFIÉ : La ligne qui contrôlait l'opacité a été supprimée.
                authorityImage.style.transform = `translateX(${translateX}px)`;
            }

            // --- Animation en escalier des textes ---
            authorityTextItems.forEach(el => {
                const step = parseInt(el.dataset.step, 10);
                if (progress >= textThresholds[step]) {
                    el.classList.add('is-visible');
                } else {
                    el.classList.remove('is-visible');
                }
            });
        };

        window.addEventListener('scroll', handleAuthorityScroll, { passive: true });
        handleAuthorityScroll(); // Appel initial
    }


    // ==================================================================
    // LOGIQUE COMPLÈTE POUR LA PAGE BLOG (VERSION CORRIGÉE - CSS ANIMATION)
    // ==================================================================
    const blogPage = document.getElementById('articles-grid');

    if (blogPage) {
        async function initBlog() {
            try {
                // --- 1. CHARGEMENT DES DONNÉES ---
                const response = await fetch('page-cartes-blog.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                let allArticles = await response.json();

                // ==================================================================
                //            *** NOUVELLE LOGIQUE POUR L'ARTICLE "À LA UNE" ***
                // ==================================================================

                // 1. On cherche l'article marqué comme "featured"
                const featuredArticle = allArticles.find(article => article.featured === true);

                // 2. On crée une nouvelle liste qui exclut l'article "featured"
                let regularArticles = allArticles.filter(article => !article.featured);

                // 3. On trie UNIQUEMENT les articles réguliers par date
                const parseFrenchDate = (dateString) => {
                    const months = {
                        'Janvier': 0, 'Février': 1, 'Mars': 2, 'Avril': 3, 'Mai': 4, 'Juin': 5,
                        'Juillet': 6, 'Août': 7, 'Septembre': 8, 'Octobre': 9, 'Novembre': 10, 'Décembre': 11
                    };
                    const parts = dateString.split(' ');
                    const day = parseInt(parts[0], 10);
                    const month = months[parts[1]];
                    const year = parseInt(parts[2], 10);
                    return new Date(year, month, day);
                };

                regularArticles.sort((a, b) => {
                    const dateA = parseFrenchDate(a.date);
                    const dateB = parseFrenchDate(b.date);
                    return dateB - dateA; // Tri descendant
                });

                // ==================================================================
                //                  *** FIN DE LA NOUVELLE LOGIQUE ***
                // ==================================================================


                // --- 2. GESTION DE L'ÉTAT ---
                const ITEMS_PER_PAGE = 9;
                let currentPage = 1;
                let activeCategory = 'all';
                let searchQuery = '';

                // --- 3. SÉLECTION DES ÉLÉMENTS DU DOM ---
                const articlesGrid = document.getElementById('articles-grid');
                const articlesGridTitle = document.getElementById('articles-grid-title');
                const featuredPostContainer = document.getElementById('featured-post');
                const paginationContainer = document.getElementById('pagination-container');
                const categoryFilters = document.getElementById('category-filters');
                const searchInput = document.getElementById('search-input');
                const noResults = document.getElementById('no-results');

                // --- 4. FONCTIONS PRINCIPALES ---

                function renderArticles() {
                    // 4.1 Filtrage (maintenant basé sur les articles réguliers)
                    let filteredArticles = regularArticles; // On part de la liste sans l'article "à la une"
                    if (activeCategory !== 'all') {
                        filteredArticles = filteredArticles.filter(article => article.category === activeCategory);
                    }
                    if (searchQuery) {
                        const lowerCaseQuery = searchQuery.toLowerCase();
                        // La recherche s'applique aussi à la liste triée des articles réguliers
                        let allRegularArticlesForSearch = regularArticles;
                        if (activeCategory !== 'all') {
                            allRegularArticlesForSearch = allRegularArticlesForSearch.filter(article => article.category === activeCategory);
                        }
                        filteredArticles = allRegularArticlesForSearch.filter(article =>
                            article.title.toLowerCase().includes(lowerCaseQuery) ||
                            article.description.toLowerCase().includes(lowerCaseQuery)
                        );
                    }

                    noResults.classList.toggle('hidden', filteredArticles.length > 0);

                    // 4.2 Article "À la Une"
                    const showFeaturedPost = featuredArticle && currentPage === 1 && !searchQuery && activeCategory === 'all';

                    if (showFeaturedPost) {
                        // CORRECTION : Utilisation de fade-in-entry au lieu de data-sr
                        featuredPostContainer.innerHTML = `
                        <h2 class="text-3xl font-bold text-neutral-dark mb-10 text-center fade-in-entry">À la Une</h2>
                        <a href="${featuredArticle.link}" class="block group fade-in-entry" style="animation-delay: 0.1s;">
                            <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-center bg-soft-blue p-8 rounded-2xl border-2 border-gray-200">
                                <img src="${featuredArticle.image}" alt="${featuredArticle.title}" class="w-full h-64 md:h-full object-cover rounded-xl shadow-lg">
                                <div class="flex flex-col">
                                    <h3 class="text-2xl md:text-3xl font-bold text-neutral-dark mb-3 group-hover:text-clarity-blue transition-colors">${featuredArticle.title}</h3>
                                    <p class="text-neutral-light text-base mb-6 flex-grow">${featuredArticle.description}</p>
                                    <span class="text-sm text-neutral-light mt-auto">${featuredArticle.date}</span>
                                </div>
                            </div>
                        </a>
                    `;
                        featuredPostContainer.classList.remove('hidden');
                        articlesGridTitle.textContent = "Tous les articles";
                    } else {
                        featuredPostContainer.classList.add('hidden');
                        articlesGridTitle.textContent = "Résultats de la recherche";
                        if (!searchQuery && activeCategory === 'all') {
                            articlesGridTitle.textContent = "Tous les articles";
                        }
                    }

                    // 4.3 Pagination (basée sur les articles filtrés)
                    const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
                    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                    const endIndex = startIndex + ITEMS_PER_PAGE;
                    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

                    // 4.4 Affichage (CORRIGÉ : Utilisation de fade-in-entry)
                    articlesGrid.innerHTML = paginatedArticles.map(article => `
                    <div class="portfolio-item fade-in-entry">
                        <a href="${article.link}" class="block h-full group">
                            <div class="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col overflow-hidden border border-gray-200 h-full">
                                <img src="${article.image}" alt="${article.title}" class="w-full h-48 object-cover">
                                <div class="p-6 flex flex-col flex-grow">
                                    <h3 class="text-xl font-bold text-neutral-dark mb-2 group-hover:text-clarity-blue transition-colors">${article.title}</h3>
                                    <p class="text-neutral-light text-sm mb-4 flex-grow">${article.description}</p>
                                    <span class="text-xs text-neutral-light mt-auto">${article.date}</span>
                                </div>
                            </div>
                        </a>
                    </div>
                `).join('');

                    renderPagination(totalPages);

                    // NOTE : On ne relance plus ScrollReveal() ici pour éviter les conflits.
                    // L'animation est gérée par le CSS .fade-in-entry
                }

                // Le reste de la fonction (pagination, événements) ne change pas...
                function renderPagination(totalPages) {
                    if (totalPages <= 1) {
                        paginationContainer.innerHTML = '';
                        return;
                    }

                    const getPageNumbers = () => {
                        const pageNumbers = [];
                        const maxPagesToShow = 5;
                        const half = Math.floor(maxPagesToShow / 2);

                        if (totalPages <= maxPagesToShow + 2) {
                            for (let i = 1; i <= totalPages; i++) {
                                pageNumbers.push(i);
                            }
                        } else if (currentPage <= half + 1) {
                            for (let i = 1; i <= maxPagesToShow; i++) {
                                pageNumbers.push(i);
                            }
                            pageNumbers.push('...');
                            pageNumbers.push(totalPages);
                        } else if (currentPage >= totalPages - half) {
                            pageNumbers.push(1);
                            pageNumbers.push('...');
                            for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
                                pageNumbers.push(i);
                            }
                        } else {
                            pageNumbers.push(1);
                            pageNumbers.push('...');
                            for (let i = currentPage - half; i <= currentPage + half; i++) {
                                pageNumbers.push(i);
                            }
                            pageNumbers.push('...');
                            pageNumbers.push(totalPages);
                        }
                        return pageNumbers;
                    };

                    const pageNumbers = getPageNumbers();
                    let paginationHTML = `
                    <button id="prev-page" class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''}>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                `;
                    pageNumbers.forEach(num => {
                        if (num === '...') {
                            paginationHTML += `<span class="pagination-ellipsis">...</span>`;
                        } else {
                            paginationHTML += `<button class="pagination-btn page-number ${num === currentPage ? 'active' : ''}" data-page="${num}">${num}</button>`;
                        }
                    });
                    paginationHTML += `
                    <button id="next-page" class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''}>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                `;
                    paginationContainer.innerHTML = paginationHTML;
                }

                categoryFilters.addEventListener('click', (e) => {
                    if (e.target.classList.contains('filter-btn')) {
                        categoryFilters.querySelector('.active').classList.remove('active');
                        e.target.classList.add('active');
                        activeCategory = e.target.dataset.filter;
                        currentPage = 1;
                        renderArticles();
                        articlesGridTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });

                const searchForm = document.getElementById('search-form');
                searchForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    searchQuery = searchInput.value;
                    currentPage = 1;
                    renderArticles();
                    articlesGridTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });

                searchInput.addEventListener('input', () => {
                    if (searchInput.value === '') {
                        searchQuery = '';
                        currentPage = 1;
                        renderArticles();
                    }
                });

                paginationContainer.addEventListener('click', (e) => {
                    const target = e.target.closest('button');
                    if (!target) return;

                    let needsScroll = false;

                    // Calcul du nombre total de pages pour la catégorie/recherche actuelle
                    let relevantArticles = regularArticles;
                    if (activeCategory !== 'all') {
                        relevantArticles = relevantArticles.filter(article => article.category === activeCategory);
                    }
                    if (searchQuery) {
                        relevantArticles = relevantArticles.filter(article =>
                            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            article.description.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                    }
                    const totalPages = Math.ceil(relevantArticles.length / ITEMS_PER_PAGE);

                    if (target.id === 'prev-page') {
                        if (currentPage > 1) {
                            currentPage--;
                            needsScroll = true;
                        }
                    } else if (target.id === 'next-page') {
                        if (currentPage < totalPages) {
                            currentPage++;
                            needsScroll = true;
                        }
                    } else if (target.classList.contains('page-number')) {
                        const newPage = parseInt(target.dataset.page);
                        if (newPage !== currentPage) {
                            currentPage = newPage;
                            needsScroll = true;
                        }
                    }

                    if (needsScroll) {
                        renderArticles();
                        articlesGridTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });

                // --- 6. INITIALISATION ---
                renderArticles();

            } catch (error) {
                console.error("Impossible de charger les articles du blog:", error);
                articlesGrid.innerHTML = `<p class="text-center text-destructive col-span-full">Erreur lors du chargement des articles. Veuillez réessayer plus tard.</p>`;
            }
        }
        // Lancement de la logique de la page blog
        initBlog();
    }





    // ==================================================================
    // LOGIQUE POUR L'APERÇU DU BLOG (STYLE ÉDITORIAL PREMIUM) - CORRIGÉE
    // ==================================================================
    async function initBlogPreview() {
        // On cible les deux nouveaux conteneurs
        const featuredContainer = document.getElementById('featured-article-container');
        const sidebarContainer = document.getElementById('sidebar-articles-container');

        // Sécurité si la section n'existe pas
        if (!featuredContainer || !sidebarContainer) return;

        try {
            const response = await fetch('page-cartes-blog.json');
            if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

            const allArticles = await response.json();

            // On prend les 3 articles les plus récents
            const latestArticles = allArticles.slice(0, 3);

            if (latestArticles.length === 0) return;

            // 1. GÉNÉRATION DE L'ARTICLE À LA UNE (Le premier)
            const mainArticle = latestArticles[0];

            // CORRECTION : Utilisation de fade-in-entry et style inline pour le délai
            featuredContainer.innerHTML = `
            <a href="${mainArticle.link}" class="group block h-full relative overflow-hidden rounded-3xl fade-in-entry" style="animation-delay: 0.1s;">
                <!-- Image de fond -->
                <div class="absolute inset-0">
                    <img src="${mainArticle.image}" alt="${mainArticle.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                    <!-- Overlay dégradé sombre pour lisibilité texte -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-70 transition-opacity"></div>
                </div>
                
                <!-- Contenu -->
                <div class="relative h-full flex flex-col justify-end p-8 md:p-12 z-10">
                    <div class="mb-4">
                        <span class="bg-warm-orange text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">À la Une</span>
                    </div>
                    <h3 class="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-warm-orange transition-colors">
                        ${mainArticle.title}
                    </h3>
                    <p class="text-gray-300 line-clamp-2 md:line-clamp-3 mb-6 text-lg max-w-2xl">
                        ${mainArticle.description}
                    </p>
                    <div class="flex items-center text-sm text-gray-400 font-medium">
                        <span>${mainArticle.date}</span>
                        <span class="mx-2">•</span>
                        <span class="flex items-center gap-1 group-hover:translate-x-2 transition-transform duration-300 text-white">
                            Lire l'article <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </span>
                    </div>
                </div>
            </a>
        `;

            // 2. GÉNÉRATION DES ARTICLES SECONDAIRES (Les suivants)
            const sideArticles = latestArticles.slice(1, 3);

            let sidebarHTML = `<div class="flex flex-col gap-6 h-full">`;

            sideArticles.forEach((article, index) => {
                // CORRECTION : Utilisation de fade-in-entry et calcul du délai
                sidebarHTML += `
                <a href="${article.link}" class="group flex flex-col sm:flex-row gap-6 bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors h-full fade-in-entry" style="animation-delay: ${(index + 2) * 0.15}s;">
                    <!-- Image miniature -->
                    <div class="w-full sm:w-1/3 aspect-video sm:aspect-square rounded-xl overflow-hidden flex-shrink-0">
                        <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                    </div>
                    
                    <!-- Contenu -->
                    <div class="flex flex-col justify-center">
                        <span class="text-warm-orange text-xs font-bold uppercase tracking-wider mb-2">${article.category || 'Conseil'}</span>
                        <h4 class="text-xl font-bold text-white mb-3 leading-snug group-hover:text-clarity-blue transition-colors">
                            ${article.title}
                        </h4>
                        <p class="text-gray-400 text-sm line-clamp-2 mb-4">
                            ${article.description}
                        </p>
                         <div class="text-xs text-gray-500 mt-auto">
                            ${article.date}
                        </div>
                    </div>
                </a>
            `;
            });

            sidebarHTML += `</div>`;
            sidebarContainer.innerHTML = sidebarHTML;

            // NOTE : On ne relance plus ScrollReveal() ici.

        } catch (error) {
            console.error("Impossible de charger l'aperçu du blog:", error);
        }
    }

    // Appel de la fonction
    initBlogPreview();



    // ==================================================================
    // NOUVEAU : LOGIQUE POUR LE FORMULAIRE DE COMMENTAIRES DU BLOG
    // ==================================================================
    const commentFormPath = document.getElementById('comment-form-page-path');
    if (commentFormPath) {
        // Remplit automatiquement le champ caché avec l'URL de la page actuelle
        commentFormPath.value = window.location.pathname;
    }





    // ==================================================================
    // NOUVEAU : LOGIQUE POUR LE BANDEAU DE CONSENTEMENT COOKIES
    // ==================================================================
    const cookieBanner = document.getElementById('cookie-consent-banner');
    const acceptBtn = document.getElementById('cookie-accept-btn');
    const declineBtn = document.getElementById('cookie-decline-btn');
    const openSettingsBtn = document.getElementById('open-cookie-settings'); // Nouveau bouton footer

    if (cookieBanner && acceptBtn && declineBtn) {
        // Vérifier si le consentement a déjà été donné
        const consent = localStorage.getItem('cookie_consent');

        if (!consent) {
            cookieBanner.classList.remove('hidden');
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'accepted');
            cookieBanner.classList.add('hidden');
            // Init GA ici si besoin
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'declined');
            cookieBanner.classList.add('hidden');
            // Désactiver le suivi ici si besoin
        });

        // NOUVEAU : Logique pour rouvrir le bandeau via le footer
        if (openSettingsBtn) {
            openSettingsBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Empêche de remonter en haut de page
                cookieBanner.classList.remove('hidden'); // Affiche le bandeau
            });
        }
    }










    // ==================================================================
    // DÉCLENCHEUR EFFET FLOU (Concept 1)
    // ==================================================================
    const heroImage = document.querySelector('.hero-ken-burns');
    if (heroImage) {
        // Ajoute la classe de base immédiatement
        heroImage.classList.add('blur-reveal');

        // Attend 500ms puis enlève le flou
        setTimeout(() => {
            heroImage.classList.add('active');
        }, 500);
    }



    // ==================================================================
    // EFFET MATRIX "HACKER SCRAMBLE" POUR LES TITRES
    // ==================================================================
    const hackerTitles = document.querySelectorAll(".hacker-title");

    // Lettres utilisées pour l'effet de brouillage
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

    hackerTitles.forEach(title => {
        // Au survol de la carte parente
        title.closest('.group').addEventListener("mouseenter", event => {
            let iteration = 0;

            // On récupère le texte original
            const originalText = title.dataset.value;

            clearInterval(title.interval);

            title.interval = setInterval(() => {
                title.innerText = originalText
                    .split("")
                    .map((letter, index) => {
                        // Si on a déjà "trouvé" la bonne lettre, on la garde
                        if (index < iteration) {
                            return originalText[index];
                        }
                        // Sinon on affiche un caractère aléatoire Matrix
                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");

                // On arrête quand tout le mot est décodé
                if (iteration >= originalText.length) {
                    clearInterval(title.interval);
                }

                // Vitesse de décodage
                iteration += 1 / 3;
            }, 30); // Vitesse de changement des lettres (30ms)
        });
    });













    // ==================================================================
    // LOGIQUE ÂME : L'ERRANCE RÉSISTANTE (CORRIGÉE MOBILE)
    // ==================================================================
    const soulEntity = document.getElementById('soul-entity');
    const soulCore = document.querySelector('.soul-core');
    const timelineContainer = document.getElementById('timeline-container');
    const timelinePoints = document.querySelectorAll('.timeline-point');
    const timelineChapters = document.querySelectorAll('.timeline-line ~ .space-y-32 > div');

    if (soulEntity && soulCore && timelineContainer && timelinePoints.length > 0) {

        // Positions
        let currentY = 0;
        let lastY = 0;
        let currentX = 0;

        // Gestion de l'inactivité (Le Doute)
        let lastScrollTime = Date.now();
        let isIdle = false;
        let driftDirection = 1;

        // --- REGLAGES ---
        const IDLE_DELAY = 1000;      // 1 seconde avant de commencer à dériver
        const DRIFT_SPEED = 0.008;    // Vitesse de dérive (un peu plus rapide pour qu'on la voie bouger)
        const RETURN_SPEED = 0.10;    // Vitesse de retour (l'effet élastique)

        // DETECTION MOBILE
        const isMobile = window.innerWidth < 768;

        // DISTANCE DE DÉRIVE MAX
        // Desktop : 500px (Large) | Mobile : 120px (Reste visible à l'écran)
        const MAX_DRIFT_X = isMobile ? 120 : 500;

        // Variables infusion
        let infusionTimer = null;
        let currentTargetChapter = null;
        const INFUSION_DELAY = 1200;

        // Physique Y
        const LERP_Y = 0.12;
        const STRETCH_FORCE = 0.1;
        const MAGNET_RANGE = 180;


        // --- TRAÎNÉE (MODIFIÉE : Effet Comète Fluide) ---
        // On augmente le nombre de points pour combler les vides
        const TRAIL_LENGTH = 120;
        const trailPieces = [];

        for (let i = 0; i < TRAIL_LENGTH; i++) {
            const piece = document.createElement('div');
            piece.classList.add('soul-trail-piece');
            timelineContainer.insertBefore(piece, soulEntity);
            // On initialise tout au centre
            trailPieces.push({ el: piece, y: 0, x: 0 });
        }


        window.addEventListener('scroll', () => {
            lastScrollTime = Date.now();

            // Si l'utilisateur scroll, on annule l'inactivité immédiatement
            if (isIdle) {
                isIdle = false;
                // Au prochain arrêt, on recalcule une direction
                // SUR MOBILE : Toujours 1 (Vers la droite)
                // SUR DESKTOP : Aléatoire (-1 gauche ou 1 droite)
                if (isMobile) {
                    driftDirection = 1;
                } else {
                    driftDirection = Math.random() > 0.5 ? 1 : -1;
                }
            }
        }, { passive: true });


        const timelineLine = document.querySelector('.timeline-line');

        function animateSoul() {
            const now = Date.now();
            const containerRect = timelineContainer.getBoundingClientRect();
            const viewportCenter = window.innerHeight / 2;

            // --- 1. LOGIQUE VERTICALE (Y) ---
            const firstPoint = timelinePoints[0];
            const firstPointRect = firstPoint.getBoundingClientRect();
            const startThresholdY = firstPointRect.top - containerRect.top + (firstPointRect.height / 2);

            let scrollTargetY = viewportCenter - containerRect.top;
            const minY = startThresholdY;
            const maxY = containerRect.height - 50;
            let constrainedTargetY = Math.max(minY, Math.min(maxY, scrollTargetY));

            if (scrollTargetY < startThresholdY - 50) {
                soulEntity.style.opacity = '0';
                trailPieces.forEach(p => p.el.style.opacity = '0');
            } else {
                soulEntity.style.opacity = '1';
            }

            let minDistance = Infinity;
            let closestPointY = null;
            let activeChapter = null;

            timelinePoints.forEach((point, index) => {
                const pointRect = point.getBoundingClientRect();
                const pointRelY = pointRect.top - containerRect.top + (pointRect.height / 2);
                const dist = Math.abs(pointRelY - constrainedTargetY);
                if (dist < minDistance) {
                    minDistance = dist;
                    closestPointY = pointRelY;
                    activeChapter = timelineChapters[index];
                }
            });

            let finalTargetY = constrainedTargetY;
            let isLocked = false;

            const LOCK_RANGE = 200;

            if (closestPointY !== null && minDistance < MAGNET_RANGE) {
                const offset = constrainedTargetY - closestPointY;
                const ratio = Math.abs(offset) / MAGNET_RANGE;
                const gravityOffset = offset * Math.pow(ratio, 1.8);
                finalTargetY = closestPointY + gravityOffset;

                if (minDistance < LOCK_RANGE) {
                    isLocked = true;
                }
            }


            // --- 2. LOGIQUE HORIZONTALE (X) ---
            let targetX = 0;
            let currentLerpX = RETURN_SPEED;

            // === CORRECTION MOBILE : L'ÂME RESTE SUR LES RAILS ===
            if (isMobile) {
                // Sur mobile, on force la position centrale absolue
                targetX = 0;

                // On annule l'état "Idle" pour éviter que ça vibre
                isIdle = false;

                // On garde une physique réactive pour suivre la ligne
                currentLerpX = 0.2;
            }
            else {
                // === VERSION DESKTOP (AVEC DÉRIVE) ===
                if (isLocked) {
                    // L'utilisateur est sur un point important : L'âme revient se coller à la ligne
                    lastScrollTime = now;
                    targetX = 0;
                    currentLerpX = 0.2; // Retour rapide (Snap)
                } else {
                    // Entre deux points : La dérive commence
                    if (now - lastScrollTime > IDLE_DELAY) {
                        // Si on ne scroll plus depuis 1 seconde
                        isIdle = true;

                        // On définit la cible : Vers la droite (ou gauche PC) à X pixels
                        targetX = driftDirection * MAX_DRIFT_X;

                        // Vitesse lente pour montrer qu'elle "part" doucement
                        currentLerpX = DRIFT_SPEED;
                    } else {
                        // Si on scroll, elle reste au centre
                        targetX = 0;
                        currentLerpX = RETURN_SPEED;
                    }
                }
            }


            // --- 3. APPLICATION PHYSIQUE ---
            if (currentY === 0) {
                currentY = finalTargetY; currentX = 0;
                trailPieces.forEach(p => { p.y = finalTargetY; p.x = 0; });
            }

            currentY += (finalTargetY - currentY) * LERP_Y;
            // C'est ici que l'âme bouge vers la gauche ou la droite
            currentX += (targetX - currentX) * currentLerpX;

            // Ajout d'une petite vibration visible (lutte) quand elle dérive
            if (isIdle) {
                // Vibration plus forte (3px) pour voir qu'elle est instable
                const struggle = (Math.random() - 0.5) * 3;
                currentX += struggle;
            }

            // Squash & Stretch
            let velocityY = currentY - lastY;
            lastY = currentY;
            const speed = Math.abs(velocityY) + Math.abs(targetX - currentX) * 0.05;

            let stretchY = 1 + (speed * STRETCH_FORCE);
            let stretchX = 1 - (speed * (STRETCH_FORCE * 0.6));

            soulEntity.style.top = `${currentY}px`;
            soulEntity.style.transform = `translate(calc(-50% + ${currentX}px), -50%)`;
            soulCore.style.transform = `scale(${stretchX}, ${stretchY})`;

            // --- Noircissement ---
            const darknessRange = isMobile ? 200 : 800; // S'adapte à l'écran
            let driftRatio = Math.min(Math.abs(currentX) / darknessRange, 1);
            const brightnessVal = 1 - (driftRatio * 0.4);
            const grayscaleVal = driftRatio * 0.7;

            soulCore.style.filter = `blur(3px) brightness(${brightnessVal}) grayscale(${grayscaleVal})`;

            // --- Interaction Ligne ---
            if (timelineLine) {
                const distFromCenter = Math.abs(currentX);

                if (distFromCenter < 20) {
                    timelineLine.classList.add('line-active');
                    timelineLine.style.transform = `translateX(-50%)`;
                    timelineLine.style.filter = `drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))`;
                } else if (distFromCenter > (isMobile ? 50 : 200)) {
                    // Si l'âme est loin, la ligne tremble
                    const jitter = (Math.random() - 0.5) * 4;
                    timelineLine.classList.remove('line-active');
                    timelineLine.style.transform = `translateX(calc(-50% + ${jitter}px))`;
                    timelineLine.style.opacity = 0.1 + Math.random() * 0.2;
                } else {
                    timelineLine.classList.remove('line-active');
                    timelineLine.style.transform = `translateX(-50%)`;
                    timelineLine.style.opacity = 0.4;
                    timelineLine.style.filter = 'none';
                }
            }




            // --- 4. TRAÎNÉE (LOGIQUE CORRIGÉE : INERTIE & TAILLE) ---

            let trailTargetX = currentX;
            let trailTargetY = currentY;

            trailPieces.forEach((piece, index) => {
                // CORRECTION 1 : On ralentit la traînée (0.18 au lieu de 0.35)
                // Elle aura plus d'inertie et restera bien derrière l'âme lors des accélérations
                const stiffness = 0.60;

                // Physique
                piece.x += (trailTargetX - piece.x) * stiffness;
                piece.y += (trailTargetY - piece.y) * stiffness;

                // CORRECTION 2 : On commence plus petit (0.75 au lieu de 1)
                // Ainsi, même si la traînée touche l'âme, elle sera plus petite que le noyau
                // et ne le cachera pas visuellement.
                const startScale = 0.75;
                const scale = startScale * (1 - (index / TRAIL_LENGTH));

                piece.el.style.top = `${piece.y}px`;
                piece.el.style.transform = `translate(calc(-50% + ${piece.x}px), -50%) scale(${scale})`;

                // Opacité
                const baseOpacity = 0.5 * (1 - (index / TRAIL_LENGTH));

                if (soulEntity.style.opacity === '0') {
                    piece.el.style.opacity = '0';
                    piece.x = currentX;
                    piece.y = currentY;
                } else {
                    const driftFade = 1 - (driftRatio * 0.5);
                    piece.el.style.opacity = Math.max(0, baseOpacity * driftFade);
                }

                trailTargetX = piece.x;
                trailTargetY = piece.y;
            });




            // --- 5. COULEURS (INFUSION) ---
            if (isLocked && speed < 1 && activeChapter) {
                if (activeChapter !== currentTargetChapter) {
                    currentTargetChapter = activeChapter;
                    if (infusionTimer) clearTimeout(infusionTimer);
                    removeInfusionClasses();
                    infusionTimer = setTimeout(() => { applyInfusionColor(activeChapter); }, INFUSION_DELAY);
                }
            } else {
                if (currentTargetChapter !== null) {
                    currentTargetChapter = null;
                    if (infusionTimer) clearTimeout(infusionTimer);
                    removeInfusionClasses();
                }
            }

            requestAnimationFrame(animateSoul);
        }

        function removeInfusionClasses() {
            soulEntity.classList.remove('soul-infused-fire', 'soul-infused-greed', 'soul-infused-blue', 'soul-infused-void', 'soul-infused-stasis', 'soul-infused-hologram');
            trailPieces.forEach(p => {
                p.el.classList.remove('soul-trail-fire', 'soul-trail-greed', 'soul-trail-blue', 'soul-trail-void', 'soul-trail-stasis', 'soul-trail-hologram');
            });
        }

        function applyInfusionColor(chapter) {
            const mood = chapter.getAttribute('data-mood');
            if (!mood) return;
            let soulClass = '', trailClass = '';
            if (mood === 'fire') { soulClass = 'soul-infused-fire'; trailClass = 'soul-trail-fire'; }
            else if (mood === 'greed') { soulClass = 'soul-infused-greed'; trailClass = 'soul-trail-greed'; }
            else if (mood === 'void') { soulClass = 'soul-infused-void'; trailClass = 'soul-trail-void'; }
            else if (mood === 'blue') { soulClass = 'soul-infused-blue'; trailClass = 'soul-trail-blue'; }
            else if (mood === 'stasis') { soulClass = 'soul-infused-stasis'; trailClass = 'soul-trail-stasis'; }
            else if (mood === 'hologram') { soulClass = 'soul-infused-hologram'; trailClass = 'soul-trail-hologram'; }

            if (soulClass) soulEntity.classList.add(soulClass);
            if (trailClass) trailPieces.forEach(p => p.el.classList.add(trailClass));
        }

        requestAnimationFrame(animateSoul);
    }








    // ==================================================================
    // LOGIQUE GLITCH MOMENTS DE RUPTURE (CORRIGÉE : PLUS LONGUE + SURSAUT)
    // ==================================================================
    const glitchTargets = document.querySelectorAll('.glitch-target');

    if (glitchTargets.length > 0) {
        const glitchObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // On déclenche plus tôt (dès que 50% est visible)
                if (entry.isIntersecting) {
                    const element = entry.target;

                    if (!element.classList.contains('has-glitched')) {
                        // Marqueur immédiat pour ne pas relancer en boucle
                        element.classList.add('has-glitched');

                        // 1. DÉMARRAGE DU GLITCH (Le Plantage)
                        element.classList.add('glitch-active');

                        // 2. PREMIER ARRÊT (Après 2.5 secondes - beaucoup plus long)
                        setTimeout(() => {
                            element.classList.remove('glitch-active');

                            // 3. LE SURSAUT (Le "Re-glitch")
                            // 300ms de pause, puis on relance un petit coup court
                            setTimeout(() => {
                                element.classList.add('glitch-active');

                                // 4. ARRÊT FINAL (Après 0.5s de sursaut)
                                setTimeout(() => {
                                    element.classList.remove('glitch-active');
                                }, 500);

                            }, 300);

                        }, 2500); // Durée initiale augmentée à 2.5 secondes
                    }
                }
            });
        }, {
            threshold: 0.5, // Déclenche quand l'élément est au milieu (aligné avec l'âme)
            rootMargin: "0px 0px -100px 0px"
        });

        glitchTargets.forEach(target => {
            glitchObserver.observe(target);
        });
    }






    // ==================================================================
    // EFFET 3D TILT (CARTE) + PARALLAXE FOND (CORRIGÉ & STYLÉ)
    // ==================================================================
    const contextSection = document.getElementById('context-section');
    const tiltCard = document.getElementById('tilt-card');
    const glare = document.querySelector('.card-glare');
    const parallaxLayers = document.querySelectorAll('.parallax-layer');

    if (contextSection && tiltCard) {

        // --- A. PARALLAXE DU FOND (Sur toute la section) ---
        // On sépare la logique : le fond bouge toujours quand on est dans la section
        contextSection.addEventListener('mousemove', (e) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            parallaxLayers.forEach(layer => {
                const speed = layer.getAttribute('data-speed');
                const x = (e.clientX - centerX) * speed / 100;
                const y = (e.clientY - centerY) * speed / 100;
                layer.style.transform = `translate(${x}px, ${y}px)`;
            });
        });

        // --- B. TILT DE LA CARTE (Uniquement sur la carte) ---

        // 1. Entrée souris : On active le mode "Mouvement Rapide"
        tiltCard.addEventListener('mouseenter', () => {
            tiltCard.classList.add('is-moving');
        });

        // 2. Mouvement souris : Calcul de la rotation
        tiltCard.addEventListener('mousemove', (e) => {
            const cardRect = tiltCard.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;

            // Rotation (Max 8 degrés)
            const rotateX = ((mouseY / cardRect.height) * -8).toFixed(2);
            const rotateY = ((mouseX / cardRect.width) * 8).toFixed(2);

            // On applique la rotation
            tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            // Gestion du reflet (Glare)
            const relativeX = e.clientX - cardRect.left;
            const relativeY = e.clientY - cardRect.top;
            tiltCard.style.setProperty('--mouse-x', `${relativeX}px`);
            tiltCard.style.setProperty('--mouse-y', `${relativeY}px`);
        });

        // 3. Sortie souris : C'est ici que la magie opère (RESET)
        const resetCard = () => {
            // On enlève la classe 'is-moving' -> Le CSS rebascule sur la transition lente/élastique
            tiltCard.classList.remove('is-moving');

            // On remet la carte à plat
            tiltCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;

            // On reset aussi le reflet
            if (glare) {
                // Optionnel : on peut cacher le glare ou le remettre au centre
            }
        };

        tiltCard.addEventListener('mouseleave', resetCard);

        // Sécurité : Si on scroll et que la souris sort sans déclencher mouseleave
        // (rare mais possible), on peut observer la sortie de la section
        contextSection.addEventListener('mouseleave', () => {
            // On reset aussi les particules du fond
            parallaxLayers.forEach(layer => {
                layer.style.transform = `translate(0px, 0px)`;
            });
            resetCard();
        });
    }











    // ==================================================================
    // ANIMATION DU SÉPARATEUR DE VAGUES (CORRIGÉE : REMPLISSAGE BAS)
    // ==================================================================
    const waveContainer = document.getElementById('wave-separator-container');

    if (waveContainer) {
        const waveBack = document.getElementById('wave-back');
        const waveFront = document.getElementById('wave-front');

        // Note : Dans un SVG, plus le chiffre Y est PETIT, plus la vague est HAUTE.



        // ÉTAT REPOS (Calme)
        // MODIFIÉ : Épais à gauche (Y=20), Fin à droite (Y=280)
        const restBack = "M0,320 L0,20 C 350,30 550,155 850,140 C 1150,130 1300,275 1440,280 L1440,320 Z";
        // Front (Noir) : Inchangé
        const restFront = "M0,320 L0,70 C 350,70 550,190 850,170 C 1150,150 1300,290 1440,290 L1440,320 Z";

        // ÉTAT HOVER (Agité / Plongeant)
        // MODIFIÉ : On garde la logique d'effilement même pendant l'animation
        // Gauche monte à Y=0 (très épais), Droite descend à Y=270 (très fin, car le front est à 280)
        const hoverBack = "M0,320 L0,0 C 350,10 550,145 850,120 C 1150,90 1300,265 1440,270 L1440,320 Z";
        // Front (Noir) : Inchangé
        const hoverFront = "M0,320 L0,50 C 350,50 550,180 850,150 C 1150,110 1300,280 1440,280 L1440,320 Z";



        // Initialisation
        waveFront.setAttribute('d', restFront);
        waveBack.setAttribute('d', restBack);

        // Événements souris
        waveContainer.addEventListener('mouseenter', () => {
            waveFront.setAttribute('d', hoverFront);
            waveBack.setAttribute('d', hoverBack);
        });

        waveContainer.addEventListener('mouseleave', () => {
            waveFront.setAttribute('d', restFront);
            waveBack.setAttribute('d', restBack);
        });
    }











    // ==================================================================
    // ANIMATION TERMINAL MATRIX (VERSION CORRIGÉE : CURSEUR INLINE)
    // ==================================================================
    const matrixContainer = document.getElementById('matrix-typewriter');

    if (matrixContainer) {
        // 1. CRÉATION DU CURSEUR DYNAMIQUE
        const cursor = document.createElement('span');
        cursor.className = 'inline-block w-3 h-5 bg-emerald-500/80 align-text-bottom shadow-[0_0_10px_rgba(16,185,129,0.8)] ml-1 animate-pulse';


        const scenario = [
            // Ligne 1 : Blanc (Classique)
            { text: "Réveille-toi...", class: "text-white font-bold tracking-widest mb-4 block", speed: 100 },

            // Lignes 2 & 3 : Gris clair (Code standard)
            { text: "Le système t'a menti.", class: "text-gray-300", speed: 50 },
            { text: "On t'a dit de devenir un technicien.", class: "text-gray-300", speed: 40 },

            // Ligne 4 : Toujours blanc/gris
            { text: "Mais tes clients ne cherchent pas un algorithme...", class: "text-gray-300", speed: 40 },

            // Ligne 5 : Impact fort (Blanc brillant ou Garder blanc pour la sobriété)
            // Je le mets en blanc très brillant pour l'impact, sans le vert.
            { text: "ILS CHERCHENT TON ÂME.", class: "text-white font-bold block mt-2", speed: 80 },

            // Pause narrative
            { text: "Toc, toc.", class: "text-gray-500 text-sm mt-6 block italic", speed: 150 },

            // --- SIMULATION UTILISATEUR ---
            // Reste blanc/gris pour simuler l'entrée utilisateur
            { text: "Qui est là ?", class: "text-white font-bold mt-2 block", speed: 100, isUser: true },

            // --- REPONSE ---
            { text: "La Clarté.", class: "text-white font-bold text-lg mt-4 block", speed: 60 },

            // --- LE SEUL ÉLÉMENT VERT (L'APPEL À L'ACTION) ---
            // On utilise la classe CSS personnalisée 'matrix-green-glow' créée à l'étape 2
            { text: "Suis le lapin blanc ↓", class: "matrix-green-glow animate-pulse mt-4 block font-bold tracking-wider", speed: 50 }
        ];


        let lineIdx = 0;
        let charIdx = 0;
        let isMatrixRunning = false;

        function typeMatrix() {
            if (lineIdx < scenario.length) {
                const currentLine = scenario[lineIdx];

                // 1. CRÉATION DE LA LIGNE (Au début de la ligne)
                if (charIdx === 0) {
                    // Pause réaliste avant que l'utilisateur "réponde"
                    if (currentLine.isUser && !document.getElementById(`mat-line-text-${lineIdx}`)) {
                        setTimeout(() => {
                            createLineElement(currentLine);
                            typeMatrix();
                        }, 1500);
                        return;
                    } else if (!document.getElementById(`mat-line-text-${lineIdx}`)) {
                        createLineElement(currentLine);
                    }
                }

                // On cible le SPAN de texte à l'intérieur de la ligne
                const activeTextSpan = document.getElementById(`mat-line-text-${lineIdx}`);

                // 2. LOGIQUE DE FRAPPE
                let charToAdd = currentLine.text.charAt(charIdx);
                activeTextSpan.textContent += charToAdd;
                charIdx++;

                // AUTO-SCROLL pendant la frappe (pour suivre le texte en temps réel)
                const terminalWrapper = document.getElementById('terminal-content-wrapper');
                if (terminalWrapper) {
                    terminalWrapper.scrollTop = terminalWrapper.scrollHeight;
                }

                // Vitesse variable
                let baseSpeed = currentLine.speed || 50;
                let variance = Math.random() * 30;

                if (charIdx < currentLine.text.length) {
                    setTimeout(typeMatrix, baseSpeed + variance);
                } else {
                    // FIN DE LA LIGNE
                    lineIdx++;
                    charIdx = 0;

                    // Pauses dramatiques
                    let pause = 400;
                    if (currentLine.text.includes("Toc, toc")) pause = 500;
                    if (currentLine.isUser) pause = 800;

                    setTimeout(typeMatrix, pause);
                }
            } else {
                // FIN DU SCENARIO : On laisse le curseur clignoter à la fin
            }
        }

        function createLineElement(lineData) {
            // Création du conteneur de ligne (Block)
            const divWrapper = document.createElement('div');
            divWrapper.className = lineData.class; // Applique les classes (margin, couleur...)

            // Si c'est l'utilisateur, on ajoute le prompt "> "
            if (lineData.isUser) {
                const promptSpan = document.createElement('span');
                promptSpan.className = "text-gray-500 mr-2";
                promptSpan.textContent = "> ";
                divWrapper.appendChild(promptSpan);
            }

            // Création du SPAN qui contiendra le texte (pour que le curseur soit à côté)
            const textSpan = document.createElement('span');
            textSpan.id = `mat-line-text-${lineIdx}`;
            divWrapper.appendChild(textSpan);

            // IMPORTANT : On déplace le curseur DANS cette nouvelle ligne
            divWrapper.appendChild(cursor);

            matrixContainer.appendChild(divWrapper);

            // AUTO-SCROLL : On fait remonter le texte automatiquement (sans scrollbar visible)
            const terminalWrapper = document.getElementById('terminal-content-wrapper');
            if (terminalWrapper) {
                terminalWrapper.scrollTop = terminalWrapper.scrollHeight;
            }
        }



        // Observer pour lancer l'anim quand visible
        const matrixObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isMatrixRunning) {
                    isMatrixRunning = true;

                    // 1. ÉTAT D'ATTENTE : Curseur seul
                    matrixContainer.innerHTML = '';
                    matrixContainer.appendChild(cursor);

                    // 2. LANCEMENT DIFFÉRÉ
                    lineIdx = 0;
                    charIdx = 0;

                    setTimeout(() => {
                        matrixContainer.innerHTML = '';
                        typeMatrix();
                    }, 2000); // Délai de lecture (2s suffisent si l'élément est bien centré)
                }
            });
        }, {
            threshold: 0.5,              // Il faut voir la moitié du terminal
            rootMargin: "0px 0px -25% 0px" // Le déclencheur est décalé : l'élément doit être bien entré dans l'écran
        });

        matrixObserver.observe(matrixContainer);


    }










    // ==================================================================
    // LOGIQUE DU LAPIN BLANC (EASTER EGG V4 - INTERACTIF)
    // ==================================================================

    const rabbitEntity = document.getElementById('white-rabbit');
    const rbt_Manifesto = document.getElementById('manifesto');
    const rbt_Plan = document.getElementById('plan');

    // MODIFICATION : Cible la section Blog au lieu des Offres
    const rbt_Blog = document.getElementById('blog-preview');

    const rbt_CTA = document.getElementById('cta');
    const rbt_Btn = document.querySelector('#cta .btn-orange');

    // On vérifie que la section Blog existe bien (rbt_Blog)
    // MODIFICATION : On ajoute une vérification de la taille d'écran
    if (rabbitEntity && rbt_Manifesto && rbt_Plan && rbt_Blog && rbt_CTA && window.innerWidth >= 1024) {

        let hasPeekedManifesto = false;
        let hasPeekedPlan = false;
        let hasPeekedBlog = false; // Variable renommée

        // --- NOUVEAU : Logique de clic ---
        let rabbitClickCount = 0;

        // Création de la bulle de dialogue
        const bubble = document.createElement('div');
        bubble.className = 'rabbit-bubble';
        rabbitEntity.appendChild(bubble);

        // Fonction pour faire parler le lapin
        const rabbitSpeak = (text, duration = 2000) => {
            bubble.textContent = text;
            bubble.classList.add('show');
            setTimeout(() => bubble.classList.remove('show'), duration);
        };

        // Gestionnaire de clic (Séquence Étendue)
        rabbitEntity.addEventListener('click', (e) => {
            // Empêcher de cliquer sur le bouton derrière
            e.stopPropagation();
            e.preventDefault();

            rabbitClickCount++;

            // --- ÉTAPE 1 : LE SAUT ---
            if (rabbitClickCount === 1) {
                rabbitEntity.classList.add('rabbit-anim-jump');
                rabbitSpeak("Hop !");
                setTimeout(() => rabbitEntity.classList.remove('rabbit-anim-jump'), 500);
            }

            // --- ÉTAPE 2 : LA TOUPIE (NOUVEAU) ---
            else if (rabbitClickCount === 2) {
                rabbitEntity.classList.add('rabbit-anim-spin');
                rabbitSpeak("Ouh là, ça tourne !");
                setTimeout(() => rabbitEntity.classList.remove('rabbit-anim-spin'), 600);
            }

            // --- ÉTAPE 3 : MODE MATRIX (NOUVEAU) ---
            else if (rabbitClickCount === 3) {
                rabbitEntity.classList.add('rabbit-anim-matrix-mode');
                rabbitSpeak("Je vois le code...", 1500); // Reste affiché un peu plus longtemps
                setTimeout(() => rabbitEntity.classList.remove('rabbit-anim-matrix-mode'), 800);
            }

            // --- ÉTAPE 4 : LE REFUS (NOUVEAU) ---
            else if (rabbitClickCount === 4) {
                rabbitEntity.classList.add('rabbit-anim-shake');
                rabbitSpeak("Arrête, ça chatouille !", 1000);
                // On laisse secouer pendant 0.8s
                setTimeout(() => rabbitEntity.classList.remove('rabbit-anim-shake'), 800);
            }

            // --- ÉTAPE 5 : GLITCH (LE PLANTAGE) ---
            else if (rabbitClickCount === 5) {
                rabbitEntity.classList.add('rabbit-anim-glitch');
                rabbitSpeak("Erreur Système CRITIQUE...", 1500);
                setTimeout(() => rabbitEntity.classList.remove('rabbit-anim-glitch'), 1500);
            }

            // --- ÉTAPE 6 : DISPARITION FINALE ---
            else if (rabbitClickCount === 6) {
                // 1. Message final
                rabbitSpeak("Suis-moi !", 3000);

                // 2. Pause lecture
                setTimeout(() => {
                    rabbitEntity.classList.add('rabbit-anim-vanish');
                }, 1500);

                // 3. Disparition réelle du DOM
                setTimeout(() => {
                    rabbitEntity.style.display = 'none';
                    // Optionnel : Reset du compteur pour la prochaine fois qu'il réapparaît (si rechargement)
                    // Mais ici on le cache définitivement pour cette session.
                }, 2100);
            }
        });

        // Gestionnaire de survol (Hover)
        rabbitEntity.addEventListener('mouseenter', () => {
            if (rabbitClickCount === 0) rabbitSpeak("?");
        });


        // --- LOGIQUE DE SCROLL EXISTANTE ---
        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const isInView = (element) => {
                const rect = element.getBoundingClientRect();
                return rect.top < windowHeight / 1.5 && rect.bottom > windowHeight / 1.5;
            };

            // 1. MANIFESTE
            if (isInView(rbt_Manifesto) && !hasPeekedManifesto) {
                rabbitEntity.className = 'fixed z-50 pointer-events-none hidden lg:block transition-all duration-700 peek-active';
                hasPeekedManifesto = true;
                setTimeout(() => rabbitEntity.classList.remove('peek-active'), 3500);
            }

            // 2. PLAN
            const planRect = rbt_Plan.getBoundingClientRect();
            if (planRect.top < 0 && planRect.bottom > windowHeight && !hasPeekedPlan) {
                rabbitEntity.className = 'fixed z-50 pointer-events-none hidden lg:block transition-all duration-700';
                void rabbitEntity.offsetWidth;
                rabbitEntity.classList.add('peek-right-active');
                hasPeekedPlan = true;
                setTimeout(() => rabbitEntity.classList.remove('peek-right-active'), 4000);
            }

            // 3. BLOG (MODIFIÉ : Apparition sur la section Blog)
            if (isInView(rbt_Blog) && !hasPeekedBlog) {
                rabbitEntity.className = 'fixed z-50 pointer-events-none hidden lg:block transition-all duration-700';
                void rabbitEntity.offsetWidth;
                // On utilise peek-left-active (Sort de la gauche)
                rabbitEntity.classList.add('peek-left-active');
                hasPeekedBlog = true;
                setTimeout(() => rabbitEntity.classList.remove('peek-left-active'), 3500);
            }

            // 4. CTA (ATTERRISSAGE SUR LE BOUTON)
            const ctaRect = rbt_CTA.getBoundingClientRect();

            if (ctaRect.top < windowHeight - 150) {
                if (rabbitEntity.parentElement !== rbt_Btn.parentElement) {
                    rbt_Btn.parentElement.appendChild(rabbitEntity);

                    // On retire toutes les classes de positionnement fixe
                    rabbitEntity.className = '';
                    // On ajoute 'cta-mode' qui active le pointer-events: auto dans le CSS
                    rabbitEntity.classList.add('cta-mode', 'z-20', 'transition-all', 'duration-700');

                    // Réinitialiser le compteur si on revient sur le bouton
                    if (rabbitEntity.style.display === 'none') {
                        rabbitEntity.style.display = 'block';
                        rabbitEntity.classList.remove('rabbit-anim-vanish');
                        rabbitClickCount = 0;
                    }
                }
            } else {
                if (rabbitEntity.parentElement === rbt_Btn.parentElement) {
                    document.body.appendChild(rabbitEntity);
                    rabbitEntity.className = 'fixed z-50 pointer-events-none hidden lg:block transition-all duration-700';
                }
            }
        });
    }








    // ==================================================================
    // LOGIQUE UNIFIÉE : TUNNEL DE TRANSITION & MATRIX MUTATION
    // ==================================================================

    const tunnelSection = document.getElementById('transition-tunnel');
    const canvas = document.getElementById('matrix-canvas');
    const darkContent = document.getElementById('dark-content');
    const lightContent = document.getElementById('light-content');
    const whiteFlash = document.getElementById('white-flash');

    // Éléments internes du contenu clair pour animations fines
    const lightIcon = document.getElementById('light-icon');
    const lightTitle = document.getElementById('light-title');
    const lightDesc = document.getElementById('light-desc');

    if (tunnelSection && canvas) {
        const ctx = canvas.getContext('2d');

        // --- CONFIGURATION MATRIX ---
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
        const fontSize = 14;
        const columns = width / fontSize;
        const drops = [];

        // Initialisation des gouttes
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        // --- ÉTAT DU SCROLL (Variables Globales) ---
        let scrollProgress = 0; // De 0 à 1

        // --- FONCTION DE DESSIN (Boucle infinie) ---
        function drawMatrix() {
            // 1. CALCUL DES COULEURS EN FONCTION DU SCROLL

            // FOND : Passe du Noir (#050911) au Blanc (#FFFFFF)
            // La transparence (0.05) crée l'effet de traînée. 
            // Plus on scrolle, plus on veut "effacer" la traînée pour que ça devienne clair.

            let bgOpacity = 0.05;
            let bgColor = `rgba(5, 9, 17, ${bgOpacity})`; // Noir par défaut

            if (scrollProgress > 0.4) {
                // Transition vers le blanc entre 40% et 70% du scroll
                const whiteRatio = Math.min(1, (scrollProgress - 0.4) * 3.33);

                // Interpolation Noir -> Blanc
                // On augmente l'opacité du fond pour nettoyer plus vite l'écran (effet de clarté)
                const cleanOpacity = 0.05 + (0.1 * whiteRatio);
                const r = 5 + (250 * whiteRatio);
                const g = 9 + (246 * whiteRatio);
                const b = 17 + (238 * whiteRatio);

                bgColor = `rgba(${r}, ${g}, ${b}, ${cleanOpacity})`;
            }

            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, width, height);

            // TEXTE : Passe du Vert (#22c55e) au Bleu Foncé/Gris (#1E3A8A)
            // Mais pendant la transition (l'explosion), il devient Blanc.

            let textColor = "#10B981"; // <--- C'est la couleur exacte des autres sections

            if (scrollProgress > 0.3 && scrollProgress < 0.6) {
                // PHASE EXPLOSION (30% - 60%) : Le code devient blanc/brillant
                textColor = "#FFFFFF";
                ctx.shadowBlur = 10; // Glow effect
                ctx.shadowColor = "white";
            } else if (scrollProgress >= 0.6) {
                // PHASE CLARTÉ (60%+) : Le code devient bleu sombre (pour être vu sur fond blanc)
                // On transitionne doucement vers le bleu
                const blueRatio = Math.min(1, (scrollProgress - 0.6) * 4);
                // On peut faire une transition de couleur si on veut, ou switch direct
                // Pour l'effet "résidu de code", un gris-bleu est élégant
                ctx.shadowBlur = 0;
                const darkness = Math.floor(255 - (200 * blueRatio)); // Devient de plus en plus sombre
                textColor = `rgba(30, 58, 138, ${0.3 + (0.5 * blueRatio)})`; // Bleu avec opacité variable
            } else {
                ctx.shadowBlur = 0;
            }

            ctx.fillStyle = textColor;
            ctx.font = fontSize + "px monospace";

            // 2. BOUCLE DES GOUTTES
            for (let i = 0; i < drops.length; i++) {

                // LOGIQUE DE RARÉFACTION (Moins de code à la fin)
                // Si on est en phase finale (>60%), on dessine aléatoirement moins de gouttes
                if (scrollProgress > 0.6 && Math.random() > (1 - scrollProgress + 0.6)) {
                    // On saute le dessin de cette goutte pour cette frame (elle s'efface)
                    // Mais on continue de faire avancer sa position Y pour ne pas figer
                    drops[i]++;
                    continue;
                }

                const text = letters.charAt(Math.floor(Math.random() * letters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                // Reset de la goutte (retour en haut)
                // Plus on scrolle, moins les gouttes reviennent (elles tombent et disparaissent)
                const resetThreshold = 0.975 + (scrollProgress * 0.025); // Devient plus dur de reset (0.975 -> 1.0)

                if (drops[i] * fontSize > height && Math.random() > resetThreshold) {
                    drops[i] = 0;
                }

                drops[i]++;
            }

            requestAnimationFrame(drawMatrix);
        }

        // Lancer l'animation canvas
        drawMatrix();

        // Resize handler
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });


        // --- GESTION DU SCROLL (TRANSITIONS DOM) ---
        function handleTunnelScroll() {
            const rect = tunnelSection.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            const totalHeight = tunnelSection.offsetHeight - viewHeight;

            // Calcul du progrès (0 en haut, 1 en bas)
            const rawProgress = -rect.top / totalHeight;
            scrollProgress = Math.max(0, Math.min(1, rawProgress));



            // Gestion du dégradé haut (On le cache quand on commence à scroller vers le blanc)
            const topGradient = document.getElementById('matrix-top-gradient');
            if (topGradient) {
                // Dès qu'on dépasse 20% du scroll, on commence à effacer le dégradé noir
                // À 40% (quand le texte commence à se casser), le dégradé a disparu.
                if (scrollProgress > 0.2) {
                    const opacity = Math.max(0, 1 - (scrollProgress - 0.2) * 5);
                    topGradient.style.opacity = opacity;
                } else {
                    topGradient.style.opacity = 1;
                }
            }



            // --- PHASE 1 : DÉSAGRÉGATION (0% -> 40%) ---
            // Le texte sombre se brise
            if (scrollProgress < 0.4) {
                // Ratio local pour cette phase (0 à 1)
                const phaseRatio = scrollProgress / 0.4;

                if (darkContent) {
                    // Effet "Agent Smith meurt" :
                    // 1. Scale Up (ça vient vers nous)
                    // 2. Blur (ça se dissout)
                    // 3. Opacité (ça disparaît)
                    // 4. Letter Spacing (ça s'écartèle)

                    const scale = 1 + (phaseRatio * 1.5); // 1 -> 2.5
                    const blur = phaseRatio * 20; // 0px -> 20px
                    const opacity = 1 - Math.pow(phaseRatio, 3); // Disparition exponentielle à la fin
                    const spacing = phaseRatio * 20; // 0px -> 20px

                    darkContent.style.transform = `scale(${scale})`;
                    darkContent.style.filter = `blur(${blur}px) brightness(${100 + (phaseRatio * 200)}%)`; // Brightness augmente
                    darkContent.style.opacity = opacity;
                    darkContent.style.letterSpacing = `${spacing}px`;
                    darkContent.style.pointerEvents = (opacity < 0.1) ? 'none' : 'auto';
                }

                // Le contenu clair reste caché
                lightContent.style.opacity = 0;
                whiteFlash.style.opacity = phaseRatio * 0.5; // Flash blanc monte doucement

            }

            // --- PHASE 2 : LE PASSAGE / FLASH (40% -> 60%) ---
            else if (scrollProgress >= 0.4 && scrollProgress < 0.6) {
                // Le "Flash" atteint son pic puis redescend
                // C'est le moment où le fond passe de noir à blanc dans le Canvas

                // On cache définitivement le sombre
                if (darkContent) darkContent.style.opacity = 0;

                // Le flash blanc assure la transition visuelle "aveuglante"
                // Il monte jusqu'à 0.8 puis redescend
                // Normalisation : 0.4->0.5 (montée), 0.5->0.6 (descente)
                let flashOpacity;
                if (scrollProgress < 0.5) {
                    flashOpacity = 0.5 + ((scrollProgress - 0.4) * 5); // 0.5 -> 1.0
                } else {
                    flashOpacity = 1.0 - ((scrollProgress - 0.5) * 5); // 1.0 -> 0.5
                }
                whiteFlash.style.opacity = Math.max(0, flashOpacity);

                // On commence à préparer l'arrivée du clair
                lightContent.style.opacity = 0;
            }

            // --- PHASE 3 : RÉVÉLATION (60% -> 100%) ---
            else {
                if (darkContent) darkContent.style.opacity = 0;
                whiteFlash.style.opacity = 0;

                // Ratio local (0 -> 1)
                const revealRatio = (scrollProgress - 0.6) / 0.4;

                lightContent.style.opacity = 1;
                lightContent.style.pointerEvents = 'auto';

                // Animation des éléments internes du Light Content (Parallaxe inversé)
                // Ils remontent à leur place d'origine (translateY 0) et fade in

                if (lightIcon) {
                    // Apparaît vite
                    const iconProgress = Math.min(1, revealRatio * 2);
                    lightIcon.style.opacity = iconProgress;
                    lightIcon.style.transform = `scale(${0.5 + (iconProgress * 0.5)}) translateY(0)`;
                }

                if (lightTitle) {
                    // Apparaît après l'icône
                    const titleProgress = Math.max(0, Math.min(1, (revealRatio - 0.2) * 2));
                    lightTitle.style.opacity = titleProgress;
                    lightTitle.style.transform = `translateY(${40 - (titleProgress * 40)}px)`;
                }

                if (lightDesc) {
                    // Apparaît en dernier
                    const descProgress = Math.max(0, Math.min(1, (revealRatio - 0.4) * 2));
                    lightDesc.style.opacity = descProgress;
                    lightDesc.style.transform = `translateY(${40 - (descProgress * 40)}px)`;
                }
            }
        }

        window.addEventListener('scroll', handleTunnelScroll, { passive: true });
        handleTunnelScroll(); // Init
    }








    // ==================================================================
    // LOGIQUE MATRIX CARDS : 3D TILT & ENTRÉE WOW
    // ==================================================================


    // 1. ANIMATION D'ENTRÉE (SCROLLREVEAL SPÉCIFIQUE)
    if (typeof ScrollReveal !== 'undefined') {
        const sr = ScrollReveal();

        // On crée une animation "Déploiement HUD"
        // La carte part tournée à 90deg (plate) et se redresse
        sr.reveal('[data-sr-matrix-card]', {
            duration: 2000,  // RALENTI : 2 secondes pour un effet lourd et majestueux
            distance: '0px', // Pas de mouvement vertical, pure rotation
            opacity: 0,
            scale: 0.8,      // Part un peu plus petit

            // C'est ici l'effet WOW : Rotation sur l'axe X
            rotate: { x: 90, y: 0, z: 0 },

            easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Effet rebond élastique à la fin
            interval: 250,   // Délai un peu plus long entre chaque carte aussi (était 200)

            viewFactor: 0.5, // 50% de la carte visible avant de lancer (bien centré)

            afterReveal: function (el) {
                // Important : On nettoie le transform pour laisser le script de Tilt prendre le relais
                el.style.transform = 'none';
                el.style.transition = 'transform 0.1s ease-out'; // On passe en mode "réactif" pour la souris
            }
        });
    }


    // 2. EFFET TILT (SUIVI DE SOURIS)
    const matrixCards = document.querySelectorAll('.matrix-card-3d');

    matrixCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Position X dans la carte
            const y = e.clientY - rect.top;  // Position Y dans la carte

            // Calcul du centre
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calcul de la rotation (Max 10 degrés pour rester élégant)
            // Note : rotateY est inversé pour l'effet miroir naturel
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            // Application de la transformation
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            // Mise à jour des variables CSS pour le reflet lumineux
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        // Reset à la sortie de la souris
        card.addEventListener('mouseleave', () => {
            // On remet une transition lente pour le retour au calme
            card.style.transition = 'transform 0.5s ease-out, box-shadow 0.5s ease, border-color 0.5s ease';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';

            // Après le retour, on remet la transition rapide pour le prochain survol
            setTimeout(() => {
                card.style.transition = 'transform 0.1s ease-out, box-shadow 0.5s ease, border-color 0.5s ease';
            }, 500);
        });
    });









    // ==================================================================
    // GESTION DU POPUP LEAD MAGNET + TEASER (VERSION INTELLIGENTE)
    // ==================================================================

    const modal = document.getElementById('lead-magnet-modal');
    const backdrop = document.getElementById('modal-backdrop');
    const content = document.getElementById('modal-content');
    const closeBtn = document.getElementById('close-modal-btn');
    const teaserBtn = document.getElementById('lead-magnet-teaser');
    const popupForm = document.getElementById('popup-sib-form'); // Le formulaire

    // Configuration
    const SCROLL_TRIGGER_PERCENT = 0.50; // 50% du scroll
    const STORAGE_KEY_SEEN = 'clartem_popup_seen_v2'; // Déjà vu mais pas inscrit
    const STORAGE_KEY_SUBSCRIBED = 'clartem_subscribed'; // A rempli le formulaire

    // --- 1. VERIFICATION IMMEDIATE : EST-IL DEJA INSCRIT ? ---
    if (localStorage.getItem(STORAGE_KEY_SUBSCRIBED) === 'true') {
        // Si oui, on supprime tout immédiatement et on arrête le script ici.
        if (teaserBtn) teaserBtn.remove();
        if (modal) modal.remove();
        // On ne continue pas l'exécution de ce bloc
    } 
    else if (modal && backdrop && content && closeBtn) { // Si pas inscrit, on lance la logique

        let isPopupOpen = false;

        // --- 2. ECOUTEUR SUR LE FORMULAIRE ---
        // C'est ici qu'on enregistre l'inscription quand la personne clique sur le bouton
        if (popupForm) {
            popupForm.addEventListener('submit', function() {
                // On enregistre qu'il est inscrit
                localStorage.setItem(STORAGE_KEY_SUBSCRIBED, 'true');
                
                // Note : Le formulaire va s'envoyer normalement vers Brevo.
                // Au prochain chargement de page (ou retour de Brevo), le bloc "1" ci-dessus s'activera.
            });
        }

        // --- FONCTIONS D'AFFICHAGE ---

        // Afficher le Teaser (Le petit cadeau)
        const showTeaser = () => {
            if (teaserBtn) {
                teaserBtn.classList.remove('hidden');
                teaserBtn.classList.add('teaser-enter');
            }
        };

        // Cacher le Teaser
        const hideTeaser = () => {
            if (teaserBtn) {
                teaserBtn.classList.add('hidden');
                teaserBtn.classList.remove('teaser-enter');
            }
        };

        // OUVRIR le popup
        const openPopup = () => {
            if (isPopupOpen) return;
            isPopupOpen = true;

            hideTeaser();

            modal.classList.remove('hidden');
            void content.offsetHeight; // Force Reflow

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    backdrop.classList.remove('opacity-0');
                    content.classList.remove('modal-3d-hidden');
                    content.classList.add('modal-3d-visible');



                    // --- AJOUT ANIMATION MAGIQUE ---
                    // On lance l'animation des puces uniquement maintenant
                    const bulletList = document.getElementById('modal-bullet-list');
                    if (bulletList) {
                        bulletList.classList.remove('modal-anim-active'); // Reset au cas où
                        void bulletList.offsetWidth; // Force le redémarrage CSS
                        bulletList.classList.add('modal-anim-active'); // Lancement !
                    }


                });
            });

            // On marque juste comme "vu" (pour afficher le teaser la prochaine fois au lieu de l'auto-open)
            localStorage.setItem(STORAGE_KEY_SEEN, 'true');
        };

        // FERMER le popup
        const closePopup = () => {
            backdrop.classList.add('opacity-0');
            content.classList.remove('modal-3d-visible');
            content.classList.add('modal-3d-hidden');



            // --- AJOUT RESET ANIMATION ---
            // On retire la classe pour que l'animation puisse être rejouée la prochaine fois
            const bulletList = document.getElementById('modal-bullet-list');
            if (bulletList) {
                setTimeout(() => {
                    bulletList.classList.remove('modal-anim-active');
                }, 800);
            }
            // -----------------------------
            


            setTimeout(() => {
                modal.classList.add('hidden');
                isPopupOpen = false;
                showTeaser(); // Le teaser revient si on ferme sans s'inscrire
            }, 800);
        };

        // --- INITIALISATION (SCROLL & INTENT) ---

        // Si l'utilisateur a déjà VU la popup (mais pas inscrit), on affiche juste le teaser
        if (localStorage.getItem(STORAGE_KEY_SEEN) === 'true') {
            showTeaser();
        } else {
            // Sinon (nouveau visiteur), on active les triggers automatiques
            
            // Trigger 1 : Scroll
            const handleScrollPopup = () => {
                const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
                const scrollCurrent = window.scrollY;

                if ((scrollCurrent / scrollTotal) > SCROLL_TRIGGER_PERCENT) {
                    openPopup();
                    window.removeEventListener('scroll', handleScrollPopup);
                    document.removeEventListener('mouseleave', handleExitIntent);
                }
            };
            window.addEventListener('scroll', handleScrollPopup, { passive: true });

            // Trigger 2 : Exit Intent (Souris qui sort vers le haut)
            const handleExitIntent = (e) => {
                if (e.clientY <= 0) {
                    openPopup();
                    document.removeEventListener('mouseleave', handleExitIntent);
                    window.removeEventListener('scroll', handleScrollPopup);
                }
            };
            document.addEventListener('mouseleave', handleExitIntent);
        }

        // --- ÉVÉNEMENTS CLICS ---
        closeBtn.addEventListener('click', closePopup);
        modal.addEventListener('click', (e) => {
            if (e.target === backdrop || e.target.closest('#modal-backdrop')) {
                closePopup();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isPopupOpen) closePopup();
        });

        if (teaserBtn) {
            teaserBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openPopup();
            });
        }
    }





});
