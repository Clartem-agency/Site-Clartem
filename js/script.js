// script.js

// --- DÉBUT DU CODE EXISTANT (NE PAS CHANGER) ---
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
});
// --- FIN DU CODE EXISTANT ---


// ==================================================================
// NOUVEAU CODE POUR LE COMPTE À REBOURS (À AJOUTER À LA FIN)
// ==================================================================
function startCountdown() {
    // 1. Définir la date de fin de l'offre
    // IMPORTANT : Le mois est indexé à partir de 0 (Janvier=0, Février=1, ..., Août=7)
    const countdownDate = new Date("Aug 31, 2025 23:59:59").getTime();

    // 2. Récupérer les éléments HTML où afficher les chiffres
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const timerContainer = document.getElementById('countdown-timer');

    // S'assurer que le conteneur du timer existe sur la page avant de continuer
    if (!timerContainer) {
        return;
    }

    // 3. Mettre à jour le compte à rebours chaque seconde
    const interval = setInterval(function() {
        // Obtenir la date et l'heure actuelles
        const now = new Date().getTime();

        // Calculer la différence entre maintenant et la date de fin
        const distance = countdownDate - now;

        // Si le compte à rebours est terminé
        if (distance < 0) {
            clearInterval(interval); // Arrêter la mise à jour
            timerContainer.innerHTML = '<div class="text-2xl font-bold text-center w-full">L\'offre est terminée !</div>'; // Afficher un message
            return;
        }

        // Calculer les jours, heures, minutes et secondes
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Formater les nombres pour qu'ils aient toujours 2 chiffres (ex: 09 au lieu de 9)
        const format = (num) => num < 10 ? '0' + num : num;

        // Afficher les résultats dans les éléments HTML
        daysEl.innerHTML = format(days);
        hoursEl.innerHTML = format(hours);
        minutesEl.innerHTML = format(minutes);
        secondsEl.innerHTML = format(seconds);

    }, 1000); // Répéter toutes les 1000ms (1 seconde)
}

// Lancer le compte à rebours une fois que la page est chargée
document.addEventListener('DOMContentLoaded', startCountdown);

// ==================================================================
// LOGIQUE POUR LE BANDEAU PROMOTIONNEL
// ==================================================================
document.addEventListener('DOMContentLoaded', function() {
    const banner = document.getElementById('promo-banner');
    const closeButton = document.getElementById('close-banner-button');
    const ctaButton = document.getElementById('banner-cta-button');

    // S'assurer que le bandeau existe sur la page
    if (!banner || !closeButton || !ctaButton) {
        return;
    }

    // Fonction pour afficher le bandeau
    const showBanner = () => {
        banner.classList.remove('translate-y-full');
    };

    // Fonction pour cacher le bandeau
    const hideBanner = () => {
        banner.classList.add('translate-y-full');
    };

    // Vérifier si le bandeau a déjà été fermé pendant cette session
    if (sessionStorage.getItem('promoBannerClosed') !== 'true') {
        // Afficher le bandeau après 3 secondes
        setTimeout(showBanner, 3000);
    }

    // Logique pour le bouton de fermeture
    closeButton.addEventListener('click', () => {
        hideBanner();
        // Mémoriser que l'utilisateur a fermé le bandeau pour cette session
        sessionStorage.setItem('promoBannerClosed', 'true');
    });
    
    // Logique pour le bouton d'action (ferme aussi le bandeau)
    ctaButton.addEventListener('click', () => {
        hideBanner();
        // Pas besoin de mémoriser ici, car le scroll vers les offres est déjà une action
    });
});
