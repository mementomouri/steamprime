import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.SMS_IR_API_KEY;
    
    if (!apiKey || apiKey === "YOUR_SMS_IR_API_KEY") {
      return NextResponse.json(
        { error: "کلید API تنظیم نشده است" },
        { status: 400 }
      );
    }

    // دریافت لیست الگوهای موجود
    const response = await fetch('https://api.sms.ir/v1/send/verify', {
      method: 'GET',
      headers: {
        'X-API-KEY': apiKey
      }
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        success: true,
        templates: data,
        message: "لیست الگوها دریافت شد"
      });
    } else {
      const errorData = await response.json();
      return NextResponse.json(
        { 
          error: "خطا در دریافت الگوها",
          details: errorData
        },
        { status: response.status }
      );
    }

  } catch (error) {
    console.error('خطا در دریافت الگوها:', error);
    return NextResponse.json(
      { error: "خطا در ارتباط با SMS.ir" },
      { status: 500 }
    );
  }
} 