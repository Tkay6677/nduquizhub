import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

// GET /api/admin/questions/:id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  const client = await clientPromise;
  const question = await client.db().collection('questions').findOne({ _id: new ObjectId(id) });
  if (!question) return NextResponse.json({ error: 'Question not found' }, { status: 404 });
  return NextResponse.json(question);
}

// DELETE /api/admin/questions/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  const client = await clientPromise;
  const result = await client.db().collection('questions').deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount > 0) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: 'Question not found' }, { status: 404 });
}

// PUT /api/admin/questions/:id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  const { courseCode, question, options, correctAnswer, explanation, difficulty, year, semester } = await req.json();
  const updateDoc = {
    courseCode,
    question,
    options,
    correctAnswer,
    explanation,
    difficulty,
    year,
    semester,
    updatedAt: new Date()
  };

  const client = await clientPromise;
  const collection = client.db().collection('questions');
  const existing = await collection.findOne({ _id: new ObjectId(id) });
  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateDoc }
  );
  if (result.modifiedCount > 0) {
    // Adjust question counts if courseCode changed
    if (existing && existing.courseCode !== updateDoc.courseCode) {
      await client.db().collection('courses').updateOne({ code: existing.courseCode }, { $inc: { questions: -1 } });
      await client.db().collection('courses').updateOne({ code: updateDoc.courseCode }, { $inc: { questions: 1 } });
    }
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: 'Question not found or no changes' }, { status: 404 });
}
