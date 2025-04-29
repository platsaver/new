import React from 'react';
import { Row, Col, Button, Avatar } from 'antd';
import { ArrowLeftOutlined, CommentOutlined } from '@ant-design/icons';

const ArticleDetail = ({ article, onBack }) => {
  // Check if article exists to avoid errors
  if (!article) {
    return <div>Không tìm thấy bài viết</div>;
  }

  // Format date if available
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} ${date.toLocaleDateString('vi-VN')}`;
  };

  return (
    <div className="article-details">
      <div className="container-xl">
        <div id="main">
          <section>
            <div className="article">
              <Row gutter={16}>
                <Col md={24}>
                  <ul className="categories">
                    {article.categoryName && (
                      <li>
                        <a href="#" className="category">
                          <span>{article.categoryName}</span>
                        </a>
                      </li>
                    )}
                    {article.subcategoryName && (
                      <li>
                        <a href="#" className="category">
                          <span>{article.subcategoryName}</span>
                        </a>
                      </li>
                    )}
                  </ul>
                  <h1>{article.title}</h1>
                  <p className="byline">
                    {article.author && `By ${article.author}`}{' '}
                    <span className="timestamp">{formatDate(article.createdat)}</span>
                  </p>
                </Col>
                
                <Col md={16} className="mx-auto">
                  <div className="content" 
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                </Col>
                
                <Col md={8}>
                  <aside className="related-articles">
                    <h3>Có thể bạn quan tâm</h3>
                    <hr />
                    <ul className="related-list">
                      {/* Map through related articles if available */}
                      {article.relatedArticles?.map((related, index) => (
                        <li key={index}>
                          <a href="#" className="related-item">
                            <img 
                              src={related.thumbnail || "/api/placeholder/200/120"} 
                              alt={related.title} 
                              className="related-thumbnail" 
                            />
                            <span>{related.title}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      type="link" 
                      icon={<ArrowLeftOutlined />} 
                      onClick={onBack}
                      className="back-to-home"
                    >
                      QUAY LẠI TRANG CHỦ
                    </Button>
                  </aside>
                </Col>
              </Row>
            </div>
            
            {/* Comment Section */}
            <div className="comment-section">
              <div className="comment-header">
                <div className="comment-title">
                  <CommentOutlined className="comment-icon" />
                  <span>Bình luận</span>
                </div>
                <a href="#" className="login-to-comment">Đăng nhập để bình luận</a>
              </div>
              <div className="comment-input-wrapper">
                <textarea className="comment-textbox" placeholder="Ý kiến của bạn ...." />
                <Button type="primary" shape="circle" icon={<CommentOutlined />} />
              </div>
            </div>
          </section>
        </div>
        
        <div className="same-category-section">
          <h3><span>Cùng chuyên mục</span></h3>
          <Row gutter={16} className="same-category-container">
            {/* Map through same category articles if available */}
            {article.sameCategoryArticles?.map((catArticle, index) => (
              <Col span={8} key={index} className="same-category-item">
                <a href="#">
                  <img 
                    src={catArticle.thumbnail || "/api/placeholder/300/180"} 
                    alt={catArticle.title} 
                  />
                  <h4>{catArticle.title}</h4>
                </a>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;