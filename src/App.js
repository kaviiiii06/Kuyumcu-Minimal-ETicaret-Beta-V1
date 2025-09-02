import { BrowserRouter as Router, Routes, Route, Link, NavLink } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useState, useEffect } from "react";
import HomePage from "./components/HomePage";
import ProductsPage from "./components/ProductsPage";
import EnhancedLiveBorsa from "./components/EnhancedLiveBorsa";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import AdminPanel from "./components/AdminPanel";
import BirkoGumus from "./components/BirkoGumus";
import BirkoKuyumculuk from "./components/BirkoKuyumculuk";
import ProductDetail from "./components/ProductDetail";
import { PaymentSuccess, PaymentCancel } from "./components/PaymentResult";
import CustomerInfoForm from "./components/CustomerInfoForm";
import PaymentPage from "./components/PaymentPage";

function Navbar() {
  const { user, logout } = useAuth();
  const [navbarData, setNavbarData] = useState({
    logoText: "Birko Kuyumculuk",
    logoImage: "/logo1.jpeg",
    menuItems: [
      { text: "Ana Sayfa", link: "/" },
      { text: "Ürünler", link: "/urunler" },
      { text: "🥈 Birko Gümüş", link: "/birko-gumus" },
      { text: "💎 Birko Kuyumculuk", link: "/birko-kuyumculuk" },
      { text: "Borsa", link: "/borsa" }
    ]
  });

  // localStorage'dan navbar verilerini yükle
  useEffect(() => {
    const savedNavbar = localStorage.getItem('navbarData');
    if (savedNavbar) {
      try {
        const parsed = JSON.parse(savedNavbar);
        setNavbarData(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Navbar veri yükleme hatası:', error);
      }
    }
  }, []);

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive ? "text-yellow-700 bg-yellow-100" : "text-gray-600 hover:text-yellow-600"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img src={navbarData.logoImage} alt="Birko Kuyumculuk" className="h-10 w-10 rounded-full ring-2 ring-yellow-400/40 group-hover:ring-yellow-500/60 transition" />
            <span className="ml-3 text-xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-yellow-600 to-amber-500 bg-clip-text text-transparent">Birko</span>
              <span className="text-gray-800"> Kuyumculuk</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {navbarData.menuItems.map((item, index) => (
              <NavLink key={index} to={item.link} className={navLinkClass}>
                {item.text}
              </NavLink>
            ))}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="hidden sm:block text-sm text-gray-700">Merhaba, <span className="font-semibold">{user.name}</span></span>
                               {user.role === 'admin' && (
                 <Link
                   to="/admin"
                   className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-purple-500 hover:bg-purple-600 shadow-sm hover:shadow transition"
                 >
                   Admin Paneli
                 </Link>
               )}
               <span className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100">
                 {user.role === 'admin' ? '👑 Admin' : user.role === 'bayi' ? '🏪 Bayi' : '👤 Kullanıcı'}
               </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 shadow-sm hover:shadow transition"
                >
                  Çıkış
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 shadow-sm hover:shadow transition"
              >
                Giriş
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  const [footerData, setFooterData] = useState({
    companyName: "Birko Kuyumculuk",
    description: "30 yıllık tecrübemizle kaliteli ve güvenilir hizmet sunuyoruz. Geleneksel el işçiliği, modern tasarım anlayışıyla bir arada.",
    logoImage: "/logo1.jpeg"
  });

  // localStorage'dan footer verilerini yükle
  useEffect(() => {
    const savedFooter = localStorage.getItem('footerData');
    if (savedFooter) {
      try {
        const parsed = JSON.parse(savedFooter);
        setFooterData(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Footer veri yükleme hatası:', error);
      }
    }
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <img src={footerData.logoImage} alt="Birko Logo" className="h-10 w-10 rounded-full ring-2 ring-yellow-500/40" />
              <span className="ml-2 text-xl font-bold">{footerData.companyName}</span>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              {footerData.description}
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/birkometal/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zm-5 3a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7zm0 2a3 3 0 1 1-.001 6.001A3 3 0 0 1 12 9zm5.5-3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white transition">Ana Sayfa</Link></li>
              <li><Link to="/urunler" className="hover:text-white transition">Ürünler</Link></li>
              <li><Link to="/birko-gumus" className="hover:text-white transition">🥈 Birko Gümüş</Link></li>
              <li><Link to="/birko-kuyumculuk" className="hover:text-white transition">💎 Birko Kuyumculuk</Link></li>
              <li><Link to="/borsa" className="hover:text-white transition">Canlı Borsa</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Giriş</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">İletişim</h3>
            <div className="space-y-2">
              <p>📍 Ulus, Anafartalar Cd<br />Vakıf Kuyumcular Çarşısı 22/D<br />Kat: -1, 06660 Altındağ/Ankara</p>
              <p>📞 <a href="tel:+905535045151" className="hover:text-white transition-colors">+90 553 504 51 51</a></p>
              <p>📱 <a href="https://www.instagram.com/birkometal/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">@birkometal</a></p>
              <p>🕒 08:30 - 18:30</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
          © {new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul', year: 'numeric' })} Birko Kuyumculuk. Tüm Hakları Saklıdır.
        </div>
        <div className="text-center text-xs text-gray-600 mt-2">
          Siteyi Tasarlayan: <a href="https://www.instagram.com/one.barann" target="_blank" rel="noopener noreferrer" className="font-semibold text-yellow-400 hover:underline">Frontend & Backend - Baran Akbulut</a>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/urunler" element={<ProductsPage />} />
              <Route path="/urun/:id" element={<ProductDetail />} />
              <Route path="/musteri-bilgileri/:id" element={<CustomerInfoForm />} />
              <Route path="/odeme/:id" element={<PaymentPage />} />
              <Route path="/odeme-basarili" element={<PaymentSuccess />} />
              <Route path="/odeme-iptal" element={<PaymentCancel />} />
              <Route path="/birko-gumus" element={<BirkoGumus />} />
              <Route path="/birko-kuyumculuk" element={<BirkoKuyumculuk />} />
              <Route path="/borsa" element={<EnhancedLiveBorsa />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
