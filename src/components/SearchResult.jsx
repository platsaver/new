import React, { useState } from 'react';
import { Typography } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';

const { Title, Text } = Typography;

const SearchResults = ({ results, pagination, onBack, setCurrentComponent, theme }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Handle search (unchanged)
  const handleSearch = () => {
    console.log('Search query:', searchQuery);
  };

  // Function to handle storing postid in localStorage and navigating to article detail
  const handlePostClick = (postid) => {
    // Store the new postid in localStorage, overwriting the previous value
    localStorage.setItem('selectedPostId', postid);
    localStorage.setItem('selectedPostID', postid); // Ensure consistency with Navigation.jsx
    console.log('Stored Post ID in localStorage:', postid);
    // Navigate to article detail component
    setCurrentComponent('articleDetail');
  };

  return (
    <div className="search-results-container">
      {/* Search results content */}
      <div className="container-xl py-4">
        <Title level={3} className={theme === 'light' ? 'text-dark' : 'text-light'}>Search Results</Title>
        {results.length === 0 ? (
          <Text className={theme === 'light' ? 'text-dark' : 'text-light'}>No posts found.</Text>
        ) : (
          <div>
            {results.map((post) => (
            <div className="container-xl">
                <div className="row">
                  <div className="col-md-4">
                    <img
                      src={post.imageurl ? `http://localhost:3000${post.imageurl}` : 'https://via.placeholder.com/300x200'}
                      alt={post.title}
                      className="img-fluid rounded-start"
                      style={{ objectFit: 'cover', height: '200px', width: '100%' }}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">
                        <a
                          href="#"
                          className={theme === 'light' ? 'text-dark' : 'text-light'}
                          style={{textDecoration: 'none'}}
                          onClick={(e) => {
                            e.preventDefault(); // Prevent default navigation
                            handlePostClick(post.postid);
                          }}
                        >
                          {post.title}
                        </a>
                      </h5>
                      <p className="card-text" style={{ color: '#606060' }}>
                        {post.content && post.content.length > 200
                          ? post.content.slice(0, 200) + '...'
                          : post.content || 'No content available'}
                      </p>
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => handlePostClick(post.postid)}
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;