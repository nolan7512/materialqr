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
  const showModalRef = useRef(false);
  //   useEffect(() => {
  //   if ('serviceWorker' in navigator) {
  //     navigator.serviceWorker
  //       .register('/sw.js')
  //       .then(() => console.log('Service Worker registered'))
  //       .catch((err) => console.error('Service Worker registration failed:', err));
  //   }
  // }, []);
  useEffect(() => {
    showModalRef.current = showModal;
  }, [showModal]);
  useEffect(() => {
    if (!showModal && !isScanning) {
      setIsScanning(true);
      setResult(null);
    }
  }, [showModal]);
  useEffect(() => {
    setIsScanning(true);
    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: { width: 300, height: 300 },
      rememberLastUsedCamera: true,
      supportedScanTypes: [0], // SCAN_TYPE_CAMERA
    });

    scannerRef.current = scanner;

    scanner.render(
      async (decodedText) => {
        try {
          if (showModalRef.current) return; // ✅ luôn đúng với trạng thái hiện tại
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
      <div className="py-2 pb-15">
        <button
          className="flex px-4 py-2 rounded items-center gap-2 bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover-bg)]"
          onClick={() => router.push("/")}
        >
          Back
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

      {/* <h1 className="text-lg font-bold mb-4 text-center">Scan QR Code of Materials</h1> */}


      {/* <div className="mb-4">
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
      </div> */}
      {isScanning && (
        <p className="text-center text-[var(--font-color)] animate-pulse">Click "Request Camera Permissions" or "Start Scanning" below to begin...</p>
      )}

      <div id="qr-reader"
        className=" min-w-[200px] min-h-[100px] w-full max-w-2xl mx-auto mb-6 border rounded-lg  bg-gray-800
      shadow-md text-[var(--button-text)] 
      [&_span:not([style])]:block
      [&_span:not([style])>button]:bg-[var(--button-bg)] 
      [&_span:not([style])>button]:!w-[300px]  
      [&_span:not([style])>button]:!h-[40px] 
      [&_span:not([style])>button]:rounded-lg
      [&_span:not([style])>button]:mt-5 
      [&_#html5-qrcode-button-camera-permission]:w-[300px]   
      [&_#html5-qrcode-button-camera-permission]:bg-[var(--button-bg)]  
      [&_#html5-qrcode-button-camera-permission]:!h-[40px]
      [&_#html5-qrcode-button-camera-permission]:rounded-lg
      [&_select]:!bg-[var(--button-bg)]
      [&_select]:rounded-md
      [&_select]:!h-[40px]
      ">
      </div>

      {error && (
        <p className="text-red-500 text-center mt-4">{error}</p>
      )}

      {result && !material && !error && (
        <p className="text-center mt-4">QR: {result}</p>
      )}
      <div className="mb-6">
        <p className="text-sm text-[var(--font-color)] mb-2">
          To use the camera without security warnings, requiring re-authorization every session you need to install the certificate.
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="ml-2 text-blue-600 hover:underline"
          >
            {showInstructions ? 'Hide instructions' : 'See installation instructions'}
          </button>
        </p>
        {showInstructions && (
          <div className="bg-[var(--border-color)] p-4 rounded-lg mb-4 text-[var(--font-color)]">
            <div className="text-sm">
              1. Click the button below to download the certificate (<code>cert.cer</code>).<br />
              2. Install certificate:
              <ul className="list-disc pl-5">
                <li>
                  <strong>Windows</strong>: Double click <code>cert.cer</code>, select "Install Certificate", select "Local Machine", set to "Trusted Root Certification Authorities".
                </li>
                <li>
                  <strong>macOS</strong>: Open Keychain Access, drag the file in, select "System", set "Always Trust".
                </li>
                <li>
                  <strong>iOS</strong>: When you open the .cer file, you will see the “Review Profile” interface.
                  Tap “Install” in the upper right corner.
                  Enter your passcode if prompted.
                  Continue to tap “Install” → “Done”.
                  Go to Settings - General - About - Certificate Trust Settings.
                  Under "Enable all root certificates," turn on the switch next to the certificate you just installed (usually the name of the file).
                  Confirm Trust when prompted.
                </li>
                <li>
                  <strong>Android</strong>: Open the file, go to Settings , Security , Install certificate from storage.
                </li>
              </ul>
              3. Refresh the page to use the camera.
            </div>
            <a
              href="/certs/10.30.3.40.cer"
              download="cert.cer"
              className="mt-2 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Download Certificate
            </a>
          </div>
        )}
      </div>
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