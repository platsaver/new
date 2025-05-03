import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation.jsx';
import Footer from './components/Footer.jsx';
import { message } from 'antd';

const App = () => {
  // Initialize state from localStorage or default values
  const [currentComponent, setCurrentComponent] = useState(() => {
    return localStorage.getItem('currentComponent') || 'homepage';
  });
  
  const [selectedCategory, setSelectedCategory] = useState(() => {
    try {
      const savedCategory = localStorage.getItem('selectedCategory');
      return savedCategory ? JSON.parse(savedCategory) : null;
    } catch (error) {
      console.error('Error parsing selectedCategory from localStorage:', error);
      localStorage.removeItem('selectedCategory'); // Remove invalid data
      return null;
    }
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem('currentComponent', currentComponent);
  }, [currentComponent]);

  useEffect(() => {
    if (selectedCategory) {
      localStorage.setItem('selectedCategory', JSON.stringify(selectedCategory));
    } else {
      localStorage.removeItem('selectedCategory');
    }
  }, [selectedCategory]);

  // Custom state setters that update both state and localStorage
  const handleSetCurrentComponent = (component) => {
    setCurrentComponent(component);
  };

  const handleSetSelectedCategory = (category) => {
    setSelectedCategory(category);
  };

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
      setCategories([]);
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
    
    // Handle browser navigation (back/forward buttons)
    const handlePopState = () => {
      const savedComponent = localStorage.getItem('currentComponent') || 'homepage';
      let parsedCategory = null;
      
      try {
        const savedCategory = localStorage.getItem('selectedCategory');
        if (savedCategory) {
          parsedCategory = JSON.parse(savedCategory);
        }
      } catch (error) {
        console.error('Error parsing selectedCategory during navigation:', error);
        localStorage.removeItem('selectedCategory'); // Remove invalid data
      }
      
      setCurrentComponent(savedComponent);
      setSelectedCategory(parsedCategory);
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('categoryUpdated', handleCategoryUpdate);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div className="App">
      <Navigation
        currentComponent={currentComponent}
        setCurrentComponent={handleSetCurrentComponent}
        selectedCategory={selectedCategory}
        setSelectedCategory={handleSetSelectedCategory}
        categories={categories || []}
        loading={loading}
      />
      {/* Other components */}
      <Footer
        categories={categories || []}
        loading={loading}
        setCurrentComponent={handleSetCurrentComponent}
        setSelectedCategory={handleSetSelectedCategory}
      />
    </div>
  );
};

export default App;