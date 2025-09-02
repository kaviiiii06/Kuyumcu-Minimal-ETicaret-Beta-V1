
console.log("🚀 Server başlatılıyor...");

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { initDatabase, productQueries, orderQueries, userQueries } = require('./database');

console.log("📦 Modüller import edildi");

dotenv.config();

console.log("🔧 Environment variables yüklendi");

const app = express();
const PORT = process.env.PORT || 5000;

console.log(`🌐 Port: ${PORT}`);

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyaları yüklenebilir!'));
    }
  }
});

// Simple in-memory storage for site settings (will be moved to database later)
let siteSettings = {
  siteName: 'Birko Kuyumculuk',
  logoUrl: '/logo1.jpeg',
  homePage: {
    title: 'Birko Kuyumculuk',
    subtitle: 'Zerafetin Parlak Yüzü',
    description: 'Geleneksel el işçiliğini modern tasarımlarla buluşturan koleksiyonlarımızı keşfedin.',
    image: '/logo.png',
    customFields: {
      heroButton1: 'Ürünleri İncele',
      heroButton2: 'Canlı Borsa',
      ctaButton1: 'Ürünleri Keşfet',
      ctaButton2: 'Giriş Yap'
    }
  },
  navbar: {
    logoText: 'Birko Kuyumculuk',
    logoImage: '/logo1.jpeg',
    menuItems: [
      { text: 'Ana Sayfa', link: '/' },
      { text: 'Ürünler', link: '/urunler' },
      { text: '🥈 Birko Gümüş', link: '/birko-gumus' },
      { text: '💎 Birko Kuyumculuk', link: '/birko-kuyumculuk' },
      { text: 'Borsa', link: '/borsa' }
    ]
  },
  footer: {
    companyName: 'Birko Kuyumculuk',
    description: '30 yıllık tecrübemizle kaliteli ve güvenilir hizmet sunuyoruz. Geleneksel el işçiliği, modern tasarım anlayışıyla bir arada.',
    logoImage: '/logo1.jpeg'
  }
};

// In-memory users storage (will be replaced with database)
let usersStore = [];

// Rate limiting middleware
const rateLimit = (req, res, next) => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100; // max 100 requests per window
  
  if (!req.rateLimit) {
    req.rateLimit = {
      requests: [],
      windowStart: now
    };
  }
  
  // Remove old requests outside the window
  req.rateLimit.requests = req.rateLimit.requests.filter(
    timestamp => now - timestamp < windowMs
  );
  
  if (req.rateLimit.requests.length >= maxRequests) {
    return res.status(429).json({
      error: 'Too many requests, please try again later.',
      retryAfter: Math.ceil((req.rateLimit.windowStart + windowMs - now) / 1000)
    });
  }
  
  req.rateLimit.requests.push(now);
  next();
};

// Health check endpoint
app.get("/health", (req, res) => {
  console.log("✅ Health check endpoint çağrıldı");
  res.json({
    status: "OK",
    timestamp: new Date().toLocaleString('tr-TR', { 
      timeZone: 'Europe/Istanbul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Main API endpoint (simplified and working)
app.get("/api", rateLimit, async (req, res) => {
  try {
    console.log("🔄 Borsa verileri alınıyor...");
    
    // Generate dynamic data that changes on each request
    const now = new Date();
    const baseTime = now.getTime();
    
    // Simulate real-time price changes with more variation
    const usdBase = 32.45 + (Math.sin(baseTime / 5000) * 0.2) + (Math.random() * 0.1);
    const eurBase = 35.12 + (Math.cos(baseTime / 4000) * 0.3) + (Math.random() * 0.15);
    const goldBase = 2145.50 + (Math.sin(baseTime / 6000) * 10) + (Math.random() * 5);
    const silverBase = 24.80 + (Math.cos(baseTime / 7500) * 0.6) + (Math.random() * 0.3);
    
    // Calculate realistic spreads with more variation
    const usdSpread = 0.02 + (Math.random() * 0.02);
    const eurSpread = 0.03 + (Math.random() * 0.02);
    const goldSpread = 2.5 + (Math.random() * 1.0);
    const silverSpread = 0.05 + (Math.random() * 0.03);
    
    // Generate random change percentages with more variation
    const usdChange = (Math.random() > 0.5 ? '+' : '-') + (Math.random() * 0.5).toFixed(2) + '%';
    const eurChange = (Math.random() > 0.5 ? '+' : '-') + (Math.random() * 0.4).toFixed(2) + '%';
    const goldChange = (Math.random() > 0.5 ? '+' : '-') + (Math.random() * 2.0).toFixed(2) + '%';
    const silverChange = (Math.random() > 0.5 ? '+' : '-') + (Math.random() * 1.2).toFixed(2) + '%';
    
    // Build extra bullion/granule/hurda items
    const weights = [50, 100, 250, 500, 1000];
    const silverBullion = weights.map(w => ({
      name: `Gümüş Külçe ${w}g`,
      alis: Number(((silverBase) * w * 0.99).toFixed(2)),
      satis: Number(((silverBase) * w * 1.01).toFixed(2)),
      change: silverChange,
      changeType: silverChange.startsWith('+') ? 'positive' : 'negative',
      spread: Number(((silverBase) * w * 0.02).toFixed(2))
    }));
    
    const result = {
      marka: "Birko Kuyumculuk",
      piyasa: "B.Piyasa",
      lastUpdate: now.toLocaleString('tr-TR', { 
        timeZone: 'Europe/Istanbul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      source: { fx: 'live-simulation', metals: 'live-simulation' },
      data: [
        { 
          name: "Altın (Gram)", 
          alis: Number(goldBase.toFixed(2)), 
          satis: Number((goldBase + goldSpread).toFixed(2)), 
          change: goldChange, 
          changeType: goldChange.startsWith('+') ? "positive" : "negative",
          spread: Number(goldSpread.toFixed(2))
        },
        { 
          name: "Gümüş (Gram)", 
          alis: Number(silverBase.toFixed(2)), 
          satis: Number((silverBase + silverSpread).toFixed(2)), 
          change: silverChange, 
          changeType: silverChange.startsWith('+') ? "positive" : "negative",
          spread: Number(silverSpread.toFixed(2))
        },
        { name: 'Gümüş (Hurda Gram)', alis: Number((silverBase * 0.96).toFixed(2)), satis: Number((silverBase * 0.99).toFixed(2)), change: silverChange, changeType: silverChange.startsWith('+') ? 'positive' : 'negative', spread: Number((silverBase * 0.03).toFixed(2)) },
        ...silverBullion,
        { name: 'Gümüş Granül (Gram)', alis: Number((silverBase * 0.99).toFixed(2)), satis: Number((silverBase * 1.02).toFixed(2)), change: silverChange, changeType: silverChange.startsWith('+') ? 'positive' : 'negative', spread: Number((silverBase * 0.03).toFixed(2)) }
      ]
    };

    console.log("✅ Canlı borsa verileri başarıyla oluşturuldu");
    res.json(result);
  } catch (error) {
    console.error("❌ Backend Hatası:", error.message);
    const fallbackData = {
      marka: "Birko Kuyumculuk",
      piyasa: "B.Piyasa",
      lastUpdate: new Date().toLocaleString('tr-TR', { 
        timeZone: 'Europe/Istanbul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      error: "API hatası nedeniyle demo veriler gösteriliyor",
      source: { fx: 'fallback', metals: 'fallback' },
      data: [
        { 
          name: "Dolar (USD/TRY)", 
          alis: 32.45, 
          satis: 32.47, 
          change: "+0.15%", 
          changeType: "positive",
          spread: 0.02
        },
        { 
          name: "Euro (EUR/TRY)", 
          alis: 35.12, 
          satis: 35.15, 
          change: "-0.08%", 
          changeType: "negative",
          spread: 0.03
        },
        { 
          name: "Altın (Gram)", 
          alis: 2145.50, 
          satis: 2148.00, 
          change: "+1.25%", 
          changeType: "positive",
          spread: 2.5
        },
        { 
          name: "Gümüş (Gram)", 
          alis: 24.80, 
          satis: 24.85, 
          change: "+0.45%", 
          changeType: "positive",
          spread: 0.05
        }
      ]
    };
    res.status(500).json(fallbackData);
  }
});

// Users management endpoints
let users = [
  {
    id: 1,
    email: 'admin@birko.com',
    password: '123456',
    name: 'Admin User',
    role: 'admin',
    isApproved: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    email: 'user@birko.com',
    password: '123456',
    name: 'Normal User',
    role: 'user',
    isApproved: true,
    createdAt: new Date().toISOString()
  }
];

let pendingUsers = [];

// Register endpoint
app.post("/api/register", rateLimit, async (req, res) => {
  try {
    console.log("📝 Register endpoint çağrıldı:", req.body);
    const { email, password, name, phone } = req.body;
    
    // Validation
    if (!email || !password || !name || !phone) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email, şifre, ad soyad ve telefon numarası gerekli' 
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: 'Şifre en az 6 karakter olmalı' 
      });
    }
    
    // Check if user already exists
    const existingUser = await userQueries.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'Bu email adresi zaten kayıtlı' 
      });
    }
    
    // Create new user
    const newUser = await userQueries.create({
      email,
      password,
      name,
      phone,
      role: 'user',
      isApproved: false
    });
    
    console.log("✅ Yeni kullanıcı kaydı:", newUser.email);
    res.json({ 
      success: true, 
      message: 'Kayıt başarılı! Admin onayı bekleniyor.',
      user: { id: newUser.id, email: newUser.email, name: newUser.name, phone: newUser.phone }
    });
  } catch (error) {
    console.error("❌ Kayıt hatası:", error.message);
    res.status(500).json({ success: false, error: 'Kayıt yapılırken hata oluştu' });
  }
});

// Login endpoint
app.post("/api/login", rateLimit, async (req, res) => {
  try {
    console.log("🔐 Login endpoint çağrıldı:", req.body);
    const { email, password } = req.body;
    
    // Find user
    const user = await userQueries.getByEmail(email);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        error: 'Geçersiz email veya şifre' 
      });
    }
    
    if (!user.isApproved) {
      return res.status(401).json({ 
        success: false, 
        error: 'Hesabınız henüz onaylanmamış' 
      });
    }
    
    console.log("✅ Kullanıcı girişi:", user.email);
    res.json({ 
      success: true, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role, 
        isApproved: user.isApproved 
      }
    });
  } catch (error) {
    console.error("❌ Giriş hatası:", error.message);
    res.status(500).json({ success: false, error: 'Giriş yapılırken hata oluştu' });
  }
});

