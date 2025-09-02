import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden">
      <div className="relative">
        <img src={product.image || '/logo.png'} alt={product.name} className="w-full h-48 object-cover" />
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow">
            YENİ
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-yellow-600">{product.price} ₺</span>
              {product.oldPrice && (
                <span className="text-xs text-gray-400 line-through">{product.oldPrice} ₺</span>
              )}
            </div>
          </div>
          <Link to={`/urun/${product.id}`} className="px-4 py-2 rounded-lg font-medium text-white bg-gray-900 hover:bg-gray-800 shadow-sm hover:shadow transition">
            İncele
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
