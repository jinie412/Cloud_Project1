document.addEventListener("DOMContentLoaded", async function () {
  const userId = localStorage.getItem("userId");
  const avatarImg = document.getElementById("avatarImg");
  const authButtons = document.getElementById("authButtons");

  // Hiển thị avatar nếu có user đăng nhập
  if (userId) {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`);
      const result = await response.json();

      if (response.ok) {
        authButtons.classList.add("hidden");
        if (result.avatar_url && result.avatar_url.startsWith("http")) {
          avatarImg.src = result.avatar_url; // Nếu là URL đầy đủ, sử dụng trực tiếp
        } else if (result.avatar_url && result.avatar_url.startsWith("/")) {
          avatarImg.src = `http://localhost:3000${result.avatar_url}`; // Nếu là đường dẫn tương đối, thêm tiền tố backend
        } else {
          avatarImg.src = "../img/logo.png"; // Sử dụng ảnh mặc định nếu không có URL hoặc định dạng không xác định
        }
        avatarImg.classList.remove("hidden");
      } else {
        localStorage.removeItem("userId");
      }
    } catch (error) {
      console.error("Lỗi lấy avatar:", error);
    }
  }

  if (avatarImg) {
    // Dropdown avatar
    avatarImg.addEventListener("click", function () {
      const dropdown = document.getElementById("avatarDropdown");
      dropdown.classList.toggle("hidden");
    });

    // Ẩn dropdown
    window.addEventListener("click", function (e) {
      const dropdown = document.getElementById("avatarDropdown");
      if (!avatarImg.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add("hidden");
      }
    });

    // Lấy các phần tử trong dropdown
    const dashboardDiv = avatarDropdown.children[0];
    const settingsDiv = avatarDropdown.children[1];
    const signOutDiv = avatarDropdown.children[2];

    // Dashboard
    dashboardDiv.addEventListener("click", () => {
      window.location.href = "../dashboard/dashboard.html";
    });

    // Settings
    settingsDiv.addEventListener("click", () => {
      window.location.href = "../settings/setting_edit-profile.html";
    });

    // Sign out
    signOutDiv.addEventListener("click", () => {
      localStorage.removeItem("userId");
      alert("Đã đăng xuất!");
      window.location.href = "../login/login.html";
    });
  } else {
    console.error("Không tìm thấy phần tử avatarImg!");
  }

  // Xác định URL phù hợp để load dữ liệu ban đầu
  const postUrl = "http://localhost:3000/api/posts";
  const topicUrl = "http://localhost:3000/api/topics";

  // Load dữ liệu ban đầu
  loadPosts(postUrl);
  loadTopics(topicUrl, postUrl);
});

// scriptDashboard.js

document.addEventListener("DOMContentLoaded", () => {
  const blogListContainer = document.querySelector(".blog-list");
  const userId = localStorage.getItem("userId");

  if (!userId) {
    console.error("Không tìm thấy ID người dùng.");
    return;
  }

  async function fetchUserPosts() {
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${userId}/posts`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const posts = await response.json();
      displayUserPosts(posts);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bài viết:", error);
      blogListContainer.innerHTML = "<p>Không thể tải danh sách bài viết.</p>";
    }
  }

  function displayUserPosts(posts) {
    blogListContainer.innerHTML = "";

    if (posts.length === 0) {
      blogListContainer.innerHTML = "<p>Bạn chưa có bài viết nào.</p>";
      return;
    }

    posts.forEach((post) => {
      const blogCardLink = document.createElement("a");
      blogCardLink.href = `../blog/blog.html?id=${post.id}`; // Tạo link đến trang blog.html và truyền postId
      blogCardLink.classList.add("blog-card-link"); // Thêm class để có thể style nếu cần
      blogCardLink.style.textDecoration = "none"; // Loại bỏ gạch chân mặc định của link

      const blogCard = document.createElement("div");
      blogCard.classList.add("blog-card");

      const image = document.createElement("img");
      image.src = post.image_url || "https://via.placeholder.com/80";
      image.classList.add("blog-img");

      const infoDiv = document.createElement("div");
      infoDiv.classList.add("blog-info");

      const titleHeading = document.createElement("h3");
      titleHeading.textContent = post.title;

      const dateParagraph = document.createElement("p");
      const publishedDate = new Date(post.created_at).toLocaleDateString(
        "vi-VN",
        { year: "numeric", month: "long", day: "numeric" }
      );
      dateParagraph.textContent = `Published on ${publishedDate}`;

      const actionsDiv = document.createElement("div");
      actionsDiv.classList.add("blog-actions");

      const editLink = document.createElement("a");
      editLink.href = "#"; // Thêm link sửa sau
      editLink.classList.add("edit");
      editLink.textContent = "Edit";

      const deleteLink = document.createElement("a");
      deleteLink.href = "#"; // Thêm chức năng xóa sau
      deleteLink.classList.add("delete");
      deleteLink.textContent = "Delete";

      // Phần xóa chức năng
      deleteLink.addEventListener("click", async (e) => {
        e.preventDefault();
        const confirmDelete = confirm("Bạn có chắc muốn xóa bài viết này?");
        if (!confirmDelete) return;

        try {
          const response = await fetch(
            `http://localhost:3000/api/posts/${post.id}`,
            {
              method: "DELETE",
            }
          );
          const result = await response.json();

          if (response.ok) {
            alert("Đã xóa bài viết!");
            fetchUserPosts(); // Load lại danh sách
          } else {
            alert(result.message || "Xóa không thành công.");
          }
        } catch (err) {
          console.error("Lỗi khi xóa bài viết:", err);
          alert("Lỗi kết nối khi xóa bài viết.");
        }
      });
      //

      actionsDiv.appendChild(editLink);
      actionsDiv.appendChild(deleteLink);

      infoDiv.appendChild(titleHeading);
      infoDiv.appendChild(dateParagraph);
      infoDiv.appendChild(actionsDiv);

      blogCard.appendChild(image);
      blogCard.appendChild(infoDiv);

      blogCardLink.appendChild(blogCard); // Đặt blogCard vào bên trong link
      blogListContainer.appendChild(blogCardLink);
    });
  }

  fetchUserPosts();
});
