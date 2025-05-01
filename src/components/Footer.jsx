import React from 'react';
import { Spin } from 'antd';
import 'boxicons';

const Footer = ({ categories = [], loading, setCurrentComponent, setSelectedCategory }) => {
  // Handle navigation change when a menu item is clicked
  const handleChangeComponent = (e, componentName, categoryData = null) => {
    e.preventDefault();
    if (componentName === 'category' && categoryData) {
      setSelectedCategory(categoryData);
      setCurrentComponent(componentName);
    } else {
      setSelectedCategory(null);
      setCurrentComponent(componentName);
    }
  };

  return (
    <footer className="footer1">
      <div className="container">
        <div className="row">
          {/* About Us Section */}
          <div className="footer-col1">
            <h4>Về chúng tôi</h4>
            <ul>
              <li>
                <a href="#">
                  The Hanoi Times là trang tin tức trực tuyến tư chuyên cập nhật nhanh chóng và chính xác các sự kiện trong nước và quốc tế. Với đội ngũ phóng viên chuyên nghiệp, Hanoinews mang đến những bài viết đa dạng về thời sự, kinh tế, bất động sản, pháp luật. Giao diện thân thiện, dễ sử dụng giúp độc giả dễ dàng tiếp cận thông tin mọi lúc, mọi nơi.
                </a>
              </li>
            </ul>
          </div>

          {/* Dynamic Menu Section */}
          <div className="footer-col1">
            <h4>Menu</h4>
            {loading ? (
              <div className="text-center">
                <Spin size="small" />
                <p className="mt-2">Loading categories...</p>
              </div>
            ) : (
              <ul>
                {(categories || []).length > 0 ? (
                  categories.map((category) => (
                    <li key={category.CategoryID}>
                      <a
                        href="#"
                        onClick={(e) => handleChangeComponent(e, 'category', category)}
                      >
                        {category.CategoryName}
                      </a>
                    </li>
                  ))
                ) : (
                  <li>No categories available</li>
                )}
              </ul>
            )}
          </div>

          {/* Contact Information Section */}
          <div className="footer-col1">
            <h4>Thông tin liên hệ</h4>
            <ul>
              <li><a href="#">Địa chỉ: 96A Đ. Trần Phú, P. Mộ Lao, Hà Đông, Hà Nội</a></li>
              <li><a href="#">Số điện thoại: 0123456789</a></li>
            </ul>
          </div>

          {/* Social Links Section */}
          <div className="footer-col1">
            <h4>Follow Us</h4>
            <div className="social-link">
              <a href="https://www.facebook.com/profile.php?id=100086006084010">
                <box-icon type="logo" name="facebook-circle"></box-icon>
              </a>
              <a href="#">
                <box-icon type="logo" name="gmail"></box-icon>
              </a>
              <a href="#">
                <box-icon name="github" type="logo"></box-icon>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;