// Get pending users (admin only)
app.get("/api/admin/pending-users", rateLimit, async (req, res) => {
  try {
    console.log("📋 Bekleyen kullanıcılar listesi istendi");
    const pendingUsers = await userQueries.getPending();
    res.json({ 
      success: true, 
      users: pendingUsers.map(u => ({ 
        id: u.id, 
        email: u.email, 
        name: u.name, 
        phone: u.phone,
        createdAt: u.createdAt 
      }))
    });
  } catch (error) {
    console.error("❌ Bekleyen kullanıcılar hatası:", error.message);
    res.status(500).json({ success: false, error: 'Kullanıcılar alınırken hata oluştu' });
  }
});

// Approve user (admin only)
app.post("/api/admin/approve-user/:id", rateLimit, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const result = await userQueries.approve(userId);
    
    if (!result) {
      return res.status(404).json({ 
        success: false, 
        error: 'Kullanıcı bulunamadı' 
      });
    }
    
    console.log("✅ Kullanıcı onaylandı:", result.email);
    res.json({ 
      success: true, 
      message: 'Kullanıcı başarıyla onaylandı',
      user: { id: result.id, email: result.email, name: result.name }
    });
  } catch (error) {
    console.error("❌ Kullanıcı onaylama hatası:", error.message);
    res.status(500).json({ success: false, error: 'Kullanıcı onaylanırken hata oluştu' });
  }
});

