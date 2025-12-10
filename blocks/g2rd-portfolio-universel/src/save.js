import { useBlockProps } from "@wordpress/block-editor";

/**
 * Encode de manière sécurisée un objet en JSON pour un attribut data
 *
 * @param {Object} data - L'objet à encoder
 * @returns {string} JSON encodé de manière sécurisée
 */
function safeJsonEncode(data) {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error("G2RD Portfolio: Error encoding JSON", error);
    return JSON.stringify({});
  }
}

export default function Save({ attributes }) {
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

  const blockProps = useBlockProps.save({
    className: "g2rd-portfolio-universel",
  });

  // Générer les styles CSS dynamiques
  const generateStyles = () => {
    const styleRules = [];
    // Générer un ID unique basé sur les attributs du bloc
    const blockIdHash = JSON.stringify({
      postTypes,
      displayMode,
      styles,
    })
      .split("")
      .reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
      }, 0);
    const blockId = `portfolio-${Math.abs(blockIdHash).toString(36)}`;

    if (styles.filtersBackground) {
      styleRules.push(
        `.${blockId} .portfolio-filters-container { background-color: ${styles.filtersBackground} !important; }`
      );
    }
    if (styles.filtersTitleColor) {
      styleRules.push(
        `.${blockId} .portfolio-filter label { color: ${styles.filtersTitleColor} !important; }`
      );
    }
    if (styles.filtersTitleSize) {
      styleRules.push(
        `.${blockId} .portfolio-filter label { font-size: ${styles.filtersTitleSize}px !important; }`
      );
    }
    if (styles.filterButtonBackground) {
      styleRules.push(
        `.${blockId} .portfolio-filter-button { background-color: ${styles.filterButtonBackground} !important; }`
      );
    }
    if (styles.filterButtonTextColor) {
      styleRules.push(
        `.${blockId} .portfolio-filter-button { color: ${styles.filterButtonTextColor} !important; }`
      );
    }
    if (styles.filterButtonActiveBackground) {
      styleRules.push(
        `.${blockId} .portfolio-filter-button.active { background-color: ${styles.filterButtonActiveBackground} !important; }`
      );
    }
    if (styles.filtersGap) {
      styleRules.push(
        `.${blockId} .portfolio-filters-container { gap: ${styles.filtersGap}px !important; }`
      );
    }
    if (styles.searchBackground) {
      styleRules.push(
        `.${blockId} .portfolio-search-input { background-color: ${styles.searchBackground} !important; }`
      );
    }
    if (styles.searchTextColor) {
      styleRules.push(
        `.${blockId} .portfolio-search-input { color: ${styles.searchTextColor} !important; }`
      );
    }
    if (styles.searchBorderColor) {
      styleRules.push(
        `.${blockId} .portfolio-search-input { border-color: ${styles.searchBorderColor} !important; }`
      );
    }
    if (styles.searchFontSize) {
      styleRules.push(
        `.${blockId} .portfolio-search-input { font-size: ${styles.searchFontSize}px !important; }`
      );
    }
    if (styles.searchPadding) {
      styleRules.push(
        `.${blockId} .portfolio-search-input { padding: ${styles.searchPadding}px !important; }`
      );
    }
    if (styles.cardBackground) {
      styleRules.push(
        `.${blockId} .portfolio-item { background-color: ${styles.cardBackground} !important; }`
      );
    }
    if (styles.postTitleColor) {
      styleRules.push(
        `.${blockId} .portfolio-item-title { color: ${styles.postTitleColor} !important; }`
      );
    }
    if (styles.postTitleSize) {
      styleRules.push(
        `.${blockId} .portfolio-item-title { font-size: ${styles.postTitleSize}px !important; }`
      );
    }
    if (styles.postTextColor) {
      styleRules.push(
        `.${blockId} .portfolio-item-excerpt, .${blockId} .portfolio-item-content { color: ${styles.postTextColor} !important; }`
      );
    }
    if (styles.postTextSize) {
      styleRules.push(
        `.${blockId} .portfolio-item-excerpt, .${blockId} .portfolio-item-content { font-size: ${styles.postTextSize}px !important; }`
      );
    }
    if (styles.cardPadding) {
      styleRules.push(
        `.${blockId} .portfolio-item-content { padding: ${styles.cardPadding}px !important; }`
      );
    }
    if (styles.loadMoreBackground) {
      styleRules.push(
        `.${blockId} .portfolio-load-more { background-color: ${styles.loadMoreBackground} !important; }`
      );
    }
    if (styles.loadMoreTextColor) {
      styleRules.push(
        `.${blockId} .portfolio-load-more { color: ${styles.loadMoreTextColor} !important; }`
      );
    }
    if (styles.loadMoreFontSize) {
      styleRules.push(
        `.${blockId} .portfolio-load-more { font-size: ${styles.loadMoreFontSize}px !important; }`
      );
    }
    if (styles.loadMorePadding) {
      styleRules.push(
        `.${blockId} .portfolio-load-more { padding: ${
          styles.loadMorePadding
        }px ${styles.loadMorePadding * 1.5}px !important; }`
      );
    }
    if (styles.paginationButtonBackground) {
      styleRules.push(
        `.${blockId} .portfolio-pagination-page, .${blockId} .portfolio-pagination-prev, .${blockId} .portfolio-pagination-next { background-color: ${styles.paginationButtonBackground} !important; }`
      );
    }
    if (styles.paginationButtonTextColor) {
      styleRules.push(
        `.${blockId} .portfolio-pagination-page, .${blockId} .portfolio-pagination-prev, .${blockId} .portfolio-pagination-next { color: ${styles.paginationButtonTextColor} !important; }`
      );
    }

    return { blockId, styleRules: styleRules.join("\n") };
  };

  const { blockId, styleRules } = generateStyles();

  // Configuration pour le JavaScript frontend
  const config = {
    postTypes: postTypes || ["post"],
    includeWooCommerce: includeWooCommerce || false,
    displayMode: displayMode || "grid",
    itemsPerPage: itemsPerPage || 12,
    paginationType: paginationType || "load-more",
    showFilters: showFilters !== false,
    showSearch: showSearch !== false,
    showCategories: showCategories !== false,
    showTags: showTags !== false,
    showTaxonomies: showTaxonomies !== false,
    showDateFilter: showDateFilter !== false,
    showAuthorFilter: showAuthorFilter !== false,
    linkType: linkType || "modal",
    columns: columns || 3,
    showExcerpt: showExcerpt !== false,
    showDate: showDate !== false,
    showAuthor: showAuthor || false,
    imageAspectRatio: imageAspectRatio || "16/9",
    gap: gap || 20,
    orderBy: orderBy || "date",
    order: order || "DESC",
    loadMoreText: loadMoreText || "Charger plus",
    styles: styles || {},
  };

  return (
    <>
      {styleRules && <style dangerouslySetInnerHTML={{ __html: styleRules }} />}
      <div
        {...blockProps}
        className={`g2rd-portfolio-universel ${blockId}`}
        data-config={safeJsonEncode(config)}
      >
        <div className="portfolio-container">
          {/* Les filtres et le contenu seront générés dynamiquement par le JavaScript frontend */}
          <div className="portfolio-filters-container"></div>
          <div className="portfolio-items-container"></div>
          <div className="portfolio-pagination-container"></div>
        </div>
      </div>
    </>
  );
}
