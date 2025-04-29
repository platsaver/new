import React, { useState, useEffect } from 'react';
import { Button, Card, Table, message, Typography, Empty, Modal, Form, Input, Select } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const { Title } = Typography;
const baseUrl = 'http://localhost:3000';

const CommentManagement = () => {
  const [pendingComments, setPendingComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [form] = Form.useForm();

  // Fetch pending comments
  const fetchPendingComments = async () => {
    setLoading(true);
    try {
      const url = `${baseUrl}/api/comments/pending?t=${Date.now()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: Failed to fetch pending comments`);
      }

      const data = await response.json();
      console.log('Fetched pending comments:', data);

      const commentsData = Array.isArray(data.data) ? data.data : [];
      const validComments = commentsData
        .filter((item) => item && item.CommentID && item.Content)
        .map((item) => ({
          CommentID: item.CommentID,
          PostID: item.PostID,
          UserID: item.UserID,
          Username: item.Username || 'Unknown',
          Content: item.Content,
          Status: item.Status || 'pending',
          CreatedAtDate: item.CreatedAtDate
            ? new Date(item.CreatedAtDate).toLocaleDateString()
            : 'N/A',
        }));

      console.log('Mapped pending comments:', validComments);
      setPendingComments(validComments);
      if (validComments.length === 0 && commentsData.length > 0) {
        message.warning('No valid pending comments found in the response');
      }
    } catch (error) {
      console.error('Error fetching pending comments:', error);
      message.error(`Error fetching pending comments: ${error.message}`);
      setPendingComments([]);
    } finally {
      setLoading(false);
    }
  };

  // Moderate comment
  const moderateComment = async (commentId, values) => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/comments/${commentId}/moderate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: values.status,
          moderatorId: 1, // Hardcoded for demo; replace with actual logged-in moderator ID
          moderationNote: values.moderationNote,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to moderate comment');
      }

      message.success('Comment moderated successfully');
      setIsModalOpen(false);
      form.resetFields();
      setSelectedComment(null);
      fetchPendingComments(); // Refresh pending comments
    } catch (error) {
      message.error(`Error moderating comment: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Open modal for moderating comment
  const showModal = (comment) => {
    setSelectedComment(comment);
    setIsModalOpen(true);
    form.setFieldsValue({ status: 'approved', moderationNote: '' });
  };

  // Load pending comments on mount
  useEffect(() => {
    fetchPendingComments();
  }, []);

  // Table columns for pending comments
  const columns = [
    {
      title: 'ID',
      dataIndex: 'CommentID',
      key: 'CommentID',
    },
    {
      title: 'Username',
      dataIndex: 'Username',
      key: 'Username',
    },
    {
      title: 'Content',
      dataIndex: 'Content',
      key: 'Content',
      render: (text) => <span>{text.length > 50 ? `${text.slice(0, 50)}...` : text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
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
          icon={<EditOutlined />}
          onClick={() => showModal(record)}
        >
          Moderate
        </Button>
      ),
    },
  ];

  return (
    <Card
      title={<Title level={4} style={{ color: '#4e73df' }}>Comment Management</Title>}
      bordered={false}
      style={{
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        background: '#fff',
      }}
    >
      <Table
        columns={columns}
        dataSource={pendingComments}
        loading={loading}
        rowKey="CommentID"
        pagination={{ pageSize: 10 }}
        locale={{
          emptyText: (
            <Empty
              description="No pending comments found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
      />
      <Modal
        title="Moderate Comment"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedComment(null);
          form.resetFields();
        }}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => moderateComment(selectedComment?.CommentID, values)}
        >
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select>
              <Select.Option value="approved">Approved</Select.Option>
              <Select.Option value="rejected">Rejected</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="moderationNote"
            label="Moderation Note"
            rules={[{ required: true, message: 'Please enter a moderation note' }]}
          >
            <Input.TextArea rows={4} placeholder="Enter moderation note" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default CommentManagement;