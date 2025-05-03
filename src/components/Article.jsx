import React from 'react';

const Article = ({
  postID,
  imageUrl,
  categories = [],
  title,
  author,
  timestamp,
  excerpt,
  isLast = false,
  setCurrentComponent,
}) => {
  const baseUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:3000';
  
  const fullImageUrl = imageUrl
    ? imageUrl.startsWith('http')
      ? imageUrl
      : `${baseUrl}${imageUrl}`
    : null;

  const handleClick = () => {
    if (postID) {
      localStorage.setItem('selectedPostID', postID);
      console.log(`Selected postID: ${postID}`);
      setCurrentComponent('articleDetail');
    }
  };

  return (
    <div
      className={`article${isLast ? ' last' : ''}`}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      {fullImageUrl && (
        <img
          src={fullImageUrl}
          alt={title || 'Article image'}
          className="img-fluid"
          onError={(e) => {
            console.error('Error loading image:', fullImageUrl);
            e.target.src = '/placeholder-image.jpg';
          }}
        />
      )}

      {categories.length > 0 && (
        <ul className="categories list-unstyled">
          {categories.map((category, index) => (
            <li key={index}>
              <a href="category.html" className="category text-decoration-none">
                <span>{category}</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <h2>
        <span className="text-decoration-none">{title}</span>
      </h2>

      {(author || timestamp) && (
        <p className="byline">
          {author && `By ${author}`}
          {timestamp && <span className="timestamp">{timestamp}</span>}
        </p>
      )}

      {excerpt && <p>{excerpt}</p>}
    </div>
  );
};

export default Article;