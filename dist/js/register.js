document.addEventListener("DOMContentLoaded", function() {
    const registerForm = document.querySelector("#register-form form");
    const usernameInput = document.querySelector("#username");
    const passwordInput = document.querySelector("#password");
    const confirmPasswordInput = document.querySelector("#confirm-password");
    const errorMessage = document.querySelector("#error-message");

    if (!registerForm) {
        console.error("Không tìm thấy #register-form form trong DOM!");
        return;
    }

    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (username === "" || password === "" || confirmPassword === "") {
            errorMessage.textContent = "Vui lòng điền đầy đủ các trường!";
            errorMessage.style.display = "block";
            return;
        }
        if (password !== confirmPassword) {
            errorMessage.textContent = "Mật khẩu xác nhận không khớp!";
            errorMessage.style.display = "block";
            return;
        }
        if (username.length < 3 || password.length < 3) {
            errorMessage.textContent = "Tên đăng nhập và mật khẩu phải có ít nhất 3 ký tự!";
            errorMessage.style.display = "block";
            return;
        }

        // Lấy danh sách tài khoản hiện có từ localStorage
        let users = JSON.parse(localStorage.getItem("users")) || [
            { username: "admin", password: "123" }
        ];

        // Kiểm tra xem username đã tồn tại chưa
        if (users.some(u => u.username === username)) {
            errorMessage.textContent = "Tên đăng nhập đã tồn tại!";
            errorMessage.style.display = "block";
            return;
        }

        // Tạo và thêm tài khoản mới
        const newUser = { username: username, password: password };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users)); // Lưu vào localStorage

        // Gửi thông điệp (tùy chọn, để tương thích với login.js nếu mở cùng lúc)
        window.postMessage({ type: "newUser", user: newUser }, "*");

        errorMessage.style.display = "none";
        alert("Đăng ký thành công! Tài khoản: " + username + ". Vui lòng đăng nhập.");
        window.location.href = "login.html";

        usernameInput.value = "";
        passwordInput.value = "";
        confirmPasswordInput.value = "";
    });
});