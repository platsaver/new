import React from 'react';

const Article = ({
  imageUrl,
  categories = [],
  title,
  author,
  timestamp,
  excerpt,
  link,
  isLast = false,
}) => {
  // Domain của server (sử dụng biến môi trường trong production)
  const baseUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:3000';
  
  // Tạo URL đầy đủ cho ảnh
  const fullImageUrl = imageUrl
    ? imageUrl.startsWith('http')
      ? imageUrl
      : `${baseUrl}${imageUrl}`
    : null;

  return (
    <div className={`article${isLast ? ' last' : ''}`}>
      {fullImageUrl && (
        <img
          src={fullImageUrl}
          alt={title || 'Article image'}
          className="img-fluid"
          onError={(e) => {
            console.error('Error loading image:', fullImageUrl);
            e.target.src = '/placeholder-image.jpg'; // Ảnh mặc định khi lỗi
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
        <a href={link} className="text-decoration-none">{title}</a>
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