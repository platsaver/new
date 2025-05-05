import React, { useState, useEffect } from 'react';

const Banner = ({ category }) => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch subcategories based on category
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        // If a category is provided, fetch subcategories for that category
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

        // Process subcategories from the API response
        const validSubCategories = data.success && Array.isArray(data.data)
          ? data.data
              .filter(sub => !category || sub.categoryid === category.CategoryID)
              .map(sub => ({
                  SubCategoryID: sub.subcategoryid,
                  SubCategoryName: sub.subcategoryname,
                  BannerURL: sub.bannerurl || null,
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
  }, [category]); // Re-fetch when category changes

  // Use category name or default to "Thời sự"
  const categoryName = category ? category.CategoryName : 'Thời sự';

  // Get the banner URL from the first subcategory, or fallback to the default Unsplash URL
  const defaultBannerUrl = '';
  const bannerUrl = subCategories.length > 0 && subCategories[0].BannerURL
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
                  style={{ padding: '10px 15px' }}
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