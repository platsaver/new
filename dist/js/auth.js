document.addEventListener("DOMContentLoaded", function() {
    const loginButton = document.querySelector(".login-btn");

    if (!loginButton) {
        console.error("Không tìm thấy nút .login-btn trong DOM!");
        return;
    }

    // Kiểm tra trạng thái đăng nhập
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const username = localStorage.getItem("username");

    if (isLoggedIn === "true" && username) {
        // Thay thế nút "Đăng nhập" bằng "Welcome, [username]"
        loginButton.textContent = `Welcome, ${username}`;
        loginButton.href = "#"; // Xóa liên kết mặc định
        loginButton.style.cursor = "pointer"; // Con trỏ chuột như nút

        // Thêm sự kiện nhấp để đăng xuất
        loginButton.addEventListener("click", function() {
            // Xóa trạng thái đăng nhập khỏi localStorage
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("username");

            // Chuyển hướng về trang chủ
            window.location.href = "../index.html";
        });
    }
});