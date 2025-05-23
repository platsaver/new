import React, { useState, useEffect } from 'react';
import FeaturedSection2 from './components/FeaturedSection2.jsx';
import CategorySection from './components/CategorySection.jsx';

const API_BASE_URL = 'http://localhost:3000';

const ThoiSu = ({ previewCategory, setCurrentComponent }) => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchSubCategories();

    // Thiết lập kết nối SSE
    const source = new EventSource(`${API_BASE_URL}/events`);

    // Category events
    source.addEventListener('categoryCreated', (event) => {
      try {
        const newCategory = JSON.parse(event.data);
        if (!previewCategory || newCategory.categoryId === previewCategory.CategoryID) {
          fetchSubCategories(); // Refetch to include any new subcategories under this category
        }
      } catch (err) {
        console.error('Error parsing categoryCreated event:', err);
      }
    });

    source.addEventListener('categoryUpdated', (event) => {
      try {
        const updatedCategory = JSON.parse(event.data);
        if (!previewCategory || updatedCategory.categoryId === previewCategory.CategoryID) {
          fetchSubCategories(); // Refetch to update category name in subcategories
        }
      } catch (err) {
        console.error('Error parsing categoryUpdated event:', err);
      }
    });

    source.addEventListener('categoryDeleted', (event) => {
      try {
        const { categoryId } = JSON.parse(event.data);
        if (!previewCategory || categoryId === previewCategory.CategoryID) {
          setSubCategories((prev) => prev.filter((sub) => sub.CategoryID !== categoryId));
        }
      } catch (err) {
        console.error('Error parsing categoryDeleted event:', err);
      }
    });

    // Subcategory events
    source.addEventListener('subcategoryCreated', (event) => {
      console.log('Received subcategoryCreated event:', event.data);
      try {
        const newSubcategory = JSON.parse(event.data);
        console.log('Parsed subcategory:', newSubcategory);
        if (!previewCategory || newSubcategory.categoryId === previewCategory.CategoryID) {
          console.log('Adding subcategory to state:', newSubcategory);
          setSubCategories((prev) => [
            ...prev,
            {
              SubCategoryID: newSubcategory.subCategoryId,
              CategoryID: newSubcategory.categoryId,
              SubCategoryName: newSubcategory.subCategoryName,
              BannerURL: newSubcategory.bannerUrl ? `${API_BASE_URL}${newSubcategory.bannerUrl}` : null,
              CategoryName: previewCategory ? previewCategory.CategoryName : 'Thời sự'
            }
          ]);
        } else {
          console.log('Subcategory filtered out:', newSubcategory, previewCategory);
        }
      } catch (err) {
        console.error('Error parsing subcategoryCreated event:', err);
      }
    });

    source.addEventListener('subcategoryUpdated', (event) => {
      try {
        const updatedSubcategory = JSON.parse(event.data);
        if (!previewCategory || updatedSubcategory.categoryId === previewCategory.CategoryID) {
          setSubCategories((prev) =>
            prev.map((sub) =>
              sub.SubCategoryID === updatedSubcategory.subCategoryId
                ? {
                    ...sub,
                    CategoryID: updatedSubcategory.categoryId,
                    SubCategoryName: updatedSubcategory.subCategoryName,
                    BannerURL: updatedSubcategory.bannerUrl ? `${API_BASE_URL}${updatedSubcategory.bannerUrl}` : null
                  }
                : sub
            )
          );
        }
      } catch (err) {
        console.error('Error parsing subcategoryUpdated event:', err);
      }
    });

    source.addEventListener('subcategoryDeleted', (event) => {
      try {
        const { subCategoryId } = JSON.parse(event.data);
        setSubCategories((prev) => prev.filter((sub) => sub.SubCategoryID !== subCategoryId));
      } catch (err) {
        console.error('Error parsing subcategoryDeleted event:', err);
      }
    });

    source.onerror = () => {
      console.error('SSE connection error');
    };

    return () => {
      source.close();
    };
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

  useEffect(() => {
    loadArticles();

    // Thiết lập kết nối SSE cho bài viết
    const source = new EventSource(`${API_BASE_URL}/events`);

    source.addEventListener('postCreated', (event) => {
      try {
        const newPost = JSON.parse(event.data);
        if (newPost.subcategoryid === subCategoryId && newPost.status === 'Published') {
          loadArticles(); // Refetch articles to include the new post
        }
      } catch (err) {
        console.error('Error parsing postCreated event:', err);
      }
    });

    source.addEventListener('postUpdated', (event) => {
      try {
        const updatedPost = JSON.parse(event.data);
        const isInCurrentArticles = articles.some((article) => article.postid === updatedPost.id);
        if ((isInCurrentArticles || updatedPost.status === 'Published') && updatedPost.subcategoryid === subCategoryId) {
          loadArticles(); // Refetch articles to reflect the update
        }
      } catch (err) {
        console.error('Error parsing postUpdated event:', err);
      }
    });

    source.onerror = () => {
      console.error('SSE connection error');
    };

    return () => {
      source.close();
    };
  }, [subCategoryId, fetchNews, articles]);

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