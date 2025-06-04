'use client';

import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import jsQR from 'jsqr';
import dynamic from 'next/dynamic';
const MaterialInfoModal = dynamic(() => import('@/components/MaterialInfoModal'), { ssr: false });

export default function ScanQRPage() {
  const [result, setResult] = useState(null);
  const [material, setMaterial] = useState(null);
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const scannerRef = useRef(null);
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    setIsScanning(true);
    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
      supportedScanTypes: [0], // SCAN_TYPE_CAMERA
    });

    scannerRef.current = scanner;

    scanner.render(
      async (decodedText) => {
        try {
          setResult(decodedText);
          setIsScanning(false);
          setMaterial({
            "Image_URL": "apache-logo.png", // Thay thế bằng URL hình ảnh thực tế
            "Material_Name": "40044559 Lace & lace tip Braided,Plastic injection",
            "Supplier_Name": "CHEN TAI",
            "Supplier_Material_Name": "CTV S 0511",
            "Material_Name_By_Supplier": "CTV S 0511",
            "Ref_num": "40044559",
            "Concept_Brief_ID": "",
            "MtlSupp_Lifecycle_State": "Limited Release",
            "Mtl_Lifecycle_State": "Limited Release",
            "Abrasion": "",
            "AnimalType": "",
            "Skin_Size": "",
            "QC%": "",
            "Apperance": "",
            "Backside_Coating_Composition": "",
            "Backside_Coating_Technology": "",
            "Benchmark_Supplier": "Y",
            "Branding_General": "",
            "Business_Requestor": "Cam, Hong",
            "Caution_Code": "",
            "Chemical": "",
            "Classification": "FINISHED COMPONENT//CLOSURE//LACE TYPE//Lace",
            "Coating": "",
            "Coating_Layer_1_Composition": "",
            "Coating_Layer_1_Location": "",
            "Coating_Layer_1_Technology": "",
            "Coating_Layer_2_Composition": "",
            "Coating_Layer_2_Location": "",
            "Coating_Layer_2_Technology": "",
            "Coating_Thickness": "",
            "Color_Approval_Required": "NO",
            "Comparison_Price": "0.2256",
            "Comparison_UoM_Classification": "6MM/M/PAIR",
            "Composition": "",
            "Composition_Lace_Tip": "ACETATE",
            "Construction": "",
            "Construction_Lace": "Round without core",
            "Construction_Lace_Tip": "Open end lace tip",
            "Country": "TAIWAN",
            "CrustID": "",
            "Currency": "USD",
            "Customs_Remark": "",
            "DateChanged_Material": "2025-05-16 03:23:44.0",
            "DateChanged_MaterialSupplier": "2025-05-16 03:23:44.0",
            "DateCreated_Material": "2017-01-04 00:07:27.0",
            "DateCreated_MaterialSupplier": "2017-01-04 00:07:27.0",
            "Density (in g/cm³)": "",
            "Density_Warp": "",
            "Density_Weft": "",
            "Developer_FirstName": "Hong",
            "Developer_LastName": "Cam",
            "Developer_Location": "Herzo",
            "Development_Type": "Modified",
            "Dyeing_Process": "",
            "Effects": "",
            "Emboss": "",
            "End_Season": "",
            "EPM_Rating": "Not available",
            "Exclusive_To": "",
            "Execution": "",
            "Family_ID": "19984",
            "Fiber_Content_Percentage": "",
            "Fiber_Type": "",
            "Finishing_Lace": "",
            "Finishing_Lace_Tip": "",
            "First_Comment": "PDM Import",
            "First_Quote_Price": "7777",
            "First_Season": "Fall/Winter 2018",
            "Flexual_Modulus": "",
            "Friends_ID": "",
            "Gauge": "",
            "Hardness": "",
            "Laboratory": "LAB OC VIETNAM/LYV",
            "Lace_Composition": "100% COTTON-BCI",
            "Layer_1_Weight": "8.79265",
            "LAYERS": "1",
            "Leadtime": "21",
            "Speed Leadtime": "14",
            "Leather_Type": "",
            "Local_Sourcing_Allowed": "N",
            "Management_Model": "Dedicated",
            "Marking": "",
            "Material_Remarks": "",
            "Material_Type_Level_1": "Finished Component",
            "Material_Type_Level_2": "Closure",
            "Material_Type_Level_3": "Lace & lace tip",
            "Metric_Number": "",
            "Min_Qty_Color": "",
            "Min_Qty_Sample": "",
            "Model_Numbers": "LLC92,NIM73,NJJ35,NJJ39,NJJ51,NJJ52,NJK56,NKA03,NKN88,NMP32,NNT02,NNT89,NRC28,NRC31,NRC34,NRY17,NSC61,OMT91,OMV17,OMV95,ONV08,OOD75,OOF33,OON51,OOP18,OOP62,OOQ40,OOQ41,OOR63,OOT31,OPF47",
            "Molecular_Structure": "",
            "Oil_Content": "",
            "Originating_Group": "adidas Footwear",
            "Out_Dim_Width": "8",
            "Parent_ID": "",
            "PR_Type": "None",
            "Prod_Location": "",
            "Production_Location": "Taiwan, Vietnam",
            "Technical_Function": "",
            "Real_T2_Supplier": "",
            "Reason_For_Friendship": "",
            "Reason_For_Uniqueness": "",
            "Requestor_FirstName": "Hong",
            "Requestor_LastName": "Cam",
            "RP": "",
            "Sample_Leadtime": "10",
            "Softness": "",
            "Softness_Ring": "",
            "Standard_Price": "0.2256",
            "Stretch_A_In_Percent": "",
            "Stretch_B_In_Percent": "",
            "Supplier_Material_ID": "23714681",
            "Supplier_Remark": "1.  CTV-S1664 is made by 100% cotton which is natural fiber so it’s weak on Colorfastness and UV tests for bright and dark color also it’s poor on physical property such like tensile, abrasion.\n2.  If dyeing different lot, the color will have difference due to the natural material.\n3.  Because of the structure of the material, the width tolerance is ±1 mm.\n4.  The color matching rate for cotton is about 70%-80%. Cotton is not suitable for dyeing neon color. The color matching rate is 50%.\n",
            "Supplier_UoM": "PAIR",
            "Tannage_Type": "",
            "Technology": "",
            "Technology_Lace": "Braided",
            "Technology_Lace_Tip": "Plastic injection",
            "Terms_of_Delivery": "FOB (freight on board)",
            "Testing_Group": "Base Material",
            "Testing_Group_ID": "40044559",
            "Textile_pattern_shape": "",
            "Thickness_in_mm": "",
            "Thickness_tolerance": "",
            "Toolboxes": "SS2027 Seasonal, FW2026 Seasonal, FW2026 Foundation, SS2026 Seasonal, SS2026 Foundation, FW2025 Seasonal, SS2025 Seasonal, FW2024 Seasonal, FW2024 Foundation, SS2024 Seasonal, FW2023 Seasonal, SS2023 Seasonal, FW2022 Seasonal, SS2022 Seasonal, FW2021 Seasonal, FW2021 Foundation, SS2021 Seasonal, SS2021 Foundation, FW2020 Seasonal, FW2020 Foundation, SS2020 Seasonal, FW2019 Seasonal, SS2019 Seasonal, FW2018 Seasonal, FW2017 Seasonal, SS2017 Seasonal",
            "Total_Thickness": "",
            "Total_Weight": "8.79265",
            "Treatment": "",
            "User_Last_Changed_Material": "mlmInternalRestCall",
            "VENDOR_CD": "Z87001",
            "Virtual_Reference_ID": "",
            "Weight_UoM": "G/M(PR)",
            "Width": "",
            "Width_UoM": "",
            "VR": "3D",
            "Reference Material": "",
            "Discontinued": "",
            "Discontinued Remark": "",
            "Vegan": "Y",
            "Pre-Coloration Process": "No Pre-Treatment",
            "Coloration Technology": "Piece Dye",
            "Post-Coloration Process": "No Post-Treatment",
            "Calculation Type": "Length",
            "Resilience": "",
            "APH Library's code": "CK-11"
          }); // demo key-value
          setShowModal(true);
          // Bỏ comment khi API sẵn sàng
          /*
          const res = await fetch(`/api/materialqr/${decodedText}`);
          if (res.ok) {
            const data = await res.json();
            setMaterial(data);
            setShowModal(true);
          } else {
            throw new Error('Không tìm thấy dữ liệu');
            setShowModal(false);
          }
          */
        } catch (err) {
          setError(err.message || 'Lỗi khi xử lý mã QR');
          setMaterial(null);
          setShowModal(false);
        }
      },
      (error) => {
        //console.warn('Lỗi quét QR:', error);
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((err) => {
          console.error('Lỗi khi dọn dẹp scanner:', err);
        });
      }
    };
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setError(null);
      setIsScanning(true);

      // Đọc file ảnh
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Tạo URL tạm thời cho ảnh
      const url = URL.createObjectURL(file);
      img.src = url;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Không thể tải ảnh'));
      });

      // Vẽ ảnh lên canvas
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Lấy dữ liệu ảnh từ canvas
      const imageData = ctx.getImageData(0, 0, img.width, img.height);

      // Đọc QR bằng jsQR
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (!code) {
        throw new Error('Không tìm thấy mã QR trong ảnh');
      }

      setResult(code.data);
      setIsScanning(false);

      // Dọn dẹp URL
      URL.revokeObjectURL(url);


      setMaterial({
        "Image_URL":"apache-logo.png",
        "Material_Name": "40044559 Lace & lace tip Braided,Plastic injection",
        "Supplier_Name": "CHEN TAI",
        "Supplier_Material_Name": "CTV S 0511",
        "Material_Name_By_Supplier": "CTV S 0511",
        "Ref_num": "40044559",
        "Concept_Brief_ID": "",
        "MtlSupp_Lifecycle_State": "Limited Release",
        "Mtl_Lifecycle_State": "Limited Release",
        "Abrasion": "",
        "AnimalType": "",
        "Skin_Size": "",
        "QC%": "",
        "Apperance": "",
        "Backside_Coating_Composition": "",
        "Backside_Coating_Technology": "",
        "Benchmark_Supplier": "Y",
        "Branding_General": "",
        "Business_Requestor": "Cam, Hong",
        "Caution_Code": "",
        "Chemical": "",
        "Classification": "FINISHED COMPONENT//CLOSURE//LACE TYPE//Lace",
        "Coating": "",
        "Coating_Layer_1_Composition": "",
        "Coating_Layer_1_Location": "",
        "Coating_Layer_1_Technology": "",
        "Coating_Layer_2_Composition": "",
        "Coating_Layer_2_Location": "",
        "Coating_Layer_2_Technology": "",
        "Coating_Thickness": "",
        "Color_Approval_Required": "NO",
        "Comparison_Price": "0.2256",
        "Comparison_UoM_Classification": "6MM/M/PAIR",
        "Composition": "",
        "Composition_Lace_Tip": "ACETATE",
        "Construction": "",
        "Construction_Lace": "Round without core",
        "Construction_Lace_Tip": "Open end lace tip",
        "Country": "TAIWAN",
        "CrustID": "",
        "Currency": "USD",
        "Customs_Remark": "",
        "DateChanged_Material": "2025-05-16 03:23:44.0",
        "DateChanged_MaterialSupplier": "2025-05-16 03:23:44.0",
        "DateCreated_Material": "2017-01-04 00:07:27.0",
        "DateCreated_MaterialSupplier": "2017-01-04 00:07:27.0",
        "Density (in g/cm³)": "",
        "Density_Warp": "",
        "Density_Weft": "",
        "Developer_FirstName": "Hong",
        "Developer_LastName": "Cam",
        "Developer_Location": "Herzo",
        "Development_Type": "Modified",
        "Dyeing_Process": "",
        "Effects": "",
        "Emboss": "",
        "End_Season": "",
        "EPM_Rating": "Not available",
        "Exclusive_To": "",
        "Execution": "",
        "Family_ID": "19984",
        "Fiber_Content_Percentage": "",
        "Fiber_Type": "",
        "Finishing_Lace": "",
        "Finishing_Lace_Tip": "",
        "First_Comment": "PDM Import",
        "First_Quote_Price": "7777",
        "First_Season": "Fall/Winter 2018",
        "Flexual_Modulus": "",
        "Friends_ID": "",
        "Gauge": "",
        "Hardness": "",
        "Laboratory": "LAB OC VIETNAM/LYV",
        "Lace_Composition": "100% COTTON-BCI",
        "Layer_1_Weight": "8.79265",
        "LAYERS": "1",
        "Leadtime": "21",
        "Speed Leadtime": "14",
        "Leather_Type": "",
        "Local_Sourcing_Allowed": "N",
        "Management_Model": "Dedicated",
        "Marking": "",
        "Material_Remarks": "",
        "Material_Type_Level_1": "Finished Component",
        "Material_Type_Level_2": "Closure",
        "Material_Type_Level_3": "Lace & lace tip",
        "Metric_Number": "",
        "Min_Qty_Color": "",
        "Min_Qty_Sample": "",
        "Model_Numbers": "LLC92,NIM73,NJJ35,NJJ39,NJJ51,NJJ52,NJK56,NKA03,NKN88,NMP32,NNT02,NNT89,NRC28,NRC31,NRC34,NRY17,NSC61,OMT91,OMV17,OMV95,ONV08,OOD75,OOF33,OON51,OOP18,OOP62,OOQ40,OOQ41,OOR63,OOT31,OPF47",
        "Molecular_Structure": "",
        "Oil_Content": "",
        "Originating_Group": "adidas Footwear",
        "Out_Dim_Width": "8",
        "Parent_ID": "",
        "PR_Type": "None",
        "Prod_Location": "",
        "Production_Location": "Taiwan, Vietnam",
        "Technical_Function": "",
        "Real_T2_Supplier": "",
        "Reason_For_Friendship": "",
        "Reason_For_Uniqueness": "",
        "Requestor_FirstName": "Hong",
        "Requestor_LastName": "Cam",
        "RP": "",
        "Sample_Leadtime": "10",
        "Softness": "",
        "Softness_Ring": "",
        "Standard_Price": "0.2256",
        "Stretch_A_In_Percent": "",
        "Stretch_B_In_Percent": "",
        "Supplier_Material_ID": "23714681",
        "Supplier_Remark": "1.  CTV-S1664 is made by 100% cotton which is natural fiber so it’s weak on Colorfastness and UV tests for bright and dark color also it’s poor on physical property such like tensile, abrasion.\n2.  If dyeing different lot, the color will have difference due to the natural material.\n3.  Because of the structure of the material, the width tolerance is ±1 mm.\n4.  The color matching rate for cotton is about 70%-80%. Cotton is not suitable for dyeing neon color. The color matching rate is 50%.\n",
        "Supplier_UoM": "PAIR",
        "Tannage_Type": "",
        "Technology": "",
        "Technology_Lace": "Braided",
        "Technology_Lace_Tip": "Plastic injection",
        "Terms_of_Delivery": "FOB (freight on board)",
        "Testing_Group": "Base Material",
        "Testing_Group_ID": "40044559",
        "Textile_pattern_shape": "",
        "Thickness_in_mm": "",
        "Thickness_tolerance": "",
        "Toolboxes": "SS2027 Seasonal, FW2026 Seasonal, FW2026 Foundation, SS2026 Seasonal, SS2026 Foundation, FW2025 Seasonal, SS2025 Seasonal, FW2024 Seasonal, FW2024 Foundation, SS2024 Seasonal, FW2023 Seasonal, SS2023 Seasonal, FW2022 Seasonal, SS2022 Seasonal, FW2021 Seasonal, FW2021 Foundation, SS2021 Seasonal, SS2021 Foundation, FW2020 Seasonal, FW2020 Foundation, SS2020 Seasonal, FW2019 Seasonal, SS2019 Seasonal, FW2018 Seasonal, FW2017 Seasonal, SS2017 Seasonal",
        "Total_Thickness": "",
        "Total_Weight": "8.79265",
        "Treatment": "",
        "User_Last_Changed_Material": "mlmInternalRestCall",
        "VENDOR_CD": "Z87001",
        "Virtual_Reference_ID": "",
        "Weight_UoM": "G/M(PR)",
        "Width": "",
        "Width_UoM": "",
        "VR": "3D",
        "Reference Material": "",
        "Discontinued": "",
        "Discontinued Remark": "",
        "Vegan": "Y",
        "Pre-Coloration Process": "No Pre-Treatment",
        "Coloration Technology": "Piece Dye",
        "Post-Coloration Process": "No Post-Treatment",
        "Calculation Type": "Length",
        "Resilience": "",
        "APH Library's code": "CK-11"
      }); // demo key-value
      setShowModal(true);
      // Bỏ comment khi API sẵn sàng
      /*
      const res = await fetch(`/api/materialqr/${code.data}`);
      if (res.ok) {
        const data = await res.json();
        setMaterial(data);
        setShowModal(true);
      } else {
        throw new Error('Không tìm thấy dữ liệu');
      }
      */
    } catch (err) {
      setError('Lỗi khi đọc mã QR từ ảnh: ' + err.message);
      setMaterial(null);
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="py-2">
        <button
          className="flex bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 items-center gap-2 "
          onClick={() => router.back()}
        >
          Quay lại
        </button>
      </div>
      <h1 className="text-lg font-bold mb-4 text-center">Quét mã QR Nguyên Vật Liệu</h1>

      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">
          Để sử dụng camera mà không có cảnh báo bảo mật, bạn cần cài đặt chứng chỉ.
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="ml-2 text-blue-600 hover:underline"
          >
            {showInstructions ? 'Ẩn hướng dẫn' : 'Xem hướng dẫn cài đặt'}
          </button>
        </p>
        {showInstructions && (
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <div className="text-sm">
              1. Nhấn nút dưới để tải chứng chỉ (<code>cert.cer</code>).<br />
              2. Cài đặt chứng chỉ:
              <ul className="list-disc pl-5">
                <li>
                  <strong>Windows</strong>: Nhấp đúp vào <code>cert.cer</code>, chọn "Install Certificate", chọn "Local Machine", đặt vào "Trusted Root Certification Authorities".
                </li>
                <li>
                  <strong>macOS</strong>: Mở Keychain Access, kéo tệp vào, chọn "System", đặt "Always Trust".
                </li>
                <li>
                  <strong>iOS</strong>: Mở tệp, vào Cài đặt , Chung  , Quản lý cấu hình & thiết bị, cài đặt chứng chỉ.
                </li>
                <li>
                  <strong>Android</strong>: Mở tệp, vào Cài đặt ,  Bảo mật , Cài đặt chứng chỉ từ bộ nhớ.
                </li>
              </ul>
              3. Làm mới trang để sử dụng camera.
            </div>
            <a
              href="/certs/cert.cer"
              download="cert.cer"
              className="mt-2 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Tải Chứng chỉ
            </a>
          </div>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-2">
          Cấp quyền Camera Hoặc tải ảnh QR lên ở đây:
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </label>
      </div>
      {isScanning && (
        <p className="text-center text-gray-700 animate-pulse">Bấm "Request Carema Permissions" hoặc "Start Scanning" phía dưới để bắt đầu...</p>
      )}

      <div id="qr-reader" className=" max-w-full mx-auto mb-6 border rounded-lg shadow-md" />

      {error && (
        <p className="text-red-500 text-center mt-4">{error}</p>
      )}

      {result && !material && !error && (
        <p className="text-center mt-4">Mã QR: {result}</p>
      )}

      {/* {material && (
        <div className="mt-6 overflow-x-auto max-h-[70vh] overflow-y-auto border rounded-lg p-4 bg-white shadow">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                {Object.keys(material).map((key) => (
                  <th key={key} className="border px-4 py-2 text-left font-medium">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {Object.values(material).map((value, idx) => (
                  <td key={idx} className="border px-4 py-2">
                    {value?.toString() || '-'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )} */}
      {material && (
        <MaterialInfoModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          data={material}
        />
      )}
    </div>
  );
}