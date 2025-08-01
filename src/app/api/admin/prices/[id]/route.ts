import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// تابع برای ویرایش (Update) یک قیمت
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const priceId = Number(id);
    
    if (isNaN(priceId)) {
      return new NextResponse("Invalid Price ID", { status: 400 });
    }

    const body = await request.json();
    const { name, description, productId, categoryId, amount, color, storage, warranty, label } = body;

    if (!name || !amount || !productId || !categoryId) {
      return new NextResponse(JSON.stringify({ message: "Required fields are missing" }), { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: Number(productId) },
        data: { name, description: description || null },
      });
      await tx.price.update({
        where: { id: priceId },
        data: { amount: Number(amount), color: color || null, storage: storage || null, warranty: warranty || null, label: label || 'اصلی' },
      });
      await tx.category.update({
        where: { id: Number(categoryId) },
        data: { updatedAt: new Date() },
      });
    });

    return NextResponse.json({ message: 'Update successful' });
  } catch (error) {
    console.error("Error updating data:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// تابع برای حذف یک قیمت
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const priceId = Number(id);
    
    if (isNaN(priceId)) {
      return new NextResponse("Invalid Price ID", { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      const price = await tx.price.findUnique({
        where: { id: priceId },
        select: { product: { select: { categoryId: true } } },
      });

      if (!price) {
        throw new Error("Price not found");
      }
      
      const categoryId = price.product.categoryId;
      await tx.price.delete({ where: { id: priceId } });
      await tx.category.update({
        where: { id: categoryId },
        data: { updatedAt: new Date() },
      });
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting price:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}