// Reject user (admin only)
app.post("/api/admin/reject-user/:id", rateLimit, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const result = await userQueries.reject(userId);
    
    if (!result) {
      return res.status(404).json({ 
        success: false, 
        error: 'Kullanıcı bulunamadı' 
      });
    }
    
    console.log("❌ Kullanıcı reddedildi:", result.email);
    res.json({ 
      success: true, 
      message: 'Kullanıcı reddedildi',
      user: { id: result.id, email: result.email, name: result.name }
    });
  } catch (error) {
    console.error("❌ Kullanıcı reddetme hatası:", error.message);
    res.status(500).json({ success: false, error: 'Kullanıcı reddedilirken hata oluştu' });
  }
});

// Get approved users (admin only)
app.get("/api/admin/approved-users", rateLimit, async (req, res) => {
  try {
    console.log("📋 Onaylı kullanıcılar listesi istendi");
    const approvedUsers = await userQueries.getApproved();
    res.json({
      success: true,
      users: approvedUsers.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        phone: u.phone,
        role: u.role,
        createdAt: u.createdAt
      }))
    });
  } catch (error) {
    console.error("❌ Onaylı kullanıcılar hatası:", error.message);
    res.status(500).json({ success: false, error: 'Kullanıcılar alınırken hata oluştu' });
  }
});

// Update user role (admin only)
app.put("/api/admin/users/:id/role", rateLimit, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { role } = req.body;
    
    if (!role || !['user', 'bayi', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Geçersiz rol'
      });
    }

    const result = await userQueries.updateRole(userId, role);

    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Kullanıcı bulunamadı'
      });
    }

    console.log("🔄 Kullanıcı rolü değiştirildi:", result.email, '->', role);
    res.json({
      success: true,
      message: 'Kullanıcı rolü değiştirildi',
      user: { id: result.id, email: result.email, name: result.name, role: result.role }
    });
  } catch (error) {
    console.error("❌ Kullanıcı rolü değiştirme hatası:", error.message);
    res.status(500).json({ success: false, error: 'Kullanıcı rolü değiştirilirken hata oluştu' });
  }
});

// Update user (admin only)
app.put('/api/admin/user/:id', rateLimit, (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    let user = users.find(u => u.id === userId) || pendingUsers.find(u => u.id === userId);
    if (!user) return res.status(404).json({ success: false, error: 'Kullanıcı bulunamadı' });
    const allowed = ['email', 'password', 'name', 'role', 'isApproved'];
    for (const key of allowed) {
      if (key in req.body) user[key] = req.body[key];
    }
    return res.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role, isApproved: user.isApproved } });
  } catch (error) {
    console.error('❌ Kullanıcı güncelleme hatası:', error.message);
    res.status(500).json({ success: false, error: 'Kullanıcı güncellenirken hata oluştu' });
  }
});

// Products CRUD endpoints
app.get("/api/products", rateLimit, async (req, res) => {
  try {
    console.log("📦 Ürünler endpoint çağrıldı");
    const products = await productQueries.getAll();
    res.json({ success: true, data: products, total: products.length });
  } catch (error) {
    console.error("❌ Ürünler hatası:", error.message);
    res.status(500).json({ success: false, error: "Ürünler yüklenirken hata oluştu" });
  }
});

app.post("/api/products", rateLimit, async (req, res) => {
  try {
    const { name, category, price, description, image, oldPrice, isNew, stock } = req.body;
    if (!name || !category || typeof price === 'undefined') {
      return res.status(400).json({ success: false, error: 'name, category ve price gerekli' });
    }
    
    const newProduct = await productQueries.create({
      name,
      category,
      price: Number(price),
      description: description || '',
      image: image || '/logo1.jpeg',
      stock: parseInt(stock) || 0
    });
    
    console.log('✅ Ürün eklendi:', newProduct.id, newProduct.name);
    res.json({ success: true, data: newProduct });
  } catch (error) {
    console.error('❌ Ürün ekleme hatası:', error.message);
    res.status(500).json({ success: false, error: 'Ürün eklenirken hata oluştu' });
  }
});

