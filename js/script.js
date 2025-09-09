// script.js - VERSION FINALE AVEC ANIMATION STICKY

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

    const nav = document.querySelector('nav');
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
    // ==================================================================
    if (typeof ScrollReveal !== 'undefined') {
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
    // ANIMATION DES IMAGES (LAZY LOAD)
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
    // LOGIQUE POUR L'EFFET DE CHUTE "STICKY" (SECTION PROBLÈME)
    // ==================================================================
    const scrollContainer = document.getElementById('problem-scroll-container');

    if (scrollContainer) {
        const problemCards = scrollContainer.querySelectorAll('.problem-card');

        const handleProblemScroll = () => {
            const rect = scrollContainer.getBoundingClientRect();
            
            // Si le conteneur n'est pas dans la vue, on ne fait rien
            if (rect.bottom < 0 || rect.top > window.innerHeight) {
                return;
            }

            // Calcul de la progression du scroll A L'INTERIEUR du conteneur sticky
            // -rect.top = combien de pixels on a scrollé dans le conteneur
            // scrollContainer.offsetHeight - window.innerHeight = la distance totale de scroll possible
            const scrollAmount = -rect.top;
            const scrollDistance = scrollContainer.offsetHeight - window.innerHeight;
            
            let progress = scrollAmount / scrollDistance;
            progress = Math.max(0, Math.min(1, progress)); // On s'assure que la valeur reste entre 0 et 1

            // On applique l'animation à chaque carte séquentiellement
            problemCards.forEach((card, index) => {
                const cardCount = problemCards.length;
                
                // On divise la progression totale en segments pour chaque carte
                const startProgress = index / cardCount;
                const endProgress = (index + 0.8) / cardCount; // Le 0.8 laisse un petit temps mort entre les cartes
                
                let cardProgress = (progress - startProgress) / (endProgress - startProgress);
                cardProgress = Math.max(0, Math.min(1, cardProgress));

                if (cardProgress > 0) {
                    const initialTranslateY = -150;
                    const translateY = initialTranslateY * (1 - cardProgress);
                    const opacity = cardProgress;

                    card.style.opacity = opacity;
                    card.style.transform = `translateY(${translateY}px)`;
                } else {
                    card.style.opacity = 0;
                    card.style.transform = `translateY(-150px)`;
                }
            });
        };

        window.addEventListener('scroll', handleProblemScroll, { passive: true });
        handleProblemScroll(); // Appel initial
    }


    // ==================================================================
    // LOGIQUE POUR L'EFFET STACKING CARDS (PLAN SECTION)
    // ==================================================================
    const planSection = document.getElementById('plan');

    if (planSection) {
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
    
    // NOTE : Le code pour le bandeau promo, le compte à rebours et le filtre portfolio est omis pour la clarté,
    // mais il était correct et peut être réintégré si nécessaire. S'ils sont utilisés, ils doivent être
    // placés ici, à l'intérieur de l'écouteur DOMContentLoaded.

});
