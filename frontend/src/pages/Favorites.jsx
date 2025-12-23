import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Trash2, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState("指定なし");
  const [sortOrder, setSortOrder] = useState("新しい順");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    if (searchKeyword.trim() === "") {
      fetchFavorites();
    } else {

      const filtered = favorites.filter((cafe) =>
        cafe.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (cafe.tags && cafe.tags.toLowerCase().includes(searchKeyword.toLowerCase()))
      );
      setFavorites(filtered);
    }
  }, [searchKeyword]);

  // Mock user_id - trong thực tế lấy từ authentication
  const userId = 1;



  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/favorites`);
      const data = await response.json();
      console.log("Fetched favorites:", data);

      if (data.status === "success") {
        // Transform data from API
        const transformedData = data.data.map((fav) => ({
          id: fav.cafe.id,
          name: fav.cafe.name,
          address: fav.cafe.address,
          main_image: fav.cafe.main_image,
          rating: fav.cafe.rating || 4.5,
          rating_count: fav.cafe.rating_count || 42,
          tags: "無料Wi-Fi・静か・作業しやすい",
          added_date: fav.created_at,
        }));
        setFavorites(transformedData);
      }
    } catch (error) {
      console.error("お気に入りの取得に失敗しました:", error);
      alert("お気に入りの取得に失敗しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (cafeId, cafeName) => {
    if (!confirm(`「${cafeName}」をお気に入りから削除しますか？`)) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/favorites/${cafeId}?user_id=${userId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (data.status === "success") {
        // 即座にUIから削除
        setFavorites(favorites.filter((cafe) => cafe.id !== cafeId));
        alert("お気に入りから削除しました");
      } else {
        alert("削除に失敗しました。もう一度お試しください。");
      }
    } catch (error) {
      console.error("削除エラー:", error);
      alert("削除に失敗しました。もう一度お試しください。");
    }
  };

  const handleCafeClick = (cafeId) => {
    navigate(`/cafes/${cafeId}`);
  };

  const filteredAndSortedFavorites = () => {
    let result = [...favorites];

    // フィルタリング
    if (filterRating !== "指定なし") {
      const minRating = parseFloat(filterRating);
      result = result.filter((cafe) => cafe.rating >= minRating);
    }

    // ソート
    if (sortOrder === "新しい順") {
      result.sort((a, b) => new Date(b.added_date) - new Date(a.added_date));
    } else if (sortOrder === "評価が高い順") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  };

  const displayedFavorites = filteredAndSortedFavorites();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          お気に入り一覧
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">
              キーワード検索
            </label>
            <input
              type="text"
              placeholder="店舗名・タグなどで検索"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-40">
            <label className="block text-sm text-gray-600 mb-1">
              評価で絞り込み
            </label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="指定なし">指定なし</option>
              <option value="4.5">4.5以上</option>
              <option value="4.0">4.0以上</option>
              <option value="3.5">3.5以上</option>
            </select>
          </div>
          <div className="w-full sm:w-40">
            <label className="block text-sm text-gray-600 mb-1">並び替え</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="新しい順">新しい順</option>
              <option value="評価が高い順">評価が高い順</option>
            </select>
          </div>
        </div>
      </div>

      {/* Favorites List */}
      {displayedFavorites.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            お気に入りが見つかりません
          </h3>
          <p className="text-gray-500 mb-6">
            {favorites.length === 0
              ? "まだお気に入りに追加されていません。気になるカフェを見つけて追加しましょう！"
              : "選択した条件に一致するお気に入りがありません。"}
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            カフェを探す
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedFavorites.map((cafe) => (
            <Card
              key={cafe.id}
              className="hover:shadow-md transition-shadow border-none shadow-sm"
            >
              <CardContent className="p-0">
                <div className="flex gap-4 p-4">
                  {/* Image */}
                  <div
                    className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-200 cursor-pointer"
                    onClick={() => handleCafeClick(cafe.id)}
                  >
                    <img
                      src={
                        cafe.main_image ||
                        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&q=80"
                      }
                      alt={cafe.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div
                        className="cursor-pointer flex-1"
                        onClick={() => handleCafeClick(cafe.id)}
                      >
                        <h3 className="font-bold text-gray-900 text-lg hover:text-blue-600 transition-colors">
                          {cafe.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 text-sm font-semibold text-gray-900">
                              {cafe.rating?.toFixed(1) || "0.0"}
                            </span>
                            <span className="ml-1 text-xs text-gray-500">
                              ({cafe.rating_count || 0})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-1 text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
                      <span className="line-clamp-1">{cafe.address}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {cafe.tags
                        ?.split("・")
                        .slice(0, 3)
                        .map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>

                    {cafe.added_date && (
                      <div className="text-xs text-gray-400 mt-2">
                        登録日:{" "}
                        {new Date(cafe.added_date).toLocaleDateString("ja-JP")}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleCafeClick(cafe.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 h-9"
                    >
                      詳細
                    </Button>
                    <Button
                      onClick={() => handleRemoveFavorite(cafe.id, cafe.name)}
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 text-sm px-4 h-9"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      削除
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
