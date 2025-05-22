import React, { useState, useEffect } from 'react';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Avatar, List, Space, Spin, Alert, Typography } from 'antd';
import '@ant-design/v5-patch-for-react-19';
import 'antd/dist/reset.css';

const { Title } = Typography;

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

  // Format post data to match List component structure
  const formatPost = (post, index) => ({
    href: post.slug ? `/posts/${post.slug}` : `/posts/${post.id || index + 1}`,
    title: post.title || `Post ${index + 1}`,
    avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${post.id || index}`,
    description:
      post.content?.slice(0, 100) + (post.content?.length > 100 ? '...' : '') ||
      'No description available',
    content: post.content || 'No content available',
  });

  // Initial fetch of posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        if (!userId || isNaN(parseInt(userId))) {
          throw new Error('User not logged in or invalid User ID');
        }
        const response = await fetch(`http://localhost:3000/posts/user/${userId}`);
        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.error || `Failed to fetch posts: ${response.statusText}`);
        }
        const posts = await response.json();
        const formattedData = posts.map((post, i) => formatPost(post, i));
        setData(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Set up SSE connection
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId || isNaN(parseInt(userId))) {
      console.warn('No valid userId for SSE');
      return;
    }

    const eventSource = new EventSource('http://localhost:3000/events');

    eventSource.onopen = () => {
      console.log('SSE connection opened');
    };

    eventSource.addEventListener('postCreated', (event) => {
      try {
        const newPost = JSON.parse(event.data);
        // Only add the post if it belongs to the current user
        if (newPost.userid === parseInt(userId)) {
          setData((prevData) => [formatPost(newPost, prevData.length), ...prevData]);
        }
      } catch (err) {
        console.error('Error parsing SSE data:', err);
      }
    });

    eventSource.onerror = (err) => {
      console.error('SSE error:', err);
      setError('Failed to connect to real-time updates');
      eventSource.close();
    };

    // Clean up SSE connection on component unmount
    return () => {
      eventSource.close();
      console.log('SSE connection closed');
    };
  }, []);

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
        onChange: (page) => {
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
      renderItem={(item) => (
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