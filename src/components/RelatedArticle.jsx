import React from "react";

const RelatedArticles = () => {
  const articles = [
    {
      href: "../pages/article1.html",
      imgSrc: "https://baogiaothong.mediacdn.vn/603483875699699712/2024/6/14/edit-img20240614151836-17183534416452124406790.jpeg",
      alt: "Bài báo 1",
      title: "Xe tải nổ lốp, lật ngửa trên cao tốc Hà Nội - Hải Phòng",
    },
    {
      href: "../pages/article2.html",
      imgSrc: "https://image.plo.vn/w850/Uploaded/2025/liwbzivo/2025_01_22/vo-nguyen-giap-1-3737-9738.jpg.webp",
      alt: "Bài báo 2",
      title: "Đường Võ Nguyên Giáp, TP Thủ Đức đang kẹt xe kéo dài",
    },
    {
      href: "../pages/article3.html",
      imgSrc: "https://i1-vnexpress.vnecdn.net/2025/03/28/tainan-copy-1743131776-4517-1743131852.jpg?w=1020&h=0&q=100&dpr=1&fit=crop&s=Dz2djAApMuxCUs8DsHRb7A",
      alt: "Bài báo 3",
      title: "Nữ xe ôm tử vong sau va chạm xe khách ở Hà Nội",
    },
  ];

  return (
    <div className="col-md-4">
      <aside className="related-articles">
        <h3>Có thể bạn quan tâm</h3>
        <hr />
        <ul className="related-list">
          {articles.map((article, index) => (
            <li key={index}>
              <a href={article.href} className="related-item">
                <img src={article.imgSrc} alt={article.alt} className="related-thumbnail" />
                <span>{article.title}</span>
              </a>
            </li>
          ))}
        </ul>
        <a href="../pages/index.html" className="back-to-home">
          <box-icon name="chevron-left" style={{ width: 20, height: 20, verticalAlign: "middle" }}></box-icon>
          QUAY LẠI TRANG CHỦ
        </a>
      </aside>
    </div>
  );
};

export default RelatedArticles;
