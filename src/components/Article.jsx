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
}) => {
  // Domain của server (sử dụng biến môi trường trong production)
  const baseUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:3000';
  
  // Tạo URL đầy đủ cho ảnh
  const fullImageUrl = imageUrl
    ? imageUrl.startsWith('http')
      ? imageUrl
      : `${baseUrl}${imageUrl}`
    : null;

  // Xử lý click để lưu postID vào localStorage
  const handleClick = () => {
    if (postID) {
      localStorage.setItem('selectedPostID', postID);
      console.log(`Selected postID: ${postID}`);
      // Có thể thêm logic điều hướng nếu cần, ví dụ:
      // window.location.href = '/post';
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