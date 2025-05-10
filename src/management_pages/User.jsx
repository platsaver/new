import React, { useState, useEffect } from 'react';
import { Space, Table, message, Button, Modal, Form, Input, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css'; // Thêm Bootstrap CSS

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const formattedData = data.data.map((user) => ({
          key: user.userid || `temp-${Math.random()}`,
          userId: user.userid,
          username: user.username || 'Unknown',
          email: user.email || 'N/A',
          role: user.role || 'user',
          createdAt: user.createdatdate
            ? new Date(user.createdatdate).toLocaleDateString()
            : 'N/A',
          avatarUrl: user.avatarurl || null,
        }));
        setUsers(formattedData);
      } else {
        throw new Error(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
      message.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId, role) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update role');
      message.success(data.message);
      fetchUsers(); // Refresh user list
    } catch (error) {
      message.error(error.message || 'Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId, values) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update user');
      message.success('User updated successfully');
      fetchUsers(); // Refresh user list
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error(error.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async ({ file }, userId) => {
    const formData = new FormData();
    formData.append('avatar', file);

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/upload-avatar/${userId}`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to upload avatar');
      message.success(data.message);
      fetchUsers(); // Refresh user list
    } catch (error) {
      message.error(error.message || 'Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  const showUpdateModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    form.setFieldsValue({
      username: user.username,
    });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await updateUser(selectedUser.userId, values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setSelectedUser(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (text) => <a>{text || 'Unknown'}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (text, record) => (
        <Select
          defaultValue={text}
          style={{ width: 120 }}
          onChange={(value) => updateRole(record.userId, value)}
          options={[
            { value: 'admin', label: 'Admin' },
            { value: 'nguoidung', label: 'Nguoidung' },
            { value: 'author', label: 'Author' },
          ]}
        />
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => showUpdateModal(record)}>Update</Button>
          <Upload
            customRequest={(options) => uploadAvatar(options, record.userId)}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Upload Avatar</Button>
          </Upload>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mt-4">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="row">
        <div className="col-12">
          <Table
            columns={columns}
            dataSource={users}
            loading={loading}
            locale={{ emptyText: 'No users found' }}
            scroll={{ x: 800 }} // Thêm scroll ngang cho responsive
            className="table-responsive" // Bootstrap class để responsive
          />
        </div>
      </div>
      <Modal
        title="Update User"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Update"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input the username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ min: 6, message: 'Password must be at least 6 characters!' }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default User;