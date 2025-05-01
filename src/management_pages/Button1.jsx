import React, { useState, useCallback } from "react";
import { Button, Modal, List, Spin, Alert } from "antd";
import '@ant-design/v5-patch-for-react-19';

const DeletePostsButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    console.log("Posts state đã được cập nhật:", posts);
  }, [posts]);
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/posts");
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Fetched posts:", data); // Log fetched data
      setPosts(data); // Save posts to state
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const showModal = useCallback(() => {
    setIsModalOpen(true);
    fetchPosts();
  }, [fetchPosts]);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const deletePost = useCallback(async (postid) => {
    try {
      console.log("Deleting post with ID:", postid);
      
      const response = await fetch(`http://localhost:3000/posts/${postid}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.statusText}`);
      }
      
      console.log("Xóa thành công, cập nhật UI");
      
      // Sử dụng functional update để đảm bảo luôn làm việc với state mới nhất
      setPosts(prevPosts => {
        console.log("State trước khi cập nhật:", prevPosts);
        const newPosts = prevPosts.filter(post => {
          // Kiểm tra cả hai trường hợp ID có thể có
          const result = post.id !== postid && (post.postid !== postid);
          return result;
        });
        console.log("State sau khi cập nhật:", newPosts);
        return newPosts;
      });
      
    } catch (err) {
      console.error("Delete error:", err.message);
      alert("Không thể xóa bài viết");
    }
  }, []);

  return (
    <>
      <Button onClick={showModal}>Delete Post</Button>
      <Modal
        title="Danh sách bài viết"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width="80%"
      >
        {loading ? (
          <Spin tip="Đang tải bài viết..." />
        ) : error ? (
          <Alert message="Lỗi" description={error} type="error" showIcon />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={posts}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    danger
        onClick={() => {
                      console.log("Bắt đầu xóa bài viết:", item);
                      deletePost(item.postid || item.id);
                    }}
                  >
                    Xóa
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={item.title}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        )}
      </Modal>
    </>
  );
};

export default DeletePostsButton;