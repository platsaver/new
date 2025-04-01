document.addEventListener("DOMContentLoaded", function() {
    // Lấy các nút đăng nhập từ DOM
    const mobileLoginButton = document.querySelector("#mobile-login-btn");
    const desktopLoginButton = document.querySelector("#login-btn");

    // Kiểm tra xem cả hai nút có tồn tại không
    if (!mobileLoginButton || !desktopLoginButton) {
        console.error("Không tìm thấy nút #mobile-login-btn hoặc #login-btn trong DOM!");
        return;
    }

    // Kiểm tra trạng thái đăng nhập
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const username = localStorage.getItem("username");

    if (isLoggedIn === "true" && username) {
        // Cập nhật cả hai nút (mobile và desktop)
        [mobileLoginButton, desktopLoginButton].forEach(loginButton => {
            loginButton.textContent = `Welcome, ${username}`;
            loginButton.href = "#"; // Xóa liên kết mặc định
            loginButton.style.cursor = "pointer"; // Con trỏ chuột như nút

            // Thêm sự kiện nhấp để đăng xuất
            loginButton.addEventListener("click", function(event) {
                event.preventDefault();
                // Xóa trạng thái đăng nhập khỏi localStorage
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("username");

                // Chuyển hướng về trang chủ
                window.location.href = "../index.html";
            });
        });
    }
});