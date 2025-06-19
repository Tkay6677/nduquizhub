import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

// GET /api/admin/courses/:id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  const client = await clientPromise;
  const course = await client.db().collection('courses').findOne({ _id: new ObjectId(id) });
  if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  return NextResponse.json(course);
}


// DELETE /api/admin/courses/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  const client = await clientPromise;
  const result = await client.db().collection('courses').deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount > 0) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: 'Course not found' }, { status: 404 });
}

// PUT /api/admin/courses/:id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  const body = await req.json();
  const { code, title, department, level, difficulty, instructor, description, timeLimit } = body;
  const updateDoc = {
    code,
    title,
    department,
    level,
    difficulty,
    instructor,
    description,
    timeLimit: Number(timeLimit),
    updatedAt: new Date()
  };

  const client = await clientPromise;
  const result = await client.db().collection('courses').updateOne(
    { _id: new ObjectId(id) },
    { $set: updateDoc }
  );
  if (result.modifiedCount > 0) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: 'Course not found or no changes' }, { status: 404 });
}
