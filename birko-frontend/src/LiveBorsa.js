import React, { useEffect, useState } from "react";

function LiveBorsa() {
  const [prices, setPrices] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/prices");
        const data = await response.json();
        setPrices(data);
        setLastUpdate(new Date().toLocaleString('tr-TR', { 
          timeZone: 'Europe/Istanbul',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }));
      } catch (error) {
        console.error("Veriler alınamadı:", error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 10000); // 10 sn'de bir güncelle
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        💎 Birko Kuyumculuk - B.Piyasa Canlı Veriler
      </h1>
      <table className="w-full border-collapse border border-gray-400 shadow-md">
        <thead>
          <tr className="bg-yellow-300">
            <th className="border border-gray-400 px-4 py-2">Ürün</th>
            <th className="border border-gray-400 px-4 py-2">Değişim</th>
            <th className="border border-gray-400 px-4 py-2">Alış</th>
            <th className="border border-gray-400 px-4 py-2">Satış</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((item, index) => (
            <tr key={index} className="text-center hover:bg-yellow-100">
              <td className="border border-gray-400 px-4 py-2">{item.name}</td>
              <td className="border border-gray-400 px-4 py-2">{item.change}</td>
              <td className="border border-gray-400 px-4 py-2">{item.alis}</td>
              <td className="border border-gray-400 px-4 py-2">{item.satis}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {lastUpdate && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Son güncelleme: {lastUpdate}
        </div>
      )}
    </div>
  );
}

export default LiveBorsa;
