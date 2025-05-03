import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const CommentSection = () => {
  const [commentContent, setCommentContent] = useState(""); // Nội dung bình luận người dùng nhập
  const [comments, setComments] = useState([]); // Danh sách bình luận
  const [loading, setLoading] = useState(true); // Trạng thái tải bình luận
  const [error, setError] = useState(null); // Lỗi khi tải bình luận
  const [submitError, setSubmitError] = useState(null); // Lỗi khi gửi bình luận

  // Lấy userID và postID từ localStorage
  const userId = localStorage.getItem("userId");
  const postId = localStorage.getItem("selectedPostID");

  // Lấy danh sách bình luận khi component được mount
  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) {
        setError("Không tìm thấy bài viết.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/comments/${postId}`);
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        const data = await response.json();
        setComments(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Không thể tải bình luận: " + err.message);
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  // Xử lý gửi bình luận
  const handleSubmitComment = async () => {
    if (!userId) {
      alert("Vui lòng đăng nhập để bình luận!");
      return;
    }

    if (!postId) {
      alert("Không tìm thấy bài viết để bình luận!");
      return;
    }

    if (!commentContent.trim()) {
      alert("Vui lòng nhập nội dung bình luận!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          userId,
          content: commentContent,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const newComment = await response.json();
      setComments((prevComments) => [newComment, ...prevComments]); // Thêm bình luận mới vào đầu danh sách
      setCommentContent(""); // Xóa nội dung textarea sau khi gửi
      setSubmitError(null);
    } catch (err) {
      console.error("Error submitting comment:", err);
      setSubmitError("Không thể gửi bình luận: " + err.message);
    }
  };

  return (
    <div className="comment-section">
      <div className="comment-header">
        <div className="comment-title">
          <FontAwesomeIcon icon={faComment} className="comment-icon" />
          <span>Bình luận ({comments.length})</span>
        </div>
        {!userId && (
          <a href="../pages/login.html" className="login-to-comment">
            Đăng nhập để bình luận
          </a>
        )}
      </div>

      {/* Form nhập bình luận */}
      <div className="comment-input-wrapper">
        <textarea
          className="comment-textbox"
          placeholder="Ý kiến của bạn ...."
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          disabled={!userId} // Vô hiệu hóa nếu chưa đăng nhập
        />
        <FontAwesomeIcon
          icon={faPaperPlane}
          className="telegram-icon"
          onClick={handleSubmitComment}
          style={{ cursor: userId ? "pointer" : "not-allowed", opacity: userId ? 1 : 0.5 }}
        />
      </div>
      {submitError && <p className="error-message" style={{ color: "red" }}>{submitError}</p>}

      {/* Hiển thị danh sách bình luận */}
      <div className="comments-list">
        {loading ? (
          <p>Đang tải bình luận...</p>
        ) : error ? (
          <p className="error-message" style={{ color: "red" }}>{error}</p>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.commentid} className="comment-item" style={{ marginBottom: "15px", padding: "10px", borderBottom: "1px solid #ddd" }}>
              <p>
                <strong>{comment.userid}</strong> <span style={{ color: "#888", fontSize: "0.9em" }}>({new Date(comment.createdatdate).toLocaleString("vi-VN")})</span>
              </p>
              <p>{comment.content}</p>
            </div>
          ))
        ) : (
          <p>Chưa có bình luận nào.</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;