app.put("/api/products/:id", rateLimit, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existingProduct = await productQueries.getById(id);
    if (!existingProduct) {
      return res.status(404).json({ success: false, error: 'Ürün bulunamadı' });
    }
    
    const updatedProduct = await productQueries.update(id, {
      ...existingProduct,
      ...req.body,
      price: typeof req.body.price !== 'undefined' ? Number(req.body.price) : existingProduct.price
    });
    
    console.log('✏️ Ürün güncellendi:', id);
    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error('❌ Ürün güncelleme hatası:', error.message);
    res.status(500).json({ success: false, error: 'Ürün güncellenirken hata oluştu' });
  }
});

app.delete("/api/products/:id", rateLimit, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const existingProduct = await productQueries.getById(id);
    if (!existingProduct) {
      return res.status(404).json({ success: false, error: 'Ürün bulunamadı' });
    }
    
    await productQueries.delete(id);
    console.log('🗑️ Ürün silindi:', id);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Ürün silme hatası:', error.message);
    res.status(500).json({ success: false, error: 'Ürün silinirken hata oluştu' });
  }
});

// Get single product by id
app.get("/api/products/:id", rateLimit, async (req, res) => {
  try {
    const rawId = req.params.id;
    const id = parseInt(rawId);
    console.log('🔎 Ürün detayı istek:', rawId, '→', id);
    
    const product = await productQueries.getById(id);
    if (!product) {
      console.log('📚 Ürün bulunamadı:', id);
      return res.status(404).json({ success: false, error: 'Ürün bulunamadı' });
    }
    
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('❌ Ürün detayı hatası:', error.message);
    res.status(500).json({ success: false, error: 'Ürün detayı alınırken hata oluştu' });
  }
});

// Create Stripe checkout session (demo-friendly)
app.post('/api/payments/create-checkout-session', rateLimit, async (req, res) => {
  try {
    const { 
      productId, quantity, successUrl, cancelUrl, 
      product: inlineProduct, name, price, customerInfo 
    } = req.body || {};
    
    let product = null;
    if (productId) {
      const id = parseInt(productId);
      product = await productQueries.getById(id);
    }
    if (!product && inlineProduct && inlineProduct.name && inlineProduct.price) {
      product = { name: inlineProduct.name, price: Number(inlineProduct.price) };
    }
    if (!product && name && typeof price !== 'undefined') {
      product = { name, price: Number(price) };
    }
    if (!product) return res.status(404).json({ success: false, error: 'Ürün bulunamadı' });

    const qty = Math.max(1, parseInt(quantity || 1));
    const totalAmount = product.price * qty;
    const redirectBaseSuccess = successUrl || `${req.headers.origin || 'http://localhost:'+PORT}/odeme-basarili`;
    const redirectBaseCancel = cancelUrl || `${req.headers.origin || 'http://localhost:'+PORT}/odeme-iptal`;

    // Siparişi veritabanına kaydet
    let orderData = null;
    if (customerInfo) {
      try {
        orderData = await orderQueries.create({
          productId: productId ? parseInt(productId) : null,
          productName: product.name,
          productPrice: product.price,
          quantity: qty,
          totalAmount: totalAmount,
          customerName: customerInfo.firstName,
          customerLastName: customerInfo.lastName,
          customerTc: customerInfo.tc,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          customerAddress: customerInfo.address,
          customerCity: customerInfo.city,
          customerDistrict: customerInfo.district,
          customerPostalCode: customerInfo.postalCode,
          stripeSessionId: null
        });
        console.log('✅ Sipariş kaydedildi:', orderData.orderNumber);
      } catch (orderError) {
        console.error('❌ Sipariş kaydetme hatası:', orderError.message);
      }
    }

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      const fakeUrl = `${redirectBaseSuccess}?demo=1&product=${encodeURIComponent(product.name)}&amount=${encodeURIComponent(totalAmount)}&orderNumber=${orderData?.orderNumber || 'DEMO'}`;
      return res.json({ success: true, checkoutUrl: fakeUrl, demo: true, orderNumber: orderData?.orderNumber });
    }

    let stripe;
    try {
      stripe = require('stripe')(secret);
    } catch (e) {
      console.error('Stripe modülü yüklenemedi:', e.message);
      const fakeUrl = `${redirectBaseSuccess}?demo=1&product=${encodeURIComponent(product.name)}&amount=${encodeURIComponent(totalAmount)}&orderNumber=${orderData?.orderNumber || 'DEMO'}`;
      return res.json({ success: true, checkoutUrl: fakeUrl, demo: true, orderNumber: orderData?.orderNumber });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: qty,
          price_data: {
            currency: 'try',
            product_data: { name: product.name },
            unit_amount: Math.max(100, Math.round(Number(product.price) * 100))
          }
        }
      ],
      success_url: redirectBaseSuccess + '?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: redirectBaseCancel
    });

    // Stripe session ID'yi siparişe kaydet
    if (orderData) {
      await orderQueries.updateStatus(orderData.id, null, 'processing');
    }

    return res.json({ 
      success: true, 
      checkoutUrl: session.url, 
      sessionId: session.id,
      orderNumber: orderData?.orderNumber 
    });
  } catch (error) {
    console.error('❌ Ödeme oturumu hatası:', error.message);
    res.status(500).json({ success: false, error: 'Ödeme başlatılırken hata oluştu' });
  }
});

