// script.js - VERSION FINALE AVEC ANIMATION CORRIGÉE

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

        // Appliquer l'animation aux éléments avec l'attribut [data-sr]
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
    // LOGIQUE DU BANDEAU PROMOTIONNEL (SI EXISTANT)
    // ==================================================================
    const banner = document.getElementById('promo-banner');
    const closeButton = document.getElementById('close-banner-button');
    const ctaButton = document.getElementById('banner-cta-button');

    if (banner && closeButton && ctaButton) {
        const showBanner = () => banner.classList.remove('translate-y-full');
        const hideBanner = () => banner.classList.add('translate-y-full');

        if (sessionStorage.getItem('promoBannerClosed') !== 'true') {
            setTimeout(showBanner, 3000);
        }

        closeButton.addEventListener('click', () => {
            hideBanner();
            sessionStorage.setItem('promoBannerClosed', 'true');
        });

        ctaButton.addEventListener('click', () => {
            hideBanner();
        });
    }

    // ==================================================================
    // LOGIQUE UNIFIÉE POUR LES COMPTES À REBOURS (SI EXISTANT)
    // ==================================================================
    const countdownDate = new Date("Aug 31, 2025 23:59:59").getTime();

    const mainDaysEl = document.getElementById('days');
    const mainHoursEl = document.getElementById('hours');
    const mainMinutesEl = document.getElementById('minutes');
    const mainSecondsEl = document.getElementById('seconds');
    const mainTimerContainer = document.getElementById('countdown-timer');

    const bannerDaysEl = document.getElementById('banner-days');
    const bannerHoursEl = document.getElementById('banner-hours');
    const bannerMinutesEl = document.getElementById('banner-minutes');
    const bannerSecondsEl = document.getElementById('banner-seconds');
    const bannerTimerContainer = document.getElementById('banner-countdown-timer');

    const updateTimerDisplay = (distance, elements, container) => {
        if (!container) return;

        if (distance < 0) {
            container.innerHTML = '<div class="text-lg font-bold text-center w-full">L\'offre est terminée !</div>';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const format = (num) => num < 10 ? '0' + num : num;

        if (elements.days) elements.days.innerHTML = format(days);
        if (elements.hours) elements.hours.innerHTML = format(hours);
        if (elements.minutes) elements.minutes.innerHTML = format(minutes);
        if (elements.seconds) elements.seconds.innerHTML = format(seconds);
    };

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        if (mainTimerContainer) {
            updateTimerDisplay(distance, { days: mainDaysEl, hours: mainHoursEl, minutes: mainMinutesEl, seconds: mainSecondsEl }, mainTimerContainer);
        }

        if (bannerTimerContainer) {
            updateTimerDisplay(distance, { days: bannerDaysEl, hours: bannerHoursEl, minutes: bannerMinutesEl, seconds: bannerSecondsEl }, bannerTimerContainer);
        }

        if (distance < 0) {
            clearInterval(interval);
        }

    }, 1000);

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

        // Initialisation
        document.querySelector('.filter-btn[data-filter="all"]').click();
    }

    // ==================================================================
    // NOUVEAU : LOGIQUE POUR L'EFFET DE CHUTE DES CARTES (SECTION PROBLÈME) - VERSION CORRIGÉE
    // ==================================================================
    const problemCardsGrid = document.getElementById('problem-cards-grid');

    if (problemCardsGrid) {
        const problemCards = problemCardsGrid.querySelectorAll('.problem-card');

        const handleProblemScroll = () => {
            const rect = problemCardsGrid.getBoundingClientRect();
            const gridTop = rect.top;
            const windowHeight = window.innerHeight;

            // L'animation commence quand le haut de la grille des cartes atteint 90% du bas de l'écran
            const startAnimate = windowHeight * 0.9;
            
            // L'animation se termine quand le haut de la grille atteint 10% du haut de l'écran
            const endAnimate = windowHeight * 0.1;

            // Distance totale en pixels sur laquelle l'animation se déroule
            const animationDistance = startAnimate - endAnimate;
            
            // Position actuelle par rapport au début de l'animation
            const currentPosition = gridTop - endAnimate;
            
            // Progression globale de l'animation (de 0 à 1)
            let progress = 1 - (currentPosition / animationDistance);
            progress = Math.max(0, Math.min(1, progress)); // On s'assure que la valeur reste entre 0 et 1

            // On applique l'animation à chaque carte séquentiellement
            problemCards.forEach((card, index) => {
                const cardCount = problemCards.length;
                
                // On définit quand l'animation de chaque carte doit commencer et finir
                const startProgress = index / cardCount;
                const endProgress = (index + 1) / cardCount;
                
                // On calcule la progression spécifique à cette carte
                let cardProgress = (progress - startProgress) / (endProgress - startProgress);
                cardProgress = Math.max(0, Math.min(1, cardProgress));

                if (cardProgress > 0) {
                    // On calcule la nouvelle position et opacité
                    const initialTranslateY = -150; // Doit correspondre à la valeur en CSS
                    const translateY = initialTranslateY * (1 - cardProgress);
                    const opacity = cardProgress;

                    card.style.opacity = opacity;
                    card.style.transform = `translateY(${translateY}px)`;
                } else {
                    // On réinitialise si on remonte
                    card.style.opacity = 0;
                    card.style.transform = `translateY(-150px)`;
                }
            });
        };

        window.addEventListener('scroll', handleProblemScroll, { passive: true });
        handleProblemScroll(); // Appel initial
    }

    // ==================================================================
    // LOGIQUE POUR L'EFFET STACKING CARDS (Version avec Pacing et CTA ajusté)
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
