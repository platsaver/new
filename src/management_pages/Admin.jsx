import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  AreaChartOutlined,
  DashboardOutlined,
  FileImageOutlined,
  TagsOutlined,
  FormOutlined,
  CommentOutlined,
  ContainerOutlined
} from '@ant-design/icons';
import ListPost from './ListPost.jsx';
import Button1 from './Button1.jsx';
import Button2 from './Button2.jsx';
import Button3 from './Button3.jsx';
import Statistic from './statistic.jsx';
import User from './User.jsx';
import Dashboard from './Dashboard.jsx';
import CategoryManagement from './CategoryManagement.jsx';
import SearchForm from './SearchForm.jsx';
import { Button, Layout, Menu, theme, Row, Col } from 'antd';
import '@ant-design/v5-patch-for-react-19';
import MediaManagement from './MediaManagement.jsx'
import CommentManagement from './CommentManagement.jsx';
import TagManagement from './TagManagement.jsx';

const { Header, Sider, Content } = Layout;

const App = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedTab, setSelectedTab] = useState('4');
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
      case '1':
        return (
          <>
            <Row justify="space-between" style={{ marginBottom: 16 }}>
              <Col>
                <Button1 />
                <Button2 />
                <Button3 />
              </Col>
              <Col>
                <SearchForm />
              </Col>
            </Row>
            <ListPost />
          </>
        );
      case '3':
        return <User />;
      case '4':
        return <Dashboard />;
      case '5':
        return <CategoryManagement />;
      case '6':
        return <MediaManagement />;
      case '7':
        return <CommentManagement />;
      case '8':
        return <TagManagement />;
      default:
        return <div>Content</div>;
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
        style={{ height: '189vh' }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['4']}
          selectedKeys={[selectedTab]}
          onClick={handleMenuClick}
          items={[
            { key: '4', icon: <DashboardOutlined />, label: 'Dashboard' },
            { key: '1', icon: <FormOutlined />, label: 'Post Management' },
            { key: '3', icon: <UserOutlined />, label: 'User Management' },
            { key: '5', icon: <ContainerOutlined />, label: 'Category Management' },
            { key: '6', icon: <FileImageOutlined />, label: 'Media Management' },
            { key: '7', icon: <CommentOutlined />, label: 'Comment Management' },
            { key: '8', icon: <TagsOutlined />, label: 'Tag Management' },
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

export default App;