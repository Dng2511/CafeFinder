import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import CafeCard from "./components/CafeCard";
import "./App.css";

function App() {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    keyword: "",
    category: "すべて",
    distance: "3km以内",
    address: "",
    openNow: "営業中のみ",
  });

  const API_URL = "http://localhost:3000";

  const fetchCafes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.keyword) params.append("keyword", filters.keyword);
      if (filters.category !== "すべて")
        params.append("category", filters.category);
      if (filters.distance) params.append("distance", filters.distance);
      if (filters.address) params.append("address", filters.address);

      const response = await fetch(`${API_URL}/search?${params.toString()}`);
      const data = await response.json();

      if (data.status === "success") {
        setCafes(data.data);
      }
    } catch (error) {
      console.error("Error fetching cafes:", error);
      alert(
        "カフェデータの取得に失敗しました。バックエンドが起動しているか確認してください。"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCafes();
  }, []);

  const handleSearch = () => {
    fetchCafes();
  };

  const handleDetailClick = (cafe) => {
    alert(
      `${cafe.name}の詳細\n\n住所: ${cafe.address}\n営業時間: ${cafe.openingHours}\nカテゴリ: ${cafe.category}`
    );
  };

  return (
    <div className="app-container">
      <SearchBar
        filters={filters}
        onFilterChange={setFilters}
        onSearch={handleSearch}
      />

      <div className="results-container">
        <div className="results-header">
          <h2 className="results-title">検索結果（{cafes.length}件）</h2>
        </div>

        {loading ? (
          <div className="loading">読み込み中...</div>
        ) : cafes.length === 0 ? (
          <div className="no-results">検索結果がありません</div>
        ) : (
          <div className="cafe-list">
            {cafes.map((cafe) => (
              <CafeCard
                key={cafe.id}
                cafe={cafe}
                onDetailClick={handleDetailClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
