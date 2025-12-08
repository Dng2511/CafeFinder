DROP DATABASE IF EXISTS CafeFinder;
CREATE DATABASE CafeFinder;

CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'admin'))
);

CREATE TABLE cafes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone_number VARCHAR(20),
    category VARCHAR(50),

    open_time TIME,
    close_time TIME,

    main_image TEXT,
    rating INT NOT NULL DEFAULT 0,
    rating_count INT NOT NULL DEFAULT 0,
    has_wifi BOOLEAN DEFAULT FALSE,
    has_parking BOOLEAN DEFAULT FALSE,
    has_air_conditioning BOOLEAN DEFAULT FALSE,
    has_power_outlet BOOLEAN DEFAULT FALSE,
    is_quiet BOOLEAN DEFAULT FALSE,
    no_smoking BOOLEAN DEFAULT FALSE,
    lat FLOAT,
    lon FLOAT
);

CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    cafe_id INT NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    rating INT NOT NULL DEFAULT 0,
    rating_count INT NOT NULL DEFAULT 0,
    image TEXT
);

CREATE TABLE cafe_images (
    id SERIAL PRIMARY KEY,
    cafe_id INT NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);

CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    cafe_id INT NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, cafe_id)
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    cafe_id INT NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO users (username, email, password_hash, role) VALUES
('customer01', 'customer01@example.com', 'hash_customer01', 'customer'),
('customer02', 'customer02@example.com', 'hash_customer02', 'customer'),
('customer03', 'customer03@example.com', 'hash_customer03', 'customer'),

('admin01', 'admin01@example.com', 'hash_admin01', 'admin'),
('admin02', 'admin02@example.com', 'hash_admin02', 'admin');

INSERT INTO cafes (
    name, address, phone_number,
    open_time, close_time,
    main_image,
    has_wifi, has_parking, has_air_conditioning, lat, lon
) VALUES
('Coffee Haven', '123 Sunset Street, District 1', '0901234567', '07:00', '22:00',
 'cafe1_main.jpg', TRUE, TRUE, FALSE, 21.013570, 105.856342),

('Moonlight Cafe', '45 River Road, District 3', '0912345678', '08:00', '21:00',
 'cafe2_main.jpg', TRUE, FALSE, FALSE, 21.011407, 105.855590),

('Urban Brews', '99 Central Avenue, District 5', '0939876543', '06:30', '23:00',
 'cafe3_main.jpg', FALSE, TRUE, FALSE, 21.004567, 105.847123);

INSERT INTO menu_items (cafe_id, item_name, price, image) VALUES
(1, 'Espresso', 35000, 'espresso.jpg'),
(1, 'Latte', 45000, 'latte.jpg'),
(1, 'Cappuccino', 42000, 'cappuccino.jpg'),

(2, 'Black Coffee', 30000, 'blackcoffee.jpg'),
(2, 'Matcha Latte', 50000, 'matchalatte.jpg'),

(3, 'Cold Brew', 55000, 'coldbrew.jpg'),
(3, 'Mocha', 48000, 'mocha.jpg');

INSERT INTO cafe_images (cafe_id, image_url) VALUES
(1, 'cafe1_1.jpg'),
(1, 'cafe1_2.jpg'),

(2, 'cafe2_1.jpg'),
(2, 'cafe2_2.jpg'),

(3, 'cafe3_1.jpg'),
(3, 'cafe3_2.jpg');