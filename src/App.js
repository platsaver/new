import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation.jsx';
import Footer from './components/Footer.jsx';
import SubCategory from './SubCategory.jsx';
import { message } from 'antd';

const App = () => {
  const [currentComponent, setCurrentComponent] = useState(() => {
    return localStorage.getItem('currentComponent') || 'homepage';
  });
  
  const [selectedCategory, setSelectedCategory] = useState(() => {
    try {
      const savedCategory = localStorage.getItem('selectedCategory');
      return savedCategory ? JSON.parse(savedCategory) : null;
    } catch (error) {
      console.error('Error parsing selectedCategory from localStorage:', error);
      localStorage.removeItem('selectedCategory');
      return null;
    }
  });
  
  const [selectedSubCategory, setSelectedSubCategory] = useState(() => {
    try {
      const savedSubCategory = localStorage.getItem('selectedSubCategory');
      return savedSubCategory ? JSON.parse(savedSubCategory) : null;
    } catch (error) {
      console.error('Error parsing selectedSubCategory from localStorage:', error);
      localStorage.removeItem('selectedSubCategory');
      return null;
    }
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (selectedSubCategory) {
      localStorage.setItem('selectedSubCategory', JSON.stringify(selectedSubCategory));
    } else {
      localStorage.removeItem('selectedSubCategory');
    }
  }, [selectedSubCategory]);

  const handleSetCurrentComponent = (component) => {
    setCurrentComponent(component);
  };

  const handleSetSelectedCategory = (category) => {
    setSelectedCategory(category);
  };

  const handleSetSelectedSubCategory = (subCategory) => {
    setSelectedSubCategory(subCategory);
  };

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

  useEffect(() => {
    fetchCategories();
    
    const handleCategoryUpdate = () => {
      fetchCategories();
    };
    
    const handleSubCategorySelected = (event) => {
      handleSetSelectedSubCategory(event.detail);
    };
    
    window.addEventListener('categoryUpdated', handleCategoryUpdate);
    window.addEventListener('subCategorySelected', handleSubCategorySelected);
    
    const handlePopState = () => {
      const savedComponent = localStorage.getItem('currentComponent') || 'homepage';
      let parsedCategory = null;
      let parsedSubCategory = null;
      
      try {
        const savedCategory = localStorage.getItem('selectedCategory');
        if (savedCategory) {
          parsedCategory = JSON.parse(savedCategory);
        }
      } catch (error) {
        console.error('Error parsing selectedCategory during navigation:', error);
        localStorage.removeItem('selectedCategory');
      }
      
      try {
        const savedSubCategory = localStorage.getItem('selectedSubCategory');
        if (savedSubCategory) {
          parsedSubCategory = JSON.parse(savedSubCategory);
        }
      } catch (error) {
        console.error('Error parsing selectedSubCategory during navigation:', error);
        localStorage.removeItem('selectedSubCategory');
      }
      
      setCurrentComponent(savedComponent);
      setSelectedCategory(parsedCategory);
      setSelectedSubCategory(parsedSubCategory);
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('categoryUpdated', handleCategoryUpdate);
      window.removeEventListener('subCategorySelected', handleSubCategorySelected);
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
        selectedSubCategory={selectedSubCategory}
        categories={categories || []}
        loading={loading}
      />
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