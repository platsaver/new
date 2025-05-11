import React, { useState, useEffect } from 'react';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Avatar, List, Space, Spin, Alert, Typography } from 'antd';
import '@ant-design/v5-patch-for-react-19';
import 'antd/dist/reset.css'; // Ensure Ant Design styles are included

const { Title } = Typography; // Import Ant Design Typography for custom heading styles

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/posts');
        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }
        const posts = await response.json();

        // Map the API response to match the List component structure
        const formattedData = posts.map((post, i) => ({
          href: post.slug ? `/posts/${post.slug}` : 'https://ant.design', // Derive href from slug
          title: post.title || `Post ${i + 1}`, // Use title or fallback
          avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`, // Generate avatar
          description:
            post.content?.slice(0, 100) + (post.content?.length > 100 ? '...' : '') ||
            'No description available', // Extract snippet from content
          content: post.content || 'No content available', // Use content or fallback
        }));

        setData(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Function to render HTML content safely
  const renderHTML = (htmlContent) => {
    return { __html: htmlContent };
  };

  if (loading) {
    return <Spin tip="Loading posts..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <List
      itemLayout="vertical"
      size="large"
      pagination={{
        onChange: page => {
          console.log(page);
        },
        pageSize: 3,
      }}
      dataSource={data}
      footer={
        <div>
          <b>ant design</b> footer part
        </div>
      }
      renderItem={item => (
        <List.Item
          key={item.title}
          actions={[
            <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
            <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
            <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
          ]}
        >
          <List.Item.Meta
            avatar={<Avatar src={item.avatar} />}
            title={<a href={item.href}>{item.title}</a>}
            description={item.description}
          />
          {/* Change 1: Render HTML content using dangerouslySetInnerHTML */}
          <div
            className="post-content"
            dangerouslySetInnerHTML={renderHTML(item.content)}
          />
        </List.Item>
      )}
    />
  );
};

export default App;