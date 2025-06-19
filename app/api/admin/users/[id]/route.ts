import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

// GET /api/admin/users/:id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  const client = await clientPromise;
  const user = await client.db().collection('users').findOne(
    { _id: new ObjectId(id) },
    { projection: { passwordHash: 0 } }
  );
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json(user);
}

// PUT /api/admin/users/:id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  const { name, department, level, role, status, phone, lastActive } = await req.json();
  const updateDoc: any = { name, department, level, role, status, phone };
  if (lastActive) updateDoc.lastActive = lastActive;
  const client = await clientPromise;
  const result = await client.db().collection('users').updateOne(
    { _id: new ObjectId(id) },
    { $set: updateDoc }
  );
  if (result.modifiedCount > 0) return NextResponse.json({ success: true });
  return NextResponse.json({ error: 'User not found or no changes' }, { status: 404 });
}

// DELETE /api/admin/users/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = params;
  const client = await clientPromise;
  const result = await client.db().collection('users').deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount > 0) return NextResponse.json({ success: true });
  return NextResponse.json({ error: 'User not found' }, { status: 404 });
}
