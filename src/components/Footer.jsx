import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import 'boxicons'; // Make sure boxicons is imported if you're using it

const Footer = () => {
  const [categories, setCategories] = useState([]);
  
  // Fetch categories from API
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
      
      // Extract and validate categories
      const categoriesData = Array.isArray(data.categories) ? data.categories : [];
      const validCategories = categoriesData
        .filter((cat) => cat && cat.categoryid && cat.categoryname)
        .map((cat) => ({
          CategoryID: cat.categoryid,
          CategoryName: cat.categoryname,
        }));

      setCategories(validCategories);
    } catch (error) {
      console.error('Error fetching categories for footer:', error);
    }
  };

  // Listen for category changes
  useEffect(() => {
    fetchCategories();
    
    // Listen for category updates from other components
    const handleCategoryUpdate = () => {
      fetchCategories();
    };
    
    window.addEventListener('categoryUpdated', handleCategoryUpdate);
    
    return () => {
      window.removeEventListener('categoryUpdated', handleCategoryUpdate);
    };
  }, []);

  // Generate path for category links
  const getCategoryPath = (categoryName) => {
    // Convert category name to lowercase and remove spaces
    const formattedName = categoryName.toLowerCase().replace(/\s+/g, '');
    return `../pages/${formattedName}.html`;
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
            <ul>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category.CategoryID}>
                    <a href={getCategoryPath(category.CategoryName)}>
                      {category.CategoryName}
                    </a>
                  </li>
                ))
              ) : (
                // Fallback static menu if categories can't be loaded
                <>
                </>
              )}
            </ul>
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