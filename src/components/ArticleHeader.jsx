const ArticleHeader = () => {
    return (
      <div className="col-md-12">
        <ul className="categories">
          <li>
            <a href="category.html" className="category">
              <span>Bất động sản</span>
            </a>
          </li>
          <li>
            <a href="category.html" className="category">
              <span>Kinh doanh</span>
            </a>
          </li>
        </ul>
        <h1>Đất trúng đấu giá huyện ven Hà Nội tiếp tục giảm nhiệt</h1>
        <p className="byline">
          By Ngọc Diễm <span className="timestamp">08:00 AM GMT+7, 17/03/2025</span>
        </p>
      </div>
    );
  };
  
  export default ArticleHeader;