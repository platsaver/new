import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3000';

// Latest News Section Component
const LatestSection = ({ setCurrentComponent }) => {
  const [latestArticles, setLatestArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the API when component mounts
    const fetchLatestPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/latest-posts');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setLatestArticles(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching latest posts:', error);
        setError('Failed to load latest posts');
        setLoading(false);
      }
    };

    fetchLatestPosts();

    // SSE Event Handling
    const source = new EventSource(`${API_BASE_URL}/events`);

    source.addEventListener('postCreated', (event) => {
      console.log('postCreated event data:', JSON.parse(event.data));
      fetchLatestPosts(); // Refetch to include the new post
    });

    source.addEventListener('postUpdated', (event) => {
      console.log('postUpdated event data:', JSON.parse(event.data));
      fetchLatestPosts(); // Refetch to reflect the update
    });

    source.addEventListener('mediaUpdated', (event) => {
      console.log('mediaUpdated event data:', JSON.parse(event.data));
      fetchLatestPosts(); // Refetch to reflect the updated image
    });

    source.addEventListener('postDeleted', (event) => {
      const deletedPost = JSON.parse(event.data);
      console.log('postDeleted event data:', deletedPost);
      fetchLatestPosts(); // Refetch to remove the deleted post
    });

    source.onerror = () => {
      console.error('SSE connection error');
    };

    return () => {
      source.close();
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Xử lý nhấp vào bài viết
  const handleArticleClick = (postId) => {
    localStorage.setItem('selectedPostID', postId); // Lưu postId vào localStorage
    setCurrentComponent('articleDetail'); // Chuyển hướng đến ArticleDetail
  };

  if (loading) {
    return <div className="container-xl text-center">Loading latest posts...</div>;
  }

  if (error) {
    return <div className="container-xl text-center">Error: {error}</div>;
  }

  return (
    <section className="latest">
      <div className="container-xl">
        <div className="row">
          <div className="section-header col-md-12" style={{ display: "flex" }}>
            <h2>
              <box-icon name="hot" type="solid" color="red"></box-icon>
            </h2>
            <h2 style={{ paddingLeft: "5px" }}>Mới nhất</h2>
          </div>
        </div>
        <div className="collection">
          {latestArticles.map((article, index) => (
            <div key={article.postId} className={`article${article.isLast ? " last" : ""}`}>
              <div className="row">
                <div className="col-md-2">
                  <p><span className="timestamp">{article.timestamp}</span></p>
                </div>
                <div className="col-md-7">
                  <h2>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleArticleClick(article.postId);
                      }}
                    >
                      {article.title}
                    </a>
                  </h2>
                  <p>{article.excerpt}</p>
                  <p className="byline"> By {article.author}</p>
                </div>
                <div className="col-md-3">
                  <img src={article.imageUrl} alt={article.title} className="img-fluid" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestSection;