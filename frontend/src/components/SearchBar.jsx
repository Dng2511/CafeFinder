import React from "react";

const SearchBar = ({ filters, onFilterChange, onSearch }) => {
  const handleInputChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg mb-5 shadow-sm">
      <h1 className="text-2xl font-bold mb-5 text-gray-800">カフェ検索</h1>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-600 font-medium">
              キーワード
            </label>
            <input
              type="text"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm bg-white text-gray-800 focus:outline-none focus:border-blue-600"
              placeholder="例）ラテ、Wi-Fi、静か"
              value={filters.keyword}
              onChange={(e) => handleInputChange("keyword", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-600 font-medium">
              カテゴリ
            </label>
            <select
              className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm bg-white text-gray-800 focus:outline-none focus:border-blue-600"
              value={filters.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
            >
              <option value="すべて">すべて</option>
              <option value="Wi-Fi◎">Wi-Fi◎</option>
              <option value="電源あり">電源あり</option>
              <option value="テラス席">テラス席</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-600 font-medium">距離</label>
            <select
              className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm bg-white text-gray-800 focus:outline-none focus:border-blue-600"
              value={filters.distance}
              onChange={(e) => handleInputChange("distance", e.target.value)}
            >
              <option value="すべて">すべて</option>
              <option value="3km以内">3km以内</option>
              <option value="5km以内">5km以内</option>
              <option value="10km以内">10km以内</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-600 font-medium">現在地</label>
            <input
              type="text"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm bg-white text-gray-800 focus:outline-none focus:border-blue-600"
              placeholder="東京都千代田区"
              value={filters.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-600 font-medium">
              営業中のみ
            </label>
            <select
              className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm bg-white text-gray-800 focus:outline-none focus:border-blue-600"
              value={filters.openNow}
              onChange={(e) => handleInputChange("openNow", e.target.value)}
            >
              <option value="営業中のみ">営業中のみ</option>
              <option value="すべて">すべて</option>
            </select>
          </div>

          <button
            className="w-full px-10 py-2.5 bg-blue-600 text-white rounded-md text-base font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
            onClick={onSearch}
          >
            検索
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
