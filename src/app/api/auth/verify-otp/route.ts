import { NextRequest, NextResponse } from 'next/server';
import { otpStorage } from '@/lib/otp-storage';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, code } = await request.json();

    if (!phoneNumber || !code) {
      return NextResponse.json(
        { message: "شماره موبایل و کد تأیید الزامی است." },
        { status: 400 }
      );
    }

    // بررسی فرمت شماره موبایل
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { message: "فرمت شماره موبایل صحیح نیست." },
        { status: 400 }
      );
    }

    // بررسی اینکه آیا کد وارد شده 6 رقمی است
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { message: "کد تأیید باید 6 رقمی باشد." },
        { status: 400 }
      );
    }

    const storedOTP = otpStorage.get(phoneNumber);

    // بررسی اینکه آیا کد برای این شماره وجود دارد
    if (!storedOTP) {
      return NextResponse.json(
        { message: "کد تأیید برای این شماره یافت نشد. لطفاً دوباره درخواست کنید." },
        { status: 400 }
      );
    }

    // بررسی اینکه آیا کد منقضی شده است (بیش از 10 دقیقه)
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    if (storedOTP.timestamp < tenMinutesAgo) {
      otpStorage.delete(phoneNumber);
      return NextResponse.json(
        { message: "کد تأیید منقضی شده است. لطفاً دوباره تلاش کنید." },
        { status: 400 }
      );
    }

    // بررسی صحت کد
    if (storedOTP.code === code) {
          // پس از تأیید موفق، کد را حذف می‌کنیم تا دوباره استفاده نشود
    otpStorage.delete(phoneNumber);
      
      return NextResponse.json({
        message: "ورود موفقیت‌آمیز بود.",
        success: true,
        phoneNumber: phoneNumber
      });
    } else {
      return NextResponse.json(
        { message: "کد وارد شده صحیح نیست." },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('خطا در تایید OTP:', error);
    return NextResponse.json(
      { message: "خطا در تایید کد. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
} 