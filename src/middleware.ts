import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // اگر توکن وجود داشت (یعنی کاربر وارد شده)، اجازه دسترسی داده می‌شود
      return !!token;
    },
  },
});

// این بخش مشخص می‌کند که Middleware روی کدام مسیرها اجرا شود
export const config = {
  matcher: [
    "/admin/:path*", // تمام صفحات داخل /admin
  ],
};