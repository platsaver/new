document.addEventListener("DOMContentLoaded", function() {
    // Danh sách bài viết giả lập (thay bằng dữ liệu thực nếu có)
    const posts = [
        { id: 1, title: "Tai nạn giao thông", url: "../posts/post1.html" },
        { id: 2, title: "Khu tập thể thành công sẽ được cải tạo", url: "../posts/post2.html" },
        { id: 3, title: "Số đơn vị hành chính cấp tỉnh cần sáp nhập đã được xác định", url: "../posts/post3.html" },
        { id: 4, title: "Ôtô tông 10 xe máy ở ngã tư Thủ Đức", url: "../posts/post4.html" },
        { id: 5, title: "Đề xuất bố trí nhà và xe công vụ cho nhà khoa học đầu ngành", url: "../posts/post5.html" },
        { id: 6, title: "Giá vàng nhẫn lập kỷ lục gần 97 triệu đồng", url: "../posts/post6.html" },
        { id: 7, title: "Bộ trưởng Tài chính Mỹ: Không loại trừ nguy cơ kinh tế suy thoái", url: "../posts/post7.html" },
        { id: 8, title: "Tin tức thể thao", url: "../posts/post8.html" },
        { id: 9, title: "Gỡ khó cho doanh nghiệp - chìa khóa để TP HCM tăng trưởng 10%", url: "../posts/post9.html" },
        { id: 10, title: "Pháp luật lao động", url: "../posts/post10.html" },
        { id: 11, title: "Thời sự trong nước", url: "../posts/post11.html" },
        { id: 12, title: "Doanh nghiệp lớn", url: "../posts/post12.html" },
        { id: 13, title: "Bất động sản TP.HCM", url: "../posts/post13.html" },
        { id: 14, title: "Cựu vụ phó khai thông thầu với AIC do áp lực từ cựu bộ trưởng Trương Minh Tuấn", url: "../posts/post14.html" },
        { id: 15, title: "Lừa làm bùa yêu, cắt vong", url: "../posts/post15.html" },
        { id: 16, title: "Cảnh sát Mỹ phá đường dây mại dâm cao cấp, giao dịch bí mật", url: "../posts/post16.html" },
        { id: 17, title: "Thanh tra đề nghị Bộ Công an điều tra 2 dự án nhà tại Vĩnh Long", url: "../posts/post17.html" }
    ];

    // Xử lý tìm kiếm từ tất cả các trang
    const searchForms = document.querySelectorAll(".search-form"); 
    searchForms.forEach(form => {
        form.addEventListener("submit", function(event) {
            event.preventDefault();
            const searchInput = form.querySelector(".search-input").value.trim().toLowerCase();

            if (searchInput) {
                // Lọc bài viết dựa trên từ khóa
                const results = posts.filter(post => 
                    post.title.toLowerCase().includes(searchInput)
                );

                // Lưu kết quả vào localStorage để hiển thị ở search.html
                localStorage.setItem("searchResults", JSON.stringify(results));
                
                // Chuyển hướng đến trang kết quả
                window.location.href = "../pages/search.html";
            } else {
                alert("Vui lòng nhập từ khóa tìm kiếm!");
            }
        });
    });

    // Hiển thị kết quả trên trang search.html
    if (window.location.pathname.includes("search.html")) {
        const searchResultsDiv = document.getElementById("search-results");
        const results = JSON.parse(localStorage.getItem("searchResults")) || [];

        if (results.length > 0) {
            searchResultsDiv.innerHTML = "<ul>" + 
                results.map(post => 
                    `<li><a href="${post.url}">${post.title}</a></li>`
                ).join("") + 
                "</ul>";
        } else {
            searchResultsDiv.innerHTML = "<p>Không tìm thấy bài viết nào phù hợp.</p>";
        }
    }
});