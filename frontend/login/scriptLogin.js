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

  // Xử lý submit login
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username")?.value.trim();
    const password = document.getElementById("password")?.value.trim();

    if (!username || !password) {
      alert("Hãy nhập Username hoặc Password!");
      return;
    }

    try {
      const apiBase = "http://localhost:3000";
      const response = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Đăng nhập thành công!");
        localStorage.setItem("userId", result.userId);
        window.location.href = "../home/index.html";
      } else {
        alert(result.error || "Sai tài khoản hoặc mật khẩu");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể kết nối đến server.");
    }
  });
});
