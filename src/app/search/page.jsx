"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { QRCodeSVG } from "qrcode.react";
const MaterialInfoModal = dynamic(() => import("@/components/MaterialInfoModal"), {
  ssr: false,
});

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [material, setMaterial] = useState(null);
  const [QRCode, setQRCode] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const printRef = useRef();

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

  const handleViewDetail = async (id) => {
    try {
      const res = await fetch(`/api/materialqr/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMaterial(data);
        setShowModal(true);
      } else {
        throw new Error("Không tìm thấy dữ liệu");
      }
    } catch (err) {
      setError(err.message || "Lỗi khi xử lý mã QR");
      setMaterial(null);
      setShowModal(false);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map((item) => item.id));
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch("/files/FW26_Template.xlsx");
      const blob = await res.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      // Lấy headers từ dòng đầu tiên trong template
      const headers = [];
      const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        const cell = worksheet[cellAddress];
        if (cell && typeof cell.v === "string") {
          headers.push(cell.v);
        }
      }

      const exportData = data
        .filter((row) => selectedRows.includes(row.id))
        .map((row) => {
          const rowValues = Object.entries(row)
            .filter(([key]) => key !== "id") // Bỏ cột id
            .map(([_, value]) => value); // Lấy giá trị

          const mappedRow = {};
          headers.forEach((header, index) => {
            if (row.hasOwnProperty(header)) {
              mappedRow[header] = row[header]; // Ưu tiên theo tên
            } else {
              mappedRow[header] = rowValues[index]; // Fallback theo vị trí
            }
          });

          return mappedRow;
        });

      XLSX.utils.sheet_add_json(worksheet, exportData, {
        origin: "A2",
        skipHeader: true,
      });
      // Gắn hậu tố _tamptime vào tên file
      const timestamp = Date.now();
      const filename = `FW26_Export_${timestamp}.xlsx`;
      const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });



      saveAs(new Blob([wbout], { type: "application/octet-stream" }), filename);
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  const columnKeys = data.length > 0 ? Object.keys(data[0]).filter((key) => key !== "id") : [];
  const handlePrint = () => {
    if (!printRef.current) return;

    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=1500,height=900,scrollbars=yes");

    printWindow.document.write(`
    <html>
      <head>
        <style>
          body {
            font-family: sans-serif;
            padding-left: 75px;
          }
          .label-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .label {
            border: 1px solid #000;
            padding: 10px;
            width: 100%;
            height: 200px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            page-break-inside: avoid;
          }
          .qr {
            display: flex;
            justify-content: center;
            align-items: center;
            padding-bottom: 5px;
          }
          table {
            width: 100%;
            font-size: 8px;
            border-collapse: collapse;
          }
          td {
            padding: 2px 4px;
            border: 1px solid #000;
          }
        </style>
      </head>
      <body>
        <div class="label-grid">${printContents}</div>
        <script>
          window.onload = function () {
            window.print();
            window.close();
          }
        </script>
      </body>
    </html>
  `);
    printWindow.document.close();
  };
  return (
    <div className="px-2 py-2">
      <div className="py-2 flex gap-4 items-center">
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          onClick={() => router.push("/")}
        >
          Quay lại
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          onClick={handleExport}
          disabled={selectedRows.length === 0}
        >
          Export Excel
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={handlePrint}
          disabled={selectedRows.length === 0}
        >
          Print
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
                <th className="border border-gray-300 p-2 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="border border-gray-300 p-2 text-left"></th>
                {columnKeys.map((key) => (
                  <th key={key} className="border border-gray-300 p-2 text-left">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id}>
                    <td className="border border-gray-300 p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item.id)}
                        onChange={() => handleSelectRow(item.id)}
                      />
                    </td>
                    <td
                      className="border border-gray-300 p-2 text-blue-500 cursor-pointer hover:underline"
                      onClick={() => handleViewDetail(item.id)}
                    >
                      <div className="flex items-center gap-2 px-2 whitespace-nowrap">
                        <svg viewBox="0 0 30 30" width={25} height={25}>
                          <path d="M25.876 10.926c-2.918 -2.918 -6.799 -4.526 -10.926 -4.526S6.943 8.007 4.024 10.926L0 14.95l4.124 4.124c2.918 2.918 6.799 4.526 10.926 4.526s8.008 -1.607 10.926 -4.526l4.024 -4.024zm-0.617 7.431c-2.727 2.727 -6.353 4.229 -10.209 4.229s-7.482 -1.502 -10.209 -4.229l-3.407 -3.407 3.308 -3.308c2.727 -2.727 6.353 -4.229 10.209 -4.229s7.482 1.502 10.209 4.229l3.407 3.407z" />
                          <path d="M14.986 8.397c-3.632 0 -6.588 2.955 -6.588 6.588s2.955 6.588 6.588 6.588 6.588 -2.955 6.588 -6.588 -2.955 -6.588 -6.588 -6.588m0 4.054c-1.397 0 -2.534 1.137 -2.534 2.534a0.507 0.507 0 0 1 -1.014 0c0 -1.956 1.591 -3.547 3.547 -3.547a0.507 0.507 0 0 1 0 1.014" />
                        </svg>
                        <p className="text-sm">Xem chi tiết</p>
                      </div>
                    </td>
                    {columnKeys.map((key) => (
                      <td
                        key={key}
                        className="border border-gray-300 p-2 max-w-[500px] overflow-hidden whitespace-nowrap text-ellipsis"
                        title={item[key] ?? ""}
                      >
                        {item[key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columnKeys.length + 2} className="text-center p-4">
                    Không có kết quả
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {material && (
        <MaterialInfoModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          data={material}
        />
      )}
      <div ref={printRef} className="hidden print:block">
        <div className="label-grid">
          {data
            .filter((item) => selectedRows.includes(item.id))
            .map((item, index) => (
              <div key={index} className="label">
                <div className="qr">
                  <QRCodeSVG value={String(item.id)} size={80} />
                </div>
                <table >
                  <tbody>
                    <tr><td><strong>Supplier_Name</strong></td><td>{item.Supplier_Name}</td></tr>
                    <tr><td><strong>Material_Name_By_Supplier</strong></td><td>{item.Material_Name_By_Supplier}</td></tr>
                    <tr><td><strong>Ref_num</strong></td><td>{item.Ref_num}</td></tr>
                    <tr><td><strong>Classification</strong></td><td>{item.Classification}</td></tr>
                    <tr><td><strong>APH Library's code</strong></td><td>{item.APH_Library_Code}</td></tr>
                  </tbody>
                </table>
              </div>
            ))}
        </div>
      </div>


    </div >
  );
}
