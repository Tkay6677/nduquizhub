import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const quizzes = await db.collection("quizzes").find().toArray();
  return NextResponse.json(quizzes);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { score, badges, course, duration } = await request.json();
  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection('users').findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const totalScore = user.totalScore + score;
  const quizzesCompleted = user.quizzesCompleted + 1;
  const averageScore = Math.round((totalScore / quizzesCompleted) * 10) / 10;
  const updatedStats = { totalScore, quizzesCompleted, averageScore };
  const updatedBadges = Array.from(new Set([...(user.badges || []), ...badges]));
  await db.collection('users').updateOne(
    { email: session.user.email },
    {
      $set: { ...updatedStats, badges: updatedBadges },
      $push: {
        recentActivity: { course, score, date: new Date().toISOString(), duration }
      }
    }
  );

  // Increment student count for the course
  await db.collection('courses').updateOne({ _id: new ObjectId(course) }, { $inc: { students: 1 } });
  return NextResponse.json({ ok: true, updated: { ...updatedStats, badges: updatedBadges } });
}
