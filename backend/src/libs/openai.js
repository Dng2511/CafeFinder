const model = require("../common/ai")

const cleanSQL = (rawSQL) => {
  return rawSQL.replace(/```(sql)?/g, "").trim();
}

exports.generateCafeSearchSQL = async (userQuery) => {
    const prompt = `
Bạn là một chuyên gia SQL. Hãy viết một câu SQL truy vấn Postgres chính xác.
Dữ liệu có hai bảng:

1) cafes(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    address TEXT,
    phone_number VARCHAR(20),
    open_time TIME,
    close_time TIME,
    main_image TEXT,
    rating INT,
    rating_count INT,
    has_wifi BOOLEAN,
    has_parking BOOLEAN,
    has_air_conditioning BOOLEAN
)

2) menu_items(
    id SERIAL PRIMARY KEY,
    cafe_id INT REFERENCES cafes(id),
    item_name VARCHAR(255),
    price NUMERIC(10,2),
    rating INT,
    rating_count INT,
    image TEXT
)

Yêu cầu từ người dùng: "${userQuery}"

Hãy trả về DUY NHẤT câu SQL, không giải thích.
Truy vấn phải:
- tự tạo điều kiện WHERE phù hợp
- có thể JOIN menu_items khi cần lọc theo giá hoặc món
- dùng select * hoặc c.* FROM cafes

SQL:
  `;
    const response = await model.generateContent(prompt)

    return cleanSQL(response.response.text());
}
