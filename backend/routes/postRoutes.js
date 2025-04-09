const express = require("express");
const router = express.Router();
const pool = require("../db");

// ===================== TẠO BÀI VIẾT MỚI =====================

router.post("/", async (req, res) => {
  const { title, content, image_url, des, user_id, topic_id } = req.body;

  if (!title || !content || !user_id) {
      return res.status(400).json({ message: "Tiêu đề, nội dung và ID người dùng là bắt buộc." });
  }

  try {
      const [result] = await pool.execute(
          "INSERT INTO blog_web.posts (title, content, image_url, des, user_id, topic_id, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
          [title, content, image_url, des, user_id, topic_id]
      );

      if (result.insertId) {
          return res.status(201).json({ message: "Bài viết đã được tạo thành công!", postId: result.insertId });
      } else {
          return res.status(500).json({ message: "Lỗi khi tạo bài viết." });
      }
  } catch (error) {
      console.error("Lỗi tạo bài viết:", error);
      return res.status(500).json({ message: "Lỗi server khi tạo bài viết." });
  }
});

// ===================== LẤY BÀI VIẾT CỦA MỘT USER =====================

router.get("/users/:userId/posts", async (req, res) => {
  const { userId } = req.params;
  try {
      const [posts] = await pool.query(
          `
          SELECT posts.id, posts.title, posts.des, posts.image_url, categories.topic,
                 posts.created_at, posts.updated_at
          FROM posts
          LEFT JOIN categories ON posts.topic_id = categories.id
          WHERE posts.user_id = ?
          ORDER BY posts.created_at DESC
          `,
          [userId]
      );
      res.json(posts);
  } catch (err) {
      console.error("Lỗi lấy bài viết của user:", err);
      res.status(500).json({ error: "Lỗi server" });
  }
});

// ===================== LẤY TẤT CẢ BÀI VIẾT =====================

router.get("/posts", async (req, res) => {
  try {
    const [posts] = await pool.query(`
      SELECT posts.id, posts.title, posts.des, posts.image_url, categories.topic,
             users.username, users.avatar_url
      FROM posts
      LEFT JOIN categories ON posts.topic_id = categories.id
      LEFT JOIN users ON posts.user_id = users.id
      ORDER BY posts.created_at DESC
    `);

    res.json(posts);
  } catch (err) {
    console.error("Lỗi lấy danh sách bài viết:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

router.get("/posts/topic/:topicId", async (req, res) => {
  const { topicId } = req.params;
  try {
    const [posts] = await pool.query(
      `
        SELECT posts.id, posts.title, posts.des, posts.image_url, categories.topic,
               users.username, users.avatar_url
        FROM posts
        LEFT JOIN categories ON posts.topic_id = categories.id
        LEFT JOIN users ON posts.user_id = users.id
        WHERE topic_id = ?
        ORDER BY posts.created_at DESC
      `,
      [topicId]
    );

    res.json(posts);
  } catch (err) {
    console.error("Lỗi lấy bài theo topic:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// ======================= LẤY CÁC TOPICS ==========================

router.get("/topics", async (req, res) => {
  try {
    const [topics] = await pool.query(
      "SELECT * FROM categories ORDER BY topic ASC"
    );
    res.json(topics);
  } catch (err) {
    console.error("Lỗi lấy topics:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// ======================= CHI TIẾT 1 BÀI VIẾT =======================

router.get("/posts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT posts.*, users.username, users.avatar_url
       FROM posts
       JOIN users ON posts.user_id = users.id
       WHERE posts.id = ?`,
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Không tìm thấy bài viết" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

module.exports = router;
