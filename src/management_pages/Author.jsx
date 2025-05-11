import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  CommentOutlined,
  FormOutlined,
  FileImageOutlined,
  TagsOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Row, Col } from 'antd';
import '@ant-design/v5-patch-for-react-19';
import AddPostsButton from './Button2-1.jsx';
import DeletePostsButton from './Button1-1.jsx';
import ManagePostsButton from './Button3-1.jsx';
import ListPost from './ListPost2.jsx';
import UserCommentManagement from './UserCommentManagement.jsx';
import UserProfile from './UserProfile.jsx';
import MediaManagement from './MediaManagement.jsx';
import TagManagement from './TagManagement.jsx';

const { Header, Sider, Content } = Layout;

const Author = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedTab, setSelectedTab] = useState('1');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const userId = localStorage.getItem('userId');

  const handleBreakpoint = (broken) => {
    setCollapsed(broken);
  };

  const handleMenuClick = (e) => {
    setSelectedTab(e.key);
  };

  const renderContent = () => {
    switch (selectedTab) {
      case '1':
        return (
          <>
            <Row justify="space-between" style={{ marginBottom: 16 }}>
              <Col>
                <AddPostsButton />
                <ManagePostsButton />
                <DeletePostsButton />
              </Col>
            </Row>
            <ListPost />
          </>
        );
      case '2':
        return <UserCommentManagement userId={userId} />;
      case '3':
        return <UserProfile userId={userId} />;
      case '4':
        return <MediaManagement />;
      case '5':
        return < TagManagement/>;
      default:
        return <ListPost />;
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
          defaultSelectedKeys={['1']}
          selectedKeys={[selectedTab]}
          onClick={handleMenuClick}
          items={[
            { key: '1', icon: <FormOutlined />, label: 'Posts' },
            { key: '2', icon: <CommentOutlined />, label: 'Comments' },
            { key: '3', icon: <UserOutlined />, label: 'Profile' },
            {key: '4', icon: <FileImageOutlined />, label: 'Media Management'},
            { key: '5', icon: <TagsOutlined />, label: 'Tag Management' }
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

export default Author;