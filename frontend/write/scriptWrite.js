document.addEventListener("DOMContentLoaded", () => {
    const bannerUpload = document.getElementById("bannerUpload");
    const bannerInput = document.getElementById("bannerInput"); // Input trên trang Write
    const blogTitleInput = document.getElementById("blogTitle");
    const blogContentInput = document.getElementById("blogContent");
    const publishBtnWritePage = document.getElementById("publish");
    const previewTitleDisplay = document.getElementById("displayTitle");
    const previewImage = document.getElementById("previewImage");
    const closePreviewBtn = document.getElementById("closePreview");
    const descriptionInput = document.getElementById("blogDescription");
    const descriptionCountDisplay = document.getElementById("descriptionCount");
    const publishBtnPreviewPage = document.querySelector(".publish-btn");
    const topicInputPreview = document.getElementById("blogTopic");
    const topicContainerPreview = document.createElement("div");
    topicContainerPreview.classList.add("mt-2");
    const bannerInputPreview = document.getElementById("bannerInputPreview"); // Input ẩn trên trang Preview

    // Lưu trạng thái ban đầu của trang Write khi tải
    const initialWriteState = {
        title: blogTitleInput ? blogTitleInput.value : "",
        content: blogContentInput ? blogContentInput.value : "",
        banner: bannerUpload ? bannerUpload.style.backgroundImage : "",
        bannerText: bannerUpload ? bannerUpload.textContent : ""
    };

    let selectedBannerFile = null; // Biến để lưu tệp banner

    // Handle banner upload on Write Page (chỉ hiển thị preview và lưu tệp vào biến)
    if (bannerUpload && bannerInput) {
        bannerUpload.addEventListener("click", () => bannerInput.click());
        bannerInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                selectedBannerFile = file; // Lưu tệp vào biến
                const reader = new FileReader();
                reader.onload = (e) => {
                    bannerUpload.style.backgroundImage = `url(${e.target.result})`;
                    bannerUpload.style.backgroundSize = "cover";
                    bannerUpload.style.backgroundPosition = "center";
                    bannerUpload.textContent = "";
                    localStorage.setItem("blogImageForPreview", e.target.result); // Vẫn giữ để hiển thị preview
                };
                reader.readAsDataURL(file);
            } else {
                selectedBannerFile = null; // Xóa biến nếu không có tệp nào được chọn
                bannerUpload.style.backgroundImage = "";
                bannerUpload.style.backgroundColor = "#e5e7eb";
                bannerUpload.textContent = "Upload Banner";
                localStorage.removeItem("blogImageForPreview");
            }
        });
    }

    // Publish on Write Page (lưu Data URL cho Preview)
    if (publishBtnWritePage) {
        publishBtnWritePage.addEventListener("click", function () {
            let title = blogTitleInput.value.trim();
            let content = blogContentInput.value.trim();
            const storedImage = localStorage.getItem("blogImageForPreview");
            localStorage.setItem("currentBannerPreview", storedImage || "../assets/images/default.jpg");
            localStorage.setItem("blogTitle", title || "Untitled Blog");
            localStorage.setItem("blogContent", content);
            window.location.href = "preview.html";
        });
    }

    // Xử lý dữ liệu trên Preview Page (hiển thị preview từ localStorage)
    if (previewTitleDisplay && previewImage) {
        previewTitleDisplay.innerText = localStorage.getItem("blogTitle") || "Untitled Blog";
        previewImage.src = localStorage.getItem("currentBannerPreview") || "../assets/images/default.jpg";
    }

    // Theo dõi số lượng ký tự trong Description
    if (descriptionInput && descriptionCountDisplay) {
        descriptionInput.addEventListener("input", function () {
            const text = this.value;
            const charCount = text.length;
            descriptionCountDisplay.innerText = `${charCount}/200 characters`;
        });
    }

    // Xử lý nút đóng Preview Page (khôi phục preview)
    if (closePreviewBtn) {
        closePreviewBtn.addEventListener("click", function () {
            const storedTitle = localStorage.getItem("blogTitle");
            const storedContent = localStorage.getItem("blogContent");
            const storedBannerPreview = localStorage.getItem("currentBannerPreview");

            if (blogTitleInput) blogTitleInput.value = storedTitle || initialWriteState.title;
            if (blogContentInput) blogContentInput.value = storedContent || initialWriteState.content;
            if (bannerUpload && storedBannerPreview && storedBannerPreview !== "../assets/images/default.jpg") {
                bannerUpload.style.backgroundImage = `url(${storedBannerPreview})`;
                bannerUpload.style.backgroundSize = "cover";
                bannerUpload.style.backgroundPosition = "center";
                bannerUpload.textContent = "";
            } else if (bannerUpload) {
                bannerUpload.style.backgroundImage = initialWriteState.banner;
                bannerUpload.textContent = initialWriteState.bannerText;
                if (!initialWriteState.banner) bannerUpload.style.backgroundColor = "#e5e7eb";
            }
            window.location.href = "write.html";
        });
    }

    // Xử lý nút Publish ở trang Preview
    if (publishBtnPreviewPage) {
        publishBtnPreviewPage.addEventListener("click", async function () {
            const title = localStorage.getItem("blogTitle");
            const content = localStorage.getItem("blogContent");
            const description = document.getElementById("blogDescription").value.trim();
            const userId = localStorage.getItem("userId");
            const currentTopic = topicInputPreview.value.trim();
            const topicId = await getTopicIdFromBackend(currentTopic ? [currentTopic] : []);

            if (!title || !content || !userId) {
                alert("Title, content and user ID cannot be empty.");
                return;
            }

            function dataURLtoFile(dataurl, filename) {
                let arr = dataurl.split(',');
                let mime = arr[0].match(/:(.*?);/)[1];
                let bstr = atob(arr[1]);
                let n = bstr.length;
                let u8arr = new Uint8Array(n);
                while(n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new File([u8arr], filename, {type:mime});
            }            

            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('des', description || '');
            formData.append('user_id', userId);
            formData.append('topic_id', topicId || null);

            // LẤY TỆP BANNER TRỰC TIẾP TỪ BIẾN selectedBannerFile
            const storedBase64 = localStorage.getItem("currentBannerPreview");
            if (storedBase64 && storedBase64.startsWith("data:image")) {
                const fileFromBase64 = dataURLtoFile(storedBase64, "banner.jpg");
                formData.append('banner', fileFromBase64);
            }

            try {
                const response = await fetch("http://localhost:3000/api/posts", {
                    method: "POST",
                    body: formData,
                });

                const result = await response.json();

                if (response.ok) {
                    alert("Published!");
                    window.location.href = "write.html";
                    localStorage.removeItem("blogTitle");
                    localStorage.removeItem("blogContent");
                    localStorage.removeItem("currentBannerPreview");
                    selectedBannerFile = null; // Reset biến sau khi publish
                } else {
                    alert(`Publishing failure: ${result.message || response.statusText}`);
                }

            } catch (error) {
                console.error("Error sending post data:", error);
                alert("An error occurred while publishing the post. Please try again later.");
            }
        });
    }

    async function getTopicIdFromBackend(topics) {
        if (topics && topics.length > 0) {
            const firstTopic = topics[0];
            try {
                const response = await fetch("http://localhost:3000/api/categories/get-id", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ topic: firstTopic }),
                });
                const result = await response.json();
                if (response.ok) {
                    return result.id || null;
                } else if (response.status === 404) {
                    console.log(`Không tìm thấy topic: ${firstTopic}`);
                    return null;
                } else {
                    console.error("Lỗi khi lấy topic ID từ backend:", result);
                    return null;
                }
            } catch (error) {
                console.error("Lỗi khi gửi yêu cầu lấy topic ID:", error);
                return null;
            }
        } else {
            return null;
        }
    }

    // Khôi phục trạng thái trang Write khi tải lại (ví dụ sau khi đóng Preview)
    const storedTitleOnLoad = localStorage.getItem("blogTitle");
    const storedContentOnLoad = localStorage.getItem("blogContent");
    const storedBannerOnLoad = localStorage.getItem("currentBannerPreview");

    if (blogTitleInput && storedTitleOnLoad) {
        blogTitleInput.value = storedTitleOnLoad;
    }
    if (blogContentInput && storedContentOnLoad) {
        blogContentInput.value = storedContentOnLoad;
    }
    if (bannerUpload && storedBannerOnLoad && storedBannerOnLoad !== "../assets/images/default.jpg") {
        bannerUpload.style.backgroundImage = `url(${storedBannerOnLoad})`;
        bannerUpload.style.backgroundSize = "cover";
        bannerUpload.style.backgroundPosition = "center";
        bannerUpload.textContent = "";
    } else if (bannerUpload && !storedBannerOnLoad) {
        bannerUpload.style.backgroundImage = initialWriteState.banner;
        bannerUpload.textContent = initialWriteState.bannerText;
        if (!initialWriteState.banner) {
            bannerUpload.style.backgroundColor = "#e5e7eb"; // Màu nền gray-200
        }
    }
});