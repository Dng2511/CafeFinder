CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE TABLE cafes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone_number VARCHAR(20),

    open_time TIME,
    close_time TIME,

    main_image TEXT,
    rating INT NOT NULL DEFAULT 0,
    rating_count INT NOT NULL DEFAULT 0,
    has_wifi BOOLEAN DEFAULT FALSE,
    has_parking BOOLEAN DEFAULT FALSE,
    has_air_conditioning BOOLEAN DEFAULT FALSE
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

INSERT INTO cafes (
    name, address, phone_number,
    open_time, close_time,
    main_image,
    has_wifi, has_parking, has_air_conditioning
) VALUES
('Coffee Haven', '123 Sunset Street, District 1', '0901234567', '07:00', '22:00',
 'https://example.com/images/cafe1_main.jpg', TRUE, TRUE, TRUE),

('Moonlight Cafe', '45 River Road, District 3', '0912345678', '08:00', '21:00',
 'https://example.com/images/cafe2_main.jpg', TRUE, FALSE, TRUE),

('Urban Brews', '99 Central Avenue, District 5', '0939876543', '06:30', '23:00',
 'https://example.com/images/cafe3_main.jpg', FALSE, TRUE, FALSE);

INSERT INTO menu_items (cafe_id, item_name, price, image) VALUES
(1, 'Espresso', 35000, 'https://example.com/menu/espresso.jpg'),
(1, 'Latte', 45000, 'https://example.com/menu/latte.jpg'),
(1, 'Cappuccino', 42000, 'https://example.com/menu/cappuccino.jpg'),

(2, 'Black Coffee', 30000, 'https://example.com/menu/blackcoffee.jpg'),
(2, 'Matcha Latte', 50000, 'https://example.com/menu/matchalatte.jpg'),

(3, 'Cold Brew', 55000, 'https://example.com/menu/coldbrew.jpg'),
(3, 'Mocha', 48000, 'https://example.com/menu/mocha.jpg');

INSERT INTO cafe_images (cafe_id, image_url) VALUES
(1, 'https://example.com/images/cafe1_1.jpg'),
(1, 'https://example.com/images/cafe1_2.jpg'),

(2, 'https://example.com/images/cafe2_1.jpg'),
(2, 'https://example.com/images/cafe2_2.jpg'),

(3, 'https://example.com/images/cafe3_1.jpg'),
(3, 'https://example.com/images/cafe3_2.jpg');
