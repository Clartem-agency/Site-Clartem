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
    // ANIMATIONS AVEC SCROLLREVEAL (VERSION PREMIUM)
    // ==================================================================
    if (typeof ScrollReveal !== 'undefined') { // On active aussi sur mobile maintenant, c'est léger
        const srConfig = {
            origin: 'bottom',
            distance: '30px', // Distance un peu plus grande pour l'élégance
            duration: 800,    // Durée plus longue (0.8s) pour la douceur
            delay: 0,
            opacity: 0,
            scale: 1,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Courbe d'animation fluide
            reset: false,     // Une fois apparu, ça reste (plus stable)
            viewFactor: 0.2   // Déclenche quand 20% de l'élément est visible
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
    // --- FIN DE LA LOGIQUE MODIFIÉE ---
    // ==================================================================


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
    
    // On cible le conteneur par son ID unique pour éviter les erreurs si on change la hauteur CSS
    const stackingContainer = document.getElementById('stacking-container');

    if (planSection && stackingContainer && window.innerWidth >= 768) {
        const panels = Array.from(planSection.querySelectorAll('.panel'));
        const numPanels = panels.length;

        // Réglages de l'animation
        const STACK_SCALE_FACTOR = 0.05; // Réduit la taille des cartes du dessous
        const STACK_Y_OFFSET = 20;       // Décalage vertical des cartes du dessous
        const START_DELAY = 0.05;        // Commence l'anim un peu après le début
        const END_DELAY = 0.05;          // Finit l'anim un peu avant la fin

        

        const handleScroll = () => {
            const rect = stackingContainer.getBoundingClientRect();
            
            // Calculer la progression : 
            // Quand rect.top est à 0, on est au début.
            // Quand rect.top est négatif, on scroll vers le bas.
            const viewportHeight = window.innerHeight;
            
            // On commence l'animation quand le haut du conteneur touche le haut de l'écran
            // et on la finit quand le bas du conteneur touche le bas de l'écran
            const start = 0;
            const end = stackingContainer.offsetHeight - viewportHeight;
            
            // On inverse rect.top car on scroll vers le bas (les valeurs deviennent négatives)
            const currentScroll = -rect.top;
            
            // Sécurité : on borne entre 0 et 1
            let progress = currentScroll / end;
            progress = Math.max(0, Math.min(1, progress));

            // Réglages fins de l'animation
            // On joue l'animation sur 90% du scroll pour laisser une marge
            const animationProgress = Math.min(1, Math.max(0, progress / 0.9));
            const panelProgress = animationProgress * (numPanels - 1);

            panels.forEach((panel, panelIndex) => {
                const distance = panelIndex - panelProgress;
                panel.style.zIndex = numPanels - panelIndex;

                if (distance >= 0) {
                    // La carte est visible (dans la pile)
                    const scale = 1 - (distance * 0.05);
                    const translateY = distance * 20; // Décalage pour voir les cartes du dessous
                    
                    panel.style.transform = `translateY(${translateY}px) scale(${Math.max(0, scale)})`;
                    panel.style.opacity = '1';
                } else {
                    // La carte part vers le haut (disparaît)
                    // On accélère la sortie pour qu'elle ne gêne pas
                    panel.style.transform = `translateY(${distance * 100}px) scale(0.9)`;
                    panel.style.opacity = '0'; 
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Appel initial pour placer les cartes correctement au chargement
        handleScroll();
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
    // LOGIQUE COMPLÈTE POUR LA PAGE BLOG (VERSION AVEC ARTICLE "À LA UNE" MANUEL)
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
                        featuredPostContainer.innerHTML = `
                        <h2 class="text-3xl font-bold text-neutral-dark mb-10 text-center">À la Une</h2>
                        <a href="${featuredArticle.link}" class="block group" data-sr>
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

                    // 4.4 Affichage
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

                    if (typeof ScrollReveal !== 'undefined') {
                        ScrollReveal().reveal('[data-sr]', {
                            origin: 'bottom', distance: '20px', duration: 500, delay: 0,
                            opacity: 0, scale: 1, easing: 'cubic-bezier(0.5, 0, 0, 1)',
                            reset: false, viewFactor: 0.2
                        }, 50);
                    }
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
    // NOUVEAU : LOGIQUE POUR L'APERÇU DU BLOG SUR LA PAGE D'ACCUEIL
    // ==================================================================
    async function initBlogPreview() {
        const blogPreviewGrid = document.getElementById('blog-preview-grid');
        // Cette fonction ne s'exécute que si la grille d'aperçu existe sur la page
        if (!blogPreviewGrid) {
            return;
        }

        try {
            // On récupère les mêmes données que pour la page blog
            const response = await fetch('page-cartes-blog.json');
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            const allArticles = await response.json();

            // On ne garde que les 3 articles les plus récents (les 3 premiers du fichier)
            const latestArticles = allArticles.slice(0, 3);

            // On génère le HTML pour ces 3 articles
            blogPreviewGrid.innerHTML = latestArticles.map(article => `
            <div data-sr data-sr-delay="${latestArticles.indexOf(article) * 100}">
                <a href="${article.link}" class="block h-full group">
                    <div class="bg-soft-blue/60 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col overflow-hidden border border-gray-200 h-full">
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

            // On s'assure que ScrollReveal anime les nouveaux éléments
            if (typeof ScrollReveal !== 'undefined' && window.innerWidth >= 768) {
                ScrollReveal().reveal('#blog-preview-grid [data-sr]');
            }

        } catch (error) {
            console.error("Impossible de charger l'aperçu du blog:", error);
            blogPreviewGrid.innerHTML = `<p class="text-center text-neutral-light col-span-full">Impossible de charger les derniers articles pour le moment.</p>`;
        }
    }

    // APPEL DE LA NOUVELLE FONCTION POUR LA PAGE D'ACCUEIL
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

    if (cookieBanner && acceptBtn && declineBtn) {
        // Vérifier si le consentement a déjà été donné
        const consent = localStorage.getItem('cookie_consent');

        if (!consent) {
            cookieBanner.classList.remove('hidden');
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'accepted');
            cookieBanner.classList.add('hidden');
            // Ici, vous pourriez déclencher l'initialisation de Google Analytics si vous l'utilisez
            // ex: if (typeof gtag === 'function') { gtag('consent', 'update', { 'analytics_storage': 'granted' }); }
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'declined');
            cookieBanner.classList.add('hidden');
            // Ici, vous vous assurez que le suivi est désactivé
            // ex: if (typeof gtag === 'function') { gtag('consent', 'update', { 'analytics_storage': 'denied' }); }
        });
    }



});
