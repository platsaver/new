import React from 'react';

const ArticleContent = ({ content }) => {
  return (
    <div className="col-md-8 mx-auto">
      <div className="content">
        {content ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <p>No content available.</p>
        )}
      </div>
    </div>
  );
};

export default ArticleContent;