// search.js
document.addEventListener('DOMContentLoaded', function () {
    // Lấy tất cả các search-form
    const searchForms = document.querySelectorAll('.search-form');

    searchForms.forEach(function (form) {
        const searchIcon = form.querySelector('.search-icon');
        const searchInput = form.querySelector('.search-input');

        // Sự kiện click vào biểu tượng tìm kiếm
        searchIcon.addEventListener('click', function (event) {
            event.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
            searchInput.classList.toggle('active');

            // Focus vào input khi hiển thị
            if (searchInput.classList.contains('active')) {
                searchInput.focus();
            }
        });

        // Ẩn thanh tìm kiếm khi click ra ngoài
        document.addEventListener('click', function (event) {
            if (!form.contains(event.target) && searchInput.classList.contains('active')) {
                searchInput.classList.remove('active');
            }
        });

        // Ẩn thanh tìm kiếm khi nhấn Enter (tùy chọn)
        searchInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                // Có thể thêm logic xử lý tìm kiếm ở đây nếu cần
                searchInput.classList.remove('active');
            }
        });
    });
});