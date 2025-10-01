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

    const nav = document.getElementById('main-nav');
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
    // MODIFIÉ : N'active ScrollReveal que sur les écrans > 768px
    // ==================================================================
    if (typeof ScrollReveal !== 'undefined' && window.innerWidth >= 768) {
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
    // NOUVEAU : LOGIQUE POUR L'ACCORDÉON FAQ (CENTRALISÉE)
    // ==================================================================
    const faqToggles = document.querySelectorAll('.faq-toggle');
    if (faqToggles.length > 0) {
        faqToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const answer = toggle.nextElementSibling;
                const icon = toggle.querySelector('svg');

                if (answer.style.maxHeight) {
                    answer.style.maxHeight = null;
                    icon.classList.remove('rotate-180');
                } else {
                    answer.style.maxHeight = answer.scrollHeight + "px";
                    icon.classList.add('rotate-180');
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
// NOUVEAU : LOGIQUE POUR L'EFFET DE CHUTE "STICKY" (SECTION PROBLÈME)
// ==================================================================
const scrollContainer = document.getElementById('problem-scroll-container');
// MODIFIÉ : Ajout de la condition de largeur d'écran
if (scrollContainer && window.innerWidth >= 768) {
    const problemCards = scrollContainer.querySelectorAll('.problem-card');
    const knotContainer = document.getElementById('frustration-knot-container'); 
    
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

        if (knotContainer) {
            const knotProgress = Math.min(1, totalProgress / ANIMATION_START_PROGRESS);
            const opacity = 1 - knotProgress;
            const scale = 1 - (knotProgress * 0.5);
            const rotate = knotProgress * -180; 

            knotContainer.style.opacity = opacity;
            knotContainer.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
            knotContainer.style.pointerEvents = opacity > 0 ? 'auto' : 'none';
        }

        let animationProgress = (totalProgress - ANIMATION_START_PROGRESS) / ANIMATION_DURATION;
        animationProgress = Math.max(0, Math.min(1, animationProgress));

        problemCards.forEach((card, index) => {
            
            // ======================================================================
            // MODIFICATION CLÉ : On définit un ordre précis : Milieu -> Gauche -> Droite
            // ======================================================================
            let animationOrder;
            // Nous avons maintenant 3 étapes distinctes, donc 3 animationSteps.
            const animationSteps = 3; 

            if (index === 1) {      // Si c'est la carte du milieu (index 1)
                animationOrder = 0; // Elle est la première à tomber (étape 0)
            } else if (index === 0) { // Si c'est la carte de gauche (index 0)
                animationOrder = 1; // Elle est la deuxième à tomber (étape 1)
            } else {                // Sinon, c'est la carte de droite (index 2)
                animationOrder = 2; // Elle est la troisième à tomber (étape 2)
            }
            // ======================================================================
            
            // Le reste du calcul s'adapte automatiquement à ce nouvel ordre.
            const startProgress = animationOrder / animationSteps;
            const endProgress = (animationOrder + 0.9) / animationSteps; 
            
            let cardProgress = (animationProgress - startProgress) / (endProgress - startProgress);
            cardProgress = Math.max(0, Math.min(1, cardProgress));

            const initialTranslateY = -window.innerHeight; 
            const translateY = initialTranslateY * (1 - cardProgress);
            const cardOpacity = cardProgress;

            card.style.opacity = cardOpacity;
            card.style.transform = `translateY(${translateY}px)`;
        });
    };

    window.addEventListener('scroll', handleProblemScroll, { passive: true });
    
    if (knotContainer) {
        knotContainer.style.opacity = 1; 
    }
    
    handleProblemScroll();
}

    

    // ==================================================================
    // LOGIQUE POUR L'EFFET STICKY (SECTION VALUE PROPOSITION) - VERSION MODIFIÉE
    // ==================================================================
    const valuePropScrollContainer = document.getElementById('value-prop-scroll-container');
    
    if (valuePropScrollContainer && window.innerWidth >= 768) {
        const valuePropCards = valuePropScrollContainer.querySelectorAll('.value-prop-card');
        // NOUVEAU : On récupère l'overlay
        const valuePropOverlay = document.getElementById('value-prop-overlay');
        
        const ANIMATION_START_PROGRESS = 0.20; 
        const ANIMATION_END_PROGRESS = 0.80;   
        const ANIMATION_DURATION = ANIMATION_END_PROGRESS - ANIMATION_START_PROGRESS;

        // NOUVEAU : Constantes pour le fondu de l'overlay
        const FADE_START_PROGRESS = 0.05; // Début du fondu (très tôt)
        const FADE_END_PROGRESS = 0.20;   // Fin du fondu (quand les cartes commencent à apparaître)

        const handleValuePropScroll = () => {
            const rect = valuePropScrollContainer.getBoundingClientRect();
            
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;

            const scrollAmount = -rect.top;
            const scrollDistance = valuePropScrollContainer.offsetHeight - window.innerHeight;
            
            let totalProgress = scrollAmount / scrollDistance;
            totalProgress = Math.max(0, Math.min(1, totalProgress));

            // --- DÉBUT DU BLOC MODIFIÉ ---
            // Logique pour le fondu progressif de l'overlay
            if (valuePropOverlay) {
                // Calcule la progression du fondu uniquement dans sa plage définie
                let fadeProgress = (totalProgress - FADE_START_PROGRESS) / (FADE_END_PROGRESS - FADE_START_PROGRESS);
                fadeProgress = Math.max(0, Math.min(1, fadeProgress)); // Bloque la valeur entre 0 et 1

                const opacity = 1 - fadeProgress; // L'opacité diminue à mesure que le fondu progresse
                const blurAmount = 4 * (1 - fadeProgress); // Le flou diminue (de 4px à 0px)

                valuePropOverlay.style.opacity = opacity;
                valuePropOverlay.style.backdropFilter = `blur(${blurAmount}px)`;
            }
            // --- FIN DU BLOC MODIFIÉ ---

            // Logique existante pour l'animation des cartes
            let animationProgress = (totalProgress - ANIMATION_START_PROGRESS) / ANIMATION_DURATION;
            animationProgress = Math.max(0, Math.min(1, animationProgress));

            valuePropCards.forEach((card, index) => {
                const cardCount = valuePropCards.length;
                
                const startProgress = index / cardCount;
                const endProgress = (index + 0.9) / cardCount;
                
                let cardProgress = (animationProgress - startProgress) / (endProgress - startProgress);
                cardProgress = Math.max(0, Math.min(1, cardProgress));

                const initialTranslateX = window.innerWidth;
                const translateX = initialTranslateX * (1 - cardProgress);
                const opacity = cardProgress;

                card.style.opacity = opacity;
                card.style.transform = `translateX(${translateX}px)`;
            });
        };

        window.addEventListener('scroll', handleValuePropScroll, { passive: true });
        handleValuePropScroll();
    }



    
    // ==================================================================
    // LOGIQUE POUR L'EFFET STACKING CARDS (SECTION PLAN)
    // ==================================================================
    const planSection = document.getElementById('plan');
    // MODIFIÉ : Ajout de la condition de largeur d'écran
    if (planSection && window.innerWidth >= 768) {
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
            
            panels.forEach((panel, panelIndex) => {
                // --- DÉBUT DE LA CORRECTION ---
                // On utilise l'index du panel dans la boucle (panelIndex) qui correspond à son ordre dans le DOM.
                const distance = panelIndex - panelProgress;

                // On définit un z-index fixe et décroissant.
                // Le premier panel (index 0) a le z-index le plus élevé (numPanels),
                // garantissant qu'il est toujours au-dessus des autres.
                panel.style.zIndex = numPanels - panelIndex;

                if (distance >= 0) {
                    // Ce panel est encore visible dans la pile.
                    const scale = 1 - (distance * STACK_SCALE_FACTOR);
                    const translateY = distance * STACK_Y_OFFSET;
                    
                    panel.style.transform = `translateY(${translateY}px) scale(${Math.max(0, scale)})`;
                    panel.style.opacity = '1';
                    panel.style.pointerEvents = 'auto';
                } else {
                    // Ce panel a été "décollé" et doit disparaître vers le haut.
                    // Son z-index élevé garantit qu'il passe au-dessus du reste.
                    panel.style.transform = 'translateY(-100%) scale(0.9)';
                    panel.style.opacity = '0';
                    panel.style.pointerEvents = 'none';
                }
                // --- FIN DE LA CORRECTION ---
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }



         // ==================================================================
    // NOUVEAU : LOGIQUE POUR L'ANIMATION DE LA SECTION SITE CLARTÉ
    // ==================================================================
    const clarityContainer = document.getElementById('clarity-section-container');
    if (clarityContainer && window.innerWidth >= 768) {
        const animatedElements = clarityContainer.querySelectorAll('.clarity-text-reveal, .clarity-list-item');
        const rightCard = document.getElementById('clarity-right-card');

        // ANCIENNE VALEUR : const CLARITY_ANIMATION_SCROLL_HEIGHT_VH = 150;
        // NOUVELLE VALEUR : Augmentée pour donner plus d'espace à l'animation
        const CLARITY_ANIMATION_SCROLL_HEIGHT_VH = 250;

        // --- DÉBUT DE LA CORRECTION CLÉ ---
        // 1. On calcule la hauteur nécessaire pour que l'animation se déroule.
        const animationScrollHeight = (CLARITY_ANIMATION_SCROLL_HEIGHT_VH / 100) * window.innerHeight;
        
        // 2. La hauteur totale du conteneur doit être la hauteur de l'animation + la hauteur de l'écran
        //    (pour permettre à l'élément "sticky" de se détacher à la fin).
        const totalContainerHeight = animationScrollHeight + window.innerHeight;

        // 3. On applique dynamiquement cette hauteur au conteneur.
        clarityContainer.style.height = `${totalContainerHeight}px`;
        // --- FIN DE LA CORRECTION CLÉ ---

        const thresholds = [
            // Gauche
            0.05, // Étape 0: Titre "Pourquoi..."
            0.10, // Étape 1: Paragraphe "Dans un monde..."
            0.18, // Étape 2: "Impact Immédiat"
            0.26, // Étape 3: "Optimisé pour la Conversion"
            0.34, // Étape 4: "Rapidité et Performance"
            // Droite
            0.45, // Étape 5: Titre "Ce que votre site inclut" (seuil pour le cadre)
            0.52, // Étape 6: Item 1
            0.59, // Étape 7: Item 2
            0.66, // Étape 8: Item 3
            0.73, // Étape 9: Item 4
            0.80, // Étape 10: Item 5
            0.87, // Étape 11: Item 6
            0.94, // Étape 12: Item 7
            0.98  // Étape 13: Bouton
        ];

        const handleClarityScroll = () => {
            const rect = clarityContainer.getBoundingClientRect();
            
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;

            const scrollAmount = -rect.top;
            
            // Le calcul de la progression utilise maintenant la variable `animationScrollHeight` que nous avons définie.
            let progress = scrollAmount / animationScrollHeight;
            progress = Math.max(0, Math.min(1, progress));

            if (progress >= thresholds[5]) {
                rightCard.classList.add('is-visible');
            } else {
                rightCard.classList.remove('is-visible');
            }

            animatedElements.forEach(el => {
                const step = parseInt(el.dataset.step, 10);
                if (progress >= thresholds[step]) {
                    el.classList.add('is-visible');
                } else {
                    el.classList.remove('is-visible');
                }
            });
        };

        window.addEventListener('scroll', handleClarityScroll, { passive: true });
        handleClarityScroll();
    }
    

    
    
    // ==================================================================
    // LOGIQUE POUR LA TRANSITION DE L'OVERLAY DE LA SECTION CLARTÉ
    // ==================================================================
    const clarityOverlay = document.getElementById('clarity-overlay');
    const clarityTitleBlock = document.getElementById('clarity-title-block'); 

    if (clarityOverlay && clarityTitleBlock) {
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && entry.boundingClientRect.bottom < 120) {
                    clarityOverlay.classList.add('is-faded');
                } else {
                    clarityOverlay.classList.remove('is-faded');
                }
            });
        };

        const observerOptions = {
            rootMargin: "-120px 0px 0px 0px",
            threshold: 0
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        observer.observe(clarityTitleBlock);
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
        // NOUVEAU : LOGIQUE COMPLÈTE POUR LA PAGE BLOG (VERSION JSON)
        // ==================================================================
        const blogPage = document.getElementById('articles-grid');
    
        if (blogPage) {
            // On encapsule toute la logique du blog dans une fonction asynchrone
            // pour pouvoir utiliser "await" pour charger les données.
            async function initBlog() {
                try {
        // --- 1. CHARGEMENT DES DONNÉES DEPUIS LE FICHIER JSON ---
        const response = await fetch('page-cartes-blog.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const allArticles = await response.json();
     

        // --- 2. GESTION DE L'ÉTAT ---
        const ITEMS_PER_PAGE = 9;
        let currentPage = 1;
        let activeCategory = 'all';
        let searchQuery = '';

        // --- 3. SÉLECTION DES ÉLÉMENTS DU DOM ---
        const articlesGrid = document.getElementById('articles-grid');
        const paginationContainer = document.getElementById('pagination-container');
        const categoryFilters = document.getElementById('category-filters');
        const searchInput = document.getElementById('search-input');
        const noResults = document.getElementById('no-results');

        // --- 4. FONCTIONS PRINCIPALES ---

        // Fonction pour afficher les articles
        function renderArticles() {
            // 4.1 Filtrage
            let filteredArticles = allArticles;

            if (activeCategory !== 'all') {
                filteredArticles = filteredArticles.filter(article => article.category === activeCategory);
            }

            if (searchQuery) {
                const lowerCaseQuery = searchQuery.toLowerCase();
                filteredArticles = filteredArticles.filter(article =>
                    article.title.toLowerCase().includes(lowerCaseQuery) ||
                    article.description.toLowerCase().includes(lowerCaseQuery)
                );
            }
            
            noResults.classList.toggle('hidden', filteredArticles.length > 0);

            // 4.2 Pagination
            const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

            // 4.3 Affichage
            articlesGrid.innerHTML = paginatedArticles.map(article => `
                <div class="portfolio-item" data-sr>
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
            
            // Relancer ScrollReveal sur les nouveaux éléments
            if (typeof ScrollReveal !== 'undefined') {
                ScrollReveal().reveal('.portfolio-item[data-sr]', {
                    origin: 'bottom',
                    distance: '20px',
                    duration: 500,
                    delay: 0,
                    opacity: 0,
                    scale: 1,
                    easing: 'cubic-bezier(0.5, 0, 0, 1)',
                    reset: false,
                    viewFactor: 0.2
                }, 50); // L'intervalle de 50ms crée un léger effet de cascade
            }
        }

        // Fonction pour afficher la pagination
        function renderPagination(totalPages) {
            if (totalPages <= 1) {
                paginationContainer.innerHTML = '';
                return;
            }

            let paginationHTML = `
                <button id="prev-page" class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''}>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
            `;

            for (let i = 1; i <= totalPages; i++) {
                paginationHTML += `
                    <button class="pagination-btn page-number ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>
                `;
            }

            paginationHTML += `
                <button id="next-page" class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''}>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
            `;

            paginationContainer.innerHTML = paginationHTML;
        }

        // --- 5. GESTION DES ÉVÉNEMENTS ---

        // Clic sur les filtres de catégorie
        categoryFilters.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                categoryFilters.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');
                activeCategory = e.target.dataset.filter;
                currentPage = 1;
                renderArticles();
            }
        });

        // Recherche
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchQuery = searchInput.value;
                currentPage = 1;
                renderArticles();
            }, 300); // Debounce pour ne pas surcharger
        });

        // Clic sur la pagination
        paginationContainer.addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;

            if (target.id === 'prev-page') {
                if (currentPage > 1) {
                    currentPage--;
                    renderArticles();
                }
            } else if (target.id === 'next-page') {
                const totalPages = paginationContainer.querySelectorAll('.page-number').length;
                if (currentPage < totalPages) {
                    currentPage++;
                    renderArticles();
                }
            } else if (target.classList.contains('page-number')) {
                currentPage = parseInt(target.dataset.page);
                renderArticles();
            }
        });


         // --- 6. INITIALISATION ---
                renderArticles();

            } catch (error) {
                console.error("Impossible de charger les articles du blog:", error);
                articlesGrid.innerHTML = `<p class="text-center text-destructive col-span-full">Erreur lors du chargement des articles. Veuillez réessayer plus tard.</p>`;
            }
        }

        // On lance l'initialisation du blog
        initBlog();
    }

                    
    
    
});
