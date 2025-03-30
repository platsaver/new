document.addEventListener("DOMContentLoaded", function() {
    // Hàm lấy danh sách users từ localStorage
    const getUsers = () => JSON.parse(localStorage.getItem("users")) || [{ username: "admin", password: "123" }];

    // Hàm lấy phần tử với kiểm tra
    const getElement = (selector) => {
        const element = document.querySelector(selector);
        if (!element) console.warn(`Không tìm thấy phần tử: ${selector}`);
        return element;
    };

    // Lấy các phần tử
    const sidebarLoginBtn = getElement("#sidebar-login-btn"); // Nút trong sidebar
    const navbarLoginBtn = getElement("#login-btn");         // Nút trong navbar
    const loginPopup = getElement("#login-popup");
    const closePopup = getElement("#close-popup");
    const loginForm = getElement("#login-form");
    const usernameInput = getElement("#username");
    const passwordInput = getElement("#password");
    const errorMessage = getElement("#error-message");
    const showRegister = getElement("#show-register");
    const registerPopup = getElement("#register-popup");

    // Kiểm tra các phần tử cần thiết
    if (!loginPopup || !closePopup || !loginForm || !usernameInput || !passwordInput || !errorMessage || !showRegister || !registerPopup) {
        console.error("Thiếu các phần tử cần thiết để chạy login popup!");
        return;
    }

    // Mở popup đăng nhập từ cả hai nút
    [sidebarLoginBtn, navbarLoginBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener("click", (event) => {
                event.preventDefault();
                loginPopup.style.display = "flex";
            });
        }
    });

    // Đóng popup đăng nhập
    closePopup.addEventListener("click", () => {
        loginPopup.style.display = "none";
        errorMessage.style.display = "none";
        usernameInput.value = "";
        passwordInput.value = "";
    });

    loginPopup.addEventListener("click", (event) => {
        if (event.target === loginPopup) {
            loginPopup.style.display = "none";
            errorMessage.style.display = "none";
            usernameInput.value = "";
            passwordInput.value = "";
        }
    });

    // Xử lý form đăng nhập
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const users = getUsers();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            errorMessage.style.display = "none";
            alert(`Đăng nhập thành công! Chào mừng ${username}`);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("username", username);
            loginPopup.style.display = "none";

            window.location.href = username === "admin" ? "../pages/admin.html" : "../pages/index.html";
        } else {
            errorMessage.textContent = "Tên đăng nhập hoặc mật khẩu không đúng!";
            errorMessage.style.display = "block";
        }

        usernameInput.value = "";
        passwordInput.value = "";
    });

    // Chuyển sang popup đăng ký
    showRegister.addEventListener("click", (event) => {
        event.preventDefault();
        loginPopup.style.display = "none";
        registerPopup.style.display = "flex";
    });

    // Nhận thông tin người dùng mới từ register.js qua postMessage
    window.addEventListener("message", (event) => {
        if (event.data.type === "newUser" && event.data.user) {
            const newUser = event.data.user;
            const users = getUsers();
            if (!users.some(u => u.username === newUser.username)) {
                users.push(newUser);
                localStorage.setItem("users", JSON.stringify(users));
                console.log("Đã cập nhật người dùng mới:", newUser);
            }
        }
    });
});