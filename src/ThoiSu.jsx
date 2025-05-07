import React, { useState, useEffect } from 'react';
import FeaturedSection2 from './components/FeaturedSection2.jsx';
import CategorySection from './components/CategorySection.jsx';

const API_BASE_URL = 'http://localhost:3000';

const ThoiSu = ({ previewCategory, setCurrentComponent }) => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const url = previewCategory
          ? `${API_BASE_URL}/api/subcategories?categoryId=${previewCategory.CategoryID}&t=${Date.now()}`
          : `${API_BASE_URL}/api/subcategories?t=${Date.now()}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch subcategories');
        }

        const validSubCategories = Array.isArray(data.data)
          ? data.data
              .filter(sub => !previewCategory || sub.categoryid === previewCategory.CategoryID)
              .map(sub => ({
                SubCategoryID: sub.subcategoryid,
                CategoryID: sub.categoryid,
                SubCategoryName: sub.subcategoryname,
                BannerURL: sub.bannerurl ? `${API_BASE_URL}${sub.bannerurl}` : null,
                CategoryName: sub.categoryname || (previewCategory ? previewCategory.CategoryName : 'Thời sự'),
              }))
          : [];

        setSubCategories(validSubCategories);
        setLoading(false);

        console.log('Fetched subcategories:', validSubCategories);
      } catch (err) {
        console.error('Error fetching subcategories:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [previewCategory]);

  const fetchNewsForCategory = async (subCategoryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/subcategory/${subCategoryId}/recent?t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch posts');
      }

      return Array.isArray(data.data)
        ? data.data.map(article => ({
            postid: article.postid,
            imageurl: article.imageurl ? `${API_BASE_URL}${article.imageurl}` : 'https://via.placeholder.com/240x144',
            title: article.title || 'Untitled',
            link: article.link || '#',
          }))
        : [];
    } catch (err) {
      console.error(`Error fetching posts for subcategory ${subCategoryId}:`, err);
      return [];
    }
  };

  const renderContent = () => {
    return (
      <>
        {previewCategory && (
          <FeaturedSection2
            categoryId={previewCategory.CategoryID}
            setCurrentComponent={setCurrentComponent}
          />
        )}
        
        {loading ? (
          <div>Loading subcategories...</div>
        ) : error ? (
          <div>Error loading subcategories: {error}</div>
        ) : subCategories.length > 0 ? (
          subCategories.map((subcategory, index) => (
            <CategorySectionWrapper
              key={subcategory.SubCategoryID || index}
              subCategoryId={subcategory.SubCategoryID}
              title={subcategory.SubCategoryName}
              fetchNews={fetchNewsForCategory}
              setCurrentComponent={setCurrentComponent}
            />
          ))
        ) : (
          <div>No subcategories available for this category.</div>
        )}
      </>
    );
  };

  const handleSubCategoryClick = (subCategory) => {
    setCurrentComponent('subCategory');
    const event = new CustomEvent('subCategorySelected', { detail: subCategory });
    window.dispatchEvent(event);
  };

  return (
    <div className="container-xl">
      <div id="main">
        {renderContent()}
      </div>
    </div>
  );
};

// Wrapper component to handle fetching articles for each CategorySection
const CategorySectionWrapper = ({ subCategoryId, title, fetchNews, setCurrentComponent }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const fetchedArticles = await fetchNews(subCategoryId);
        setArticles(fetchedArticles);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load articles');
        setLoading(false);
      }
    };

    loadArticles();
  }, [subCategoryId, fetchNews]);

  const defaultIcon = null;

  return (
    <>
      {loading ? (
        <div>Loading articles for {title}...</div>
      ) : error ? (
        <div>Error loading articles for {title}: {error}</div>
      ) : (
        <CategorySection
          title={title}
          icon={defaultIcon}
          articles={articles}
          setCurrentComponent={setCurrentComponent}
        />
      )}
    </>
  );
};

export default ThoiSu;