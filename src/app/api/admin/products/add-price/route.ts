import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, productId, categoryId, amount, color, storage, warranty, label } = body;

    if (!name || !amount || !productId || !categoryId) {
      return new NextResponse(JSON.stringify({ message: "Required fields are missing" }), { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      // Update the product information
      await tx.product.update({
        where: { id: Number(productId) },
        data: { name, description: description || null },
      });

      // Create a new price for the product
      await tx.price.create({
        data: {
          amount: Number(amount),
          color: color || null,
          storage: storage || null,
          warranty: warranty || null,
          label: label || 'اصلی',
          productId: Number(productId),
        },
      });

      // Update category timestamp
      await tx.category.update({
        where: { id: Number(categoryId) },
        data: { updatedAt: new Date() },
      });
    });

    return NextResponse.json({ message: 'Price added successfully' });
  } catch (error) {
    console.error("Error adding price:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 