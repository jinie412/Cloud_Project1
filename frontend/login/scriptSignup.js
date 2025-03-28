document.addEventListener("DOMContentLoaded", function () {
  // Toggle mật khẩu
  const togglePassword = document.getElementById("togglePassword");
  const inputPass = document.getElementById("password");

  if (togglePassword && inputPass) {
    togglePassword.addEventListener("click", function () {
      togglePassword.classList.toggle("fa-eye-slash");
      inputPass.type = inputPass.type === "password" ? "text" : "password";
    });
  }

  const form = document.getElementById("signupForm");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ Username và Password");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.");
        window.location.href = "./login.html";
      } else {
        // Hiển thị thông báo tùy vào loại lỗi trả về từ server
        if (result.error && result.error.includes("tồn tại")) {
          alert("Tên đăng nhập đã được sử dụng. Vui lòng chọn tên khác.");
        } else {
          alert("Đăng ký thất bại. Vui lòng thử lại sau!");
        }
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể kết nối đến server.");
    }
  });
});
