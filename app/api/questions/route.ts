import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET /api/questions (public)
export async function GET(req: NextRequest) {
  const client = await clientPromise;
  const { searchParams } = new URL(req.url);
  const courseCode = searchParams.get('courseCode');
  let query = {};
  if (courseCode) {
    query = { courseCode };
  }
  const questions = await client.db().collection('questions').find(query).toArray();
  return NextResponse.json(questions);
}
