import React, { useState, useEffect } from 'react';
import ArticleHeader from './ArticleHeader';
import ArticleContent from './ArticleContent';
import CommentSection from './CommentSection';
import SameCategoryArticle from './SameCategoryArticle.jsx';
import RelatedArticle from './RelatedArticle.jsx';

const ArticleDetail = () => {
  const [articleData, setArticleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const postID = localStorage.getItem('selectedPostID');
      if (!postID) {
        setError('No post selected');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/post/${postID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        setArticleData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPost();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!articleData) {
    return <div>No post data available.</div>;
  }

  return (
    <>
      <div className="container-xl">
        <div id="main">
          <section>
            <div className="article">
              <div className="row g-4">
                <ArticleHeader
                  categories={articleData.categories}
                  title={articleData.title}
                  author={articleData.author}
                  timestamp={articleData.timestamp}
                />
                
                <ArticleContent
                  content={articleData.content}
                />
                <RelatedArticle />
              </div>
            </div>
            
            <CommentSection />
          </section>
        </div>
      </div>
      <SameCategoryArticle />
    </>
  );
};

export default ArticleDetail;