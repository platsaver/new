import React, { useState, useEffect } from 'react';
import { Button, Card, Table, Modal, Form, Input, message, Typography, Empty, Tabs, Select } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import ThoiSu from '../ThoiSu'; 

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
  const [activeTab, setActiveTab] = useState('categories');
  const [form] = Form.useForm();
  const [subForm] = Form.useForm();
  const [creatingCategory, setCreatingCategory] = useState(false);

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
          PageURL: cat.pageurl || `/category/${cat.categoryid}`,
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
        BannerURL: category.BannerURL || '',
        PageURL: category.PageURL || `/category/${category.CategoryID}`
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        PageURL: `/category/new-category` // Default value that will be updated after save
      });
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

  // Create a dynamic page for a category
  const createCategoryPage = async (categoryId, categoryName) => {
    try {
      const pageURL = `/category/${categoryId}`;
      
      // Get all subcategories for this category
      const categorySubcategories = subcategories.filter(
        (sub) => sub.CategoryID === categoryId
      );
      
      // Here you would typically call an API to create a new page
      // For now, we'll just simulate success and return the URL
      console.log(`Created page for category: ${categoryName} at ${pageURL}`);
      console.log('Subcategories included:', categorySubcategories);
      
      // In a real implementation, you would save this page to your server/CMS
      // For example, using an API call like:
      /*
      const response = await fetch('http://localhost:3000/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageURL,
          categoryId,
          categoryName,
          subcategories: categorySubcategories,
          template: 'ThoiSu' // Using ThoiSu.jsx as template
        }),
      });
      */
      
      return pageURL;
    } catch (error) {
      console.error('Error creating category page:', error);
      throw new Error('Failed to create category page');
    }
  };

  // Handle category modal submission
  const handleOk = async () => {
    try {
      setCreatingCategory(true);
      const values = await form.validateFields();
      
      const url = editingCategory
        ? `http://localhost:3000/api/categories/${editingCategory.CategoryID}`
        : 'http://localhost:3000/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';
      
      // First, save the category to get its ID (if new)
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save category');
      }
      
      // Get the category data from response
      const categoryData = await response.json();
      const categoryId = editingCategory ? editingCategory.CategoryID : categoryData.categoryId;
      
      if (!categoryId) {
        throw new Error('No category ID returned from server');
      }
      
      // Now create/update the category page
      const pageURL = await createCategoryPage(categoryId, values.CategoryName);
      
      // If we're creating a new category, add the page URL to the category
      if (!editingCategory && pageURL) {
        const updateResponse = await fetch(`http://localhost:3000/api/categories/${categoryId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...values, PageURL: pageURL }),
        });
        
        if (!updateResponse.ok) {
          console.warn('Warning: Failed to update category with page URL');
        }
      }

      message.success(editingCategory 
        ? 'Category updated successfully' 
        : 'Category added successfully and page created'
      );
      setIsModalOpen(false);
      form.resetFields();
      setEditingCategory(null);
      fetchCategories();
      
      // Notify navigation about the change
      notifyCategoryChange();
    } catch (error) {
      message.error(`Error: ${error.message}`);
    } finally {
      setCreatingCategory(false);
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
      
      // Get the parent category to update its page
      const category = categories.find(cat => cat.CategoryID === values.CategoryID);
      if (category) {
        // Update the category page to include the new subcategory
        await createCategoryPage(category.CategoryID, category.CategoryName);
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
      
      // You'd also want to delete the category page here
      // This would typically be done via an API call to delete the page
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
      // Find the parent category before deletion
      const subcat = subcategories.find(sub => sub.SubCategoryID === subcategoryId);
      const parentCategoryId = subcat ? subcat.CategoryID : null;
      
      const response = await fetch(`http://localhost:3000/api/subcategories/${subcategoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete subcategory');
      }

      message.success('Subcategory deleted successfully');
      
      // Update the parent category page if needed
      if (parentCategoryId) {
        const parentCategory = categories.find(cat => cat.CategoryID === parentCategoryId);
        if (parentCategory) {
          await createCategoryPage(parentCategoryId, parentCategory.CategoryName);
        }
      }
      
      fetchSubcategories();
      fetchCategories(); // Also refresh categories to update the list of subcategories
      
      // Notify navigation about the change
      notifyCategoryChange();
    } catch (error) {
      message.error(`Error deleting subcategory: ${error.message}`);
    }
  };

  // Visit the category page
  const visitCategoryPage = (pageURL) => {
    // In a real application, this would navigate to the page
    // For demonstration, we'll just log and show a message
    console.log(`Navigating to: ${pageURL}`);
    message.info(`Navigating to ${pageURL}`);
    
    // In real implementation:
    // window.open(pageURL, '_blank');
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
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
    <div className="category-management">
      <Title level={2}>Category Management</Title>
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        tabBarExtraContent={
          activeTab === 'categories' ? (
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => showModal()}
            >
              Add Category
            </Button>
          ) : (
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => showSubModal()}
            >
              Add Subcategory
            </Button>
          )
        }
      >
        <TabPane tab="Categories" key="categories">
          <Card>
            <Table
              columns={categoryColumns}
              dataSource={categories}
              rowKey="CategoryID"
              loading={loading}
              locale={{
                emptyText: <Empty description="No categories found" />,
              }}
            />
          </Card>
        </TabPane>
        <TabPane tab="Subcategories" key="subcategories">
          <Card>
            <Table
              columns={subcategoryColumns}
              dataSource={subcategories}
              rowKey="SubCategoryID"
              loading={subLoading}
              locale={{
                emptyText: <Empty description="No subcategories found" />,
              }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Category Modal */}
      <Modal
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditingCategory(null);
        }}
        confirmLoading={creatingCategory}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="CategoryName"
            label="Category Name"
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
          <Form.Item name="BannerURL" label="Banner URL">
            <Input placeholder="Enter banner image URL" />
          </Form.Item>
          <Form.Item 
            name="PageURL" 
            label="Page URL"
            extra="URL will be updated automatically for new categories after saving"
          >
            <Input 
              placeholder="Page URL" 
              disabled={!editingCategory} 
              addonBefore={editingCategory ? null : "Auto-generated: "}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Subcategory Modal */}
      <Modal
        title={editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}
        open={isSubModalOpen}
        onOk={handleSubOk}
        onCancel={() => {
          setIsSubModalOpen(false);
          subForm.resetFields();
          setEditingSubcategory(null);
        }}
      >
        <Form form={subForm} layout="vertical">
          <Form.Item
            name="CategoryID"
            label="Parent Category"
            rules={[{ required: true, message: 'Please select parent category' }]}
          >
            <Select placeholder="Select parent category">
              {categories.map((cat) => (
                <Option key={cat.CategoryID} value={cat.CategoryID}>
                  {cat.CategoryName}
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
          <Form.Item name="BannerURL" label="Banner URL">
            <Input placeholder="Enter banner image URL" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;