document.addEventListener("DOMContentLoaded", () => {
    const bannerUpload = document.getElementById("bannerUpload");
    const bannerInput = document.getElementById("bannerInput");
    const blogTitle = document.getElementById("blogTitle");
    const blogContent = document.getElementById("blogContent");
    const publish = document.getElementById("publish");

    // Handle banner upload
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

    // Publish (Mock)
    document.addEventListener("DOMContentLoaded", function () {
        // Xử lý sự kiện khi nhấn nút "Publish" trên Write Page
        const publishBtn = document.getElementById("publish");
        if (publishBtn) {
            publishBtn.addEventListener("click", function () {
                let title = document.getElementById("blogTitle").value.trim();
                let content = document.getElementById("blogContent").value.trim();
    
                // Lưu tiêu đề và nội dung vào localStorage
                localStorage.setItem("blogTitle", title || "Untitled Blog");
                localStorage.setItem("blogContent", content);
    
                // Kiểm tra nếu có tải ảnh lên
                let fileInput = document.getElementById("bannerInput");
                if (fileInput.files && fileInput.files[0]) {
                    let reader = new FileReader();
                    reader.onload = function (e) {
                        localStorage.setItem("blogImage", e.target.result);
                        window.location.href = "preview.html"; // Chuyển sang trang Preview
                    };
                    reader.readAsDataURL(fileInput.files[0]);
                } else {
                    // Nếu không có ảnh, dùng ảnh mặc định
                    localStorage.setItem("blogImage", "../assets/images/default.jpg");
                    window.location.href = "preview.html"; // Chuyển sang trang Preview
                }
            });
        }
    
        // Xử lý dữ liệu trên Preview Page
        const previewTitle = document.getElementById("previewTitle");
        const previewImage = document.getElementById("previewImage");
    
        if (previewTitle && previewImage) {
            previewTitle.innerText = localStorage.getItem("blogTitle") || "Untitled Blog";
            previewImage.src = localStorage.getItem("blogImage") || "../assets/images/default.jpg";
        }
    
        // Xử lý nút đóng Preview Page
        const closePreview = document.getElementById("closePreview");
        if (closePreview) {
            closePreview.addEventListener("click", function () {
                window.location.href = "index.html"; // Quay lại Write Page
            });
        }
    });
    
});
