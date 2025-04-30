import { useState, useEffect } from 'react';
import 'boxicons/css/boxicons.min.css';
import 'boxicons';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@ant-design/v5-patch-for-react-19';
import '../App.css';
import HomePage from '../Homepage.jsx';
import ThoiSu from '../ThoiSu.jsx';
import LoginForm from './LoginForm.jsx';
import Admin from '../management_pages/Admin.jsx';
import { message, Spin } from 'antd';

const Navigation = () => {
  const [isSidebarActive, setSidebarActive] = useState(false);
  const [isWrapperToggled, setWrapperToggled] = useState(false);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [currentComponent, setCurrentComponent] = useState('homepage');
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [showAdminPage, setShowAdminPage] = useState(false);
  const [userName, setUserName] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  // Create navItems by combining fixed items with dynamic categories
  const getNavItems = () => {
    const baseNavItems = [
      { path: '#', text: 'Trang chủ', component: 'homepage' },
    ];
    
    const categoryNavItems = categories.map(category => ({
      path: '#',
      text: category.CategoryName,
      component: 'category',
      categoryId: category.CategoryID,
      categoryData: category
    }));
    
    const adminItem = userName ? [{ path: '#', text: 'Admin', component: 'admin' }] : [];
    
    return [...baseNavItems, ...categoryNavItems, ...adminItem];
  };

  // Get categories from API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: Failed to fetch categories`);
      }

      const data = await response.json();
      console.log('Fetched categories for navigation:', data);

      const categoriesData = Array.isArray(data.categories) ? data.categories : [];
      
      const validCategories = categoriesData
        .filter((cat) => cat && cat.categoryid && cat.categoryname)
        .map((cat) => ({
          CategoryID: cat.categoryid,
          CategoryName: cat.categoryname,
          BannerURL: cat.bannerurl || null,
          subCategories: Array.isArray(cat.subcategories)
            ? cat.subcategories.map((sub) => ({
                SubCategoryID: sub.subcategoryid,
                CategoryID: sub.categoryid,
                SubCategoryName: sub.subcategoryname,
                BannerURL: sub.bannerurl || null,
              }))
            : [],
        }));

      setCategories(validCategories);
    } catch (error) {
      console.error('Error fetching categories for navigation:', error);
      message.error(`Error fetching categories: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Check authentication status when component mounts
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/check-auth', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok && data.isAuthenticated) {
          setUserName(data.user.username);
        } else {
          setUserName(null);
          if (currentComponent === 'admin' || showAdminPage) {
            setCurrentComponent('homepage');
            setShowAdminPage(false);
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setUserName(null);
        if (currentComponent === 'admin' || showAdminPage) {
          setCurrentComponent('homepage');
          setShowAdminPage(false);
        }
      }
    };

    checkAuthStatus();
    fetchCategories();
  }, [currentComponent, showAdminPage]);

  // Listen for category changes from admin panel
  useEffect(() => {
    const handleCategoryChange = () => {
      console.log("Category change detected, refreshing categories");
      fetchCategories();
    };

    window.addEventListener('categoryUpdated', handleCategoryChange);

    return () => {
      window.removeEventListener('categoryUpdated', handleCategoryChange);
    };
  }, []);

  const handleToggleSidebar = (e) => {
    if (e) e.preventDefault();
    setSidebarActive(true);
    document.body.classList.add('sidebar-open');
    setWrapperToggled(!isWrapperToggled);
  };

  const handleCloseSidebar = () => {
    setSidebarActive(false);
    document.body.classList.remove('sidebar-open');
    if (isWrapperToggled) {
      setWrapperToggled(false);
    }
  };

  const handleToggleSearch = () => {
    setSearchVisible(!isSearchVisible);
  };

  const handleChangeComponent = (e, componentName, categoryData = null) => {
    e.preventDefault();

    if (componentName === 'admin') {
      if (!userName) {
        message.error('Vui lòng đăng nhập để truy cập trang Admin!');
        setShowLoginPage(true);
        return;
      }
      setShowAdminPage(true);
    } else if (componentName === 'category' && categoryData) {
      setSelectedCategory(categoryData);
      setCurrentComponent(componentName);
    } else {
      setSelectedCategory(null);
      setCurrentComponent(componentName);
    }

    handleCloseSidebar();
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    setShowLoginPage(true);
  };

  const handleBackFromLogin = () => {
    setShowLoginPage(false);
  };

  const handleBackFromAdmin = () => {
    setShowAdminPage(false);
    fetchCategories();
  };

  const handleLoginSuccess = (username) => {
    setUserName(username);
    setShowLoginPage(false);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Logout successful!');
        setUserName(null);
        localStorage.removeItem('userId');

        if (currentComponent === 'admin' || showAdminPage) {
          setCurrentComponent('homepage');
          setShowAdminPage(false);
        }
      } else {
        message.error(data.error || 'Logout failed!');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      message.error('An unexpected error occurred.');
    }
  };

  const handleUserIconClick = (e) => {
    e.preventDefault();
    if (userName) {
      handleLogout();
    } else {
      handleLoginClick(e);
    }
  };

  useEffect(() => {
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, []);

  const renderCurrentComponent = () => {
    switch (currentComponent) {
      case 'category':
        return <ThoiSu previewCategory={selectedCategory} />;
      case 'homepage':
      default:
        return <HomePage />;
    }
  };

  const navItems = getNavItems();

  if (showLoginPage) {
    return (
      <div className="login-page-container">
        <LoginForm onBack={handleBackFromLogin} onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  if (showAdminPage) {
    return (
      <div className="admin-page-container">
        <div className="admin-header d-flex justify-content-between align-items-center p-3 bg-light">
          <button className="btn btn-secondary" onClick={handleBackFromAdmin}>
            <i className="fa-solid fa-arrow-left me-2"></i>Back
          </button>
          <div className="user-info">
            <span className="me-2">Welcome, {userName}</span>
            <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
        <Admin onCategoryChange={fetchCategories} />
      </div>
    );
  }

  return (
    <>
      <div className="sticky-top">
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <a className="menu-toggle btn" href="#" onClick={handleToggleSidebar}>
              <i className="fa-solid fa-bars"></i>
              <span className="menu-text">Danh mục</span>
            </a>
            <h2
              className="custom-branding text-center position-absolute top-50 start-50 translate-middle"
              style={{ width: 'auto' }}
            >
              The Hanoi Times
            </h2>
            <div className="ms-auto d-flex align-items-center">
              {userName ? (
                <button
                  className="btn btn-link fw-bold me-3"
                  style={{ fontSize: '17px' }}
                  onClick={handleLogout}
                >
                  Welcome, {userName} (Logout)
                </button>
              ) : (
                <a
                  href="#"
                  id="login-btn"
                  className="btn btn-link fw-bold me-3"
                  style={{ fontSize: '17px' }}
                  onClick={handleLoginClick}
                >
                  Đăng nhập
                </a>
              )}
              <box-icon
                name="user-circle"
                style={{ width: '26px', height: '26px', cursor: 'pointer' }}
                onClick={handleUserIconClick}
              ></box-icon>
              <div className="search-form position-relative d-inline-block ms-3">
                <box-icon
                  name="search"
                  className="search-icon"
                  onClick={handleToggleSearch}
                  style={{ cursor: 'pointer', width: '26px', height: '26px', marginTop: '8px' }}
                ></box-icon>
                <input
                  type="text"
                  className={`form-control search-input position-absolute end-0 top-0 ${
                    isSearchVisible ? 'd-block' : 'd-none'
                  }`}
                  placeholder="Tìm kiếm..."
                  style={{ padding: '5px', borderRadius: '4px' }}
                />
              </div>
            </div>
          </div>
        </nav>
      </div>
      <div id="wrapper" className={isWrapperToggled ? 'toggled' : ''}>
        <div id="sidebar-wrapper" className={isSidebarActive ? 'active' : ''}>
          {loading ? (
            <div className="text-center p-4">
              <Spin size="large" />
              <p className="mt-2">Loading categories...</p>
            </div>
          ) : (
            <ul className="sidebar-nav">
              {navItems.map((item, index) => (
                <li key={`sidebar-${index}`}>
                  <a
                    href={item.path}
                    onClick={(e) => 
                      (item.component === 'category') 
                        ? handleChangeComponent(e, item.component, item.categoryData)
                        : handleChangeComponent(e, item.component)
                    }
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div
          className={`sidebar-overlay ${isSidebarActive ? 'active' : ''}`}
          onClick={handleCloseSidebar}
        ></div>
        <div className="d-none d-sm-block">
          <div>
            <h2 className="branding text-center">
              <a href="#" onClick={(e) => handleChangeComponent(e, 'homepage')}>
                The Hanoi Times
              </a>
            </h2>
            <figure className="text-center">
              <i>News Website You Can Trust</i>
            </figure>
         </div>
          <nav className="nav d-flex justify-content-around custom-nav">
            {loading ? (
              <div className="d-flex justify-content-center w-100 py-2">
                <Spin size="small" />
              </div>
            ) : (
              navItems.map((item, index) => (
                <a
                  key={`custom-${index}`}
                  href={item.path}
                  className="nav-link"
                  onClick={(e) => 
                    (item.component === 'category') 
                      ? handleChangeComponent(e, item.component, item.categoryData)
                      : handleChangeComponent(e, item.component)
                  }
                >
                  <span>{item.text}</span>
                </a>
              ))
            )}
          </nav>
        </div>
        <div className="d-block d-sm-none bg-light border-bottom sticky-top">
          <nav className="navbar navbar-expand">
            <div className="container-fluid">
              <button
                className="btn menu-toggle"
                type="button"
                onClick={handleToggleSidebar}
              >
                <i className="fa-solid fa-bars"></i>
              </button>
              <h2 className="mobile-custom-branding">
                <a href="#" onClick={(e) => handleChangeComponent(e, 'homepage')}>
                  HaNoi
                </a>
              </h2>
              <div className="ms-auto d-flex align-items-center">
                {userName ? (
                  <button
                    className="btn btn-link fw-bold me-2 text-dark"
                    style={{ fontSize: '16px' }}
                    onClick={handleLogout}
                  >
                    Welcome, {userName} (Logout)
                  </button>
                ) : (
                  <a
                    href="#"
                    id="mobile-login-btn"
                    className="btn btn-link fw-bold me-2 text-dark"
                    style={{ fontSize: '16px' }}
                    onClick={handleLoginClick}
                  >
                    Đăng nhập
                  </a>
                )}
                <box-icon
                  name="user-circle"
                  className="text-dark me-2"
                  style={{ width: '24px', height: '24px', cursor: 'pointer' }}
                  onClick={handleUserIconClick}
                ></box-icon>
                <div className="mobile-inter search-form position-relative d-inline-block ms-3">
                  <box-icon
                    name="search"
                    className="search-icon"
                    onClick={handleToggleSearch}
                    style={{ cursor: 'pointer', width: '26px', height: '26px', marginTop: '8px' }}
                  ></box-icon>
                  <input
                    type="text"
                    className={`form-control search-input position-absolute end-0 top-0 ${
                      isSearchVisible ? 'd-block' : 'd-none'
                    }`}
                    placeholder="Tìm kiếm..."
                    style={{ padding: '5px', borderRadius: '4px' }}
                  />
                </div>
              </div>
            </div>
          </nav>
        </div>
        {renderCurrentComponent()}
      </div>
    </>
  );
};

export default Navigation;