"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { User, LogOut, LogIn, UserCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { useAuth } from "@/lib/auth-context";

const LoginButtonWrapper = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === "loading";
  const { user: otpUser, logout: otpLogout, isAuthenticated: isOtpAuthenticated } = useAuth();

  const handleLoginClick = () => {
    router.push('/auth');
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleProfileClick = () => {
    // اگر کاربر admin است، به پنل مدیریت برود
    if (session?.user?.email?.includes('admin')) {
      router.push('/admin/dashboard');
    } else {
      // کاربر عادی به صفحه اصلی برود
      router.push('/');
    }
  };

  const handleUserProfileClick = () => {
    // رفتن به صفحه مشخصات کاربری
    router.push('/profile');
  };

  // اگر کاربر NextAuth لاگین کرده
  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-10 w-auto px-4 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white/50 dark:border-gray-700/50 shadow-lg hover:bg-white/90 dark:hover:bg-gray-700/80 transition-all duration-200"
          >
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src="" alt="User avatar" />
              <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {session.user.email?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
              {session.user.email}
            </span>
            <User className="h-4 w-4 ml-2 text-gray-500 dark:text-gray-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
            <User className="h-4 w-4 ml-2" />
            پنل مدیریت
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 dark:text-red-400">
            <LogOut className="h-4 w-4 ml-2" />
            خروج از حساب
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // اگر کاربر OTP لاگین کرده
  if (isOtpAuthenticated && otpUser) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-10 w-auto px-4 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white/50 dark:border-gray-700/50 shadow-lg hover:bg-white/90 dark:hover:bg-gray-700/80 transition-all duration-200"
          >
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src="" alt="User avatar" />
              <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {otpUser.phoneNumber[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
              {otpUser.phoneNumber}
            </span>
            <User className="h-4 w-4 ml-2 text-gray-500 dark:text-gray-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem onClick={() => router.push('/')} className="cursor-pointer">
            <User className="h-4 w-4 ml-2" />
            صفحه اصلی
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleUserProfileClick} className="cursor-pointer">
            <UserCheck className="h-4 w-4 ml-2" />
            مشخصات کاربری
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={otpLogout} className="cursor-pointer text-red-600 dark:text-red-400">
            <LogOut className="h-4 w-4 ml-2" />
            خروج از حساب
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // اگر در حال بارگذاری
  if (isLoading) {
    return (
      <Button 
        disabled 
        className="h-10 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow-lg opacity-70 cursor-not-allowed"
      >
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>در حال بارگذاری...</span>
        </div>
      </Button>
    );
  }

  // اگر کاربر لاگین نکرده
  return (
    <Button
      onClick={handleLoginClick}
      className="h-10 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200"
    >
      <LogIn className="h-4 w-4 ml-2" />
      <span>ورود | ثبت‌نام</span>
    </Button>
  );
};

export default LoginButtonWrapper; 