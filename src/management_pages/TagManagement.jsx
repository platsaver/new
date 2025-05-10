import React, { useState, useEffect } from 'react';
import { Button, Card, Table, Modal, Form, Input, message, Typography, Empty, Select, Tabs } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, TagOutlined, LinkOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const baseUrl = 'http://localhost:3000';

const TagManagement = () => {
  const [tags, setTags] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postTags, setPostTags] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [postTagsLoading, setPostTagsLoading] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedPostIds, setSelectedPostIds] = useState([]);
  const [tagForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('1');

  // Fetch all tags
  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/tags?t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: Failed to fetch tags`);
      }

      const data = await response.json();
      const tagsData = Array.isArray(data.data) ? data.data : [];
      const validTags = tagsData
        .filter((tag) => tag && tag.tagid && tag.tagname)
        .map((tag) => ({
          TagID: tag.tagid,
          TagName: tag.tagname,
        }));

      setTags(validTags);
      if (validTags.length === 0 && tagsData.length > 0) {
        message.warning('No valid tags found in the response');
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
      message.error(`Error fetching tags: ${error.message}`);
      setTags([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${baseUrl}/posts?t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: Failed to fetch posts`);
      }

      const data = await response.json();
      const validPosts = Array.isArray(data)
        ? data.map(post => ({
            PostID: post.postid,
            Title: post.title,
          }))
        : [];
      setPosts(validPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      message.error(`Error fetching posts: ${error.message}`);
      setPosts([]);
    }
  };

  // Fetch all post tags
