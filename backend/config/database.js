const mysql = require('mysql2/promise');
const dbConfig = require('./db.config.js');

// 创建连接池
const pool = mysql.createPool(dbConfig);

// 测试连接
async function testConnection() {
    try {
        // 创建没有指定数据库的连接
        const connection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password
        });
        
        console.log('成功连接到MySQL服务器');
        
        // 删除已存在的数据库
        await connection.query(`DROP DATABASE IF EXISTS ${dbConfig.database}`);
        console.log(`已删除旧数据库 ${dbConfig.database}`);
        
        // 创建新数据库
        await connection.query(`CREATE DATABASE ${dbConfig.database}`);
        console.log(`数据库 ${dbConfig.database} 已创建`);
        
        // 使用数据库
        await connection.query(`USE ${dbConfig.database}`);
        console.log(`已切换到数据库 ${dbConfig.database}`);
        
        // 创建用户表
        await connection.query(`
          CREATE TABLE users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(50) NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            avatar_url VARCHAR(255),
            role ENUM('user', 'admin') DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            last_login TIMESTAMP,
            status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
            INDEX idx_email (email),
            INDEX idx_username (username)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户信息表'
        `);
        console.log('用户表已创建');
        
        // 创建景点表
        await connection.query(`
          CREATE TABLE scenic_spots (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            location VARCHAR(255),
            price DECIMAL(10,2),
            opening_hours VARCHAR(100),
            image_url VARCHAR(255),
            rating DECIMAL(2,1),
            visit_count INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            status ENUM('active', 'inactive') DEFAULT 'active',
            INDEX idx_name (name)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='景点信息表'
        `);
        console.log('景点表已创建');
        
        // 创建活动表
        await connection.query(`
          CREATE TABLE activities (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            location VARCHAR(255),
            start_date DATE,
            end_date DATE,
            price DECIMAL(10,2),
            capacity INT,
            current_participants INT DEFAULT 0,
            image_url VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
            INDEX idx_name (name),
            INDEX idx_dates (start_date, end_date)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动信息表'
        `);
        console.log('活动表已创建');
        
        // 创建预订表
        await connection.query(`
          CREATE TABLE bookings (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            booking_type ENUM('scenic', 'activity', 'hotel') NOT NULL,
            reference_id INT NOT NULL COMMENT '关联的景点/活动/酒店ID',
            booking_date DATE NOT NULL,
            quantity INT NOT NULL DEFAULT 1,
            total_price DECIMAL(10,2) NOT NULL,
            status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            INDEX idx_user (user_id),
            INDEX idx_type_ref (booking_type, reference_id),
            INDEX idx_date (booking_date)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='预订信息表'
        `);
        console.log('预订表已创建');
        
        // 创建酒店表
        await connection.query(`
          CREATE TABLE hotels (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            location VARCHAR(255),
            price_per_night DECIMAL(10,2),
            room_types JSON,
            amenities JSON,
            image_url VARCHAR(255),
            rating DECIMAL(2,1),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            status ENUM('active', 'inactive') DEFAULT 'active',
            INDEX idx_name (name)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='酒店信息表'
        `);
        console.log('酒店表已创建');
        
        // 创建评论表
        await connection.query(`
          CREATE TABLE comments (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            content TEXT NOT NULL,
            rating INT CHECK (rating >= 1 AND rating <= 5),
            comment_type ENUM('scenic', 'activity', 'hotel') NOT NULL,
            reference_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            status ENUM('active', 'hidden', 'deleted') DEFAULT 'active',
            FOREIGN KEY (user_id) REFERENCES users(id),
            INDEX idx_user (user_id),
            INDEX idx_type_ref (comment_type, reference_id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论信息表'
        `);
        console.log('评论表已创建');
        
        // 创建收藏表
        await connection.query(`
          CREATE TABLE favorites (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            favorite_type ENUM('scenic', 'activity', 'hotel') NOT NULL,
            reference_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            UNIQUE KEY unique_favorite (user_id, favorite_type, reference_id),
            INDEX idx_user (user_id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收藏信息表'
        `);
        console.log('收藏表已创建');
        
        // 插入测试数据
        await connection.query(`
          INSERT INTO users (username, email, password_hash, role) 
          VALUES ('admin', 'admin@yangjiang.com', '$2a$10$NxPJ.ZKmEZH1/KyKBdRz6.GqzZqfN.KY3.eqQgkWwqwTGEYrHXpMK', 'admin')
        `);
        
        await connection.query(`
          INSERT INTO users (username, email, password_hash, role) 
          VALUES ('test_user', 'test@example.com', '$2a$10$NxPJ.ZKmEZH1/KyKBdRz6.GqzZqwTGEYrHXpMK', 'user')
        `);
        
        await connection.query(`
          INSERT INTO scenic_spots (name, description, price, opening_hours) 
          VALUES ('海陵岛', '美丽的海岛风光', 120.00, '08:00-18:00')
        `);
        
        await connection.query(`
          INSERT INTO scenic_spots (name, description, price, opening_hours) 
          VALUES ('温泉', '舒适的温泉体验', 180.00, '10:00-22:00')
        `);
        
        await connection.query(`
          INSERT INTO hotels (name, description, price_per_night, room_types) 
          VALUES ('海景酒店', '海陵岛海景房，步行可达海滩', 380.00, '{"standard": 380, "deluxe": 580}')
        `);
        
        await connection.query(`
          INSERT INTO hotels (name, description, price_per_night, room_types) 
          VALUES ('温泉度假酒店', '豪华温泉套房，包含温泉体验', 580.00, '{"standard": 580, "suite": 880}')
        `);
        
        console.log('测试数据已插入');
        
        await connection.end();
        console.log('数据库初始化完成');
        return true;
    } catch (error) {
        console.error('数据库初始化失败:', error);
        return false;
    }
}

module.exports = {
    pool,
    testConnection
}; 