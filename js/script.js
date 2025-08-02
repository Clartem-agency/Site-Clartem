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

    // Initialisation du compte à rebours
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        const currentYear = new Date().getFullYear();
        
        simplyCountdown(countdownElement, {
            year: currentYear,
            month: 8, // Août (les mois sont indexés à partir de 0)
            day: 31,
            hours: 23,
            minutes: 59,
            seconds: 59,
            words: {
                days: 'Jours',
                hours: 'Heures',
                minutes: 'Min',
                seconds: 'Sec',
                pluralLetter: ''
            },
            plural: false,
            inline: true,
            inlineClass: 'simply-countdown-inline',
            enableUtc: false,
            onEnd: function() {
                // Action à réaliser quand le compte à rebours est terminé
                countdownElement.innerHTML = '<p>L\'offre est terminée !</p>';
                return;
            },
            refresh: 1000,
            sectionClass: 'simply-section',
            amountClass: 'simply-amount',
            wordClass: 'simply-word',
        });
    }
});
