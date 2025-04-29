import React, { useState, useEffect } from "react";
import { Button, Modal, List, Spin, Alert, Input, Select, Checkbox, message } from "antd";
import CKEditor1 from './CKEditor1.jsx';
import '@ant-design/v5-patch-for-react-19';

const { Option } = Select;

const ManagePostsButton = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [subCategoryId, setSubCategoryId] = useState(null);
  const [status, setStatus] = useState("Draft");
  const [featured, setFeatured] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

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
    setCategoryId(categoryId);
    const filtered = subcategories.filter(sub => sub.categoryid === categoryId);
    setFilteredSubcategories(filtered);
    setSubCategoryId(null);
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/posts");
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Fetched posts:", data); // Debug API response
      // Normalize post objects to ensure `id` field
      const normalizedPosts = Array.isArray(data)
        ? data.map(post => ({
            id: post.id || post.PostID || post.post_id || post.postid, // Handle possible field names
            title: post.title,
            content: post.content,
            categoryid: post.categoryid,
            subcategoryid: post.subcategoryid,
            status: post.status,
            featured: post.featured,
            createdatdate: post.createdatdate,
            updatedatdate: post.updatedatdate,
            description: post.description
          }))
        : [];
      console.log("Normalized posts:", normalizedPosts); // Debug normalized data
      setPosts(normalizedPosts);
    } catch (err) {
      setError(err.message);
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
  };

  const handleEditModalOpen = (post) => {
    if (!post || !post.id) {
      message.error("Cannot edit post: Post ID is missing");
      return;
    }
    console.log("Editing post:", post); // Debug post object
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
    setCategoryId(post.categoryid || null);
    setSubCategoryId(post.subcategoryid || null);
    setStatus(post.status || "Draft");
    setFeatured(post.featured || false);
    const filtered = subcategories.filter(sub => sub.categoryid === post.categoryid);
    setFilteredSubcategories(filtered);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingPost(null);
    setTitle("");
    setContent("");
    setCategoryId(null);
    setSubCategoryId(null);
    setStatus("Draft");
    setFeatured(false);
    setFilteredSubcategories([]);
  };

  const updatePost = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error("User not logged in");
      }
      if (!editingPost || !editingPost.id) {
        throw new Error("Invalid post: Post ID is missing");
      }

      const response = await fetch(`http://localhost:3000/posts/${editingPost.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: userId,
          categoryid: categoryId || null,
          subcategoryid: subCategoryId || null,
          title,
          content,
          status,
          featured,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to update post");
      }

      message.success("Post updated successfully!");
      setIsEditModalOpen(false);
      setEditingPost(null);
      setTitle("");
      setContent("");
      setCategoryId(null);
      setSubCategoryId(null);
      setStatus("Draft");
      setFeatured(false);
      setFilteredSubcategories([]);
      fetchPosts();
    } catch (err) {
      message.error(`Error updating post: ${err.message}`);
    }
  };

  const deletePost = async (postId) => {
    if (!postId || isNaN(parseInt(postId))) {
      message.error('Cannot delete post: Invalid or missing Post ID');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || `Failed to delete post: ${response.statusText}`);
      }

      message.success('Post deleted successfully!');
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err) {
      message.error(`Cannot delete post: ${err.message}`);
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
                <List.Item.Meta title={item.title} description={item.description} />
              </List.Item>
            )}
          />
        )}
      </Modal>
      <Modal
        title="Edit Post"
        open={isEditModalOpen}
        onOk={updatePost}
        onCancel={handleEditModalClose}
        okText="Save Changes"
        cancelText="Cancel"
        width="80%"
      >
        <Input
          placeholder="Tiêu đề bài viết"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Select
          placeholder="Select a category"
          value={categoryId}
          onChange={handleCategoryChange}
          style={{ width: "100%", marginBottom: 16 }}
          allowClear
        >
          {Array.isArray(categories) && categories.map(category => (
            <Option key={category.categoryid} value={category.categoryid}>
              {category.categoryname}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Select a subcategory"
          value={subCategoryId}
          onChange={(value) => setSubCategoryId(value || null)}
          style={{ width: "100%", marginBottom: 16 }}
          allowClear
          disabled={filteredSubcategories.length === 0}
        >
          {Array.isArray(filteredSubcategories) && filteredSubcategories.map(sub => (
            <Option key={sub.subcategoryid} value={sub.subcategoryid}>
              {sub.subcategoryname}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Status"
          value={status}
          onChange={(value) => setStatus(value)}
          style={{ width: "100%", marginBottom: 16 }}
        >
          <Option value="Draft">Draft</Option>
          <Option value="Published">Published</Option>
          <Option value="Archived">Archived</Option>
        </Select>
        <Checkbox
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          style={{ marginBottom: 16 }}
        >
          Featured
        </Checkbox>
        <CKEditor1
          onChange={(event, editor) => {
            const data = editor.getData();
            setContent(data);
          }}
          data={content}
        />
      </Modal>
    </>
  );
};

export default ManagePostsButton;