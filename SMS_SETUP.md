# راهنمای کامل راه‌اندازی SMS.ir

## 🚀 مراحل راه‌اندازی:

### 1. **ثبت‌نام در SMS.ir**
- به [SMS.ir](https://sms.ir) بروید
- حساب کاربری ایجاد کنید
- شماره موبایل خود را تایید کنید

### 2. **دریافت کلید API**
1. وارد پنل کاربری شوید
2. به بخش "تنظیمات" → "API" بروید
3. کلید API خود را کپی کنید
4. این کلید معمولاً 32 کاراکتر است

### 3. **ایجاد الگوی SMS**
1. در پنل SMS.ir، به بخش "الگوها" بروید
2. روی "ایجاد الگوی جدید" کلیک کنید
3. نام الگو: "کد تایید ورود"
4. متن الگو:
```
کد تایید شما: {{CODE}}
تایگر موبایل
```
5. شماره الگو را یادداشت کنید

### 4. **تنظیم متغیرهای محیطی**

#### **روش 1: فایل .env.local**
1. فایل `env.example` را کپی کنید
2. نام آن را به `.env.local` تغییر دهید
3. مقادیر واقعی را وارد کنید:

```bash
# فایل .env.local
SMS_IR_API_KEY=e5zgPqeY2YaPwPXRGaoF1kgnfRHHLDFqIGSjgV981WB4JV6y
SMS_IR_TEMPLATE_ID=100000
```

#### **روش 2: متغیرهای محیطی سیستم**
```bash
# Windows (CMD)
set SMS_IR_API_KEY=e5zgPqeY2YaPwPXRGaoF1kgnfRHHLDFqIGSjgV981WB4JV6y
set SMS_IR_TEMPLATE_ID=100000

# Windows (PowerShell)
$env:SMS_IR_API_KEY="e5zgPqeY2YaPwPXRGaoF1kgnfRHHLDFqIGSjgV981WB4JV6y"
$env:SMS_IR_TEMPLATE_ID="100000"

# Linux/Mac
export SMS_IR_API_KEY=e5zgPqeY2YaPwPXRGaoF1kgnfRHHLDFqIGSjgV981WB4JV6y
export SMS_IR_TEMPLATE_ID=100000
```

### 5. **تست سیستم**
1. سرور را مجدداً راه‌اندازی کنید:
```bash
npm run dev
```

2. شماره موبایل خود را در صفحه ورود وارد کنید
3. کد تایید باید به شماره شما ارسال شود

## 🔧 عیب‌یابی:

### **مشکل: "کلید API تنظیم نشده"**
- فایل `.env.local` را بررسی کنید
- سرور را مجدداً راه‌اندازی کنید
- متغیرهای محیطی را چک کنید

### **مشکل: "خطا در ارسال SMS"**
- کلید API را بررسی کنید
- شماره الگو را چک کنید
- اعتبار حساب SMS.ir را بررسی کنید

### **مشکل: "کد ارسال نشد"**
- کنسول سرور را چک کنید
- Network tab مرورگر را بررسی کنید
- API endpoint ها را تست کنید

## 📱 تست API:

### **تست مستقیم با curl:**
```bash
# ارسال کد
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "09123456789"}'

# تایید کد
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "09123456789", "code": "123456"}'
```

### **تست با فایل HTML:**
فایل `test-otp.html` را در مرورگر باز کنید

## 💰 هزینه‌ها:

- **ثبت‌نام**: رایگان
- **هر SMS**: حدود 50 تومان
- **اعتبار اولیه**: معمولاً 1000 تومان

## 🛡️ امنیت:

- کلید API را در کد قرار ندهید
- فایل `.env.local` را در git commit نکنید
- از HTTPS در production استفاده کنید

## 📞 پشتیبانی:

- **SMS.ir**: 021-75000000
- **مستندات**: [docs.sms.ir](https://docs.sms.ir)

---

## ✅ چک‌لیست نهایی:

- [ ] حساب SMS.ir ایجاد شده
- [ ] کلید API دریافت شده
- [ ] الگوی SMS ایجاد شده
- [ ] فایل `.env.local` تنظیم شده
- [ ] سرور مجدداً راه‌اندازی شده
- [ ] تست ارسال SMS موفق بوده
- [ ] تست تایید کد موفق بوده

پس از تکمیل این مراحل، سیستم OTP شما کاملاً آماده خواهد بود! 🎉 