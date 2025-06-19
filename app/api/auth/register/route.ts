import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { hash } from 'bcryptjs';

export async function POST(request: Request) {
  const { name, email, password, department, level } = await request.json();
  const client = await clientPromise;
  const db = client.db();

  const existing = await db.collection('users').findOne({ email });
  if (existing) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const passwordHash = await hash(password, 10);
  const newUser = {
    name,
    email,
    passwordHash,
    department,
    level,
    role: 'user',
    badges: ['Welcome to NDU Quiz Hub'],
    totalScore: 0,
    quizzesCompleted: 0,
    averageScore: 0
  };

  await db.collection('users').insertOne(newUser);
  return NextResponse.json({ ok: true });
}
