"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
const tableFields = [
  "id", "Material_Name", "Supplier_Name", "Supplier_Material_Name", "Material_Name_By_Supplier",
  "Ref_num", "Concept_Brief_ID", "MtlSupp_Lifecycle_State", "Mtl_Lifecycle_State", "Abrasion",
  "AnimalType", "Skin_Size", "QC_percent", "Apperance", "Backside_Coating_Composition",
  "Backside_Coating_Technology", "Benchmark_Supplier", "Branding_General", "Business_Requestor",
  "Caution_Code", "Chemical", "Classification", "Coating", "Coating_Layer_1_Composition",
  "Coating_Layer_1_Location", "Coating_Layer_1_Technology", "Coating_Layer_2_Composition",
  "Coating_Layer_2_Location", "Coating_Layer_2_Technology", "Coating_Thickness", "Color_Approval_Required",
  "Comparison_Price", "Comparison_UoM_Classification", "Composition", "Composition_Lace_Tip",
  "Construction", "Construction_Lace", "Construction_Lace_Tip", "Country", "CrustID", "Currency",
  "Customs_Remark", "DateChanged_Material", "DateChanged_MaterialSupplier", "DateCreated_Material",
  "DateCreated_MaterialSupplier", "Density_g_per_cm3", "Density_Warp", "Density_Weft",
  "Developer_FirstName", "Developer_LastName", "Developer_Location", "Development_Type",
  "Dyeing_Process", "Effects", "Emboss", "End_Season", "EPM_Rating", "Exclusive_To", "Execution",
  "Family_ID", "Fiber_Content_Percentage", "Fiber_Type", "Finishing_Lace", "Finishing_Lace_Tip",
  "First_Comment", "First_Quote_Price", "First_Season", "Flexual_Modulus", "Friends_ID", "Gauge",
  "Hardness", "Laboratory", "Lace_Composition", "Layer_1_Weight", "LAYERS", "Leadtime", "Speed_Leadtime",
  "Leather_Type", "Local_Sourcing_Allowed", "Management_Model", "Marking", "Material_Remarks",
  "Material_Type_Level_1", "Material_Type_Level_2", "Material_Type_Level_3", "Metric_Number",
  "Min_Qty_Color", "Min_Qty_Sample", "Model_Numbers", "Molecular_Structure", "Oil_Content",
  "Originating_Group", "Out_Dim_Width", "Parent_ID", "PR_Type", "Prod_Location", "Production_Location",
  "Technical_Function", "Real_T2_Supplier", "Reason_For_Friendship", "Reason_For_Uniqueness",
  "Requestor_FirstName", "Requestor_LastName", "RP", "Sample_Leadtime", "Softness", "Softness_Ring",
  "Standard_Price", "Stretch_A_In_Percent", "Stretch_B_In_Percent", "Supplier_Material_ID",
  "Supplier_Remark", "Supplier_UoM", "Tannage_Type", "Technology", "Technology_Lace", "Technology_Lace_Tip",
  "Terms_of_Delivery", "Testing_Group", "Testing_Group_ID", "Textile_pattern_shape", "Thickness_in_mm",
  "Thickness_tolerance", "Toolboxes", "Total_Thickness", "Total_Weight", "Treatment",
  "User_Last_Changed_Material", "VENDOR_CD", "Virtual_Reference_ID", "Weight_UoM", "Width", "Width_UoM",
  "VR", "Reference_Material", "Discontinued", "Discontinued_Remark", "Vegan", "Pre_Coloration_Process",
  "Coloration_Technology", "Post_Coloration_Process", "Calculation_Type", "Resilience", "APH_Library_Code"
];
function normalizeString(str) {
  return (str || '')
    .toString()
    .trim()         // Xóa khoảng trắng đầu/cuối
    .replace(/\r?\n|\r/g, '') // Xóa \r, \n
}
export default function Home() {
  const router = useRouter();
  const [tableData, setTableData] = useState([]);
  const [duplicateRows, setDuplicateRows] = useState([]);
  const [season, setSeason] = useState("");
  const [data, setData] = useState([]); // <-- khai báo state chứa dữ liệu DB
  const fileInputRef = useRef(null);
  const [duplicateMessage, setDuplicateMessage] = useState('');
  useEffect(() => {
    async function fetchData() {
      // setLoading(true);
      try {
        const res = await fetch("/api/materialqr");
        if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu");
        const json = await res.json();
        setData(json); // <-- lưu data vào state
        console.log("Dữ liệu từ DB:", json);
      } catch (error) {
        console.error(error);
        setData([]);
      } finally {
        // setLoading(false);
      }
    }
    fetchData();
  }, []);
  const handleUpload = async (event) => {

    if (season == "") {
      return alert("Vui lòng nhập season trước khi upload file.");
    }
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headerRow = jsonData[0];       // Header trong file template (bắt đầu từ Material_Name)
      const dataRows = jsonData.slice(1);  // Dữ liệu các dòng tiếp theo

      const result = dataRows.map((row) => {
        const obj = {};
        // Bắt đầu từ index 1 vì tableFields[0] là "id", không có trong file Excel
        for (let i = 0; i < headerRow.length; i++) {

          const field = tableFields[i + 1]; // Shift 1 để bỏ qua "id"
          obj[field] = row[i] !== undefined ? row[i] : "";
        }
        // Thêm field Season từ state
        obj["Season"] = season;
        return obj;
      });

      console.log("Parsed data:", result);

      const normalizedResult = result.map((row, index) => ({
        rowIndex: index + 1,
        Ref_num: normalizeString(row.Ref_num),
        Supplier_Material_Name: normalizeString(row.Supplier_Material_Name),
        Supplier_Material_ID: normalizeString(row.Supplier_Material_ID),
        Season: normalizeString(row.Season).toUpperCase()
      }));

      const normalizedData = data.map((item) => ({
        id: item.id,
        Ref_num: normalizeString(item.Ref_num),
        Supplier_Material_Name: normalizeString(item.Supplier_Material_Name),
        Supplier_Material_ID: normalizeString(item.Supplier_Material_ID),
        Season: normalizeString(item.Season).toUpperCase(), // 👈 Convert to uppercase
      }));

      const duplicates = normalizedResult.filter((row) => {
        return normalizedData.some(
          (item) =>
            item.Ref_num === row.Ref_num &&
            item.Supplier_Material_Name === row.Supplier_Material_Name &&
            item.Supplier_Material_ID === row.Supplier_Material_ID &&
            item.Season === row.Season
        );
      });
      if (duplicates.length > 0) {
        const lineNumbers = duplicates.map((d) => d.rowIndex).join(', ');
        const message = `⚠️ Có ${duplicates.length} dòng dữ liệu trùng trong file upload. Dòng: ${lineNumbers} đã tồn tại trong database vào Management & Search để tìm và kiểm tra lại dữ liệu trong database`;
        setDuplicateMessage(message);
      } else {
        setDuplicateMessage('✅ Không có dòng trùng nào.');
      }
      console.log("Duplicate rows:", duplicates);
      setDuplicateRows(duplicates)

      setTableData(result);
      // tiếp tục xử lý result nếu cần
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleSave = async () => {
    if (tableData.length === 0) return alert("Không có dữ liệu để lưu.");

    try {
      const res = await fetch("/api/materialqr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: tableData }),
      });
      const result = await res.json();
      if (res.ok) {
        alert("Lưu dữ liệu thành công!");
      } else {
        alert("Lỗi khi lưu: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối đến server.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <button
          className="flex bg-[var(--button-bg)] text-[var(--button-text)]  px-4 py-2 rounded hover:bg-[var(--button-hover-bg)] items-center gap-2 cursor-pointer"
          onClick={() => fileInputRef.current.click()}
        >
          {/* Upload Icon */}
          <svg fill="currentColor" width="30px" height="30px" viewBox="0 0 1.2 1.2" id="upload">
            <path
              id="secondary"
              d="m0.836 0.315 -0.2 -0.2a0.05 0.05 0 0 0 -0.071 0l-0.2 0.2a0.05 0.05 0 1 0 0.071 0.071L0.55 0.271V0.8a0.05 0.05 0 0 0 0.1 0V0.271l0.115 0.115a0.05 0.05 0 0 0 0.071 0 0.05 0.05 0 0 0 0 -0.071"
              style={{ fill: "rgb(44, 169, 188)" }}
            />
            <path
              id="primary"
              d="M0.943 1.1H0.257A0.104 0.104 0 0 1 0.15 1v-0.2a0.05 0.05 0 0 1 0.1 0v0.2h0.693a0.011 0.011 0 0 0 0.007 0v-0.2a0.05 0.05 0 0 1 0.1 0v0.2a0.104 0.104 0 0 1 -0.107 0.1"
              style={{ fill: "rgb(0, 0, 0)" }}
            />
          </svg>
          Upload File
        </button>

        <button
          className="flex bg-[var(--button-bg)] text-[var(--button-text)]  px-4 py-2 rounded hover:bg-[var(--button-hover-bg)] items-center gap-2 cursor-pointer"
          onClick={() => router.push("/scan-qr")}
        >
          {/* QR icon */}
          <svg width="30px" height="30px" viewBox="0 0 30 30">
            <path d="M3.75 13.75h10V3.75H3.75zm2.5 -7.5h5v5H6.25zM3.75 26.25h10v-10H3.75zm2.5 -7.5h5v5H6.25zm10 -15v10h10V3.75zm7.5 7.5h-5V6.25h5zm-7.5 5h2.5v2.5h-2.5zm2.5 2.5h2.5v2.5h-2.5zm-2.5 2.5h2.5v2.5h-2.5zm5 0h2.5v2.5h-2.5zm2.5 2.5h2.5v2.5h-2.5zm-5 0h2.5v2.5h-2.5zm2.5 -7.5h2.5v2.5h-2.5zm2.5 2.5h2.5v2.5h-2.5z" />
          </svg>
          Scan QR
        </button>

        <button
          className="flex bg-[var(--button-bg)] text-[var(--button-text)]  px-4 py-2 rounded hover:bg-[var(--button-hover-bg)] items-center gap-2 cursor-pointer"
          onClick={() => router.push("/search")}
        >
          <svg width="30px" height="30px" viewBox="0 0 1.6 1.6">
            <path
              className="puchipuchi_een"
              d="m1.021 1.321 0.45 -0.45a0.1 0.1 0 0 0 0 -0.141l-0.45 -0.45a0.1 0.1 0 1 0 -0.141 0.141L1.159 0.7H0.2a0.1 0.1 0 0 0 0 0.2h0.959l-0.279 0.279a0.1 0.1 0 1 0 0.141 0.141"
            />
          </svg>
          Management & Search
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nhập season trước khi upload file"
          className="border p-2 rounded sm:w-1/4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={season}
          onChange={(e) => {
            const formatted = e.target.value.toUpperCase().replace(/[^A-Z0-9&]/g, '');
            setSeason(formatted);
          }}
          title="Chỉ nhập chữ in hoa (A-Z), số (0-9) và dấu &"
          aria-label="Chỉ nhập chữ in hoa (A-Z), số (0-9) và dấu &"
        />
      </div>
      {tableData.length > 0 && duplicateRows.length == 0 && (
        <div className="mb-4">
          <button
            onClick={handleSave}
            className="flex bg-[var(--button-bg)] text-[var(--button-text)]  px-4 py-2 rounded hover:bg-[var(--button-hover-bg)] items-center gap-2 cursor-pointer"
          >
            <svg
              width="25px"
              height="25px"
              viewBox="0 0 0.637 0.637"
            >
              <path
                d="M0.531 0H0.056C0.025 0 0 0.025 0 0.056v0.525c0 0.031 0.025 0.056 0.056 0.056h0.525c0.031 0 0.056 -0.025 0.056 -0.056V0.104zM0.3 0.037v0.15h0.112V0.037h0.037v0.188H0.15V0.037zM0.112 0.6v-0.225h0.412v0.225zm0.487 -0.019c0 0.01 -0.008 0.019 -0.019 0.019H0.563V0.337H0.075v0.263h-0.019a0.019 0.019 0 0 1 -0.019 -0.019v-0.525a0.019 0.019 0 0 1 0.019 -0.019H0.112v0.225h0.375V0.037h0.028L0.6 0.12z"
                fill="#000000"
              />
            </svg>
            Save to Database
          </button>

        </div>
      )}
      {tableData.length > 0 && duplicateRows.length > 0 && (
        <div className="mb-4">
          <p className="text-red-500 mt-2">{duplicateMessage}</p>
        </div>
      )}
      <input
        type="file"
        accept=".xlsx, .xls"
        ref={fileInputRef}
        onClick={(e) => {
          // Reset input để onChange luôn được gọi, kể cả khi file không đổi
          e.currentTarget.value = null;
        }}
        onChange={handleUpload}
        className="hidden"
      />

      {tableData.length > 0 && (
        <div className="mt-4 overflow-x-auto overflow-y-auto max-h-[55vh]">
          <table className="min-w-max border-separate border-spacing-0 w-full">
            <thead className="text-[var(--font-color)] sticky top-0 z-10">
              <tr>
                {Object.keys(tableData[0]).map((key, idx) => (
                  <th
                    key={idx}
                    className="border border-[var(--border-color)] bg-[var(--background)]  px-2 py-1 text-left  whitespace-nowrap min-w-[150px] "
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((value, i) => (
                    <td
                      key={i}
                      className="border px-2 py-1 align-top whitespace-pre-wrap break-words max-w-[800px] border-[var(--border-color)]"
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
