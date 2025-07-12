import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import Providers from "./providers"; // ایمپورت کامپوننت جدید

const vazirmatn = Vazirmatn({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mobile Tiger Admin",
  description: "Admin panel for price list management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={vazirmatn.className}>
        {/* استفاده از کامپوننت جدید به جای SessionProvider مستقیم */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}