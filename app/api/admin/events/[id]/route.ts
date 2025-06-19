import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

// GET /api/admin/events/:id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  const client = await clientPromise;
  const event = await client.db().collection('events').findOne({ _id: new ObjectId(id) });
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  return NextResponse.json(event);
}

// DELETE /api/admin/events/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  const client = await clientPromise;
  const result = await client.db().collection('events').deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount > 0) return NextResponse.json({ success: true });
  return NextResponse.json({ error: 'Event not found' }, { status: 404 });
}

// PUT /api/admin/events/:id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  const { title, description, type, department, startDate, endDate, startTime, endTime, maxParticipants, currentParticipants, courses, prizes, isPublic, requiresRegistration, status } = await req.json();
  const updateDoc = {
    title,
    description,
    type,
    department,
    startDate,
    endDate,
    startTime,
    endTime,
    maxParticipants: Number(maxParticipants),
    currentParticipants: Number(currentParticipants),
    courses,
    prizes,
    isPublic: Boolean(isPublic),
    requiresRegistration: Boolean(requiresRegistration),
    status,
    updatedAt: new Date()
  };
  const client = await clientPromise;
  const result = await client.db().collection('events').updateOne({ _id: new ObjectId(id) }, { $set: updateDoc });
  if (result.modifiedCount > 0) return NextResponse.json({ success: true });
  return NextResponse.json({ error: 'Event not found or no changes' }, { status: 404 });
}
