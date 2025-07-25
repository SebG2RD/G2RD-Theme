import { __ } from "@wordpress/i18n";
import { useState, useEffect } from "@wordpress/element";
import { Button, Spinner, Notice } from "@wordpress/components";
// import apiFetch from "@wordpress/api-fetch"; // Temporarily commented out

export default function PostSelector({ contentType, selectedPosts, onSelect }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Temporarily disable fetching posts/pages/CPT
    if (contentType !== "images") {
      fetchPosts();
    }
  }, [contentType]);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    // Solution temporaire : afficher un message informatif
    setTimeout(() => {
      setLoading(false);
      setError(
        __(
          "La sélection de posts/pages sera disponible prochainement. Utilisez le type 'Images' pour l'instant.",
          "g2rd-carousel"
        )
      );
    }, 500);
  };

  const handlePostSelect = (post) => {
    const isSelected = selectedPosts.some((p) => p.id === post.id);
    let newSelection;

    if (isSelected) {
      newSelection = selectedPosts.filter((p) => p.id !== post.id);
    } else {
      newSelection = [...selectedPosts, post];
    }

    onSelect(newSelection);
  };

  const handleDeselectAll = () => {
    onSelect([]);
  };

  if (contentType === "images") {
    return null;
  }

  return (
    <div className="post-selector">
      {loading && (
        <div className="post-selector-loading">
          <Spinner />
          <p>{__("Loading content...", "g2rd-carousel")}</p>
        </div>
      )}

      {error && (
        <Notice status="warning" isDismissible={false}>
          <p>{error}</p>
          <Button isSmall onClick={fetchPosts}>
            {__("Retry", "g2rd-carousel")}
          </Button>
        </Notice>
      )}

      {!loading && !error && (
        <div className="post-selector-content">
          <p className="post-selector-description">
            {__("Select content to display in the carousel:", "g2rd-carousel")}
          </p>

          <div className="post-selector-grid">
            {posts.map((post) => {
              const isSelected = selectedPosts.some((p) => p.id === post.id);
              return (
                <div
                  key={post.id}
                  className={`post-selector-item ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() => handlePostSelect(post)}
                >
                  {post.featured_media && (
                    <div className="post-selector-image">
                      <img
                        src={post.featured_media_url}
                        alt={post.title.rendered}
                      />
                    </div>
                  )}
                  <div className="post-selector-info">
                    <h4
                      dangerouslySetInnerHTML={{
                        __html: post.title.rendered,
                      }}
                    />
                    <p
                      dangerouslySetInnerHTML={{
                        __html: post.excerpt.rendered,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {selectedPosts.length > 0 && (
            <div className="post-selector-selected">
              <h4>{__("Selected content:", "g2rd-carousel")}</h4>
              <div className="selected-posts">
                {selectedPosts.map((post) => (
                  <span key={post.id} className="selected-post">
                    {post.title.rendered}
                  </span>
                ))}
              </div>
              <Button isSmall onClick={handleDeselectAll}>
                {__("Deselect all", "g2rd-carousel")}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
