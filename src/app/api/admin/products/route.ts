import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// تابع GET بدون تغییر باقی می‌ماند
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { position: 'asc' },
      include: {
        products: {
          orderBy: { name: 'asc' },
          include: {
            prices: {
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching data:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error", details: errorMessage }),
      { status: 500 }
    );
  }
}

// تابع POST برای افزودن محصول و قیمت
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, categoryId, amount, color, storage, warranty, label } = body;

    if (!name || !categoryId || !amount) {
      return new NextResponse(JSON.stringify({ message: "Name, categoryId, and amount are required" }), { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // ۱. ساخت محصول جدید
      const newProduct = await tx.product.create({
        data: { name, description: description || null, categoryId: Number(categoryId) },
      });

      // ۲. ساخت قیمت اولیه برای آن محصول
      await tx.price.create({
        data: { amount: Number(amount), productId: newProduct.id, color: color || null, storage: storage || null, warranty: warranty || null, label: label || 'اصلی' },
      });

      // ۳. آپدیت کردن زمان بروزرسانی دسته‌بندی
      await tx.category.update({
        where: { id: Number(categoryId) },
        data: { updatedAt: new Date() },
      });

      return newProduct;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(
      JSON.stringify({ message: "Error creating product", details: errorMessage }),
      { status: 500 }
    );
  }
}