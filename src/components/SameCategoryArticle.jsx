import React from "react";

const SameCategorySection = () => {
  const articles = [
    {
      imgSrc: "https://i1-vnexpress.vnecdn.net/2025/03/16/z6316531565304-b93998f3eb029f4-8480-2428-1742140669.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=eD0BPeHJlJPeqGJOaGVszQ",
      alt: "Bài báo 4",
      title: "Số đơn vị hành chính cấp tỉnh cần sáp nhập đã được xác định",
    },
    {
      href: "../pages/article4.html",
      imgSrc: "https://i1-vnexpress.vnecdn.net/2025/03/16/phoicanhkientruc-1742137749-3866-1742138502.png?w=240&h=144&q=100&dpr=2&fit=crop&s=wAsU4w9VOKCRrimOCckH1w",
      alt: "Bài báo 4",
      title: "Nâng chiều cao tập thể Thành Công lên 40 tầng nhưng không tăng số dân",
    },
    {
      imgSrc: "https://i1-vnexpress.vnecdn.net/2025/03/16/fcdcd7a1273f9661cf2e-174212554-8326-4167-1742125678.jpg?w=240&h=144&q=100&dpr=2&fit=crop&s=Ns1MsOG8swGT7TIS-g1oHQ",
      alt: "Bài báo 4",
      title: "Ôtô tông 10 xe máy ở ngã tư Thủ Đức",
    },
  ];

  return (
    <div className="same-category-section">
      <h3><span>Cùng chuyên mục</span></h3>
      <div className="same-category-container">
        {articles.map((article, index) => (
          <div className="same-category-item" key={index}>
            <a href={article.href}>
              <img src={article.imgSrc} alt={article.alt} />
              <h4>{article.title}</h4>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SameCategorySection;
