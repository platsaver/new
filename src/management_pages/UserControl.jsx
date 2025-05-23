import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import '@ant-design/v5-patch-for-react-19';
import UserProfile from './UserProfile';
import UserCommentManagement from './UserCommentManagement';

const { Header, Sider, Content } = Layout;

const User = ({ userId }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedTab, setSelectedTab] = useState('profile');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleBreakpoint = (broken) => {
    setCollapsed(broken);
  };

  const handleMenuClick = (e) => {
    setSelectedTab(e.key);
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'profile':
        return <UserProfile userId={userId} />;
      case 'comments':
        return <UserCommentManagement userId={userId} />;
      default:
        return <UserProfile userId={userId} />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={handleBreakpoint}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ height: '175vh' }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['profile']}
          selectedKeys={[selectedTab]}
          onClick={handleMenuClick}
          items={[
            { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
            { key: 'comments', icon: <CommentOutlined />, label: 'Comments' },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default User;