import React, { useState, useEffect } from "react";
import { message, Spin } from 'antd';

const RelatedArticles = ({ setCurrentComponent, theme }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      const postID = localStorage.getItem("selectedPostID");
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

    fetchRelatedArticles();
  }, []);

  const handleArticleClick = (postId) => {
    localStorage.setItem('selectedPostID', postId);
    setCurrentComponent('articleDetail');
    window.dispatchEvent(new Event('articleSelected'));
  };

  if (loading) {
    return <div className="text-center text-dark">Loading related articles...</div>;
  }

  if (error) {
    return <div className="text-danger">Error: {error}</div>;
  }

  if (articles.length === 0) {
    return <div className="text-muted">No related articles found</div>;
  }

  return (
    <div className="col-md-4">
      <aside className="related-articles bg-light dark:bg-dark p-3 rounded">
        <h3 style={{ color: "red !important" }}>Có thể bạn quan tâm</h3>
        <hr className="border-dark dark:border-light" />
        <ul className="related-list list-unstyled">
          {articles.map((article) => (
            <li key={article.postid}>
              <a
                className="related-item d-flex align-items-center text-dark dark:text-light hover:text-primary dark:hover:text-primary"
                href={`#post-${article.postid}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleArticleClick(article.postid);
                }}
              >
                <img
                  src={`http://localhost:3000${article.imageurl}`}
                  alt={article.title}
                  className="related-thumbnail me-2"
                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                />
                <span className={theme === 'light' ? 'text-dark' : 'text-light'}>{article.title}</span>
              </a>
            </li>
          ))}
        </ul>
        <a
          href="/"
          className="back-to-home text-dark dark:text-light d-flex align-items-center mt-3"
          onClick={(e) => {
            e.preventDefault();
            setCurrentComponent('homepage');
          }}
        >
          <box-icon
            name="chevron-left"
            style={{ width: 20, height: 20, verticalAlign: "middle" }}
          ></box-icon>
          <span style={{color: 'red'}}>QUAY LẠI TRANG CHỦ</span>
        </a>
      </aside>
    </div>
  );
};

export default RelatedArticles;