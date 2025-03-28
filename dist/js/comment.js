document.addEventListener("DOMContentLoaded", function() {
    const commentForm = document.getElementById('commentForm');
    const loginPrompt = document.getElementById('login-prompt');
    const nameInput = document.getElementById('name');
    const commentsList = document.querySelector('.comments-list');

    // Kiểm tra sự tồn tại của các phần tử
    if (!commentForm || !loginPrompt || !commentsList) {
        console.error("Không tìm thấy một hoặc nhiều phần tử cần thiết:");
        if (!commentForm) console.error("Không tìm thấy #commentForm");
        if (!loginPrompt) console.error("Không tìm thấy #login-prompt");
        if (!commentsList) console.error("Không tìm thấy .comments-list");
        return;
    }

    // Kiểm tra trạng thái đăng nhập
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const username = localStorage.getItem("username");

    if (isLoggedIn === "true" && username) {
        // Nếu đã đăng nhập, hiển thị form và điền sẵn tên người dùng
        commentForm.style.display = "block";
        loginPrompt.style.display = "none";
        nameInput.value = username; // Điền sẵn tên người dùng từ localStorage
        nameInput.readOnly = true; // Không cho chỉnh sửa tên

        // Xử lý gửi bình luận
        commentForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const commentText = document.getElementById('comment').value.trim();

            if (commentText === "") {
                alert("Vui lòng nhập nội dung bình luận!");
                return;
            }

            // Lấy thời gian hiện tại
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) + 
                            ', ' + now.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });

            // Tạo phần tử bình luận mới
            const newComment = document.createElement('div');
            newComment.classList.add('comment');
            newComment.innerHTML = `
                <p class="comment-author"><strong>${username}</strong> - <span class="comment-time">${timeString}</span></p>
                <p class="comment-text">${commentText}</p>
            `;

            // Thêm bình luận mới vào đầu danh sách
            const firstComment = commentsList.querySelector('.comment');
            if (firstComment) {
                commentsList.insertBefore(newComment, firstComment.nextSibling);
            } else {
                commentsList.appendChild(newComment);
            }

            // Xóa nội dung textarea sau khi gửi
            document.getElementById('comment').value = '';
        });
    } else {
        // Nếu chưa đăng nhập, hiển thị thông báo và ẩn form
        loginPrompt.style.display = "block";
        commentForm.style.display = "none";
    }
});