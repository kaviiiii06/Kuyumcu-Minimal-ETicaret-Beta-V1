import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'approved', 'products', 'orders'
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    fetchPendingUsers();
    fetchApprovedUsers();
    fetchProducts();
    fetchOrders();
  }, [user, navigate]);

    const fetchPendingUsers = async () => {
    try {
      setError(null);
      console.log("📋 Bekleyen kullanıcılar alınıyor...");
      
      const apiBase = process.env.REACT_APP_API_BASE || '/api';
      const res = await fetch(`${apiBase}/admin/pending-users`);
      const result = await res.json();
      
      if (result.success) {
        setPendingUsers(result.users);
      } else {
        setError('Bekleyen kullanıcılar alınırken hata oluştu');
      }
    } catch (error) {
      console.error('Bekleyen kullanıcılar hatası:', error);
      setError('Bekleyen kullanıcılar alınırken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedUsers = async () => {
    try {
      setError(null);
      console.log("📋 Onaylı kullanıcılar alınıyor...");
      
      const apiBase = process.env.REACT_APP_API_BASE || '/api';
      const res = await fetch(`${apiBase}/admin/approved-users`);
      const result = await res.json();
      
      if (result.success) {
        setApprovedUsers(result.users);
      } else {
        setError('Onaylı kullanıcılar alınırken hata oluştu');
      }
    } catch (error) {
      console.error('Onaylı kullanıcılar hatası:', error);
      setError('Onaylı kullanıcılar alınırken hata oluştu');
    }
  };

  const handleApprove = async (userId) => {
    try {
      console.log("✅ Kullanıcı onaylanıyor:", userId);
      
      const apiBase = process.env.REACT_APP_API_BASE || '/api';
      const res = await fetch(`${apiBase}/admin/approve-user/${userId}`, {
        method: 'POST'
      });
      const result = await res.json();
      
      if (result.success) {
        setMessage(`Kullanıcı ${result.user.email} onaylandı`);
        // Her iki listeyi de yenile
        fetchPendingUsers();
        fetchApprovedUsers();
      } else {
        setError(result.error || 'Kullanıcı onaylanırken hata oluştu');
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Kullanıcı onaylama hatası:', error);
      setError('Kullanıcı onaylanırken hata oluştu');
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm('Bu kullanıcıyı reddetmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      console.log("❌ Kullanıcı reddediliyor:", userId);
      
      const apiBase = process.env.REACT_APP_API_BASE || '/api';
      const res = await fetch(`${apiBase}/admin/reject-user/${userId}`, {
        method: 'POST'
      });
      const result = await res.json();
      
      if (result.success) {
        setMessage(`Kullanıcı ${result.user.email} reddedildi`);
        // Her iki listeyi de yenile
        fetchPendingUsers();
        fetchApprovedUsers();
      } else {
        setError(result.error || 'Kullanıcı reddedilirken hata oluştu');
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Kullanıcı reddetme hatası:', error);
      setError('Kullanıcı reddedilirken hata oluştu');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      console.log("🔄 Kullanıcı rolü değiştiriliyor:", userId, newRole);
      
      const apiBase = process.env.REACT_APP_API_BASE || '/api';
      const res = await fetch(`${apiBase}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      
      const result = await res.json();
      
      if (result.success) {
        setMessage(`Kullanıcı ${result.user.email} rolü ${newRole} olarak değiştirildi`);
        fetchApprovedUsers(); // Listeyi yenile
      } else {
        setError(result.error || 'Kullanıcı rolü değiştirilirken hata oluştu');
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Kullanıcı rolü değiştirme hatası:', error);
      setError('Kullanıcı rolü değiştirilirken hata oluştu');
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: 'bg-red-100 text-red-800', text: 'Admin' },
      user: { color: 'bg-blue-100 text-blue-800', text: 'Normal Kullanıcı' },
      bayi: { color: 'bg-green-100 text-green-800', text: 'Bayi' }
    };
    
    const config = roleConfig[role] || roleConfig.user;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  // Product management functions
  const fetchProducts = async () => {
    try {
      const apiBase = process.env.REACT_APP_API_BASE || '/api';
      const res = await fetch(`${apiBase}/products`);
      const json = await res.json();
      if (json && json.success) setProducts(json.data || []);
      else if (Array.isArray(json)) setProducts(json);
      else setProducts([]);
    } catch (e) {
      setProducts([]);
    }
  };

  const fetchOrders = async () => {
    try {
      const apiBase = process.env.REACT_APP_API_BASE || '/api';
      const res = await fetch(`${apiBase}/admin/orders`);
      const json = await res.json();
      if (json && json.success) setOrders(json.data || []);
      else setOrders([]);
    } catch (e) {
      console.error('Siparişler yüklenirken hata:', e);
      setOrders([]);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: '',
      price: '',
      description: '',
      image: ''
    });
    setImageFile(null);
    setImagePreview('');
    setShowProductForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      image: product.image
    });
    setImageFile(null);
    setImagePreview(product.image);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const apiBase = process.env.REACT_APP_API_BASE || '/api';
      await fetch(`${apiBase}/products/${productId}`, { method: 'DELETE' });
      setProducts(products.filter(p => p.id !== productId));
      setMessage('Ürün başarıyla silindi');
      setTimeout(() => setMessage(''), 3000);
    } catch (e) {}
  };

  const handleUpdateOrderStatus = async (orderId, orderStatus, paymentStatus) => {
    try {
      const apiBase = process.env.REACT_APP_API_BASE || '/api';
      const res = await fetch(`${apiBase}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus, paymentStatus })
      });
      
      if (res.ok) {
        setMessage('Sipariş durumu güncellendi');
        setTimeout(() => setMessage(''), 3000);
        fetchOrders(); // Refresh orders
      }
    } catch (e) {
      console.error('Sipariş durumu güncelleme hatası:', e);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      console.log('📤 Görsel yükleniyor:', imageFile.name, imageFile.size, 'bytes');
      
      const apiBase = process.env.REACT_APP_API_BASE || '/api';
      const res = await fetch(`${apiBase}/upload`, {
        method: 'POST',
        body: formData
      });
      
      console.log('📥 Sunucu yanıtı:', res.status, res.statusText);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ HTTP Hatası:', res.status, errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }
      
      const result = await res.json();
      console.log('✅ Yükleme sonucu:', result);
      
      if (result.success) {
        return result.data.url;
      } else {
        throw new Error(result.error || 'Bilinmeyen hata');
      }
    } catch (error) {
      console.error('❌ Görsel yükleme hatası:', error);
      setError(`Görsel yüklenirken hata oluştu: ${error.message}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      let imageUrl = productForm.image;
      
      // Eğer yeni görsel yüklendiyse, önce onu yükle
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          return; // Hata durumunda işlemi durdur
        }
      }
      
      const productData = {
        ...productForm,
        image: imageUrl
      };
      
      const apiBase = process.env.REACT_APP_API_BASE || '/api';
      if (editingProduct) {
        const res = await fetch(`${apiBase}/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        const json = await res.json();
        if (json && json.success) {
          setProducts(products.map(p => p.id === editingProduct.id ? json.data : p));
          setMessage('Ürün başarıyla güncellendi');
        }
      } else {
        const res = await fetch(`${apiBase}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        const json = await res.json();
        if (json && json.success) {
          setProducts([...products, json.data]);
          setMessage('Ürün başarıyla eklendi');
        }
      }
      
      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({ name: '', category: '', price: '', description: '', image: '' });
      setImageFile(null);
      setImagePreview('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Ürün kaydetme hatası:', error);
      setError('Ürün kaydedilirken hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🛠️ Admin Paneli
              </h1>
              <p className="text-gray-600 mt-2">
                Hoş geldiniz, {user?.name} ({user?.email})
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
              >
                Ana Sayfa
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

                 {/* Tab Navigation */}
         <div className="bg-white rounded-lg shadow-md mb-8">
           <div className="border-b border-gray-200">
             <nav className="-mb-px flex space-x-8 px-6">
               <button
                 onClick={() => setActiveTab('pending')}
                 className={`py-4 px-1 border-b-2 font-medium text-sm ${
                   activeTab === 'pending'
                     ? 'border-yellow-500 text-yellow-600'
                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                 }`}
               >
                 📋 Onay Bekleyen ({pendingUsers.length})
               </button>
               <button
                 onClick={() => setActiveTab('approved')}
                 className={`py-4 px-1 border-b-2 font-medium text-sm ${
                   activeTab === 'approved'
                     ? 'border-yellow-500 text-yellow-600'
                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                 }`}
               >
                 ✅ Onaylı Kullanıcılar ({approvedUsers.length})
               </button>
               <button
                 onClick={() => setActiveTab('products')}
                 className={`py-4 px-1 border-b-2 font-medium text-sm ${
                   activeTab === 'products'
                     ? 'border-yellow-500 text-yellow-600'
                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                 }`}
               >
                 📦 Ürün Yönetimi ({products.length})
               </button>
               <button
                 onClick={() => setActiveTab('orders')}
                 className={`py-4 px-1 border-b-2 font-medium text-sm ${
                   activeTab === 'orders'
                     ? 'border-yellow-500 text-yellow-600'
                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                 }`}
               >
                 📋 Siparişler ({orders.length})
               </button>
             </nav>
           </div>
         </div>

         {/* Pending Users Tab */}
         {activeTab === 'pending' && (
           <div className="bg-white rounded-lg shadow-md overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-200">
               <h2 className="text-xl font-semibold text-gray-900">
                 📋 Onay Bekleyen Kullanıcılar ({pendingUsers.length})
               </h2>
               <p className="text-gray-600 mt-1">
                 Yeni kayıt olan kullanıcıları onaylayın veya reddedin
               </p>
             </div>

          {pendingUsers.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📭</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Onay bekleyen kullanıcı yok
              </h3>
              <p className="text-gray-600">
                Şu anda onay bekleyen kullanıcı bulunmuyor.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kullanıcı
                    </th>
                                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Email
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Telefon
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Kayıt Tarihi
                     </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                              <span className="text-yellow-600 text-lg font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user.id}
                            </div>
                          </div>
                        </div>
                      </td>
                                             <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm text-gray-900">{user.email}</div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm text-gray-900">{user.phone}</div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm text-gray-900">{user.createdAt}</div>
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleApprove(user.id)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                          >
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Onayla
                          </button>
                          <button
                            onClick={() => handleReject(user.id)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                          >
                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Reddet
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
                                  )}
           </div>
         )}

         {/* Products Tab */}
         {activeTab === 'products' && (
           <div className="bg-white rounded-lg shadow-md overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-200">
               <div className="flex items-center justify-between">
                 <div>
                   <h2 className="text-xl font-semibold text-gray-900">
                     📦 Ürün Yönetimi ({products.length})
                   </h2>
                   <p className="text-gray-600 mt-1">
                     Ürünleri ekleyin, düzenleyin ve silin
                   </p>
                 </div>
                 <button
                   onClick={handleAddProduct}
                   className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors duration-200"
                 >
                   ➕ Yeni Ürün Ekle
                 </button>
               </div>
             </div>
             
             <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200">
                 <thead className="bg-gray-50">
                   <tr>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Ürün
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Kategori
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Fiyat
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                       Açıklama
                     </th>
                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                       İşlemler
                     </th>
                   </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
                   {products.map((product) => (
                     <tr key={product.id}>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="flex items-center">
                           <img
                             className="h-10 w-10 rounded-full object-cover"
                             src={product.image}
                             alt={product.name}
                           />
                           <div className="ml-4">
                             <div className="text-sm font-medium text-gray-900">
                               {product.name}
                             </div>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                           {product.category}
                         </span>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                         ₺{product.price}
                       </td>
                       <td className="px-6 py-4 text-sm text-gray-900">
                         <div className="max-w-xs truncate">
                           {product.description}
                         </div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                         <div className="flex justify-end space-x-2">
                           <button
                             onClick={() => handleEditProduct(product)}
                             className="text-yellow-600 hover:text-yellow-900"
                           >
                             ✏️ Düzenle
                           </button>
                           <button
                             onClick={() => handleDeleteProduct(product.id)}
                             className="text-red-600 hover:text-red-900"
                           >
                             🗑️ Sil
                           </button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
         )}

         {/* Approved Users Tab */}
         {activeTab === 'approved' && (
           <div className="bg-white rounded-lg shadow-md overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-200">
               <h2 className="text-xl font-semibold text-gray-900">
                 ✅ Onaylı Kullanıcılar ({approvedUsers.length})
               </h2>
               <p className="text-gray-600 mt-1">
                 Onaylı kullanıcıların rollerini yönetin
               </p>
             </div>

             {approvedUsers.length === 0 ? (
               <div className="p-8 text-center">
                 <div className="text-gray-400 text-6xl mb-4">👥</div>
                 <h3 className="text-lg font-medium text-gray-900 mb-2">
                   Onaylı kullanıcı yok
                 </h3>
                 <p className="text-gray-600">
                   Şu anda onaylı kullanıcı bulunmuyor.
                 </p>
               </div>
             ) : (
               <div className="overflow-x-auto">
                 <table className="w-full">
                   <thead className="bg-gray-50">
                     <tr>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Kullanıcı
                       </th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Email
                       </th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Telefon
                       </th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Mevcut Rol
                       </th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Kayıt Tarihi
                       </th>
                       <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                         İşlemler
                       </th>
                     </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
                     {approvedUsers.map((user) => (
                       <tr key={user.id} className="hover:bg-gray-50">
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div className="flex items-center">
                             <div className="flex-shrink-0 h-10 w-10">
                               <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                 <span className="text-green-600 text-lg font-medium">
                                   {user.name.charAt(0).toUpperCase()}
                                 </span>
                               </div>
                             </div>
                             <div className="ml-4">
                               <div className="text-sm font-medium text-gray-900">
                                 {user.name}
                               </div>
                               <div className="text-sm text-gray-500">
                                 ID: {user.id}
                               </div>
                             </div>
                           </div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div className="text-sm text-gray-900">{user.email}</div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div className="text-sm text-gray-900">{user.phone}</div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           {getRoleBadge(user.role)}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div className="text-sm text-gray-900">{user.createdAt}</div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                           <div className="flex justify-end space-x-2">
                             <select
                               value={user.role}
                               onChange={(e) => handleRoleChange(user.id, e.target.value)}
                               className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                             >
                               <option value="user">Normal Kullanıcı</option>
                               <option value="bayi">Bayi</option>
                               <option value="admin">Admin</option>
                             </select>
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             )}
           </div>
         )}

         {/* Orders Tab */}
         {activeTab === 'orders' && (
           <div className="bg-white rounded-lg shadow-md overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-200">
               <h2 className="text-xl font-semibold text-gray-900">
                 📋 Siparişler ({orders.length})
               </h2>
               <p className="text-gray-600 mt-1">
                 Gelen siparişleri yönetin ve durumlarını güncelleyin
               </p>
             </div>

             {orders.length === 0 ? (
               <div className="p-8 text-center">
                 <div className="text-gray-400 text-6xl mb-4">📋</div>
                 <h3 className="text-lg font-medium text-gray-900 mb-2">
                   Henüz sipariş yok
                 </h3>
                 <p className="text-gray-600">
                   Müşteriler sipariş verdiğinde burada görünecek.
                 </p>
               </div>
             ) : (
               <div className="overflow-x-auto">
                 <table className="w-full">
                   <thead className="bg-gray-50">
                     <tr>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Sipariş No
                       </th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Müşteri
                       </th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Ürün
                       </th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Miktar
                       </th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Tutar
                       </th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Ödeme Durumu
                       </th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Sipariş Durumu
                       </th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Tarih
                       </th>
                       <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                         İşlemler
                       </th>
                     </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
                     {orders.map((order) => (
                       <tr key={order.id} className="hover:bg-gray-50">
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div className="text-sm font-medium text-gray-900">
                             {order.orderNumber}
                           </div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div>
                             <div className="text-sm font-medium text-gray-900">
                               {order.customerName} {order.customerLastName}
                             </div>
                             <div className="text-sm text-gray-500">
                               {order.customerEmail}
                             </div>
                             <div className="text-sm text-gray-500">
                               {order.customerPhone}
                             </div>
                           </div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div className="text-sm text-gray-900">
                             {order.productName}
                           </div>
                           <div className="text-sm text-gray-500">
                             ₺{order.productPrice}
                           </div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div className="text-sm text-gray-900">
                             {order.quantity}
                           </div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div className="text-sm font-medium text-gray-900">
                             ₺{order.totalAmount.toLocaleString('tr-TR')}
                           </div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                             order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                             order.paymentStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                             'bg-red-100 text-red-800'
                           }`}>
                             {order.paymentStatus === 'completed' ? '✅ Tamamlandı' :
                              order.paymentStatus === 'processing' ? '⏳ İşleniyor' :
                              '❌ Bekliyor'}
                           </span>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                             order.orderStatus === 'completed' ? 'bg-green-100 text-green-800' :
                             order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                             order.orderStatus === 'shipped' ? 'bg-purple-100 text-purple-800' :
                             'bg-gray-100 text-gray-800'
                           }`}>
                             {order.orderStatus === 'completed' ? '✅ Tamamlandı' :
                              order.orderStatus === 'processing' ? '⚙️ İşleniyor' :
                              order.orderStatus === 'shipped' ? '🚚 Kargoda' :
                              '⏳ Bekliyor'}
                           </span>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div className="text-sm text-gray-900">
                             {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                           </div>
                           <div className="text-sm text-gray-500">
                             {new Date(order.createdAt).toLocaleTimeString('tr-TR')}
                           </div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                           <div className="flex flex-col space-y-1">
                             <select
                               value={order.paymentStatus}
                               onChange={(e) => handleUpdateOrderStatus(order.id, null, e.target.value)}
                               className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-yellow-500"
                             >
                               <option value="pending">Ödeme Bekliyor</option>
                               <option value="processing">İşleniyor</option>
                               <option value="completed">Tamamlandı</option>
                             </select>
                             <select
                               value={order.orderStatus}
                               onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value, null)}
                               className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-yellow-500"
                             >
                               <option value="pending">Sipariş Bekliyor</option>
                               <option value="processing">İşleniyor</option>
                               <option value="shipped">Kargoda</option>
                               <option value="completed">Tamamlandı</option>
                             </select>
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             )}
           </div>
         )}

                 {/* Admin Info Cards */}
         <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="bg-white p-6 rounded-lg shadow-md">
             <div className="flex items-center">
               <div className="flex-shrink-0">
                 <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                   <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                   </svg>
                 </div>
               </div>
               <div className="ml-4">
                 <h3 className="text-lg font-medium text-gray-900">Bekleyen Kullanıcılar</h3>
                 <p className="text-sm text-gray-500">{pendingUsers.length} kullanıcı onay bekliyor</p>
               </div>
             </div>
           </div>

                     <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Onaylı Kullanıcılar</h3>
                <p className="text-sm text-gray-500">{approvedUsers.length} kullanıcı onaylandı</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Toplam Ürün</h3>
                <p className="text-sm text-gray-500">{products.length} ürün mevcut</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Toplam Sipariş</h3>
                <p className="text-sm text-gray-500">{orders.length} sipariş alındı</p>
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
                <h3 className="text-lg font-medium text-gray-900">Son Güncelleme</h3>
                <p className="text-sm text-gray-500">{new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Form Modal */}
        {showProductForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingProduct ? '✏️ Ürün Düzenle' : '➕ Yeni Ürün Ekle'}
                </h3>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ürün Adı
                    </label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Kategori
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      required
                    >
                      <option value="">Kategori Seçin</option>
                      <option value="Altın">Altın</option>
                      <option value="Gümüş">Gümüş</option>
                      <option value="Pırlanta">Pırlanta</option>
                      <option value="Saat">Saat</option>
                      <option value="Diğer">Diğer</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Fiyat (₺)
                    </label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Açıklama
                    </label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      rows="3"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ürün Görseli
                    </label>
                    
                    {/* Görsel Önizleme */}
                    {imagePreview && (
                      <div className="mt-2 mb-3">
                        <img 
                          src={imagePreview} 
                          alt="Önizleme" 
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                    
                    {/* Dosya Yükleme */}
                    <div className="mt-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG, GIF, WebP (Max: 5MB)
                      </p>
                    </div>
                    
                    {/* URL ile Görsel Ekleme (Alternatif) */}
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Veya Görsel URL'si
                      </label>
                      <input
                        type="text"
                        value={productForm.image}
                        onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowProductForm(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 transition-colors duration-200"
                    >
                      {uploading ? 'Yükleniyor...' : (editingProduct ? 'Güncelle' : 'Ekle')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
