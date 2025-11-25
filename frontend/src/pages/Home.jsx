import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import CafeCard from "../components/CafeCard";

function Home() {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    keyword: "",
    category: "すべて",
    distance: "",
    address: "",
    openNow: "",
  });
  const navigate = useNavigate();

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

      const response = await fetch(
        `${API_URL}/cafes?search=${params.toString()}`
      );
      const data = await response.json();

      if (data.status === "success") {
        setCafes(data.data);
      }
    } catch (error) {
      console.error("Error fetching cafes:", error);
      // alert("カフェデータの取得に失敗しました。");
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
    navigate(`/cafes/${cafe.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto p-4 max-w-5xl">
          <SearchBar
            filters={filters}
            onFilterChange={setFilters}
            onSearch={handleSearch}
          />

          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="mb-5 border-b-2 border-gray-100 pb-2.5">
              <h2 className="text-lg font-bold text-gray-800">検索結果（{cafes.length}件）</h2>
            </div>

            {loading ? (
              <div className="text-center p-10 text-gray-400 text-base">読み込み中...</div>
            ) : cafes.length === 0 ? (
              <div className="text-center p-10 text-gray-400 text-base">検索結果がありません</div>
            ) : (
              <div className="flex flex-col gap-2.5">
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
      </main>

      <Footer />
    </div>
  );
}

export default Home;
