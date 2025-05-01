import React, { useState, useEffect } from 'react';
import { Button, Card, Table, message, Typography, Empty, Upload, Image, Modal, Select } from 'antd';
import { DeleteOutlined, UploadOutlined, EditOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
const baseUrl = 'http://localhost:3000';

const MediaManagement = () => {
  const [media, setMedia] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const url = `${baseUrl}/api/media?t=${Date.now()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: Failed to fetch media`);
      }

      const data = await response.json();
      console.log('Fetched media:', data);

      const mediaData = Array.isArray(data.media) ? data.media : [];
      const validMedia = mediaData
        .filter((item) => item && item.mediaid)
        .map((item) => ({
          MediaID: item.mediaid,
          MediaURL: item.mediaurl,
          MediaType: item.mediatype || 'Unknown',
          CreatedAtDate: item.createdatdate
            ? new Date(item.createdatdate).toLocaleDateString()
            : 'N/A',
          PostID: item.postid || null,
        }));

      console.log('Mapped media:', validMedia);
      setMedia(validMedia);
      if (validMedia.length === 0 && mediaData.length > 0) {
        message.warning('No valid media found in the response');
      }
    } catch (error) {
      console.error('Error fetching media:', error);
      message.error(`Error fetching media: ${error.message}`);
      setMedia([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPublishedPosts = async () => {
    try {
      const response = await fetch(`${baseUrl}/posts/published`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: Failed to fetch published posts`);
      }

      const data = await response.json();
      console.log('Fetched published posts:', data);

      const validPosts = Array.isArray(data) ? data : [];
      setPosts(validPosts);
    } catch (error) {
      console.error('Error fetching published posts:', error);
      message.error(`Error fetching published posts: ${error.message}`);
      setPosts([]);
    }
  };

  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/media`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload media');
      }

      const data = await response.json();
      message.success(data.message);
      setFileList([]);
      fetchMedia(); // Refresh media list
    } catch (error) {
      message.error(`Error uploading media: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteMedia = async (mediaId) => {
    if (!mediaId) {
      message.error('Cannot delete media: Invalid Media ID');
      return;
    }
    try {
      const response = await fetch(`${baseUrl}/api/media/${mediaId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete media');
      }

      message.success('Media deleted successfully');
      fetchMedia();
    } catch (error) {
      message.error(`Error deleting media: ${error.message}`);
    }
  };

  const updateMediaPostId = async () => {
    if (!selectedMedia || !selectedPostId) {
      message.error('Please select a post to associate with the media');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/media/${selectedMedia.MediaID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postID: selectedPostId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update PostID');
      }

      message.success('PostID updated successfully');
      setIsModalVisible(false);
      setSelectedMedia(null);
      setSelectedPostId(null);
      fetchMedia(); // Refresh media list
    } catch (error) {
      message.error(`Error updating PostID: ${error.message}`);
    }
  };

  // Load media and posts on mount
  useEffect(() => {
    fetchMedia();
    fetchPublishedPosts();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'MediaID',
      key: 'MediaID',
    },
    {
      title: 'Preview',
      dataIndex: 'MediaURL',
      key: 'MediaURL',
      render: (url) => (
        <Image src={`${baseUrl}${url}`} alt="Media" style={{ width: 100 }} preview />
      ),
    },
    {
      title: 'Media Type',
      dataIndex: 'MediaType',
      key: 'MediaType',
    },
    {
      title: 'Created At',
      dataIndex: 'CreatedAtDate',
      key: 'CreatedAtDate',
    },
    {
      title: 'Post ID',
      dataIndex: 'PostID',
      key: 'PostID',
      render: (postId) => (postId ? postId : 'N/A'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => {
              setSelectedMedia(record);
              setSelectedPostId(record.PostID);
              setIsModalVisible(true);
            }}
          >
            Associate Post
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => deleteMedia(record.MediaID)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Card
        title={<Title level={4} style={{ color: '#4e73df' }}>Media Management</Title>}
        bordered={false}
        style={{
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          background: '#fff',
        }}
      >
        <Upload
          customRequest={handleUpload}
          fileList={fileList}
          onChange={({ fileList }) => setFileList(fileList)}
          accept="image/*"
          showUploadList={false}
        >
          <Button
            type="primary"
            icon={<UploadOutlined />}
            style={{ marginBottom: 16, backgroundColor: '#4e73df' }}
          >
            Upload Media
          </Button>
        </Upload>
        <Table
          columns={columns}
          dataSource={media}
          loading={loading}
          rowKey="MediaID"
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: (
              <Empty
                description="No media found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Card>

      <Modal
        title="Associate Post with Media"
        visible={isModalVisible}
        onOk={updateMediaPostId}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedMedia(null);
          setSelectedPostId(null);
        }}
        okText="Save"
        cancelText="Cancel"
      >
        <Select
          style={{ width: '100%' }}
          placeholder="Select a post"
          value={selectedPostId}
          onChange={(value) => setSelectedPostId(value)}
        >
          {posts.map((post) => (
            <Option key={post.postid} value={post.postid}>
              {post.title} (ID: {post.postid})
            </Option>
          ))}
        </Select>
      </Modal>
    </>
  );
};

export default MediaManagement;