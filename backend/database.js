const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Veritabanı dosyası yolu
const dbPath = path.join(__dirname, 'birko.db');

// Veritabanı bağlantısı
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Veritabanı bağlantı hatası:', err.message);
  } else {
    console.log('✅ SQLite veritabanına bağlandı');
  }
});

// Veritabanı tablolarını oluştur
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Ürünler tablosu
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          category TEXT NOT NULL,
          image TEXT,
          stock INTEGER DEFAULT 0,
          isActive BOOLEAN DEFAULT 1,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Siparişler tablosu
      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          orderNumber TEXT UNIQUE NOT NULL,
          productId INTEGER NOT NULL,
          productName TEXT NOT NULL,
          productPrice REAL NOT NULL,
          quantity INTEGER NOT NULL,
          totalAmount REAL NOT NULL,
          customerName TEXT NOT NULL,
          customerLastName TEXT NOT NULL,
          customerTc TEXT NOT NULL,
          customerEmail TEXT NOT NULL,
          customerPhone TEXT NOT NULL,
          customerAddress TEXT NOT NULL,
          customerCity TEXT NOT NULL,
          customerDistrict TEXT NOT NULL,
          customerPostalCode TEXT,
          paymentStatus TEXT DEFAULT 'pending',
          orderStatus TEXT DEFAULT 'pending',
          stripeSessionId TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (productId) REFERENCES products (id)
        )
      `);

      // Kullanıcılar tablosu (mevcut in-memory sistemi için)
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          phone TEXT,
          role TEXT DEFAULT 'user',
          isApproved BOOLEAN DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Site ayarları tablosu
      db.run(`
        CREATE TABLE IF NOT EXISTS site_settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          settingKey TEXT UNIQUE NOT NULL,
          settingValue TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('❌ Tablo oluşturma hatası:', err.message);
          reject(err);
        } else {
          console.log('✅ Veritabanı tabloları hazır');
          
          // Admin kullanıcısını oluştur (eğer yoksa)
          db.get("SELECT * FROM users WHERE email = 'admin@birko.com'", (err, row) => {
            if (err) {
              console.error('❌ Admin kontrol hatası:', err.message);
            } else if (!row) {
              // Admin kullanıcısı yok, oluştur
              db.run(`
                INSERT INTO users (name, email, password, phone, role, isApproved) 
                VALUES (?, ?, ?, ?, ?, ?)
              `, [
                'Admin User',
                'admin@birko.com',
                '123456',
                '+90 (555) 000 00 00',
                'admin',
                1
              ], function(err) {
                if (err) {
                  console.error('❌ Admin oluşturma hatası:', err.message);
                } else {
                  console.log('✅ Admin kullanıcısı oluşturuldu: admin@birko.com / 123456');
                }
                resolve();
              });
            } else {
              console.log('✅ Admin kullanıcısı zaten mevcut');
              resolve();
            }
          });
        }
      });
    });
  });
};

// Ürün CRUD işlemleri
const productQueries = {
  // Tüm ürünleri getir
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM products WHERE isActive = 1 ORDER BY createdAt DESC", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  // ID'ye göre ürün getir
  getById: (id) => {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM products WHERE id = ? AND isActive = 1", [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // Ürün ekle
  create: (product) => {
    return new Promise((resolve, reject) => {
      const { name, description, price, category, image, stock } = product;
      db.run(
        "INSERT INTO products (name, description, price, category, image, stock) VALUES (?, ?, ?, ?, ?, ?)",
        [name, description, price, category, image, stock || 0],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, ...product });
          }
        }
      );
    });
  },

  // Ürün güncelle
  update: (id, product) => {
    return new Promise((resolve, reject) => {
      const { name, description, price, category, image, stock } = product;
      db.run(
        "UPDATE products SET name = ?, description = ?, price = ?, category = ?, image = ?, stock = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?",
        [name, description, price, category, image, stock || 0, id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, ...product });
          }
        }
      );
    });
  },

  // Ürün sil (soft delete)
  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.run("UPDATE products SET isActive = 0, updatedAt = CURRENT_TIMESTAMP WHERE id = ?", [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, deleted: true });
        }
      });
    });
  }
};