const fetchPostTags = async () => {
    setPostTagsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/posttags?t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: Failed to fetch post tags`);
      }
  
      const data = await response.json();
      
      // Kiểm tra cấu trúc phản hồi và xử lý dữ liệu phù hợp
      if (data && data.success && Array.isArray(data.data)) {
        // Chuyển đổi cấu trúc dữ liệu từ API sang định dạng sử dụng trong bảng
        const formattedPostTags = data.data.map(item => ({
          PostID: item.postid,
          TagID: item.tagid,
          PostTitle: item.posttitle,
          TagName: item.tagname
        }));
        
        setPostTags(formattedPostTags);
      } else {
        console.warn('Unexpected response format from API:', data);
        setPostTags([]);
        message.warning('Received unexpected data format from server');
      }
    } catch (error) {
      console.error('Error fetching post tags:', error);
      message.error(`Error fetching post tags: ${error.message}`);
      setPostTags([]);
    } finally {
      setPostTagsLoading(false);
    }
  };

  // Load tags and posts on mount
  useEffect(() => {
    fetchTags();
    fetchPosts();
    fetchPostTags();
  }, []);

  // Load post tags when tab changes to post tags tab
  useEffect(() => {
    if (activeTab === '2') {
      fetchPostTags();
    }
  }, [activeTab]);

  // Open modal for adding/editing tag
  const showTagModal = (tag = null) => {
    setEditingTag(tag);
    if (tag) {
      tagForm.setFieldsValue({ TagName: tag.TagName });
    } else {
      tagForm.resetFields();
    }
    setIsTagModalOpen(true);
  };

  // Open modal for associating tag with posts
  const showAssociateModal = (tag) => {
    setSelectedTag(tag);
    setSelectedPostIds([]);
    setIsAssociateModalOpen(true);
  };

  // Notify navigation about tag changes
  const notifyTagChange = () => {
    const event = new CustomEvent('tagsUpdated');
    window.dispatchEvent(event);
  };

  // Handle tag modal submission
  const handleTagOk = async () => {
    try {
      const values = await tagForm.validateFields();
      const url = editingTag
        ? `${baseUrl}/api/tags/${editingTag.TagID}`
        : `${baseUrl}/api/tags`;
      const method = editingTag ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save tag');
      }

      message.success(editingTag ? 'Tag updated successfully' : 'Tag added successfully');
      setIsTagModalOpen(false);
      tagForm.resetFields();
      setEditingTag(null);
      fetchTags();
      notifyTagChange();
    } catch (error) {
      message.error(`Error: ${error.message}`);
    }
  };

  // Handle post association submission
  const handleAssociateOk = async () => {
    if (!selectedTag || selectedPostIds.length === 0) {
      message.error('Please select at least one post to associate with the tag');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/tags/${selectedTag.TagID}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ PostIDs: selectedPostIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to associate tag with posts');
      }

      message.success('Tag associated with posts successfully');
      setIsAssociateModalOpen(false);
      setSelectedTag(null);
      setSelectedPostIds([]);
      fetchPostTags(); // Refresh post tags after association
      notifyTagChange();
    } catch (error) {
      message.error(`Error associating tag: ${error.message}`);
    }
  };

  // Delete post tag association
  const deletePostTag = async (postId, tagId) => {
    try {
      const response = await fetch(`${baseUrl}/api/posttags/${postId}/${tagId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete post tag association');
      }

      message.success('Post tag association deleted successfully');
      fetchPostTags();
      notifyTagChange();
    } catch (error) {
      message.error(`Error deleting post tag association: ${error.message}`);
    }
  };

  // Table columns for tags
  const tagColumns = [
    { title: 'ID', dataIndex: 'TagID', key: 'TagID' },
    { title: 'Tag Name', dataIndex: 'TagName', key: 'TagName' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => showTagModal(record)}
          >
            Edit
          </Button>
          <Button
            icon={<TagOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => showAssociateModal(record)}
          >
            Associate Posts
          </Button>
        </>
      ),
    },
  ];

  // Table columns for post tags
  const postTagColumns = [
    { title: 'Post ID', dataIndex: 'PostID', key: 'PostID' },
    { title: 'Post Title', dataIndex: 'PostTitle', key: 'PostTitle' },
    { title: 'Tag ID', dataIndex: 'TagID', key: 'TagID' },
    { title: 'Tag Name', dataIndex: 'TagName', key: 'TagName' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={() => deletePostTag(record.PostID, record.TagID)}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <Card
      title={<Title level={4} style={{ color: '#4e73df' }}>Tag Management</Title>}
      bordered={false}
      style={{
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        background: '#fff',
      }}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Tags" key="1">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginBottom: 16, backgroundColor: '#4e73df' }}
            onClick={() => showTagModal()}
          >
            Add
          </Button>
          <Table
            columns={tagColumns}
            dataSource={tags}
            rowKey="TagID"
            loading={loading}
            locale={{
              emptyText: <Empty description="No tags found" />,
            }}
          />
        </TabPane>
        <TabPane tab="Post Tag Associations" key="2">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              type="primary"
              icon={<LinkOutlined />}
              style={{ backgroundColor: '#4e73df' }}
              onClick={() => {
                if (tags.length > 0) {
                  showAssociateModal(tags[0]);
                } else {
                  message.warning('Please create a tag first');
                }
              }}
            >
              Create
            </Button>
            <Button 
              onClick={() => fetchPostTags()}
              style={{ marginLeft: 8 }}
            >
              Refresh
            </Button>
          </div>
          <Table
            columns={postTagColumns}
            dataSource={postTags}
            rowKey={(record) => `${record.PostID}-${record.TagID}`}
            loading={postTagsLoading}
            locale={{
              emptyText: <Empty description="No post tag associations found" />,
            }}
          />
        </TabPane>
      </Tabs>

      {/* Tag Modal */}
      <Modal
        title={editingTag ? 'Edit Tag' : 'Add New Tag'}
        open={isTagModalOpen}
        onOk={handleTagOk}
        onCancel={() => {
          setIsTagModalOpen(false);
          tagForm.resetFields();
          setEditingTag(null);
        }}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={tagForm} layout="vertical">
          <Form.Item
            name="TagName"
            label="Tag Name"
            rules={[{ required: true, message: 'Please enter tag name' }]}
          >
            <Input placeholder="Enter tag name" />
          </Form.Item>
          {!editingTag && (
            <Form.Item
              name="PostID"
              label="Associate with Post (Optional)"
            >
              <Select
                placeholder="Select a post"
                allowClear
              >
                {posts.map((post) => (
                  <Option key={post.PostID} value={post.PostID}>
                    {post.Title} (ID: {post.PostID})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* Associate Posts Modal */}
      <Modal
        title={`Associate Posts with Tag: ${selectedTag?.TagName || ''}`}
        open={isAssociateModalOpen}
        onOk={handleAssociateOk}
        onCancel={() => {
          setIsAssociateModalOpen(false);
          setSelectedTag(null);
          setSelectedPostIds([]);
        }}
        okText="Save"
        cancelText="Cancel"
      >
        <Form layout="vertical">
          {!selectedTag && (
            <Form.Item
              name="TagID"
              label="Select Tag"
              rules={[{ required: true, message: 'Please select a tag' }]}
            >
              <Select
                placeholder="Select a tag"
                onChange={(value) => {
                  const tag = tags.find(t => t.TagID === value);
                  setSelectedTag(tag);
                }}
              >
                {tags.map((tag) => (
                  <Option key={tag.TagID} value={tag.TagID}>
                    {tag.TagName} (ID: {tag.TagID})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Form.Item
            label="Select Posts"
            rules={[{ required: true, message: 'Please select at least one post' }]}
          >
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Select posts"
              value={selectedPostIds}
              onChange={(value) => setSelectedPostIds(value)}
            >
              {posts.map((post) => (
                <Option key={post.PostID} value={post.PostID}>
                  {post.Title} (ID: {post.PostID})
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default TagManagement;