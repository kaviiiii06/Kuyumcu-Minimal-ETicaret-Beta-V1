import React, { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "../context/AuthContext";

function EnhancedLiveBorsa() {
  const { user } = useAuth();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [customSpreads, setCustomSpreads] = useState({});
  const [showSpreadModal, setShowSpreadModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Sadece admin kullanıcıları yeki işlemi yapabilir
  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    // restore custom spreads from localStorage
    try {
      const saved = localStorage.getItem('birko_custom_spreads');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setCustomSpreads(parsed);
        }
      }
    } catch {}

    const fetchPrices = async () => {
      try {
        setError(null);
        console.log("🔄 API'den veri alınıyor...");
        
        const apiBase = process.env.REACT_APP_API_BASE || "/api";
        const response = await fetch(`${apiBase}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors'
        });
        
        console.log("📡 API Response:", response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("✅ API verisi alındı:", data);
        
        // API'den gelen veriyi işle
        if (data.data && Array.isArray(data.data)) {
          console.log("📊 Fiyatlar güncelleniyor:", data.data);
          setPrices(data.data);
        } else {
          throw new Error("API'den geçersiz veri formatı alındı");
        }
        
        setLastUpdate(new Date().toLocaleString('tr-TR', { 
          timeZone: 'Europe/Istanbul',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }));
        setLoading(false);
      } catch (error) {
        console.error("❌ API Hatası:", error.message);
        
        if (error.message.includes('Failed to fetch')) {
          setError("Backend sunucusuna bağlanılamıyor. Demo veriler gösteriliyor.");
        } else {
          setError(`API hatası: ${error.message}. Demo veriler gösteriliyor.`);
        }
        
        // Demo veri göster
        setPrices([
          {
            name: "Dolar (USD/TRY)",
            alis: "32.45",
            satis: "32.47",
            change: "+0.15%",
            changeType: "positive",
            spread: 0.02
          },
          {
            name: "Euro (EUR/TRY)",
            alis: "35.12",
            satis: "35.15",
            change: "-0.08%",
            changeType: "negative",
            spread: 0.03
          },
          {
            name: "Altın (Gram)",
            alis: "2,145.50",
            satis: "2,148.00",
            change: "+1.25%",
            changeType: "positive",
            spread: 2.5
          },
          {
            name: "Gümüş (Gram)",
            alis: "24.80",
            satis: "24.85",
            change: "+0.45%",
            changeType: "positive",
            spread: 0.05
          }
        ]);
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 10000); // 10 sn'de bir güncelle
    
    return () => clearInterval(interval);
  }, []);

  // customSpreads değiştiğinde localStorage'ı güncelle
  useEffect(() => {
    try {
      localStorage.setItem('birko_custom_spreads', JSON.stringify(customSpreads));
    } catch {}
  }, [customSpreads]);

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return price.toLocaleString('tr-TR', { minimumFractionDigits: 2 });
    }
    return price;
  };

  const getChangeColor = (changeType) => {
    return changeType === 'positive' ? 'text-green-600' : 'text-red-600';
  };

  const handleSpreadEdit = (item) => {
    setSelectedItem({...item}); // Deep copy yap
    setCustomSpreads(prev => ({
      ...prev,
      [item.name]: item.spread || 0
    }));
    setShowSpreadModal(true);
  };

  const handleSpreadSave = () => {
    if (selectedItem) {
      // Modal'da yapılan değişiklikleri al
      const newAlis = parseFloat(selectedItem.alis);
      const newSatis = parseFloat(selectedItem.satis);
      
      if (!isNaN(newAlis) && !isNaN(newSatis) && newAlis >= 0 && newSatis >= 0) {
        // Yeni spread'i hesapla
        const newSpread = (newSatis - newAlis).toFixed(2);
        
        setPrices(prev => prev.map(price => 
          price.name === selectedItem.name 
            ? { 
                ...price, 
                spread: parseFloat(newSpread),
                alis: newAlis,
                satis: newSatis
              }
            : price
        ));
        
        // customSpreads'i güncelle
        setCustomSpreads(prev => ({
          ...prev,
          [selectedItem.name]: parseFloat(newSpread)
        }));
      }
    }
    setShowSpreadModal(false);
    setSelectedItem(null);
  };

  const getEffectiveSpread = (item) => {
    return customSpreads[item.name] !== undefined ? customSpreads[item.name] : item.spread;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Borsa verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            💎 Birko Kuyumculuk - Canlı Piyasa Verileri
          </h1>
          <p className="text-lg text-gray-600">
            Güncel döviz kurları ve değerli maden fiyatları
          </p>
          
          {lastUpdate && (
            <div className="mt-4 text-sm text-gray-500">
              Son güncelleme: {lastUpdate}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex">
              <svg className="flex-shrink-0 h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Prices Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-yellow-400 to-yellow-500">
                  <th className="px-6 py-4 text-left text-white font-semibold text-lg">Ürün</th>
                  <th className="px-6 py-4 text-center text-white font-semibold text-lg">Değişim</th>
                  <th className="px-6 py-4 text-center text-white font-semibold text-lg">Alış</th>
                  <th className="px-6 py-4 text-center text-white font-semibold text-lg">Satış</th>
                                     {isAdmin && (
                     <th className="px-6 py-4 text-center text-white font-semibold text-lg">Fark</th>
                   )}
                   <th className="px-6 py-4 text-center text-white font-semibold text-lg">
                     {isAdmin ? 'İşlemler' : 'Yetki'}
                   </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {prices.map((item, index) => {
                  const alis = parseFloat(item.alis);
                  const effectiveSpread = getEffectiveSpread(item);
                  const fark = effectiveSpread;
                  
                  return (
                    <tr key={index} className="hover:bg-yellow-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                              <span className="text-yellow-600 text-lg">
                                {item.name.includes('Dolar') ? '💵' : 
                                 item.name.includes('Euro') ? '💶' : 
                                 item.name.includes('Altın') ? '🥇' : '🥈'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">Canlı veri</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getChangeColor(item.changeType)}`}>
                          {item.change}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {formatPrice(alis)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {formatPrice(alis + effectiveSpread)}
                        </div>
                      </td>
                      
                                             {isAdmin && (
                         <td className="px-6 py-4 text-center">
                           <div className={`text-sm font-medium ${fark > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                             {formatPrice(effectiveSpread)}
                           </div>
                           {customSpreads[item.name] !== undefined && (
                             <div className="text-xs text-blue-600 mt-1">Özel</div>
                           )}
                         </td>
                       )}

                                                                                           <td className="px-6 py-4 text-center">
                          {isAdmin ? (
                            <button
                              onClick={() => handleSpreadEdit(item)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200"
                            >
                              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Spread Düzenle
                            </button>
                          ) : (
                            <span className="text-sm text-gray-500">
                              {user ? 'Sadece Admin' : 'Giriş Yapın'}
                            </span>
                          )}
                        </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

                 {/* Spread Modal */}
         {showSpreadModal && selectedItem && (
           <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
             <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
               <div className="mt-3 text-center">
                 <h3 className="text-lg font-medium text-gray-900 mb-4">
                   Fiyat Düzenle - {selectedItem.name}
                 </h3>
                                   <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alış Fiyatı
                    </label>
                                         <input
                       type="number"
                       step="0.01"
                       min="0"
                       value={selectedItem.alis || ''}
                       onChange={(e) => {
                         const newAlis = parseFloat(e.target.value) || 0;
                         const currentSatis = parseFloat(selectedItem.satis) || 0;
                         const newSpread = (currentSatis - newAlis).toFixed(2);
                         
                         // selectedItem'ı güncelle
                         setSelectedItem(prev => ({
                           ...prev,
                           alis: e.target.value
                         }));
                         
                         // spread'i güncelle
                         setCustomSpreads(prev => ({
                           ...prev,
                           [selectedItem.name]: parseFloat(newSpread)
                         }));
                       }}
                       onKeyDown={(e) => {
                         // Backspace ve Delete tuşlarına izin ver
                         if (e.key === 'Backspace' || e.key === 'Delete') {
                           return;
                         }
                       }}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       placeholder="Alış fiyatı girin"
                     />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Satış Fiyatı
                    </label>
                                         <input
                       type="number"
                       step="0.01"
                       min="0"
                       value={selectedItem.satis || ''}
                       onChange={(e) => {
                         const newSatis = parseFloat(e.target.value) || 0;
                         const currentAlis = parseFloat(selectedItem.alis) || 0;
                         const newSpread = (newSatis - currentAlis).toFixed(2);
                         
                         // selectedItem'ı güncelle
                         setSelectedItem(prev => ({
                           ...prev,
                           satis: e.target.value
                         }));
                         
                         // spread'i güncelle
                         setCustomSpreads(prev => ({
                           ...prev,
                           [selectedItem.name]: parseFloat(newSpread)
                         }));
                       }}
                       onKeyDown={(e) => {
                         // Backspace ve Delete tuşlarına izin ver
                         if (e.key === 'Backspace' || e.key === 'Delete') {
                           return;
                         }
                       }}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       placeholder="Satış fiyatı girin"
                     />
                  </div>
                 <div className="mb-4 p-3 bg-gray-50 rounded-md">
                   <p className="text-sm text-gray-600">
                     <strong>Spread:</strong> {customSpreads[selectedItem.name] || 0}
                   </p>
                 </div>
                 <div className="flex justify-end space-x-3">
                   <button
                     onClick={() => setShowSpreadModal(false)}
                     className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
                   >
                     İptal
                   </button>
                   <button
                     onClick={handleSpreadSave}
                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                   >
                     Kaydet
                   </button>
                 </div>
               </div>
             </div>
           </div>
         )}

        {/* Info Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Güncel Kurlar</h3>
                <p className="text-sm text-gray-500">30 saniyede bir güncellenir</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${error ? 'bg-red-100' : 'bg-green-100'}`}>
                  <svg className={`h-5 w-5 ${error ? 'text-red-600' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {error ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Backend Durumu</h3>
                <p className={`text-sm ${error ? 'text-red-500' : 'text-green-500'}`}>
                  {error ? 'Bağlantı yok - Demo veri' : 'Bağlantı aktif'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">7/24 Erişim</h3>
                <p className="text-sm text-gray-500">Her zaman güncel bilgi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnhancedLiveBorsa;
