import React, { useState, useEffect } from "react";
import { Button, Modal, Input, Form, Select, Switch, message } from "antd";
import CKEditor1 from './CKEditor1.jsx';
import '@ant-design/v5-patch-for-react-19';

const { Option } = Select;

const AddPostsButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  // Fetch categories and subcategories when component mounts
  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data.categories) ? data.categories : []);
      } else {
        console.error("Failed to fetch categories:", response.status);
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/subcategories");
      if (response.ok) {
        const data = await response.json();
        setSubcategories(Array.isArray(data.data) ? data.data : []);
      } else {
        console.error("Failed to fetch subcategories:", response.status);
        setSubcategories([]);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]);
    }
  };

  const handleCategoryChange = (categoryId) => {
    const filtered = subcategories.filter(sub => sub.categoryid === categoryId);
    setFilteredSubcategories(filtered);
    form.setFieldValue('subcategoryid', undefined); // Reset subcategory selection
  };

  const addPost = async () => {
    try {
      const values = await form.validateFields();
      const userId = localStorage.getItem('userId');
      console.log("userId from localStorage:", userId);

      if (!userId || isNaN(parseInt(userId))) {
        message.error("User not logged in. Please log in to create a post.");
        return;
      }

      const postData = {
        ...values,
        content,
        userid: parseInt(userId),
      };

      if (!postData.title || !content.trim()) {
        message.error("Title and Content are required!");
        return;
      }

      console.log("POST request body:", postData);
      const response = await fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      console.log("Response status:", response.status, "Response OK:", response.ok);
      if (!response.ok) {
        let errorResponse;
        try {
          errorResponse = await response.json();
          console.log("Error response:", errorResponse);
        } catch (e) {
          console.error("Failed to parse error response:", e);
          throw new Error("Failed to parse error response from server");
        }
        throw new Error(errorResponse.error || "Failed to add post");
      }

      const newPost = await response.json();
      console.log("Success response data:", newPost);
      message.success({
        content: (
          <span>
            Post created successfully!{' '}
            <a href="/post" onClick={() => console.log('Navigating to post:', newPost.postID)}>
              View Post
            </a>
          </span>
        ),
        duration: 5,
      });

      // Lưu postID vào localStorage để ArticleDetail sử dụng
      localStorage.setItem('selectedPostID', newPost.postID);

      form.resetFields();
      setContent("");
      setFilteredSubcategories([]);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error in addPost:", err.message, err.stack);
      message.error(`Error adding post: ${err.message}`);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setContent("");
    setFilteredSubcategories([]);
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Add Post
      </Button>

      <Modal
        title="Add New Post"
        open={isModalOpen}
        onOk={addPost}
        onCancel={handleCancel}
        okText="Save Post"
        cancelText="Cancel"
        width="80%"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'Draft',
            featured: false,
          }}
        >
          <Form.Item
            name="title"
            label="Post Title"
            rules={[{ required: true, message: 'Please enter a title!' }]}
          >
            <Input placeholder="Post Title" />
          </Form.Item>

          <Form.Item name="categoryid" label="Category">
            <Select
              placeholder="Select a category"
              allowClear
              onChange={handleCategoryChange}
            >
              {Array.isArray(categories) && categories.map(category => (
                <Option key={category.categoryid} value={category.categoryid}>
                  {category.categoryname}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="subcategoryid" label="Subcategory">
            <Select
              placeholder="Select a subcategory"
              allowClear
            >
              {Array.isArray(filteredSubcategories) && filteredSubcategories.map(sub => (
                <Option key={sub.subcategoryid} value={sub.subcategoryid}>
                  {sub.subcategoryname}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Select placeholder="Select status">
              <Option value="Draft">Draft</Option>
              <Option value="Published">Published</Option>
              <Option value="Archived">Archived</Option>
            </Select>
          </Form.Item>

          <Form.Item name="featured" label="Featured" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="Content" required>
            <CKEditor1
              data={content}
              onChange={(newData) => setContent(newData)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddPostsButton;