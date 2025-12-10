/**
 * G2RD Portfolio Universel Filtrable - Frontend JavaScript
 *
 * Gère l'affichage dynamique, les filtres, la pagination et les interactions
 */

(function () {
  "use strict";

  // Fonction principale d'initialisation
  function initializePortfolios() {
    const portfolios = document.querySelectorAll(".g2rd-portfolio-universel");

    portfolios.forEach((portfolio) => {
      // Récupérer la configuration
      let config = {};
      try {
        const configData = portfolio.getAttribute("data-config");
        if (configData) {
          config = JSON.parse(configData);
        }
      } catch (e) {
        console.error("G2RD Portfolio: Error parsing config", e);
        return;
      }

      // Initialiser le portfolio
      const portfolioInstance = new PortfolioManager(portfolio, config);
      portfolioInstance.init();
    });
  }

  /**
   * Classe principale pour gérer un portfolio
   */
  class PortfolioManager {
    constructor(container, config) {
      this.container = container;
      this.config = config;
      this.currentPage = 1;
      this.totalPages = 1;
      this.items = [];
      this.filters = {
        categories: [],
        tags: [],
        taxonomies: {},
        dateFrom: "",
        dateTo: "",
        author: "",
        search: "",
      };
      this.availableFilters = null;
      this.isLoading = false;
    }

    /**
     * Initialise le portfolio
     */
    async init() {
      // Créer la structure HTML
      this.createStructure();
      this.applyCustomStyles();

      // Charger les filtres disponibles
      await this.loadAvailableFilters();

      // Créer les filtres UI
      if (this.config.showFilters) {
        this.createFiltersUI();
        this.applyCustomStyles(); // Réappliquer après création des filtres
      }

      // Charger les premiers éléments
      await this.loadItems();

      // Créer la pagination
      this.createPagination();
      this.applyCustomStyles(); // Réappliquer après création de la pagination
    }

    /**
     * Crée la structure HTML de base
     */
    /**
     * Applique les styles personnalisés depuis la configuration
     */
    applyCustomStyles() {
      if (!this.config.styles || Object.keys(this.config.styles).length === 0) {
        return;
      }

      const styles = this.config.styles;

      // Styles des filtres
      const filtersContainer = this.container.querySelector(
        ".portfolio-filters-container"
      );
      if (filtersContainer) {
        if (styles.filtersBackground) {
          filtersContainer.style.backgroundColor = styles.filtersBackground;
        }
        if (styles.filtersGap) {
          filtersContainer.style.gap = `${styles.filtersGap}px`;
        }
      }

      // Styles des labels de filtres
      const filterLabels = this.container.querySelectorAll(
        ".portfolio-filter label"
      );
      filterLabels.forEach((label) => {
        if (styles.filtersTitleColor) {
          label.style.color = styles.filtersTitleColor;
        }
        if (styles.filtersTitleSize) {
          label.style.fontSize = `${styles.filtersTitleSize}px`;
        }
      });

      // Styles des boutons de filtres
      const filterButtons = this.container.querySelectorAll(
        ".portfolio-filter-button"
      );
      filterButtons.forEach((button) => {
        if (button.classList.contains("active")) {
          // Bouton actif
          if (styles.filterButtonActiveBackground) {
            button.style.backgroundColor = styles.filterButtonActiveBackground;
          }
          if (styles.filterButtonTextColor) {
            button.style.color = "#fff"; // Texte blanc pour les boutons actifs par défaut
          }
        } else {
          // Bouton inactif
          if (styles.filterButtonBackground) {
            button.style.backgroundColor = styles.filterButtonBackground;
          }
          if (styles.filterButtonTextColor) {
            button.style.color = styles.filterButtonTextColor;
          }
        }
      });

      // Styles de la recherche
      const searchInput = this.container.querySelector(
        ".portfolio-search-input"
      );
      if (searchInput) {
        if (styles.searchBackground) {
          searchInput.style.backgroundColor = styles.searchBackground;
        }
        if (styles.searchTextColor) {
          searchInput.style.color = styles.searchTextColor;
        }
        if (styles.searchBorderColor) {
          searchInput.style.borderColor = styles.searchBorderColor;
        }
        if (styles.searchFontSize) {
          searchInput.style.fontSize = `${styles.searchFontSize}px`;
        }
        if (styles.searchPadding) {
          searchInput.style.padding = `${styles.searchPadding}px`;
        }
      }

      // Styles des cartes
      const portfolioItems = this.container.querySelectorAll(".portfolio-item");
      portfolioItems.forEach((item) => {
        if (styles.cardBackground) {
          item.style.backgroundColor = styles.cardBackground;
        }
        if (styles.cardPadding) {
          const content = item.querySelector(".portfolio-item-content");
          if (content) {
            content.style.padding = `${styles.cardPadding}px`;
          }
        }
      });

      // Styles des titres de posts
      const postTitles = this.container.querySelectorAll(
        ".portfolio-item-title"
      );
      postTitles.forEach((title) => {
        if (styles.postTitleColor) {
          title.style.color = styles.postTitleColor;
        }
        if (styles.postTitleSize) {
          title.style.fontSize = `${styles.postTitleSize}px`;
        }
      });

      // Styles du texte des posts
      const postTexts = this.container.querySelectorAll(
        ".portfolio-item-excerpt, .portfolio-item-content"
      );
      postTexts.forEach((text) => {
        if (styles.postTextColor) {
          text.style.color = styles.postTextColor;
        }
        if (styles.postTextSize) {
          text.style.fontSize = `${styles.postTextSize}px`;
        }
      });

      // Styles du bouton Load More
      const loadMoreBtn = this.container.querySelector(".portfolio-load-more");
      if (loadMoreBtn) {
        if (styles.loadMoreBackground) {
          loadMoreBtn.style.backgroundColor = styles.loadMoreBackground;
        }
        if (styles.loadMoreTextColor) {
          loadMoreBtn.style.color = styles.loadMoreTextColor;
        }
        if (styles.loadMoreFontSize) {
          loadMoreBtn.style.fontSize = `${styles.loadMoreFontSize}px`;
        }
        if (styles.loadMorePadding) {
          loadMoreBtn.style.padding = `${styles.loadMorePadding}px ${
            styles.loadMorePadding * 1.5
          }px`;
        }
      }

      // Styles des boutons de pagination
      const paginationButtons = this.container.querySelectorAll(
        ".portfolio-pagination-page, .portfolio-pagination-prev, .portfolio-pagination-next"
      );
      paginationButtons.forEach((button) => {
        if (styles.paginationButtonBackground) {
          button.style.backgroundColor = styles.paginationButtonBackground;
        }
        if (styles.paginationButtonTextColor) {
          button.style.color = styles.paginationButtonTextColor;
        }
      });
    }

    createStructure() {
      const container = this.container.querySelector(".portfolio-container");
      if (!container) return;

      // Conteneur des filtres
      if (!container.querySelector(".portfolio-filters-container")) {
        const filtersContainer = document.createElement("div");
        filtersContainer.className = "portfolio-filters-container";
        container.insertBefore(filtersContainer, container.firstChild);
      }

      // Conteneur des items
      const itemsContainer = container.querySelector(
        ".portfolio-items-container"
      );
      if (itemsContainer) {
        itemsContainer.className = `portfolio-items-container portfolio-${this.config.displayMode}`;
        itemsContainer.style.gap = `${this.config.gap}px`;
        if (this.config.displayMode === "grid") {
          itemsContainer.style.gridTemplateColumns = `repeat(${this.config.columns}, 1fr)`;
        }
      }

      // Conteneur de pagination
      if (!container.querySelector(".portfolio-pagination-container")) {
        const paginationContainer = document.createElement("div");
        paginationContainer.className = "portfolio-pagination-container";
        container.appendChild(paginationContainer);
      }
    }

    /**
     * Charge les filtres disponibles depuis l'API
     */
    async loadAvailableFilters() {
      try {
        const apiRoot = window?.wpApiSettings?.root || "/wp-json/";
        const postTypes = this.config.postTypes.join(",");
        const url = `${apiRoot}g2rd/v1/portfolio-universel/filters?post_types=${postTypes}&include_woocommerce=${this.config.includeWooCommerce}`;

        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        this.availableFilters = await response.json();
      } catch (error) {
        console.error("G2RD Portfolio: Error loading filters", error);
        this.availableFilters = {
          categories: [],
          tags: [],
          taxonomies: {},
          authors: [],
        };
      }
    }

    /**
     * Crée l'interface des filtres
     */
    createFiltersUI() {
      const filtersContainer = this.container.querySelector(
        ".portfolio-filters-container"
      );
      if (!filtersContainer || !this.availableFilters) return;

      filtersContainer.innerHTML = "";

      // Recherche
      if (this.config.showSearch) {
        const searchWrapper = document.createElement("div");
        searchWrapper.className = "portfolio-filter portfolio-filter-search";
        searchWrapper.innerHTML = `
          <input 
            type="text" 
            class="portfolio-search-input" 
            placeholder="Rechercher par titre ou contenu..."
            value="${this.filters.search}"
          />
        `;
        const searchInput = searchWrapper.querySelector(
          ".portfolio-search-input"
        );
        let searchTimeout;
        searchInput.addEventListener("input", (e) => {
          clearTimeout(searchTimeout);
          searchTimeout = setTimeout(() => {
            this.filters.search = e.target.value;
            this.resetAndLoad();
          }, 500);
        });
        filtersContainer.appendChild(searchWrapper);
      }

      // Catégories
      if (
        this.config.showCategories &&
        this.availableFilters.categories.length > 0
      ) {
        const categoriesWrapper = document.createElement("div");
        categoriesWrapper.className =
          "portfolio-filter portfolio-filter-categories";
        categoriesWrapper.innerHTML = `
          <label>Catégories</label>
          <div class="portfolio-filter-buttons"></div>
        `;
        const buttonsContainer = categoriesWrapper.querySelector(
          ".portfolio-filter-buttons"
        );
        this.availableFilters.categories.forEach((cat) => {
          const button = document.createElement("button");
          button.className = "portfolio-filter-button";
          button.dataset.type = "category";
          button.dataset.id = cat.id;
          button.textContent = `${cat.name} (${cat.count})`;
          button.addEventListener("click", () =>
            this.toggleFilter("categories", cat.id)
          );
          buttonsContainer.appendChild(button);
        });
        filtersContainer.appendChild(categoriesWrapper);
      }

      // Tags
      if (this.config.showTags && this.availableFilters.tags.length > 0) {
        const tagsWrapper = document.createElement("div");
        tagsWrapper.className = "portfolio-filter portfolio-filter-tags";
        tagsWrapper.innerHTML = `
          <label>Tags</label>
          <div class="portfolio-filter-buttons"></div>
        `;
        const buttonsContainer = tagsWrapper.querySelector(
          ".portfolio-filter-buttons"
        );
        this.availableFilters.tags.forEach((tag) => {
          const button = document.createElement("button");
          button.className = "portfolio-filter-button";
          button.dataset.type = "tag";
          button.dataset.id = tag.id;
          button.textContent = `${tag.name} (${tag.count})`;
          button.addEventListener("click", () =>
            this.toggleFilter("tags", tag.id)
          );
          buttonsContainer.appendChild(button);
        });
        filtersContainer.appendChild(tagsWrapper);
      }

      // Taxonomies custom
      if (
        this.config.showTaxonomies &&
        Object.keys(this.availableFilters.taxonomies).length > 0
      ) {
        Object.keys(this.availableFilters.taxonomies).forEach((taxSlug) => {
          const tax = this.availableFilters.taxonomies[taxSlug];
          if (tax.terms && tax.terms.length > 0) {
            const taxWrapper = document.createElement("div");
            taxWrapper.className = `portfolio-filter portfolio-filter-taxonomy portfolio-filter-${taxSlug}`;
            taxWrapper.innerHTML = `
              <label>${tax.name}</label>
              <div class="portfolio-filter-buttons"></div>
            `;
            const buttonsContainer = taxWrapper.querySelector(
              ".portfolio-filter-buttons"
            );
            tax.terms.forEach((term) => {
              const button = document.createElement("button");
              button.className = "portfolio-filter-button";
              button.dataset.type = "taxonomy";
              button.dataset.taxonomy = taxSlug;
              button.dataset.id = term.id;
              button.textContent = `${term.name} (${term.count})`;
              button.addEventListener("click", () =>
                this.toggleTaxonomyFilter(taxSlug, term.id)
              );
              buttonsContainer.appendChild(button);
            });
            filtersContainer.appendChild(taxWrapper);
          }
        });
      }

      // Filtre date
      if (this.config.showDateFilter) {
        const dateWrapper = document.createElement("div");
        dateWrapper.className = "portfolio-filter portfolio-filter-date";
        dateWrapper.innerHTML = `
          <label>Date</label>
          <div class="portfolio-date-inputs">
            <input type="date" class="portfolio-date-from" placeholder="De" />
            <input type="date" class="portfolio-date-to" placeholder="À" />
            <button class="portfolio-date-clear">Effacer</button>
          </div>
        `;
        const dateFrom = dateWrapper.querySelector(".portfolio-date-from");
        const dateTo = dateWrapper.querySelector(".portfolio-date-to");
        const dateClear = dateWrapper.querySelector(".portfolio-date-clear");

        dateFrom.value = this.filters.dateFrom;
        dateTo.value = this.filters.dateTo;

        dateFrom.addEventListener("change", (e) => {
          this.filters.dateFrom = e.target.value;
          this.resetAndLoad();
        });
        dateTo.addEventListener("change", (e) => {
          this.filters.dateTo = e.target.value;
          this.resetAndLoad();
        });
        dateClear.addEventListener("click", () => {
          this.filters.dateFrom = "";
          this.filters.dateTo = "";
          dateFrom.value = "";
          dateTo.value = "";
          this.resetAndLoad();
        });
        filtersContainer.appendChild(dateWrapper);
      }

      // Filtre auteur
      if (
        this.config.showAuthorFilter &&
        this.availableFilters.authors.length > 0
      ) {
        const authorWrapper = document.createElement("div");
        authorWrapper.className = "portfolio-filter portfolio-filter-author";
        authorWrapper.innerHTML = `
          <label>Auteur</label>
          <select class="portfolio-author-select">
            <option value="">Tous les auteurs</option>
          </select>
        `;
        const select = authorWrapper.querySelector(".portfolio-author-select");
        this.availableFilters.authors.forEach((author) => {
          const option = document.createElement("option");
          option.value = author.id;
          option.textContent = author.name;
          if (this.filters.author === author.id.toString()) {
            option.selected = true;
          }
          select.appendChild(option);
        });
        select.addEventListener("change", (e) => {
          this.filters.author = e.target.value;
          this.resetAndLoad();
        });
        filtersContainer.appendChild(authorWrapper);
      }

      // Bouton réinitialiser les filtres
      const resetWrapper = document.createElement("div");
      resetWrapper.className = "portfolio-filter portfolio-filter-reset";
      const resetButton = document.createElement("button");
      resetButton.className = "portfolio-reset-button";
      resetButton.textContent = "Réinitialiser les filtres";
      resetButton.addEventListener("click", () => this.resetFilters());
      resetWrapper.appendChild(resetButton);
      filtersContainer.appendChild(resetWrapper);

      // Mettre à jour l'état visuel des filtres actifs
      this.updateFiltersUI();
    }

    /**
     * Bascule un filtre (catégorie ou tag)
     */
    toggleFilter(type, id) {
      const idNum = parseInt(id);
      const index = this.filters[type].indexOf(idNum);
      if (index > -1) {
        this.filters[type].splice(index, 1);
      } else {
        this.filters[type].push(idNum);
      }
      this.resetAndLoad();
      this.updateFiltersUI();
    }

    /**
     * Bascule un filtre de taxonomie custom
     */
    toggleTaxonomyFilter(taxonomy, id) {
      const idNum = parseInt(id);
      if (!this.filters.taxonomies[taxonomy]) {
        this.filters.taxonomies[taxonomy] = [];
      }
      const index = this.filters.taxonomies[taxonomy].indexOf(idNum);
      if (index > -1) {
        this.filters.taxonomies[taxonomy].splice(index, 1);
      } else {
        this.filters.taxonomies[taxonomy].push(idNum);
      }
      this.resetAndLoad();
      this.updateFiltersUI();
    }

    /**
     * Met à jour l'état visuel des filtres
     */
    updateFiltersUI() {
      // Catégories
      this.container
        .querySelectorAll(
          ".portfolio-filter-categories .portfolio-filter-button"
        )
        .forEach((button) => {
          const id = parseInt(button.dataset.id);
          button.classList.toggle(
            "active",
            this.filters.categories.includes(id)
          );
        });

      // Tags
      this.container
        .querySelectorAll(".portfolio-filter-tags .portfolio-filter-button")
        .forEach((button) => {
          const id = parseInt(button.dataset.id);
          button.classList.toggle("active", this.filters.tags.includes(id));
        });

      // Taxonomies
      Object.keys(this.filters.taxonomies).forEach((taxonomy) => {
        this.container
          .querySelectorAll(
            `.portfolio-filter-${taxonomy} .portfolio-filter-button`
          )
          .forEach((button) => {
            const id = parseInt(button.dataset.id);
            const active = this.filters.taxonomies[taxonomy].includes(id);
            button.classList.toggle("active", active);
          });
      });
    }

    /**
     * Réinitialise tous les filtres
     */
    resetFilters() {
      this.filters = {
        categories: [],
        tags: [],
        taxonomies: {},
        dateFrom: "",
        dateTo: "",
        author: "",
        search: "",
      };
      this.resetAndLoad();
      this.createFiltersUI();
      this.applyCustomStyles(); // Réappliquer après recréation des filtres
    }

    /**
     * Réinitialise la page et recharge les items
     */
    resetAndLoad() {
      this.currentPage = 1;
      this.loadItems();
    }

    /**
     * Charge les items depuis l'API
     */
    async loadItems() {
      if (this.isLoading) return;
      this.isLoading = true;

      const itemsContainer = this.container.querySelector(
        ".portfolio-items-container"
      );
      if (!itemsContainer) {
        this.isLoading = false;
        return;
      }

      // Afficher le loader
      itemsContainer.classList.add("loading");

      try {
        const apiRoot = window?.wpApiSettings?.root || "/wp-json/";
        const params = new URLSearchParams({
          post_types: this.config.postTypes.join(","),
          include_woocommerce: this.config.includeWooCommerce ? "1" : "0",
          per_page: this.config.itemsPerPage,
          page: this.currentPage,
          orderby: this.config.orderBy,
          order: this.config.order,
        });

        // Ajouter les filtres
        if (this.filters.categories.length > 0) {
          params.append("categories", this.filters.categories.join(","));
        }
        if (this.filters.tags.length > 0) {
          params.append("tags", this.filters.tags.join(","));
        }
        if (Object.keys(this.filters.taxonomies).length > 0) {
          params.append("taxonomies", JSON.stringify(this.filters.taxonomies));
        }
        if (this.filters.dateFrom) {
          params.append("date_from", this.filters.dateFrom);
        }
        if (this.filters.dateTo) {
          params.append("date_to", this.filters.dateTo);
        }
        if (this.filters.author) {
          params.append("author", this.filters.author);
        }
        if (this.filters.search) {
          params.append("search", this.filters.search);
        }

        const url = `${apiRoot}g2rd/v1/portfolio-universel?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        // Logique différente selon le type de pagination
        if (this.config.paginationType === "load-more") {
          // Pour Load More : ajouter les items (sauf page 1)
          if (this.currentPage === 1) {
            this.items = data.items;
            itemsContainer.innerHTML = "";
          } else {
            // Ajouter les nouveaux items
            this.items = [...this.items, ...data.items];
          }
        } else {
          // Pour Pagination classique : toujours remplacer les items
          this.items = data.items;
          itemsContainer.innerHTML = "";
        }

        this.totalPages = data.pages;

        // Afficher les items
        this.renderItems();

        // Mettre à jour la pagination
        this.updatePagination();
        this.applyCustomStyles(); // Réappliquer après mise à jour de la pagination

        this.isLoading = false;
        itemsContainer.classList.remove("loading");
      } catch (error) {
        console.error("G2RD Portfolio: Error loading items", error);
        itemsContainer.innerHTML = `<p class="portfolio-error">Erreur lors du chargement des éléments.</p>`;
        itemsContainer.classList.remove("loading");
        this.isLoading = false;
      }
    }

    /**
     * Affiche les items dans le conteneur
     */
    renderItems() {
      const itemsContainer = this.container.querySelector(
        ".portfolio-items-container"
      );
      if (!itemsContainer) return;

      // Pour Load More : vider seulement à la première page (les autres pages ajoutent)
      // Pour Pagination : le conteneur a déjà été vidé dans loadItems()
      if (
        this.config.paginationType === "load-more" &&
        this.currentPage === 1
      ) {
        itemsContainer.innerHTML = "";
      }

      this.items.forEach((item) => {
        const itemElement = this.createItemElement(item);
        itemsContainer.appendChild(itemElement);
      });

      this.applyCustomStyles(); // Réappliquer après rendu des items

      // Initialiser le lazy loading des images
      this.initLazyLoading();
    }

    /**
     * Crée un élément HTML pour un item
     */
    createItemElement(item) {
      const article = document.createElement("article");
      article.className = "portfolio-item";
      article.dataset.id = item.id;
      article.dataset.type = item.postType || item.post_type;

      // Image
      const imageWrapper = document.createElement("div");
      imageWrapper.className = "portfolio-item-image";
      const featuredImage = item.featuredImage || item.featured_image;
      const featuredImageAlt = item.featuredImageAlt || item.featured_image_alt;
      if (featuredImage) {
        const img = document.createElement("img");
        img.src = featuredImage;
        img.alt = featuredImageAlt || item.title;
        img.loading = "lazy";
        imageWrapper.appendChild(img);
      }
      article.appendChild(imageWrapper);

      // Contenu
      const contentWrapper = document.createElement("div");
      contentWrapper.className = "portfolio-item-content";

      // Titre
      const title = document.createElement("h3");
      title.className = "portfolio-item-title";
      title.textContent = item.title;
      contentWrapper.appendChild(title);

      // Extrait
      if (this.config.showExcerpt && item.excerpt) {
        const excerpt = document.createElement("div");
        excerpt.className = "portfolio-item-excerpt";
        excerpt.innerHTML = item.excerpt;
        contentWrapper.appendChild(excerpt);
      }

      // Métadonnées
      const metaWrapper = document.createElement("div");
      metaWrapper.className = "portfolio-item-meta";

      if (this.config.showDate && (item.dateFormatted || item.date_formatted)) {
        const date = document.createElement("span");
        date.className = "portfolio-item-date";
        date.textContent = item.dateFormatted || item.date_formatted;
        metaWrapper.appendChild(date);
      }

      if (this.config.showAuthor && item.author) {
        const author = document.createElement("span");
        author.className = "portfolio-item-author";
        author.textContent = item.author.name;
        metaWrapper.appendChild(author);
      }

      if (item.priceHtml || item.price_html) {
        const price = document.createElement("span");
        price.className = "portfolio-item-price";
        price.innerHTML = item.priceHtml || item.price_html;
        metaWrapper.appendChild(price);
      }

      if (metaWrapper.children.length > 0) {
        contentWrapper.appendChild(metaWrapper);
      }

      article.appendChild(contentWrapper);

      // Lien selon le type
      if (this.config.linkType === "modal") {
        article.classList.add("portfolio-item-modal");
        article.addEventListener("click", () => this.openModal(item));
      } else if (this.config.linkType === "external") {
        const link = document.createElement("a");
        link.href = item.link;
        link.className = "portfolio-item-link";
        link.innerHTML = article.innerHTML;
        article.innerHTML = "";
        article.appendChild(link);
      } else if (this.config.linkType === "preview") {
        article.classList.add("portfolio-item-preview");
        article.addEventListener("mouseenter", () => this.showPreview(item));
        article.addEventListener("mouseleave", () => this.hidePreview());
      }

      return article;
    }

    /**
     * Initialise le lazy loading des images
     */
    initLazyLoading() {
      if ("IntersectionObserver" in window) {
        const images = this.container.querySelectorAll(
          ".portfolio-item-image img[loading='lazy']"
        );
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src || img.src;
              imageObserver.unobserve(img);
            }
          });
        });
        images.forEach((img) => imageObserver.observe(img));
      }
    }

    /**
     * Ouvre une modale avec le contenu complet
     */
    openModal(item) {
      // Créer la modale si elle n'existe pas
      let modal = document.querySelector(".portfolio-modal");
      if (!modal) {
        modal = document.createElement("div");
        modal.className = "portfolio-modal";
        modal.innerHTML = `
          <div class="portfolio-modal-overlay"></div>
          <div class="portfolio-modal-content">
            <button class="portfolio-modal-close">&times;</button>
            <div class="portfolio-modal-body"></div>
          </div>
        `;
        document.body.appendChild(modal);

        // Fermer la modale
        modal
          .querySelector(".portfolio-modal-close")
          .addEventListener("click", () => this.closeModal());
        modal
          .querySelector(".portfolio-modal-overlay")
          .addEventListener("click", () => this.closeModal());
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape") this.closeModal();
        });
      }

      // Remplir le contenu
      const body = modal.querySelector(".portfolio-modal-body");
      const featuredImage = item.featuredImage || item.featured_image;
      const featuredImageAlt = item.featuredImageAlt || item.featured_image_alt;
      body.innerHTML = `
        ${
          featuredImage
            ? `<img src="${featuredImage}" alt="${
                featuredImageAlt || item.title
              }" />`
            : ""
        }
        <h2>${item.title}</h2>
        ${
          item.excerpt
            ? `<div class="portfolio-modal-excerpt">${item.excerpt}</div>`
            : ""
        }
        <div class="portfolio-modal-content-full">${item.content}</div>
        <a href="${
          item.link
        }" class="portfolio-modal-link">Voir l'article complet</a>
      `;

      // Afficher la modale
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }

    /**
     * Ferme la modale
     */
    closeModal() {
      const modal = document.querySelector(".portfolio-modal");
      if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      }
    }

    /**
     * Affiche un preview rapide
     */
    showPreview(item) {
      // Implémentation du preview rapide (tooltip)
      // À compléter selon les besoins
    }

    /**
     * Cache le preview
     */
    hidePreview() {
      // Implémentation du preview rapide
      // À compléter selon les besoins
    }

    /**
     * Crée la pagination
     */
    createPagination() {
      const paginationContainer = this.container.querySelector(
        ".portfolio-pagination-container"
      );
      if (!paginationContainer) return;

      this.updatePagination();
    }

    /**
     * Met à jour la pagination
     */
    updatePagination() {
      const paginationContainer = this.container.querySelector(
        ".portfolio-pagination-container"
      );
      if (!paginationContainer) return;

      if (this.totalPages <= 1) {
        paginationContainer.innerHTML = "";
        return;
      }

      if (this.config.paginationType === "load-more") {
        // Bouton Load More
        if (this.currentPage < this.totalPages) {
          const loadMoreText = this.config.loadMoreText || "Charger plus";
          paginationContainer.innerHTML = `
            <button class="portfolio-load-more">${loadMoreText}</button>
          `;
          const loadMoreBtn = paginationContainer.querySelector(
            ".portfolio-load-more"
          );
          loadMoreBtn.addEventListener("click", () => {
            this.currentPage++;
            this.loadItems();
          });
        } else {
          paginationContainer.innerHTML = "";
        }
      } else {
        // Pagination classique
        let html = '<div class="portfolio-pagination">';
        if (this.currentPage > 1) {
          html += `<button class="portfolio-pagination-prev" data-page="${
            this.currentPage - 1
          }">Précédent</button>`;
        }
        for (let i = 1; i <= this.totalPages; i++) {
          if (
            i === 1 ||
            i === this.totalPages ||
            (i >= this.currentPage - 2 && i <= this.currentPage + 2)
          ) {
            html += `<button class="portfolio-pagination-page ${
              i === this.currentPage ? "active" : ""
            }" data-page="${i}">${i}</button>`;
          } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
            html += `<span class="portfolio-pagination-dots">...</span>`;
          }
        }
        if (this.currentPage < this.totalPages) {
          html += `<button class="portfolio-pagination-next" data-page="${
            this.currentPage + 1
          }">Suivant</button>`;
        }
        html += "</div>";

        paginationContainer.innerHTML = html;

        // Ajouter les event listeners
        paginationContainer
          .querySelectorAll(
            ".portfolio-pagination-page, .portfolio-pagination-prev, .portfolio-pagination-next"
          )
          .forEach((btn) => {
            btn.addEventListener("click", (e) => {
              const page = parseInt(e.target.dataset.page);
              if (page && page !== this.currentPage) {
                this.currentPage = page;
                this.loadItems();
                // Scroll vers le haut du portfolio
                this.container.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            });
          });
      }
    }
  }

  // Initialiser quand le DOM est prêt
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePortfolios);
  } else {
    initializePortfolios();
  }

  // Réinitialiser si de nouveaux blocs sont ajoutés dynamiquement
  if (typeof MutationObserver !== "undefined") {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (
            node.nodeType === 1 &&
            node.classList &&
            node.classList.contains("g2rd-portfolio-universel")
          ) {
            initializePortfolios();
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
