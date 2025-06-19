import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const users = await db
    .collection('users')
    .find({}, { projection: { passwordHash: 0 } })
    .sort({ totalScore: -1 })
    .toArray();
  return NextResponse.json(users);
}
