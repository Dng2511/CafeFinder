import React from "react";
import "./CafeCard.css";

const CafeCard = ({ cafe, onDetailClick }) => {
  return (
    <div className="cafe-card">
      <div className="cafe-image">
        <span className="cafe-image-placeholder">画像</span>
      </div>
      <div className="cafe-info">
        <h3 className="cafe-name">{cafe.name}</h3>
        <p className="cafe-details">
          {cafe.address} / {cafe.openingHours} / {cafe.category}
        </p>
      </div>
      <button className="detail-button" onClick={() => onDetailClick(cafe)}>
        詳細
      </button>
    </div>
  );
};

export default CafeCard;
