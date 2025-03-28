document.addEventListener("DOMContentLoaded", async function () {
  const userId = localStorage.getItem("userId");
  const avatarImg = document.getElementById("avatarImg");
  const authButtons = document.getElementById("authButtons");
  const postContainer = document.getElementById("postContainer");
  const topicList = document.getElementById("topicList");

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

  // Hàm load bài viết (tất cả hoặc của 1 user)
  async function loadPosts(url) {
    try {
      const res = await fetch(url);
      const posts = await res.json();

      postContainer.innerHTML = "";
      posts.forEach((post) => {
        const postHTML = `
            <div class="w-full flex gap-8 items-start border-b border-gray-300">
              <div class="w-full bg-white p-6 rounded-lg flex items-start gap-4">
                <div class="flex-grow">
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
          `;
        postContainer.innerHTML += postHTML;
      });
    } catch (err) {
      console.error(" Lỗi khi load bài viết:", err);
    }
  }

  // Hàm load topics
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
      allBtn.onclick = () => loadPosts(postUrlAll);
      topicList.appendChild(allBtn);

      topics.forEach((topic) => {
        const btn = document.createElement("button");
        btn.innerText = topic.topic;
        btn.className =
          "bg-gray-200 px-3 py-1 rounded-full text-sm hover:bg-gray-400";
        btn.onclick = () =>
          loadPosts(`http://localhost:3000/api/posts/topic/${topic.id}`);
        topicList.appendChild(btn);
      });
    } catch (err) {
      console.error("Lỗi khi load topics:", err);
    }
  }

  // Load bài của user khi đăng nhập
  if (userId) {
    loadPosts(`http://localhost:3000/api/posts/user/${userId}`);
    loadTopics(
      `http://localhost:3000/api/topics/user/${userId}`,
      `http://localhost:3000/api/posts/user/${userId}`
    );
  } else {
    loadPosts(`http://localhost:3000/api/posts`);
    loadTopics(
      `http://localhost:3000/api/topics`,
      `http://localhost:3000/api/posts`
    );
  }
  // Hiện dropdown
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
    window.location.href = "../login/login.html";
  });
});
