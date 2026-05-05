CREATE DATABASE IF NOT EXISTS sample_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sample_app;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user','admin','ca_officer') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS customer_codes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_code VARCHAR(80) NOT NULL UNIQUE,
  status ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  customer_code VARCHAR(80) NOT NULL,
  dropbox_path VARCHAR(512) NOT NULL,
  sent_to_ca TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO users (name, email, password, role) VALUES
('Demo User', 'user@example.com', '$2b$10$PjsLS9IcheSynpm9rdM7POwadhwN5MG8mrkfqDhhHjyys.WU4zRk.', 'user'),
('CA Officer', 'ca@example.com', '$2b$10$PjsLS9IcheSynpm9rdM7POwadhwN5MG8mrkfqDhhHjyys.WU4zRk.', 'admin');

INSERT INTO customer_codes (customer_code, status) VALUES
('CUST1001', 'active'),
('CUST1002', 'active'),
('CUST2001', 'inactive');
