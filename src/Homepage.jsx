import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import CategorySection from './components/CategorySection.jsx';
import FeaturedSection1 from './components/FeaturedSection1.jsx';
import LatestSection from './components/LatestSection.jsx';

const API_BASE_URL = 'http://localhost:3000';

const NewsApp = ({ setCurrentComponent,theme }) => {
  const [businessArticles, setBusinessArticles] = useState([]);
  const [realEstateArticles, setRealEstateArticles] = useState([]);
  const [lawArticles, setLawArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageRefreshKey, setImageRefreshKey] = useState(Date.now());

  const CATEGORY_IDS = {
    NEWS: 1,
    BUSINESS: 2,
    REAL_ESTATE: 3,
    LAW: 4
  };

  const fetchCategoryArticles = async (categoryId, setStateFunction, imageRefreshKey) => {
    try {
      console.log(`Fetching articles for category ${categoryId}`);
      const response = await fetch(`${API_BASE_URL}/api/featured-posts/category/${categoryId}?t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (!response.ok) {
        throw new Error(`Error fetching category ${categoryId}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(`Fetched articles for category ${categoryId}:`, data);
      const articlesWithCacheBusting = Array.isArray(data)
        ? data.map(article => ({
            ...article,
            imageUrl: article.imageUrl ? `${article.imageUrl}?t=${imageRefreshKey}` : 'https://via.placeholder.com/240x144'
          }))
        : [{
            imageUrl: 'https://via.placeholder.com/240x144?t=${imageRefreshKey}',
            title: 'Unable to load articles',
            link: '#'
          }];
      setStateFunction(articlesWithCacheBusting);
    } catch (err) {
      console.error(`Failed to fetch category ${categoryId}:`, err);
      setError(err.message);
      setStateFunction([{
        imageUrl: 'https://via.placeholder.com/240x144?t=${imageRefreshKey}',
        title: 'Unable to load articles',
        link: '#'
      }]);
    }
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchCategoryArticles(CATEGORY_IDS.BUSINESS, setBusinessArticles, imageRefreshKey),
        fetchCategoryArticles(CATEGORY_IDS.REAL_ESTATE, setRealEstateArticles, imageRefreshKey),
        fetchCategoryArticles(CATEGORY_IDS.LAW, setLawArticles, imageRefreshKey)
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    const source = new EventSource(`${API_BASE_URL}/events`);

    source.addEventListener('postCreated', (event) => {
      const newPost = JSON.parse(event.data);
      console.log('postCreated event data:', newPost);
      if (newPost.categoryid && [CATEGORY_IDS.BUSINESS, CATEGORY_IDS.REAL_ESTATE, CATEGORY_IDS.LAW].includes(newPost.categoryid) && newPost.status === 'Published') {
        console.log(`Refetching articles for category ${newPost.categoryid} due to postCreated event`);
        fetchCategoryArticles(
          newPost.categoryid,
          newPost.categoryid === CATEGORY_IDS.BUSINESS ? setBusinessArticles :
          newPost.categoryid === CATEGORY_IDS.REAL_ESTATE ? setRealEstateArticles :
          setLawArticles,
          imageRefreshKey
        );
      }
    });

    source.addEventListener('postUpdated', (event) => {
      const updatedPost = JSON.parse(event.data);
      console.log('postUpdated event data:', updatedPost);
      if (updatedPost.categoryid && [CATEGORY_IDS.BUSINESS, CATEGORY_IDS.REAL_ESTATE, CATEGORY_IDS.LAW].includes(updatedPost.categoryid)) {
        console.log(`Refetching articles for category ${updatedPost.categoryid} due to postUpdated event`);
        fetchCategoryArticles(
          updatedPost.categoryid,
          updatedPost.categoryid === CATEGORY_IDS.BUSINESS ? setBusinessArticles :
          updatedPost.categoryid === CATEGORY_IDS.REAL_ESTATE ? setRealEstateArticles :
          setLawArticles,
          imageRefreshKey
        );
      }
    });

    source.addEventListener('mediaUpdated', (event) => {
      const updatedMedia = JSON.parse(event.data);
      console.log('mediaUpdated event data from API:', updatedMedia);
      fetch(`${API_BASE_URL}/posts/${updatedMedia.postId}`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`Error fetching post ${updatedMedia.postId}: ${res.statusText}`);
          }
          return res.json();
        })
        .then(post => {
          console.log(`Fetched post ${updatedMedia.postId} for mediaUpdated:`, post);
          if (post.categoryid && [CATEGORY_IDS.BUSINESS, CATEGORY_IDS.REAL_ESTATE, CATEGORY_IDS.LAW].includes(post.categoryid)) {
            console.log(`Refetching articles for category ${post.categoryid} due to mediaUpdated event for post ${updatedMedia.postId}`);
            fetchCategoryArticles(
              post.categoryid,
              post.categoryid === CATEGORY_IDS.BUSINESS ? setBusinessArticles :
              post.categoryid === CATEGORY_IDS.REAL_ESTATE ? setRealEstateArticles :
              setLawArticles,
              Date.now()
            );
          }
        })
        .catch(err => console.error('Error fetching post for mediaUpdated:', err));
      setImageRefreshKey(Date.now());
    });

    source.addEventListener('postDeleted', (event) => {
      const deletedPost = JSON.parse(event.data);
      console.log('postDeleted event data:', deletedPost);
      console.log(`Refetching all categories due to postDeleted event for post ${deletedPost.postId}`);
      fetchAllData();
    });

    source.onerror = () => {
      console.error('SSE connection error');
    };

    return () => {
      source.close();
    };
  }, [imageRefreshKey]);

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
            setCurrentComponent={setCurrentComponent}
          />
          
          <CategorySection 
            title="Bất Động Sản" 
            icon={<box-icon name="building-house" type="solid" color="red"></box-icon>} 
            articles={realEstateArticles}
            setCurrentComponent={setCurrentComponent}
          />
          
          <CategorySection 
            title="Pháp Luật" 
            icon={<box-icon type="solid" name="briefcase-alt" color="red"></box-icon>} 
            articles={lawArticles}
            setCurrentComponent={setCurrentComponent}
          />
          
          <LatestSection setCurrentComponent={setCurrentComponent} theme={theme}/>
        </div>
      </div>
    </>
  );
};

export default NewsApp;