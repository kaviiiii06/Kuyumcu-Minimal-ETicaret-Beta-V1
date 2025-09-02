import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const PageEditor = ({ 
  isOpen, 
  onClose, 
  pageData, 
  onSave, 
  title = "Sayfa Düzenle" 
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  // Sadece admin kullanıcıları düzenleyebilir
  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    if (pageData) {
      setFormData(pageData);
    }
  }, [pageData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setFormData(prev => ({
          ...prev,
          image: result.imageUrl
        }));
      } else {
        throw new Error('Görsel yüklenemedi');
      }
    } catch (error) {
      setError('Görsel yüklenirken hata oluştu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    setLoading(true);
    setError('');

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      setError('Kaydetme sırasında hata oluştu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !isAdmin) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tab Navigation */}
          {pageData.navbar || pageData.footer ? (
            <div className="border-b border-gray-200 mb-4">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'general'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Genel
                </button>
                {pageData.navbar && (
                  <button
                    onClick={() => setActiveTab('navbar')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'navbar'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Üst Menü
                  </button>
                )}
                {pageData.footer && (
                  <button
                    onClick={() => setActiveTab('footer')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'footer'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Alt Bilgi
                  </button>
                )}
              </nav>
            </div>
          ) : null}

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Genel Tab */}
            {activeTab === 'general' && (
              <>
                {/* Başlık */}
                {formData.title !== undefined && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sayfa Başlığı
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Sayfa başlığı"
                    />
                  </div>
                )}

            {/* Alt Başlık */}
            {formData.subtitle !== undefined && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Başlık
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Alt başlık"
                />
              </div>
            )}

            {/* Açıklama */}
            {formData.description !== undefined && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Sayfa açıklaması"
                />
              </div>
            )}

            {/* Logo/Resim */}
            {formData.image !== undefined && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo/Resim
                </label>
                <div className="flex items-center space-x-4">
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Mevcut resim"
                      className="w-20 h-20 object-cover rounded border"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, JPEG (max 5MB)
                </p>
              </div>
            )}

            {/* Özel Alanlar */}
            {formData.customFields && Object.keys(formData.customFields).map(field => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  name={`customFields.${field}`}
                  value={formData.customFields[field] || ''}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      customFields: {
                        ...prev.customFields,
                        [field]: e.target.value
                      }
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={field}
                />
              </div>
            ))}
              </>
            )}

            {/* Navbar Tab */}
            {activeTab === 'navbar' && formData.navbar && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo Metni
                  </label>
                  <input
                    type="text"
                    name="navbar.logoText"
                    value={formData.navbar.logoText || ''}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        navbar: {
                          ...prev.navbar,
                          logoText: e.target.value
                        }
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Logo metni"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo Resmi
                  </label>
                  <div className="flex items-center space-x-4">
                    {formData.navbar.logoImage && (
                      <img
                        src={formData.navbar.logoImage}
                        alt="Logo"
                        className="w-20 h-20 object-cover rounded border"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleImageUpload(e).then(() => {
                            setFormData(prev => ({
                              ...prev,
                              navbar: {
                                ...prev.navbar,
                                logoImage: URL.createObjectURL(file)
                              }
                            }));
                          });
                        }
                      }}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Menü Öğeleri
                  </label>
                  {formData.navbar.menuItems && formData.navbar.menuItems.map((item, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={item.text || ''}
                        onChange={(e) => {
                          const newMenuItems = [...formData.navbar.menuItems];
                          newMenuItems[index] = { ...item, text: e.target.value };
                          setFormData(prev => ({
                            ...prev,
                            navbar: {
                              ...prev.navbar,
                              menuItems: newMenuItems
                            }
                          }));
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Menü metni"
                      />
                      <input
                        type="text"
                        value={item.link || ''}
                        onChange={(e) => {
                          const newMenuItems = [...formData.navbar.menuItems];
                          newMenuItems[index] = { ...item, link: e.target.value };
                          setFormData(prev => ({
                            ...prev,
                            navbar: {
                              ...prev.navbar,
                              menuItems: newMenuItems
                            }
                          }));
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Link"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Footer Tab */}
            {activeTab === 'footer' && formData.footer && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Şirket Adı
                  </label>
                  <input
                    type="text"
                    name="footer.companyName"
                    value={formData.footer.companyName || ''}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        footer: {
                          ...prev.footer,
                          companyName: e.target.value
                        }
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Şirket adı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    name="footer.description"
                    value={formData.footer.description || ''}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        footer: {
                          ...prev.footer,
                          description: e.target.value
                        }
                      }));
                    }}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Footer açıklaması"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo Resmi
                  </label>
                  <div className="flex items-center space-x-4">
                    {formData.footer.logoImage && (
                      <img
                        src={formData.footer.logoImage}
                        alt="Footer Logo"
                        className="w-20 h-20 object-cover rounded border"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleImageUpload(e).then(() => {
                            setFormData(prev => ({
                              ...prev,
                              footer: {
                                ...prev.footer,
                                logoImage: URL.createObjectURL(file)
                              }
                            }));
                          });
                        }
                      }}
                      className="flex-1"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Butonlar */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
              >
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PageEditor;
