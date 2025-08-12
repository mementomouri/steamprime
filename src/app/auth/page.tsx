"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, ArrowLeft, LogIn, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/auth-context';
import UserProfileForm from '@/components/UserProfileForm';

export default function ProfessionalLogin() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isCodeSent) {
      if (!phone || phone.length < 11) {
        setError('لطفاً یک شماره همراه معتبر وارد کنید.');
        return;
      }
      setLoading(true);
      
      try {
        // ارسال درخواست به API برای ارسال کد تایید
        const response = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phoneNumber: phone }),
        });

        const data = await response.json();

        if (response.ok) {
          setLoading(false);
          setIsCodeSent(true);
          setSuccess('کد تایید به شماره شما ارسال شد.');
          toast.success('کد تایید ارسال شد!');
          console.log('Verification code sent to:', phone);
        } else {
          setError(data.message || 'خطا در ارسال کد. لطفاً دوباره تلاش کنید.');
          setLoading(false);
        }
      } catch (err) {
        setError('خطا در ارسال کد. لطفاً دوباره تلاش کنید.');
        setLoading(false);
      }
    } else {
      if (!code) {
        setError('لطفاً کد تایید را وارد کنید.');
        return;
      }
      setLoading(true);
      
      try {
        // ارسال درخواست به API برای تایید کد
        const response = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phoneNumber: phone, code: code }),
        });

        const data = await response.json();

        if (response.ok) {
          setLoading(false);
          setSuccess('کد تایید صحیح است!');
          toast.success('کد تایید صحیح است!');
          
          // نمایش فرم پروفایل
          setShowProfileForm(true);
        } else {
          setError(data.message || 'کد وارد شده صحیح نیست.');
          toast.error(data.message || 'کد وارد شده صحیح نیست.');
          setLoading(false);
        }
      } catch (err) {
        setError('خطا در تایید کد. لطفاً دوباره تلاش کنید.');
        setLoading(false);
      }
    }
  };

  const handleBackToPhone = () => {
    setIsCodeSent(false);
    setCode('');
    setError('');
    setSuccess('');
  };

  const handleProfileComplete = (firstName: string, lastName: string) => {
    // ورود کاربر با نام و نام خانوادگی
    login(phone, firstName, lastName);
    
    // هدایت به صفحه اصلی
    setTimeout(() => {
      router.push('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#445dee] via-[#5a70ff] to-[#3344dd] p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative max-w-md w-full bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 text-center border border-white/30"
      >
        {/* Header with animated icon */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ rotate: 0, scale: 0.8 }}
            animate={{ 
              rotate: [0, -5, 5, -5, 5, 0],
              scale: [0.8, 1, 0.9, 1, 0.9, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 3,
              ease: "easeInOut"
            }}
            className="w-20 h-20 bg-gradient-to-br from-white/30 to-white/20 text-white rounded-full flex items-center justify-center shadow-2xl backdrop-blur-md border border-white/40"
          >
            <LogIn size={36} />
          </motion.div>
        </div>

        {/* Title and description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-white mb-3">ورود | ثبت‌نام</h2>
          <p className="text-white/90 mb-8 leading-relaxed">
            سلام! 👋<br />
            لطفاً شماره موبایل خود را وارد کنید تا کد تایید ارسال شود.
          </p>
        </motion.div>

        {/* Form */}
        {!showProfileForm ? (
          <form onSubmit={handleSubmit} className="space-y-6 text-right">
            {!isCodeSent ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <label className="block text-white font-medium mb-3 text-right" htmlFor="phone">
                شماره همراه
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">
                  <Phone size={20} />
                </span>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="مثلاً ۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full px-4 py-4 border border-white/40 bg-white/20 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/60 text-right placeholder:text-white/50 pr-12 backdrop-blur-sm transition-all duration-300"
                  required
                  maxLength={11}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <label className="block text-white font-medium mb-3 text-right" htmlFor="code">
                کد تایید
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="کد ۶ رقمی را وارد کنید"
                  className="w-full px-4 py-4 border border-white/40 bg-white/20 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/60 text-center placeholder:text-white/50 backdrop-blur-sm transition-all duration-300"
                  maxLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={handleBackToPhone}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-white/20"
                >
                  <ArrowLeft size={20} />
                </button>
              </div>
              <p className="text-white/70 text-sm mt-2 text-center">
                کد به شماره {phone} ارسال شد
              </p>
            </motion.div>
          )}

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="bg-red-500/20 text-white border border-red-400/50 rounded-2xl p-4 text-sm flex items-center gap-2 backdrop-blur-sm"
            >
              <AlertCircle size={18} className="text-red-300" />
              {error}
            </motion.div>
          )}

          {/* Success message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="bg-green-500/20 text-white border border-green-400/50 rounded-2xl p-4 text-sm flex items-center gap-2 backdrop-blur-sm"
            >
              <CheckCircle size={18} className="text-green-300" />
              {success}
            </motion.div>
          )}

          {/* Submit button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-white/40 to-white/30 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-lg border border-white/30 hover:from-white/50 hover:to-white/40"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>در حال پردازش...</span>
              </div>
            ) : (
              <span>{isCodeSent ? 'تایید و ورود' : 'دریافت کد تایید'}</span>
            )}
          </motion.button>
        </form>
        ) : (
          <UserProfileForm 
            phoneNumber={phone}
            onComplete={handleProfileComplete}
          />
        )}

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 text-sm text-white/70"
        >
          <p>با ورود، شما قوانین و شرایط استفاده را می‌پذیرید</p>
        </motion.div>
      </motion.div>
    </div>
  );
} 