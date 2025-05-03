import React, { useState } from 'react';
import { Typography } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';

const { Title, Text } = Typography;

const SearchResults = ({ results, pagination, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle search (unchanged)
  const handleSearch = () => {
    console.log('Search query:', searchQuery);
  };

  // Function to fetch post details by postid using fetch
  const fetchPostDetails = async (postid) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/api/post/${postid}`);
      if (!response.ok) {
        throw new Error(response.status === 404 ? 'Post not found' : 'Failed to fetch post details');
      }
      const data = await response.json();
      setSelectedPost(data);
      console.log('Fetched Post Details:', data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching post details:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle storing postid in localStorage and accessing details
  const handlePostClick = (postid) => {
    // Store postid in localStorage
    localStorage.setItem('selectedPostId', postid);
    // Fetch post details using postid from localStorage
    const selectedPostId = localStorage.getItem('selectedPostId');
    console.log('Accessing post details for Post ID:', selectedPostId);
    fetchPostDetails(selectedPostId);
  };

  return (
    <div className="search-results-container">
      {/* Search results content */}
      <div className="container-xl py-4">
        <Title level={3} className="mt-4">Search Results</Title>
        {results.length === 0 ? (
          <Text>No posts found.</Text>
        ) : (
          <div>
            {results.map((post) => (
              <div key={post.postid} className="card border-0 shadow-sm mb-4">
                <div className="row g-0">
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
                          style={{ color: '#1a0dab', textDecoration: 'none' }}
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
                      <p className="card-text">
                        <small className="text-muted">
                          Status: {post.status} | Featured: {post.featured ? 'Yes' : 'No'} | Created: {new Date(post.createdatdate).toLocaleString()}
                        </small>
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
            {/* Display selected post details */}
            {loading && <Text>Loading post details...</Text>}
            {error && <Text type="danger">{error}</Text>}
            {selectedPost && (
              <div className="card border-0 shadow-sm mt-4">
                <div className="card-body">
                  <h4>{selectedPost.title}</h4>
                  {selectedPost.imageUrl && (
                    <img
                      src={`http://localhost:3000${selectedPost.imageUrl}`}
                      alt={selectedPost.title}
                      className="img-fluid mb-3"
                      style={{ maxWidth: '300px' }}
                    />
                  )}
                  <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
                  <p>
                    <small className="text-muted">
                      Author: {selectedPost.author} | Published: {selectedPost.timestamp} <br />
                      Categories: {selectedPost.categories.join(', ') || 'None'} <br />
                      Status: {selectedPost.status} | Featured: {selectedPost.featured ? 'Yes' : 'No'}
                    </small>
                  </p>
                </div>
              </div>
            )}
            {/* Manual pagination with Bootstrap */}
            <nav aria-label="Page navigation">
              <ul className="pagination justify-content-center">
                <li className="page-item disabled">
                  <span className="page-link">Previous</span>
                </li>
                {[...Array(pagination.pages)].map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${Math.floor(pagination.offset / pagination.limit) + 1 === index + 1 ? 'active' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => console.log('Page:', index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className="page-item">
                  <button className="page-link" onClick={() => console.log('Next')}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;