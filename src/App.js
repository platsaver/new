import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation.jsx';
import Footer from './components/Footer.jsx';
import { message } from 'antd';

const App = () => {
  const [currentComponent, setCurrentComponent] = useState('homepage');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]); // Ensure initial state is an array
  const [loading, setLoading] = useState(false);

  // Fetch categories from API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/categories?t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: Failed to fetch categories`);
      }

      const data = await response.json();
      const categoriesData = Array.isArray(data.categories) ? data.categories : [];

      const validCategories = categoriesData
        .filter((cat) => cat && cat.categoryid && cat.categoryname)
        .map((cat) => ({
          CategoryID: cat.categoryid,
          CategoryName: cat.categoryname,
          BannerURL: cat.bannerurl || null,
          subCategories: Array.isArray(cat.subcategories)
            ? cat.subcategories.map((sub) => ({
                SubCategoryID: sub.subcategoryid,
                CategoryID: sub.categoryid,
                SubCategoryName: sub.subcategoryname,
                BannerURL: sub.bannerurl || null,
              }))
            : [],
        }));

      setCategories(validCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      message.error(`Error fetching categories: ${error.message}`);
      setCategories([]); // Ensure categories is an array even on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories on mount and listen for updates
  useEffect(() => {
    fetchCategories();

    const handleCategoryUpdate = () => {
      fetchCategories();
    };

    window.addEventListener('categoryUpdated', handleCategoryUpdate);

    return () => {
      window.removeEventListener('categoryUpdated', handleCategoryUpdate);
    };
  }, []);

  return (
    <div className="App">
      <Navigation
        currentComponent={currentComponent}
        setCurrentComponent={setCurrentComponent}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories || []} // Ensure categories is always an array
        loading={loading}
      />
      {/* Other components */}
      <Footer
        categories={categories || []} // Ensure categories is always an array
        loading={loading}
        setCurrentComponent={setCurrentComponent}
        setSelectedCategory={setSelectedCategory}
      />
    </div>
  );
};

export default App;