import React, { useState, useEffect } from 'react';
import { Button, Card, Table, message, Typography, Empty, Modal, Form, Input, Select, Tabs, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TabPane } = Tabs;
const baseUrl = 'http://localhost:3000';

const CommentManagement = () => {
  const [pendingComments, setPendingComments] = useState([]);
  const [moderatedComments, setModeratedComments] = useState([]);
  const [manageComments, setManageComments] = useState([]);
  const [loading, setLoading] = useState({ pending: false, history: false, manage: false });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('moderate'); // 'moderate' or 'edit'
  const [selectedComment, setSelectedComment] = useState(null);
  const [form] = Form.useForm();

  // Fetch pending comments for Moderate tab
  const fetchPendingComments = async () => {
    setLoading((prev) => ({ ...prev, pending: true }));
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
      const commentsData = Array.isArray(data.data) ? data.data : [];
      const validComments = commentsData
        .filter((item) => item && item.commentid && item.content)
        .map((item) => ({
          CommentID: item.commentid,
          PostID: item.postid,
          UserID: item.userid,
          Username: item.username || 'Unknown',
          Content: item.content,
          Status: item.status || 'pending',
          CreatedAtDate: item.createdatdate
            ? new Date(item.createdatdate).toLocaleDateString()
            : 'N/A',
        }));

      setPendingComments(validComments);
      if (validComments.length === 0 && commentsData.length > 0) {
        message.warning('No valid pending comments found');
      }
    } catch (error) {
      console.error('Error fetching pending comments:', error);
      message.error(`Error fetching pending comments: ${error.message}`);
      setPendingComments([]);
    } finally {
      setLoading((prev) => ({ ...prev, pending: false }));
    }
  };

  // Fetch moderation history for Moderation History tab
  const fetchModerationHistory = async () => {
    setLoading((prev) => ({ ...prev, history: true }));
    try {
      const url = `${baseUrl}/api/comments/moderation-history?t=${Date.now()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: Failed to fetch moderation history`);
      }

      const data = await response.json();
      const validComments = Array.isArray(data)
        ? data
            .filter((item) => item && item.commentid && item.content)
            .map((item) => ({
              CommentID: item.commentid,
              PostID: item.postid,
              UserID: item.userid,
              Username: item.author || 'Unknown',
              Moderator: item.moderator || 'Unknown',
              PostTitle: item.posttitle || 'N/A',
              Content: item.content,
              Status: item.status || 'N/A',
              CreatedAtDate: item.createdatdate
                ? new Date(item.createdatdate).toLocaleDateString()
                : 'N/A',
              UpdatedAtDate: item.updatedatdate
                ? new Date(item.updatedatdate).toLocaleDateString()
                : 'N/A',
            }))
        : [];

      setModeratedComments(validComments);
      if (validComments.length === 0 && data.length > 0) {
        message.warning('No valid moderated comments found');
      }
    } catch (error) {
      console.error('Error fetching moderation history:', error);
      message.error(`Error fetching moderation history: ${error.message}`);
      setModeratedComments([]);
    } finally {
      setLoading((prev) => ({ ...prev, history: false }));
    }
  };

  // Fetch comments for Manage tab (using moderation-history for approved comments)
  const fetchManageComments = async () => {
    setLoading((prev) => ({ ...prev, manage: true }));
    try {
      const url = `${baseUrl}/api/comments/moderation-history?t=${Date.now()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: Failed to fetch comments`);
      }

      const data = await response.json();
      const validComments = Array.isArray(data)
        ? data
            .filter((item) => item && item.commentid && item.content)
            .map((item) => ({
              CommentID: item.commentid,
              PostID: item.postid,
              UserID: item.userid,
              Username: item.author || 'Unknown',
              Moderator: item.moderator || 'Unknown',
              PostTitle: item.posttitle || 'N/A',
              Content: item.content,
              Status: item.status || 'N/A',
              CreatedAtDate: item.createdatdate
                ? new Date(item.createdatdate).toLocaleDateString()
                : 'N/A',
              UpdatedAtDate: item.updatedatdate
                ? new Date(item.updatedatdate).toLocaleDateString()
                : 'N/A',
            }))
        : [];

      setManageComments(validComments);
      if (validComments.length === 0 && data.length > 0) {
        message.warning('No valid comments found for management');
      }
    } catch (error) {
      console.error('Error fetching comments for management:', error);
      message.error(`Error fetching comments: ${error.message}`);
      setManageComments([]);
    } finally {
      setLoading((prev) => ({ ...prev, manage: false }));
    }
  };

  // Moderate comment
  const moderateComment = async (commentId, values) => {
    try {
      setLoading((prev) => ({ ...prev, pending: true }));
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
      fetchPendingComments(); // Refresh Moderate tab
      fetchModerationHistory(); // Refresh History tab
      fetchManageComments(); // Refresh Manage tab
    } catch (error) {
      message.error(`Error moderating comment: ${error.message}`);
    } finally {
      setLoading((prev) => ({ ...prev, pending: false }));
    }
  };

  // Update comment
  const updateComment = async (commentId, values) => {
    try {
      setLoading((prev) => ({ ...prev, manage: true }));
      const response = await fetch(`${baseUrl}/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: values.content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update comment');
      }

      message.success('Comment updated successfully');
      setIsModalOpen(false);
      form.resetFields();
      setSelectedComment(null);
      fetchManageComments(); // Refresh Manage tab
      fetchModerationHistory(); // Refresh History tab
    } catch (error) {
      message.error(`Error updating comment: ${error.message}`);
    } finally {
      setLoading((prev) => ({ ...prev, manage: false }));
    }
  };

  // Delete comment
  const deleteComment = async (commentId) => {
    try {
      setLoading((prev) => ({ ...prev, manage: true }));
      const response = await fetch(`${baseUrl}/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete comment');
      }

      message.success('Comment deleted successfully');
      fetchManageComments(); // Refresh Manage tab
      fetchModerationHistory(); // Refresh History tab
      fetchPendingComments(); // Refresh Moderate tab
    } catch (error) {
      message.error(`Error deleting comment: ${error.message}`);
    } finally {
      setLoading((prev) => ({ ...prev, manage: false }));
    }
  };

  // Open modal for moderating or editing comment
  const showModal = (comment, mode = 'moderate') => {
    setSelectedComment(comment);
    setModalMode(mode);
    setIsModalOpen(true);
    if (mode === 'moderate') {
      form.setFieldsValue({ status: 'approved', moderationNote: '' });
    } else {
      form.setFieldsValue({ content: comment.Content });
    }
  };

  // Load data for all tabs on mount
  useEffect(() => {
    fetchPendingComments();
    fetchModerationHistory();
    fetchManageComments();
  }, []);

  // Table columns for Moderate tab (pending comments)
  const moderateColumns = [
    {
      title: 'ID',
      dataIndex: 'CommentID',
      key: 'CommentID',
    },
    {
      dataIndex: 'PostTitle',
      key: 'PostTitle',
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
          onClick={() => showModal(record, 'moderate')}
        >
          Moderate
        </Button>
      ),
    },
  ];

  // Table columns for Moderation History tab
  const historyColumns = [
    {
      title: 'ID',
      dataIndex: 'CommentID',
      key: 'CommentID',
    },
    {
      title: 'Post Title',
      dataIndex: 'PostTitle',
      key: 'PostTitle',
    },
    {
      title: 'User',
      dataIndex: 'Username',
      key: 'Username',
    },
    {
      title: 'Moderator',
      dataIndex: 'Moderator',
      key: 'Moderator',
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
  ];

  // Table columns for Manage tab
  const manageColumns = [
    {
      title: 'ID',
      dataIndex: 'CommentID',
      key: 'CommentID',
    },
    {
      title: 'Post Title',
      dataIndex: 'PostTitle',
      key: 'PostTitle',
    },
    {
      title: 'Author',
      dataIndex: 'Username',
      key: 'Username',
    },
    {
      title: 'Moderator',
      dataIndex: 'Moderator',
      key: 'Moderator',
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div>
          {record.Status === 'approved' && (
            <Button
              icon={<EditOutlined />}
              onClick={() => showModal(record, 'edit')}
              style={{ marginRight: 8 }}
            >
              Edit
            </Button>
          )}
          <Popconfirm
            title="Are you sure you want to delete this comment?"
            onConfirm={() => deleteComment(record.CommentID)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
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
      <Tabs defaultActiveKey="moderate">
        <TabPane tab="Moderate" key="moderate">
          <Table
            columns={moderateColumns}
            dataSource={pendingComments}
            loading={loading.pending}
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
        </TabPane>
        <TabPane tab="Moderation History" key="history">
          <Table
            columns={historyColumns}
            dataSource={moderatedComments}
            loading={loading.history}
            rowKey="CommentID"
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: (
                <Empty
                  description="No moderated comments found"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
          />
        </TabPane>
        <TabPane tab="Manage" key="manage">
          <Table
            columns={manageColumns}
            dataSource={manageComments}
            loading={loading.manage}
            rowKey="CommentID"
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: (
                <Empty
                  description="No comments found"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
          />
        </TabPane>
      </Tabs>
      <Modal
        title={modalMode === 'moderate' ? 'Moderate Comment' : 'Edit Comment'}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedComment(null);
          setModalMode('moderate');
          form.resetFields();
        }}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) =>
            modalMode === 'moderate'
              ? moderateComment(selectedComment?.CommentID, values)
              : updateComment(selectedComment?.CommentID, values)
          }
        >
          {modalMode === 'moderate' ? (
            <>
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
            </>
          ) : (
            <Form.Item
              name="content"
              label="Comment Content"
              rules={[{ required: true, message: 'Please enter comment content' }]}
            >
              <Input.TextArea rows={4} placeholder="Enter comment content" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </Card>
  );
};

export default CommentManagement;