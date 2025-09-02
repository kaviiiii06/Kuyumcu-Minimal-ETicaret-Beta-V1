import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const apiBase = process.env.REACT_APP_API_BASE || '/api';
        const res = await fetch(`${apiBase}/products/${id}`);
        if (res.ok) {
          const json = await res.json();
          if (json && json.success) {
            setProduct(json.data);
            return;
          }
        }
        // Fallback: fetch all and find locally
        const listRes = await fetch(`${apiBase}/products`);
        if (listRes.ok) {
          const listJson = await listRes.json();
          const list = listJson && listJson.success ? (listJson.data || []) : (Array.isArray(listJson) ? listJson : []);
          const pid = parseInt(id);
          const found = list.find(p => String(p.id) === String(id) || p.id === pid);
          if (found) {
            setProduct(found);
            return;
          }
        }
        setError('Ürün bulunamadı');
      } catch (e) {
        setError('Ürün yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleBuy = () => {
    // Miktar bilgisini localStorage'a kaydet
    console.log('🔍 ProductDetail - Setting Quantity:', quantity);
    localStorage.setItem('selectedQuantity', quantity.toString());
    // Müşteri bilgi formuna yönlendir
    navigate(`/musteri-bilgileri/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error || 'Ürün bulunamadı'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="mb-6 text-sm text-gray-600 hover:text-gray-900">← Geri</button>
        <div className="bg-white rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img src={product.image || '/logo1.jpeg'} alt={product.name} className="w-full h-80 object-cover rounded-lg" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="text-gray-600 mb-4">{product.description}</div>
            <div className="text-3xl font-extrabold text-yellow-600 mb-6">₺{product.price}</div>

            <div className="flex items-center space-x-3 mb-6">
              <label className="text-sm text-gray-700">Adet</label>
              <input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={(e) => {
                  const newQuantity = Math.max(1, parseInt(e.target.value || '1'));
                  setQuantity(newQuantity);
                  // localStorage'ı güncelle
                  localStorage.setItem('selectedQuantity', newQuantity.toString());
                }} 
                className="w-20 border border-gray-300 rounded px-2 py-1" 
              />
            </div>

            <button onClick={handleBuy} className="px-6 py-3 rounded-lg font-semibold text-white bg-yellow-600 hover:bg-yellow-700">
              Satın Al
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;


