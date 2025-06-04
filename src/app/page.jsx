"use client"; // cần khai báo vì dùng hook useRouter trong component client

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <div className="flex gap-2">
        <button
          className="flex bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 items-center gap-2 "
        >
          <svg
            fill="#000000"
            width="30px"
            height="30px"
            viewBox="0 0 1.2 1.2"
            id="upload"
            data-name="Flat Color"
            xmlns="http://www.w3.org/2000/svg"
            className="icon flat-color"
          >
            <path
              id="secondary"
              d="m0.836 0.315 -0.2 -0.2a0.05 0.05 0 0 0 -0.071 0l-0.2 0.2a0.05 0.05 0 1 0 0.071 0.071L0.55 0.271V0.8a0.05 0.05 0 0 0 0.1 0V0.271l0.115 0.115a0.05 0.05 0 0 0 0.071 0 0.05 0.05 0 0 0 0 -0.071"
              style={{
                fill: "rgb(44, 169, 188)",
              }}
            />
            <path
              id="primary"
              d="M0.943 1.1H0.257A0.104 0.104 0 0 1 0.15 1v-0.2a0.05 0.05 0 0 1 0.1 0v0.2h0.693a0.011 0.011 0 0 0 0.007 0v-0.2a0.05 0.05 0 0 1 0.1 0v0.2a0.104 0.104 0 0 1 -0.107 0.1"
              style={{
                fill: "rgb(0, 0, 0)",
              }}
            />
          </svg>
          Upload File

        </button>
        <button
          className="flex bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 items-center gap-2 "
          onClick={() => router.push("/scan-qr")}
        >
          <svg
            width="30px"
            height="30px"
            viewBox="0 0 30 30"
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
          >
            <path d="M3.75 13.75h10V3.75H3.75zm2.5 -7.5h5v5H6.25zM3.75 26.25h10v-10H3.75zm2.5 -7.5h5v5H6.25zm10 -15v10h10V3.75zm7.5 7.5h-5V6.25h5zm-7.5 5h2.5v2.5h-2.5zm2.5 2.5h2.5v2.5h-2.5zm-2.5 2.5h2.5v2.5h-2.5zm5 0h2.5v2.5h-2.5zm2.5 2.5h2.5v2.5h-2.5zm-5 0h2.5v2.5h-2.5zm2.5 -7.5h2.5v2.5h-2.5zm2.5 2.5h2.5v2.5h-2.5z" />
          </svg>
          Đi đến trang ScanQR
        </button>
        <button
          className="flex bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 items-center gap-2 "
          onClick={() => router.push("/search")}
        >
          <svg
            id="Uploaded to svgrepo.com"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width="30px"
            height="30px"
            viewBox="0 0 1.6 1.6"
            xmlSpace="preserve"
          >
            <path
              className="puchipuchi_een"
              d="m1.021 1.321 0.45 -0.45a0.1 0.1 0 0 0 0 -0.141l-0.45 -0.45a0.1 0.1 0 1 0 -0.141 0.141L1.159 0.7H0.2a0.1 0.1 0 0 0 0 0.2h0.959l-0.279 0.279a0.1 0.1 0 1 0 0.141 0.141"
            />
          </svg>
          Đi đến trang Search
        </button>
      </div>

    </div>
  );
}
