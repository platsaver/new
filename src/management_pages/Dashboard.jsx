import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Table, Typography, message } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const { Title } = Typography;

const Dashboard = () => {
  const [metrics, setMetrics] = useState({ totalPosts: 0, totalUsers: 0, totalComments: 0 });
  const [recentPosts, setRecentPosts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/statistics');
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const { data } = await response.json();
      setMetrics(data);
    } catch (error) {
      message.error('Failed to fetch statistics');
    }
  };

  const fetchPosts = async () => {
    try {
      // Fetch recent posts from dashboard-featured-posts (unchanged)
      const featuredResponse = await fetch('http://localhost:3000/api/dashboard-featured-posts');
      console.log('API response status (featured):', featuredResponse.status);
      if (!featuredResponse.ok) {
        const errorData = await featuredResponse.json();
        console.error('API error response (featured):', errorData);
        throw new Error(`Failed to fetch featured posts: ${errorData.error || featuredResponse.statusText}`);
      }
      const featuredPosts = await featuredResponse.json();
      console.log('Fetched featured posts:', featuredPosts);

      const recent = featuredPosts.slice(0, 5).map(post => {
        console.log('Processing featured post:', post);
        return {
          PostID: post.PostID,
          title: post.Title,
          author: post.Author || 'Unknown',
          date: new Date(post.CreatedAtDate).toISOString().split('T')[0],
        };
      });
      console.log('Recent posts:', recent);
      setRecentPosts(recent);

      // Fetch published posts for chart from /posts/published
    const publishedResponse = await fetch('http://localhost:3000/posts/published');
    if (!publishedResponse.ok) {
      const errorData = await publishedResponse.json();
      throw new Error(`Failed to fetch published posts: ${errorData.error || publishedResponse.statusText}`);
    }
    const publishedPosts = await publishedResponse.json();

    // Aggregate published posts by day with error handling
    const postsByDay = publishedPosts.reduce((acc, post) => {
      try {
        const date = new Date(post.createdatdate); // Match API field name
        if (isNaN(date.getTime())) {
          console.warn(`Invalid date for post ${post.postid}: ${post.createdatdate}`);
          return acc;
        }
        const day = date.toISOString().split('T')[0]; // YYYY-MM-DD
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      } catch (error) {
        console.error(`Error processing date for post ${post.postid}:`, error);
        return acc;
      }
    }, {});

    const chart = Object.entries(postsByDay)
      .map(([day, posts]) => ({ day, posts }))
      .sort((a, b) => new Date(a.day) - new Date(b.day));
    setChartData(chart.slice(-7));
  } catch (error) {
    console.error('Error in fetchPosts:', error.message, error.stack);
    message.error(`Failed to fetch posts: ${error.message}`);
  }
  };

  // Fetch data on mount
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchStatistics(), fetchPosts()])
      .finally(() => setLoading(false));
  }, []);

  // Table columns for recent posts
  const columns = [
    { title: 'ID', dataIndex: 'PostID', key: 'PostID' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Author', dataIndex: 'author', key: 'author' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2} style={{ color: '#4e73df', marginBottom: '24px' }}>
        Dashboard
      </Title>

      {/* Metric Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card
            title="Total Posts"
            bordered={false}
            style={{
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              background: '#fff',
            }}
            headStyle={{ color: '#4e73df', fontWeight: 'bold' }}
            loading={loading}
          >
            <Title level={3}>{metrics.totalPosts}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            title="Total Users"
            bordered={false}
            style={{
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              background: '#fff',
            }}
            headStyle={{ color: '#4e73df', fontWeight: 'bold' }}
            loading={loading}
          >
            <Title level={3}>{metrics.totalUsers}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            title="Total Comments"
            bordered={false}
            style={{
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              background: '#fff',
            }}
            headStyle={{ color: '#4e73df', fontWeight: 'bold' }}
            loading={loading}
          >
            <Title level={3}>{metrics.totalComments}</Title>
          </Card>
        </Col>
      </Row>

      {/* Chart and Table */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card
            title="Post Trends (Last 7 Days)"
            bordered={false}
            style={{
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              background: '#fff',
            }}
            headStyle={{ color: '#4e73df', fontWeight: 'bold' }}
            loading={loading}
          >
            <LineChart
              width={500}
              height={300}
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="posts" stroke="#4e73df" activeDot={{ r: 8 }} />
            </LineChart>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="Recent Posts"
            bordered={false}
            style={{
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              background: '#fff',
            }}
            headStyle={{ color: '#4e73df', fontWeight: 'bold' }}
            loading={loading}
          >
            <Table
              columns={columns}
              dataSource={recentPosts}
              pagination={false}
              rowKey="PostID"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;