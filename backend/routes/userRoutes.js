const express = require("express");
const router = express.Router();
const pool = require("../db");

// Route lấy avatar
router.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [users] = await pool.query(
      "SELECT avatar_url FROM users WHERE id = ?",
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "User không tồn tại" });
    }

    res.json(users[0]);
  } catch (error) {
    console.error("Lỗi lấy avatar:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
});

module.exports = router;
