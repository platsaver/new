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
    const registerPopup = getElement("#register-popup");
    const closeRegisterPopup = getElement("#close-register-popup");
    const registerForm = getElement("#register-form");
    const usernameInput = getElement("#reg-username");
    const passwordInput = getElement("#reg-password");
    const confirmPasswordInput = getElement("#confirm-password");
    const errorMessage = getElement("#reg-error-message");
    const showLogin = getElement("#show-login");
    const loginPopup = getElement("#login-popup");

    // Kiểm tra các phần tử cần thiết
    if (!registerPopup || !closeRegisterPopup || !registerForm || !usernameInput || !passwordInput || !confirmPasswordInput || !errorMessage || !showLogin || !loginPopup) {
        console.error("Thiếu các phần tử cần thiết để chạy register popup!");
        return;
    }

    // Đóng popup đăng ký
    closeRegisterPopup.addEventListener("click", () => {
        registerPopup.style.display = "none";
        errorMessage.style.display = "none";
        clearForm();
    });

    registerPopup.addEventListener("click", (event) => {
        if (event.target === registerPopup) {
            registerPopup.style.display = "none";
            errorMessage.style.display = "none";
            clearForm();
        }
    });

    // Xử lý form đăng ký
    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        const users = getUsers();

        if (!validateForm(username, password, confirmPassword, users)) return;

        const newUser = { username, password };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        window.postMessage({ type: "newUser", user: newUser }, "*");

        errorMessage.style.display = "none";
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        registerPopup.style.display = "none";
        loginPopup.style.display = "flex";
        clearForm();
    });

    // Chuyển sang popup đăng nhập
    showLogin.addEventListener("click", (event) => {
        event.preventDefault();
        registerPopup.style.display = "none";
        loginPopup.style.display = "flex";
    });

    // Hàm xóa dữ liệu form
    function clearForm() {
        usernameInput.value = "";
        passwordInput.value = "";
        confirmPasswordInput.value = "";
    }

    // Hàm kiểm tra dữ liệu form
    function validateForm(username, password, confirmPassword, users) {
        if (username === "" || password === "" || confirmPassword === "") {
            errorMessage.textContent = "Vui lòng điền đầy đủ các trường!";
            errorMessage.style.display = "block";
            return false;
        }
        if (password !== confirmPassword) {
            errorMessage.textContent = "Mật khẩu xác nhận không khớp!";
            errorMessage.style.display = "block";
            return false;
        }
        if (username.length < 3 || password.length < 3) {
            errorMessage.textContent = "Tên đăng nhập và mật khẩu phải có ít nhất 3 ký tự!";
            errorMessage.style.display = "block";
            return false;
        }
        if (users.some(u => u.username === username)) {
            errorMessage.textContent = "Tên đăng nhập đã tồn tại!";
            errorMessage.style.display = "block";
            return false;
        }
        return true;
    }
});