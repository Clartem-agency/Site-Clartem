document.addEventListener('DOMContentLoaded', function () {

    // ==================================================================
    // LOGIQUE DU MENU MOBILE ET DE LA NAVIGATION
    // ==================================================================
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        const navLinks = mobileMenu.querySelectorAll('a');
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    const nav = document.getElementById('main-nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    // ==================================================================
    // ANIMATIONS AVEC SCROLLREVEAL
    // MODIFIÉ : N'active ScrollReveal que sur les écrans > 768px
    // ==================================================================
    if (typeof ScrollReveal !== 'undefined' && window.innerWidth >= 768) {
        const srConfig = {
            origin: 'bottom',
            distance: '20px',
            duration: 500,
            delay: 0,
            opacity: 0,
            scale: 1,
            easing: 'cubic-bezier(0.5, 0, 0, 1)',
            reset: false
        };
        const sr = ScrollReveal(srConfig);

        sr.reveal('[data-sr]', { delay: 200 });
        sr.reveal('[data-sr-delay="100"]', { delay: 300 });
        sr.reveal('[data-sr-delay="200"]', { delay: 400 });
        sr.reveal('[data-sr-delay="300"]', { delay: 500 });
        sr.reveal('[data-sr-origin="right"]', { origin: 'right', distance: '40px', delay: 200 });
        sr.reveal('[data-sr-origin="left"]', { origin: 'left', distance: '40px', delay: 200 });
    }
    
    // ==================================================================
    // NOUVEAU : LOGIQUE POUR L'ACCORDÉON FAQ (CENTRALISÉE)
    // ==================================================================
    const faqToggles = document.querySelectorAll('.faq-toggle');
    if (faqToggles.length > 0) {
        faqToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const answer = toggle.nextElementSibling;
                const icon = toggle.querySelector('svg');

                if (answer.style.maxHeight) {
                    answer.style.maxHeight = null;
                    icon.classList.remove('rotate-180');
                } else {
                    answer.style.maxHeight = answer.scrollHeight + "px";
                    icon.classList.add('rotate-180');
                }
            });
        });
    }

    // ==================================================================
    // ANIMATION DES IMAGES
    // ==================================================================
    const lazyImages = document.querySelectorAll('img.lazy-load');
    const handleImageLoad = (img) => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            }, { once: true });
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
// NOUVEAU : LOGIQUE POUR L'EFFET DE CHUTE "STICKY" (SECTION PROBLÈME)
// ==================================================================
const scrollContainer = document.getElementById('problem-scroll-container');
// MODIFIÉ : Ajout de la condition de largeur d'écran
if (scrollContainer && window.innerWidth >= 768) {
    const problemCards = scrollContainer.querySelectorAll('.problem-card');
    const knotContainer = document.getElementById('frustration-knot-container'); 
    
    const ANIMATION_START_PROGRESS = 0.20; 
    const ANIMATION_END_PROGRESS = 0.80;   
    const ANIMATION_DURATION = ANIMATION_END_PROGRESS - ANIMATION_START_PROGRESS;

    const handleProblemScroll = () => {
        const rect = scrollContainer.getBoundingClientRect();
        
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;

        const scrollAmount = -rect.top;
        const scrollDistance = scrollContainer.offsetHeight - window.innerHeight;
        
        let totalProgress = scrollAmount / scrollDistance;
        totalProgress = Math.max(0, Math.min(1, totalProgress));

        if (knotContainer) {
            const knotProgress = Math.min(1, totalProgress / ANIMATION_START_PROGRESS);
            const opacity = 1 - knotProgress;
            const scale = 1 - (knotProgress * 0.5);
            const rotate = knotProgress * -180; 

            knotContainer.style.opacity = opacity;
            knotContainer.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
            knotContainer.style.pointerEvents = opacity > 0 ? 'auto' : 'none';
        }

        let animationProgress = (totalProgress - ANIMATION_START_PROGRESS) / ANIMATION_DURATION;
        animationProgress = Math.max(0, Math.min(1, animationProgress));

        problemCards.forEach((card, index) => {
            
            // ======================================================================
            // MODIFICATION CLÉ : On définit un ordre précis : Milieu -> Gauche -> Droite
            // ======================================================================
            let animationOrder;
            // Nous avons maintenant 3 étapes distinctes, donc 3 animationSteps.
            const animationSteps = 3; 

            if (index === 1) {      // Si c'est la carte du milieu (index 1)
                animationOrder = 0; // Elle est la première à tomber (étape 0)
            } else if (index === 0) { // Si c'est la carte de gauche (index 0)
                animationOrder = 1; // Elle est la deuxième à tomber (étape 1)
            } else {                // Sinon, c'est la carte de droite (index 2)
                animationOrder = 2; // Elle est la troisième à tomber (étape 2)
            }
            // ======================================================================
            
            // Le reste du calcul s'adapte automatiquement à ce nouvel ordre.
            const startProgress = animationOrder / animationSteps;
            const endProgress = (animationOrder + 0.9) / animationSteps; 
            
            let cardProgress = (animationProgress - startProgress) / (endProgress - startProgress);
            cardProgress = Math.max(0, Math.min(1, cardProgress));

            const initialTranslateY = -window.innerHeight; 
            const translateY = initialTranslateY * (1 - cardProgress);
            const cardOpacity = cardProgress;

            card.style.opacity = cardOpacity;
            card.style.transform = `translateY(${translateY}px)`;
        });
    };

    window.addEventListener('scroll', handleProblemScroll, { passive: true });
    
    if (knotContainer) {
        knotContainer.style.opacity = 1; 
    }
    
    handleProblemScroll();
}

    

    // ==================================================================
    // LOGIQUE POUR L'EFFET STICKY (SECTION VALUE PROPOSITION) - VERSION MODIFIÉE
    // ==================================================================
    const valuePropScrollContainer = document.getElementById('value-prop-scroll-container');
    
    if (valuePropScrollContainer && window.innerWidth >= 768) {
        const valuePropCards = valuePropScrollContainer.querySelectorAll('.value-prop-card');
        // NOUVEAU : On récupère l'overlay
        const valuePropOverlay = document.getElementById('value-prop-overlay');
        
        const ANIMATION_START_PROGRESS = 0.20; 
        const ANIMATION_END_PROGRESS = 0.80;   
        const ANIMATION_DURATION = ANIMATION_END_PROGRESS - ANIMATION_START_PROGRESS;

        // NOUVEAU : Constantes pour le fondu de l'overlay
        const FADE_START_PROGRESS = 0.05; // Début du fondu (très tôt)
        const FADE_END_PROGRESS = 0.20;   // Fin du fondu (quand les cartes commencent à apparaître)

        const handleValuePropScroll = () => {
            const rect = valuePropScrollContainer.getBoundingClientRect();
            
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;

            const scrollAmount = -rect.top;
            const scrollDistance = valuePropScrollContainer.offsetHeight - window.innerHeight;
            
            let totalProgress = scrollAmount / scrollDistance;
            totalProgress = Math.max(0, Math.min(1, totalProgress));

            // --- DÉBUT DU BLOC MODIFIÉ ---
            // Logique pour le fondu progressif de l'overlay
            if (valuePropOverlay) {
                // Calcule la progression du fondu uniquement dans sa plage définie
                let fadeProgress = (totalProgress - FADE_START_PROGRESS) / (FADE_END_PROGRESS - FADE_START_PROGRESS);
                fadeProgress = Math.max(0, Math.min(1, fadeProgress)); // Bloque la valeur entre 0 et 1

                const opacity = 1 - fadeProgress; // L'opacité diminue à mesure que le fondu progresse
                const blurAmount = 4 * (1 - fadeProgress); // Le flou diminue (de 4px à 0px)

                valuePropOverlay.style.opacity = opacity;
                valuePropOverlay.style.backdropFilter = `blur(${blurAmount}px)`;
            }
            // --- FIN DU BLOC MODIFIÉ ---

            // Logique existante pour l'animation des cartes
            let animationProgress = (totalProgress - ANIMATION_START_PROGRESS) / ANIMATION_DURATION;
            animationProgress = Math.max(0, Math.min(1, animationProgress));

            valuePropCards.forEach((card, index) => {
                const cardCount = valuePropCards.length;
                
                const startProgress = index / cardCount;
                const endProgress = (index + 0.9) / cardCount;
                
                let cardProgress = (animationProgress - startProgress) / (endProgress - startProgress);
                cardProgress = Math.max(0, Math.min(1, cardProgress));

                const initialTranslateX = window.innerWidth;
                const translateX = initialTranslateX * (1 - cardProgress);
                const opacity = cardProgress;

                card.style.opacity = opacity;
                card.style.transform = `translateX(${translateX}px)`;
            });
        };

        window.addEventListener('scroll', handleValuePropScroll, { passive: true });
        handleValuePropScroll();
    }



    
    // ==================================================================
    // LOGIQUE POUR L'EFFET STACKING CARDS (SECTION PLAN)
    // ==================================================================
    const planSection = document.getElementById('plan');
    // MODIFIÉ : Ajout de la condition de largeur d'écran
    if (planSection && window.innerWidth >= 768) {
        const panels = Array.from(planSection.querySelectorAll('.panel'));
        const numPanels = panels.length;

        const STACK_SCALE_FACTOR = 0.05;
        const STACK_Y_OFFSET = 20;
        const START_DELAY = 0.10; 
        const END_DELAY = 0.20; 

        const handleScroll = () => {
            const stickyContainer = planSection.querySelector('.h-\\[800vh\\]');
            if (!stickyContainer) return;

            const rect = stickyContainer.getBoundingClientRect();
            const scrollTop = -rect.top;
            const scrollHeight = stickyContainer.offsetHeight - window.innerHeight;

            const totalProgress = Math.min(1, Math.max(0, scrollTop / scrollHeight));

            const animationDuration = 1.0 - START_DELAY - END_DELAY;
            const animationProgress = Math.min(1, Math.max(0, (totalProgress - START_DELAY) / animationDuration));
            
            const panelProgress = animationProgress * (numPanels - 1);
            
            panels.forEach((panel, panelIndex) => {
                // --- DÉBUT DE LA CORRECTION ---
                // On utilise l'index du panel dans la boucle (panelIndex) qui correspond à son ordre dans le DOM.
                const distance = panelIndex - panelProgress;

                // On définit un z-index fixe et décroissant.
                // Le premier panel (index 0) a le z-index le plus élevé (numPanels),
                // garantissant qu'il est toujours au-dessus des autres.
                panel.style.zIndex = numPanels - panelIndex;

                if (distance >= 0) {
                    // Ce panel est encore visible dans la pile.
                    const scale = 1 - (distance * STACK_SCALE_FACTOR);
                    const translateY = distance * STACK_Y_OFFSET;
                    
                    panel.style.transform = `translateY(${translateY}px) scale(${Math.max(0, scale)})`;
                    panel.style.opacity = '1';
                    panel.style.pointerEvents = 'auto';
                } else {
                    // Ce panel a été "décollé" et doit disparaître vers le haut.
                    // Son z-index élevé garantit qu'il passe au-dessus du reste.
                    panel.style.transform = 'translateY(-100%) scale(0.9)';
                    panel.style.opacity = '0';
                    panel.style.pointerEvents = 'none';
                }
                // --- FIN DE LA CORRECTION ---
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }



         // ==================================================================
    // NOUVEAU : LOGIQUE POUR L'ANIMATION DE LA SECTION SITE CLARTÉ
    // ==================================================================
    const clarityContainer = document.getElementById('clarity-section-container');
    if (clarityContainer && window.innerWidth >= 768) {
        const animatedElements = clarityContainer.querySelectorAll('.clarity-text-reveal, .clarity-list-item');
        const rightCard = document.getElementById('clarity-right-card');

        // ANCIENNE VALEUR : const CLARITY_ANIMATION_SCROLL_HEIGHT_VH = 150;
        // NOUVELLE VALEUR : Augmentée pour donner plus d'espace à l'animation
        const CLARITY_ANIMATION_SCROLL_HEIGHT_VH = 250;

        // --- DÉBUT DE LA CORRECTION CLÉ ---
        // 1. On calcule la hauteur nécessaire pour que l'animation se déroule.
        const animationScrollHeight = (CLARITY_ANIMATION_SCROLL_HEIGHT_VH / 100) * window.innerHeight;
        
        // 2. La hauteur totale du conteneur doit être la hauteur de l'animation + la hauteur de l'écran
        //    (pour permettre à l'élément "sticky" de se détacher à la fin).
        const totalContainerHeight = animationScrollHeight + window.innerHeight;

        // 3. On applique dynamiquement cette hauteur au conteneur.
        clarityContainer.style.height = `${totalContainerHeight}px`;
        // --- FIN DE LA CORRECTION CLÉ ---

        const thresholds = [
            // Gauche
            0.05, // Étape 0: Titre "Pourquoi..."
            0.10, // Étape 1: Paragraphe "Dans un monde..."
            0.18, // Étape 2: "Impact Immédiat"
            0.26, // Étape 3: "Optimisé pour la Conversion"
            0.34, // Étape 4: "Rapidité et Performance"
            // Droite
            0.45, // Étape 5: Titre "Ce que votre site inclut" (seuil pour le cadre)
            0.52, // Étape 6: Item 1
            0.59, // Étape 7: Item 2
            0.66, // Étape 8: Item 3
            0.73, // Étape 9: Item 4
            0.80, // Étape 10: Item 5
            0.87, // Étape 11: Item 6
            0.94, // Étape 12: Item 7
            0.98  // Étape 13: Bouton
        ];

        const handleClarityScroll = () => {
            const rect = clarityContainer.getBoundingClientRect();
            
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;

            const scrollAmount = -rect.top;
            
            // Le calcul de la progression utilise maintenant la variable `animationScrollHeight` que nous avons définie.
            let progress = scrollAmount / animationScrollHeight;
            progress = Math.max(0, Math.min(1, progress));

            if (progress >= thresholds[5]) {
                rightCard.classList.add('is-visible');
            } else {
                rightCard.classList.remove('is-visible');
            }

            animatedElements.forEach(el => {
                const step = parseInt(el.dataset.step, 10);
                if (progress >= thresholds[step]) {
                    el.classList.add('is-visible');
                } else {
                    el.classList.remove('is-visible');
                }
            });
        };

        window.addEventListener('scroll', handleClarityScroll, { passive: true });
        handleClarityScroll();
    }
    

    
    
    // ==================================================================
    // LOGIQUE POUR LA TRANSITION DE L'OVERLAY DE LA SECTION CLARTÉ
    // ==================================================================
    const clarityOverlay = document.getElementById('clarity-overlay');
    const clarityTitleBlock = document.getElementById('clarity-title-block'); 

    if (clarityOverlay && clarityTitleBlock) {
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && entry.boundingClientRect.bottom < 120) {
                    clarityOverlay.classList.add('is-faded');
                } else {
                    clarityOverlay.classList.remove('is-faded');
                }
            });
        };

        const observerOptions = {
            rootMargin: "-120px 0px 0px 0px",
            threshold: 0
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        observer.observe(clarityTitleBlock);
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
    // NOUVEAU : LOGIQUE COMPLÈTE POUR LA PAGE BLOG
    // ==================================================================
    const blogPage = document.getElementById('articles-grid');

    // On exécute ce code uniquement si on est sur la page de blog
    if (blogPage) {

        // --- 1. VOTRE BASE DE DONNÉES D'ARTICLES ---
        // C'est ici que vous ajouterez tous vos articles.
        // Respectez bien la structure : title, description, link, image, category, date.
        // Les catégories doivent correspondre aux "data-filter" des boutons en HTML.
        const allArticles = [
            
                        // -- Catégorie: Stratégie & Positionnement --
            {
                title: "Atelier Gratuit : Définissez le Message Central de votre Site Web",
                description: "Découvrez 4 questions stratégiques pour définir une accroche claire qui captive vos clients idéaux en moins de 3 secondes.",
                link: "articles/01-atelier-message-central.html",
                image: "assets/blog/image-placeholder-strategie.webp",
                category: "strategie",
                date: "25 Juillet 2024"
            },
            {
                title: "La Règle des 3 Secondes : L'Accroche qui Transforme un Visiteur en Prospect",
                description: "Votre site a 3 secondes pour convaincre. Apprenez la méthode pour créer une accroche percutante qui transforme un simple visiteur en un prospect qualifié.",
                link: "articles/03-regle-3-secondes-accroche-site-web.html",
                image: "assets/blog/image-placeholder-strategie.webp",
                category: "strategie",
                date: "24 Juillet 2024"
            },
            {
                title: "Votre Page 'À Propos' n'est pas un CV : Racontez l'Histoire qui Crée la Confiance",
                description: "Arrêtez de lister vos diplômes. Découvrez comment raconter votre histoire personnelle pour créer un lien de confiance immédiat avec vos visiteurs.",
                link: "articles/04-page-a-propos-histoire-confiance.html",
                image: "assets/blog/image-placeholder-strategie.webp",
                category: "strategie",
                date: "23 Juillet 2024"
            },
            {
                title: "Ne Vendez pas des Séances, Vendez une Transformation",
                description: "Apprenez à transformer vos 'séances' en 'parcours de transformation' désirables. La clé pour créer des offres irrésistibles.",
                link: "articles/05-vendre-transformation-offres-irresistibles.html",
                image: "assets/blog/image-placeholder-strategie.webp",
                category: "strategie",
                date: "22 Juillet 2024"
            },
            {
                title: "Comment Écrire une Page 'À Propos' qui Raconte votre 'Voyage de l'Âme'",
                description: "Pour les praticiens spirituels : découvrez la structure du 'Voyage du Héros' pour raconter votre histoire d'âme de manière authentique et inspirante.",
                link: "articles/87-page-a-propos-praticien-spirituel.html",
                image: "assets/blog/image-placeholder-strategie.webp",
                category: "strategie",
                date: "21 Juillet 2024"
            },
            {
                title: "Coach/Thérapeute Débutant : Comment Fixer vos Premiers Tarifs",
                description: "Le guide en 3 étapes pour fixer un prix juste qui valorise votre travail, rassure vos clients et vous permet de vivre de votre passion.",
                link: "articles/98-coach-therapeute-debutant-fixer-premiers-tarifs.html",
                image: "assets/blog/image-placeholder-strategie.webp",
                category: "strategie",
                date: "20 Juillet 2024"
            },
            {
                title: "Le Guide pour Créer votre Première Offre 'Signature'",
                description: "Arrêtez de vendre des 'séances'. Découvrez notre guide en 5 étapes pour créer votre première offre signature, une solution packagée qui clarifie votre message.",
                link: "articles/99-creer-premiere-offre-signature.html",
                image: "assets/blog/image-placeholder-strategie.webp",
                category: "strategie",
                date: "19 Juillet 2024"
            },
            {
                title: "Votre Bio Instagram/LinkedIn : Le Modèle en 4 Lignes pour un Coach qui se Lance",
                description: "Vous avez 150 caractères pour convaincre. Découvrez notre modèle simple en 4 lignes pour rédiger une biographie percutante qui attire vos clients idéaux.",
                link: "articles/100-bio-instagram-linkedin-modele-coach.html",
                image: "assets/blog/image-placeholder-strategie.webp",
                category: "strategie",
                date: "18 Juillet 2024"
            },
            {
                title: "Le Test du 'Et Alors ?' : La Méthode pour Rédiger une Proposition de Valeur qui Convertit",
                description: "Découvrez une méthode simple pour transformer une description de service fade en une proposition de valeur qui parle aux vrais besoins de vos clients B2B.",
                link: "articles/129-test-et-alors-proposition-valeur.html",
                image: "assets/blog/image-placeholder-strategie.webp",
                category: "strategie",
                date: "17 Juillet 2024"
            },
            {
                title: "Le Syndrome du 'Bon Élève' : Pourquoi Lister vos Services est Moins Efficace que de Décrire les Problèmes",
                description: "Sortez du 'syndrome du bon élève' et apprenez à décrire les problèmes que vous résolvez pour créer un message qui convertit vraiment vos clients B2B.",
                link: "articles/139-syndrome-bon-eleve-vendre-solutions.html",
                image: "assets/blog/image-placeholder-strategie.webp",
                category: "strategie",
                date: "16 Juillet 2024"
            },
            {
                title: "La 'Banalité du Bien' : Pourquoi les Mots comme 'Excellence' et 'Innovation' ne Veulent Plus Rien Dire",
                description: "Votre site est rempli de jargon corporate ? Découvrez pourquoi ces mots sont devenus invisibles et comment les remplacer par un langage de preuve.",
                link: "articles/141-banalite-du-bien-mots-vides-marketing.html",
                image: "assets/blog/image-placeholder-strategie.webp",
                category: "strategie",
                date: "15 Juillet 2024"
            },
            {
                title: "L'Escalier de Valeur : Comment Structurer vos Offres de Conseil",
                description: "Ne proposez pas qu'une seule offre ! Découvrez le concept de 'l'Escalier de Valeur' pour créer un parcours client qui maximise la fidélisation.",
                link: "articles/142-escalier-de-valeur-structure-offres.html",
                image: "assets/blog/image-placeholder-strategie.webp",
                category: "strategie",
                date: "14 Juillet 2024"
            },
            {
                title: "Le 'Retainer' Mensuel : Le Saint Graal du Consultant",
                description: "Fatigués de chasser les contrats ? Découvrez comment structurer et vendre une offre de 'retainer' mensuel pour créer des revenus récurrents.",
                link: "articles/143-vendre-offre-retainer-mensuel-consultant.html",
                image: "assets/blog/image-placeholder-strategie.webp",
                category: "strategie",
                date: "13 Juillet 2024"
            },
            {
                title: "Agence Web : Faut-il Choisir un Artiste du Design ou un Architecte du Message ?",
                description: "Découvrez la différence cruciale entre une approche 'design-first' et 'message-first', et comment choisir le partenaire qui correspond à vos besoins.",
                link: "articles/149-artiste-design-vs-architecte-message.html",
                image: "assets/blog/image-placeholder-strategie.webp",
                category: "strategie",
                date: "12 Juillet 2024"
            },
            {
                title: "Le Piège du Devis 'au Nombre de Pages'",
                description: "Méfiez-vous du prix 'à la page'. Découvrez pourquoi ce modèle de tarification est un piège et où se situe la vraie valeur d'un site web efficace.",
                link: "articles/150-piege-devis-nombre-de-pages.html",
                image: "assets/blog/image-placeholder-strategie.webp",
                category: "strategie",
                date: "11 Juillet 2024"
            },
            {
                title: "Le 'Briefing Client' d'une Agence Web vs. l'Atelier de Clarté",
                description: "Ne vous contentez pas d'un simple 'briefing'. Découvrez la différence entre un questionnaire passif et un 'Atelier de Clarté' collaboratif.",
                link: "articles/156-briefing-client-vs-atelier-clarte.html",
                image: "assets/blog/image-placeholder-strategie.webp",
                category: "strategie",
                date: "10 Juillet 2024"
            },
            {
                title: "Les Coulisses de l'Atelier de Clarté : Comment Nous Transformons Votre 'Brouillard'",
                description: "Découvrez notre processus de co-création en 4 étapes pour transformer le 'brouillard' des coachs en un message marketing clair et authentique.",
                link: "articles/159-coulisses-atelier-clarte.html",
                image: "assets/blog/image-placeholder-strategie.webp",
                category: "strategie",
                date: "09 Juillet 2024"
            },


            
            // -- Catégorie: Débuter son Activité --
            {
                title: "Le Syndrome de l'Imposteur du Débutant : Comment votre Site Web Devient votre Premier Acte de Légitimité",
                description: "Découvrez comment la création de votre site est un acte psychologique puissant pour incarner votre nouvelle identité professionnelle.",
                link: "articles/94-syndrome-imposteur-site-web-legitimite.html",
                image: "assets/blog/image-placeholder-debuter.webp",
                category: "debuter",
                date: "22 Juillet 2024"
            },
            {
                title: "Coach/Thérapeute Débutant : Les 3 Fondations à Poser AVANT de Créer votre Logo",
                description: "Avant de penser au design, clarifiez ces 3 points essentiels (Client, Promesse, Histoire) pour bâtir une activité solide.",
                link: "articles/95-fondations-activite-coach-therapeute.html",
                image: "assets/blog/image-placeholder-debuter.webp",
                category: "debuter",
                date: "21 Juillet 2024"
            },
            // -- Catégorie: Marketing Local & Google --
            {
                title: "Le 'Pages Jaunes' est Mort : Pourquoi votre Fiche Google Business est Indispensable",
                description: "Découvrez pourquoi votre fiche Google Business a remplacé les Pages Jaunes et comment elle est devenue votre outil n°1 pour attirer les clients de votre quartier.",
                link: "articles/54-fiche-google-nouvel-annuaire.html",
                image: "assets/blog/image-placeholder-local.webp",
                category: "local",
                date: "20 Juillet 2024"
            },
            {
                title: "Google Maps : Les 5 Optimisations pour Faire Remonter votre Cabinet en Tête des Résultats",
                description: "Améliorez votre référencement local grâce à 5 optimisations essentielles (catégorie, photos, avis...) pour attirer plus de clients.",
                link: "articles/55-google-maps-optimisations-locales.html",
                image: "assets/blog/image-placeholder-local.webp",
                category: "local",
                date: "19 Juillet 2024"
            },
            // -- Catégorie: Outils & Productivité --
            {
                title: "Arrêtez de Jouer à 'Tetris' avec votre Agenda : Le Guide Complet de Calendly",
                description: "Fatigués des allers-retours d'emails ? Découvrez comment configurer Calendly pour professionnaliser votre prise de RDV et gagner des heures.",
                link: "articles/26-guide-calendly-pour-coachs.html",
                image: "assets/blog/image-placeholder-outils.webp",
                category: "outils",
                date: "18 Juillet 2024"
            },
            {
                title: "L'IA comme Assistant Créatif : 3 Façons Éthiques de l'Utiliser pour votre Contenu",
                description: "Apprenez à utiliser l'IA comme un assistant pour brainstormer, synthétiser et clarifier vos idées, sans perdre votre âme.",
                link: "articles/182-ia-assistant-creatif-ethique.html",
                image: "assets/blog/image-placeholder-outils.webp",
                category: "outils",
                date: "17 Juillet 2024"
            },
            // -- Catégorie: Niche : Bien-être & Holistique --
            {
                title: "Votre Site de Yoga doit être un Shala Virtuel, pas un Catalogue de Cours",
                description: "Découvrez 3 clés (intention, incarnation, ambiance) pour transformer votre site en un Shala virtuel qui inspire et accueille vos futurs élèves.",
                link: "articles/62-site-yoga-shala-virtuel.html",
                image: "assets/blog/image-placeholder-bien-etre.webp",
                category: "niche-bien-etre",
                date: "16 Juillet 2024"
            },
            {
                title: "Le Syndrome de la 'Bonne Copine' : Comment Poser un Cadre Professionnel sur votre Site",
                description: "Votre empathie vous épuise ? Apprenez à utiliser votre site web pour poser un cadre professionnel clair et sain, et sortir du rôle de la 'bonne copine'.",
                link: "articles/75-syndrome-bonne-copine-cadre-professionnel.html",
                image: "assets/blog/image-placeholder-bien-etre.webp",
                category: "niche-bien-etre",
                date: "15 Juillet 2024"
            },
            // -- Catégorie: Niche : Coachs Business & Consultants --
             {
                title: "Votre Page d'Accueil est un 'Executive Summary' : Les 5 Éléments qu'un Décideur Doit Voir en 5 Secondes",
                description: "Votre page d'accueil B2B est-elle efficace ? Découvrez les 5 éléments essentiels qu'un décideur pressé doit voir pour être convaincu.",
                link: "articles/131-page-accueil-executive-summary.html",
                image: "assets/blog/image-placeholder-b2b.webp",
                category: "niche-b2b",
                date: "14 Juillet 2024"
            },
            {
                title: "La Proposition Commerciale est Morte : Comment votre Site 'Pré-Vend' vos Services",
                description: "Fatigués des propositions sans réponse ? Transformez votre site en une 'proposition vivante' qui qualifie, convainc et pré-vend vos services.",
                link: "articles/132-site-web-remplace-proposition-commerciale.html",
                image: "assets/blog/image-placeholder-b2b.webp",
                category: "niche-b2b",
                date: "13 Juillet 2024"
            },
            // -- Catégorie: Approche "Site Clarté" --
            {
                title: "Le Labyrinthe vs. la Conversation Guidée : Pourquoi un Site Multi-Pages Dilue votre Message",
                description: "Votre site est-il un labyrinthe confus ? Découvrez pourquoi une structure one-page crée un parcours de confiance qui convertit.",
                link: "articles/111-labyrinthe-vs-conversation-site-web.html",
                image: "assets/blog/image-placeholder-clarte.webp",
                category: "approche-clarte",
                date: "12 Juillet 2024"
            },
            {
                title: "Toutes les Pages Uniques ne se Valent Pas : La Différence entre une 'Brochure qui Défile' et un 'Récit qui Convertit'",
                description: "Un site one-page peut aussi être inefficace. Découvrez la différence entre un site 'brochure' et un 'Site Clarté' stratégique.",
                link: "articles/112-site-one-page-brochure-vs-recit-qui-convertit.html",
                image: "assets/blog/image-placeholder-clarte.webp",
                category: "approche-clarte",
                date: "11 Juillet 2024"
            },
            // ... AJOUTEZ VOS AUTRES ARTICLES ICI ...
        ];

        // --- 2. GESTION DE L'ÉTAT ---
        const ITEMS_PER_PAGE = 9;
        let currentPage = 1;
        let activeCategory = 'all';
        let searchQuery = '';

        // --- 3. SÉLECTION DES ÉLÉMENTS DU DOM ---
        const articlesGrid = document.getElementById('articles-grid');
        const paginationContainer = document.getElementById('pagination-container');
        const categoryFilters = document.getElementById('category-filters');
        const searchInput = document.getElementById('search-input');
        const noResults = document.getElementById('no-results');

        // --- 4. FONCTIONS PRINCIPALES ---

        // Fonction pour afficher les articles
        function renderArticles() {
            // 4.1 Filtrage
            let filteredArticles = allArticles;

            if (activeCategory !== 'all') {
                filteredArticles = filteredArticles.filter(article => article.category === activeCategory);
            }

            if (searchQuery) {
                const lowerCaseQuery = searchQuery.toLowerCase();
                filteredArticles = filteredArticles.filter(article =>
                    article.title.toLowerCase().includes(lowerCaseQuery) ||
                    article.description.toLowerCase().includes(lowerCaseQuery)
                );
            }
            
            noResults.classList.toggle('hidden', filteredArticles.length > 0);

            // 4.2 Pagination
            const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

            // 4.3 Affichage
            articlesGrid.innerHTML = paginatedArticles.map(article => `
                <div class="portfolio-item" data-sr>
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
            
            // Relancer ScrollReveal sur les nouveaux éléments
            if (typeof ScrollReveal !== 'undefined') {
                ScrollReveal().reveal('.portfolio-item[data-sr]', {
                    origin: 'bottom',
                    distance: '20px',
                    duration: 500,
                    delay: 0,
                    opacity: 0,
                    scale: 1,
                    easing: 'cubic-bezier(0.5, 0, 0, 1)',
                    reset: false,
                    viewFactor: 0.2
                }, 50); // L'intervalle de 50ms crée un léger effet de cascade
            }
        }

        // Fonction pour afficher la pagination
        function renderPagination(totalPages) {
            if (totalPages <= 1) {
                paginationContainer.innerHTML = '';
                return;
            }

            let paginationHTML = `
                <button id="prev-page" class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''}>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
            `;

            for (let i = 1; i <= totalPages; i++) {
                paginationHTML += `
                    <button class="pagination-btn page-number ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>
                `;
            }

            paginationHTML += `
                <button id="next-page" class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''}>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
            `;

            paginationContainer.innerHTML = paginationHTML;
        }

        // --- 5. GESTION DES ÉVÉNEMENTS ---

        // Clic sur les filtres de catégorie
        categoryFilters.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                categoryFilters.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');
                activeCategory = e.target.dataset.filter;
                currentPage = 1;
                renderArticles();
            }
        });

        // Recherche
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchQuery = searchInput.value;
                currentPage = 1;
                renderArticles();
            }, 300); // Debounce pour ne pas surcharger
        });

        // Clic sur la pagination
        paginationContainer.addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;

            if (target.id === 'prev-page') {
                if (currentPage > 1) {
                    currentPage--;
                    renderArticles();
                }
            } else if (target.id === 'next-page') {
                const totalPages = paginationContainer.querySelectorAll('.page-number').length;
                if (currentPage < totalPages) {
                    currentPage++;
                    renderArticles();
                }
            } else if (target.classList.contains('page-number')) {
                currentPage = parseInt(target.dataset.page);
                renderArticles();
            }
        });

        // --- 6. INITIALISATION ---
        renderArticles();
    }
    
    
});
