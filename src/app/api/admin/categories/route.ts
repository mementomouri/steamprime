import { NextResponse, NextRequest } from 'next/server';
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
      orderBy: {
        position: 'asc',
      },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    });
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(
      JSON.stringify({ message: "Error fetching categories", details: errorMessage }),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // بررسی احراز هویت
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { name, brandColor } = body;

    if (!name || !name.trim()) {
      return new NextResponse('Name is required', { status: 400 });
    }

    // بررسی تکراری نبودن نام
    const existingCategory = await prisma.category.findUnique({
      where: { name: name.trim() }
    });

    if (existingCategory) {
      return new NextResponse('Category name already exists', { status: 400 });
    }

    // پیدا کردن آخرین position
    const lastCategory = await prisma.category.findFirst({
      orderBy: { position: 'desc' }
    });

    const newPosition = (lastCategory?.position || 0) + 1;

    const newCategory = await prisma.category.create({
      data: {
        name: name.trim(),
        brandColor: brandColor || null,
        position: newPosition,
        isActive: true
      }
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(
      JSON.stringify({ message: "Error creating category", details: errorMessage }),
      { status: 500 }
    );
  }
}
