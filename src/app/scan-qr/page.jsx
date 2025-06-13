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
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  const [showModal, setShowModal] = useState(false);

  //   useEffect(() => {
  //   if ('serviceWorker' in navigator) {
  //     navigator.serviceWorker
  //       .register('/sw.js')
  //       .then(() => console.log('Service Worker registered'))
  //       .catch((err) => console.error('Service Worker registration failed:', err));
  //   }
  // }, []);

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
          // Bỏ comment khi API sẵn sàng

          const res = await fetch(`/api/materialqr/${decodedText}`);
          if (res.ok) {
            const data = await res.json();
            setMaterial(data);
            setShowModal(true);
          } else {
            throw new Error('Không tìm thấy dữ liệu');
          }

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




  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    // Kiểm tra iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);
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



      // Bỏ comment khi API sẵn sàng   
      const res = await fetch(`/api/materialqr/${code.data}`);
      if (res.ok) {
        const data = await res.json();
        setMaterial(data);
        setShowModal(true);
      } else {
        throw new Error('Không tìm thấy dữ liệu');
      }
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
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('PWA installed');
      }
      setDeferredPrompt(null);
    }
  };
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="py-2">
        <button
          className="flex px-4 py-2 rounded items-center gap-2 bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover-bg)]"
          onClick={() => router.push("/")}
        >
          Quay lại
        </button>
        {/* {deferredPrompt && !isIOS && (
          <button
            className="flex bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 items-center gap-2 mt-2"
            onClick={handleInstallClick}
          >
            Cài đặt ứng dụng
          </button>
        )}
        {isIOS && (
          <p className="text-sm text-gray-600 mt-2">
            Để cài đặt ứng dụng trên iOS, vui lòng mở trang này trong <strong>Safari</strong>, nhấn nút <strong>Chia sẻ</strong> (hình vuông với mũi tên), và chọn <strong>Thêm vào Màn hình chính</strong>.
          </p>
        )} */}
      </div>
      <h1 className="text-lg font-bold mb-4 text-center">Quét mã QR Nguyên Vật Liệu</h1>

      <div className="mb-6">
        <p className="text-sm text-[var(--font-color)] mb-2">
          Để sử dụng camera mà không có cảnh báo bảo mật, bạn cần cài đặt chứng chỉ.
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="ml-2 text-blue-600 hover:underline"
          >
            {showInstructions ? 'Ẩn hướng dẫn' : 'Xem hướng dẫn cài đặt'}
          </button>
        </p>
        {showInstructions && (
          <div className="bg-[var(--border-color)] p-4 rounded-lg mb-4 text-[var(--font-color)]">
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
              href="/certs/10.30.3.40.cer"
              download="cert.cer"
              className="mt-2 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Tải Chứng chỉ
            </a>
          </div>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-sm text-[var(--font-color)] mb-2">
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
        <p className="text-center text-[var(--font-color)] animate-pulse">Bấm "Request Carema Permissions" hoặc "Start Scanning" phía dưới để bắt đầu...</p>
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