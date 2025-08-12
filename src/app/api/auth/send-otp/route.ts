import { NextRequest, NextResponse } from 'next/server';
import { otpStorage } from '@/lib/otp-storage';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { message: "شماره موبایل الزامی است." },
        { status: 400 }
      );
    }

    // بررسی فرمت شماره موبایل
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { message: "فرمت شماره موبایل صحیح نیست. مثال: 09123456789" },
        { status: 400 }
      );
    }

    // بررسی اینکه آیا کد قبلی هنوز معتبر است (کمتر از 2 دقیقه)
    const existingOTP = otpStorage.get(phoneNumber);
    if (existingOTP && Date.now() - existingOTP.timestamp < 2 * 60 * 1000) {
      return NextResponse.json(
        { message: "لطفاً 2 دقیقه صبر کنید و دوباره تلاش کنید." },
        { status: 429 }
      );
    }

    // ساخت یک کد تصادفی 6 رقمی
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ذخیره موقت کد برای تأیید بعدی
    otpStorage.set(phoneNumber, otp);

    // نمایش کد در ترمینال سرور
    console.log('='.repeat(50));
    console.log(`📱 کد تایید برای شماره ${phoneNumber}:`);
    console.log(`🔐 کد: ${otp}`);
    console.log(`⏰ زمان: ${new Date().toLocaleString('fa-IR')}`);
    console.log('='.repeat(50));

    // ارسال واقعی SMS از طریق SMS.ir
    try {
      const apiKey = process.env.SMS_IR_API_KEY || "YOUR_SMS_IR_API_KEY";
      const templateId = parseInt(process.env.SMS_IR_TEMPLATE_ID || "100000");
      
      if (apiKey === "YOUR_SMS_IR_API_KEY") {
        console.log("⚠️  کلید API SMS.ir تنظیم نشده است. لطفاً متغیر محیطی SMS_IR_API_KEY را تنظیم کنید.");
        // در صورت عدم تنظیم API، فقط کد در کنسول نمایش داده می‌شود
      } else {
        const smsResponse = await fetch('https://api.sms.ir/v1/send/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey
          },
          body: JSON.stringify({
            mobile: phoneNumber,
            templateId: templateId,
            parameters: [{ name: "CODE", value: otp }]
          })
        });

        const smsData = await smsResponse.json();
        
        if (smsResponse.ok && smsData.status === 1) {
          console.log('✅ SMS با موفقیت ارسال شد:', smsData);
        } else {
          console.log('❌ خطا در ارسال SMS:', smsData);
        }
      }
    } catch (smsError) {
      console.error('❌ خطا در ارتباط با SMS.ir:', smsError);
      // در صورت خطا، سیستم همچنان کار می‌کند و کد در کنسول نمایش داده می‌شود
    }

    return NextResponse.json({
      message: "کد تأیید با موفقیت ارسال شد.",
      success: true
    });

  } catch (error) {
    console.error('خطا در ارسال OTP:', error);
    return NextResponse.json(
      { message: "خطا در ارسال کد تأیید. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
} 