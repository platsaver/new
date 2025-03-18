// Chờ DOM tải xong trước khi truy cập các phần tử
document.addEventListener("DOMContentLoaded", function() {
    // Lấy danh sách tài khoản từ localStorage, nếu chưa có thì khởi tạo với admin
    let users = JSON.parse(localStorage.getItem("users")) || [
        { username: "admin", password: "123" }
    ];

    const loginForm = document.querySelector("#login-form form");
    const usernameInput = document.querySelector("#username");
    const passwordInput = document.querySelector("#password");
    const errorMessage = document.querySelector("#error-message");

    // Kiểm tra xem các phần tử có tồn tại không
    if (!loginForm || !usernameInput || !passwordInput || !errorMessage) {
        console.error("Không tìm thấy một hoặc nhiều phần tử cần thiết trong DOM!");
        return;
    }

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Kiểm tra thông tin đăng nhập
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            // Đăng nhập thành công
            errorMessage.style.display = "none";
            alert(`Đăng nhập thành công! Chào mừng ${username}`);

            // Lưu trạng thái đăng nhập và tên người dùng vào localStorage
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("username", username);

            // Chuyển hướng dựa trên vai trò người dùng
            if (username === "admin") {
                window.location.href = "../pages/admin.html";
            } else {
                window.location.href = "../pages/index.html";
            }
        } else {
            errorMessage.textContent = "Tên đăng nhập hoặc mật khẩu không đúng!";
            errorMessage.style.display = "block";
        }

        // Xóa giá trị trong input sau khi submit
        usernameInput.value = "";
        passwordInput.value = "";
    });

    // Nhận tài khoản mới từ register.js và cập nhật localStorage
    window.addEventListener("message", function(event) {
        if (event.data.type === "newUser" && event.data.user) {
            const newUser = event.data.user;
            // Kiểm tra xem tài khoản đã tồn tại chưa
            if (!users.some(u => u.username === newUser.username)) {
                users.push(newUser);
                localStorage.setItem("users", JSON.stringify(users));
                console.log("Tài khoản mới được thêm từ register:", newUser);
            } else {
                console.log("Tài khoản đã tồn tại:", newUser.username);
            }
        }
    });
});