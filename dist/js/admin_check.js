document.addEventListener("DOMContentLoaded", function() {
    // Kiểm tra trạng thái đăng nhập và tên người dùng
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const username = localStorage.getItem("username");

    // Log để kiểm tra giá trị thực tế
    console.log("isLoggedIn:", isLoggedIn);
    console.log("username:", username);

    // Nếu chưa đăng nhập hoặc không phải "admin", chuyển hướng
    if (isLoggedIn !== "true" || username !== "admin") {
        alert("Bạn không có quyền truy cập trang này! Chỉ dành cho admin.");
        window.location.href = "../login.html"; // Đảm bảo đường dẫn đúng
    }
});