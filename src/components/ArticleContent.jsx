import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ArticleContent = ({ content }) => {
  return (
    <div className="col-md-8 mx-auto">
      <div className="content">
        {content ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        ) : (
          <p>No content available.</p>
        )}
      </div>
    </div>
  );
};

export default ArticleContent;
