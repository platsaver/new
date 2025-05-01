import React, { useState, useEffect } from 'react';
import FeaturedSection2 from './components/FeaturedSection2.jsx';
import CategorySection from './components/CategorySection.jsx';
import Banner from './components/Banner.jsx';

const ThoiSu = ({ previewCategory }) => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch subcategories
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const url = previewCategory
          ? `http://localhost:3000/api/subcategories?categoryId=${previewCategory.CategoryID}&t=${Date.now()}`
          : `http://localhost:3000/api/subcategories?t=${Date.now()}`;
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
                BannerURL: sub.bannerurl || null,
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

  // Generate mock news articles for subcategories
  const generateNewsForCategory = (categoryName) => {
    return [
      {
        imageUrl: "https://i1-vnexpress.vnecdn.net/2025/03/17/ae640bbd121aa344fa0b-174218577-4142-6528-1742185843.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=jKQ7WgLITYqJ_GIzCkHAaw",
        title: `${categoryName} - Tin tức 1`,
        link: "#"
      },
      {
        imageUrl: "https://i1-vnexpress.vnecdn.net/2025/03/16/z6316531565304-b93998f3eb029f4-8480-2428-1742140669.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=eD0BPeHJlJPeqGJOaGVszQ",
        title: `${categoryName} - Tin tức 2`,
        link: "#"
      },
      {
        imageUrl: "https://i1-vnexpress.vnecdn.net/2025/03/16/phoicanhkientruc-1742137749-3866-1742138502.png?w=240&h=144&q=100&dpr=2&fit=crop&s=wAsU4w9VOKCRrimOCckH1w",
        title: `${categoryName} - Tin tức 3`,
        link: "#"
      },
      {
        imageUrl: "https://i1-vnexpress.vnecdn.net/2025/03/16/fcdcd7a1273f9661cf2e-174212554-8326-4167-1742125678.jpg?w=240&h=144&q=100&dpr=2&fit=crop&s=Ns1MsOG8swGT7TIS-g1oHQ",
        title: `${categoryName} - Tin tức 4`,
        link: "#"
      }
    ];
  };

  // Render logic
  const renderContent = () => {
    return (
      <>
        {previewCategory && (
          <FeaturedSection2 categoryId={previewCategory.CategoryID} />
        )}
        
        {loading ? (
          <div>Loading subcategories...</div>
        ) : error ? (
          <div>Error loading subcategories: {error}</div>
        ) : subCategories.length > 0 ? (
          subCategories.map((subcategory, index) => (
            <CategorySection 
              key={subcategory.SubCategoryID || index}
              title={subcategory.SubCategoryName}
              articles={generateNewsForCategory(subcategory.SubCategoryName)}
            />
          ))
        ) : (
          <div>No subcategories available for this category.</div>
        )}
      </>
    );
  };

  return (
    <>
      <Banner category={previewCategory} />
      <div className="container-xl">
        <div id="main">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default ThoiSu;