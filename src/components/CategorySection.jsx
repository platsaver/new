import Article from './Article.jsx';

const CategorySection = ({ title, icon, articles }) => {
    console.log(`Articles for ${title}:`, articles);
    return (
        <section className="subsection">
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
                            <div key={index} className="col-lg-3 col-sm-6">
                                <div className="collection">
                                    <Article
                                        imageUrl={article.imageurl} // Use lowercase to match API response
                                        title={article.title}
                                        link={article.link}
                                        isLast={index === articles.length - 1}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default CategorySection;