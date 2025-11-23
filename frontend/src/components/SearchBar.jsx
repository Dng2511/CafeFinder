import React from "react";
import "./SearchBar.css";

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
    <div className="search-bar">
      <h1 className="search-title">カフェ検索</h1>

      <div className="search-filters">
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">キーワード</label>
            <input
              type="text"
              className="filter-input"
              placeholder="例）ラテ、Wi-Fi、静か"
              value={filters.keyword}
              onChange={(e) => handleInputChange("keyword", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">カテゴリ</label>
            <select
              className="filter-select"
              value={filters.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
            >
              <option value="すべて">すべて</option>
              <option value="Wi-Fi◎">Wi-Fi◎</option>
              <option value="電源あり">電源あり</option>
              <option value="テラス席">テラス席</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">距離</label>
            <select
              className="filter-select"
              value={filters.distance}
              onChange={(e) => handleInputChange("distance", e.target.value)}
            >
              <option value="3km以内">3km以内</option>
              <option value="5km以内">5km以内</option>
              <option value="10km以内">10km以内</option>
            </select>
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">現在地</label>
            <input
              type="text"
              className="filter-input"
              placeholder="東京都千代田区"
              value={filters.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">営業中のみ</label>
            <select
              className="filter-select"
              value={filters.openNow}
              onChange={(e) => handleInputChange("openNow", e.target.value)}
            >
              <option value="営業中のみ">営業中のみ</option>
              <option value="すべて">すべて</option>
            </select>
          </div>

          <button className="search-button" onClick={onSearch}>
            検索
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
