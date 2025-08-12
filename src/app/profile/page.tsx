"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, User, Phone, Edit3, Save, X, Shield, Calendar, MapPin, Mail, Crown, Star, Zap } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    address: '',
    city: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        email: user.email || '',
        address: user.address || '',
        city: user.city || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Implement save functionality
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        email: user.email || '',
        address: user.address || '',
        city: user.city || ''
      });
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <User className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            کاربر یافت نشد
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            لطفاً ابتدا وارد حساب کاربری خود شوید
          </p>
          <Button 
            onClick={() => router.push('/auth')} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            ورود به حساب
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Enhanced Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg border-b border-white/40 dark:border-gray-700/40 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left Side - Logo and Back Button */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-white/50 dark:border-gray-700/50 rounded-2xl p-3 shadow-xl">
                <Image 
                  src="/logo.png" 
                  alt="موبایل تایگر" 
                  width={36}
                  height={36}
                  className="h-9 w-auto"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl px-4 py-2 transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 ml-2" />
                بازگشت
              </Button>
            </div>

            {/* Center - Title Only */}
            <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                مشخصات کاربری
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">مدیریت حساب کاربری</p>
            </div>
            
            {/* Right Side - Logout Button */}
            <div className="flex items-center">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20 rounded-xl px-6 py-2 transition-all duration-300 hover:shadow-lg"
              >
                خروج از حساب
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Enhanced Profile Card */}
          <div className="xl:col-span-1">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-white/50 dark:border-gray-700/50 shadow-2xl rounded-3xl overflow-hidden">
              <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-6 text-center">
                <div className="mx-auto mb-4">
                  <div className="w-28 h-28 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white/30 shadow-2xl">
                    {user.firstName?.[0]?.toUpperCase() || user.phoneNumber[0]?.toUpperCase() || 'U'}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : 'کاربر تایگر'
                  }
                </h2>
                <p className="text-blue-100 font-medium">{user.phoneNumber}</p>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 space-x-reverse p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                      <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-800 dark:text-green-200">حساب فعال</p>
                      <p className="text-sm text-green-600 dark:text-green-400">تایید شده</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 space-x-reverse p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-800 dark:text-blue-200">عضو از</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">{new Date().toLocaleDateString('fa-IR')}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 space-x-reverse p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                      <Crown className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-purple-800 dark:text-purple-200">سطح کاربری</p>
                      <p className="text-sm text-purple-600 dark:text-purple-400">کاربر ویژه</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 space-x-reverse p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center">
                      <Star className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-orange-800 dark:text-orange-200">امتیاز</p>
                      <p className="text-sm text-orange-600 dark:text-orange-400">۲۵۰ امتیاز</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Profile Details */}
          <div className="xl:col-span-3">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-white/50 dark:border-gray-700/50 shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent mb-2">
                      اطلاعات شخصی
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                      اطلاعات حساب کاربری خود را مدیریت و به‌روزرسانی کنید
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold"
                    >
                      <Edit3 className="h-5 w-5 ml-2" />
                      ویرایش اطلاعات
                    </Button>
                  ) : (
                    <div className="flex space-x-3 space-x-reverse">
                      <Button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold"
                      >
                        <Save className="h-5 w-5 ml-2" />
                        ذخیره تغییرات
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="text-gray-600 border-gray-300 hover:bg-gray-50 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-900/20 px-8 py-3 rounded-xl transition-all duration-300 font-semibold"
                      >
                        <X className="h-5 w-5 ml-2" />
                        انصراف
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Personal Information */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-xl flex items-center justify-center ml-4">
                        <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      اطلاعات شخصی
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                          نام
                        </Label>
                        {isEditing ? (
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="h-12 rounded-xl border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                            placeholder="نام خود را وارد کنید"
                          />
                        ) : (
                          <div className="h-12 p-3 bg-white dark:bg-gray-700 rounded-xl text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 flex items-center">
                            {formData.firstName || 'تعیین نشده'}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                          نام خانوادگی
                        </Label>
                        {isEditing ? (
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="h-12 rounded-xl border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                            placeholder="نام خانوادگی خود را وارد کنید"
                          />
                        ) : (
                          <div className="h-12 p-3 bg-white dark:bg-gray-700 rounded-xl text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 flex items-center">
                            {formData.lastName || 'تعیین نشده'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-xl flex items-center justify-center ml-4">
                        <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      اطلاعات تماس
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber" className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                          شماره موبایل
                        </Label>
                        <div className="h-12 p-3 bg-white dark:bg-gray-700 rounded-xl text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 flex items-center">
                          <Phone className="h-5 w-5 text-green-500 ml-2" />
                          {formData.phoneNumber}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                          ایمیل
                        </Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="h-12 rounded-xl border-gray-200 dark:border-gray-600 focus:border-green-500 focus:ring-green-500 transition-all duration-300"
                            placeholder="ایمیل خود را وارد کنید"
                          />
                        ) : (
                          <div className="h-12 p-3 bg-white dark:bg-gray-700 rounded-xl text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 flex items-center">
                            <Mail className="h-5 w-5 text-green-500 ml-2" />
                            {formData.email || 'تعیین نشده'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-xl flex items-center justify-center ml-4">
                        <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      اطلاعات آدرس
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                          شهر
                        </Label>
                        {isEditing ? (
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="h-12 rounded-xl border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
                            placeholder="شهر خود را وارد کنید"
                          />
                        ) : (
                          <div className="h-12 p-3 bg-white dark:bg-gray-700 rounded-xl text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 flex items-center">
                            <MapPin className="h-5 w-5 text-purple-500 ml-2" />
                            {formData.city || 'تعیین نشده'}
                          </div>
                        )}
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="address" className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                          آدرس کامل
                        </Label>
                        {isEditing ? (
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="h-12 rounded-xl border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
                            placeholder="آدرس کامل خود را وارد کنید"
                          />
                        ) : (
                          <div className="h-12 p-3 bg-white dark:bg-gray-700 rounded-xl text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 flex items-center">
                            <MapPin className="h-5 w-5 text-purple-500 ml-2" />
                            {formData.address || 'تعیین نشده'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-800 rounded-xl flex items-center justify-center ml-4">
                        <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      اقدامات سریع
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button variant="outline" className="h-16 rounded-xl border-orange-200 hover:bg-orange-50 dark:border-orange-700 dark:hover:bg-orange-900/20 transition-all duration-300">
                        <Shield className="h-5 w-5 text-orange-600 ml-2" />
                        تغییر رمز عبور
                      </Button>
                      <Button variant="outline" className="h-16 rounded-xl border-orange-200 hover:bg-orange-50 dark:border-orange-700 dark:hover:bg-orange-900/20 transition-all duration-300">
                        <Phone className="h-5 w-5 text-orange-600 ml-2" />
                        تایید شماره
                      </Button>
                      <Button variant="outline" className="h-16 rounded-xl border-orange-200 hover:bg-orange-50 dark:border-orange-700 dark:hover:bg-orange-900/20 transition-all duration-300">
                        <User className="h-5 w-5 text-orange-600 ml-2" />
                        پروفایل عمومی
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
} 