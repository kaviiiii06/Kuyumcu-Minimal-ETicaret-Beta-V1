import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageEditor from './PageEditor';

const HomePage = () => {
  const { user } = useAuth();
  const [showEditor, setShowEditor] = useState(false);
  const [pageData, setPageData] = useState({
    title: "Birko Kuyumculuk",
    subtitle: "Zerafetin Parlak Yüzü",
    description: "Geleneksel el işçiliğini modern tasarımlarla buluşturan koleksiyonlarımızı keşfedin.",
    image: "/logo.png",
    customFields: {
      heroButton1: "Ürünleri İncele",
      heroButton2: "Canlı Borsa",
      ctaButton1: "Ürünleri Keşfet",
      ctaButton2: "Giriş Yap"
    },
    navbar: {
      logoText: "Birko Kuyumculuk",
      logoImage: "/logo1.jpeg",
      menuItems: [
        { text: "Ana Sayfa", link: "/" },
        { text: "Ürünler", link: "/urunler" },
        { text: "🥈 Birko Gümüş", link: "/birko-gumus" },
        { text: "💎 Birko Kuyumculuk", link: "/birko-kuyumculuk" },
        { text: "Borsa", link: "/borsa" }
      ]
    },
    footer: {
      companyName: "Birko Kuyumculuk",
      description: "30 yıllık tecrübemizle kaliteli ve güvenilir hizmet sunuyoruz. Geleneksel el işçiliği, modern tasarım anlayışıyla bir arada.",
      logoImage: "/logo1.jpeg"
    }
  });

  const features = [
    { icon: '💎', title: 'Kaliteli Ürünler', description: 'Altın, gümüş ve platin ürünlerde üstün kalite' },
    { icon: '🏆', title: 'Güvenilir Hizmet', description: '30+ yıllık tecrübe ile yanınızdayız' },
    { icon: '💰', title: 'Uygun Fiyatlar', description: 'Rekabetçi fiyat politikası' },
    { icon: '🚚', title: 'Hızlı Teslimat', description: 'Siparişleriniz hızlı ve güvenle' }
  ];

  const stats = [
    { number: '30+', label: 'Yıllık Tecrübe' },
    { number: '10K+', label: 'Mutlu Müşteri' },
    { number: '500+', label: 'Ürün Çeşidi' },
    { number: '24/7', label: 'Destek' }
  ];

  // Sayfa yüklendiğinde localStorage'dan verileri yükle
  useEffect(() => {
    const savedData = localStorage.getItem('homePageData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setPageData(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('LocalStorage veri yükleme hatası:', error);
      }
    }
  }, []);

  const handleSave = async (newData) => {
    try {
      // Sayfa verilerini güncelle
      setPageData(newData);
      
      // localStorage'a kaydet
      localStorage.setItem('homePageData', JSON.stringify(newData));
      
      // Navbar ve Footer verilerini ayrı ayrı kaydet
      if (newData.navbar) {
        localStorage.setItem('navbarData', JSON.stringify(newData.navbar));
      }
      if (newData.footer) {
        localStorage.setItem('footerData', JSON.stringify(newData.footer));
      }
      
      // Backend'e kaydet (opsiyonel)
      const response = await fetch('/api/site-settings/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      
      if (!response.ok) {
        console.warn('Backend kaydetme başarısız, sadece local güncellendi');
      }

      // Sayfayı yenile (navbar ve footer güncellemeleri için)
      window.location.reload();
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0">
          <img src="/logo.png" alt="bg" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 to-amber-600/30" />
        </div>
        <div className="relative py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Admin için Düzenle Butonu */}
            {user && user.role === 'admin' && (
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setShowEditor(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Sayfayı Düzenle</span>
                </button>
              </div>
            )}
            
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
              <span className="block">{pageData.title}</span>
              <span className="mt-2 block bg-gradient-to-r from-yellow-600 to-amber-500 bg-clip-text text-transparent">{pageData.subtitle}</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
              {pageData.description}
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link to="/urunler" className="px-8 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 shadow-md hover:shadow-lg transition">
                {pageData.customFields.heroButton1}
              </Link>
              <Link to="/borsa" className="px-8 py-3 rounded-xl font-semibold border-2 border-yellow-500 text-yellow-700 hover:bg-yellow-50 transition">
                {pageData.customFields.heroButton2}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-4 rounded-lg bg-white shadow-sm">
                <div className="text-4xl md:text-5xl font-extrabold text-yellow-600">
                  {stat.number}
                </div>
                <div className="mt-1 text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Hemen Başlayın
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Ürünlerimizi inceleyin, canlı borsa verilerini takip edin ve size en uygun ürünü bulun.
          </p>
          <div className="space-x-4">
            <Link to="/urunler" className="inline-block px-8 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 shadow-md hover:shadow-lg transition">
              {pageData.customFields.ctaButton1}
            </Link>
            <Link to="/login" className="inline-block px-8 py-3 rounded-xl font-semibold border-2 border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 transition">
              {pageData.customFields.ctaButton2}
            </Link>
          </div>
        </div>
      </section>

      {/* Page Editor Modal */}
      <PageEditor
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        pageData={pageData}
        onSave={handleSave}
        title="Ana Sayfa Düzenle"
      />
    </div>
  );
};

export default HomePage;
