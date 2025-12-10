DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

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
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cafe_id INT NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, cafe_id)
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    guest_name VARCHAR(50),
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
(1, 'Espresso', 35000, 'https://i.pinimg.com/736x/4c/28/e2/4c28e2420bf38c50120dba0cbaf42e8d.jpg'),
(1, 'Latte', 45000, 'https://i.pinimg.com/1200x/f8/56/d2/f856d2d30045e34f7a3d7438d81c5141.jpg'),
(1, 'Cappuccino', 42000, 'https://i.pinimg.com/736x/50/f1/7c/50f17c380525acf16c5ad8df185b1554.jpg'),

(2, 'Black Coffee', 30000, 'https://i.pinimg.com/736x/4c/28/e2/4c28e2420bf38c50120dba0cbaf42e8d.jpg'),
(2, 'Matcha Latte', 50000, 'https://i.pinimg.com/736x/dc/c9/ce/dcc9cece545e7f612d6ad61fd4f3f552.jpg'),

(3, 'Cold Brew', 55000, 'https://i.pinimg.com/1200x/a0/8b/61/a08b618b6bbe45c5f3ae62ffdaff1d7d.jpg'),
(3, 'Mocha', 48000, 'https://i.pinimg.com/1200x/b1/8d/50/b18d50fa62686644792732a3f609275f.jpg');

INSERT INTO cafe_images (cafe_id, image_url) VALUES
(1, 'https://i.pinimg.com/1200x/b1/8d/50/b18d50fa62686644792732a3f609275f.jpg'),
(1, 'https://i.pinimg.com/1200x/03/59/aa/0359aa1f9990e45c11ae02872a792d38.jpg'),

(2, 'https://i.pinimg.com/736x/14/e8/88/14e888f9e74d4ee6b048235cf875122d.jpg'),
(2, 'https://i.pinimg.com/1200x/eb/ef/1e/ebef1ed385c2fe375e9fae8778bf653f.jpg'),

(3, 'https://i.pinimg.com/1200x/e5/b3/aa/e5b3aa7807de6cdcc30011ae4f1f6de9.jpg'),
(3, 'https://i.pinimg.com/736x/fc/2d/57/fc2d57aadacdc92eb14e4869fc516109.jpg');

INSERT INTO reviews (user_id, cafe_id, rating, comment) VALUES
(1, 1, 5, 'Không gian tuyệt vời, nhân viên thân thiện!'),
(2, 1, 4, 'Cà phê ngon nhưng hơi đông khách vào buổi sáng.'),
(3, 1, 5, 'Quán sạch sẽ, wifi mạnh, rất thích!'),
(1, 2, 4, 'Không gian đẹp, chụp ảnh sống ảo rất thích.'),
(3, 2, 5, 'Matcha latte ngon xuất sắc!'),
(2, 3, 5, 'Cold brew ở đây rất đậm vị, đúng gu mình.'),
(3, 3, 4, 'Quán yên tĩnh, phù hợp để học bài.'),
(1, 3, 5, 'Mocha ngon, nhân viên phục vụ tốt.');