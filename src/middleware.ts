import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";

export default withAuth(
  // تابع اصلی withAuth برای محافظت
  function middleware(req) {
    // این بخش فقط برای لاگ کردن است و می‌توان بعداً آن را حذف کرد
    console.log("Middleware executed for path:", req.nextUrl.pathname);
    console.log("Token found:", !!req.nextauth.token);
  },
  // تنظیمات withAuth
  {
    callbacks: {
      authorized: ({ token }) => {
        // اگر توکن وجود داشت، اجازه دسترسی داده می‌شود
        return !!token;
      },
    },
  }
);

// این بخش مشخص می‌کند که Middleware روی کدام مسیرها اجرا شود
export const config = {
  matcher: [
    "/admin/:path*", // تمام صفحات داخل /admin
  ],
};