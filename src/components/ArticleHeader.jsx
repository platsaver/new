import React, { useState, useEffect } from 'react';

const ArticleHeader = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postID = localStorage.getItem('selectedPostID');
        if (!postID) {
          throw new Error('No post ID found in localStorage');
        }

        const response = await fetch(`http://localhost:3000/api/post/${postID}`);
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        setPost(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPost();
  }, []);

  if (loading) {
    return <div>Loading article header...</div>;
  }

  if (error || !post) {
    return <div>Error loading article header: {error || 'No data'}</div>;
  }

  return (
    <div className="col-md-12">
      {post.categories && post.categories.length > 0 && (
        <ul className="categories">
          {post.categories.map((category, index) => (
            <li key={index}>
              <a href="category.html" className="category">
                <span>{category}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
      <h1>{post.title}</h1>
      <p className="byline">
        By {post.author} <span className="timestamp">{post.timestamp}</span>
      </p>
    </div>
  );
};

export default ArticleHeader;