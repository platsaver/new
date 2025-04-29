import Article from './Article.jsx'
// Featured Section Component
const FeaturedSection1 = () => {
    return (
      <section className="featured">
        <div className="container-xl">
          <div className="row">
            {/* Left Column */}
            <div className="col-lg-6">
              <div className="collection">
                <Article
                  imageUrl="https://i1-vnexpress.vnecdn.net/2025/03/17/ae640bbd121aa344fa0b-174218577-4142-6528-1742185843.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=jKQ7WgLITYqJ_GIzCkHAaw" 
                  categories={["Thời sự"]}
                  title="Tài xế mắc kẹt trong cabin sau tai nạn liên hoàn ở TP HCM"
                  author="Đình Văn"
                  timestamp="09:00 AM GMT+7"
                  excerpt="4 ôtô tông liên hoàn trên xa lộ Hà Nội, TP Thủ Đức, tài xế mắc kẹt trong cabin xe tải biến dạng được người đi đường phá cửa đưa ra, sáng 17/3."
                  link="./posts/post1.html"
                />
              </div>
            </div>
            
            {/* Middle Column */}
            <div className="col-lg-3">
              <div className="collection">
                <Article 
                  imageUrl="https://i1-vnexpress.vnecdn.net/2025/03/16/phoicanhkientruc-1742137749-3866-1742138502.png?w=240&h=144&q=100&dpr=2&fit=crop&s=wAsU4w9VOKCRrimOCckH1w"
                  categories={["Thời sự"]}
                  title="Nâng chiều cao tập thể Thành Công lên 40 tầng nhưng không tăng số dân"
                  author="Võ Hải"
                  timestamp="10:00 AM GMT+7"
                  excerpt="Hà Nội - Khu tập thể Thành Công sẽ được cải tạo theo nguyên tắc tăng chiều cao nhưng không tăng số dân, giảm mật độ xây dựng để tạo thêm quỹ đất công cộng."
                  link="./posts/post2.html"
                />
              </div>
            </div>
            
            {/* Right Column */}
            <div className="col-lg-3">
              <div className="collection">
                <Article 
                  categories={["Trong nước"]}
                  title="Nâng chiều cao tập thể Thành Công lên 40 tầng nhưng không tăng số dân"
                  author="Võ Hải"
                  timestamp="10:00 AM GMT+7, 16/03/2025"
                  excerpt="Hà Nội - Khu tập thể Thành Công sẽ được cải tạo theo nguyên tắc tăng chiều cao nhưng không tăng số dân, giảm mật độ xây dựng để tạo thêm quỹ đất công cộng."
                  link="./posts/post4.html"
                />
                <Article 
                  categories={["Trong nước"]}
                  title="Ôtô tông 10 xe máy ở ngã tư Thủ Đức"
                  author="Đình Văn - Lê Tuyết"
                  timestamp="17:00 GMT+7, 16/03/2025"
                  excerpt="TP HCM - Xe Mercedes khi chạy tới ngã tư Thủ Đức bất ngờ tông loạt xe máy, 6 người bị thương, tài xế có nồng độ cồn, chiều 16/3."
                  link="./posts/post5.html"
                  isLast={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

export default FeaturedSection1;