import React from 'react';
import { Card, List, Typography, Button } from 'antd';

const { Title, Text } = Typography;

const SearchResults = ({ results, pagination, onBack }) => {
  return (
    <div className="container-xl py-4">
      <Button onClick={onBack} style={{ marginBottom: 16 }}>
        Back to Previous Page
      </Button>
      <Title level={3}>Search Results</Title>
      {results.length === 0 ? (
        <Text>No posts found.</Text>
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={results}
          renderItem={(post) => (
            <List.Item>
              <Card title={post.title}>
                <Text strong>Status:</Text> {post.status}<br />
                <Text strong>Featured:</Text> {post.featured ? 'Yes' : 'No'}<br />
                <Text strong>Created At:</Text> {new Date(post.createdatdate).toLocaleString()}<br />
                <div className="content mt-2" dangerouslySetInnerHTML={{ __html: post.content.slice(0, 200) + '...' }} />
                {post.link && (
                  <a href={post.link} target="_blank" rel="noopener noreferrer">
                    Read More
                  </a>
                )}
              </Card>
            </List.Item>
          )}
          pagination={{
            total: pagination.total,
            pageSize: pagination.limit,
            current: Math.floor(pagination.offset / pagination.limit) + 1,
            onChange: (page) => {
              // Handle pagination change if needed
              console.log('Page:', page);
            },
          }}
        />
      )}
    </div>
  );
};

export default SearchResults;