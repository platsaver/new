import React, { useState, useEffect } from 'react';
import CategorySection2 from './components/CategorySection2.jsx';

const API_BASE_URL = 'http://localhost:3000';

const SubCategory = ({ subCategoryId, title, setCurrentComponent }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticles = async () => {
    try {
      console.log(`Fetching articles for subCategoryId: ${subCategoryId}`);
      const response = await fetch(
        `${API_BASE_URL}/posts/subcategory/${subCategoryId}?t=${Date.now()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        const mappedArticles = data.map(article => ({
          postid: article.postid,
          imageurl: article.mediaurl ? `${API_BASE_URL}${article.mediaurl}?t=${Date.now()}` : 'https://via.placeholder.com/240x144',
          title: article.title || 'Untitled',
          link: `#post-${article.postid}`,
        }));
        setArticles(mappedArticles);
      } else {
        throw new Error('Failed to load articles');
      }
    } catch (err) {
      console.error(`Error fetching articles for subcategory ${subCategoryId}:`, err);
      setError(err.message || 'Failed to load articles');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300); // Minimum loading time to prevent flickering
    }
  };

  useEffect(() => {
    fetchArticles();

    const source = new EventSource(`${API_BASE_URL}/events`);

    source.addEventListener('postCreated', (event) => {
      const newPost = JSON.parse(event.data);
      console.log('postCreated event data:', newPost);
      console.log('Checking if newPost.subcategoryid matches subCategoryId:', newPost.subcategoryid, subCategoryId);
      if (newPost.subcategoryid === subCategoryId && newPost.status === 'Published') {
        console.log('postCreated condition passed, refetching articles');
        fetchArticles();
      }
    });

    source.addEventListener('postUpdated', (event) => {
      const updatedPost = JSON.parse(event.data);
      console.log('postUpdated event data:', updatedPost);
      console.log('Checking if updatedPost.subcategoryid matches subCategoryId:', updatedPost.subcategoryid, subCategoryId);
      if (updatedPost.subcategoryid === subCategoryId) {
        console.log('postUpdated condition passed, refetching articles');
        fetchArticles();
      }
    });

    source.onerror = () => {
      console.error('SSE connection error');
    };

    return () => {
      source.close();
    };
  }, [subCategoryId]);

  const defaultIcon = null;

  if (loading) {
    return (
      <div className="container-xl mx-auto" style={{ paddingBottom: "60px" }}>
        <div className="row">
          <div className="section-header col-12 d-flex align-items-center">
            <h2 style={{ paddingTop: "7px", paddingLeft: "5px" }}>
              Bài viết thuộc danh mục {title}
            </h2>
          </div>
        </div>
        <div className="row">
          {Array(4).fill().map((_, index) => (
            <div key={index} className="col-md-12">
              <div className="collection">
                <div className="row align-items-center">
                  <div className="col-md-4">
                    <div
                      style={{
                        position: 'relative',
                        paddingTop: '60%', // 16:9 aspect ratio (144/240)
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#e0e0e0',
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div style={{ padding: '10px' }}>
                      <div
                        style={{
                          height: '20px',
                          width: '80%',
                          backgroundColor: '#e0e0e0',
                          borderRadius: '4px',
                          marginBottom: '10px',
                        }}
                      />
                      <div
                        style={{
                          height: '20px',
                          width: '50%',
                          backgroundColor: '#e0e0e0',
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error loading articles for {title}: {error}</div>;
  }

  return (
    <div className="container-xl mx-auto" style={{ paddingBottom: "60px" }}>
      <CategorySection2
        title={title}
        icon={defaultIcon}
        articles={articles}
        setCurrentComponent={setCurrentComponent}
      />
    </div>
  );
};

export default SubCategory;