import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET /api/admin/courses
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const courses = await client.db().collection('courses').find().toArray();
  return NextResponse.json(courses);
}

// POST /api/admin/courses
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { code, title, department, level, difficulty, instructor, description, timeLimit } = body;
  
  
  const newCourse = { code, title, department, level, difficulty, instructor, description, timeLimit: Number(timeLimit), questions: 0, students: 0, status: 'active', createdAt: new Date() };

  const client = await clientPromise;
  const result = await client.db().collection('courses').insertOne(newCourse);
  return NextResponse.json({ _id: result.insertedId, ...newCourse });
}
