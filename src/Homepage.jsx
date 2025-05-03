import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Footer from './components/Footer.jsx';
import CategorySection from './components/CategorySection.jsx';
import FeaturedSection1 from './components/FeaturedSection1.jsx';
import LatestSection from './components/LatestSection.jsx';

const NewsApp = ({ setCurrentComponent }) => {
  const [businessArticles, setBusinessArticles] = useState([]);
  const [realEstateArticles, setRealEstateArticles] = useState([]);
  const [lawArticles, setLawArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const CATEGORY_IDS = {
    NEWS: 1,
    BUSINESS: 2,
    REAL_ESTATE: 3,
    LAW: 4
  };

  useEffect(() => {
    const fetchCategoryArticles = async (categoryId, setStateFunction) => {
      try {
        const response = await fetch(`http://localhost:3000/api/featured-posts/category/${categoryId}`);
        if (!response.ok) {
          throw new Error(`Error fetching category ${categoryId}: ${response.statusText}`);
        }
        const data = await response.json();
        setStateFunction(data);
      } catch (err) {
        console.error(`Failed to fetch category ${categoryId}:`, err);
        setError(err.message);
        setStateFunction([
          {
            imageUrl: "https://via.placeholder.com/240x144",
            title: "Unable to load articles",
            link: "#"
          }
        ]);
      }
    };

    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchCategoryArticles(CATEGORY_IDS.BUSINESS, setBusinessArticles),
          fetchCategoryArticles(CATEGORY_IDS.REAL_ESTATE, setRealEstateArticles),
          fetchCategoryArticles(CATEGORY_IDS.LAW, setLawArticles)
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (isLoading) {
    return <div className="container-xl text-center mt-5"><h2>Loading content...</h2></div>;
  }

  if (error) {
    console.error("Error loading data:", error);
  }

  return (
    <>
      <div className="container-xl">
        <div id="main">
          <FeaturedSection1 setCurrentComponent={setCurrentComponent} />
          
          <CategorySection 
            title="Kinh doanh" 
            icon={<box-icon name="candles" color="red"></box-icon>} 
            articles={businessArticles} 
          />
          
          <CategorySection 
            title="Bất Động Sản" 
            icon={<box-icon name="building-house" type="solid" color="red"></box-icon>} 
            articles={realEstateArticles} 
          />
          
          <CategorySection 
            title="Pháp Luật" 
            icon={<box-icon type="solid" name="briefcase-alt" color="red"></box-icon>} 
            articles={lawArticles} 
          />
          
          <LatestSection />
        </div>
      </div>
    </>
  );
};

export default NewsApp;