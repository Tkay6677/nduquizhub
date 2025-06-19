import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET /api/courses (public)
export async function GET(req: NextRequest) {
  const client = await clientPromise;
  const courses = await client.db().collection('courses').find().toArray();
  return NextResponse.json(courses);
}
