import apiFetch from "@wordpress/api-fetch";
import {
  InspectorControls,
  useBlockProps,
  useSettings,
} from "@wordpress/block-editor";
import {
  ColorPalette,
  PanelBody,
  RangeControl,
  SelectControl,
  Spinner,
  TextControl,
  ToggleControl,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { useEffect, useLayoutEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

export default function Edit({ attributes, setAttributes }) {
  const {
    postTypes,
    includeWooCommerce,
    displayMode,
    itemsPerPage,
    paginationType,
    showFilters,
    showSearch,
    showCategories,
    showTags,
    showTaxonomies,
    showDateFilter,
    showAuthorFilter,
    linkType,
    columns,
    showExcerpt,
    showDate,
    showAuthor,
    imageAspectRatio,
    gap,
    orderBy,
    order,
    loadMoreText,
    styles = {},
  } = attributes;

  const [availablePostTypes, setAvailablePostTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewItems, setPreviewItems] = useState([]);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [availableFilters, setAvailableFilters] = useState(null);
  const [loadingFilters, setLoadingFilters] = useState(false);

  const blockProps = useBlockProps();

  // Récupérer les couleurs de la palette WordPress depuis theme.json
  const settings = useSettings();

  // Méthode alternative avec useSelect si useSettings ne fonctionne pas
  const blockEditorSettings = useSelect((select) => {
    return select("core/block-editor")?.getSettings();
  }, []);

  // État pour les couleurs récupérées via API
  const [apiColors, setApiColors] = useState([]);

  // Récupérer les couleurs - essayer plusieurs sources
  let themeColors = [];

  // Source 1: useSettings (méthode recommandée)
  if (settings?.color?.palette) {
    themeColors = Array.isArray(settings.color.palette)
      ? settings.color.palette
      : settings.color.palette.theme || settings.color.palette.default || [];
  }

  // Source 2: blockEditorSettings (fallback)
  if (themeColors.length === 0 && blockEditorSettings?.color?.palette) {
    themeColors = Array.isArray(blockEditorSettings.color.palette)
      ? blockEditorSettings.color.palette
      : blockEditorSettings.color.palette.theme ||
        blockEditorSettings.color.palette.default ||
        [];
  }

  // Source 3: API REST (dernier recours)
  useEffect(() => {
    if (themeColors.length === 0) {
      apiFetch({ path: "g2rd/v1/portfolio-universel/theme-colors" })
        .then((response) => {
          if (response?.colors && Array.isArray(response.colors)) {
            setApiColors(response.colors);
          }
        })
        .catch(() => {
          // Erreur silencieuse, les couleurs ne seront simplement pas chargées depuis l'API
        });
    }
  }, [themeColors.length]);

  // Utiliser les couleurs de l'API si les autres sources sont vides
  if (themeColors.length === 0 && apiColors.length > 0) {
    themeColors = apiColors;
  }

  // Source 4: Si toujours vide, utiliser un tableau vide (sera géré par le formatage)
  if (!Array.isArray(themeColors)) {
    themeColors = [];
  }

  // S'assurer que les couleurs sont au bon format pour ColorPalette
  // ColorPalette attend un tableau d'objets avec { name, slug, color }
  const formattedColors = themeColors
    .filter((color) => {
      // Filtrer les couleurs valides
      if (!color) return false;
      if (typeof color === "string") return true;
      return !!(color.color || color.value);
    })
    .map((color) => {
      if (typeof color === "string") {
        // Si c'est juste une chaîne, créer un objet
        return {
          name: color,
          slug: color.toLowerCase().replace(/\s+/g, "-"),
          color: color,
        };
      }
      // Sinon, s'assurer que l'objet a les bonnes propriétés
      const colorValue = color.color || color.value;
      if (!colorValue) {
        return null;
      }
      return {
        name: color.name || color.slug || "Couleur",
        slug:
          color.slug ||
          color.name?.toLowerCase().replace(/\s+/g, "-") ||
          "color",
        color: colorValue,
      };
    })
    .filter((color) => color !== null && color.color);

  // Fonction helper pour gérer le changement de couleur avec suppression si effacée
  const handleColorChange = (colorKey, color) => {
    const newStyles = { ...styles };
    if (color) {
      newStyles[colorKey] = color;
    } else {
      delete newStyles[colorKey];
    }
    setAttributes({ styles: newStyles });
  };

  // Récupérer les types de posts disponibles
  useEffect(() => {
    const fetchPostTypes = async () => {
      setLoading(true);
      try {
        // Utiliser notre route REST personnalisée pour récupérer les types de posts
        let response;
        try {
          response = await apiFetch({
            path: "g2rd/v1/portfolio-universel/post-types",
          });
        } catch {
          response = null;
        }

        // Si la réponse contient les types de posts
        if (
          response &&
          response.postTypes &&
          Array.isArray(response.postTypes) &&
          response.postTypes.length > 0
        ) {
          const postTypesList = response.postTypes.map((type) => ({
            label: type.label || type.name || type.value,
            value: type.value,
          }));

          // S'assurer que "post" a le bon label
          const postIndex = postTypesList.findIndex(
            (pt) => pt.value === "post"
          );
          if (postIndex !== -1) {
            postTypesList[postIndex].label = __(
              "Articles",
              "g2rd-portfolio-universel"
            );
          }

          setAvailablePostTypes(postTypesList);
          setLoading(false);
          return;
        }

        // Fallback : utiliser l'API WordPress standard si notre route ne fonctionne pas
        const types = await apiFetch({ path: "/wp/v2/types" });
        const postTypesList = [];

        Object.keys(types).forEach((key) => {
          const type = types[key];

          const excludedTypes = [
            "attachment",
            "wp_block",
            "wp_navigation",
            "wp_template",
            "wp_template_part",
            "revision",
            "nav_menu_item",
            "page",
          ];

          if (excludedTypes.includes(key)) {
            return;
          }

          const isPublic = type.public === true || type.public === "1";
          if (!isPublic) {
            return;
          }

          const showInRest =
            type.show_in_rest === true || type.show_in_rest === "1";
          const hasRestBase = type.rest_base && type.rest_base !== "";

          if (showInRest || (hasRestBase && key !== "post")) {
            postTypesList.push({
              label: type.name || key,
              value: key,
            });
          }
        });

        const hasPost = postTypesList.some((pt) => pt.value === "post");
        if (!hasPost) {
          postTypesList.unshift({
            label: __("Articles", "g2rd-portfolio-universel"),
            value: "post",
          });
        }

        setAvailablePostTypes(postTypesList);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    fetchPostTypes();
  }, []);

  // Appliquer les styles personnalisés à l'aperçu de l'éditeur
  // Utiliser useLayoutEffect pour une mise à jour synchrone avant le rendu
  useLayoutEffect(() => {
    const editorPreview = document.querySelector(
      ".g2rd-portfolio-universel-editor"
    );
    if (!editorPreview) return;

    // Si styles est vide, on doit quand même supprimer les styles inline existants
    if (!styles || Object.keys(styles).length === 0) {
      // Supprimer tous les styles inline pour revenir aux styles CSS par défaut
      const allStyledElements = editorPreview.querySelectorAll(
        ".portfolio-filters-container, .portfolio-filter label, .portfolio-search-input, .portfolio-editor-item, .portfolio-item-title, .portfolio-item-excerpt, .portfolio-load-more, .portfolio-filter-button, .portfolio-pagination-page, .portfolio-pagination-prev, .portfolio-pagination-next"
      );
      allStyledElements.forEach((element) => {
        element.style.removeProperty("background-color");
        element.style.removeProperty("color");
        element.style.removeProperty("border-color");
        element.style.removeProperty("font-size");
        element.style.removeProperty("padding");
        element.style.removeProperty("gap");
      });
      return;
    }

    // Styles des filtres
    const filtersContainer = editorPreview.querySelector(
      ".portfolio-filters-container"
    );
    if (filtersContainer) {
      if (styles.filtersBackground) {
        filtersContainer.style.setProperty(
          "background-color",
          styles.filtersBackground,
          "important"
        );
      } else {
        filtersContainer.style.removeProperty("background-color");
      }
      if (styles.filtersGap) {
        filtersContainer.style.setProperty(
          "gap",
          `${styles.filtersGap}px`,
          "important"
        );
      } else {
        filtersContainer.style.removeProperty("gap");
      }
    }

    // Styles des labels
    const filterLabels = editorPreview.querySelectorAll(
      ".portfolio-filter label"
    );
    filterLabels.forEach((label) => {
      if (styles.filtersTitleColor) {
        label.style.setProperty("color", styles.filtersTitleColor, "important");
      } else {
        label.style.removeProperty("color");
      }
      if (styles.filtersTitleSize) {
        label.style.setProperty(
          "font-size",
          `${styles.filtersTitleSize}px`,
          "important"
        );
      } else {
        label.style.removeProperty("font-size");
      }
    });

    // Styles de la recherche
    const searchInput = editorPreview.querySelector(".portfolio-search-input");
    if (searchInput) {
      if (styles.searchBackground) {
        searchInput.style.setProperty(
          "background-color",
          styles.searchBackground,
          "important"
        );
      } else {
        searchInput.style.removeProperty("background-color");
      }
      if (styles.searchTextColor) {
        searchInput.style.setProperty(
          "color",
          styles.searchTextColor,
          "important"
        );
      } else {
        searchInput.style.removeProperty("color");
      }
      if (styles.searchBorderColor) {
        searchInput.style.setProperty(
          "border-color",
          styles.searchBorderColor,
          "important"
        );
      } else {
        searchInput.style.removeProperty("border-color");
      }
      if (styles.searchFontSize) {
        searchInput.style.setProperty(
          "font-size",
          `${styles.searchFontSize}px`,
          "important"
        );
      } else {
        searchInput.style.removeProperty("font-size");
      }
      if (styles.searchPadding) {
        searchInput.style.setProperty(
          "padding",
          `${styles.searchPadding}px`,
          "important"
        );
      } else {
        searchInput.style.removeProperty("padding");
      }
    }

    // Styles des cartes
    const portfolioItems = editorPreview.querySelectorAll(
      ".portfolio-editor-item"
    );
    portfolioItems.forEach((item) => {
      if (styles.cardBackground) {
        item.style.setProperty(
          "background-color",
          styles.cardBackground,
          "important"
        );
      } else {
        item.style.removeProperty("background-color");
      }
      if (styles.cardPadding) {
        const content = item.querySelector(".portfolio-item-content");
        if (content) {
          content.style.setProperty(
            "padding",
            `${styles.cardPadding}px`,
            "important"
          );
        }
      } else {
        const content = item.querySelector(".portfolio-item-content");
        if (content) {
          content.style.removeProperty("padding");
        }
      }
    });

    // Styles des titres
    const postTitles = editorPreview.querySelectorAll(".portfolio-item-title");
    postTitles.forEach((title) => {
      if (styles.postTitleColor) {
        title.style.setProperty("color", styles.postTitleColor, "important");
      } else {
        title.style.removeProperty("color");
      }
      if (styles.postTitleSize) {
        title.style.setProperty(
          "font-size",
          `${styles.postTitleSize}px`,
          "important"
        );
      } else {
        title.style.removeProperty("font-size");
      }
    });

    // Styles du texte
    const postTexts = editorPreview.querySelectorAll(".portfolio-item-excerpt");
    postTexts.forEach((text) => {
      if (styles.postTextColor) {
        text.style.setProperty("color", styles.postTextColor, "important");
      } else {
        text.style.removeProperty("color");
      }
      if (styles.postTextSize) {
        text.style.setProperty(
          "font-size",
          `${styles.postTextSize}px`,
          "important"
        );
      } else {
        text.style.removeProperty("font-size");
      }
    });

    // Styles du bouton Load More
    const loadMoreBtn = editorPreview.querySelector(".portfolio-load-more");
    if (loadMoreBtn) {
      if (styles.loadMoreBackground) {
        loadMoreBtn.style.setProperty(
          "background-color",
          styles.loadMoreBackground,
          "important"
        );
      } else {
        loadMoreBtn.style.removeProperty("background-color");
      }
      if (styles.loadMoreTextColor) {
        loadMoreBtn.style.setProperty(
          "color",
          styles.loadMoreTextColor,
          "important"
        );
      } else {
        loadMoreBtn.style.removeProperty("color");
      }
      if (styles.loadMoreFontSize) {
        loadMoreBtn.style.setProperty(
          "font-size",
          `${styles.loadMoreFontSize}px`,
          "important"
        );
      } else {
        loadMoreBtn.style.removeProperty("font-size");
      }
      if (styles.loadMorePadding) {
        loadMoreBtn.style.setProperty(
          "padding",
          `${styles.loadMorePadding}px ${styles.loadMorePadding * 1.5}px`,
          "important"
        );
      } else {
        loadMoreBtn.style.removeProperty("padding");
      }
    }

    // Styles des boutons de filtre
    const filterButtons = editorPreview.querySelectorAll(
      ".portfolio-filter-button"
    );
    filterButtons.forEach((button) => {
      if (button.classList.contains("active")) {
        if (styles.filterButtonActiveBackground) {
          button.style.setProperty(
            "background-color",
            styles.filterButtonActiveBackground,
            "important"
          );
        } else {
          button.style.removeProperty("background-color");
        }
        if (styles.filterButtonTextColor) {
          button.style.setProperty("color", "#fff", "important");
        } else {
          button.style.removeProperty("color");
        }
      } else {
        if (styles.filterButtonBackground) {
          button.style.setProperty(
            "background-color",
            styles.filterButtonBackground,
            "important"
          );
        } else {
          button.style.removeProperty("background-color");
        }
        if (styles.filterButtonTextColor) {
          button.style.setProperty(
            "color",
            styles.filterButtonTextColor,
            "important"
          );
        } else {
          button.style.removeProperty("color");
        }
      }
    });

    // Styles des boutons de pagination
    const paginationButtons = editorPreview.querySelectorAll(
      ".portfolio-pagination-page, .portfolio-pagination-prev, .portfolio-pagination-next"
    );
    paginationButtons.forEach((button) => {
      if (styles.paginationButtonBackground) {
        button.style.setProperty(
          "background-color",
          styles.paginationButtonBackground,
          "important"
        );
      } else {
        button.style.removeProperty("background-color");
      }
      if (styles.paginationButtonTextColor) {
        button.style.setProperty(
          "color",
          styles.paginationButtonTextColor,
          "important"
        );
      } else {
        button.style.removeProperty("color");
      }
    });
  }, [styles, previewItems, availableFilters]);

  // Charger les filtres disponibles
  useEffect(() => {
    const loadFilters = async () => {
      if (postTypes.length === 0 || !showFilters) {
        setAvailableFilters(null);
        return;
      }

      setLoadingFilters(true);
      try {
        const params = {
          post_types: postTypes.join(","),
          include_woocommerce: includeWooCommerce ? "1" : "0",
        };

        const queryString = new URLSearchParams(params).toString();
        const data = await apiFetch({
          path: `g2rd/v1/portfolio-universel/filters?${queryString}`,
        });

        setAvailableFilters(data);
      } catch {
        setAvailableFilters({
          categories: [],
          tags: [],
          taxonomies: {},
          authors: [],
        });
      } finally {
        setLoadingFilters(false);
      }
    };

    loadFilters();
  }, [postTypes, includeWooCommerce, showFilters]);

  // Charger les items pour l'aperçu
  useEffect(() => {
    const loadPreviewItems = async () => {
      if (postTypes.length === 0) {
        setPreviewItems([]);
        return;
      }

      setLoadingPreview(true);
      try {
        // Utiliser apiFetch de WordPress pour l'éditeur
        const params = {
          post_types: postTypes.join(","),
          include_woocommerce: includeWooCommerce ? "1" : "0",
          per_page: Math.min(6, itemsPerPage), // Limiter à 6 pour l'aperçu
          page: 1,
          orderby: orderBy,
          order: order,
        };

        const queryString = new URLSearchParams(params).toString();
        const data = await apiFetch({
          path: `g2rd/v1/portfolio-universel?${queryString}`,
        });

        setPreviewItems(data.items || []);
      } catch {
        setPreviewItems([]);
      } finally {
        setLoadingPreview(false);
      }
    };

    loadPreviewItems();
  }, [postTypes, includeWooCommerce, itemsPerPage, orderBy, order]);

  // Gérer la sélection des types de posts
  const handlePostTypeToggle = (postType) => {
    const newPostTypes = postTypes.includes(postType)
      ? postTypes.filter((type) => type !== postType)
      : [...postTypes, postType];
    setAttributes({ postTypes: newPostTypes });
  };

  return (
    <>
      <InspectorControls>
        <PanelBody
          title={__("Types de contenu", "g2rd-portfolio-universel")}
          initialOpen={true}
        >
          {loading ? (
            <Spinner />
          ) : (
            <>
              {/* Section Articles */}
              <div style={{ marginBottom: "1.5rem" }}>
                <p
                  style={{
                    margin: "0 0 0.75rem 0",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    color: "#757575",
                  }}
                >
                  {__("Articles", "g2rd-portfolio-universel")}
                </p>
                {availablePostTypes
                  .filter((type) => type.value === "post")
                  .map((type) => (
                    <ToggleControl
                      key={type.value}
                      label={type.label}
                      checked={postTypes.includes(type.value)}
                      onChange={() => handlePostTypeToggle(type.value)}
                    />
                  ))}
              </div>

              {/* Section Custom Post Types */}
              {availablePostTypes.filter((type) => type.value !== "post")
                .length > 0 ? (
                <div style={{ marginBottom: "1.5rem" }}>
                  <p
                    style={{
                      margin: "0 0 0.75rem 0",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      color: "#757575",
                    }}
                  >
                    {__("Custom Post Types", "g2rd-portfolio-universel")}
                  </p>
                  {availablePostTypes
                    .filter((type) => type.value !== "post")
                    .map((type) => (
                      <ToggleControl
                        key={type.value}
                        label={type.label}
                        checked={postTypes.includes(type.value)}
                        onChange={() => handlePostTypeToggle(type.value)}
                      />
                    ))}
                </div>
              ) : (
                <div
                  style={{
                    padding: "1rem",
                    background: "#fff3cd",
                    border: "1px solid #ffc107",
                    borderRadius: "4px",
                    marginBottom: "1.5rem",
                  }}
                >
                  <p style={{ margin: "0 0 0.5rem 0", fontWeight: "600" }}>
                    {__("Aucun CPT disponible", "g2rd-portfolio-universel")}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.9rem" }}>
                    {__(
                      "Les Custom Post Types (Portfolio, Prestations, etc.) doivent être activés dans les paramètres du thème pour apparaître ici.",
                      "g2rd-portfolio-universel"
                    )}
                  </p>
                </div>
              )}

              {/* Section WooCommerce */}
              <div style={{ marginBottom: "0.5rem" }}>
                <p
                  style={{
                    margin: "0 0 0.75rem 0",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    color: "#757575",
                  }}
                >
                  {__("E-commerce", "g2rd-portfolio-universel")}
                </p>
                <ToggleControl
                  label={__("Inclure WooCommerce", "g2rd-portfolio-universel")}
                  checked={includeWooCommerce}
                  onChange={(value) =>
                    setAttributes({ includeWooCommerce: value })
                  }
                  help={__(
                    "Afficher les produits WooCommerce dans le portfolio",
                    "g2rd-portfolio-universel"
                  )}
                />
              </div>
            </>
          )}
        </PanelBody>

        <PanelBody
          title={__("Affichage", "g2rd-portfolio-universel")}
          initialOpen={true}
        >
          <SelectControl
            label={__("Mode d'affichage", "g2rd-portfolio-universel")}
            value={displayMode}
            options={[
              {
                label: __("Grille", "g2rd-portfolio-universel"),
                value: "grid",
              },
              {
                label: __("Masonry", "g2rd-portfolio-universel"),
                value: "masonry",
              },
              {
                label: __("Slider", "g2rd-portfolio-universel"),
                value: "slider",
              },
              {
                label: __("Liste", "g2rd-portfolio-universel"),
                value: "list",
              },
            ]}
            onChange={(value) => setAttributes({ displayMode: value })}
          />

          {displayMode === "grid" && (
            <RangeControl
              label={__("Colonnes", "g2rd-portfolio-universel")}
              value={columns}
              onChange={(value) => setAttributes({ columns: value })}
              min={1}
              max={6}
            />
          )}

          <RangeControl
            label={__("Éléments par page", "g2rd-portfolio-universel")}
            value={itemsPerPage}
            onChange={(value) => setAttributes({ itemsPerPage: value })}
            min={1}
            max={50}
          />

          <SelectControl
            label={__("Type de pagination", "g2rd-portfolio-universel")}
            value={paginationType}
            options={[
              {
                label: __("Load More", "g2rd-portfolio-universel"),
                value: "load-more",
              },
              {
                label: __("Pagination", "g2rd-portfolio-universel"),
                value: "pagination",
              },
            ]}
            onChange={(value) => setAttributes({ paginationType: value })}
          />

          {paginationType === "load-more" && (
            <TextControl
              label={__(
                "Texte du bouton Load More",
                "g2rd-portfolio-universel"
              )}
              value={
                loadMoreText || __("Charger plus", "g2rd-portfolio-universel")
              }
              onChange={(value) => setAttributes({ loadMoreText: value })}
              help={__(
                "Personnalisez le texte affiché sur le bouton 'Charger plus'",
                "g2rd-portfolio-universel"
              )}
            />
          )}

          <RangeControl
            label={__("Espacement (px)", "g2rd-portfolio-universel")}
            value={gap}
            onChange={(value) => setAttributes({ gap: value })}
            min={0}
            max={50}
          />
        </PanelBody>

        <PanelBody
          title={__("Filtres", "g2rd-portfolio-universel")}
          initialOpen={false}
        >
          <ToggleControl
            label={__("Afficher les filtres", "g2rd-portfolio-universel")}
            checked={showFilters}
            onChange={(value) => setAttributes({ showFilters: value })}
          />

          {showFilters && (
            <>
              <ToggleControl
                label={__("Afficher la recherche", "g2rd-portfolio-universel")}
                checked={showSearch}
                onChange={(value) => setAttributes({ showSearch: value })}
              />
              <ToggleControl
                label={__(
                  "Afficher les catégories",
                  "g2rd-portfolio-universel"
                )}
                checked={showCategories}
                onChange={(value) => setAttributes({ showCategories: value })}
              />
              <ToggleControl
                label={__("Afficher les tags", "g2rd-portfolio-universel")}
                checked={showTags}
                onChange={(value) => setAttributes({ showTags: value })}
              />
              <ToggleControl
                label={__(
                  "Afficher les taxonomies custom",
                  "g2rd-portfolio-universel"
                )}
                checked={showTaxonomies}
                onChange={(value) => setAttributes({ showTaxonomies: value })}
              />
              <ToggleControl
                label={__(
                  "Afficher le filtre date",
                  "g2rd-portfolio-universel"
                )}
                checked={showDateFilter}
                onChange={(value) => setAttributes({ showDateFilter: value })}
              />
              <ToggleControl
                label={__(
                  "Afficher le filtre auteur",
                  "g2rd-portfolio-universel"
                )}
                checked={showAuthorFilter}
                onChange={(value) => setAttributes({ showAuthorFilter: value })}
              />
            </>
          )}
        </PanelBody>

        <PanelBody
          title={__("Contenu des cartes", "g2rd-portfolio-universel")}
          initialOpen={false}
        >
          <ToggleControl
            label={__("Afficher l'extrait", "g2rd-portfolio-universel")}
            checked={showExcerpt}
            onChange={(value) => setAttributes({ showExcerpt: value })}
          />
          <ToggleControl
            label={__("Afficher la date", "g2rd-portfolio-universel")}
            checked={showDate}
            onChange={(value) => setAttributes({ showDate: value })}
          />
          <ToggleControl
            label={__("Afficher l'auteur", "g2rd-portfolio-universel")}
            checked={showAuthor}
            onChange={(value) => setAttributes({ showAuthor: value })}
          />
        </PanelBody>

        <PanelBody
          title={__("Liens et interactions", "g2rd-portfolio-universel")}
          initialOpen={false}
        >
          <SelectControl
            label={__("Type de lien", "g2rd-portfolio-universel")}
            value={linkType}
            options={[
              {
                label: __("Modale", "g2rd-portfolio-universel"),
                value: "modal",
              },
              {
                label: __("Lien externe", "g2rd-portfolio-universel"),
                value: "external",
              },
              {
                label: __("Preview rapide", "g2rd-portfolio-universel"),
                value: "preview",
              },
            ]}
            onChange={(value) => setAttributes({ linkType: value })}
          />
        </PanelBody>

        <PanelBody
          title={__("Tri", "g2rd-portfolio-universel")}
          initialOpen={false}
        >
          <SelectControl
            label={__("Trier par", "g2rd-portfolio-universel")}
            value={orderBy}
            options={[
              {
                label: __("Date", "g2rd-portfolio-universel"),
                value: "date",
              },
              {
                label: __("Titre", "g2rd-portfolio-universel"),
                value: "title",
              },
              {
                label: __("Modifié", "g2rd-portfolio-universel"),
                value: "modified",
              },
              {
                label: __("Ordre du menu", "g2rd-portfolio-universel"),
                value: "menu_order",
              },
              {
                label: __("Aléatoire", "g2rd-portfolio-universel"),
                value: "rand",
              },
            ]}
            onChange={(value) => setAttributes({ orderBy: value })}
          />

          <SelectControl
            label={__("Ordre", "g2rd-portfolio-universel")}
            value={order}
            options={[
              {
                label: __("Croissant", "g2rd-portfolio-universel"),
                value: "ASC",
              },
              {
                label: __("Décroissant", "g2rd-portfolio-universel"),
                value: "DESC",
              },
            ]}
            onChange={(value) => setAttributes({ order: value })}
          />
        </PanelBody>
      </InspectorControls>

      {/* Panneau Styles personnalisés dans l'onglet Styles */}
      <InspectorControls group="styles">
        {/* Styles des filtres */}
        <PanelBody
          title={__("Filtres", "g2rd-portfolio-universel")}
          initialOpen={false}
        >
          <div>
            <p>
              {__("Couleur de fond des filtres", "g2rd-portfolio-universel")}
            </p>
            <ColorPalette
              colors={formattedColors}
              value={styles.filtersBackground || undefined}
              onChange={(color) =>
                handleColorChange("filtersBackground", color)
              }
              clearable={true}
            />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <p>
              {__("Couleur du titre des filtres", "g2rd-portfolio-universel")}
            </p>
            <ColorPalette
              colors={formattedColors}
              value={styles.filtersTitleColor || undefined}
              onChange={(color) =>
                handleColorChange("filtersTitleColor", color)
              }
              clearable={true}
            />
          </div>
          <RangeControl
            label={__(
              "Taille du titre des filtres (px)",
              "g2rd-portfolio-universel"
            )}
            value={styles.filtersTitleSize || 16}
            onChange={(value) =>
              setAttributes({
                styles: { ...styles, filtersTitleSize: value },
              })
            }
            min={10}
            max={32}
          />
          <div style={{ marginTop: "1rem" }}>
            <p>
              {__(
                "Couleur de fond des boutons de filtre",
                "g2rd-portfolio-universel"
              )}
            </p>
            <ColorPalette
              colors={formattedColors}
              value={styles.filterButtonBackground || undefined}
              onChange={(color) =>
                handleColorChange("filterButtonBackground", color)
              }
              clearable={true}
            />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <p>
              {__(
                "Couleur du texte des boutons de filtre",
                "g2rd-portfolio-universel"
              )}
            </p>
            <ColorPalette
              colors={formattedColors}
              value={styles.filterButtonTextColor || undefined}
              onChange={(color) =>
                handleColorChange("filterButtonTextColor", color)
              }
              clearable={true}
            />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <p>
              {__(
                "Couleur de fond des boutons actifs",
                "g2rd-portfolio-universel"
              )}
            </p>
            <ColorPalette
              colors={formattedColors}
              value={styles.filterButtonActiveBackground || undefined}
              onChange={(color) =>
                handleColorChange("filterButtonActiveBackground", color)
              }
              clearable={true}
            />
          </div>
          <RangeControl
            label={__(
              "Espacement des filtres (px)",
              "g2rd-portfolio-universel"
            )}
            value={styles.filtersGap || 16}
            onChange={(value) =>
              setAttributes({
                styles: { ...styles, filtersGap: value },
              })
            }
            min={0}
            max={50}
          />
        </PanelBody>

        {/* Styles de la recherche */}
        <PanelBody
          title={__("Recherche", "g2rd-portfolio-universel")}
          initialOpen={false}
        >
          <div>
            <p>
              {__(
                "Couleur de fond de la barre de recherche",
                "g2rd-portfolio-universel"
              )}
            </p>
            <ColorPalette
              colors={formattedColors}
              value={styles.searchBackground || undefined}
              onChange={(color) => handleColorChange("searchBackground", color)}
              clearable={true}
            />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <p>
              {__(
                "Couleur du texte de la recherche",
                "g2rd-portfolio-universel"
              )}
            </p>
            <ColorPalette
              colors={formattedColors}
              value={styles.searchTextColor || undefined}
              onChange={(color) => handleColorChange("searchTextColor", color)}
              clearable={true}
            />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <p>
              {__(
                "Couleur de la bordure de la recherche",
                "g2rd-portfolio-universel"
              )}
            </p>
            <ColorPalette
              colors={formattedColors}
              value={styles.searchBorderColor || undefined}
              onChange={(color) =>
                setAttributes({
                  styles: { ...styles, searchBorderColor: color },
                })
              }
              clearable={true}
            />
          </div>
          <RangeControl
            label={__(
              "Taille du texte de la recherche (px)",
              "g2rd-portfolio-universel"
            )}
            value={styles.searchFontSize || 16}
            onChange={(value) =>
              setAttributes({
                styles: { ...styles, searchFontSize: value },
              })
            }
            min={10}
            max={24}
          />
          <RangeControl
            label={__(
              "Espacement interne de la recherche (px)",
              "g2rd-portfolio-universel"
            )}
            value={styles.searchPadding || 12}
            onChange={(value) =>
              setAttributes({
                styles: { ...styles, searchPadding: value },
              })
            }
            min={4}
            max={30}
          />
        </PanelBody>

        {/* Styles des posts */}
        <PanelBody
          title={__("Posts / Articles", "g2rd-portfolio-universel")}
          initialOpen={false}
        >
          <div>
            <p>
              {__("Couleur de fond des cartes", "g2rd-portfolio-universel")}
            </p>
            <ColorPalette
              colors={formattedColors}
              value={styles.cardBackground || undefined}
              onChange={(color) => handleColorChange("cardBackground", color)}
              clearable={true}
            />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <p>
              {__("Couleur du titre des posts", "g2rd-portfolio-universel")}
            </p>
            <ColorPalette
              colors={formattedColors}
              value={styles.postTitleColor || undefined}
              onChange={(color) => handleColorChange("postTitleColor", color)}
              clearable={true}
            />
          </div>
          <RangeControl
            label={__(
              "Taille du titre des posts (px)",
              "g2rd-portfolio-universel"
            )}
            value={styles.postTitleSize || 20}
            onChange={(value) =>
              setAttributes({
                styles: { ...styles, postTitleSize: value },
              })
            }
            min={12}
            max={40}
          />
          <div style={{ marginTop: "1rem" }}>
            <p>
              {__("Couleur du texte des posts", "g2rd-portfolio-universel")}
            </p>
            <ColorPalette
              colors={formattedColors}
              value={styles.postTextColor || undefined}
              onChange={(color) => handleColorChange("postTextColor", color)}
              clearable={true}
            />
          </div>
          <RangeControl
            label={__(
              "Taille du texte des posts (px)",
              "g2rd-portfolio-universel"
            )}
            value={styles.postTextSize || 16}
            onChange={(value) =>
              setAttributes({
                styles: { ...styles, postTextSize: value },
              })
            }
            min={10}
            max={24}
          />
          <RangeControl
            label={__(
              "Espacement interne des cartes (px)",
              "g2rd-portfolio-universel"
            )}
            value={styles.cardPadding || 20}
            onChange={(value) =>
              setAttributes({
                styles: { ...styles, cardPadding: value },
              })
            }
            min={0}
            max={50}
          />
        </PanelBody>

        {/* Styles des boutons */}
        <PanelBody
          title={__("Boutons", "g2rd-portfolio-universel")}
          initialOpen={false}
        >
          <div>
            <p>
              {__(
                "Couleur de fond du bouton Load More",
                "g2rd-portfolio-universel"
              )}
            </p>
            <ColorPalette
              colors={formattedColors}
              value={styles.loadMoreBackground || undefined}
              onChange={(color) =>
                handleColorChange("loadMoreBackground", color)
              }
              clearable={true}
            />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <p>
              {__(
                "Couleur du texte du bouton Load More",
                "g2rd-portfolio-universel"
              )}
            </p>
            <ColorPalette
              colors={formattedColors}
              value={styles.loadMoreTextColor || undefined}
              onChange={(color) =>
                handleColorChange("loadMoreTextColor", color)
              }
              clearable={true}
            />
          </div>
          <RangeControl
            label={__(
              "Taille du texte du bouton Load More (px)",
              "g2rd-portfolio-universel"
            )}
            value={styles.loadMoreFontSize || 16}
            onChange={(value) =>
              setAttributes({
                styles: { ...styles, loadMoreFontSize: value },
              })
            }
            min={10}
            max={24}
          />
          <RangeControl
            label={__(
              "Espacement interne du bouton Load More (px)",
              "g2rd-portfolio-universel"
            )}
            value={styles.loadMorePadding || 12}
            onChange={(value) =>
              setAttributes({
                styles: { ...styles, loadMorePadding: value },
              })
            }
            min={4}
            max={30}
          />
          <div style={{ marginTop: "1rem" }}>
            <p>
              {__(
                "Couleur de fond des boutons de pagination",
                "g2rd-portfolio-universel"
              )}
            </p>
            <ColorPalette
              colors={formattedColors}
              value={styles.paginationButtonBackground || undefined}
              onChange={(color) =>
                handleColorChange("paginationButtonBackground", color)
              }
              clearable={true}
            />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <p>
              {__(
                "Couleur du texte des boutons de pagination",
                "g2rd-portfolio-universel"
              )}
            </p>
            <ColorPalette
              colors={formattedColors}
              value={styles.paginationButtonTextColor || undefined}
              onChange={(color) =>
                handleColorChange("paginationButtonTextColor", color)
              }
              clearable={true}
            />
          </div>
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        <div className="g2rd-portfolio-universel-editor">
          <div className="portfolio-editor-header">
            <h3>
              {__("Portfolio Universel Filtrable", "g2rd-portfolio-universel")}
            </h3>
            <p>
              {__(
                "Ce bloc affichera un portfolio avec filtres dynamiques sur le front-end.",
                "g2rd-portfolio-universel"
              )}
            </p>
          </div>

          <div className="portfolio-editor-preview">
            {postTypes.length === 0 ? (
              <div className="portfolio-preview-empty">
                <p>
                  {__(
                    "Veuillez sélectionner au moins un type de contenu dans les paramètres du bloc.",
                    "g2rd-portfolio-universel"
                  )}
                </p>
              </div>
            ) : (
              <>
                {showFilters && (
                  <div className="portfolio-filters-container portfolio-editor-filters">
                    {loadingFilters ? (
                      <div className="portfolio-filters-loading">
                        <Spinner />
                        <span>
                          {__(
                            "Chargement des filtres...",
                            "g2rd-portfolio-universel"
                          )}
                        </span>
                      </div>
                    ) : (
                      <>
                        {showSearch && (
                          <div className="portfolio-filter portfolio-filter-search">
                            <input
                              type="text"
                              className="portfolio-search-input"
                              placeholder={__(
                                "Rechercher par titre ou contenu...",
                                "g2rd-portfolio-universel"
                              )}
                              disabled
                            />
                          </div>
                        )}

                        {showCategories &&
                          availableFilters &&
                          availableFilters.categories &&
                          availableFilters.categories.length > 0 && (
                            <div className="portfolio-filter portfolio-filter-categories">
                              <label>
                                {__("Catégories", "g2rd-portfolio-universel")}
                              </label>
                              <div className="portfolio-filter-buttons">
                                {availableFilters.categories
                                  .slice(0, 5)
                                  .map((cat) => (
                                    <button
                                      key={cat.id}
                                      className="portfolio-filter-button"
                                      disabled
                                    >
                                      {cat.name} ({cat.count})
                                    </button>
                                  ))}
                                {availableFilters.categories.length > 5 && (
                                  <span className="portfolio-filter-more">
                                    +{availableFilters.categories.length - 5}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                        {showTags &&
                          availableFilters &&
                          availableFilters.tags &&
                          availableFilters.tags.length > 0 && (
                            <div className="portfolio-filter portfolio-filter-tags">
                              <label>
                                {__("Tags", "g2rd-portfolio-universel")}
                              </label>
                              <div className="portfolio-filter-buttons">
                                {availableFilters.tags
                                  .slice(0, 5)
                                  .map((tag) => (
                                    <button
                                      key={tag.id}
                                      className="portfolio-filter-button"
                                      disabled
                                    >
                                      {tag.name} ({tag.count})
                                    </button>
                                  ))}
                                {availableFilters.tags.length > 5 && (
                                  <span className="portfolio-filter-more">
                                    +{availableFilters.tags.length - 5}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                        {showTaxonomies &&
                          availableFilters &&
                          availableFilters.taxonomies &&
                          Object.keys(availableFilters.taxonomies).length > 0 &&
                          Object.keys(availableFilters.taxonomies).map(
                            (taxSlug) => {
                              const tax = availableFilters.taxonomies[taxSlug];
                              if (!tax.terms || tax.terms.length === 0)
                                return null;
                              return (
                                <div
                                  key={taxSlug}
                                  className={`portfolio-filter portfolio-filter-taxonomy portfolio-filter-${taxSlug}`}
                                >
                                  <label>{tax.name}</label>
                                  <div className="portfolio-filter-buttons">
                                    {tax.terms.slice(0, 3).map((term) => (
                                      <button
                                        key={term.id}
                                        className="portfolio-filter-button"
                                        disabled
                                      >
                                        {term.name} ({term.count})
                                      </button>
                                    ))}
                                    {tax.terms.length > 3 && (
                                      <span className="portfolio-filter-more">
                                        +{tax.terms.length - 3}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          )}

                        {showDateFilter && (
                          <div className="portfolio-filter portfolio-filter-date">
                            <label>
                              {__("Date", "g2rd-portfolio-universel")}
                            </label>
                            <div className="portfolio-date-inputs">
                              <input
                                type="date"
                                className="portfolio-date-from"
                                placeholder={__(
                                  "De",
                                  "g2rd-portfolio-universel"
                                )}
                                disabled
                              />
                              <input
                                type="date"
                                className="portfolio-date-to"
                                placeholder={__(
                                  "À",
                                  "g2rd-portfolio-universel"
                                )}
                                disabled
                              />
                              <button className="portfolio-date-clear" disabled>
                                {__("Effacer", "g2rd-portfolio-universel")}
                              </button>
                            </div>
                          </div>
                        )}

                        {showAuthorFilter &&
                          availableFilters &&
                          availableFilters.authors &&
                          availableFilters.authors.length > 0 && (
                            <div className="portfolio-filter portfolio-filter-author">
                              <label>
                                {__("Auteur", "g2rd-portfolio-universel")}
                              </label>
                              <select
                                className="portfolio-author-select"
                                disabled
                              >
                                <option value="">
                                  {__(
                                    "Tous les auteurs",
                                    "g2rd-portfolio-universel"
                                  )}
                                </option>
                                {availableFilters.authors
                                  .slice(0, 10)
                                  .map((author) => (
                                    <option key={author.id} value={author.id}>
                                      {author.name}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          )}

                        <div className="portfolio-filter portfolio-filter-reset">
                          <button className="portfolio-reset-button" disabled>
                            {__(
                              "Réinitialiser les filtres",
                              "g2rd-portfolio-universel"
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div
                  className={`portfolio-items-container portfolio-${displayMode} portfolio-editor-items`}
                  style={{
                    gap: `${gap}px`,
                    ...(displayMode === "grid"
                      ? { gridTemplateColumns: `repeat(${columns}, 1fr)` }
                      : {}),
                  }}
                >
                  {loadingPreview ? (
                    <div className="portfolio-preview-loading">
                      <Spinner />
                      <p>
                        {__(
                          "Chargement de l'aperçu...",
                          "g2rd-portfolio-universel"
                        )}
                      </p>
                    </div>
                  ) : previewItems.length === 0 ? (
                    <div className="portfolio-preview-empty">
                      <p>
                        {__(
                          "Aucun contenu trouvé. Vérifiez que les types sélectionnés contiennent des publications.",
                          "g2rd-portfolio-universel"
                        )}
                      </p>
                    </div>
                  ) : (
                    previewItems.map((item) => (
                      <article
                        key={item.id}
                        className="portfolio-item portfolio-editor-item"
                      >
                        <div className="portfolio-item-image">
                          {item.featuredImage || item.featured_image ? (
                            <img
                              src={item.featuredImage || item.featured_image}
                              alt={
                                item.featuredImageAlt ||
                                item.featured_image_alt ||
                                item.title
                              }
                            />
                          ) : (
                            <div className="portfolio-item-image-placeholder">
                              {__("Image", "g2rd-portfolio-universel")}
                            </div>
                          )}
                        </div>
                        <div className="portfolio-item-content">
                          <h3 className="portfolio-item-title">{item.title}</h3>
                          {showExcerpt && item.excerpt && (
                            <div
                              className="portfolio-item-excerpt"
                              dangerouslySetInnerHTML={{ __html: item.excerpt }}
                            />
                          )}
                          <div className="portfolio-item-meta">
                            {showDate &&
                              (item.dateFormatted || item.date_formatted) && (
                                <span className="portfolio-item-date">
                                  {item.dateFormatted || item.date_formatted}
                                </span>
                              )}
                            {showAuthor && item.author && (
                              <span className="portfolio-item-author">
                                {item.author.name}
                              </span>
                            )}
                            {(item.priceHtml || item.price_html) && (
                              <span
                                className="portfolio-item-price"
                                dangerouslySetInnerHTML={{
                                  __html: item.priceHtml || item.price_html,
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </div>

                {paginationType === "pagination" && previewItems.length > 0 && (
                  <div className="portfolio-pagination-container portfolio-editor-pagination">
                    <div className="portfolio-pagination">
                      <button
                        className="portfolio-pagination-page active"
                        disabled
                      >
                        1
                      </button>
                      <span className="portfolio-pagination-dots">...</span>
                    </div>
                  </div>
                )}

                {paginationType === "load-more" && previewItems.length > 0 && (
                  <div className="portfolio-pagination-container portfolio-editor-pagination">
                    <button className="portfolio-load-more" disabled>
                      {loadMoreText ||
                        __("Charger plus", "g2rd-portfolio-universel")}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
