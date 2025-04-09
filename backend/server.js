const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();

// const corsOptions = {
//   origin: 'http://127.0.0.1:5500', // Chỉ cho phép origin này
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Các phương thức được phép
//   credentials: true, // Cho phép cookies và headers xác thực
//   optionsSuccessStatus: 204, // Trả về 204 No Content cho preflight request thành công
// };

// app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());

// phục vụ frontend (nếu cần)
app.use(express.static(path.join(__dirname, "../frontend")));

// Phục vụ thư mục 'uploads' tại đường dẫn '/uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const categoryRoutes = require("./routes/categoriesRoutes");

// routes API
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api", postRoutes);
app.use("/api", userRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
