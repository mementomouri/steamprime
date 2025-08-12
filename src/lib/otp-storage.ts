// یک آبجکت ساده برای ذخیره کدها به صورت موقت
// در یک اپلیکیشن واقعی، بهتر است از دیتابیس مانند Redis استفاده کنید

interface OTPData {
  code: string;
  timestamp: number;
}

class OTPStorage {
  private storage: Map<string, OTPData> = new Map();

  // ذخیره کد OTP
  set(phoneNumber: string, code: string): void {
    this.storage.set(phoneNumber, {
      code,
      timestamp: Date.now()
    });
    
    // حذف کدهای قدیمی (بیش از 10 دقیقه)
    this.cleanup();
  }

  // دریافت کد OTP
  get(phoneNumber: string): OTPData | undefined {
    return this.storage.get(phoneNumber);
  }

  // حذف کد OTP
  delete(phoneNumber: string): boolean {
    return this.storage.delete(phoneNumber);
  }

  // بررسی اینکه آیا کد برای این شماره وجود دارد
  has(phoneNumber: string): boolean {
    return this.storage.has(phoneNumber);
  }

  // حذف کدهای قدیمی
  private cleanup(): void {
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    
    for (const [phoneNumber, data] of this.storage.entries()) {
      if (data.timestamp < tenMinutesAgo) {
        this.storage.delete(phoneNumber);
      }
    }
  }

  // دریافت تعداد کدهای موجود
  size(): number {
    return this.storage.size;
  }

  // پاک کردن همه کدها (برای تست)
  clear(): void {
    this.storage.clear();
  }
}

// ایجاد یک instance مشترک
export const otpStorage = new OTPStorage(); 