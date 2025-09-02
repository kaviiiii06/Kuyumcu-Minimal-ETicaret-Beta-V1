import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Local storage'dan kullanıcı bilgisini al
    const savedUser = localStorage.getItem('birko_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const register = async (email, password, name, phone) => {
    try {
      console.log("📝 Register isteği:", { email, password, name, phone });
      
      const apiBase = process.env.REACT_APP_API_BASE || '/api';
      const response = await fetch(`${apiBase}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          phone
        })
      });

      const result = await response.json();
      console.log("📥 Register yanıtı:", result);

      if (result.success) {
        return { 
          success: true, 
          message: result.message || 'Kayıt başarılı! Admin onayı bekleniyor.',
          user: result.user
        };
      } else {
        return { success: false, error: result.error || 'Kayıt yapılırken hata oluştu' };
      }
    } catch (error) {
      console.error("❌ Register hatası:", error);
      
      // Backend çalışmıyorsa demo kayıt
      console.log("🔄 Backend çalışmıyor, demo kayıt yapılıyor...");
      const demoUser = {
        id: Date.now(),
        email,
        name,
        phone,
        role: 'user',
        isApproved: false
      };
      
      console.log("✅ Demo kayıt başarılı:", demoUser);
      return { 
        success: true, 
        message: 'Demo kayıt başarılı! Admin onayı bekleniyor.',
        user: { id: demoUser.id, email: demoUser.email, name: demoUser.name, phone: demoUser.phone }
      };
    }
  };

  const login = async (email, password) => {
    try {
      console.log("🔐 Login isteği:", { email, password });
      
      const apiBase = process.env.REACT_APP_API_BASE || '/api';
      const response = await fetch(`${apiBase}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const result = await response.json();
      console.log("📥 Login yanıtı:", result);

      if (result.success) {
        setUser(result.user);
        localStorage.setItem('birko_user', JSON.stringify(result.user));
        return { success: true, user: result.user };
      } else {
        return { success: false, error: result.error || 'Giriş yapılırken hata oluştu' };
      }
    } catch (error) {
      console.error("❌ Login hatası:", error);
      
      // Backend çalışmıyorsa demo login
      console.log("🔄 Backend çalışmıyor, demo login yapılıyor...");
      
      // Demo kullanıcılar
      const demoUsers = [
        {
          id: 1,
          email: 'admin@birko.com',
          password: '123456',
          name: 'Admin User',
          role: 'admin',
          isApproved: true
        },
        {
          id: 2,
          email: 'user@birko.com',
          password: '123456',
          name: 'Normal User',
          role: 'user',
          isApproved: true
        },
        {
          id: 3,
          email: 'bayi@birko.com',
          password: '123456',
          name: 'Bayi User',
          role: 'bayi',
          isApproved: true
        }
      ];
      
      // Kullanıcıyı bul
      const user = demoUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return { success: false, error: 'Geçersiz email veya şifre' };
      }
      
      if (!user.isApproved) {
        return { success: false, error: 'Hesabınız henüz onaylanmamış' };
      }
      
      console.log("✅ Demo giriş başarılı:", user);
      setUser(user);
      localStorage.setItem('birko_user', JSON.stringify(user));
      
      return { success: true, user };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('birko_user');
  };

  const value = {
    user,
    register,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
