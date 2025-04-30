import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation.jsx';
import Footer from './components/Footer.jsx';
import FeaturedSection2 from './components/FeaturedSection2.jsx';
import CategorySection from './components/CategorySection.jsx';
import Banner from './components/Banner.jsx';
import Article from './components/Article.jsx';

const ThoiSu = ({ previewCategory }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch categories and subcategories if needed
    useEffect(() => {
        // Skip API call if we're in preview mode
        if (previewCategory) {
            setLoading(false);
            return;
        }

        const fetchCategories = async () => {
            try {
                const url = `http://localhost:3000/api/categories?t=${Date.now()}`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }

                const data = await response.json();
                
                // Process and validate categories
                const validCategories = Array.isArray(data.categories) 
                    ? data.categories.map(cat => ({
                        CategoryID: cat.categoryid,
                        CategoryName: cat.categoryname,
                        BannerURL: cat.bannerurl || null,
                        subCategories: Array.isArray(cat.subcategories)
                            ? cat.subcategories.map(sub => ({
                                SubCategoryID: sub.subcategoryid,
                                CategoryID: sub.categoryid,
                                SubCategoryName: sub.subcategoryname,
                                BannerURL: sub.bannerurl || null,
                            }))
                            : [],
                    }))
                    : [];
                
                setCategories(validCategories);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchCategories();
    }, [previewCategory]);

    // Generate mock news articles for a category or subcategory
    const generateNewsForCategory = (categoryName, isMainFeature = false) => {
        // For featured main content (larger, more prominent)
        if (isMainFeature) {
            return [
                {
                    imageUrl: "https://i1-vnexpress.vnecdn.net/2025/03/17/ae640bbd121aa344fa0b-174218577-4142-6528-1742185843.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=jKQ7WgLITYqJ_GIzCkHAaw",
                    title: `${categoryName} - Tin tức nổi bật 1`,
                    description: `Đây là mô tả chi tiết cho tin tức nổi bật về ${categoryName}. Nội dung này sẽ hiển thị như featured post.`,
                    link: "#",
                    author: "Đình Văn",
                    timestamp: "09:00 AM GMT+7",
                    categories: [categoryName]
                },
                {
                    imageUrl: "https://i1-vnexpress.vnecdn.net/2025/03/16/z6316531565304-b93998f3eb029f4-8480-2428-1742140669.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=eD0BPeHJlJPeqGJOaGVszQ",
                    title: `${categoryName} - Tin tức nổi bật 2`,
                    description: `Tin tức quan trọng khác về ${categoryName} được đưa vào mục nổi bật.`,
                    link: "#",
                    author: "Võ Hải",
                    timestamp: "10:00 AM GMT+7",
                    categories: [categoryName]
                },
                {
                    title: `${categoryName} - Tin tức nổi bật 3`,
                    description: `Thông tin mới nhất về ${categoryName} được cập nhật liên tục.`,
                    link: "#",
                    author: "Võ Hải",
                    timestamp: "10:00 AM GMT+7, 16/03/2025",
                    categories: [categoryName]
                },
                {
                    title: `${categoryName} - Tin tức nổi bật 4`,
                    description: `Thông tin mới nhất về ${categoryName} được cập nhật liên tục.`,
                    link: "#",
                    author: "Đình Văn",
                    timestamp: "17:00 GMT+7, 16/03/2025",
                    categories: [categoryName]
                }
            ];
        }
        
        // For regular news sections
        return [
            {
                imageUrl: "https://i1-vnexpress.vnecdn.net/2025/03/17/ae640bbd121aa344fa0b-174218577-4142-6528-1742185843.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=jKQ7WgLITYqJ_GIzCkHAaw",
                title: `${categoryName} - Tin tức 1`,
                link: "#"
            },
            {
                imageUrl: "https://i1-vnexpress.vnecdn.net/2025/03/16/z6316531565304-b93998f3eb029f4-8480-2428-1742140669.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=eD0BPeHJlJPeqGJOaGVszQ",
                title: `${categoryName} - Tin tức 2`,
                link: "#"
            },
            {
                imageUrl: "https://i1-vnexpress.vnecdn.net/2025/03/16/phoicanhkientruc-1742137749-3866-1742138502.png?w=240&h=144&q=100&dpr=2&fit=crop&s=wAsU4w9VOKCRrimOCckH1w",
                title: `${categoryName} - Tin tức 3`,
                link: "#"
            },
            {
                imageUrl: "https://i1-vnexpress.vnecdn.net/2025/03/16/fcdcd7a1273f9661cf2e-174212554-8326-4167-1742125678.jpg?w=240&h=144&q=100&dpr=2&fit=crop&s=Ns1MsOG8swGT7TIS-g1oHQ",
                title: `${categoryName} - Tin tức 4`,
                link: "#"
            }
        ];
    };

    // Custom Featured Section Component for Categories
    const CategoryFeaturedSection = ({ title, articles }) => {
        if (!articles || articles.length === 0) return null;
        
        return (
            <section className="featured">
                <div className="container-xl">
                    <div className="row">
                        {/* Left Column */}
                        <div className="col-lg-6">
                            <div className="collection">
                                <Article
                                    imageUrl={articles[0].imageUrl}
                                    categories={articles[0].categories}
                                    title={articles[0].title}
                                    author={articles[0].author}
                                    timestamp={articles[0].timestamp}
                                    excerpt={articles[0].description}
                                    link={articles[0].link}
                                />
                            </div>
                        </div>
                        
                        {/* Middle Column */}
                        <div className="col-lg-3">
                            <div className="collection">
                                <Article
                                    imageUrl={articles[1].imageUrl}
                                    categories={articles[1].categories}
                                    title={articles[1].title}
                                    author={articles[1].author}
                                    timestamp={articles[1].timestamp}
                                    excerpt={articles[1].description}
                                    link={articles[1].link}
                                />
                            </div>
                        </div>
                        
                        {/* Right Column */}
                        <div className="col-lg-3">
                            <div className="collection">
                                <Article
                                    imageUrl={articles[2].imageUrl}
                                    categories={articles[2].categories}
                                    title={articles[2].title}
                                    author={articles[2].author}
                                    timestamp={articles[2].timestamp}
                                    excerpt={articles[2].description}
                                    link={articles[2].link}
                                />
                                <Article
                                    imageUrl={articles[3].imageUrl}
                                    categories={articles[3].categories}
                                    title={articles[3].title}
                                    author={articles[3].author}
                                    timestamp={articles[3].timestamp}
                                    excerpt={articles[3].description}
                                    link={articles[3].link}
                                    isLast={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    // Render logic
    const renderContent = () => {
        // If we're in preview mode with a specific category
        if (previewCategory) {
            const featuredArticles = generateNewsForCategory(previewCategory.CategoryName, true);
            
            // Check if previewCategory has subcategories
            if (previewCategory.subCategories && previewCategory.subCategories.length > 0) {
                return (
                    <>
                        <CategoryFeaturedSection 
                            title={previewCategory.CategoryName}
                            articles={featuredArticles}
                        />
                        
                        {/* Render a CategorySection for each subcategory */}
                        {previewCategory.subCategories.map((subcategory, index) => (
                            <CategorySection 
                                key={subcategory.SubCategoryID || index}
                                title={subcategory.SubCategoryName}
                                articles={generateNewsForCategory(subcategory.SubCategoryName)}
                            />
                        ))}
                    </>
                );
            } else {
                // If no subcategories, just show the category with its featured and regular sections
                return (
                    <>
                        <CategoryFeaturedSection 
                            title={previewCategory.CategoryName}
                            articles={featuredArticles}
                        />
                        
                        <CategorySection 
                            title={previewCategory.CategoryName}
                            articles={generateNewsForCategory(previewCategory.CategoryName)}
                        />
                    </>
                );
            }
        }
        
        // Default view for ThoiSu page (when no specific category is selected)
        return (
            <>
                <FeaturedSection2 />
                
                {loading ? (
                    <div>Loading categories...</div>
                ) : error ? (
                    <div>Error loading categories: {error}</div>
                ) : (
                    // Render all available categories
                    categories.map((category, index) => (
                        <CategorySection 
                            key={category.CategoryID || index}
                            title={category.CategoryName} 
                            articles={generateNewsForCategory(category.CategoryName)}
                        />
                    ))
                )}
                
                {/* Fallback to default sections if no categories or in development */}
                {!loading && !error && categories.length === 0 && (
                    <>
                        <CategorySection 
                            title="Trong nước" 
                            articles={generateNewsForCategory("Trong nước")}
                        />
                        
                        <CategorySection 
                            title="Quốc tế" 
                            articles={generateNewsForCategory("Quốc tế")}
                        />
                    </>
                )}
            </>
        );
    };

    return(
        <>
            <Banner />
            <div className="container-xl">
                <div id="main">
                    {renderContent()}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ThoiSu;