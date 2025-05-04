import React, { useState, useEffect } from "react";

const RelatedArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      const postID = localStorage.getItem("selectedPostID"); // Fetch postID from localStorage
      if (!postID) {
        setError("No post selected");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/posts/${postID}/related`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data.success) {
          setArticles(data.data);
        } else {
          setError(data.message || "Failed to load related articles");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedArticles(); // Call the function
  }, []); // Empty dependency array for one-time fetch on mount

  if (loading) {
    return <div>Loading related articles...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (articles.length === 0) {
    return <div>No related articles found</div>;
  }

  return (
    <div className="col-md-4">
      <aside className="related-articles">
        <h3>Có thể bạn quan tâm</h3>
        <hr />
        <ul className="related-list">
          {articles.map((article) => (
            <li key={article.postid}>
              <a href={`/post/${article.postid}`} className="related-item">
                <img
                  src={`http://localhost:3000${article.imageurl}`}
                  alt={article.title}
                  className="related-thumbnail"
                />
                <span>{article.title}</span>
              </a>
            </li>
          ))}
        </ul>
        <a href="/" className="back-to-home">
          <box-icon
            name="chevron-left"
            style={{ width: 20, height: 20, verticalAlign: "middle" }}
          ></box-icon>
          QUAY LẠI TRANG CHỦ
        </a>
      </aside>
    </div>
  );
};

export default RelatedArticles;