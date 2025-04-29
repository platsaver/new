import React from 'react';
import Navigation from './components/Navigation.jsx';
import Footer from './components/Footer.jsx';
import FeaturedSection2 from './components/FeaturedSection2.jsx';
import CategorySection from './components/CategorySection.jsx';
import Banner from './components/Banner.jsx';

const ThoiSu = ({ previewCategory }) => {
    // Default news articles
    const domesticNews = [
        {
          imageUrl: "https://i1-vnexpress.vnecdn.net/2025/03/17/ae640bbd121aa344fa0b-174218577-4142-6528-1742185843.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=jKQ7WgLITYqJ_GIzCkHAaw",
          title: "Tài xế mắc kẹt trong cabin sau tai nạn liên hoàn ở TP HCM",
          link: "./posts/post6.html"
        },
        {
          imageUrl: "https://i1-vnexpress.vnecdn.net/2025/03/16/z6316531565304-b93998f3eb029f4-8480-2428-1742140669.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=eD0BPeHJlJPeqGJOaGVszQ",
          title: "Số đơn vị hành chính cấp tỉnh cần sáp nhập đã được xác định",
          link: "./posts/post7.html"
        },
        {
          imageUrl: "https://i1-vnexpress.vnecdn.net/2025/03/16/phoicanhkientruc-1742137749-3866-1742138502.png?w=240&h=144&q=100&dpr=2&fit=crop&s=wAsU4w9VOKCRrimOCckH1w",
          title: "Nâng chiều cao tập thể Thành Công lên 40 tầng nhưng không tăng số dân",
          link: "./posts/post8.html"
        },
        {
          imageUrl: "https://i1-vnexpress.vnecdn.net/2025/03/16/fcdcd7a1273f9661cf2e-174212554-8326-4167-1742125678.jpg?w=240&h=144&q=100&dpr=2&fit=crop&s=Ns1MsOG8swGT7TIS-g1oHQ",
          title: "Ôtô tông 10 xe máy ở ngã tư Thủ Đức",
          link: "./posts/post9.html"
        }
    ];
      
    const internationalNews = [
        {
          imageUrl: "https://i1-vnexpress.vnecdn.net/2025/03/17/cats-1742218042-2751-1742218176.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=7iIL6b8EGh4FzBUes8g-rA",
          title: "Người giữ thẻ xanh, du học sinh được khuyến cáo không rời Mỹ",
          link: "./posts/post10.html"
        },
        {
          imageUrl: "https://i1-vnexpress.vnecdn.net/2025/03/17/cats-1742221747-3545-1742221786.jpg?w=680&h=408&q=100&dpr=1&fit=crop&s=4n7PBMIsIH8ZnMiPn1BLjQ",
          title: "Báo chí Mỹ phá vỡ truyền thống trăm năm với Tổng thống Trump",
          link: "./posts/post11.html"
        },
        {
          imageUrl: "https://i1-vnexpress.vnecdn.net/2025/03/17/ap25060654037478-1742227906-17-9251-1125-1742228118.jpg?w=220&h=132&q=100&dpr=1&fit=crop&s=fc3OsUAJ8iJbmbVjt7nEag",
          title: "Thủ tướng Canada 'mời ông Zelensky dự hội nghị thượng đỉnh G7'",
          link: "./posts/post12.html"
        },
        {
          imageUrl: "https://i1-vnexpress.vnecdn.net/2025/03/17/2024-08-17t162930z-1721563911-5901-1239-1742195105.jpg?w=240&h=144&q=100&dpr=1&fit=crop&s=0bksisucuD_6JCav9hE0Gw",
          title: "Lính Ukraine kể quá trình rút quân ở Kursk",
          link: "./posts/post13.html"
        }
    ];

    // Generate dummy news for preview category if available
    const generateCategoryNews = (categoryName) => {
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

    return(
        <>
        <Banner />
            <div className="container-xl">
                <div id="main">
                    {!previewCategory && <FeaturedSection2 />}
                    
                    {previewCategory ? (
                        // Render preview category if available
                        <CategorySection 
                            title={previewCategory.CategoryName}
                            articles={generateCategoryNews(previewCategory.CategoryName)}
                        />
                    ) : (
                        // Otherwise render default categories
                        <>
                            <CategorySection 
                                title="Trong nước" 
                                articles={domesticNews} 
                            />
                            
                            <CategorySection 
                                title="Quốc tế" 
                                articles={internationalNews} 
                            />
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ThoiSu;