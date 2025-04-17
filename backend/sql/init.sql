-- 创建数据库
CREATE DATABASE IF NOT EXISTS yjyw DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE yjyw;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 景点表
CREATE TABLE IF NOT EXISTS scenic_spots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    image_url VARCHAR(255),
    rating DECIMAL(2,1),
    visit_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 活动表
CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    location VARCHAR(255),
    status ENUM('upcoming', 'ongoing', 'ended') DEFAULT 'upcoming',
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 文章表
CREATE TABLE IF NOT EXISTS articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    author_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入测试数据
INSERT INTO users (username, password, email) VALUES 
('admin', '$2a$10$kIqR1E/EK1UbC1xRcqxRZeYm8qA8wHITF8u1YwFHyDzr0t0kqvzXG', 'admin@example.com');

-- 插入景点数据
INSERT INTO scenic_spots (name, description, location, image_url, rating, visit_count, created_at, updated_at) VALUES 
('海陵岛', '海陵岛是中国最美丽的海岛之一，拥有洁白的沙滩和清澈的海水。', '广东省阳江市海陵区', '/images/scenic/hailing.jpg', 4.8, 15000, NOW(), NOW()),
('闸坡渔港', '闸坡渔港是阳江最大的渔港，每天都有新鲜的海鲜上岸。', '广东省阳江市海陵区闸坡镇', '/images/scenic/shapa.jpg', 4.5, 8000, NOW(), NOW()),
('灵霄寺', '灵霄寺始建于唐代，是阳江历史最悠久的寺庙之一。', '广东省阳江市江城区', '/images/scenic/lingxiao.jpg', 4.3, 5000, NOW(), NOW()),
('阳江博物馆', '阳江博物馆收藏了大量阳江历史文物和刀剪工艺品。', '广东省阳江市江城区', '/images/scenic/museum.jpg', 4.2, 3000, NOW(), NOW());

-- 插入活动数据
INSERT INTO activities (title, description, start_date, end_date, location, status, image_url, created_at, updated_at) VALUES 
('海上垂钓体验', '体验阳江特色海钓活动，专业渔民带队。', '2024-03-15', '2024-03-20', '闸坡渔港', 'upcoming', '/images/scenic/fishing.jpg', NOW(), NOW()),
('美食文化节', '品尝阳江特色小吃，体验本地美食文化。', '2024-04-01', '2024-04-07', '阳江市中心', 'upcoming', '/images/scenic/food.jpg', NOW(), NOW());

INSERT INTO articles (title, content, author_id) VALUES 
('欢迎使用', '这是第一篇文章', 1); 