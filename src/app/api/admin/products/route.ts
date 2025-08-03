import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    // بررسی احراز هویت
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const categories = await prisma.category.findMany({
      where: {
        isActive: true // فقط دسته‌بندی‌های فعال
      },
      orderBy: { position: 'asc' },
      include: {
        products: {
          orderBy: { position: 'asc' },
          include: {
            prices: {
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    });

    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error", details: errorMessage }),
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // بررسی احراز هویت
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { name, description, categoryId, amount, color, storage, warranty, label } = body;

    // اعتبارسنجی داده‌های ورودی
    if (!name || !categoryId || !amount) {
      return new NextResponse(
        JSON.stringify({ message: "Name, categoryId, and amount are required" }), 
        { status: 400 }
      );
    }

    // بررسی وجود دسته‌بندی
    const category = await prisma.category.findUnique({
      where: { id: Number(categoryId) },
    });

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }), 
        { status: 404 }
      );
    }

    // بررسی اعتبار قیمت
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid amount" }), 
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // ایجاد محصول جدید
      const newProduct = await tx.product.create({
        data: { 
          name: name.trim(), 
          description: description?.trim() || null, 
          categoryId: Number(categoryId),
          position: 0, // موقعیت پیش‌فرض
        },
      });

      // ایجاد قیمت برای محصول
      await tx.price.create({
        data: { 
          amount: Number(amount), 
          productId: newProduct.id, 
          color: color?.trim() || null, 
          storage: storage?.trim() || null, 
          warranty: warranty?.trim() || null, 
          label: label?.trim() || 'اصلی' 
        },
      });

      // به‌روزرسانی زمان دسته‌بندی
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

export async function DELETE(request: Request) {
  try {
    // بررسی احراز هویت
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId || isNaN(Number(productId))) {
      return new NextResponse(
        JSON.stringify({ message: "Valid productId is required" }), 
        { status: 400 }
      );
    }

    // بررسی وجود محصول
    const product = await prisma.product.findUnique({
      where: { id: Number(productId) },
      include: { prices: true }
    });

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }), 
        { status: 404 }
      );
    }

    // حذف محصول و تمام قیمت‌های مربوط به آن
    await prisma.$transaction(async (tx) => {
      // حذف تمام قیمت‌های محصول
      await tx.price.deleteMany({
        where: { productId: Number(productId) }
      });

      // حذف محصول
      await tx.product.delete({
        where: { id: Number(productId) }
      });

      // به‌روزرسانی زمان دسته‌بندی
      await tx.category.update({
        where: { id: product.categoryId },
        data: { updatedAt: new Date() },
      });
    });

    return new NextResponse(
      JSON.stringify({ message: "Product deleted successfully" }), 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(
      JSON.stringify({ message: "Error deleting product", details: errorMessage }),
      { status: 500 }
    );
  }
}