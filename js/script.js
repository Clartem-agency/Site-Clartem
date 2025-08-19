// script.js - VERSION FINALE COMPLÈTE

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
    // LOGIQUE DU BANDEAU PROMOTIONNEL
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
    // LOGIQUE UNIFIÉE POUR TOUS LES COMPTES À REBOURS
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
            updateTimerDisplay(distance, {
                days: mainDaysEl,
                hours: mainHoursEl,
                minutes: mainMinutesEl,
                seconds: mainSecondsEl
            }, mainTimerContainer);
        }

        if (bannerTimerContainer) {
            updateTimerDisplay(distance, {
                days: bannerDaysEl,
                hours: bannerHoursEl,
                minutes: bannerMinutesEl,
                seconds: bannerSecondsEl
            }, bannerTimerContainer);
        }
        
        if (distance < 0) {
            clearInterval(interval);
        }

    }, 1000);

    // ==================================================================
    // LOGIQUE DU FILTRE PORTFOLIO
    // ==================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterButtons.length > 0 && portfolioItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;

                filterButtons.forEach(btn => {
                    btn.classList.remove('bg-deep-blue', 'text-white');
                    btn.classList.add('bg-gray-200', 'text-neutral-dark', 'hover:bg-gray-300');
                });
                button.classList.add('bg-deep-blue', 'text-white');
                button.classList.remove('bg-gray-200', 'text-neutral-dark', 'hover:bg-gray-300');

                portfolioItems.forEach(item => {
                    const category = item.dataset.category;
                    
                    if (filter === 'all' || filter === category) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    // ==================================================================
    // NOUVELLE LOGIQUE : "VOIR PLUS" POUR LE PORTFOLIO
    // ==================================================================
    const portfolioGrid = document.getElementById('portfolio-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const loadMoreContainer = document.getElementById('load-more-container');

    if (portfolioGrid && loadMoreBtn && loadMoreContainer) {
        const allItems = Array.from(portfolioGrid.getElementsByClassName('portfolio-item'));
        
        // --- Paramètres ---
        const itemsToShowInitially = 6; // Afficher 6 projets au début
        const itemsToLoadOnClick = 6;   // Charger 6 projets de plus à chaque clic
        // ------------------

        let currentlyVisible = itemsToShowInitially;

        // Cache initialement les projets en trop
        const updateVisibleItems = () => {
            allItems.forEach((item, index) => {
                // On applique le style 'display' seulement si l'item n'est pas déjà caché par le filtre
                if (!item.classList.contains('hidden')) {
                    if (index < currentlyVisible) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });

            // Cache le bouton "Voir plus" s'il n'y a plus rien à montrer
            if (currentlyVisible >= allItems.length) {
                loadMoreContainer.style.display = 'none';
            } else {
                loadMoreContainer.style.display = 'block';
            }
        };

        // Gère le clic sur le bouton "Voir plus"
        loadMoreBtn.addEventListener('click', () => {
            currentlyVisible += itemsToLoadOnClick;
            // On cible uniquement les items visibles par le filtre
            const visibleItemsAfterFilter = Array.from(portfolioGrid.querySelectorAll('.portfolio-item:not(.hidden)'));
            visibleItemsAfterFilter.forEach((item, index) => {
                if (index < currentlyVisible) {
                    item.style.display = 'block';
                }
            });
            if (currentlyVisible >= visibleItemsAfterFilter.length) {
                loadMoreContainer.style.display = 'none';
            }
        });

        // Gère la réinitialisation lors du clic sur un filtre
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Petite pause pour laisser le temps au filtre (ajout/retrait de la classe 'hidden') de s'appliquer
                setTimeout(() => {
                    const visibleItemsAfterFilter = Array.from(portfolioGrid.querySelectorAll('.portfolio-item:not(.hidden)'));
                    
                    // Réinitialise le compteur
                    currentlyVisible = itemsToShowInitially;

                    // Cache les éléments en trop après filtrage
                    visibleItemsAfterFilter.forEach((item, index) => {
                        if (index < currentlyVisible) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    });

                    // Affiche ou cache le bouton "Voir plus" en fonction du nombre d'éléments filtrés
                    if (visibleItemsAfterFilter.length > currentlyVisible) {
                        loadMoreContainer.style.display = 'block';
                    } else {
                        loadMoreContainer.style.display = 'none';
                    }
                }, 100); // 100ms de délai est suffisant
            });
        });

        // Initialisation au chargement de la page
        // On lance la fonction de filtrage initiale pour la catégorie "tous"
        document.querySelector('.filter-btn[data-filter="all"]').click();
    }
    
});
