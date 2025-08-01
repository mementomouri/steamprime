import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // بررسی احراز هویت
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { orderedIds } = body;
    
    // اعتبارسنجی داده‌های ورودی
    if (!orderedIds || !Array.isArray(orderedIds)) {
      return new NextResponse('Invalid data format', { status: 400 });
    }

    // بررسی اینکه همه ID ها عدد هستند
    if (!orderedIds.every(id => typeof id === 'number' && id > 0)) {
      return new NextResponse('Invalid product IDs', { status: 400 });
    }

    // بررسی تعداد آیتم‌ها (محدودیت برای جلوگیری از حملات)
    if (orderedIds.length > 1000) {
      return new NextResponse('Too many items to reorder', { status: 400 });
    }

    // بررسی وجود محصولات در پایگاه داده
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: orderedIds } },
      select: { id: true }
    });

    const existingIds = existingProducts.map(p => p.id);
    const missingIds = orderedIds.filter(id => !existingIds.includes(id));

    if (missingIds.length > 0) {
      return new NextResponse(`Products not found: ${missingIds.join(', ')}`, { status: 404 });
    }

    // بررسی تکراری نبودن ID ها
    const uniqueIds = [...new Set(orderedIds)];
    if (uniqueIds.length !== orderedIds.length) {
      return new NextResponse('Duplicate product IDs', { status: 400 });
    }

    // به‌روزرسانی ترتیب محصولات
    const updatePromises = orderedIds.map((id: number, index: number) =>
      prisma.product.update({
        where: { id: id },
        data: { position: index },
      })
    );

    await prisma.$transaction(updatePromises);

    return NextResponse.json({ 
      message: 'Product order updated successfully',
      updatedCount: orderedIds.length
    });
  } catch (error) {
    console.error("Error reordering products:", error);
    
    // بررسی نوع خطا و ارسال پیام مناسب
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return new NextResponse('Duplicate product position', { status: 409 });
      }
      if (error.message.includes('Foreign key constraint')) {
        return new NextResponse('Invalid product reference', { status: 400 });
      }
    }
    
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 