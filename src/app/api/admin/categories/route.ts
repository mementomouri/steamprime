import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all categories, ordered by position
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { position: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST a new category
export async function POST(request: Request) {
  try {
    const { name, brandColor } = await request.json();
    if (!name || !brandColor) {
      return new NextResponse('Missing name or brandColor', { status: 400 });
    }

    const lastCategory = await prisma.category.findFirst({
      orderBy: { position: 'desc' },
    });

    const newPosition = lastCategory ? lastCategory.position + 1 : 0;

    const newCategory = await prisma.category.create({
      data: { 
        name, 
        brandColor,
        position: newPosition,
      },
    });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
     console.error("Error creating category:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}