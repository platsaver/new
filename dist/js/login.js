document.addEventListener("DOMContentLoaded", function() {
    // Hàm lấy danh sách users từ localStorage, đảm bảo luôn mới nhất
    function getUsers() {
        return JSON.parse(localStorage.getItem("users")) || [{ username: "admin", password: "123" }];
    }

    // Hàm kiểm tra và lấy phần tử
    function getElement(selector) {
        const element = document.querySelector(selector);
        if (!element) console.warn(`Không tìm thấy phần tử: ${selector}`);
        return element;
    }

    // Lấy các phần tử
    const loginBtn = getElement("#login-btn");
    const loginPopup = getElement("#login-popup");
    const closePopup = getElement("#close-popup");
    const loginForm = getElement("#login-form");
    const usernameInput = getElement("#username");
    const passwordInput = getElement("#password");
    const errorMessage = getElement("#error-message");
    const showRegister = getElement("#show-register");
    const registerPopup = getElement("#register-popup");

    // Kiểm tra các phần tử cần thiết
    if (!loginBtn || !loginPopup || !closePopup || !loginForm || !usernameInput || !passwordInput || !errorMessage || !showRegister || !registerPopup) {
        console.error("Thiếu các phần tử cần thiết để chạy login popup!");
        return;
    }

    // Mở popup đăng nhập
    loginBtn.addEventListener("click", function(event) {
        event.preventDefault();
        loginPopup.style.display = "flex";
    });

    // Đóng popup đăng nhập
    closePopup.addEventListener("click", function() {
        loginPopup.style.display = "none";
        errorMessage.style.display = "none";
        usernameInput.value = "";
        passwordInput.value = "";
    });

    loginPopup.addEventListener("click", function(event) {
        if (event.target === loginPopup) {
            loginPopup.style.display = "none";
            errorMessage.style.display = "none";
            usernameInput.value = "";
            passwordInput.value = "";
        }
    });

    // Xử lý form đăng nhập
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        // Lấy danh sách users mới nhất từ localStorage trước khi kiểm tra
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

            if (username === "admin") {
                window.location.href = "../../pages/admin.html";
            } else {
                window.location.href = "../../pages/index.html";
            }
        } else {
            errorMessage.textContent = "Tên đăng nhập hoặc mật khẩu không đúng!";
            errorMessage.style.display = "block";
        }

        usernameInput.value = "";
        passwordInput.value = "";
    });

    // Chuyển sang popup đăng ký
    showRegister.addEventListener("click", function(event) {
        event.preventDefault();
        loginPopup.style.display = "none";
        registerPopup.style.display = "flex";
    });

    // Nhận thông tin người dùng mới từ register.js qua postMessage
    window.addEventListener("message", function(event) {
        if (event.data.type === "newUser" && event.data.user) {
            const newUser = event.data.user;
            const users = getUsers();

            // Kiểm tra nếu người dùng chưa tồn tại (tránh trùng lặp)
            if (!users.some(u => u.username === newUser.username)) {
                users.push(newUser);
                localStorage.setItem("users", JSON.stringify(users));
                console.log("Đã nhận và cập nhật người dùng mới từ register.js:", newUser);
            } else {
                console.log("Người dùng đã tồn tại:", newUser.username);
            }
        }
    });
});