import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        // Müşteri bilgilerini al
        const customerData = location.state?.customerInfo;
        if (!customerData) {
          // localStorage'dan al
          const pendingOrder = localStorage.getItem('pendingOrder');
          if (pendingOrder) {
            const orderData = JSON.parse(pendingOrder);
            setCustomerInfo(orderData.customerInfo);
          }
        } else {
          setCustomerInfo(customerData);
        }

        // Miktar bilgisini localStorage'dan doğrudan al
        const savedQuantity = localStorage.getItem('selectedQuantity');
        console.log('🔍 Saved Quantity:', savedQuantity);
        if (savedQuantity) {
          setCustomerInfo(prev => {
            const updated = prev ? {
              ...prev,
              quantity: parseInt(savedQuantity)
            } : null;
            console.log('🔍 Updated CustomerInfo:', updated);
            return updated;
          });
        }

        // Ürün bilgilerini al
        const apiBase = process.env.REACT_APP_API_BASE || '/api';
        const response = await fetch(`${apiBase}/products/${id}`);
        
        if (response.ok) {
          const result = await response.json();
          setProduct(result.data);
        } else {
          // Fallback: tüm ürünlerden bul
          const allProductsResponse = await fetch(`${apiBase}/products`);
          if (allProductsResponse.ok) {
            const allResult = await allProductsResponse.json();
            const foundProduct = allResult.data.find(p => p.id === parseInt(id));
            setProduct(foundProduct);
          }
        }
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
        setError('Ürün bilgileri yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, location.state]);

  const handlePayment = async () => {
    if (!product || !customerInfo) {
      setError('Ürün veya müşteri bilgileri eksik');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const apiBase = process.env.REACT_APP_API_BASE || '/api';
      const successUrl = window.location.origin + '/odeme-basarili';
      const cancelUrl = window.location.origin + '/odeme-iptal';
      
      const response = await fetch(`${apiBase}/payments/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: id,
          quantity: customerInfo.quantity,
          successUrl,
          cancelUrl,
          product: { name: product.name, price: product.price, image: product.image },
          name: product.name,
          price: product.price,
          customerInfo: customerInfo
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Sipariş bilgilerini kaydet
        const orderData = {
          productId: id,
          product: product,
          customerInfo: customerInfo,
          timestamp: new Date().toISOString(),
          status: 'pending'
        };
        localStorage.setItem('currentOrder', JSON.stringify(orderData));
        
        // Ödeme sayfasına yönlendir
        window.location.href = result.checkoutUrl;
      } else {
        setError(result.error || 'Ödeme başlatılamadı');
      }
    } catch (error) {
      console.error('Ödeme hatası:', error);
      setError('Ödeme işlemi sırasında hata oluştu');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!product || !customerInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Ürün veya müşteri bilgileri bulunamadı</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = product.price * customerInfo.quantity;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Ödeme</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sipariş Özeti */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sipariş Özeti</h2>
            
            <div className="flex items-center space-x-4 mb-4">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
              )}
              <div>
                <h3 className="font-medium text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.category}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Birim Fiyat:</span>
                <span>{product.price.toLocaleString('tr-TR')} ₺</span>
              </div>
              <div className="flex justify-between">
                <span>Miktar:</span>
                <span>{customerInfo.quantity}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Toplam:</span>
                <span>{totalPrice.toLocaleString('tr-TR')} ₺</span>
              </div>
            </div>
          </div>

          {/* Müşteri Bilgileri */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Müşteri Bilgileri</h2>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Ad Soyad:</span>
                <span className="ml-2">{customerInfo.firstName} {customerInfo.lastName}</span>
              </div>
              <div>
                <span className="font-medium">TC:</span>
                <span className="ml-2">{customerInfo.tc}</span>
              </div>
              <div>
                <span className="font-medium">Email:</span>
                <span className="ml-2">{customerInfo.email}</span>
              </div>
              <div>
                <span className="font-medium">Telefon:</span>
                <span className="ml-2">{customerInfo.phone}</span>
              </div>
              <div>
                <span className="font-medium">Adres:</span>
                <span className="ml-2">{customerInfo.address}, {customerInfo.district}, {customerInfo.city}</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Geri Dön
          </button>
          <button
            onClick={handlePayment}
            disabled={processing}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {processing ? 'İşleniyor...' : `Ödeme Yap (${totalPrice.toLocaleString('tr-TR')} ₺)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
