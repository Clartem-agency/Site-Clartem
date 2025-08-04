// script.js - VERSION FINALE

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
    // LOGIQUE UNIFIÉE POUR TOUS LES COMPTES À REBOURS
    // ==================================================================
    // 1. Définir la date de fin (une seule fois)
    const countdownDate = new Date("Aug 31, 2025 23:59:59").getTime();

    // 2. Récupérer les éléments des DEUX minuteurs
    // Minuteur principal (dans la section offres)
    const mainDaysEl = document.getElementById('days');
    const mainHoursEl = document.getElementById('hours');
    const mainMinutesEl = document.getElementById('minutes');
    const mainSecondsEl = document.getElementById('seconds');
    const mainTimerContainer = document.getElementById('countdown-timer');

    // Minuteur du bandeau
    const bannerDaysEl = document.getElementById('banner-days');
    const bannerHoursEl = document.getElementById('banner-hours');
    const bannerMinutesEl = document.getElementById('banner-minutes');
    const bannerSecondsEl = document.getElementById('banner-seconds');
    const bannerTimerContainer = document.getElementById('banner-countdown-timer');

    // 3. Fonction pour mettre à jour un minuteur (réutilisable)
    const updateTimerDisplay = (distance, elements, container) => {
        if (!container) return; // Si le minuteur n'existe pas, on ne fait rien

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

    // 4. Lancer l'intervalle de mise à jour global
    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        // Mettre à jour le minuteur principal
        if (mainTimerContainer) {
            updateTimerDisplay(distance, {
                days: mainDaysEl,
                hours: mainHoursEl,
                minutes: mainMinutesEl,
                seconds: mainSecondsEl
            }, mainTimerContainer);
        }

        // Mettre à jour le minuteur du bandeau
        if (bannerTimerContainer) {
            updateTimerDisplay(distance, {
                days: bannerDaysEl,
                hours: bannerHoursEl,
                minutes: bannerMinutesEl,
                seconds: bannerSecondsEl
            }, bannerTimerContainer);
        }
        
        // Arrêter l'intervalle si le temps est écoulé
        if (distance < 0) {
            clearInterval(interval);
        }

    }, 1000);
});
