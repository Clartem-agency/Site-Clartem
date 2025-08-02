// script.js

document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = mobileMenu.querySelectorAll('a');

    // Gérer l'ouverture/fermeture du menu mobile
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Fermer le menu mobile après avoir cliqué sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // Optionnel : Gérer le changement de style de la nav au scroll
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // --- NOUVEAU : Logique du Compte à Rebours ---
    const countdownContainer = document.getElementById('countdown-container');
    const offerExpiredMessage = document.getElementById('offer-expired');
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    // Définir la date de fin de l'offre. NOTE : Les mois sont indexés à partir de 0 (Août = 7)
    const offerEndDate = new Date('2025-08-31T23:59:59').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = offerEndDate - now;

        // Si le compte à rebours est terminé
        if (distance < 0) {
            clearInterval(countdownInterval);
            if (countdownContainer) countdownContainer.style.display = 'none';
            if (offerExpiredMessage) offerExpiredMessage.style.display = 'block';
            // Remplacer le contenu de la bannière par le message d'expiration
            const bannerText = document.querySelector('#offres .text-lg.opacity-90');
            if(bannerText) bannerText.style.display = 'none';
            return;
        }

        // Calcul du temps
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Affichage des résultats avec un zéro devant si nécessaire
        if (daysEl) daysEl.innerHTML = days < 10 ? '0' + days : days;
        if (hoursEl) hoursEl.innerHTML = hours < 10 ? '0' + hours : hours;
        if (minutesEl) minutesEl.innerHTML = minutes < 10 ? '0' + minutes : minutes;
        if (secondsEl) secondsEl.innerHTML = seconds < 10 ? '0' + seconds : seconds;
    }

    // Lancer le compte à rebours
    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Appel initial pour éviter un délai d'une seconde à l'affichage
});
