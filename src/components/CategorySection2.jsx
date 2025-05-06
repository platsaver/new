import React from 'react';
import Article from './Article.jsx';

const CategorySection = ({ title, icon, articles, setCurrentComponent }) => {
  console.log(`Articles for ${title}:`, articles);
  return (
      <div className="container-xl">
        <div className="row">
          <div className="section-header col-12 d-flex align-items-center">
            {icon}
            <h2 style={{ paddingTop: "7px", paddingLeft: "5px" }}>{title}</h2>
          </div>
        </div>
        <div className="row g-3">
          {articles.length === 0 ? (
            <div>No articles available</div>
          ) : (
            articles.map((article, index) => (
              <div key={index} className="col-md-12">
                <div className="collection">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <img
                        src={article.imageurl}
                        alt={article.title}
                        className="img-fluid"
                      />
                    </div>
                    <div className="col-md-6">
                      <Article
                        postID={article.postid}
                        title={article.title}
                        link={article.link}
                        isLast={index === articles.length - 1}
                        setCurrentComponent={setCurrentComponent}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
  );
};

export default CategorySection;
