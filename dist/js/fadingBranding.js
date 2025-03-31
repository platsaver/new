window.addEventListener("scroll", function () {
    const branding = document.querySelector('.custom-branding');
    const scrollPosition = window.scrollY; // Vị trí cuộn của trang
    const triggerPoint = 100; // 500px từ đầu trang

    if (scrollPosition > triggerPoint) {
        branding.classList.add("show");
    } else {
        branding.classList.remove("show");
    }
    });