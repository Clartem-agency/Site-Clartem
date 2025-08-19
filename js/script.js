// script.js - VERSION CORRIGÉE ET FINALE

document.addEventListener('DOMContentLoaded', function () {
    
    // ==================================================================
    // LOGIQUE DU MENU MOBILE ET DE LA NAVIGATION (INCHANGÉ)
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
    // LOGIQUE DU BANDEAU PROMOTIONNEL (INCHANGÉ)
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
    // LOGIQUE UNIFIÉE POUR TOUS LES COMPTES À REBOURS (INCHANGÉ)
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

        elements.days.innerHTML = format(days);
        elements.hours.innerHTML = format(hours);
        elements.minutes.innerHTML = format(minutes);
        elements.seconds.innerHTML = format(seconds);
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
    // LOGIQUE CORRIGÉE : FILTRE ET "VOIR PLUS" DU PORTFOLIO
    // ==================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioGrid = document.getElementById('portfolio-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const loadMoreContainer = document.getElementById('load-more-container');

    if (filterButtons.length > 0 && portfolioGrid && loadMoreBtn) {
        const itemsToShowInitially = 6;
        const itemsToLoadOnClick = 6;
        let currentlyVisibleCount;

        // ** LA FONCTION CLÉ CORRIGÉE **
        // Cette fonction applique la logique "voir plus" UNIQUEMENT aux éléments visibles après filtrage.
        const applyVisibility = () => {
            const visibleItems = Array.from(portfolioGrid.querySelectorAll('.portfolio-item:not(.hidden)'));
            
            visibleItems.forEach((item, index) => {
                // On affiche l'élément si son index DANS LA LISTE FILTRÉE est inférieur au nombre visible
                if (index < currentlyVisibleCount) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });

            // On affiche le bouton "Voir plus" seulement s'il reste des éléments cachés DANS LA LISTE FILTRÉE
            if (visibleItems.length > currentlyVisibleCount) {
                loadMoreContainer.style.display = 'block';
            } else {
                loadMoreContainer.style.display = 'none';
            }
        };

        // Gère le clic sur le bouton "Voir plus"
        loadMoreBtn.addEventListener('click', () => {
            currentlyVisibleCount += itemsToLoadOnClick;
            applyVisibility();
        });

        // Gère le clic sur les boutons de filtre
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;

                // 1. Mettre à jour le style du bouton actif
                filterButtons.forEach(btn => btn.classList.remove('bg-deep-blue', 'text-white'));
                button.classList.add('bg-deep-blue', 'text-white');

                // 2. Appliquer le filtre en cachant/montrant les items avec la classe .hidden
                const allItems = portfolioGrid.querySelectorAll('.portfolio-item');
                allItems.forEach(item => {
                    // On remet le display à '' pour que la classe .hidden (display: none) puisse fonctionner
                    item.style.display = ''; 
                    const category = item.dataset.category;
                    if (filter === 'all' || filter === category) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });

                // 3. Réinitialiser le compteur et appliquer la logique "Voir plus"
                currentlyVisibleCount = itemsToShowInitially;
                applyVisibility();
            });
        });

        // Initialisation au chargement de la page : on simule un clic sur "Tous les projets"
        document.querySelector('.filter-btn[data-filter="all"]').click();
    }
});
