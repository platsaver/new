import React, { useState, useEffect } from "react";
import { Button, Modal, List, Spin, Alert, Form, Input, Select, Checkbox, message } from "antd";
import CKEditor1 from './CKEditor1.jsx';
import '@ant-design/v5-patch-for-react-19';

const { Option } = Select;

const ManagePostsButton = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/categories");
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }
      const data = await response.json();
      setCategories(Array.isArray(data.categories) ? data.categories : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Failed to load categories");
      setCategories([]);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/subcategories");
      if (!response.ok) {
        throw new Error(`Failed to fetch subcategories: ${response.statusText}`);
      }
      const data = await response.json();
      setSubcategories(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      message.error("Failed to load subcategories");
      setSubcategories([]);
    }
  };

  const handleCategoryChange = (categoryId) => {
    form.setFieldsValue({ categoryId, subCategoryId: null });
    const filtered = subcategories.filter(sub => sub.categoryid === categoryId);
    setFilteredSubcategories(filtered);
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:3000/posts");
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Fetched posts:", data);
      const normalizedPosts = Array.isArray(data)
        ? data.map(post => ({
            id: post.id || post.postid || post.PostID,
            title: post.title || "Untitled",
            content: post.content || "",
            categoryid: post.categoryid || null,
            subcategoryid: post.subcategoryid || null,
            status: post.status || "Draft",
            featured: !!post.featured,
            createdatdate: post.createdatdate,
            updatedatdate: post.updatedatdate,
            description: post.description || post.content?.substring(0, 100) || ""
          }))
        : [];
      console.log("Normalized posts:", normalizedPosts);
      setPosts(normalizedPosts);
    } catch (err) {
      setError(err.message);
      message.error(`Error loading posts: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewModalOpen = () => {
    setIsViewModalOpen(true);
    fetchPosts();
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setPosts([]);
    setError(null);
  };

  const handleEditModalOpen = (post) => {
    if (!post || !post.id) {
      message.error("Cannot edit post: Post ID is missing");
      return;
    }
    console.log("Editing post:", post);
    form.setFieldsValue({
      postId: post.id,
      title: post.title,
      content: post.content,
      categoryId: post.categoryid,
      subCategoryId: post.subcategoryid,
      status: post.status,
      featured: post.featured
    });
    const filtered = subcategories.filter(sub => sub.categoryid === post.categoryid);
    setFilteredSubcategories(filtered);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    form.resetFields();
    setFilteredSubcategories([]);
    setEditLoading(false);
  };

  const updatePost = async (values) => {
    try {
      setEditLoading(true);
      const userId = localStorage.getItem('userId');
      if (!userId || isNaN(parseInt(userId))) {
        throw new Error("User not logged in or invalid User ID");
      }
      const postId = values.postId;
      if (!postId || isNaN(parseInt(postId))) {
        throw new Error("Invalid post: Post ID is missing");
      }

      const response = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          userid: parseInt(userId),
          categoryid: values.categoryId || null,
          subcategoryid: values.subCategoryId || null,
          title: values.title.trim(),
          content: values.content.trim(),
          status: values.status,
          featured: values.featured
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || `Failed to update post: ${response.statusText}`);
      }

      const updatedPost = await response.json();
      console.log("Updated post:", updatedPost);
      message.success("Post updated successfully!");
      setIsEditModalOpen(false);
      form.resetFields();
      setFilteredSubcategories([]);
      setPosts(posts.map(post => post.id === updatedPost.id ? {
        ...post,
        title: updatedPost.title,
        content: updatedPost.content,
        categoryid: updatedPost.categoryid,
        subcategoryid: updatedPost.subcategoryid,
        status: updatedPost.status,
        featured: updatedPost.featured,
        updatedatdate: updatedPost.updatedatdate,
        description: updatedPost.content.substring(0, 100) + "..."
      } : post));
    } catch (err) {
      console.error("Error updating post:", err);
      message.error(`Error updating post: ${err.message}`);
    } finally {
      setEditLoading(false);
    }
  };

  const deletePost = async (postId) => {
    if (!postId || isNaN(parseInt(postId))) {
      message.error('Cannot delete post: Invalid or missing Post ID');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || `Failed to delete post: ${response.statusText}`);
      }

      message.success('Post deleted successfully!');
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
      message.error(`Cannot delete post: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={handleViewModalOpen}>Edit Posts</Button>
      <Modal
        title="Danh sách bài viết"
        open={isViewModalOpen}
        onCancel={handleViewModalClose}
        footer={null}
        width="80%"
      >
        {loading ? (
          <Spin tip="Đang tải bài viết..." />
        ) : error ? (
          <Alert message="Lỗi" description={error} type="error" showIcon />
        ) : posts.length === 0 ? (
          <Alert message="Không có bài viết nào" type="info" showIcon />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={posts}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button type="primary" onClick={() => handleEditModalOpen(item)}>
                    Edit
                  </Button>,
                  <Button type="danger" onClick={() => deletePost(item.id)}>
                    Delete
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={item.title}
                  description={item.description || item.content.substring(0, 100) + "..."}
                />
              </List.Item>
            )}
          />
        )}
      </Modal>
      <Modal
        title="Edit Post"
        open={isEditModalOpen}
        onOk={() => form.submit()}
        onCancel={handleEditModalClose}
        okText="Save Changes"
        cancelText="Cancel"
        width="80%"
        confirmLoading={editLoading}
      >
        <Form
          form={form}
          onFinish={updatePost}
          layout="vertical"
        >
          <Form.Item name="postId" noStyle>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            name="title"
            label="Tiêu đề bài viết"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }, { max: 255, message: "Tiêu đề không được vượt quá 255 ký tự" }]}
          >
            <Input placeholder="Tiêu đề bài viết" />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="Danh mục"
          >
            <Select
              placeholder="Chọn danh mục"
              onChange={handleCategoryChange}
              allowClear
            >
              {Array.isArray(categories) && categories.map(category => (
                <Option key={category.categoryid} value={category.categoryid}>
                  {category.categoryname}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="subCategoryId"
            label="Danh mục con"
          >
            <Select
              placeholder="Chọn danh mục con"
              allowClear
              disabled={filteredSubcategories.length === 0}
            >
              {Array.isArray(filteredSubcategories) && filteredSubcategories.map(sub => (
                <Option key={sub.subcategoryid} value={sub.subcategoryid}>
                  {sub.subcategoryname}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="Draft">Draft</Option>
              <Option value="Published">Published</Option>
              <Option value="Archived">Archived</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="featured"
            valuePropName="checked"
            label="Nổi bật"
          >
            <Checkbox>Nổi bật</Checkbox>
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          >
            <CKEditor1
              data={form.getFieldValue('content') || ""}
              onChange={(data) => {
                form.setFieldsValue({ content: data });
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ManagePostsButton;