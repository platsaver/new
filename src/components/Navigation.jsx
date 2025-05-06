import { useState, useEffect, useRef } from 'react';
import 'boxicons/css/boxicons.min.css';
import 'boxicons';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@ant-design/v5-patch-for-react-19';
import '../App.css';
import HomePage from '../Homepage.jsx';
import ThoiSu from '../ThoiSu.jsx';
import LoginForm from './LoginForm.jsx';
import Admin from '../management_pages/Admin.jsx';
import SearchResults from './SearchResult.jsx';
import ArticleDetail from '../components/ArticleDetail.jsx';
import SubCategory from '../SubCategory.jsx';
import { message, Spin } from 'antd';

const Navigation = ({
  currentComponent,
  setCurrentComponent,
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  categories = [],
  loading,
}) => {
  const [isSidebarActive, setSidebarActive] = useState(false);
  const [isWrapperToggled, setWrapperToggled] = useState(false);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [previousComponent, setPreviousComponent] = useState('homepage');
  const [previousCategory, setPreviousCategory] = useState(null);
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [showAdminPage, setShowAdminPage] = useState(false);
  const [userName, setUserName] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, limit: 10, offset: 0, pages: 1 });
  const [selectedPostId, setSelectedPostId] = useState(localStorage.getItem('selectedPostID') || null);

  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const getNavItems = () => {
    const baseNavItems = [
      { path: '#', text: 'Trang chủ', component: 'homepage' },
    ];

    const categoryNavItems = (categories || []).map(category => ({
      path: '#',
      text: category.CategoryName,
      component: 'category',
      categoryId: category.CategoryID,
      categoryData: category,
    }));

    const adminItem = userName ? [{ path: '#', text: 'Admin', component: 'admin' }] : [];

    return [...baseNavItems, ...categoryNavItems, ...adminItem];
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      message.warning('Please enter a search keyword.');
      return;
    }

    try {
      setPreviousComponent(currentComponent);
      setPreviousCategory(selectedCategory);

      const response = await fetch(`http://localhost:3000/api/posts/search?keyword=${encodeURIComponent(searchQuery)}&limit=10&offset=0`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: Failed to fetch search results`);
      }

      const data = await response.json();
      setSearchResults(data.posts || []);
      setPagination(data.pagination || { total: 0, limit: 10, offset: 0, pages: 1 });
      setCurrentComponent('search');
      setSearchVisible(false);
    } catch (error) {
      console.error('Error searching posts:', error);
      message.error(`Error searching posts: ${error.message}`);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target)
      ) {
        setSearchVisible(false);
      }
    };

    if (isSearchVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchVisible]);

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
    
    const handleUserLoginEvent = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('userLoggedIn', handleUserLoginEvent);
    
    return () => {
      window.removeEventListener('userLoggedIn', handleUserLoginEvent);
      document.body.classList.remove('sidebar-open');
    };
  }, [currentComponent, showAdminPage]);

  useEffect(() => {
    const handleArticleSelected = () => {
      const newPostId = localStorage.getItem('selectedPostID');
      setSelectedPostId(newPostId);
      if (newPostId && currentComponent !== 'articleDetail') {
        setCurrentComponent('articleDetail');
      }
    };

    window.addEventListener('articleSelected', handleArticleSelected);

    return () => {
      window.removeEventListener('articleSelected', handleArticleSelected);
    };
  }, [currentComponent, setCurrentComponent]);

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
  };

  const handleBackFromSearch = () => {
    setCurrentComponent(previousComponent);
    setSelectedCategory(previousCategory);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleLoginSuccess = (username) => {
    setUserName(username);
    setShowLoginPage(false);
    window.dispatchEvent(new Event('userLoggedIn'));
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
        
        window.dispatchEvent(new Event('userLoggedOut'));
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
        return <ThoiSu previewCategory={selectedCategory} setCurrentComponent={setCurrentComponent} />;
      case 'subCategory':
        return selectedSubCategory ? (
          <SubCategory
            subCategoryId={selectedSubCategory.SubCategoryID}
            title={selectedSubCategory.SubCategoryName}
            setCurrentComponent={setCurrentComponent}
          />
        ) : (
          <div>No subcategory selected</div>
        );
      case 'search':
        return (
          <SearchResults
            results={searchResults}
            pagination={pagination}
            onBack={handleBackFromSearch}
            setCurrentComponent={setCurrentComponent}
          />
        );
      case 'articleDetail':
        return <ArticleDetail postId={selectedPostId} setCurrentComponent={setCurrentComponent} />;
      case 'homepage':
      default:
        return <HomePage setCurrentComponent={setCurrentComponent} />;
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
        <Admin onCategoryChange={() => window.dispatchEvent(new Event('categoryUpdated'))} />
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
                  className="btn btn-link fw-bold me-3 d-none d-md-block"
                  style={{ fontSize: '17px' }}
                  onClick={handleLogout}
                >
                  Welcome, {userName} (Logout)
                </button>
              ) : (
                <a
                  href="#"
                  id="login-btn"
                  className="btn btn-link fw-bold me-3 d-none d-md-block"
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
              <div className="d-flex align-items-center ms-3" ref={searchRef}>
                <box-icon
                  name="search"
                  className="search-icon me-2"
                  onClick={handleToggleSearch}
                  style={{ cursor: 'pointer', width: '26px', height: '26px' }}
                ></box-icon>
                {isSearchVisible && (
                  <form className="d-flex" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Tìm kiếm..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ width: '200px' }}
                    />
                  </form>
                )}
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
                      item.component === 'category'
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
                    item.component === 'category'
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
                    className="btn btn-link fw-bold me-2 text-dark d-none d-md-block"
                    style={{ fontSize: '16px' }}
                    onClick={handleLogout}
                  >
                    Welcome, {userName} (Logout)
                  </button>
                ) : (
                  <a
                    href="#"
                    id="mobile-login-btn"
                    className="btn btn-link fw-bold me-2 text-dark d-none d-md-block"
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
                <div className="d-flex align-items-center ms-3" ref={mobileSearchRef}>
                  <box-icon
                    name="search"
                    className="search-icon me-2"
                    onClick={handleToggleSearch}
                    style={{ cursor: 'pointer', width: '26px', height: '26px' }}
                  ></box-icon>
                  {isSearchVisible && (
                    <form className="d-flex" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '150px' }}
                      />
                    </form>
                  )}
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