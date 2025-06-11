import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Material QR ",
  description: "Meterial QR Management System",
  icons: {
    icon: "/icons/favicon.ico", // hoặc "/favicon.ico"
  },
  authors: [{ name: 'Nguyen Tuan Kiet', url: 'https://github.com/nolan7512' }],
  creator: 'Nguyen Tuan Kiet',
  applicationName: 'Material QR',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="icon" href="/icons/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="mobile-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-status-bar-style" content="default" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header>
          <div className="rounded-lg shadow-md py-2">
            <div className="flex items-center  w-full mb-6">
              {/* Logo bên trái */}
              <img
                src="/apache-logo.png"
                alt="Apache Footwear Logo"
                className="w-20 h-20 mr-6 transition-transform duration-500 ease-in-out hover:scale-110 hover:rotate-6"
              />
              {/* Company Name */}
              <label
                className="text-4xl font-extrabold text-[#c97f1c] tracking-wide uppercase 
  bg-gradient-to-r from-orange-500 via-yellow-400 to-red-500 
  bg-clip-text drop-shadow-lg animate-pulse">
                Apache Footwear VIETNAM
              </label>
            </div>
            <div className="flex justify-center items-center  mb-6">
              <h2
                className="text-3xl font-extrabold uppercase px-6 rounded-xl tracking-wider
    bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 text-transparent bg-clip-text 
    drop-shadow-lg border-b-4 border-blue-700 animate-fade-down text-center mb-6 inline-block">
                Material QR Management System
              </h2>
            </div>
          </div>
        </header>
        <main className="">{children}</main>
      </body>
    </html>
  );
}
