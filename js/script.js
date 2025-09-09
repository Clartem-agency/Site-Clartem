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
    if (scrollContainer) {
        const problemCards = scrollContainer.querySelectorAll('.problem-card');
        
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

            let animationProgress = (totalProgress - ANIMATION_START_PROGRESS) / ANIMATION_DURATION;
            animationProgress = Math.max(0, Math.min(1, animationProgress));

            problemCards.forEach((card, index) => {
                const cardCount = problemCards.length;
                
                const startProgress = index / cardCount;
                const endProgress = (index + 0.9) / cardCount;
                
                let cardProgress = (animationProgress - startProgress) / (endProgress - startProgress);
                cardProgress = Math.max(0, Math.min(1, cardProgress));

                const initialTranslateY = -window.innerHeight; 
                const translateY = initialTranslateY * (1 - cardProgress);
                const opacity = cardProgress;

                card.style.opacity = opacity;
                card.style.transform = `translateY(${translateY}px)`;
            });
        };

        window.addEventListener('scroll', handleProblemScroll, { passive: true });
        handleProblemScroll();
    }

// ==================================================================
    // NOUVEAU : LOGIQUE POUR L'EFFET STICKY (SECTION VALUE PROPOSITION) - VERSION MODIFIÉE
    // ==================================================================
    const valuePropScrollContainer = document.getElementById('value-prop-scroll-container');
    if (valuePropScrollContainer) {
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
