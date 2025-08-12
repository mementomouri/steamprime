import { NextResponse } from 'next/server';
import { otpStorage } from '@/lib/otp-storage';

export async function GET() {
  try {
    // دریافت اطلاعات debug از OTP storage
    const debugInfo = {
      totalOTPs: otpStorage.size(),
      timestamp: new Date().toISOString(),
      message: "OTP Storage Debug Info"
    };

    return NextResponse.json(debugInfo);
  } catch (error) {
    return NextResponse.json(
      { error: "خطا در دریافت اطلاعات debug" },
      { status: 500 }
    );
  }
} 