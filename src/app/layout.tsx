import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";
import Providers from "./providers";
import Script from "next/script";

// تعریف فونت سفارشی با Next.js
const byekanBold = localFont({
  src: '../assets/fonts/B Yekan+ Bold.woff2',
  variable: '--font-byekan-bold',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Mobile Tiger",
  description: "Price list for mobile devices",
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
      <head>
        {/* Google tag (gtag.js) */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-HR2C2489W3" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-HR2C2489W3');
        `}</Script>
      </head>
      <body className={`font-sans ${byekanBold.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
