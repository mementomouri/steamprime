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
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'format-detection': 'telephone=no',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
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
