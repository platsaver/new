import React, { useState, useEffect } from 'react';
import { Button, Card, Table, Modal, Form, Input, message, Typography, Empty, Tabs, Select } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import ThoiSu from '../ThoiSu'; // Đường dẫn đến component ThoiSu (điều chỉnh theo thư mục thực)

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [previewCategory, setPreviewCategory] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('categories');
  const [form] = Form.useForm();
  const [subForm] = Form.useForm();

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
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
        throw new Error(`HTTP error ${response.status}: Failed to fetch categories`);
      }

      const data = await response.json();
      console.log('Fetched categories:', data);

      // Extract and validate categories
      const categoriesData = Array.isArray(data.categories) ? data.categories : [];
      // Map lowercase field names to camelCase
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

      console.log('Mapped categories:', validCategories); // Debug mapped data
      setCategories(validCategories);
      if (validCategories.length === 0 && categoriesData.length > 0) {
        message.warning('No valid categories found in the response');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      message.error(`Error fetching categories: ${error.message}`);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subcategories
  const fetchSubcategories = async () => {
    setSubLoading(true);
    try {
      const url = `http://localhost:3000/api/subcategories?t=${Date.now()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: Failed to fetch subcategories`);
      }

      const data = await response.json();
      console.log('Fetched subcategories:', data);

      // Extract and validate subcategories
      const subcategoriesData = Array.isArray(data.data) ? data.data : [];
      const validSubcategories = subcategoriesData
        .filter((sub) => sub && sub.subcategoryid && sub.subcategoryname)
        .map((sub) => ({
          SubCategoryID: sub.subcategoryid,
          CategoryID: sub.categoryid,
          SubCategoryName: sub.subcategoryname,
          BannerURL: sub.bannerurl || null,
          CategoryName: sub.categoryname || 'Unknown Category',
        }));

      console.log('Mapped subcategories:', validSubcategories); // Debug mapped data
      setSubcategories(validSubcategories);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      message.error(`Error fetching subcategories: ${error.message}`);
      setSubcategories([]);
    } finally {
      setSubLoading(false);
    }
  };

  // Load categories and subcategories on mount
  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  // Open modal for adding/editing category
  const showModal = (category = null) => {
    setEditingCategory(category);
    if (category) {
      form.setFieldsValue({ 
        CategoryName: category.CategoryName,
        BannerURL: category.BannerURL || '' 
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Open modal for adding/editing subcategory
  const showSubModal = (subcategory = null) => {
    setEditingSubcategory(subcategory);
    if (subcategory) {
      subForm.setFieldsValue({
        CategoryID: subcategory.CategoryID,
        SubCategoryName: subcategory.SubCategoryName,
        BannerURL: subcategory.BannerURL || '',
      });
    } else {
      subForm.resetFields();
    }
    setIsSubModalOpen(true);
  };

  // Notify navigation about category changes
  const notifyCategoryChange = () => {
    // Create and dispatch a custom event that will be caught by Navigation component
    const event = new CustomEvent('categoryUpdated');
    window.dispatchEvent(event);
  };

  // Handle category modal submission
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const url = editingCategory
        ? `http://localhost:3000/api/categories/${editingCategory.CategoryID}`
        : 'http://localhost:3000/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save category');
      }

      message.success(editingCategory ? 'Category updated successfully' : 'Category added successfully');
      setIsModalOpen(false);
      form.resetFields();
      setEditingCategory(null);
      fetchCategories();
      
      // Notify navigation about the change
      notifyCategoryChange();
    } catch (error) {
      message.error(`Error: ${error.message}`);
    }
  };

  // Handle subcategory modal submission
  const handleSubOk = async () => {
    try {
      const values = await subForm.validateFields();
      const url = editingSubcategory
        ? `http://localhost:3000/api/subcategories/${editingSubcategory.SubCategoryID}`
        : 'http://localhost:3000/api/subcategories';
      const method = editingSubcategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save subcategory');
      }

      message.success(editingSubcategory ? 'Subcategory updated successfully' : 'Subcategory added successfully');
      setIsSubModalOpen(false);
      subForm.resetFields();
      setEditingSubcategory(null);
      fetchSubcategories();
      fetchCategories(); // Also refresh categories to update the list of subcategories
      
      // Notify navigation about the change
      notifyCategoryChange();
    } catch (error) {
      message.error(`Error: ${error.message}`);
    }
  };

  // Delete category
  const deleteCategory = async (categoryId) => {
    if (!categoryId) {
      message.error('Cannot delete category: Invalid Category ID');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete category');
      }

      message.success('Category deleted successfully');
      fetchCategories();
      fetchSubcategories(); // Refresh subcategories as well
      
      // Notify navigation about the change
      notifyCategoryChange();
    } catch (error) {
      message.error(`Error deleting category: ${error.message}`);
    }
  };

  // Delete subcategory
  const deleteSubcategory = async (subcategoryId) => {
    if (!subcategoryId) {
      message.error('Cannot delete subcategory: Invalid Subcategory ID');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/api/subcategories/${subcategoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete subcategory');
      }

      message.success('Subcategory deleted successfully');
      fetchSubcategories();
      fetchCategories(); // Also refresh categories to update the list of subcategories
      
      // Notify navigation about the change
      notifyCategoryChange();
    } catch (error) {
      message.error(`Error deleting subcategory: ${error.message}`);
    }
  };

  // Show preview modal
  const showPreviewModal = (category) => {
    // Tìm tất cả subcategories thuộc category này để hiển thị
    const categoryWithFullSubcategories = {
      ...category,
      subCategories: subcategories.filter(sub => sub.CategoryID === category.CategoryID)
    };
    setPreviewCategory(categoryWithFullSubcategories);
    setIsPreviewModalOpen(true);
  };

  // Generate news data for preview based on category and subcategories
  const generateNewsData = (categoryName, subcategories = []) => {
    const baseNews = [
      {
        imageUrl: "https://i1-vnexpress.vnecdn.net/2025/03/17/ae640bbd121aa344fa0b-174218577-4142-6528-1742185843.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=jKQ7WgLITYqJ_GIzCkHAaw",
        title: `${categoryName} - Tin tức 1`,
        link: "#",
        subcategory: subcategories.length > 0 ? subcategories[0].SubCategoryName : null
      },
      {
        imageUrl: "https://i1-vnexpress.vnecdn.net/2025/03/16/z6316531565304-b93998f3eb029f4-8480-2428-1742140669.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=eD0BPeHJlJPeqGJOaGVszQ",
        title: `${categoryName} - Tin tức 2`,
        link: "#",
        subcategory: subcategories.length > 1 ? subcategories[1].SubCategoryName : null
      },
      {
        imageUrl: "https://i1-vnexpress.vnecdn.net/2025/03/16/phoicanhkientruc-1742137749-3866-1742138502.png?w=240&h=144&q=100&dpr=2&fit=crop&s=wAsU4w9VOKCRrimOCckH1w",
        title: `${categoryName} - Tin tức 3`,
        link: "#",
        subcategory: subcategories.length > 0 ? subcategories[0].SubCategoryName : null
      },
      {
        imageUrl: "https://i1-vnexpress.vnecdn.net/2025/03/16/fcdcd7a1273f9661cf2e-174212554-8326-4167-1742125678.jpg?w=240&h=144&q=100&dpr=2&fit=crop&s=Ns1MsOG8swGT7TIS-g1oHQ",
        title: `${categoryName} - Tin tức 4`,
        link: "#",
        subcategory: subcategories.length > 1 ? subcategories[1].SubCategoryName : null
      }
    ];

    return baseNews;
  };

  // Custom CategorySection component that mimics the one in ThoiSu
  const CategorySection = ({ title, subcategoriesData, articles }) => {
    // Group articles by subcategory if available
    const groupedArticles = {};
    
    if (subcategoriesData && subcategoriesData.length > 0) {
      // Initialize with empty arrays for each subcategory
      subcategoriesData.forEach(sub => {
        groupedArticles[sub.SubCategoryName] = [];
      });
      
      // Add articles to their subcategories
      articles.forEach(article => {
        if (article.subcategory && groupedArticles[article.subcategory]) {
          groupedArticles[article.subcategory].push(article);
        } else {
          // If no subcategory or not found, add to 'General'
          if (!groupedArticles['General']) {
            groupedArticles['General'] = [];
          }
          groupedArticles['General'].push(article);
        }
      });
    } else {
      // If no subcategories, put all articles under the category name
      groupedArticles[title] = articles;
    }

    return (
      <div className="category-section" style={{ marginBottom: '20px' }}>
        <h2>{title}</h2>
        {Object.keys(groupedArticles).map((subCategoryName, index) => (
          <div key={index} style={{ marginBottom: '15px' }}>
            {/* Only show subcategory title if it's not the main category and has articles */}
            {subCategoryName !== title && groupedArticles[subCategoryName].length > 0 && (
              <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '5px' }}>{subCategoryName}</h3>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
              {groupedArticles[subCategoryName].map((article, articleIndex) => (
                <div key={articleIndex} style={{ width: '48%', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <img 
                      src={article.imageUrl} 
                      alt={article.title} 
                      style={{ width: '120px', height: '80px', objectFit: 'cover' }}
                    />
                    <div>
                      <h4 style={{ margin: '0 0 5px 0' }}>{article.title}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Enhanced SubcategorySection component to show subcategories in preview
  const SubcategorySection = ({ subcategories }) => {
    if (!subcategories || subcategories.length === 0) {
      return <p>No subcategories available</p>;
    }
    
    return (
      <div className="subcategory-section">
        <h3>Subcategories</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {subcategories.map((subcategory) => (
            <div 
              key={subcategory.SubCategoryID} 
              style={{ 
                padding: '8px 15px', 
                backgroundColor: '#f0f2f5', 
                borderRadius: '4px',
                marginBottom: '10px'
              }}
            >
              {subcategory.SubCategoryName}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Table columns for categories
  const categoryColumns = [
    { title: 'ID', dataIndex: 'CategoryID', key: 'CategoryID' },
    { title: 'Name', dataIndex: 'CategoryName', key: 'CategoryName' },
    {
      title: 'Banner URL',
      dataIndex: 'BannerURL',
      key: 'BannerURL',
      render: (url) => (url ? url : 'No banner'),
    },
    {
      title: 'Subcategories',
      dataIndex: 'subCategories',
      key: 'subCategories',
      render: (subCategories) => {
        if (!subCategories || !Array.isArray(subCategories) || subCategories.length === 0) {
          return 'No subcategories';
        }

        const validSubcategories = subCategories.filter(
          (sub) => sub && sub.SubCategoryID && sub.SubCategoryName
        );

        if (validSubcategories.length === 0) {
          return 'No subcategories';
        }

        return (
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {validSubcategories.map((sub) => (
              <li key={sub.SubCategoryID}>{sub.SubCategoryName}</li>
            ))}
          </ul>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            icon={<EyeOutlined />}
            onClick={() => showPreviewModal(record)}
            style={{ marginRight: 8 }}
          >
            Preview
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => deleteCategory(record.CategoryID)}
          >
            Delete
          </Button>
          <Button
            icon={<PlusOutlined />}
            type="dashed"
            onClick={() => {
              subForm.setFieldsValue({ CategoryID: record.CategoryID });
              showSubModal();
            }}
            style={{ marginLeft: 8 }}
          >
            Add Sub
          </Button>
        </>
      ),
    },
  ];

  // Table columns for subcategories
  const subcategoryColumns = [
    { title: 'ID', dataIndex: 'SubCategoryID', key: 'SubCategoryID' },
    { title: 'Category', dataIndex: 'CategoryName', key: 'CategoryName' },
    { title: 'Name', dataIndex: 'SubCategoryName', key: 'SubCategoryName' },
    {
      title: 'Banner URL',
      dataIndex: 'BannerURL',
      key: 'BannerURL',
      render: (url) => (url ? url : 'No banner'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => showSubModal(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => deleteSubcategory(record.SubCategoryID)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Card
      title={<Title level={4} style={{ color: '#4e73df' }}>Category & Subcategory Management</Title>}
      bordered={false}
      style={{
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        background: '#fff',
      }}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Categories" key="categories">
          <Button
            type="primary"
            onClick={() => showModal()}
            style={{ marginBottom: 16, backgroundColor: '#4e73df' }}
          >
            Add Category
          </Button>
          <Table
            columns={categoryColumns}
            dataSource={categories}
            loading={loading}
            rowKey="CategoryID"
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: (
                <Empty
                  description="No categories found"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
          />
        </TabPane>
        <TabPane tab="Subcategories" key="subcategories">
          <Button
            type="primary"
            onClick={() => showSubModal()}
            style={{ marginBottom: 16, backgroundColor: '#4e73df' }}
          >
            Add Subcategory
          </Button>
          <Table
            columns={subcategoryColumns}
            dataSource={subcategories}
            loading={subLoading}
            rowKey="SubCategoryID"
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: (
                <Empty
                  description="No subcategories found"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
          />
        </TabPane>
      </Tabs>

      {/* Category Modal */}
      <Modal
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
          form.resetFields();
        }}
        okText={editingCategory ? 'Update' : 'Add'}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="CategoryName"
            label="Category Name"
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
          <Form.Item
            name="BannerURL"
            label="Banner URL"
          >
            <Input placeholder="Enter banner URL (optional)" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Subcategory Modal */}
      <Modal
        title={editingSubcategory ? 'Edit Subcategory' : 'Add Subcategory'}
        open={isSubModalOpen}
        onOk={handleSubOk}
        onCancel={() => {
          setIsSubModalOpen(false);
          setEditingSubcategory(null);
          subForm.resetFields();
        }}
        okText={editingSubcategory ? 'Update' : 'Add'}
      >
        <Form form={subForm} layout="vertical">
          <Form.Item
            name="CategoryID"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select placeholder="Select a category">
              {categories.map(category => (
                <Option key={category.CategoryID} value={category.CategoryID}>
                  {category.CategoryName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="SubCategoryName"
            label="Subcategory Name"
            rules={[{ required: true, message: 'Please enter subcategory name' }]}
          >
            <Input placeholder="Enter subcategory name" />
          </Form.Item>
          <Form.Item
            name="BannerURL"
            label="Banner URL"
          >
            <Input placeholder="Enter banner URL (optional)" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Preview Modal - Enhanced to show ThoiSu component with subcategories */}
      <Modal
        title={`Category Preview: ${previewCategory?.CategoryName || ''}`}
        open={isPreviewModalOpen}
        onCancel={() => setIsPreviewModalOpen(false)}
        width={800}
        footer={null}
      >
        <Tabs defaultActiveKey="preview">
          <TabPane tab="ThoiSu Component Preview" key="preview">
            <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '5px' }}>
              {previewCategory && (
                <ThoiSu 
                  previewCategory={previewCategory}
                  previewSubcategories={previewCategory.subCategories}
                />
              )}
            </div>
          </TabPane>
          <TabPane tab="Styled Preview" key="styled">
            <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '5px' }}>
              {previewCategory && (
                <>
                  <h2 style={{ borderBottom: '2px solid #4e73df', paddingBottom: '10px' }}>
                    {previewCategory.CategoryName}
                  </h2>
                  
                  <SubcategorySection subcategories={previewCategory.subCategories} />
                  
                  <CategorySection 
                    title={previewCategory.CategoryName}
                    subcategoriesData={previewCategory.subCategories}
                    articles={generateNewsData(previewCategory.CategoryName, previewCategory.subCategories)}
                  />
                </>
              )}
            </div>
          </TabPane>
          <TabPane tab="Category Details" key="details">
            <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '5px' }}>
              {previewCategory && (
                <>
                  <p><strong>Category ID:</strong> {previewCategory.CategoryID}</p>
                  <p><strong>Category Name:</strong> {previewCategory.CategoryName}</p>
                  <p><strong>Banner URL:</strong> {previewCategory.BannerURL || 'No banner'}</p>
                  <p><strong>Subcategories:</strong></p>
                  {previewCategory.subCategories && previewCategory.subCategories.length > 0 ? (
                    <ul>
                      {previewCategory.subCategories.map(sub => (
                        <li key={sub.SubCategoryID}>
                          {sub.SubCategoryName} (ID: {sub.SubCategoryID})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No subcategories</p>
                  )}
                </>
              )}
            </div>
          </TabPane>
        </Tabs>
      </Modal>
    </Card>
  );
};

export default CategoryManagement;