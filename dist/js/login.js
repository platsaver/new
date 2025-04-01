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
    const mobileLoginBtn = getElement("#mobile-login-btn");
    const desktopLoginBtn = getElement("#login-btn");
    const loginPopup = getElement("#login-popup");
    const closePopup = getElement("#close-popup");
    const loginForm = getElement("#login-form");
    const usernameInput = getElement("#username");
    const passwordInput = getElement("#password");
    const errorMessage = getElement("#error-message");
    const showRegister = getElement("#show-register");
    const registerPopup = getElement("#register-popup");
    const closeRegisterPopup = getElement("#close-register-popup");
    const registerForm = getElement("#register-form");
    const regUsernameInput = getElement("#reg-username");
    const regPasswordInput = getElement("#reg-password");
    const confirmPasswordInput = getElement("#confirm-password");
    const regErrorMessage = getElement("#reg-error-message");
    const showLogin = getElement("#show-login");

    // Kiểm tra các phần tử cần thiết
    if (!mobileLoginBtn || !desktopLoginBtn || !loginPopup || !closePopup || !loginForm || 
        !usernameInput || !passwordInput || !errorMessage || !showRegister || !registerPopup) {
        console.error("Thiếu các phần tử cần thiết để chạy login/register popup!");
        return;
    }

    // Gắn sự kiện cho các nút đăng nhập
    [mobileLoginBtn, desktopLoginBtn].forEach(btn => {
        btn.addEventListener("click", (event) => {
            event.preventDefault();
            if (loginPopup) loginPopup.style.display = "flex";
        });
    });

    // Đóng popup đăng nhập
    if (closePopup) {
        closePopup.addEventListener("click", () => {
            if (loginPopup) loginPopup.style.display = "none";
            if (errorMessage) errorMessage.style.display = "none";
            if (usernameInput) usernameInput.value = "";
            if (passwordInput) passwordInput.value = "";
        });
    }

    if (loginPopup) {
        loginPopup.addEventListener("click", (event) => {
            if (event.target === loginPopup) {
                loginPopup.style.display = "none";
                if (errorMessage) errorMessage.style.display = "none";
                if (usernameInput) usernameInput.value = "";
                if (passwordInput) passwordInput.value = "";
            }
        });
    }

    // Xử lý form đăng nhập
    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const users = getUsers();
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                if (errorMessage) errorMessage.style.display = "none";
                alert(`Đăng nhập thành công! Chào mừng ${username}`);
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("username", username);
                if (loginPopup) loginPopup.style.display = "none";
                window.location.href = username === "admin" ? "../pages/admin.html" : "../pages/index.html";
            } else {
                if (errorMessage) {
                    errorMessage.textContent = "Tên đăng nhập hoặc mật khẩu không đúng!";
                    errorMessage.style.display = "block";
                }
            }

            if (usernameInput) usernameInput.value = "";
            if (passwordInput) passwordInput.value = "";
        });
    }

    // Chuyển sang popup đăng ký
    if (showRegister) {
        showRegister.addEventListener("click", (event) => {
            event.preventDefault();
            if (loginPopup) loginPopup.style.display = "none";
            if (registerPopup) registerPopup.style.display = "flex";
        });
    }

    // Đóng popup đăng ký
    if (closeRegisterPopup) {
        closeRegisterPopup.addEventListener("click", () => {
            if (registerPopup) registerPopup.style.display = "none";
            if (regErrorMessage) regErrorMessage.style.display = "none";
            if (regUsernameInput) regUsernameInput.value = "";
            if (regPasswordInput) regPasswordInput.value = "";
            if (confirmPasswordInput) confirmPasswordInput.value = "";
        });
    }

    if (registerPopup) {
        registerPopup.addEventListener("click", (event) => {
            if (event.target === registerPopup) {
                registerPopup.style.display = "none";
                if (regErrorMessage) regErrorMessage.style.display = "none";
                if (regUsernameInput) regUsernameInput.value = "";
                if (regPasswordInput) regPasswordInput.value = "";
                if (confirmPasswordInput) confirmPasswordInput.value = "";
            }
        });
    }

    // Xử lý form đăng ký
    if (registerForm) {
        registerForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const users = getUsers();
            const username = regUsernameInput.value.trim();
            const password = regPasswordInput.value.trim();
            const confirmPassword = confirmPasswordInput.value.trim();

            if (users.some(u => u.username === username)) {
                if (regErrorMessage) {
                    regErrorMessage.textContent = "Tên đăng nhập đã tồn tại!";
                    regErrorMessage.style.display = "block";
                }
            } else if (password !== confirmPassword) {
                if (regErrorMessage) {
                    regErrorMessage.textContent = "Mật khẩu xác nhận không khớp!";
                    regErrorMessage.style.display = "block";
                }
            } else {
                const newUser = { username, password };
                users.push(newUser);
                localStorage.setItem("users", JSON.stringify(users));
                if (regErrorMessage) regErrorMessage.style.display = "none";
                alert("Đăng ký thành công! Vui lòng đăng nhập.");
                if (registerPopup) registerPopup.style.display = "none";
                if (loginPopup) loginPopup.style.display = "flex";

                if (regUsernameInput) regUsernameInput.value = "";
                if (regPasswordInput) regPasswordInput.value = "";
                if (confirmPasswordInput) confirmPasswordInput.value = "";
            }
        });
    }

    // Chuyển từ popup đăng ký về đăng nhập
    if (showLogin) {
        showLogin.addEventListener("click", (event) => {
            event.preventDefault();
            if (registerPopup) registerPopup.style.display = "none";
            if (loginPopup) loginPopup.style.display = "flex";
        });
    }
});