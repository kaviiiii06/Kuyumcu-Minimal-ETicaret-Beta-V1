import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = () => {
    fetch("http://localhost:5000/api")
      .then((res) => {
        if (!res.ok) throw new Error("API isteği başarısız: " + res.status);
        return res.json();
      })
      .then((result) => setData(result))
      .catch((err) => {
        console.error("API Hatası:", err);
        setError(err.message);
      });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-600 text-xl">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center text-xl">
        ⏳ Yükleniyor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <img
          src="/logo.png"
          alt="Logo"
          className="h-16 w-16 rounded-full shadow-md"
        />
        <h1 className="text-4xl font-extrabold text-yellow-700">
          {data.marka} <span className="text-gray-700">- {data.piyasa}</span>
        </h1>
      </div>

      {/* Tablo */}
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-yellow-600 text-white">
            <tr>
              <th className="p-4">Enstrüman</th>
              <th className="p-4 text-right">Alış</th>
              <th className="p-4 text-right">Satış</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((item, index) => (
              <tr
                key={index}
                className="border-b hover:bg-yellow-50 transition duration-300"
              >
                <td className="p-4 font-medium text-gray-800">{item.name}</td>
                <td className="p-4 text-right text-green-600 font-bold">
                  {item.alis}
                </td>
                <td className="p-4 text-right text-red-600 font-bold">
                  {item.satis}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <p className="mt-6 text-gray-500 text-sm">
        Veriler sistem üzerinden otomatik olarak güncellenmektedir.
      </p>
    </div>
  );
}
