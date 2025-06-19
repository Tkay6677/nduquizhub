import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const users = await db
    .collection('users')
    .find(
      {},
      {
        projection: { 
          _id: 1,
          email: 1,
          name: 1,
          image: 1,
          totalScore: 1,
          quizzesCompleted: 1,
          averageScore: 1,
          badges: 1,
          lastActive: 1
        },
      }
    )
    .sort({ totalScore: -1, lastActive: -1 })
    .limit(100)
    .toArray();
  return NextResponse.json(users);
}
