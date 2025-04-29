import React, { useState, useEffect } from 'react';
import { Button, Card, Table, message, Typography, Empty, Upload, Image } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const baseUrl = 'http://localhost:3000';

const MediaManagement = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  // Fetch media
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

      // Extract and validate media
      const mediaData = Array.isArray(data.media) ? data.media : [];
      const validMedia = mediaData
        .filter((item) => item && item.mediaid)
        .map((item) => ({
          MediaID: item.mediaid,
          MediaURL: item.mediaurl,
          MediaType: item.mediatype || 'Unknown',
          CreatedAtDate: item.createdatdate	
            ? new Date(item.createdatdate	).toLocaleDateString()
            : 'N/A',
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

  // Handle media upload
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

  // Delete media
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

  // Load media on mount
  useEffect(() => {
    fetchMedia();
  }, []);

  // Table columns
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={() => deleteMedia(record.MediaID)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
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
  );
};

export default MediaManagement;