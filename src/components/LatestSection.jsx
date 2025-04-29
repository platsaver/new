import { useState, useEffect } from 'react';

// Latest News Section Component
const LatestSection = () => {
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
  }, []); // Empty dependency array means this effect runs once on mount

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
                  <h2><a href={article.link}>{article.title}</a></h2>
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