"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, UserCheck, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/auth-context';

interface UserProfileFormProps {
  phoneNumber: string;
  onComplete: (firstName: string, lastName: string) => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ phoneNumber, onComplete }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim()) {
      setError('لطفاً نام و نام خانوادگی خود را وارد کنید.');
      return;
    }

    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      setError('نام و نام خانوادگی باید حداقل ۲ کاراکتر باشند.');
      return;
    }

    setLoading(true);

    try {
      // ذخیره اطلاعات کاربر در localStorage
      const userData = {
        phoneNumber,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        isLoggedIn: true,
        loginTime: Date.now()
      };

      localStorage.setItem('otp_user', JSON.stringify(userData));
      
      setLoading(false);
      toast.success('اطلاعات شما با موفقیت ذخیره شد!');
      
      // فراخوانی تابع تکمیل
      onComplete(firstName.trim(), lastName.trim());
      
    } catch (err) {
      setError('خطا در ذخیره اطلاعات. لطفاً دوباره تلاش کنید.');
      setLoading(false);
    }
  };

  return (
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
          className="w-20 h-20 bg-gradient-to-br from-green-400/30 to-green-500/20 text-white rounded-full flex items-center justify-center shadow-2xl backdrop-blur-md border border-green-400/40"
        >
          <UserCheck size={36} />
        </motion.div>
      </div>

      {/* Title and description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-white mb-3">تکمیل پروفایل</h2>
        <p className="text-white/90 mb-6 leading-relaxed">
          تبریک! 🎉<br />
          ورود شما با موفقیت انجام شد.<br />
          حالا لطفاً نام و نام خانوادگی خود را وارد کنید.
        </p>
        <div className="bg-white/10 rounded-2xl p-4 mb-6">
          <p className="text-white/80 text-sm">شماره تایید شده:</p>
          <p className="text-white font-semibold text-lg">{phoneNumber}</p>
        </div>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 text-right">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <label className="block text-white font-medium mb-3 text-right" htmlFor="firstName">
            نام
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">
              <User size={20} />
            </span>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="نام خود را وارد کنید"
              className="w-full px-4 py-4 border border-white/40 bg-white/20 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/60 text-right placeholder:text-white/50 pr-12 backdrop-blur-sm transition-all duration-300"
              required
              minLength={2}
              maxLength={30}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <label className="block text-white font-medium mb-3 text-right" htmlFor="lastName">
            نام خانوادگی
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">
              <User size={20} />
            </span>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="نام خانوادگی خود را وارد کنید"
              className="w-full px-4 py-4 border border-white/40 bg-white/20 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/60 text-right placeholder:text-white/50 pr-12 backdrop-blur-sm transition-all duration-300"
              required
              minLength={2}
              maxLength={30}
            />
          </div>
        </motion.div>

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

        {/* Submit button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-400/40 to-green-500/30 text-white py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-lg border border-green-400/30 hover:from-green-500/50 hover:to-green-400/40"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>در حال ذخیره...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>تکمیل و ادامه</span>
              <ArrowRight size={20} />
            </div>
          )}
        </motion.button>
      </form>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8 text-sm text-white/70"
      >
        <p>اطلاعات شما با امنیت کامل ذخیره می‌شود</p>
      </motion.div>
    </motion.div>
  );
};

export default UserProfileForm; 