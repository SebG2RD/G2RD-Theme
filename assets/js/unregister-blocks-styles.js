wp.domReady(function () {
  wp.blocks.unregisterBlockStyle("core/button", "outline, fill");
  wp.blocks.unregisterBlockStyle("core/image", "rounded");
  wp.blocks.unregisterBlockStyle("core/core", "plain");
  wp.blocks.unregisterBlockStyle("core/site-logo", "rounded");
  wp.blocks.unregisterBlockStyle("core/separator", "dots");
  wp.blocks.unregisterBlockStyle("core/separator", "wide");
  wp.blocks.unregisterBlockStyle("core/social-link", "logos-only, pill-shape");
  wp.blocks.unregisterBlockStyle("core/tag-cloud", "outline");
});
