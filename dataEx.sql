CREATE DATABASE blog_web;


CREATE TABLE blog_web.users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username  VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255)
);

CREATE TABLE blog_web.categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    topic VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE blog_web.posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    des TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id INT,
    topic_id INT,
    FOREIGN KEY (user_id) REFERENCES blog_web.users(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES blog_web.categories(id) ON DELETE CASCADE
);


// Thêm dữ liệu
-- Thêm dữ liệu vào bảng users
INSERT INTO blog_web.users (username, password_hash, avatar_url, email, bio) VALUES
('john_doe', '123', 'https://photo.znews.vn/w860/Uploaded/mdf_eioxrd/2021_07_06/2.jpg', 'john.doe@example.com', 'A passionate blogger and tech enthusiast.'),
('alice_smith', '123', 'https://photo.znews.vn/w860/Uploaded/mdf_eioxrd/2021_07_06/2.jpg', 'alice.smith@example.com', 'Loves writing about travel and lifestyle.'),
('bob_miller', '123', 'https://photo.znews.vn/w860/Uploaded/mdf_eioxrd/2021_07_06/2.jpg', 'bob.miller@example.com', 'Software engineer by day, blogger by night.');


-- Thêm dữ liệu vào bảng categories
INSERT INTO blog_web.categories (topic) VALUES
('Technology'),
('Lifestyle'),
('Travel');

-- Thêm dữ liệu vào bảng posts
INSERT INTO blog_web.posts (title, content, image_url, des, user_id, topic_id) VALUES
('Exploring AI', 'This is an article about AI advancements.', 'https://photo.znews.vn/w860/Uploaded/mdf_eioxrd/2021_07_06/2.jpg', 'AI and its future', 1, 1),
('Healthy Living Tips', 'How to maintain a healthy lifestyle.', 'https://photo.znews.vn/w860/Uploaded/mdf_eioxrd/2021_07_06/2.jpg', 'Tips for better health', 2, 2),
('Best Places to Visit in 2025', 'A travel guide for 2025.', 'https://photo.znews.vn/w860/Uploaded/mdf_eioxrd/2021_07_06/2.jpg', 'Top travel destinations', 3, 3);










