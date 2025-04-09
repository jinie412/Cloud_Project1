document.addEventListener("DOMContentLoaded", () => {
    const bannerUpload = document.getElementById("bannerUpload");
    const bannerInput = document.getElementById("bannerInput");
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

    // Lưu trạng thái ban đầu của trang Write khi tải
    const initialWriteState = {
        title: blogTitleInput ? blogTitleInput.value : "",
        content: blogContentInput ? blogContentInput.value : "",
        banner: bannerUpload ? bannerUpload.style.backgroundImage : "",
        bannerText: bannerUpload ? bannerUpload.textContent : ""
    };

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
                    localStorage.setItem("blogImage", e.target.result);
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

            localStorage.setItem("blogTitle", title || "Untitled Blog");
            localStorage.setItem("blogContent", content);

            const storedImage = localStorage.getItem("blogImage");
            localStorage.setItem("currentBanner", storedImage || "../assets/images/default.jpg");

            window.location.href = "preview.html";
        });
    }

    // Xử lý dữ liệu trên Preview Page
    if (previewTitleDisplay && previewImage) {
        previewTitleDisplay.innerText = localStorage.getItem("blogTitle") || "Untitled Blog";
        previewImage.src = localStorage.getItem("currentBanner") || "../assets/images/default.jpg";
    }

    // Theo dõi số lượng ký tự trong Description
    if (descriptionInput && descriptionCountDisplay) {
        descriptionInput.addEventListener("input", function () {
            const text = this.value;
            const charCount = text.length;
            descriptionCountDisplay.innerText = `${charCount}/200 characters`;
        });
    }

    // Xử lý nút đóng Preview Page
    if (closePreviewBtn) {
        closePreviewBtn.addEventListener("click", function () {
            // Lấy dữ liệu đã lưu từ localStorage
            const storedTitle = localStorage.getItem("blogTitle");
            const storedContent = localStorage.getItem("blogContent");
            const storedBanner = localStorage.getItem("currentBanner");

            // Khôi phục dữ liệu vào các trường trên trang Write
            if (blogTitleInput) {
                blogTitleInput.value = storedTitle || initialWriteState.title;
            }
            if (blogContentInput) {
                blogContentInput.value = storedContent || initialWriteState.content;
            }
            if (bannerUpload && storedBanner && storedBanner !== "../assets/images/default.jpg") {
                bannerUpload.style.backgroundImage = `url(${storedBanner})`;
                bannerUpload.style.backgroundSize = "cover";
                bannerUpload.style.backgroundPosition = "center";
                bannerUpload.textContent = "";
            } else if (bannerUpload) {
                bannerUpload.style.backgroundImage = initialWriteState.banner;
                bannerUpload.textContent = initialWriteState.bannerText;
                if (!initialWriteState.banner) {
                    bannerUpload.style.backgroundColor = "#e5e7eb"; // Màu nền gray-200
                }
            }

            // Chuyển hướng về trang Write
            window.location.href = "write.html";
        });
    }

    // Xử lý nút Publish ở trang Preview
    if (publishBtnPreviewPage) {
        publishBtnPreviewPage.addEventListener("click", async function () {
            const title = localStorage.getItem("blogTitle");
            const content = localStorage.getItem("blogContent");
            const imageUrl = localStorage.getItem("currentBanner");
            const description = document.getElementById("blogDescription").value.trim();
            const userId = localStorage.getItem("userId");
            const currentTopic = topicInputPreview.value.trim();
            const topicId = await getTopicIdFromBackend(currentTopic ? [currentTopic] : []);

            if (!title || !content || !userId) {
                alert("Title, content and user ID cannot be empty.");
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/api/posts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        // Bạn có thể cần thêm Authorization header nếu API yêu cầu
                    },
                    body: JSON.stringify({
                        title: title,
                        content: content,
                        image_url: imageUrl === "../assets/images/default.jpg" ? null : imageUrl,
                        des: description || null,
                        user_id: parseInt(userId),
                        topic_id: topicId,
                    }),
                });

                const result = await response.json();

                if (response.ok) {
                    alert("Published!");
                    // Chuyển hướng người dùng về trang Write và đặt lại trạng thái
                    window.location.href = "write.html";
                    localStorage.removeItem("blogTitle");
                    localStorage.removeItem("blogContent");
                    localStorage.removeItem("currentBanner");
                    localStorage.removeItem("blogTopics");
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
    const storedBannerOnLoad = localStorage.getItem("currentBanner");

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