import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiBase = process.env.REACT_APP_API_BASE || '/api';
        const res = await fetch(`${apiBase}/products`);
        const json = await res.json();
        if (json && json.success) {
          setProducts(json.data || []);
        } else if (Array.isArray(json)) {
          setProducts(json);
        } else {
          setProducts([]);
        }
      } catch (e) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { id: 'all', name: 'Tümü' },
    { id: 'Altın', name: 'Altın' },
    { id: 'Gümüş', name: 'Gümüş' },
    { id: 'Pırlanta', name: 'Pırlanta' },
    { id: 'Saat', name: 'Saat' },
    { id: 'Diğer', name: 'Diğer' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesFilter = filter === 'all' || product.category === filter;
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch = !q || product.name.toLowerCase().includes(q) || product.description.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Ürünlerimiz</h1>
          <p className="mt-2 text-gray-600">Kaliteli ve şık tasarımlarımızı keşfedin</p>
        </div>

        {/* Search + Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white shadow-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition ${
                  filter === category.id ? 'bg-yellow-500 text-white shadow' : 'bg-white text-gray-700 border border-gray-200 hover:bg-yellow-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" /></svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Ürün bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">Arama kriterlerinize uygun ürün bulunamadı.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500">
          {filteredProducts.length} ürün bulundu
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
