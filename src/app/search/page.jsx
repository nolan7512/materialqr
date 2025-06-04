"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // Lấy data từ API khi component mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch("/api/materialqr");
        if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu");
        const json = await res.json();
        setData(json);
        setFilteredData(json);
      } catch (error) {
        console.error(error);
        setData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter data khi searchTerm thay đổi
  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter(
          (item) =>
            item.Material_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.Ref_num?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, data]);

  return (
    <div>
      <div className="py-2">
        <button
          className="flex bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 items-center gap-2 "
          onClick={() => router.back()}
        >
          Quay lại
        </button>
      </div>

      <input
        type="text"
        placeholder="Tìm kiếm Material hoặc Supplier..."
        className="mb-4 px-3 py-2 border rounded w-full max-w-lg"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="overflow-auto max-h-[70vh]">
          <table className="min-w-[1000px] border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left">ID</th>
                <th className="border border-gray-300 p-2 text-left">Material Name</th>
                <th className="border border-gray-300 p-2 text-left">Supplier Name</th>
                <th className="border border-gray-300 p-2 text-left">Supplier Material Name</th>
                <th className="border border-gray-300 p-2 text-left">Material Name By Supplier</th>
                <th className="border border-gray-300 p-2 text-left">Ref Num</th>

              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id}>
                    <td className="border border-gray-300 p-2">{item.id}</td>
                    <td className="border border-gray-300 p-2">{item.Material_Name}</td>
                    <td className="border border-gray-300 p-2">{item.Supplier_Name}</td>
                    <td className="border border-gray-300 p-2">{item.Supplier_Material_Name}</td>
                    <td className="border border-gray-300 p-2">{item.Material_Name_By_Supplier}</td>
                    <td className="border border-gray-300 p-2">{item.Ref_num}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    Không có kết quả
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
