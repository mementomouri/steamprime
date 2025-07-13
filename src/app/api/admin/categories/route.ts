import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // <-- اصلاح شد

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        position: 'asc',
      },
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