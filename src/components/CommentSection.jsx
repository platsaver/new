import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import LoginForm from "./LoginForm.jsx";
import { message } from "antd";

const CommentSection = () => {
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userProfilesMap, setUserProfilesMap] = useState({});

  const userId = localStorage.getItem("userId");
  const postId = localStorage.getItem("selectedPostID");

  const defaultAvatar = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"; // Placeholder image incase 

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/check-auth', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok && data.isAuthenticated) {
          setUserName(data.user.username);
          localStorage.setItem('userId', data.user.id);
        } else {
          setUserName(null);
          localStorage.removeItem('userId');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setUserName(null);
        localStorage.removeItem('userId');
      }
    };
    checkAuthStatus();
  }, []);

  // Listen for user login events to sync auth status
  useEffect(() => {
    const handleUserLoginEvent = () => {
      const checkAuthStatus = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/check-auth', {
            method: 'GET',
            credentials: 'include',
          });
          const data = await response.json();
          if (response.ok && data.isAuthenticated) {
            setUserName(data.user.username);
            localStorage.setItem('userId', data.user.id);
          } else {
            setUserName(null);
            localStorage.removeItem('userId');
          }
        } catch (error) {
          console.error('Error checking auth status:', error);
          setUserName(null);
          localStorage.removeItem('userId');
        }
      };
      checkAuthStatus();
    };
    window.addEventListener('userLoggedIn', handleUserLoginEvent);
    return () => window.removeEventListener('userLoggedIn', handleUserLoginEvent);
  }, []);

  // Fetch comments when component mounts
  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) {
        setError("Không tìm thấy bài viết.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`http://localhost:3000/api/comments/${postId}`);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
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

  useEffect(() => {
    const fetchUserProfiles = async () => {
      const userIds = [...new Set(comments.map(comment => comment.userid))]; // Unique userIds
      const updatedUserProfilesMap = { ...userProfilesMap };

      for (const id of userIds) {
        if (!updatedUserProfilesMap[id]) {
          try {
            const response = await fetch(`http://localhost:3000/api/users/${id}/profile`);
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const data = await response.json();
            updatedUserProfilesMap[id] = {
              username: data.username,
              avatarURL: `http://localhost:3000${data.avatarURL}`,
            };
          } catch (error) {
            console.error(`Error fetching profile for userId ${id}:`, error);
            updatedUserProfilesMap[id] = {
              username: `User_${id}`,
              avatarURL: null,
            };
          }
        }
      }
      setUserProfilesMap(updatedUserProfilesMap);
    };

    if (comments.length > 0) {
      fetchUserProfiles();
    }
  }, [comments, userProfilesMap]);

  const handleSubmitComment = async () => {
    if (!userId) {
      message.warning("Vui lòng đăng nhập để bình luận!");
      setShowLoginForm(true);
      return;
    }
    if (!postId) {
      message.error("Không tìm thấy bài viết để bình luận!");
      return;
    }
    if (!commentContent.trim()) {
      message.warning("Vui lòng nhập nội dung bình luận!");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userId, content: commentContent }),
        credentials: 'include',
      });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const newComment = await response.json();
      setComments([newComment, ...comments]);
      setCommentContent("");
      setSubmitError(null);
      message.success("Bình luận đã được gửi thành công!");
    } catch (err) {
      console.error("Error submitting comment:", err);
      setSubmitError("Không thể gửi bình luận: " + err.message);
      message.error("Không thể gửi bình luận: " + err.message);
    }
  };

  const handleLoginClick = (e) => {
    if (e) e.preventDefault();
    setShowLoginForm(true);
  };

  const handleBackFromLogin = () => {
    setShowLoginForm(false);
  };

  const handleLoginSuccess = (username) => {
    setUserName(username);
    setShowLoginForm(false);
    message.success("Đăng nhập thành công!");
    window.dispatchEvent(new Event('userLoggedIn'));
  };

  if (showLoginForm) {
    return (
      <div className="login-page-container">
        <LoginForm onBack={handleBackFromLogin} onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="comment-section">
      <div className="comment-header">
        <div className="comment-title">
          <FontAwesomeIcon icon={faComment} className="comment-icon" />
          <span>Bình luận ({comments.length})</span>
        </div>
        {!userName && (
          <a href="#" className="login-to-comment" onClick={handleLoginClick}>
            Đăng nhập để bình luận
          </a>
        )}
      </div>
      <div className="comment-input-wrapper">
        <textarea
          className="comment-textbox"
          placeholder="Ý kiến của bạn ...."
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          disabled={!userName}
        />
        <FontAwesomeIcon
          icon={faPaperPlane}
          className="telegram-icon"
          onClick={handleSubmitComment}
          style={{ cursor: userName ? "pointer" : "not-allowed", opacity: userName ? 1 : 0.5 }}
        />
      </div>
      {submitError && <p className="error-message" style={{ color: "red" }}>{submitError}</p>}
      <div className="comments-list">
        {loading ? (
          <p>Đang tải bình luận...</p>
        ) : error ? (
          <p className="error-message" style={{ color: "red" }}>{error}</p>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.commentid} className="comment-item" style={{ marginBottom: "15px", padding: "10px", borderBottom: "1px solid #ddd", display: "flex", alignItems: "flex-start" }}>
              <img
                src={userProfilesMap[comment.userid]?.avatarURL || defaultAvatar}
                alt="User Avatar"
                style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px", objectFit: "cover" }}
              />
              <div>
                <p>
                  <strong>{userProfilesMap[comment.userid]?.username || `User_${comment.userid}`}</strong>{' '}
                  <span style={{ color: "#888", fontSize: "0.9em" }}>
                    ({new Date(comment.createdatdate).toLocaleString("vi-VN")})
                  </span>
                </p>
                <p>{comment.content}</p>
              </div>
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