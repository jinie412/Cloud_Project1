document.addEventListener("DOMContentLoaded", async function () {
  const userId = localStorage.getItem("userId");
  const avatarImg = document.getElementById("avatarImg");
  const authButtons = document.getElementById("authButtons");
  const postContainer = document.getElementById("postContainer");
  const topicList = document.getElementById("topicList");
  const searchInput = document.getElementById("searchInput");

  let allPosts = [];

  // Hiển thị avatar nếu có user đăng nhập
  if (userId) {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`);
      const result = await response.json();

      if (response.ok) {
        authButtons.classList.add("hidden");
        avatarImg.src = result.avatar_url || "../img/logo.png";
        avatarImg.classList.remove("hidden");
      } else {
        localStorage.removeItem("userId");
      }
    } catch (error) {
      console.error("Lỗi lấy avatar:", error);
    }
  }

  // Hàm hiển thị danh sách bài viết
  function renderPosts(posts) {
    postContainer.innerHTML = "";
    posts.forEach((post) => {
      const createdDate = new Date(post.created_at).toLocaleDateString();
      const updatedDate = new Date(post.updated_at).toLocaleDateString();
      const isUpdated = createdDate !== updatedDate;

      const postHTML = `
        <a href="../blog/index.html?id=${
          post.id
        }" class="block hover:opacity-80 transition">
          <div class="w-full flex gap-8 items-start border-b border-gray-300">
            <div class="w-full bg-white p-6 rounded-lg flex items-start gap-4">
              <div class="flex-grow">
                <div class="flex items-center gap-3 mb-2">
                  <img src="${post.avatar_url || "../img/default-avatar.png"}" 
                       class="w-5 h-5 rounded-full object-cover border" />
                  <span class="text-sm text-gray-600">@${
                    post.username || "Ẩn danh"
                  }</span>
                  <p class="text-sm text-gray-600">
                   ${createdDate}
                  ${isUpdated ? `<br>Cập nhật: ${updatedDate}` : ""}
                </p>
                </div>
                <h1 class="text-2xl font-semibold">${post.title}</h1>
                <p class="my-3 text-xl text-gray-600">${post.des}</p>
                <span class="bg-gray-200 px-3 py-1 rounded-full text-sm">
                  ${post.topic || "Uncategorized"}
                </span>
                
              </div>
              <div class="w-1/3 md:w-1/4 h-auto rounded-lg object-cover">
                <img src="${post.image_url || "../img/logo.png"}" />
              </div>
            </div>
          </div>
        </a>
      `;
      postContainer.innerHTML += postHTML;
    });
  }

  // Hàm load bài viết từ API
  async function loadPosts(url) {
    try {
      const res = await fetch(url);
      const posts = await res.json();
      allPosts = posts;
      renderPosts(posts);
    } catch (err) {
      console.error("Lỗi khi load bài viết:", err);
    }
  }

  // Hàm load danh sách chủ đề
  async function loadTopics(url, postUrlAll) {
    try {
      const res = await fetch(url);
      const topics = await res.json();
      topicList.innerHTML = "";

      // Nút ALL
      const allBtn = document.createElement("button");
      allBtn.innerText = "All";
      allBtn.className =
        "bg-black text-white px-3 py-1 rounded-full text-sm hover:bg-opacity-80";
      allBtn.onclick = () => {
        loadPosts(postUrlAll);
        searchInput.value = "";
      };
      topicList.appendChild(allBtn);

      topics.forEach((topic) => {
        const btn = document.createElement("button");
        btn.innerText = topic.topic;
        btn.className =
          "bg-gray-200 px-3 py-1 rounded-full text-sm hover:bg-gray-400";
        btn.onclick = () => {
          const url = `http://localhost:3000/api/posts/topic/${topic.id}`;

          loadPosts(url);
          searchInput.value = "";
        };
        topicList.appendChild(btn);
      });
    } catch (err) {
      console.error("Lỗi khi load topics:", err);
    }
  }

  // Xác định URL phù hợp để load dữ liệu ban đầu
  const postUrl = "http://localhost:3000/api/posts";
  const topicUrl = "http://localhost:3000/api/topics";

  // Load dữ liệu ban đầu
  loadPosts(postUrl);
  loadTopics(topicUrl, postUrl);

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

  // Sign out
  const signOutDiv = document.querySelector("#avatarDropdown > div");
  signOutDiv.addEventListener("click", () => {
    localStorage.removeItem("userId");
    alert("Đã đăng xuất!");
    window.location.href = "../login/index.html";
  });

  // Tìm kiếm bài viết
  searchInput.addEventListener("input", function (e) {
    const keyword = e.target.value.trim().toLowerCase();
    const filteredPosts = allPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(keyword) ||
        post.des?.toLowerCase().includes(keyword) ||
        post.content?.toLowerCase().includes(keyword)
    );
    renderPosts(filteredPosts);
  });
});
