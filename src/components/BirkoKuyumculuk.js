import React, { useEffect, useState } from 'react';

const BirkoKuyumculuk = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const apiBase = process.env.REACT_APP_API_BASE || '/api';
        const res = await fetch(`${apiBase}/products`);
        const json = await res.json();
        const list = json && json.success ? (json.data || []) : Array.isArray(json) ? json : [];
        setProducts(list.filter(p => p.category === 'Altın'));
      } catch {}
    })();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            💎 Birko Kuyumculuk
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            30 yıllık tecrübemizle altın, gümüş ve değerli taşlardan oluşan eşsiz koleksiyonlarımızla 
            hayatınızın özel anlarını değerli kılın.
          </p>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-2xl p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Lüksün ve Kalitenin Adresi
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Birko Kuyumculuk olarak, geleneksel el işçiliği ile modern tasarım anlayışını 
                birleştirerek, her parçayı özel kılarız. Altın, gümüş ve değerli taşlardan 
                oluşan koleksiyonlarımız, hayatınızın en değerli anlarında sizlerle.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-gray-900">30+</div>
                  <div className="text-sm text-gray-600">Yıllık Tecrübe</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-gray-900">1000+</div>
                  <div className="text-sm text-gray-600">Mutlu Müşteri</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Özel Tasarım</div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="text-8xl mb-4">💎</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Premium Kuyumculuk
                </h3>
                <p className="text-gray-600">
                  Her parça bir sanat eseri gibi özenle işlenir
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="text-4xl mb-4">🥇</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Altın Koleksiyonu</h3>
              <p className="text-gray-600 mb-4">
                14K, 18K ve 22K altın kullanarak üretilen özel tasarım altın takı koleksiyonu
              </p>
              <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors duration-200">
                Koleksiyonu İncele
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="text-4xl mb-4">💍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nişan & Düğün</h3>
              <p className="text-gray-600 mb-4">
                Hayatınızın en özel anları için özel tasarım nişan ve düğün takıları
              </p>
              <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors duration-200">
                Koleksiyonu İncele
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pırlanta Takılar</h3>
              <p className="text-gray-600 mb-4">
                En kaliteli pırlantalar ile üretilen lüks pırlanta takı koleksiyonu
              </p>
              <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors duration-200">
                Koleksiyonu İncele
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="text-4xl mb-4">🕰️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lüks Saatler</h3>
              <p className="text-gray-600 mb-4">
                Altın ve gümüş kullanarak üretilen özel tasarım lüks saat modelleri
              </p>
              <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors duration-200">
                Koleksiyonu İncele
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tamir & Bakım</h3>
              <p className="text-gray-600 mb-4">
                Uzman ekibimizle kuyum eşyalarınızın tamir ve bakım hizmetleri
              </p>
              <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors duration-200">
                Hizmet Al
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Özel Tasarım</h3>
              <p className="text-gray-600 mb-4">
                Hayalinizdeki tasarımı gerçeğe dönüştüren özel sipariş hizmeti
              </p>
              <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors duration-200">
                Sipariş Ver
              </button>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Birko Kuyumculuk Hakkında
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                1993 yılından bu yana İstanbul'da hizmet veren Birko Kuyumculuk, 
                geleneksel el işçiliği ile modern tasarım anlayışını birleştirerek, 
                müşterilerine en kaliteli kuyum ürünlerini sunmaktadır.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-yellow-100 rounded-full p-2 mr-4">
                    <span className="text-yellow-600">✓</span>
                  </div>
                  <span className="text-gray-700">30 yıllık tecrübe</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-yellow-100 rounded-full p-2 mr-4">
                    <span className="text-yellow-600">✓</span>
                  </div>
                  <span className="text-gray-700">Geleneksel el işçiliği</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-yellow-100 rounded-full p-2 mr-4">
                    <span className="text-yellow-600">✓</span>
                  </div>
                  <span className="text-gray-700">Kaliteli malzeme garantisi</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-yellow-100 rounded-full p-2 mr-4">
                    <span className="text-yellow-600">✓</span>
                  </div>
                  <span className="text-gray-700">Özel tasarım hizmeti</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl p-8 text-white">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold mb-2">
                  Güvenilir Kuyumcu
                </h3>
                <p className="text-yellow-100">
                  Müşteri memnuniyeti odaklı hizmet anlayışı
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gold Products */}
        {products.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Altın Ürünler</h2>
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
            Kuyumculuk Dünyamıza Hoş Geldiniz
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Kaliteli ve güvenilir kuyum ürünleri için bizi tercih edin
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-yellow-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Koleksiyonu Görüntüle
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-yellow-600 transition-colors duration-200">
              İletişime Geç
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirkoKuyumculuk;
