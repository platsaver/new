import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const CommentSection = () => {
  return (
    <div className="comment-section">
      <div className="comment-header">
        <div className="comment-title">
          <FontAwesomeIcon icon={faComment} className="comment-icon" />
          <span>Bình luận</span>
        </div>
        <a href="../pages/login.html" className="login-to-comment">
          Đăng nhập để bình luận
        </a>
      </div>
      <div className="comment-input-wrapper">
        <textarea className="comment-textbox" placeholder="Ý kiến của bạn ...."></textarea>
        <FontAwesomeIcon icon={faPaperPlane} className="telegram-icon" />
      </div>
    </div>
  );
};

export default CommentSection;
