import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const PaymentSuccess = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const amount = params.get('amount');
  const product = params.get('product');
  const demo = params.get('demo');
  const sessionId = params.get('session_id');

  // Sipariş bilgilerini localStorage'dan al
  const orderData = JSON.parse(localStorage.getItem('currentOrder') || '{}');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow text-center max-w-md w-full">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-4">Ödeme Başarılı</h1>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-yellow-800 font-semibold">Ödemeniz alındı, onaylanması bekleniyor.</p>
          <p className="text-sm text-yellow-700 mt-2">
            Siparişiniz en kısa sürede işleme alınacak ve size bilgi verilecektir.
          </p>
        </div>

        {amount && <p className="text-gray-600 mb-2">Tutar: ₺{amount}</p>}
        {product && <p className="text-gray-600 mb-2">Ürün: {product}</p>}
        {sessionId && <p className="text-sm text-gray-500 mb-4">Sipariş No: {sessionId}</p>}
        
        {orderData.customerInfo && (
          <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <p><strong>Müşteri:</strong> {orderData.customerInfo.firstName} {orderData.customerInfo.lastName}</p>
            <p><strong>Telefon:</strong> {orderData.customerInfo.phone}</p>
            <p><strong>Email:</strong> {orderData.customerInfo.email}</p>
          </div>
        )}
        
        <div className="mt-6 space-y-2">
          <Link to="/" className="block w-full px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700">
            Ana Sayfa
          </Link>
          <Link to="/urunler" className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
            Diğer Ürünleri Gör
          </Link>
        </div>
      </div>
    </div>
  );
};

export const PaymentCancel = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow text-center">
        <div className="text-5xl mb-4">❌</div>
        <h1 className="text-2xl font-bold mb-2">Ödeme İptal Edildi</h1>
        <p className="text-gray-600 mb-6">İsterseniz tekrar deneyebilirsiniz.</p>
        <Link to="/" className="px-4 py-2 rounded bg-gray-800 text-white">Ana Sayfa</Link>
      </div>
    </div>
  );
};


