import { NextResponse } from 'next/server';
import  prisma  from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// تابع برای آپدیت کردن یک قیمت و محصول مرتبط با آن
export async function PUT(request: Request, { params }: Params) {
  try {
    const priceId = Number(params.id);
    const body = await request.json();
    const { name, description, productId, categoryId, amount, color, storage, warranty, label } = body;

    if (!name || !amount || !productId || !categoryId) {
      return new NextResponse(JSON.stringify({ message: "Required fields are missing" }), { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      // ۱. آپدیت کردن محصول
      await tx.product.update({
        where: { id: Number(productId) },
        data: { name, description: description || null },
      });

      // ۲. آپدیت کردن قیمت
      await tx.price.update({
        where: { id: priceId },
        data: { amount: Number(amount), color: color || null, storage: storage || null, warranty: warranty || null, label: label || 'اصلی' },
      });

      // ۳. آپدیت کردن زمان بروزرسانی دسته‌بندی
      await tx.category.update({
        where: { id: Number(categoryId) },
        data: { updatedAt: new Date() },
      });
    });

    return NextResponse.json({ message: 'Update successful' });

  } catch (error) {
    console.error("Error updating data:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(
      JSON.stringify({ message: "Error updating data", details: errorMessage }),
      { status: 500 }
    );
  }
}

// تابع برای حذف قیمت
export async function DELETE(request: Request, { params }: Params) {
  try {
    const priceId = Number(params.id);

    await prisma.$transaction(async (tx) => {
      // ۱. پیدا کردن قیمت و اطلاعات دسته‌بندی والد آن
      const price = await tx.price.findUnique({
        where: { id: priceId },
        select: { product: { select: { categoryId: true } } },
      });

      if (!price) {
        throw new Error("Price not found");
      }
      
      const categoryId = price.product.categoryId;

      // ۲. حذف قیمت
      await tx.price.delete({ where: { id: priceId } });

      // ۳. آپدیت کردن زمان بروزرسانی دسته‌بندی
      await tx.category.update({
        where: { id: categoryId },
        data: { updatedAt: new Date() },
      });
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting price:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(
      JSON.stringify({ message: "Error deleting price", details: errorMessage }),
      { status: 500 }
    );
  }
}