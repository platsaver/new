document.addEventListener("DOMContentLoaded", function() {
    let users = JSON.parse(localStorage.getItem("users")) || [{ username: "admin", password: "123" }];

    function getElement(selector) {
        const element = document.querySelector(selector);
        if (!element) console.warn(`Không tìm thấy phần tử: ${selector}`);
        return element;
    }

    const registerPopup = getElement("#register-popup");
    const closeRegisterPopup = getElement("#close-register-popup");
    const registerForm = getElement("#register-form");
    const usernameInput = getElement("#reg-username");
    const passwordInput = getElement("#reg-password");
    const confirmPasswordInput = getElement("#confirm-password");
    const errorMessage = getElement("#reg-error-message");
    const showLogin = getElement("#show-login");
    const loginPopup = getElement("#login-popup");

    if (!registerPopup || !closeRegisterPopup || !registerForm || !usernameInput || !passwordInput || !confirmPasswordInput || !errorMessage || !showLogin || !loginPopup) {
        console.error("Thiếu các phần tử cần thiết để chạy register popup!");
        return;
    }

    closeRegisterPopup.addEventListener("click", function() {
        registerPopup.style.display = "none";
        errorMessage.style.display = "none";
        usernameInput.value = "";
        passwordInput.value = "";
        confirmPasswordInput.value = "";
    });

    registerPopup.addEventListener("click", function(event) {
        if (event.target === registerPopup) {
            registerPopup.style.display = "none";
            errorMessage.style.display = "none";
            usernameInput.value = "";
            passwordInput.value = "";
            confirmPasswordInput.value = "";
        }
    });

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

        if (users.some(u => u.username === username)) {
            errorMessage.textContent = "Tên đăng nhập đã tồn tại!";
            errorMessage.style.display = "block";
            return;
        }

        const newUser = { username: username, password: password };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        window.postMessage({ type: "newUser", user: newUser }, "*");

        errorMessage.style.display = "none";
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        registerPopup.style.display = "none";
        loginPopup.style.display = "flex";

        usernameInput.value = "";
        passwordInput.value = "";
        confirmPasswordInput.value = "";
    });

    showLogin.addEventListener("click", function(event) {
        event.preventDefault();
        registerPopup.style.display = "none";
        loginPopup.style.display = "flex";
    });
});