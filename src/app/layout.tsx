import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";
import Providers from "./providers";

// تعریف فونت سفارشی با Next.js
const byekanBold = localFont({
  src: '../assets/fonts/B Yekan+ Bold.woff2',
  variable: '--font-byekan-bold',
  display: 'swap',
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
    <html lang="fa" dir="rtl">
      <body className={`font-sans ${byekanBold.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
