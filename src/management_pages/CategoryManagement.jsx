import React, { useState, useEffect } from 'react';
import { Button, Card, Table, Modal, Form, Input, message, Typography, Empty, Tabs } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import ThoiSu from '../ThoiSu'; // Đường dẫn đến component ThoiSu (điều chỉnh theo thư mục thực)

const { Title } = Typography;
const { TabPane } = Tabs;

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [previewCategory, setPreviewCategory] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [form] = Form.useForm();

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

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Open modal for adding/editing
  const showModal = (category = null) => {
    setEditingCategory(category);
    if (category) {
      form.setFieldsValue({ CategoryName: category.CategoryName });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Notify navigation about category changes
  const notifyCategoryChange = () => {
    // Create and dispatch a custom event that will be caught by Navigation component
    const event = new CustomEvent('categoryUpdated');
    window.dispatchEvent(event);
  };

  // Handle modal submission
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
      
      // Notify navigation about the change
      notifyCategoryChange();
    } catch (error) {
      message.error(`Error deleting category: ${error.message}`);
    }
  };

  // Show preview modal
  const showPreviewModal = (category) => {
    setPreviewCategory(category);
    setIsPreviewModalOpen(true);
  };

  // Generate dummy news data for preview based on category
  const generateDummyNewsData = (categoryName) => {
    return [
      {
        imageUrl: "https://i1-vnexpress.vnecdn.net/2025/03/17/ae640bbd121aa344fa0b-174218577-4142-6528-1742185843.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=jKQ7WgLITYqJ_GIzCkHAaw",
        title: `${categoryName} News Item 1`,
        link: "#"
      },
      {
        imageUrl: "https://i1-vnexpress.vnecdn.net/2025/03/16/z6316531565304-b93998f3eb029f4-8480-2428-1742140669.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=eD0BPeHJlJPeqGJOaGVszQ",
        title: `${categoryName} News Item 2`,
        link: "#"
      },
      {
        imageUrl: "https://i1-vnexpress.vnecdn.net/2025/03/16/phoicanhkientruc-1742137749-3866-1742138502.png?w=240&h=144&q=100&dpr=2&fit=crop&s=wAsU4w9VOKCRrimOCckH1w",
        title: `${categoryName} News Item 3`,
        link: "#"
      },
      {
        imageUrl: "https://i1-vnexpress.vnecdn.net/2025/03/16/fcdcd7a1273f9661cf2e-174212554-8326-4167-1742125678.jpg?w=240&h=144&q=100&dpr=2&fit=crop&s=Ns1MsOG8swGT7TIS-g1oHQ",
        title: `${categoryName} News Item 4`,
        link: "#"
      }
    ];
  };

  // Table columns
  const columns = [
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
        </>
      ),
    },
  ];

  // Custom CategorySection component that mimics the one in ThoiSu
  const CategorySection = ({ title, articles }) => (
    <div className="category-section" style={{ marginBottom: '20px' }}>
      <h2>{title}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
        {articles.map((article, index) => (
          <div key={index} style={{ width: '48%', marginBottom: '15px' }}>
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
  );

  return (
    <Card
      title={<Title level={4} style={{ color: '#4e73df' }}>Category Management</Title>}
      bordered={false}
      style={{
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        background: '#fff',
      }}
    >
      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ marginBottom: 16, backgroundColor: '#4e73df' }}
      >
        Add Category
      </Button>
      <Table
        columns={columns}
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
        </Form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        title={`Category Preview: ${previewCategory?.CategoryName || ''}`}
        open={isPreviewModalOpen}
        onCancel={() => setIsPreviewModalOpen(false)}
        width={800}
        footer={null}
      >
        <Tabs defaultActiveKey="preview">
          <TabPane tab="Styled Preview" key="preview">
            <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '5px' }}>
              {previewCategory && (
                <>
                  <CategorySection 
                    title={previewCategory.CategoryName}
                    articles={generateDummyNewsData(previewCategory.CategoryName)}
                  />
                </>
              )}
            </div>
          </TabPane>
          <TabPane tab="ThoiSu Component" key="component">
            <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '5px' }}>
              {previewCategory && (
                <div className="thoi-su-preview">
                  <ThoiSu category={previewCategory.CategoryName} />
                </div>
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