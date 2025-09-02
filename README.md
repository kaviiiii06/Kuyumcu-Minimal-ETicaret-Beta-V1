# 💎 Kuyumculuk - Modern Web Uygulaması

Bu proje, Birko Kuyumculuk şirketi için geliştirilmiş modern bir full-stack web uygulamasıdır. React frontend ve Node.js backend kullanılarak geliştirilmiştir.

## 🚀 Özellikler

### Frontend (React)
- **Modern UI/UX**: Tailwind CSS ile responsive tasarım
- **Authentication**: Context API ile kullanıcı yönetimi
- **Routing**: React Router ile sayfa yönlendirmesi
- **State Management**: React Hooks ve Context API
- **Loading States**: Skeleton loading ve spinner'lar
- **Error Handling**: Kapsamlı hata yönetimi
- **Responsive Design**: Mobil ve desktop uyumlu

### Backend (Node.js)
- **Express.js**: Modern web framework
- **API Endpoints**: RESTful API tasarımı
- **Rate Limiting**: API koruma sistemi
- **Error Handling**: Gelişmiş hata yönetimi
- **CORS Support**: Cross-origin resource sharing
- **Health Check**: Sistem durumu kontrolü

### Ana Sayfalar
1. **Ana Sayfa**: Hero section, özellikler ve istatistikler
2. **Ürünler**: Kategori filtreleme ve arama
3. **Canlı Borsa**: Döviz kurları ve değerli maden fiyatları
4. **Giriş**: Kullanıcı authentication

## 🛠️ Teknolojiler

### Frontend
- React 18.x
- React Router DOM 6.x
- Tailwind CSS 3.x
- PostCSS & Autoprefixer

### Backend
- Node.js 18+
- Express.js 4.x
- CORS 2.x
- dotenv 16.x

## 📦 Kurulum

### Gereksinimler
- Node.js 18+ 
- npm veya yarn

### Frontend Kurulumu
```bash
# Proje ana dizinine git
cd birko-frontend

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm start
```

### Backend Kurulumu
```bash
# Backend dizinine git
cd backend

# Bağımlılıkları yükle
npm install

# Environment variables ayarla
cp api.env .env
# .env dosyasını düzenle

# Sunucuyu başlat
npm start
```

## 🔧 Environment Variables

Backend için `.env` dosyası oluşturun:

```env
PORT=5000
NODE_ENV=development
CURRENCYLAYER_KEY=your_api_key_here
```

## 🎯 API Endpoints

### Ana Endpoint'ler
- `GET /health` - Sistem durumu
- `GET /api` - Canlı borsa verileri

### Demo Giriş Bilgileri
- **Email**: demo@birko.com
- **Şifre**: demo123

## 🎨 Tasarım Özellikleri

- **Renk Paleti**: Yellow (#fbbf24) ana tema
- **Typography**: Inter font ailesi
- **Animations**: CSS transitions ve keyframes
- **Icons**: SVG ve emoji kullanımı
- **Layout**: Grid ve Flexbox sistemleri

## 📱 Responsive Design

- **Mobile First**: Mobil öncelikli tasarım
- **Breakpoints**: sm, md, lg, xl
- **Touch Friendly**: Mobil dokunma optimizasyonu
- **Performance**: Lazy loading ve optimizasyon

## 🔒 Güvenlik

- **Rate Limiting**: API koruma
- **Input Validation**: Form doğrulama
- **CORS**: Cross-origin güvenlik
- **Environment Variables**: Hassas bilgi koruması

## 🚀 Deployment

### Frontend Build
```bash
npm run build
```

### Backend Production
```bash
NODE_ENV=production npm start
```

## 📊 Performans

- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices)
- **Bundle Size**: Optimized with modern bundling
- **Loading Time**: < 3 seconds
- **SEO**: Meta tags ve structured data

## 🧪 Testing

```bash
# Frontend tests
npm test

# Backend health check
curl http://localhost:5000/health
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **İnstagram**: [one.barann](https://www.instagram.com/one.barann)
- **Email**: kavipc06@gmail.com
- **Phone**: +90 (538) 969 36 06

## 🙏 Teşekkürler

- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [React](https://reactjs.org/) - JavaScript library
- [Express.js](https://expressjs.com/) - Web framework

---

**Not**: Bu proje demo amaçlı geliştirilmiştir. Gerçek kullanım için güvenlik ve performans optimizasyonları yapılmalıdır.
