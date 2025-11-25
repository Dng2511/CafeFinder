import React from "react";

const CafeCard = ({ cafe, onDetailClick }) => {
  return (
    <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-3 gap-4 hover:shadow-md transition-shadow">
      <div className="w-[60px] h-[60px] bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
        <span className="text-gray-400 text-xs">画像</span>
      </div>
      <div className="flex-1">
        <h3 className="text-base font-bold mb-1 text-gray-800">{cafe.name}</h3>
        <p className="text-sm text-gray-600">
          {cafe.address} / {cafe.openingHours} / {cafe.category}
        </p>
      </div>
      <button 
        className="px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-medium shrink-0 hover:bg-blue-700 transition-colors cursor-pointer" 
        onClick={() => onDetailClick(cafe)}
      >
        詳細
      </button>
    </div>
  );
};

export default CafeCard;