// Orders endpoints for admin
app.get('/api/admin/orders', rateLimit, async (req, res) => {
  try {
    const orders = await orderQueries.getAll();
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('❌ Siparişler listesi hatası:', error.message);
    res.status(500).json({ success: false, error: 'Siparişler listelenirken hata oluştu' });
  }
});

app.put('/api/admin/orders/:id/status', rateLimit, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { orderStatus, paymentStatus } = req.body;
    
    const updatedOrder = await orderQueries.updateStatus(id, orderStatus, paymentStatus);
    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error('❌ Sipariş durumu güncelleme hatası:', error.message);
    res.status(500).json({ success: false, error: 'Sipariş durumu güncellenirken hata oluştu' });
  }
});

// File upload endpoint
app.post('/api/upload', rateLimit, upload.single('image'), (req, res) => {
  try {
    console.log('📤 Dosya yükleme isteği alındı');
    console.log('📁 Request body:', req.body);
    console.log('📁 Request file:', req.file);
    
    if (!req.file) {
      console.log('❌ Dosya bulunamadı');
      return res.status(400).json({ success: false, error: 'Dosya yüklenmedi' });
    }
    
    console.log('✅ Dosya alındı:', req.file.originalname, req.file.size, 'bytes');
    
    const imageUrl = `/uploads/${req.file.filename}`;
    const result = { 
      success: true, 
      data: { 
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: imageUrl,
        size: req.file.size
      }
    };
    
    console.log('✅ Dosya yükleme başarılı:', result);
    res.json(result);
  } catch (error) {
    console.error('❌ Dosya yükleme hatası:', error.message);
    console.error('❌ Hata detayı:', error);
    res.status(500).json({ success: false, error: `Dosya yüklenirken hata oluştu: ${error.message}` });
  }
});

// Site settings endpoints
app.get('/api/admin/settings', rateLimit, (req, res) => {
  return res.json({ success: true, data: siteSettings });
});

app.put('/api/admin/settings', rateLimit, (req, res) => {
  const { siteName, logoUrl } = req.body;
  if (typeof siteName === 'string') siteSettings.siteName = siteName;
  if (typeof logoUrl === 'string') siteSettings.logoUrl = logoUrl;
  return res.json({ success: true, data: siteSettings });
});

// Site ayarları güncelleme endpoint'i
app.put('/api/site-settings/:page', rateLimit, async (req, res) => {
  try {
    const { page } = req.params;
    const updateData = req.body;
    
    if (page === 'home') {
      siteSettings.homePage = { ...siteSettings.homePage, ...updateData };
      // Navbar ve Footer verilerini de güncelle
      if (updateData.navbar) {
        siteSettings.navbar = { ...siteSettings.navbar, ...updateData.navbar };
      }
      if (updateData.footer) {
        siteSettings.footer = { ...siteSettings.footer, ...updateData.footer };
      }
    } else if (page === 'general') {
      siteSettings = { ...siteSettings, ...updateData };
    } else if (page === 'navbar') {
      siteSettings.navbar = { ...siteSettings.navbar, ...updateData };
    } else if (page === 'footer') {
      siteSettings.footer = { ...siteSettings.footer, ...updateData };
    }
    
    console.log(`✅ Site ayarları güncellendi: ${page}`, updateData);
    
    res.json({
      success: true,
      message: 'Site ayarları güncellendi',
      data: siteSettings
    });
  } catch (error) {
    console.error('❌ Site settings update error:', error);
    res.status(500).json({
      success: false,
      error: 'Site ayarları güncellenemedi'
    });
  }
});

