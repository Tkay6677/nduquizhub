import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET /api/admin/questions
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const questions = await client.db().collection('questions').find().toArray();
  return NextResponse.json(questions);
}

// POST /api/admin/questions
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { courseCode, question, options, correctAnswer, explanation, difficulty, year, semester, courseId } = await req.json();
  const newQuestion = {
    courseCode,
    question,
    options,
    correctAnswer,
    explanation,
    difficulty,
    year,
    semester,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const client = await clientPromise;
  const result = await client.db().collection('questions').insertOne(newQuestion);

  // Increment question count on the course
  if (courseId) {
    await client.db().collection('courses').updateOne({ _id: new ObjectId(courseId) }, { $inc: { questions: 1 } });
  } else {
    await client.db().collection('courses').updateOne({ code: courseCode }, { $inc: { questions: 1 } });
  }

  return NextResponse.json({ _id: result.insertedId, ...newQuestion });
}
