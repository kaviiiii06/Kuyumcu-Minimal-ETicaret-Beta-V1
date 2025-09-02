import React, { useEffect, useState } from 'react';

const BirkoGumus = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const apiBase = process.env.REACT_APP_API_BASE || '/api';
        const res = await fetch(`${apiBase}/products`);
        const json = await res.json();
        const list = json && json.success ? (json.data || []) : Array.isArray(json) ? json : [];
        setProducts(list.filter(p => p.category === 'Gümüş'));
      } catch {}
    })();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🥈 Birko Gümüş
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Kaliteli gümüş ürünlerimizle hayatınıza değer katın. El işçiliği ve modern tasarımın mükemmel uyumu.
          </p>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Gümüşün Zarafeti
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                925 ayar gümüş kullanarak üretilen ürünlerimiz, hem dayanıklılık hem de estetik açısından 
                en yüksek kaliteyi sunar. Geleneksel el işçiliği teknikleri ile modern tasarım anlayışını 
                birleştirerek, her parçayı özel kılarız.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-gray-900">925</div>
                  <div className="text-sm text-gray-600">Ayar Gümüş</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-gray-900">30+</div>
                  <div className="text-sm text-gray-600">Yıllık Tecrübe</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-600">El İşçiliği</div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="text-8xl mb-4">🥈</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Premium Gümüş Koleksiyonu
                </h3>
                <p className="text-gray-600">
                  Her parça özenle seçilmiş malzemelerle üretilir
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="text-4xl mb-4">💍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gümüş Yüzükler</h3>
              <p className="text-gray-600 mb-4">
                Klasik ve modern tasarımlarla her tarza uygun gümüş yüzük koleksiyonu
              </p>
              <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors duration-200">
                Koleksiyonu İncele
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="text-4xl mb-4">📿</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gümüş Kolyeler</h3>
              <p className="text-gray-600 mb-4">
                Zarif ve şık tasarımlarla boyunlarınızı süsleyen gümüş kolye modelleri
              </p>
              <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors duration-200">
                Koleksiyonu İncele
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gümüş Bilezikler</h3>
              <p className="text-gray-600 mb-4">
                İnce detayları ve kaliteli işçiliği ile dikkat çeken gümüş bilezik serisi
              </p>
              <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors duration-200">
                Koleksiyonu İncele
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="text-4xl mb-4">👑</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gümüş Taçlar</h3>
              <p className="text-gray-600 mb-4">
                Özel günlerinizde sizi taçlandıran lüks gümüş taç koleksiyonu
              </p>
              <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors duration-200">
                Koleksiyonu İncele
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="text-4xl mb-4">🕰️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gümüş Saatler</h3>
              <p className="text-gray-600 mb-4">
                Zamanın değerini bilenler için özel tasarım gümüş saat modelleri
              </p>
              <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors duration-200">
                Koleksiyonu İncele
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Özel Siparişler</h3>
              <p className="text-gray-600 mb-4">
                Hayalinizdeki tasarımı gerçeğe dönüştüren özel sipariş hizmeti
              </p>
              <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors duration-200">
                Sipariş Ver
              </button>
            </div>
          </div>
        </div>

        {/* Silver Products */}
        {products.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gümüş Ürünler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-white rounded-xl shadow p-4">
                  <div className="flex items-center space-x-4">
                    <img src={p.image || '/logo1.jpeg'} alt={p.name} className="h-16 w-16 rounded object-cover" />
                    <div>
                      <div className="font-semibold text-gray-900">{p.name}</div>
                      <div className="text-gray-600 text-sm">₺{p.price}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Neden Birko Gümüş?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔬</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Kalite Kontrolü</h3>
              <p className="text-gray-600">
                Her ürün detaylı kalite kontrolünden geçer, 925 ayar gümüş garantisi
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👨‍🎨</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Uzman İşçilik</h3>
              <p className="text-gray-600">
                30 yıllık tecrübe ile geleneksel el işçiliği teknikleri
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Özel Tasarım</h3>
              <p className="text-gray-600">
                Modern tasarım anlayışı ile özgün ve şık parçalar
              </p>
            </div>
          </div>
        </div>

                 {/* Contact Info */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
           <div className="bg-white rounded-xl shadow-lg p-6 text-center">
             <div className="text-4xl mb-4">📍</div>
             <h3 className="text-lg font-semibold text-gray-900 mb-2">Adres</h3>
             <p className="text-gray-600">
               Ulus, Anafartalar Cd<br />
               Vakıf Kuyumcular Çarşısı 22/D<br />
               Kat: -1, 06660 Altındağ/Ankara
             </p>
           </div>
           <div className="bg-white rounded-xl shadow-lg p-6 text-center">
             <div className="text-4xl mb-4">📞</div>
             <h3 className="text-lg font-semibold text-gray-900 mb-2">İletişim</h3>
             <p className="text-gray-600">
               <a href="tel:+905535045151" className="hover:text-yellow-600 transition-colors">
                 +90 553 504 51 51
               </a><br />
               <a href="https://www.instagram.com/birkometal/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-600 transition-colors">
                 @birkometal
               </a>
             </p>
           </div>
                       <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">🕒</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Çalışma Saatleri</h3>
              <p className="text-gray-600">
                Pazartesi - Cumartesi<br />
                08:30 - 18:30
              </p>
            </div>
         </div>

         {/* CTA Section */}
         <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl p-8 text-center text-white">
           <h2 className="text-3xl font-bold mb-4">
             Gümüş Koleksiyonumuzu Keşfedin
           </h2>
           <p className="text-xl mb-6 opacity-90">
             Kaliteli gümüş ürünlerimizle tarzınızı yansıtın
           </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button className="bg-white text-yellow-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
               Koleksiyonu Görüntüle
             </button>
             <a href="https://www.instagram.com/birkometal/" target="_blank" rel="noopener noreferrer" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-yellow-600 transition-colors duration-200">
               Instagram'da Takip Et
             </a>
           </div>
         </div>
      </div>
    </div>
  );
};

export default BirkoGumus;
