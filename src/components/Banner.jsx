import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3000';

const Banner = ({ category, onSubCategoryClick }) => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const url = category
          ? `http://localhost:3000/api/subcategories?categoryId=${category.CategoryID}&t=${Date.now()}`
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

        const validSubCategories = data.success && Array.isArray(data.data)
          ? data.data
              .filter(sub => !category || sub.categoryid === category.CategoryID)
              .map(sub => ({
                SubCategoryID: sub.subcategoryid,
                SubCategoryName: sub.subcategoryname,
                BannerURL: sub.bannerurl ? `${API_BASE_URL}${sub.bannerurl}` : null,
                slug: sub.subcategoryname
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/(^-|-$)/g, ''),
              }))
          : [];

        setSubCategories(validSubCategories);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching subcategories:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [category]);

  const categoryName = category ? category.CategoryName : 'Thời sự';
  const defaultBannerUrl = 'https://via.placeholder.com/1200x300?text=No+Banner';
  const bannerUrl = category && category.BannerURL
    ? `${API_BASE_URL}${category.BannerURL}`
    : subCategories.length > 0 && subCategories[0].BannerURL
    ? subCategories[0].BannerURL
    : defaultBannerUrl;

  return (
    <>
      <div
        className="position-relative text-center text-white py-5"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${bannerUrl}') center/cover no-repeat`,
        }}
      >
        <h1 className="display-3 fw-bold">{categoryName}</h1>
      </div>
      <nav className="bg-dark bg-opacity-100">
        <ul className="nav justify-content-center">
          {loading ? (
            <li className="nav-item" style={{ margin: '0 15px' }}>
              <span className="nav-link text-white" style={{ padding: '10px 15px' }}>
                Loading...
              </span>
            </li>
          ) : error ? (
            <li className="nav-item" style={{ margin: '0 15px' }}>
              <span className="nav-link text-white" style={{ padding: '10px 15px' }}>
                Error: {error}
              </span>
            </li>
          ) : subCategories.length > 0 ? (
            subCategories.map((subCategory, index) => (
              <li key={subCategory.SubCategoryID || index} className="nav-item" style={{ margin: '0 15px' }}>
                <a
                  className={`nav-link ${index === 0 ? 'active' : ''} text-white`}
                  href="#"
                  style={{ padding: '10px 15px' }}
                  onClick={(e) => {
                    e.preventDefault();
                    if (onSubCategoryClick) onSubCategoryClick(subCategory);
                  }}
                >
                  {subCategory.SubCategoryName}
                </a>
              </li>
            ))
          ) : null}
        </ul>
      </nav>
    </>
  );
};

export default Banner;