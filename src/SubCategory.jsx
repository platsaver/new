import React, { useState, useEffect } from 'react';
import CategorySection2 from './components/CategorySection2.jsx';
import Banner from './components/Banner.jsx';

const API_BASE_URL = 'http://localhost:3000'; // Adjust this if the backend is on a different port

const SubCategory = ({ subCategoryId, title, setCurrentComponent }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        console.log(`Fetching articles for subCategoryId: ${subCategoryId}`); // Debug log
        const response = await fetch(
          `${API_BASE_URL}/posts/subcategory/${subCategoryId}?t=${Date.now()}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          const mappedArticles = data.map(article => ({
            postid: article.postid,
            imageurl: article.mediaurl ? `${API_BASE_URL}${article.mediaurl}` : null, // Prepend API_BASE_URL to mediaurl
            title: article.title || 'Untitled',
            link: `#post-${article.postid}`,
          }));
          setArticles(mappedArticles);
        } else {
          throw new Error('Failed to load articles');
        }
      } catch (err) {
        console.error(`Error fetching articles for subcategory ${subCategoryId}:`, err);
        setError(err.message || 'Failed to load articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [subCategoryId]);

  const defaultIcon = null;

  if (loading) {
    return <div>Loading articles for {title}...</div>;
  }

  if (error) {
    return <div>Error loading articles for {title}: {error}</div>;
  }

  return (
    <div className="container-xl mx-auto" style={{ paddingBottom: "60px" }}>
      <CategorySection2
        title={title}
        icon={defaultIcon}
        articles={articles}
        setCurrentComponent={setCurrentComponent}
      />
    </div>
  );
};

export default SubCategory;