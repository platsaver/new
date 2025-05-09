import React, { useState, useEffect } from 'react';
import { Card, Avatar, Descriptions, Button, Form, Input, Upload, message, Typography, Spin } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const baseUrl = 'http://localhost:3000';

// Hàm định dạng ngày giờ
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace(/,/, ''); // Format: DD/MM/YYYY HH:mm
};

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Fetch user information
  const fetchUser = async () => {
    if (!userId || isNaN(userId)) {
      message.error('Invalid user ID');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: Failed to fetch user`);
      }

      const data = await response.json();
      if (data.success) {
        // Map API response fields to match UI expectations
        const userData = {
          UserID: data.data.userid,
          UserName: data.data.username,
          Role: data.data.role,
          Email: data.data.email,
          CreatedAtDate: data.data.createdatdate,
          UpdatedAtDate: data.data.updatedatdate,
          AvatarURL: data.data.avatarurl,
        };
        setUser(userData);
      } else {
        message.error(data.message || 'Failed to fetch user');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      message.error(`Error fetching user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Update user information
  const updateUser = async (values) => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }

      const updatedUser = await response.json();
      // Assuming the API returns the updated user in the same format as GET /api/users/:userId
      const userData = {
        UserID: updatedUser.userid,
        UserName: updatedUser.username,
        Role: updatedUser.role,
        Email: updatedUser.email,
        CreatedAtDate: updatedUser.createdatdate,
        UpdatedAtDate: updatedUser.updatedatdate,
        AvatarURL: updatedUser.avatarurl,
      };
      setUser(userData);
      message.success('User information updated successfully');
      form.resetFields();
      fetchUser(); // Refresh user data
    } catch (error) {
      console.error('Error updating user:', error);
      message.error(`Error updating user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Upload avatar
  const handleAvatarUpload = async ({ file }) => {
    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${baseUrl}/api/upload-avatar/${userId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload avatar');
      }

      const data = await response.json();
      setUser((prev) => ({ ...prev, AvatarURL: data.avatarUrl }));
      message.success(data.message || 'Avatar uploaded successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      message.error(`Error uploading avatar: ${error.message}`);
    } finally {
      setAvatarUploading(false);
    }
  };

  // Load user data on mount
  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  // Upload props for Ant Design Upload component
  const uploadProps = {
    name: 'avatar',
    customRequest: handleAvatarUpload,
    showUploadList: false,
  };

  return (
    <Card
      title={<Title level={4} style={{ color: '#4e73df' }}>User Profile</Title>}
      bordered={false}
      style={{
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        background: '#fff',
        maxWidth: 800,
        margin: '0 auto',
      }}
    >
      {loading && !user ? (
        <Spin tip="Loading user profile..." />
      ) : !user ? (
        <p>No user data available</p>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
            <Avatar
              size={100}
              src={user.AvatarURL ? `${baseUrl}${user.AvatarURL}` : null}
              icon={!user.AvatarURL ? <UserOutlined /> : null}
              style={{ marginRight: 24 }}
            />
            <Upload {...uploadProps} disabled={avatarUploading}>
              <Button icon={<UploadOutlined />} loading={avatarUploading}>
                {avatarUploading ? 'Uploading...' : 'Change Avatar'}
              </Button>
            </Upload>
          </div>

          <Descriptions title="User Information" bordered column={1}>
            <Descriptions.Item label="Username">{user.UserName}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.Email || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Role">{user.Role || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Created At">
              {formatDate(user.CreatedAtDate)}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {formatDate(user.UpdatedAtDate)}
            </Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: 24 }}>
            <Title level={5}>Update Profile</Title>
            <Form
              form={form}
              layout="vertical"
              onFinish={updateUser}
              style={{ maxWidth: 400 }}
            >
              <Form.Item
                name="username"
                label="New Username"
                rules={[{ min: 3, message: 'Username must be at least 3 characters' }]}
              >
                <Input placeholder="Enter new username" />
              </Form.Item>
              <Form.Item
                name="password"
                label="New Password"
                rules={[{ min: 6, message: 'Password must be at least 6 characters' }]}
              >
                <Input.Password placeholder="Enter new password" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Profile
                </Button>
              </Form.Item>
            </Form>
          </div>
        </>
      )}
    </Card>
  );
};

export default UserProfile;