// script.js - VERSION FINALE AVEC PAUSES AU DÉBUT ET À LA FIN

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
    // LOGIQUE POUR L'EFFET DE CHUTE "STICKY" (SECTION PROBLÈME) - AVEC PAUSES
    // ==================================================================
    const scrollContainer = document.getElementById('problem-scroll-container');

    if (scrollContainer) {
        const problemCards = scrollContainer.querySelectorAll('.problem-card');
        
        // --- NOUVEAU : Constantes pour contrôler les pauses ---
        // L'animation commencera après 20% du scroll total
        const ANIMATION_START_PROGRESS = 0.20; 
        // L'animation se terminera à 80% du scroll total, laissant 20% pour la pause finale
        const ANIMATION_END_PROGRESS = 0.80;   
        const ANIMATION_DURATION = ANIMATION_END_PROGRESS - ANIMATION_START_PROGRESS;

        const handleProblemScroll = () => {
            const rect = scrollContainer.getBoundingClientRect();
            
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;

            const scrollAmount = -rect.top;
            const scrollDistance = scrollContainer.offsetHeight - window.innerHeight;
            
            // `totalProgress` va de 0 à 1 sur TOUTE la hauteur de 300vh
            let totalProgress = scrollAmount / scrollDistance;
            totalProgress = Math.max(0, Math.min(1, totalProgress));

            // --- NOUVEAU : On calcule une progression dédiée à l'animation ---
            // `animationProgress` n'ira de 0 à 1 que lorsque `totalProgress` est entre 0.2 et 0.8
            let animationProgress = (totalProgress - ANIMATION_START_PROGRESS) / ANIMATION_DURATION;
            animationProgress = Math.max(0, Math.min(1, animationProgress));

            problemCards.forEach((card, index) => {
                const cardCount = problemCards.length;
                
                // La logique suivante utilise maintenant `animationProgress`
                const startProgress = index / cardCount;
                const endProgress = (index + 0.9) / cardCount; // 0.9 pour un léger chevauchement
                
                let cardProgress = (animationProgress - startProgress) / (endProgress - startProgress);
                cardProgress = Math.max(0, Math.min(1, cardProgress));

                const initialTranslateY = -150;
                const translateY = initialTranslateY * (1 - cardProgress);
                const opacity = cardProgress;

                card.style.opacity = opacity;
                card.style.transform = `translateY(${translateY}px)`;
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
});
