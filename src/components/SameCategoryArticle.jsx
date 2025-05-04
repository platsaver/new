import React, { useState, useEffect } from 'react';
import { message, Spin } from 'antd';

const SameCategoryArticle = ({ setCurrentComponent }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      const postID = localStorage.getItem('selectedPostID');
      if (!postID) {
        setError('No post selected');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/related-posts/${postID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}: Failed to fetch related posts`);
        }

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch related posts');
        }

        setArticles(data.data.map(post => ({
          postid: post.postid,
          imgSrc: post.imageurl,
          alt: post.title,
          title: post.title,
          href: `#post-${post.postid}`
        })));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching related posts:', err);
        setError(err.message);
        setLoading(false);
        message.error(`Error fetching related posts: ${err.message}`);
      }
    };

    fetchRelatedPosts();
  }, []);

  const handleArticleClick = (postId) => {
    localStorage.setItem('selectedPostID', postId);
    setCurrentComponent('articleDetail');
    window.dispatchEvent(new Event('articleSelected'));
  };

  if (loading) {
    return (
      <div className="same-category-section text-center p-4">
        <Spin size="large" />
        <p>Loading related articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="same-category-section">
        <h3><span>Cùng chuyên mục</span></h3>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!articles.length) {
    return (
      <div className="same-category-section">
        <h3><span>Cùng chuyên mục</span></h3>
        <p>No related articles found.</p>
      </div>
    );
  }

  return (
    <div className="same-category-section">
      <h3><span>Cùng chuyên mục</span></h3>
      <div className="same-category-container">
        {articles.map((article, index) => (
          <div className="same-category-item" key={index}>
            <a
              href={article.href}
              onClick={(e) => {
                e.preventDefault();
                handleArticleClick(article.postid);
              }}
            >
              <img src={article.imgSrc} alt={article.alt} />
              <h4>{article.title}</h4>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SameCategoryArticle;