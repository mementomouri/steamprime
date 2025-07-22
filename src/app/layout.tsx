import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";
import Providers from "./providers";

const yekanBakh = localFont({
  src: [
    { 
      path: '../assets/fonts/YekanBakh-Bold.woff2', 
      weight: '700', // وزن Bold
      style: 'normal' 
    },
  ],
  variable: '--font-yekanbakh',
});

export const metadata: Metadata = {
  title: "Mobile Tiger",
  description: "Price list for mobile devices",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${yekanBakh.variable} ${yekanBakh.className}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
