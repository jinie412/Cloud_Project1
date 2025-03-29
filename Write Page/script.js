document.addEventListener("DOMContentLoaded", () => {
    const bannerUpload = document.getElementById("bannerUpload");
    const bannerInput = document.getElementById("bannerInput");
    const blogTitleInput = document.getElementById("blogTitle");
    const blogContentInput = document.getElementById("blogContent");
    const publishBtnWritePage = document.getElementById("publish"); // Đổi tên để phân biệt
    const previewTitleDisplay = document.getElementById("displayTitle");
    const previewImage = document.getElementById("previewImage");
    const closePreviewBtn = document.getElementById("closePreview");
    const descriptionInput = document.getElementById("blogDescription");
    const descriptionCountDisplay = document.getElementById("descriptionCount");

    // Handle banner upload on Write Page
    if (bannerUpload && bannerInput) {
        bannerUpload.addEventListener("click", () => bannerInput.click());
        bannerInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    bannerUpload.style.backgroundImage = `url(${e.target.result})`;
                    bannerUpload.style.backgroundSize = "cover";
                    bannerUpload.style.backgroundPosition = "center";
                    bannerUpload.textContent = "";
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Publish on Write Page
    if (publishBtnWritePage) {
        publishBtnWritePage.addEventListener("click", function () {
            let title = blogTitleInput.value.trim();
            let content = blogContentInput.value.trim();

            // Lưu tiêu đề và nội dung vào localStorage
            localStorage.setItem("blogTitle", title || "Untitled Blog");
            localStorage.setItem("blogContent", content);

            // Kiểm tra nếu có tải ảnh lên
            let fileInput = document.getElementById("bannerInput");
            if (fileInput.files && fileInput.files[0]) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    localStorage.setItem("blogImage", e.target.result);
                    window.location.href = "preview.html"; // Chuyển sang trang Preview SAU KHI ĐỌC ẢNH
                };
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                // Nếu không có ảnh, dùng ảnh mặc định và chuyển hướng ngay
                localStorage.setItem("blogImage", "../assets/images/default.jpg");
                window.location.href = "preview.html";
            }
        });
    }

    // Xử lý dữ liệu trên Preview Page
    if (previewTitleDisplay && previewImage) {
        previewTitleDisplay.innerText = localStorage.getItem("blogTitle") || "Untitled Blog";
        previewImage.src = localStorage.getItem("blogImage") || "../assets/images/default.jpg";
    }

    // Theo dõi số lượng ký tự trong Description
    if (descriptionInput && descriptionCountDisplay) {
        descriptionInput.addEventListener("input", function () {
            const text = this.value;
            const charCount = text.length; // Đếm số ký tự
            descriptionCountDisplay.innerText = `${charCount}/200 characters`;
        });
    }

    // Xử lý nút đóng Preview Page
    if (closePreviewBtn) {
        closePreviewBtn.addEventListener("click", function () {
            window.location.href = "index.html"; // Quay lại Write Page
        });
    }
});