document.addEventListener('DOMContentLoaded', function () {


    // ==================================================================
    // LOGIQUE DU MENU NAVIGATION (Transparent au Scroll)
    // ==================================================================
    const nav = document.getElementById('main-nav');

    function handleScroll() {
        if (window.scrollY > 50) { // Seuil augmenté à 50px pour ne pas changer trop vite
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    if (nav) {
        // Écouteur d'événement au scroll
        window.addEventListener('scroll', handleScroll);

        // Appel immédiat au chargement (au cas où on rafraîchit la page au milieu)
        handleScroll();
    }

    // Logique du menu mobile (inchangée)
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        const navLinks = mobileMenu.querySelectorAll('a');
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            // Astuce : Si on ouvre le menu mobile tout en haut, on met le fond blanc pour la lisibilité
            if (!nav.classList.contains('scrolled')) {
                nav.classList.add('scrolled');
            } else if (window.scrollY <= 50) {
                nav.classList.remove('scrolled');
            }
        });
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }




    // ==================================================================
    // ANIMATIONS AVEC SCROLLREVEAL (VERSION SÉCURISÉE POUR TOUT LE SITE)
    // ==================================================================
    if (typeof ScrollReveal !== 'undefined') {

        // Fonction d'initialisation
        const initScrollReveal = () => {
            const srConfig = {
                origin: 'bottom',
                distance: '30px',
                duration: 800,
                delay: 0,
                opacity: 0,
                scale: 1,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                reset: false,
                viewFactor: 0.2,
                mobile: true // Active sur mobile
            };

            const sr = ScrollReveal(srConfig);

            // Vos sélecteurs globaux (marchent sur toutes les pages)
            // NOTE : On ne cible plus les éléments chargés dynamiquement ici
            sr.reveal('[data-sr]', { interval: 100 });
            sr.reveal('[data-sr-delay="100"]', { delay: 300 });
            sr.reveal('[data-sr-delay="200"]', { delay: 400 });
            sr.reveal('[data-sr-delay="300"]', { delay: 500 });
            sr.reveal('[data-sr-origin="right"]', { origin: 'right', distance: '60px', duration: 1000, delay: 200 });
            sr.reveal('[data-sr-origin="left"]', { origin: 'left', distance: '60px', duration: 1000, delay: 200 });

            // Force un recalcul après un court instant (sécurité anti-bug)
            setTimeout(() => {
                try { sr.delegate(); } catch (e) { }
            }, 500);
        };

        // Logique de chargement intelligente :
        // Si la page est déjà chargée (cache), on lance tout de suite.
        // Sinon, on attend l'événement 'load'.
        if (document.readyState === 'complete') {
            initScrollReveal();
        } else {
            window.addEventListener('load', initScrollReveal);
        }
    }






    // ==================================================================
    // LOGIQUE POUR L'ACCORDÉON FAQ (MODIFIÉE)
    // --- DÉBUT DE LA LOGIQUE MODIFIÉE : Un seul tiroir ouvert à la fois ---
    // ==================================================================
    const faqToggles = document.querySelectorAll('.faq-toggle');
    if (faqToggles.length > 0) {
        faqToggles.forEach(clickedToggle => {
            clickedToggle.addEventListener('click', () => {
                const answerToOpen = clickedToggle.nextElementSibling;
                const iconToRotate = clickedToggle.querySelector('svg');
                const isAlreadyOpen = answerToOpen.style.maxHeight;

                // Étape 1 : Fermer tous les tiroirs ouverts
                faqToggles.forEach(toggle => {
                    const answer = toggle.nextElementSibling;
                    const icon = toggle.querySelector('svg');
                    answer.style.maxHeight = null;
                    icon.classList.remove('rotate-180');
                });

                // Étape 2 : Si le tiroir cliqué n'était pas déjà ouvert, on l'ouvre.
                // S'il était déjà ouvert, l'étape 1 l'a déjà fermé.
                if (!isAlreadyOpen) {
                    answerToOpen.style.maxHeight = answerToOpen.scrollHeight + "px";
                    iconToRotate.classList.add('rotate-180');
                }
            });
        });
    }







    // ==================================================================
    // LOGIQUE POUR L'ACCORDÉON DANS LA CARTE PRIX (IMPACT, ANCRAGE & EXPANSION)
    // Mise à jour : Un seul menu ouvert à la fois par carte
    // ==================================================================
    const pricingToggles = document.querySelectorAll('.pricing-toggle');

    if (pricingToggles.length > 0) {
        pricingToggles.forEach(toggle => {
            toggle.addEventListener('click', function () {
                // 1. Identifier la carte parente (pour ne pas fermer les menus des autres offres)
                // Dans votre HTML, chaque carte a la classe "group"
                const parentCard = this.closest('.group');

                // 2. Si on a trouvé la carte parente, on ferme les autres menus de CETTE carte
                if (parentCard) {
                    // On cherche tous les boutons déjà actifs DANS cette carte
                    const activeTogglesInCard = parentCard.querySelectorAll('.pricing-toggle.active');

                    activeTogglesInCard.forEach(otherToggle => {
                        // Si ce n'est pas le bouton sur lequel on vient de cliquer, on le ferme
                        if (otherToggle !== this) {
                            otherToggle.classList.remove('active');
                            const otherContent = otherToggle.nextElementSibling;
                            otherContent.style.maxHeight = null;
                            otherContent.classList.remove('anim-active');
                        }
                    });
                }

                // 3. Basculer l'état du menu cliqué (Ouvrir/Fermer)
                this.classList.toggle('active');
                const content = this.nextElementSibling;

                if (content.style.maxHeight) {
                    // Si ouvert -> on ferme
                    content.style.maxHeight = null;
                    content.classList.remove('anim-active');
                } else {
                    // Si fermé -> on ouvre
                    content.style.maxHeight = content.scrollHeight + "px";
                    content.classList.add('anim-active');
                }
            });
        });
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
    // LOGIQUE POUR L'EFFET STACKING CARDS (SECTION PLAN) - CORRIGÉE
    // ==================================================================
    const planSection = document.getElementById('plan');
    const stackingContainer = document.getElementById('stacking-container');

    if (planSection && stackingContainer && window.innerWidth >= 768) {
        const panels = Array.from(planSection.querySelectorAll('.panel'));
        const numPanels = panels.length;

        // On réduit le délai de démarrage pour que l'animation réagisse tout de suite
        const START_DELAY = 0.05;
        const END_DELAY = 0.05;

        const handleScroll = () => {
            const rect = stackingContainer.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Calcul de la progression du scroll dans la section (de 0 à 1)
            const start = rect.top * -1;
            const end = stackingContainer.offsetHeight - viewportHeight;
            let progress = start / end;
            progress = Math.max(0, Math.min(1, progress));

            // Calcul de la progression de l'animation
            const animationDuration = 1.0 - START_DELAY - END_DELAY;
            let animProgress = (progress - START_DELAY) / animationDuration;
            animProgress = Math.max(0, Math.min(1, animProgress));

            // On étale la progression sur le nombre de cartes
            // Si on a 6 cartes, on veut 5 transitions (0->1, 1->2, etc.)
            const panelProgress = animProgress * (numPanels - 1);

            panels.forEach((panel, i) => {
                // 1. Z-INDEX : On inverse la logique précédente.
                // La carte 0 est tout au fond (z=0), la suivante par-dessus (z=1), etc.
                panel.style.zIndex = i;

                // 2. OPACITÉ & CLIC : Toujours visibles et cliquables
                panel.style.opacity = '1';
                panel.style.pointerEvents = 'auto';

                // 3. CALCUL DE LA POSITION
                // 'offset' détermine où en est CETTE carte par rapport au scroll global.
                // offset < -1  : La carte est en attente en bas (invisible)
                // -1 < offset < 0 : La carte est en train de monter (animation d'entrée)
                // offset > 0   : La carte est en place et se fait recouvrir (animation de recul)
                const offset = panelProgress - i;

                if (offset < -1) {
                    // CAS 1 : Carte future (cachée en bas de l'écran)
                    panel.style.transform = `translateY(120vh) scale(1)`;
                }
                else if (offset < 0) {
                    // CAS 2 : Carte qui arrive (slide du bas vers le centre)
                    // On convertit l'offset (-1 à 0) en pourcentage de hauteur (100vh à 0vh)
                    const yPos = Math.abs(offset) * 100;
                    panel.style.transform = `translateY(${yPos}vh) scale(1)`;
                }
                else {
                    // CAS 3 : Carte installée (Active ou Passée)
                    // Elle reste fixe au centre (0px) mais réduit légèrement sa taille
                    // pour créer un effet de profondeur "pile de cartes"

                    // On limite l'effet de profondeur aux 3 dernières cartes pour économiser les ressources
                    const depth = Math.min(offset, 3);
                    const scale = Math.max(0.9, 1 - (depth * 0.05)); // Réduit de 5% par carte par-dessus

                    panel.style.transform = `translateY(0px) scale(${scale})`;
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Appel initial
    }










    // ==================================================================
    // NOUVEAU : LOGIQUE POUR L'ANIMATION DE LA SECTION "EMPATHIE" (VERSION 2)
    // ==================================================================
    const empathyContainer = document.getElementById('empathy-scroll-container');
    if (empathyContainer && window.innerWidth >= 768) {
        const empathyImage = document.getElementById('empathy-image-container');
        const empathyTextItems = empathyContainer.querySelectorAll('.empathy-reveal-item');

        // Paramètres de l'animation de l'image
        const IMAGE_ANIM_START = 0.0; // L'animation commence dès le début du scroll
        const IMAGE_ANIM_END = 0.35;  // L'animation se termine à 35% du scroll
        const IMAGE_ANIM_DURATION = IMAGE_ANIM_END - IMAGE_ANIM_START;

        // Seuils d'apparition pour les textes (commencent APRES la fin de l'animation de l'image)
        const textThresholds = [
            0.40, // Étape 0: Titre "Une approche..."
            0.55, // Étape 1: Item 1 "Je respecte..."
            0.70, // Étape 2: Item 2 "Je comprends..."
            0.85  // Étape 3: Item 3 "Je parle..."
        ];

        const handleEmpathyScroll = () => {
            const rect = empathyContainer.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;

            const scrollAmount = -rect.top;
            const scrollHeight = empathyContainer.offsetHeight - window.innerHeight;

            let progress = scrollAmount / scrollHeight;
            progress = Math.max(0, Math.min(1, progress));

            // --- Animation continue de l'image ---
            if (empathyImage) {
                // Calcule la progression spécifique à l'animation de l'image
                let imageProgress = (progress - IMAGE_ANIM_START) / IMAGE_ANIM_DURATION;
                imageProgress = Math.max(0, Math.min(1, imageProgress)); // Bloque entre 0 et 1

                // Calcule la position X. Commence à 100% de la largeur de la vue et va vers 0.
                const translateX = window.innerWidth * (1 - imageProgress);

                // MODIFIÉ : La ligne qui contrôlait l'opacité a été supprimée.
                empathyImage.style.transform = `translateX(${translateX}px)`;
            }

            // --- Animation en escalier des textes ---
            empathyTextItems.forEach(el => {
                const step = parseInt(el.dataset.step, 10);
                if (progress >= textThresholds[step]) {
                    el.classList.add('is-visible');
                } else {
                    el.classList.remove('is-visible');
                }
            });
        };

        window.addEventListener('scroll', handleEmpathyScroll, { passive: true });
        handleEmpathyScroll(); // Appel initial pour positionner correctement au chargement
    }

    // ==================================================================
    // NOUVEAU : LOGIQUE POUR L'ANIMATION DE LA SECTION "AUTORITÉ" (VERSION 2)
    // ==================================================================
    const authorityContainer = document.getElementById('authority-scroll-container');
    if (authorityContainer && window.innerWidth >= 768) {
        const authorityImage = document.getElementById('authority-image-container');
        const authorityTextItems = authorityContainer.querySelectorAll('.authority-reveal-item');

        // Paramètres de l'animation de l'image
        const IMAGE_ANIM_START = 0.0;
        const IMAGE_ANIM_END = 0.35;
        const IMAGE_ANIM_DURATION = IMAGE_ANIM_END - IMAGE_ANIM_START;

        // ==================================================================
        //                      *** CORRECTION ICI ***
        // Les anciens seuils commençaient trop tôt. Les nouveaux seuils
        // commencent après la fin de l'animation de l'image (0.35).
        // ==================================================================
        const textThresholds = [
            0.40, // Étape 0: Titre "Un guide..."
            0.55, // Étape 1: Item 1 "Un processus..."
            0.70, // Étape 2: Item 2 "Une expertise..."
            0.85  // Étape 3: Item 3 "Un objectif..."
        ];

        const handleAuthorityScroll = () => {
            const rect = authorityContainer.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;

            const scrollAmount = -rect.top;
            const scrollHeight = authorityContainer.offsetHeight - window.innerHeight;

            let progress = scrollAmount / scrollHeight;
            progress = Math.max(0, Math.min(1, progress));

            // --- Animation continue de l'image ---
            if (authorityImage) {
                let imageProgress = (progress - IMAGE_ANIM_START) / IMAGE_ANIM_DURATION;
                imageProgress = Math.max(0, Math.min(1, imageProgress));

                // Calcule la position X. Commence à -100% (gauche) et va vers 0.
                const translateX = -window.innerWidth * (1 - imageProgress);

                // MODIFIÉ : La ligne qui contrôlait l'opacité a été supprimée.
                authorityImage.style.transform = `translateX(${translateX}px)`;
            }

            // --- Animation en escalier des textes ---
            authorityTextItems.forEach(el => {
                const step = parseInt(el.dataset.step, 10);
                if (progress >= textThresholds[step]) {
                    el.classList.add('is-visible');
                } else {
                    el.classList.remove('is-visible');
                }
            });
        };

        window.addEventListener('scroll', handleAuthorityScroll, { passive: true });
        handleAuthorityScroll(); // Appel initial
    }


    // ==================================================================
    // LOGIQUE COMPLÈTE POUR LA PAGE BLOG (VERSION CORRIGÉE - CSS ANIMATION)
    // ==================================================================
    const blogPage = document.getElementById('articles-grid');

    if (blogPage) {
        async function initBlog() {
            try {
                // --- 1. CHARGEMENT DES DONNÉES ---
                const response = await fetch('page-cartes-blog.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                let allArticles = await response.json();

                // ==================================================================
                //            *** NOUVELLE LOGIQUE POUR L'ARTICLE "À LA UNE" ***
                // ==================================================================

                // 1. On cherche l'article marqué comme "featured"
                const featuredArticle = allArticles.find(article => article.featured === true);

                // 2. On crée une nouvelle liste qui exclut l'article "featured"
                let regularArticles = allArticles.filter(article => !article.featured);

                // 3. On trie UNIQUEMENT les articles réguliers par date
                const parseFrenchDate = (dateString) => {
                    const months = {
                        'Janvier': 0, 'Février': 1, 'Mars': 2, 'Avril': 3, 'Mai': 4, 'Juin': 5,
                        'Juillet': 6, 'Août': 7, 'Septembre': 8, 'Octobre': 9, 'Novembre': 10, 'Décembre': 11
                    };
                    const parts = dateString.split(' ');
                    const day = parseInt(parts[0], 10);
                    const month = months[parts[1]];
                    const year = parseInt(parts[2], 10);
                    return new Date(year, month, day);
                };

                regularArticles.sort((a, b) => {
                    const dateA = parseFrenchDate(a.date);
                    const dateB = parseFrenchDate(b.date);
                    return dateB - dateA; // Tri descendant
                });

                // ==================================================================
                //                  *** FIN DE LA NOUVELLE LOGIQUE ***
                // ==================================================================


                // --- 2. GESTION DE L'ÉTAT ---
                const ITEMS_PER_PAGE = 9;
                let currentPage = 1;
                let activeCategory = 'all';
                let searchQuery = '';

                // --- 3. SÉLECTION DES ÉLÉMENTS DU DOM ---
                const articlesGrid = document.getElementById('articles-grid');
                const articlesGridTitle = document.getElementById('articles-grid-title');
                const featuredPostContainer = document.getElementById('featured-post');
                const paginationContainer = document.getElementById('pagination-container');
                const categoryFilters = document.getElementById('category-filters');
                const searchInput = document.getElementById('search-input');
                const noResults = document.getElementById('no-results');

                // --- 4. FONCTIONS PRINCIPALES ---

                function renderArticles() {
                    // 4.1 Filtrage (maintenant basé sur les articles réguliers)
                    let filteredArticles = regularArticles; // On part de la liste sans l'article "à la une"
                    if (activeCategory !== 'all') {
                        filteredArticles = filteredArticles.filter(article => article.category === activeCategory);
                    }
                    if (searchQuery) {
                        const lowerCaseQuery = searchQuery.toLowerCase();
                        // La recherche s'applique aussi à la liste triée des articles réguliers
                        let allRegularArticlesForSearch = regularArticles;
                        if (activeCategory !== 'all') {
                            allRegularArticlesForSearch = allRegularArticlesForSearch.filter(article => article.category === activeCategory);
                        }
                        filteredArticles = allRegularArticlesForSearch.filter(article =>
                            article.title.toLowerCase().includes(lowerCaseQuery) ||
                            article.description.toLowerCase().includes(lowerCaseQuery)
                        );
                    }

                    noResults.classList.toggle('hidden', filteredArticles.length > 0);

                    // 4.2 Article "À la Une"
                    const showFeaturedPost = featuredArticle && currentPage === 1 && !searchQuery && activeCategory === 'all';

                    if (showFeaturedPost) {
                        // CORRECTION : Utilisation de fade-in-entry au lieu de data-sr
                        featuredPostContainer.innerHTML = `
                        <h2 class="text-3xl font-bold text-neutral-dark mb-10 text-center fade-in-entry">À la Une</h2>
                        <a href="${featuredArticle.link}" class="block group fade-in-entry" style="animation-delay: 0.1s;">
                            <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-center bg-soft-blue p-8 rounded-2xl border-2 border-gray-200">
                                <img src="${featuredArticle.image}" alt="${featuredArticle.title}" class="w-full h-64 md:h-full object-cover rounded-xl shadow-lg">
                                <div class="flex flex-col">
                                    <h3 class="text-2xl md:text-3xl font-bold text-neutral-dark mb-3 group-hover:text-clarity-blue transition-colors">${featuredArticle.title}</h3>
                                    <p class="text-neutral-light text-base mb-6 flex-grow">${featuredArticle.description}</p>
                                    <span class="text-sm text-neutral-light mt-auto">${featuredArticle.date}</span>
                                </div>
                            </div>
                        </a>
                    `;
                        featuredPostContainer.classList.remove('hidden');
                        articlesGridTitle.textContent = "Tous les articles";
                    } else {
                        featuredPostContainer.classList.add('hidden');
                        articlesGridTitle.textContent = "Résultats de la recherche";
                        if (!searchQuery && activeCategory === 'all') {
                            articlesGridTitle.textContent = "Tous les articles";
                        }
                    }

                    // 4.3 Pagination (basée sur les articles filtrés)
                    const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
                    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                    const endIndex = startIndex + ITEMS_PER_PAGE;
                    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

                    // 4.4 Affichage (CORRIGÉ : Utilisation de fade-in-entry)
                    articlesGrid.innerHTML = paginatedArticles.map(article => `
                    <div class="portfolio-item fade-in-entry">
                        <a href="${article.link}" class="block h-full group">
                            <div class="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col overflow-hidden border border-gray-200 h-full">
                                <img src="${article.image}" alt="${article.title}" class="w-full h-48 object-cover">
                                <div class="p-6 flex flex-col flex-grow">
                                    <h3 class="text-xl font-bold text-neutral-dark mb-2 group-hover:text-clarity-blue transition-colors">${article.title}</h3>
                                    <p class="text-neutral-light text-sm mb-4 flex-grow">${article.description}</p>
                                    <span class="text-xs text-neutral-light mt-auto">${article.date}</span>
                                </div>
                            </div>
                        </a>
                    </div>
                `).join('');

                    renderPagination(totalPages);

                    // NOTE : On ne relance plus ScrollReveal() ici pour éviter les conflits.
                    // L'animation est gérée par le CSS .fade-in-entry
                }

                // Le reste de la fonction (pagination, événements) ne change pas...
                function renderPagination(totalPages) {
                    if (totalPages <= 1) {
                        paginationContainer.innerHTML = '';
                        return;
                    }

                    const getPageNumbers = () => {
                        const pageNumbers = [];
                        const maxPagesToShow = 5;
                        const half = Math.floor(maxPagesToShow / 2);

                        if (totalPages <= maxPagesToShow + 2) {
                            for (let i = 1; i <= totalPages; i++) {
                                pageNumbers.push(i);
                            }
                        } else if (currentPage <= half + 1) {
                            for (let i = 1; i <= maxPagesToShow; i++) {
                                pageNumbers.push(i);
                            }
                            pageNumbers.push('...');
                            pageNumbers.push(totalPages);
                        } else if (currentPage >= totalPages - half) {
                            pageNumbers.push(1);
                            pageNumbers.push('...');
                            for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
                                pageNumbers.push(i);
                            }
                        } else {
                            pageNumbers.push(1);
                            pageNumbers.push('...');
                            for (let i = currentPage - half; i <= currentPage + half; i++) {
                                pageNumbers.push(i);
                            }
                            pageNumbers.push('...');
                            pageNumbers.push(totalPages);
                        }
                        return pageNumbers;
                    };

                    const pageNumbers = getPageNumbers();
                    let paginationHTML = `
                    <button id="prev-page" class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''}>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                `;
                    pageNumbers.forEach(num => {
                        if (num === '...') {
                            paginationHTML += `<span class="pagination-ellipsis">...</span>`;
                        } else {
                            paginationHTML += `<button class="pagination-btn page-number ${num === currentPage ? 'active' : ''}" data-page="${num}">${num}</button>`;
                        }
                    });
                    paginationHTML += `
                    <button id="next-page" class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''}>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                `;
                    paginationContainer.innerHTML = paginationHTML;
                }

                categoryFilters.addEventListener('click', (e) => {
                    if (e.target.classList.contains('filter-btn')) {
                        categoryFilters.querySelector('.active').classList.remove('active');
                        e.target.classList.add('active');
                        activeCategory = e.target.dataset.filter;
                        currentPage = 1;
                        renderArticles();
                        articlesGridTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });

                const searchForm = document.getElementById('search-form');
                searchForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    searchQuery = searchInput.value;
                    currentPage = 1;
                    renderArticles();
                    articlesGridTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });

                searchInput.addEventListener('input', () => {
                    if (searchInput.value === '') {
                        searchQuery = '';
                        currentPage = 1;
                        renderArticles();
                    }
                });

                paginationContainer.addEventListener('click', (e) => {
                    const target = e.target.closest('button');
                    if (!target) return;

                    let needsScroll = false;

                    // Calcul du nombre total de pages pour la catégorie/recherche actuelle
                    let relevantArticles = regularArticles;
                    if (activeCategory !== 'all') {
                        relevantArticles = relevantArticles.filter(article => article.category === activeCategory);
                    }
                    if (searchQuery) {
                        relevantArticles = relevantArticles.filter(article =>
                            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            article.description.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                    }
                    const totalPages = Math.ceil(relevantArticles.length / ITEMS_PER_PAGE);

                    if (target.id === 'prev-page') {
                        if (currentPage > 1) {
                            currentPage--;
                            needsScroll = true;
                        }
                    } else if (target.id === 'next-page') {
                        if (currentPage < totalPages) {
                            currentPage++;
                            needsScroll = true;
                        }
                    } else if (target.classList.contains('page-number')) {
                        const newPage = parseInt(target.dataset.page);
                        if (newPage !== currentPage) {
                            currentPage = newPage;
                            needsScroll = true;
                        }
                    }

                    if (needsScroll) {
                        renderArticles();
                        articlesGridTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });

                // --- 6. INITIALISATION ---
                renderArticles();

            } catch (error) {
                console.error("Impossible de charger les articles du blog:", error);
                articlesGrid.innerHTML = `<p class="text-center text-destructive col-span-full">Erreur lors du chargement des articles. Veuillez réessayer plus tard.</p>`;
            }
        }
        // Lancement de la logique de la page blog
        initBlog();
    }





    // ==================================================================
    // LOGIQUE POUR L'APERÇU DU BLOG (STYLE ÉDITORIAL PREMIUM) - CORRIGÉE
    // ==================================================================
    async function initBlogPreview() {
        // On cible les deux nouveaux conteneurs
        const featuredContainer = document.getElementById('featured-article-container');
        const sidebarContainer = document.getElementById('sidebar-articles-container');

        // Sécurité si la section n'existe pas
        if (!featuredContainer || !sidebarContainer) return;

        try {
            const response = await fetch('page-cartes-blog.json');
            if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

            const allArticles = await response.json();

            // On prend les 3 articles les plus récents
            const latestArticles = allArticles.slice(0, 3);

            if (latestArticles.length === 0) return;

            // 1. GÉNÉRATION DE L'ARTICLE À LA UNE (Le premier)
            const mainArticle = latestArticles[0];

            // CORRECTION : Utilisation de fade-in-entry et style inline pour le délai
            featuredContainer.innerHTML = `
            <a href="${mainArticle.link}" class="group block h-full relative overflow-hidden rounded-3xl fade-in-entry" style="animation-delay: 0.1s;">
                <!-- Image de fond -->
                <div class="absolute inset-0">
                    <img src="${mainArticle.image}" alt="${mainArticle.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                    <!-- Overlay dégradé sombre pour lisibilité texte -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-70 transition-opacity"></div>
                </div>
                
                <!-- Contenu -->
                <div class="relative h-full flex flex-col justify-end p-8 md:p-12 z-10">
                    <div class="mb-4">
                        <span class="bg-warm-orange text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">À la Une</span>
                    </div>
                    <h3 class="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-warm-orange transition-colors">
                        ${mainArticle.title}
                    </h3>
                    <p class="text-gray-300 line-clamp-2 md:line-clamp-3 mb-6 text-lg max-w-2xl">
                        ${mainArticle.description}
                    </p>
                    <div class="flex items-center text-sm text-gray-400 font-medium">
                        <span>${mainArticle.date}</span>
                        <span class="mx-2">•</span>
                        <span class="flex items-center gap-1 group-hover:translate-x-2 transition-transform duration-300 text-white">
                            Lire l'article <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </span>
                    </div>
                </div>
            </a>
        `;

            // 2. GÉNÉRATION DES ARTICLES SECONDAIRES (Les suivants)
            const sideArticles = latestArticles.slice(1, 3);

            let sidebarHTML = `<div class="flex flex-col gap-6 h-full">`;

            sideArticles.forEach((article, index) => {
                // CORRECTION : Utilisation de fade-in-entry et calcul du délai
                sidebarHTML += `
                <a href="${article.link}" class="group flex flex-col sm:flex-row gap-6 bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors h-full fade-in-entry" style="animation-delay: ${(index + 2) * 0.15}s;">
                    <!-- Image miniature -->
                    <div class="w-full sm:w-1/3 aspect-video sm:aspect-square rounded-xl overflow-hidden flex-shrink-0">
                        <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                    </div>
                    
                    <!-- Contenu -->
                    <div class="flex flex-col justify-center">
                        <span class="text-warm-orange text-xs font-bold uppercase tracking-wider mb-2">${article.category || 'Conseil'}</span>
                        <h4 class="text-xl font-bold text-white mb-3 leading-snug group-hover:text-clarity-blue transition-colors">
                            ${article.title}
                        </h4>
                        <p class="text-gray-400 text-sm line-clamp-2 mb-4">
                            ${article.description}
                        </p>
                         <div class="text-xs text-gray-500 mt-auto">
                            ${article.date}
                        </div>
                    </div>
                </a>
            `;
            });

            sidebarHTML += `</div>`;
            sidebarContainer.innerHTML = sidebarHTML;

            // NOTE : On ne relance plus ScrollReveal() ici.

        } catch (error) {
            console.error("Impossible de charger l'aperçu du blog:", error);
        }
    }

    // Appel de la fonction
    initBlogPreview();



    // ==================================================================
    // NOUVEAU : LOGIQUE POUR LE FORMULAIRE DE COMMENTAIRES DU BLOG
    // ==================================================================
    const commentFormPath = document.getElementById('comment-form-page-path');
    if (commentFormPath) {
        // Remplit automatiquement le champ caché avec l'URL de la page actuelle
        commentFormPath.value = window.location.pathname;
    }





    // ==================================================================
    // NOUVEAU : LOGIQUE POUR LE BANDEAU DE CONSENTEMENT COOKIES
    // ==================================================================
    const cookieBanner = document.getElementById('cookie-consent-banner');
    const acceptBtn = document.getElementById('cookie-accept-btn');
    const declineBtn = document.getElementById('cookie-decline-btn');
    const openSettingsBtn = document.getElementById('open-cookie-settings'); // Nouveau bouton footer

    if (cookieBanner && acceptBtn && declineBtn) {
        // Vérifier si le consentement a déjà été donné
        const consent = localStorage.getItem('cookie_consent');

        if (!consent) {
            cookieBanner.classList.remove('hidden');
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'accepted');
            cookieBanner.classList.add('hidden');
            // Init GA ici si besoin
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'declined');
            cookieBanner.classList.add('hidden');
            // Désactiver le suivi ici si besoin
        });

        // NOUVEAU : Logique pour rouvrir le bandeau via le footer
        if (openSettingsBtn) {
            openSettingsBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Empêche de remonter en haut de page
                cookieBanner.classList.remove('hidden'); // Affiche le bandeau
            });
        }
    }






    // ==================================================================
    // ANIMATION DU TERMINAL (TYPEWRITER EFFECT)
    // ==================================================================
    const terminalContainer = document.getElementById('typewriter-container');

    if (terminalContainer) {
        // TRADUCTION FRANÇAISE APPLIQUÉE ICI
        const lines = [
            { text: "> INITIALISATION : ANALYSE DU WEB...", class: "text-gray-400" },
            { text: "> CHARGEMENT DES DONNÉES : 99%...", class: "text-gray-400" },
            { text: "> RECHERCHE D'EMPATHIE...", class: "text-blue-400" },
            { text: "> ERREUR CRITIQUE : CONNEXION_HUMAINE_INTROUVABLE", class: "text-red-500 font-bold" },
            { text: "> RECHERCHE D'EXPERTS BIENVEILLANTS...", class: "text-yellow-400" },
            { text: "> SOLUTION DÉTECTÉE : VOUS.", class: "text-green-400 font-bold text-lg mt-2" }
        ];


        let lineIndex = 0;
        let charIndex = 0;
        let isTyping = false;

        function typeLine() {
            if (lineIndex < lines.length) {
                const currentLineData = lines[lineIndex];

                // Si c'est le début d'une nouvelle ligne, on crée l'élément HTML
                if (charIndex === 0) {
                    const p = document.createElement('div');
                    p.className = currentLineData.class; // Applique la couleur Tailwind
                    p.id = `line-${lineIndex}`;
                    terminalContainer.appendChild(p);
                }

                const currentLineElement = document.getElementById(`line-${lineIndex}`);

                // Ajoute un caractère
                currentLineElement.textContent += currentLineData.text.charAt(charIndex);
                charIndex++;

                // Vitesse de frappe aléatoire pour faire "humain/robot"
                const typingSpeed = Math.random() * (50 - 20) + 20;

                if (charIndex < currentLineData.text.length) {
                    setTimeout(typeLine, typingSpeed);
                } else {
                    // Fin de la ligne, on passe à la suivante après une petite pause
                    lineIndex++;
                    charIndex = 0;
                    setTimeout(typeLine, 300); // Pause de 300ms entre les lignes
                }
            }
        }

        // On utilise IntersectionObserver pour lancer l'anim seulement quand on voit le terminal
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isTyping) {
                    isTyping = true;
                    terminalContainer.innerHTML = ''; // Vide le conteneur au cas où
                    typeLine(); // Lance l'animation
                }
            });
        }, { threshold: 0.5 }); // Déclenche quand 50% du terminal est visible

        observer.observe(terminalContainer);
    }



    // ==================================================================
    // DÉCLENCHEUR EFFET FLOU (Concept 1)
    // ==================================================================
    const heroImage = document.querySelector('.hero-ken-burns');
    if (heroImage) {
        // Ajoute la classe de base immédiatement
        heroImage.classList.add('blur-reveal');

        // Attend 500ms puis enlève le flou
        setTimeout(() => {
            heroImage.classList.add('active');
        }, 500);
    }



    // ==================================================================
    // EFFET MATRIX "HACKER SCRAMBLE" POUR LES TITRES
    // ==================================================================
    const hackerTitles = document.querySelectorAll(".hacker-title");

    // Lettres utilisées pour l'effet de brouillage
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

    hackerTitles.forEach(title => {
        // Au survol de la carte parente
        title.closest('.group').addEventListener("mouseenter", event => {
            let iteration = 0;

            // On récupère le texte original
            const originalText = title.dataset.value;

            clearInterval(title.interval);

            title.interval = setInterval(() => {
                title.innerText = originalText
                    .split("")
                    .map((letter, index) => {
                        // Si on a déjà "trouvé" la bonne lettre, on la garde
                        if (index < iteration) {
                            return originalText[index];
                        }
                        // Sinon on affiche un caractère aléatoire Matrix
                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");

                // On arrête quand tout le mot est décodé
                if (iteration >= originalText.length) {
                    clearInterval(title.interval);
                }

                // Vitesse de décodage
                iteration += 1 / 3;
            }, 30); // Vitesse de changement des lettres (30ms)
        });
    });






    // ==================================================================
    // LOGIQUE TRANSITION TUNNEL (VERSION AVEC PAUSE DE LECTURE)
    // ==================================================================
    const tunnelSection = document.getElementById('transition-tunnel');
    const lightMask = document.getElementById('light-mask');
    const lightContent = document.getElementById('light-content');
    const darkContent = document.getElementById('dark-content');

    if (tunnelSection && lightMask && lightContent) {

        function onScrollTunnel() {
            const rect = tunnelSection.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const scrolled = -rect.top;
            const totalScrollable = tunnelSection.offsetHeight - viewportHeight;

            // Reset si on est au-dessus
            if (scrolled < 0) {
                lightMask.style.clipPath = `circle(0% at 50% 50%)`;
                lightContent.style.opacity = '0';
                darkContent.style.opacity = '1';
                darkContent.style.transform = 'scale(1)';
                return;
            }

            // Progression brute (0 à 1)
            let rawProgress = scrolled / totalScrollable;

            // --- CONFIGURATION DE LA PAUSE ---
            // L'animation ne commence qu'après 20% du scroll total
            const startThreshold = 0.20;

            let animProgress = 0;

            if (rawProgress < startThreshold) {
                // PHASE 1 : LECTURE (0% à 20% du scroll)
                // On force l'animation à 0. Le cercle reste fermé.
                animProgress = 0;

                // Petit effet sympa : le texte recule légèrement pendant qu'on lit
                // pour montrer qu'on est bien en train de scroller
                const textScale = 1 - (rawProgress * 0.5); // Passe de 1 à 0.9
                darkContent.style.transform = `scale(${textScale})`;
                darkContent.style.opacity = '1';

            } else {
                // PHASE 2 : OUVERTURE (20% à 100% du scroll)
                // On recalcule une progression de 0 à 1 basée sur l'espace restant
                animProgress = (rawProgress - startThreshold) / (1 - startThreshold);

                // On s'assure de ne pas dépasser 1
                if (animProgress > 1) animProgress = 1;

                // On fait disparaître le texte sombre rapidement dès que ça s'ouvre
                darkContent.style.opacity = Math.max(0, 1 - (animProgress * 3));
                // On fige l'échelle du texte sombre
                darkContent.style.transform = `scale(0.9)`;
            }

            // --- APPLICATION DE L'ANIMATION (Basée sur animProgress) ---

            // 1. Le Cercle s'ouvre (de 0% à 150%)
            const clipSize = animProgress * 150;
            const clipString = `circle(${clipSize}% at 50% 50%)`;

            lightMask.style.clipPath = clipString;
            lightMask.style.webkitClipPath = clipString;

            // 2. Le contenu clair apparaît
            const scale = 1.5 - (animProgress * 0.5);
            const opacity = Math.min(1, animProgress * 2);

            lightContent.style.transform = `scale(${scale})`;
            lightContent.style.opacity = opacity;
        }

        window.addEventListener('scroll', onScrollTunnel, { passive: true });
        onScrollTunnel();
    }



    // ==================================================================
    // EFFET MATRIX RAIN (CANVAS)
    // ==================================================================
    const canvas = document.getElementById('matrix-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        // Ajuster la taille du canvas à l'écran
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        // Les caractères qui vont tomber (Mélange Katakana + Chiffres pour l'effet Matrix pur)
        // Si vous préférez juste des 0 et 1, changez cette chaîne.
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
        const fontSize = 14;
        const columns = width / fontSize; // Nombre de colonnes

        // Tableau pour stocker la position Y de chaque colonne
        const drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        // Fonction de dessin (appelée en boucle)
        function drawMatrix() {
            // Fond noir très transparent pour créer l'effet de traînée (trail effect)
            ctx.fillStyle = "rgba(15, 23, 42, 0.05)"; // Couleur neutral-dark avec opacité
            ctx.fillRect(0, 0, width, height);

            // Couleur du texte (Vert Matrix)
            ctx.fillStyle = "#22c55e"; // green-500
            ctx.font = fontSize + "px monospace";

            for (let i = 0; i < drops.length; i++) {
                // Choix aléatoire du caractère
                const text = letters.charAt(Math.floor(Math.random() * letters.length));

                // Dessin du caractère
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                // Réinitialisation aléatoire de la goutte vers le haut
                // ou descente normale
                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }

            requestAnimationFrame(drawMatrix);
        }

        // Lancer l'animation
        drawMatrix();

        // Gérer le redimensionnement de la fenêtre
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
    }







    // ==================================================================
    // LOGIQUE ÂME : L'ERRANCE RÉSISTANTE (CORRIGÉE MOBILE)
    // ==================================================================
    const soulEntity = document.getElementById('soul-entity');
    const soulCore = document.querySelector('.soul-core');
    const timelineContainer = document.getElementById('timeline-container');
    const timelinePoints = document.querySelectorAll('.timeline-point');
    const timelineChapters = document.querySelectorAll('.timeline-line ~ .space-y-32 > div');

    if (soulEntity && soulCore && timelineContainer && timelinePoints.length > 0) {

        // Positions
        let currentY = 0;
        let lastY = 0;
        let currentX = 0;

        // Gestion de l'inactivité (Le Doute)
        let lastScrollTime = Date.now();
        let isIdle = false;
        let driftDirection = 1;

        // --- REGLAGES ---
        const IDLE_DELAY = 1000;      // 1 seconde avant de commencer à dériver
        const DRIFT_SPEED = 0.008;    // Vitesse de dérive (un peu plus rapide pour qu'on la voie bouger)
        const RETURN_SPEED = 0.10;    // Vitesse de retour (l'effet élastique)

        // DETECTION MOBILE
        const isMobile = window.innerWidth < 768;

        // DISTANCE DE DÉRIVE MAX
        // Desktop : 500px (Large) | Mobile : 120px (Reste visible à l'écran)
        const MAX_DRIFT_X = isMobile ? 120 : 500;

        // Variables infusion
        let infusionTimer = null;
        let currentTargetChapter = null;
        const INFUSION_DELAY = 1200;

        // Physique Y
        const LERP_Y = 0.12;
        const STRETCH_FORCE = 0.1;
        const MAGNET_RANGE = 150;

        
        // --- TRAÎNÉE (MODIFIÉE : Effet Comète Fluide) ---
        // On augmente le nombre de points pour combler les vides
        const TRAIL_LENGTH = 60; 
        const trailPieces = [];

        for (let i = 0; i < TRAIL_LENGTH; i++) {
            const piece = document.createElement('div');
            piece.classList.add('soul-trail-piece');
            timelineContainer.insertBefore(piece, soulEntity);
            // On initialise tout au centre
            trailPieces.push({ el: piece, y: 0, x: 0 });
        }


        window.addEventListener('scroll', () => {
            lastScrollTime = Date.now();

            // Si l'utilisateur scroll, on annule l'inactivité immédiatement
            if (isIdle) {
                isIdle = false;
                // Au prochain arrêt, on recalcule une direction
                // SUR MOBILE : Toujours 1 (Vers la droite)
                // SUR DESKTOP : Aléatoire (-1 gauche ou 1 droite)
                if (isMobile) {
                    driftDirection = 1;
                } else {
                    driftDirection = Math.random() > 0.5 ? 1 : -1;
                }
            }
        }, { passive: true });


        const timelineLine = document.querySelector('.timeline-line');

        function animateSoul() {
            const now = Date.now();
            const containerRect = timelineContainer.getBoundingClientRect();
            const viewportCenter = window.innerHeight / 2;

            // --- 1. LOGIQUE VERTICALE (Y) ---
            const firstPoint = timelinePoints[0];
            const firstPointRect = firstPoint.getBoundingClientRect();
            const startThresholdY = firstPointRect.top - containerRect.top + (firstPointRect.height / 2);

            let scrollTargetY = viewportCenter - containerRect.top;
            const minY = startThresholdY;
            const maxY = containerRect.height - 50;
            let constrainedTargetY = Math.max(minY, Math.min(maxY, scrollTargetY));

            if (scrollTargetY < startThresholdY - 50) {
                soulEntity.style.opacity = '0';
                trailPieces.forEach(p => p.el.style.opacity = '0');
            } else {
                soulEntity.style.opacity = '1';
            }

            let minDistance = Infinity;
            let closestPointY = null;
            let activeChapter = null;

            timelinePoints.forEach((point, index) => {
                const pointRect = point.getBoundingClientRect();
                const pointRelY = pointRect.top - containerRect.top + (pointRect.height / 2);
                const dist = Math.abs(pointRelY - constrainedTargetY);
                if (dist < minDistance) {
                    minDistance = dist;
                    closestPointY = pointRelY;
                    activeChapter = timelineChapters[index];
                }
            });

            let finalTargetY = constrainedTargetY;
            let isLocked = false;

            const LOCK_RANGE = 100;

            if (closestPointY !== null && minDistance < MAGNET_RANGE) {
                const offset = constrainedTargetY - closestPointY;
                const ratio = Math.abs(offset) / MAGNET_RANGE;
                const gravityOffset = offset * Math.pow(ratio, 1.8);
                finalTargetY = closestPointY + gravityOffset;

                if (minDistance < LOCK_RANGE) {
                    isLocked = true;
                }
            }

            // --- 2. LOGIQUE HORIZONTALE (X) - C'est ici que tout se joue ---
            let targetX = 0;
            let currentLerpX = RETURN_SPEED;

            if (isLocked) {
                // L'utilisateur est sur un point important : L'âme revient se coller à la ligne
                lastScrollTime = now;
                targetX = 0;
                currentLerpX = 0.2; // Retour rapide (Snap)
            } else {
                // Entre deux points : La dérive commence
                if (now - lastScrollTime > IDLE_DELAY) {
                    // Si on ne scroll plus depuis 1 seconde
                    isIdle = true;

                    // On définit la cible : Vers la droite (ou gauche PC) à X pixels
                    targetX = driftDirection * MAX_DRIFT_X;

                    // Vitesse lente pour montrer qu'elle "part" doucement
                    currentLerpX = DRIFT_SPEED;
                } else {
                    // Si on scroll, elle reste au centre
                    targetX = 0;
                    currentLerpX = RETURN_SPEED;
                }
            }

            // --- 3. APPLICATION PHYSIQUE ---
            if (currentY === 0) {
                currentY = finalTargetY; currentX = 0;
                trailPieces.forEach(p => { p.y = finalTargetY; p.x = 0; });
            }

            currentY += (finalTargetY - currentY) * LERP_Y;
            // C'est ici que l'âme bouge vers la gauche ou la droite
            currentX += (targetX - currentX) * currentLerpX;

            // Ajout d'une petite vibration visible (lutte) quand elle dérive
            if (isIdle) {
                // Vibration plus forte (3px) pour voir qu'elle est instable
                const struggle = (Math.random() - 0.5) * 3;
                currentX += struggle;
            }

            // Squash & Stretch
            let velocityY = currentY - lastY;
            lastY = currentY;
            const speed = Math.abs(velocityY) + Math.abs(targetX - currentX) * 0.05;

            let stretchY = 1 + (speed * STRETCH_FORCE);
            let stretchX = 1 - (speed * (STRETCH_FORCE * 0.6));

            soulEntity.style.top = `${currentY}px`;
            soulEntity.style.transform = `translate(calc(-50% + ${currentX}px), -50%)`;
            soulCore.style.transform = `scale(${stretchX}, ${stretchY})`;

            // --- Noircissement ---
            const darknessRange = isMobile ? 200 : 800; // S'adapte à l'écran
            let driftRatio = Math.min(Math.abs(currentX) / darknessRange, 1);
            const brightnessVal = 1 - (driftRatio * 0.4);
            const grayscaleVal = driftRatio * 0.7;

            soulCore.style.filter = `blur(3px) brightness(${brightnessVal}) grayscale(${grayscaleVal})`;

            // --- Interaction Ligne ---
            if (timelineLine) {
                const distFromCenter = Math.abs(currentX);

                if (distFromCenter < 20) {
                    timelineLine.classList.add('line-active');
                    timelineLine.style.transform = `translateX(-50%)`;
                    timelineLine.style.filter = `drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))`;
                } else if (distFromCenter > (isMobile ? 50 : 200)) {
                    // Si l'âme est loin, la ligne tremble
                    const jitter = (Math.random() - 0.5) * 4;
                    timelineLine.classList.remove('line-active');
                    timelineLine.style.transform = `translateX(calc(-50% + ${jitter}px))`;
                    timelineLine.style.opacity = 0.1 + Math.random() * 0.2;
                } else {
                    timelineLine.classList.remove('line-active');
                    timelineLine.style.transform = `translateX(-50%)`;
                    timelineLine.style.opacity = 0.4;
                    timelineLine.style.filter = 'none';
                }
            }

            
            

            // --- 4. TRAÎNÉE (LOGIQUE CORRIGÉE : INERTIE & TAILLE) ---
            
            let trailTargetX = currentX;
            let trailTargetY = currentY;

            trailPieces.forEach((piece, index) => {
                // CORRECTION 1 : On ralentit la traînée (0.18 au lieu de 0.35)
                // Elle aura plus d'inertie et restera bien derrière l'âme lors des accélérations
                const stiffness = 0.18; 

                // Physique
                piece.x += (trailTargetX - piece.x) * stiffness;
                piece.y += (trailTargetY - piece.y) * stiffness;

                // CORRECTION 2 : On commence plus petit (0.75 au lieu de 1)
                // Ainsi, même si la traînée touche l'âme, elle sera plus petite que le noyau
                // et ne le cachera pas visuellement.
                const startScale = 0.75; 
                const scale = startScale * (1 - (index / TRAIL_LENGTH)); 

                piece.el.style.top = `${piece.y}px`;
                piece.el.style.transform = `translate(calc(-50% + ${piece.x}px), -50%) scale(${scale})`;

                // Opacité
                const baseOpacity = 0.5 * (1 - (index / TRAIL_LENGTH)); 
                
                if (soulEntity.style.opacity === '0') {
                    piece.el.style.opacity = '0';
                    piece.x = currentX;
                    piece.y = currentY;
                } else {
                    const driftFade = 1 - (driftRatio * 0.5);
                    piece.el.style.opacity = Math.max(0, baseOpacity * driftFade);
                }

                trailTargetX = piece.x;
                trailTargetY = piece.y;
            });
            



            // --- 5. COULEURS (INFUSION) ---
            if (isLocked && speed < 1 && activeChapter) {
                if (activeChapter !== currentTargetChapter) {
                    currentTargetChapter = activeChapter;
                    if (infusionTimer) clearTimeout(infusionTimer);
                    removeInfusionClasses();
                    infusionTimer = setTimeout(() => { applyInfusionColor(activeChapter); }, INFUSION_DELAY);
                }
            } else {
                if (currentTargetChapter !== null) {
                    currentTargetChapter = null;
                    if (infusionTimer) clearTimeout(infusionTimer);
                    removeInfusionClasses();
                }
            }

            requestAnimationFrame(animateSoul);
        }

        function removeInfusionClasses() {
            soulEntity.classList.remove('soul-infused-fire', 'soul-infused-greed', 'soul-infused-blue', 'soul-infused-void', 'soul-infused-stasis', 'soul-infused-hologram');
            trailPieces.forEach(p => {
                p.el.classList.remove('soul-trail-fire', 'soul-trail-greed', 'soul-trail-blue', 'soul-trail-void', 'soul-trail-stasis', 'soul-trail-hologram');
            });
        }

        function applyInfusionColor(chapter) {
            const mood = chapter.getAttribute('data-mood');
            if (!mood) return;
            let soulClass = '', trailClass = '';
            if (mood === 'fire') { soulClass = 'soul-infused-fire'; trailClass = 'soul-trail-fire'; }
            else if (mood === 'greed') { soulClass = 'soul-infused-greed'; trailClass = 'soul-trail-greed'; }
            else if (mood === 'void') { soulClass = 'soul-infused-void'; trailClass = 'soul-trail-void'; }
            else if (mood === 'blue') { soulClass = 'soul-infused-blue'; trailClass = 'soul-trail-blue'; }
            else if (mood === 'stasis') { soulClass = 'soul-infused-stasis'; trailClass = 'soul-trail-stasis'; }
            else if (mood === 'hologram') { soulClass = 'soul-infused-hologram'; trailClass = 'soul-trail-hologram'; }

            if (soulClass) soulEntity.classList.add(soulClass);
            if (trailClass) trailPieces.forEach(p => p.el.classList.add(trailClass));
        }

        requestAnimationFrame(animateSoul);
    }








    // ==================================================================
    // LOGIQUE GLITCH MOMENTS DE RUPTURE (CORRIGÉE : PLUS LONGUE + SURSAUT)
    // ==================================================================
    const glitchTargets = document.querySelectorAll('.glitch-target');

    if (glitchTargets.length > 0) {
        const glitchObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // On déclenche plus tôt (dès que 50% est visible)
                if (entry.isIntersecting) {
                    const element = entry.target;

                    if (!element.classList.contains('has-glitched')) {
                        // Marqueur immédiat pour ne pas relancer en boucle
                        element.classList.add('has-glitched');

                        // 1. DÉMARRAGE DU GLITCH (Le Plantage)
                        element.classList.add('glitch-active');

                        // 2. PREMIER ARRÊT (Après 2.5 secondes - beaucoup plus long)
                        setTimeout(() => {
                            element.classList.remove('glitch-active');

                            // 3. LE SURSAUT (Le "Re-glitch")
                            // 300ms de pause, puis on relance un petit coup court
                            setTimeout(() => {
                                element.classList.add('glitch-active');

                                // 4. ARRÊT FINAL (Après 0.5s de sursaut)
                                setTimeout(() => {
                                    element.classList.remove('glitch-active');
                                }, 500);

                            }, 300);

                        }, 2500); // Durée initiale augmentée à 2.5 secondes
                    }
                }
            });
        }, {
            threshold: 0.5, // Déclenche quand l'élément est au milieu (aligné avec l'âme)
            rootMargin: "0px 0px -100px 0px"
        });

        glitchTargets.forEach(target => {
            glitchObserver.observe(target);
        });
    }






  // ==================================================================
    // EFFET 3D TILT (CARTE) + PARALLAXE FOND (CORRIGÉ & STYLÉ)
    // ==================================================================
    const contextSection = document.getElementById('context-section');
    const tiltCard = document.getElementById('tilt-card');
    const glare = document.querySelector('.card-glare');
    const parallaxLayers = document.querySelectorAll('.parallax-layer');

    if (contextSection && tiltCard) {

        // --- A. PARALLAXE DU FOND (Sur toute la section) ---
        // On sépare la logique : le fond bouge toujours quand on est dans la section
        contextSection.addEventListener('mousemove', (e) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            parallaxLayers.forEach(layer => {
                const speed = layer.getAttribute('data-speed');
                const x = (e.clientX - centerX) * speed / 100;
                const y = (e.clientY - centerY) * speed / 100;
                layer.style.transform = `translate(${x}px, ${y}px)`;
            });
        });

        // --- B. TILT DE LA CARTE (Uniquement sur la carte) ---
        
        // 1. Entrée souris : On active le mode "Mouvement Rapide"
        tiltCard.addEventListener('mouseenter', () => {
            tiltCard.classList.add('is-moving');
        });

        // 2. Mouvement souris : Calcul de la rotation
        tiltCard.addEventListener('mousemove', (e) => {
            const cardRect = tiltCard.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;

            // Rotation (Max 8 degrés)
            const rotateX = ((mouseY / cardRect.height) * -8).toFixed(2);
            const rotateY = ((mouseX / cardRect.width) * 8).toFixed(2);

            // On applique la rotation
            tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            // Gestion du reflet (Glare)
            const relativeX = e.clientX - cardRect.left;
            const relativeY = e.clientY - cardRect.top;
            tiltCard.style.setProperty('--mouse-x', `${relativeX}px`);
            tiltCard.style.setProperty('--mouse-y', `${relativeY}px`);
        });

        // 3. Sortie souris : C'est ici que la magie opère (RESET)
        const resetCard = () => {
            // On enlève la classe 'is-moving' -> Le CSS rebascule sur la transition lente/élastique
            tiltCard.classList.remove('is-moving');
            
            // On remet la carte à plat
            tiltCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
            
            // On reset aussi le reflet
            if (glare) {
               // Optionnel : on peut cacher le glare ou le remettre au centre
            }
        };

        tiltCard.addEventListener('mouseleave', resetCard);
        
        // Sécurité : Si on scroll et que la souris sort sans déclencher mouseleave
        // (rare mais possible), on peut observer la sortie de la section
        contextSection.addEventListener('mouseleave', () => {
            // On reset aussi les particules du fond
            parallaxLayers.forEach(layer => {
                layer.style.transform = `translate(0px, 0px)`;
            });
            resetCard();
        });
    }





});