// Site ayarları getirme endpoint'i
app.get('/api/site-settings/:page', rateLimit, async (req, res) => {
  try {
    const { page } = req.params;
    
    if (page === 'home') {
      res.json({
        success: true,
        data: siteSettings.homePage
      });
    } else if (page === 'general') {
      res.json({
        success: true,
        data: siteSettings
      });
    } else if (page === 'navbar') {
      res.json({
        success: true,
        data: siteSettings.navbar
      });
    } else if (page === 'footer') {
      res.json({
        success: true,
        data: siteSettings.footer
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Sayfa bulunamadı'
      });
    }
  } catch (error) {
    console.error('❌ Site settings get error:', error);
    res.status(500).json({
      success: false,
      error: 'Site ayarları alınamadı'
    });
  }
});

// Multer error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('❌ Multer hatası:', err);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false, 
        error: 'Dosya boyutu çok büyük. Maksimum 5MB yükleyebilirsiniz.' 
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        success: false, 
        error: 'Çok fazla dosya yüklemeye çalışıyorsunuz.' 
      });
    }
    return res.status(400).json({ 
      success: false, 
      error: `Dosya yükleme hatası: ${err.message}` 
    });
  }
  
  console.error("❌ Unhandled error:", err);
  res.status(500).json({ 
    success: false,
    error: "Sunucu hatası oluştu", 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`❌ 404 - Endpoint bulunamadı: ${req.method} ${req.url}`);
  res.status(404).json({
    error: "Endpoint bulunamadı",
    availableEndpoints: [
      "GET /health",
      "GET /api",
      "GET /api/products",
      "POST /api/products",
      "PUT /api/products/:id",
      "DELETE /api/products/:id",
      "GET /api/admin/settings",
      "PUT /api/admin/settings",
      "GET /api/site-settings/:page",
      "PUT /api/site-settings/:page",
      "PUT /api/admin/user/:id",
      "POST /api/register",
      "POST /api/login"
    ]
  });
});

// Start server
const startServer = async () => {
  try {
    // Veritabanını initialize et
    await initDatabase();
    console.log('✅ Veritabanı hazır');
    
    // Admin kullanıcısını kontrol et ve oluştur
    try {
      const adminUser = await userQueries.getByEmail('admin@birko.com');
      if (!adminUser) {
        await userQueries.create({
          name: 'Admin User',
          email: 'admin@birko.com',
          password: '123456',
          phone: '+90 (555) 000 00 00',
          role: 'admin',
          isApproved: true
        });
        console.log('✅ Admin kullanıcısı oluşturuldu: admin@birko.com / 123456');
      } else {
        console.log('✅ Admin kullanıcısı zaten mevcut');
      }
    } catch (adminError) {
      console.error('❌ Admin oluşturma hatası:', adminError.message);
    }
    
app.listen(PORT, () => {
  console.log(`✅ Backend http://localhost:${PORT} üzerinde çalışıyor`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📈 API endpoint: http://localhost:${PORT}/api`);
  console.log(`📦 Products endpoint: http://localhost:${PORT}/api/products`);
  console.log(`📝 Register endpoint: http://localhost:${PORT}/api/register`);
  console.log(`🔐 Login endpoint: http://localhost:${PORT}/api/login`);
      console.log(`📋 Orders endpoint: http://localhost:${PORT}/api/admin/orders`);
    });
  } catch (error) {
    console.error('❌ Server başlatma hatası:', error.message);
    process.exit(1);
  }
};

startServer();

console.log("🎯 Server başlatma tamamlandı");
