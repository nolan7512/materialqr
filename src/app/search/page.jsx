"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { QRCodeSVG } from "qrcode.react";
import moment from "moment-timezone";
const MaterialInfoModal = dynamic(() => import("@/components/MaterialInfoModal"), {
  ssr: false,
});
const MaterialEditModal = dynamic(() => import("@/components/MaterialEditModal"), { ssr: false });

const formatToVNDateTime = (dateStr) => {
  return moment.utc(dateStr).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");
};
const datetimeFields = [
  "DateChanged_Material",
  "DateChanged_MaterialSupplier",
  "DateCreated_Material",
  "DateCreated_MaterialSupplier"
];

const columnTable = [
  "Material_Name",
  "Supplier_Name",
  "Supplier_Material_Name",
  "Material_Name_By_Supplier",
  "Ref_num",
  "Classification",
  "APH_Library_Code",
  "Season"
]

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
  const [editMaterial, setEditMaterial] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();
  const printRef = useRef();
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            item.Ref_num?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, data]);
  const handleEdit = async (id) => {
    try {
      const res = await fetch(`/api/materialqr/${id}`);
      if (!res.ok) throw new Error("Không tìm thấy dữ liệu");
      const data = await res.json();
      setEditMaterial(data);
      setShowEditModal(true);
    } catch (err) {
      setError(err.message);
    }
  };
  const handleSaveEdit = async (updatedData) => {
    try {
      const res = await fetch(`/api/materialqr/${updatedData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Cập nhật thất bại");

      const updated = await res.json();
      setData((prev) => prev.map((item) => item.id === updated.id ? updated : item));
      setFilteredData((prev) => prev.map((item) => item.id === updated.id ? updated : item));
    } catch (err) {
      alert("Cập nhật thất bại: " + err.message);
    }
  };


  const handleViewDetail = (id) => {
    const material = data.find(d => d.id === id);
    setSelectedMaterial(material);
    setIsModalOpen(true);

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
          const entries = Object.entries(row).filter(([key]) => key !== "id");
          const rowValues = entries.map(([_, value]) => value);

          const mappedRow = {};
          headers.forEach((header, index) => {
            const [matchedKey, matchedValue] = entries.find(([key]) => key === header) || [];

            // if (matchedKey && datetimeFields.includes(matchedKey) && matchedValue) {
            //   mappedRow[header] = formatToVNDateTime(matchedValue);
            // } else if (matchedKey) {
            //   mappedRow[header] = matchedValue;
            // } else {
            //   // Không match key thì dùng theo vị trí
            //   const value = rowValues[index];
            //   if (datetimeFields.includes(entries[index]?.[0]) && value) {
            //     mappedRow[header] = formatToVNDateTime(value);
            //   } else {
            //     mappedRow[header] = value ?? ""; // fallback
            //   }
            // }
            if (matchedKey) {
              mappedRow[header] = matchedValue;
            }
            else {
              // Không match key thì dùng theo vị trí
              const value = rowValues[index];
              mappedRow[header] = value ?? ""; // fallback
            }
          });
          return mappedRow;
        });

      XLSX.utils.sheet_add_json(worksheet, exportData, {
        origin: "A2",
        skipHeader: true,
        cellText: false,
        cellDates: false,
      });


      // Set định dạng Text cho các ô dữ liệu
      for (let r = 0; r < exportData.length; r++) {
        for (let c = 0; c < headers.length; c++) {
          const cellRef = XLSX.utils.encode_cell({ r: r + 1, c }); // +1 vì header ở hàng 0
          const cell = worksheet[cellRef];
          if (cell) {
            cell.t = "s";    // Kiểu string
            cell.z = "@";    // Format là text
          }
        }
      }
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
            padding-top: 20px;
            padding-bottom: 20px;
            padding-left: 20px;
            padding-right: 20px;
          }
          .label-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .label {        
            border: 1px solid #000;
            padding: 15px;
            width: 100%;
            height: 190px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            page-break-inside: avoid;
            break-inside: avoid;
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
    <div className="px-2 py-2  ">
      <div className="py-2 flex gap-4 items-center">
        <button
          className="bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover-bg)] px-4 py-2 rounded "
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
        placeholder="Tìm kiếm Ref_num..."
        className="mb-4 px-3 py-2 border rounded w-full max-w-lg"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className=" mt-4 overflow-x-auto overflow-y-auto max-h-[55vh]">
          <table className="min-w-max border-separate border-spacing-0 w-full">
            <thead className="text-[var(--font-color)] sticky top-0 z-10">
              <tr>
                <th className="border border-[var(--border-color)] bg-[var(--background)]  px-2 py-1 text-left  whitespace-nowrap min-w-[150px] ">
                  <div className="flex items-center justify-center">
                    <input                    
                      type="checkbox"
                      checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                      onChange={handleSelectAll}
                    />
                  </div>

                </th>
                <th className="border border-[var(--border-color)] bg-[var(--background)]  px-2 py-1 text-left  whitespace-nowrap min-w-[150px]">
                  <div className="flex items-center justify-center gap-2  ">
                    <svg
                      fill="currentColor"
                      width="25px"
                      height="25px"
                      viewBox="0 0 1.95 1.95"
                    >
                      <g>
                        <g>
                          <path d="M1.417 1.117 1.11 1.012c-0.022 -0.007 -0.041 -0.03 -0.041 -0.056V0.547c0 -0.064 -0.052 -0.112 -0.116 -0.112h-0.011c-0.064 0 -0.116 0.052 -0.116 0.112v0.806c0 0.068 -0.086 0.098 -0.124 0.037l-0.079 -0.165c-0.041 -0.071 -0.135 -0.09 -0.203 -0.041l-0.049 0.037 0.259 0.611c0.011 0.026 0.037 0.041 0.068 0.041h0.679c0.034 0 0.06 -0.022 0.068 -0.052l0.12 -0.427c0.03 -0.12 -0.037 -0.236 -0.146 -0.278" />
                        </g>
                        <g>
                          <path d="M0.645 0.862v-0.322c0.007 -0.154 0.131 -0.278 0.285 -0.285h0.03c0.154 0.007 0.278 0.131 0.285 0.285V0.862c0 0.026 0.034 0.037 0.052 0.022 0.083 -0.086 0.131 -0.203 0.131 -0.326 0 -0.278 -0.24 -0.502 -0.525 -0.476 -0.217 0.022 -0.397 0.188 -0.431 0.401 -0.022 0.15 0.022 0.296 0.124 0.401 0.015 0.015 0.049 0.004 0.049 -0.022" />
                        </g>
                      </g>
                    </svg>
                  </div>

                </th>
                {columnTable.map((key) => (
                  <th key={key} className="border border-[var(--border-color)] bg-[var(--background)]  px-2 py-1 text-left  whitespace-nowrap min-w-[150px]">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id}>
                    <td className="border border-[var(--border-color)] p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item.id)}
                        onChange={() => handleSelectRow(item.id)}
                      />
                    </td>
                    <td
                      className="border border-[var(--border-color)] p-2 text-blue-500 "
                    >
                      <div className="flex items-center gap-2 ">
                        <button className="hover:underline text-sm flex items-center gap-1" onClick={() => handleViewDetail(item.id)}>
                          <svg fill="currentColor" viewBox="0 0 30 30" width={25} height={25}>
                            <path d="M25.876 10.926c-2.918 -2.918 -6.799 -4.526 -10.926 -4.526S6.943 8.007 4.024 10.926L0 14.95l4.124 4.124c2.918 2.918 6.799 4.526 10.926 4.526s8.008 -1.607 10.926 -4.526l4.024 -4.024zm-0.617 7.431c-2.727 2.727 -6.353 4.229 -10.209 4.229s-7.482 -1.502 -10.209 -4.229l-3.407 -3.407 3.308 -3.308c2.727 -2.727 6.353 -4.229 10.209 -4.229s7.482 1.502 10.209 4.229l3.407 3.407z" />
                            <path d="M14.986 8.397c-3.632 0 -6.588 2.955 -6.588 6.588s2.955 6.588 6.588 6.588 6.588 -2.955 6.588 -6.588 -2.955 -6.588 -6.588 -6.588m0 4.054c-1.397 0 -2.534 1.137 -2.534 2.534a0.507 0.507 0 0 1 -1.014 0c0 -1.956 1.591 -3.547 3.547 -3.547a0.507 0.507 0 0 1 0 1.014" />
                          </svg>
                          <p className="text-sm text-nowrap">Xem chi tiết</p>
                        </button>
                        {/* Đường chia */}
                        <div className="h-6 w-px bg-gray-300" />
                        {/* Nút chỉnh sửa */}
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="text-green-600 hover:underline text-sm flex items-center gap-1"
                        >
                          ✎
                          <span>Sửa</span>
                        </button>
                      </div>
                    </td>
                    {columnTable.map((key) => (
                      <td
                        key={key}
                        className="border border-[var(--border-color)] p-2 max-w-[500px] overflow-hidden whitespace-nowrap text-ellipsis"
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

      {selectedMaterial && (
        <MaterialInfoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={selectedMaterial}
        />
      )}

      {showEditModal && editMaterial && (
        <MaterialEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          data={editMaterial}
          onSave={handleSaveEdit}
        />
      )}

      <div ref={printRef} className="hidden print:block">
        {data
          .filter((item) => selectedRows.includes(item.id))
          .map((item, index) => (
            <div key={index} className="label">
              <div className="qr">
                <QRCodeSVG value={String(item.id)} size={60} />
              </div>
              <table >
                <tbody>
                  <tr><td><strong>Season</strong></td><td>{item.Season}</td></tr>
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


    </div >
  );
}
