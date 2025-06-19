import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET /api/admin/events
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = await clientPromise;
  const events = await client.db().collection('events').find().toArray();
  return NextResponse.json(events);
}

// POST /api/admin/events
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, description, type, department, startDate, endDate, startTime, endTime, maxParticipants, courses, prizes, isPublic, requiresRegistration, status } = await req.json();
  const newEvent = {
    title,
    description,
    type,
    department,
    startDate,
    endDate,
    startTime,
    endTime,
    maxParticipants: Number(maxParticipants),
    currentParticipants: 0,
    courses,
    prizes,
    isPublic: Boolean(isPublic),
    requiresRegistration: Boolean(requiresRegistration),
    status,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const client = await clientPromise;
  const result = await client.db().collection('events').insertOne(newEvent);
  return NextResponse.json({ _id: result.insertedId, ...newEvent });
}
