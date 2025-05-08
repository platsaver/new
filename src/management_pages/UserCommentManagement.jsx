import React, { useState, useEffect } from 'react';
import { Button, Card, Table, message, Typography, Empty, Modal, Form, Input, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;
const baseUrl = 'http://localhost:3000';

const UserCommentManagement = ({ userId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Fetch comments for a specific user
  const fetchComments = async (page = 1, pageSize = 10, status = null) => {
    setLoading(true);
    try {
      const url = `${baseUrl}/api/comments/user/${userId}?page=${page}&limit=${pageSize}${status ? `&status=${status}` : ''}&t=${Date.now()}`;
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
      const validComments = Array.isArray(data.comments)
        ? data.comments
            .filter((item) => item && item.commentid && item.content)
            .map((item) => ({
              CommentID: item.commentid,
              PostID: item.postid,
              Content: item.content,
              Status: item.status || 'N/A',
              CreatedAtDate: item.createdatdate
                ? new Date(item.createdatdate).toLocaleDateString()
                : 'N/A',
              UpdatedAtDate: item.updatedatdate
                ? new Date(item.updatedatdate).toLocaleDateString()
                : 'N/A',
              ModerationNote: item.moderationnote || 'N/A',
              ModeratorName: item.moderatorname || 'N/A',
            }))
        : [];

      setComments(validComments);
      setPagination({
        current: data.pagination.page,
        pageSize: data.pagination.limit,
        total: data.pagination.total,
      });

      if (validComments.length === 0 && data.comments.length > 0) {
        message.warning('No valid comments found');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      message.error(`Error fetching comments: ${error.message}`);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  // Update comment
  const updateComment = async (commentId, values) => {
    try {
      setLoading(true);
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
      fetchComments(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error(`Error updating comment: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete comment
  const deleteComment = async (commentId) => {
    try {
      setLoading(true);
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
      fetchComments(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error(`Error deleting comment: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Open modal for editing comment
  const showModal = (comment) => {
    setSelectedComment(comment);
    setIsModalOpen(true);
    form.setFieldsValue({ content: comment.Content });
  };

  // Handle pagination change
  const handleTableChange = (pagination) => {
    fetchComments(pagination.current, pagination.pageSize);
  };

  // Load comments on mount
  useEffect(() => {
    if (userId) {
      fetchComments();
    }
  }, [userId]);

  // Table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'CommentID',
      key: 'CommentID',
    },
    {
      title: 'Post ID',
      dataIndex: 'PostID',
      key: 'PostID',
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
      title: 'Updated At',
      dataIndex: 'UpdatedAtDate',
      key: 'UpdatedAtDate',
    },
    {
      title: 'Moderation Note',
      dataIndex: 'ModerationNote',
      key: 'ModerationNote',
    },
    {
      title: 'Moderator',
      dataIndex: 'ModeratorName',
      key: 'ModeratorName',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div>
          {record.Status === 'approved' && (
            <Button
              icon={<EditOutlined />}
              onClick={() => showModal(record)}
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
      title={<Title level={4} style={{ color: '#4e73df' }}>User Comment Management</Title>}
      bordered={false}
      style={{
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        background: '#fff',
      }}
    >
      <Table
        columns={columns}
        dataSource={comments}
        loading={loading}
        rowKey="CommentID"
        pagination={pagination}
        onChange={handleTableChange}
        locale={{
          emptyText: (
            <Empty
              description="No comments found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
      />
      <Modal
        title="Edit Comment"
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
          onFinish={(values) => updateComment(selectedComment?.CommentID, values)}
        >
          <Form.Item
            name="content"
            label="Comment Content"
            rules={[{ required: true, message: 'Please enter comment content' }]}
          >
            <Input.TextArea rows={4} placeholder="Enter comment content" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default UserCommentManagement;