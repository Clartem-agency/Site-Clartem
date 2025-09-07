// script.js - VERSION MISE À JOUR

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
    // NOUVEAU : ANIMATIONS AVEC SCROLLREVEAL
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
            reset: false // Mettre à true si vous voulez que l'animation se rejoue à chaque fois
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
    // NOUVEAU : ANIMATION DES IMAGES
    // ==================================================================
    const lazyImages = document.querySelectorAll('img.lazy-load');
    const handleImageLoad = (img) => {
        // L'attribut loading="lazy" natif gère le chargement, 
        // on s'assure juste que l'animation se déclenche quand l'image est chargée.
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
});


// ==================================================================
// LOGIQUE POUR L'EFFET STACKING CARDS (Version corrigée et fluide)
// ==================================================================
const planSection = document.getElementById('plan');

if (planSection) {
    const panels = Array.from(planSection.querySelectorAll('.panel'));
    const panel4Content = document.getElementById('panel-4-content');
    const panel4Cta = document.getElementById('panel-4-cta');
    const numPanels = panels.length;

    const handleScroll = () => {
        const rect = planSection.getBoundingClientRect();
        const scrollTop = -rect.top;
        const scrollHeight = planSection.offsetHeight - window.innerHeight;

        const animationDurationRatio = numPanels / (numPanels + 1.0); 
        const progress = Math.min(1, Math.max(0, scrollTop / (scrollHeight * animationDurationRatio)));

        // Gérer la visibilité des panneaux
        panels.forEach((panel, i) => {
            const panelIndex = numPanels - 1 - i;
            const startProgress = panelIndex / numPanels;
            const endProgress = (panelIndex + 1) / numPanels;
            const isLastPanel = i === 0;

            if (progress >= startProgress && progress < endProgress) {
                // Le panneau est actuellement "actif"
                panel.style.transform = 'translateY(0) scale(1)';
                panel.style.opacity = '1';
            } 
            else if (progress >= endProgress) {
                // Le panneau a été dépassé par le scroll
                if (isLastPanel) {
                    // On garde le dernier panneau visible
                    panel.style.transform = 'translateY(0) scale(1)';
                    panel.style.opacity = '1';
                } else {
                    // On anime sa sortie
                    panel.style.transform = 'translateY(-5rem) scale(0.9)';
                    panel.style.opacity = '0';
                    // MODIFICATION : La ligne 'panel.style.visibility = 'hidden';' a été supprimée ici.
                    // C'est cette suppression qui rend l'animation fluide vers le bas.
                }
            } 
            else {
                // Le panneau est en dessous, en attente
                panel.style.transform = 'translateY(0) scale(1)';
                panel.style.opacity = '1';
            }
        });

        // Gérer la transition de contenu sur le dernier panneau
        if (panel4Content && panel4Cta) {
            const lastPanelStartProgress = 1 - (1 / numPanels); 
            const transitionTriggerProgress = lastPanelStartProgress + (1 / numPanels / 2);

            if (progress >= transitionTriggerProgress) {
                const transitionDuration = 1 - transitionTriggerProgress;
                const ctaProgress = Math.min(1, (progress - transitionTriggerProgress) / transitionDuration);
                
                panel4Content.style.opacity = 1 - ctaProgress;
                panel4Cta.style.opacity = ctaProgress;
            } else {
                panel4Content.style.opacity = '1';
                panel4Cta.style.opacity = '0';
            }
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Appel initial pour positionner correctement au chargement
}