// Sipariş CRUD işlemleri
const orderQueries = {
  // Tüm siparişleri getir
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT o.*, p.name as productName, p.image as productImage 
        FROM orders o 
        LEFT JOIN products p ON o.productId = p.id 
        ORDER BY o.createdAt DESC
      `, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  // ID'ye göre sipariş getir
  getById: (id) => {
    return new Promise((resolve, reject) => {
      db.get(`
        SELECT o.*, p.name as productName, p.image as productImage 
        FROM orders o 
        LEFT JOIN products p ON o.productId = p.id 
        WHERE o.id = ?
      `, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // Sipariş oluştur
  create: (orderData) => {
    return new Promise((resolve, reject) => {
      const orderNumber = 'BRK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
      
      const {
        productId, productName, productPrice, quantity, totalAmount,
        customerName, customerLastName, customerTc, customerEmail, customerPhone,
        customerAddress, customerCity, customerDistrict, customerPostalCode,
        stripeSessionId
      } = orderData;

      db.run(`
        INSERT INTO orders (
          orderNumber, productId, productName, productPrice, quantity, totalAmount,
          customerName, customerLastName, customerTc, customerEmail, customerPhone,
          customerAddress, customerCity, customerDistrict, customerPostalCode,
          stripeSessionId
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        orderNumber, productId, productName, productPrice, quantity, totalAmount,
        customerName, customerLastName, customerTc, customerEmail, customerPhone,
        customerAddress, customerCity, customerDistrict, customerPostalCode,
        stripeSessionId
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, orderNumber, ...orderData });
        }
      });
    });
  },

  // Sipariş durumu güncelle
  updateStatus: (id, orderStatus, paymentStatus) => {
    return new Promise((resolve, reject) => {
      let query = "UPDATE orders SET updatedAt = CURRENT_TIMESTAMP";
      let params = [];
      
      if (orderStatus) {
        query += ", orderStatus = ?";
        params.push(orderStatus);
      }
      
      if (paymentStatus) {
        query += ", paymentStatus = ?";
        params.push(paymentStatus);
      }
      
      query += " WHERE id = ?";
      params.push(id);

      db.run(query, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, orderStatus, paymentStatus });
        }
      });
    });
  }
};

// Kullanıcı CRUD işlemleri
const userQueries = {
  // Tüm kullanıcıları getir
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.all("SELECT id, name, email, role, isApproved, createdAt FROM users ORDER BY createdAt DESC", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  // Email'e göre kullanıcı getir
  getByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // Kullanıcı oluştur
  create: (userData) => {
    return new Promise((resolve, reject) => {
      const { name, email, password, phone, role, isApproved } = userData;
      db.run(
        "INSERT INTO users (name, email, password, phone, role, isApproved) VALUES (?, ?, ?, ?, ?, ?)",
        [name, email, password, phone, role || 'user', isApproved || false],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, name, email, phone, role: role || 'user', isApproved: isApproved || false });
          }
        }
      );
    });
  },

  // Onay bekleyen kullanıcıları getir
  getPending: () => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM users WHERE isApproved = 0 ORDER BY createdAt DESC", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  // Onaylı kullanıcıları getir
  getApproved: () => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM users WHERE isApproved = 1 ORDER BY createdAt DESC", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  // Kullanıcı onayla
  approve: (id) => {
    return new Promise((resolve, reject) => {
      db.run("UPDATE users SET isApproved = 1, updatedAt = CURRENT_TIMESTAMP WHERE id = ?", [id], function(err) {
        if (err) {
          reject(err);
        } else {
          if (this.changes > 0) {
            db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
              if (err) {
                reject(err);
              } else {
                resolve(row);
              }
            });
          } else {
            resolve(null);
          }
        }
      });
    });
  },

  // Kullanıcı reddet (sil)
  reject: (id) => {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          db.run("DELETE FROM users WHERE id = ?", [id], function(err) {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          });
        }
      });
    });
  },

  // Kullanıcı onayla/reddet
  updateApproval: (id, isApproved) => {
    return new Promise((resolve, reject) => {
      db.run("UPDATE users SET isApproved = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?", [isApproved, id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, isApproved });
        }
      });
    });
  },

  // Kullanıcı rolü güncelle
  updateRole: (id, role) => {
    return new Promise((resolve, reject) => {
      db.run("UPDATE users SET role = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?", [role, id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, role });
        }
      });
    });
  }
};

module.exports = {
  db,
  initDatabase,
  productQueries,
  orderQueries,
  userQueries
};
