import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password === process.env.ADMIN_PASSWORD) {
    const session = await getSession();
    session.isLoggedIn = true;
    await session.save();
    return NextResponse.json({ ok: true });
  }

  return new NextResponse('Unauthorized', { status: 401 });
}