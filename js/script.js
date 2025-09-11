
// script.js - VERSION FINALE INTÉGRÉE

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
    // NOUVEAU : LOGIQUE POUR L'EFFET STICKY (SECTION VALUE PROPOSITION) - VERSION MODIFIÉE
    // ==================================================================
    const valuePropScrollContainer = document.getElementById('value-prop-scroll-container');
    // MODIFIÉ : Ajout de la condition de largeur d'écran
    if (valuePropScrollContainer && window.innerWidth >= 768) {
        const valuePropCards = valuePropScrollContainer.querySelectorAll('.value-prop-card');
        
        const ANIMATION_START_PROGRESS = 0.20; 
        const ANIMATION_END_PROGRESS = 0.80;   
        const ANIMATION_DURATION = ANIMATION_END_PROGRESS - ANIMATION_START_PROGRESS;

        const handleValuePropScroll = () => {
            const rect = valuePropScrollContainer.getBoundingClientRect();
            
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;

            const scrollAmount = -rect.top;
            const scrollDistance = valuePropScrollContainer.offsetHeight - window.innerHeight;
            
            let totalProgress = scrollAmount / scrollDistance;
            totalProgress = Math.max(0, Math.min(1, totalProgress));

            let animationProgress = (totalProgress - ANIMATION_START_PROGRESS) / ANIMATION_DURATION;
            animationProgress = Math.max(0, Math.min(1, animationProgress));

            valuePropCards.forEach((card, index) => {
                const cardCount = valuePropCards.length;
                
                const startProgress = index / cardCount;
                const endProgress = (index + 0.9) / cardCount;
                
                let cardProgress = (animationProgress - startProgress) / (endProgress - startProgress);
                cardProgress = Math.max(0, Math.min(1, cardProgress));

                // MODIFICATION CLÉ : La translation initiale est maintenant la largeur de l'écran
                const initialTranslateX = window.innerWidth; // Vient de la droite
                const translateX = initialTranslateX * (1 - cardProgress);
                const opacity = cardProgress;

                card.style.opacity = opacity;
                card.style.transform = `translateX(${translateX}px)`;
            });
        };

        window.addEventListener('scroll', handleValuePropScroll, { passive: true });
        handleValuePropScroll(); // Appel initial pour positionner correctement au chargement
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
            
            panels.forEach((panel) => {
                const panelIndex = parseInt(panel.style.getPropertyValue('--index'), 10);
                const distance = panelIndex - panelProgress;

                if (distance >= 0) {
                    const scale = 1 - (distance * STACK_SCALE_FACTOR);
                    const translateY = distance * STACK_Y_OFFSET;
                    
                    panel.style.transform = `translateY(${translateY}px) scale(${Math.max(0, scale)})`;
                    panel.style.opacity = '1';
                    panel.style.pointerEvents = 'auto';
                    panel.style.zIndex = numPanels - Math.floor(distance);
                } else {
                    panel.style.transform = 'translateY(-100%) scale(0.9)';
                    panel.style.opacity = '0';
                    panel.style.pointerEvents = 'none';
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

         // ==================================================================
    // NOUVEAU : LOGIQUE POUR L'ANIMATION DE LA SECTION "SITE CLARTÉ" (VERSION 3)
    // ==================================================================
    const clarityContainer = document.getElementById('clarity-section-container');
    // MODIFIÉ : Ajout de la condition de largeur d'écran
    if (clarityContainer && window.innerWidth >= 768) {
        const animatedElements = clarityContainer.querySelectorAll('.clarity-text-reveal, .clarity-list-item');
        // NOUVEAU : On récupère le conteneur de droite
        const rightCard = document.getElementById('clarity-right-card');

        const thresholds = [
            // Gauche
            0.05, // Étape 0: Titre "Pourquoi..."
            0.10, // Étape 1: Paragraphe "Dans un monde..."
            0.18, // Étape 2: "Impact Immédiat"
            0.26, // Étape 3: "Optimisé pour la Conversion"
            0.34, // Étape 4: "Rapidité et Performance"
            // Droite
            0.45, // Étape 5: Titre "Ce que votre site inclut" (C'est le seuil pour le cadre)
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
            const scrollHeight = clarityContainer.offsetHeight - window.innerHeight;
            
            let progress = scrollAmount / scrollHeight;
            progress = Math.max(0, Math.min(1, progress));

            // NOUVEAU : Logique séparée pour le conteneur de droite
            // Il devient visible au seuil de son premier enfant (étape 5)
            if (progress >= thresholds[5]) {
                rightCard.classList.add('is-visible');
            } else {
                rightCard.classList.remove('is-visible');
            }

            // La boucle pour le texte reste la même
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
    
    // --- DÉBUT DU BLOC MODIFIÉ ---
    // ==================================================================
    // LOGIQUE POUR LA TRANSITION DE L'OVERLAY DE LA SECTION CLARTÉ (VERSION AMÉLIORÉE)
    // ==================================================================
    const clarityOverlay = document.getElementById('clarity-overlay');
    // On cible maintenant le bloc de titre, pas le conteneur de l'animation
    const clarityTitleBlock = document.getElementById('clarity-title-block'); 

    if (clarityOverlay && clarityTitleBlock) {
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                // On vérifie si l'élément n'est PLUS visible DANS la zone d'observation
                // ET si sa position est AU-DESSUS de cette zone (c'est-à-dire < 120px du haut).
                // Cela signifie qu'on a bien scrollé vers le bas, au-delà du titre.
                if (!entry.isIntersecting && entry.boundingClientRect.bottom < 120) {
                    // On estompe l'overlay pour révéler l'image de fond.
                    clarityOverlay.classList.add('is-faded');
                } else {
                    // Sinon (au chargement, ou en remontant), on s'assure que l'overlay est visible.
                    clarityOverlay.classList.remove('is-faded');
                }
            });
        };

        // On configure l'observateur pour qu'il surveille une zone qui commence
        // à 120px du haut de l'écran. C'est juste avant que le titre ne disparaisse sous la nav.
        const observerOptions = {
            rootMargin: "-120px 0px 0px 0px",
            threshold: 0
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        // On observe le bloc de titre.
        observer.observe(clarityTitleBlock);
    }
    // --- FIN DU BLOC MODIFIÉ ---


    // ==================================================================
    // NOUVEAU : LOGIQUE POUR L'ANIMATION DE LA SECTION "GUIDE" (CORRIGÉE)
    // ==================================================================
    const guideContainer = document.getElementById('guide-section-container');
    // MODIFIÉ : Ajout de la condition de largeur d'écran
    if (guideContainer && window.innerWidth >= 768) {
        const animatedElements = guideContainer.querySelectorAll('.guide-reveal-item');

        // Définition des seuils pour chaque étape de l'animation
        const thresholds = [
            // Colonne de gauche
            0.10, // Étape 0: Titre "Je comprends..."
            0.18, // Étape 1: Paragraphe
            0.26, // Étape 2: Item 1
            0.34, // Étape 3: Item 2
            0.42, // Étape 4: Item 3
            // Colonne de droite
            0.55, // Étape 5: Titre "Et j'ai un plan..."
            0.63, // Étape 6: Paragraphe
            0.71, // Étape 7: Item 1
            0.79, // Étape 8: Item 2
            0.87  // Étape 9: Item 3
        ];

        const handleGuideScroll = () => {
            const rect = guideContainer.getBoundingClientRect();
            
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;

            const scrollAmount = -rect.top;
            const scrollHeight = guideContainer.offsetHeight - window.innerHeight;
            
            let progress = scrollAmount / scrollHeight;
            progress = Math.max(0, Math.min(1, progress));

            animatedElements.forEach(el => {
                const step = parseInt(el.dataset.step, 10);
                if (progress >= thresholds[step]) {
                    el.classList.add('is-visible');
                } else {
                    // LIGNE DÉCOMMENTÉE CI-DESSOUS : C'est la correction clé.
                    // Elle retire la classe de visibilité quand on remonte.
                    el.classList.remove('is-visible');
                }
            });
        };

        window.addEventListener('scroll', handleGuideScroll, { passive: true });
        handleGuideScroll();
    }
    
});
