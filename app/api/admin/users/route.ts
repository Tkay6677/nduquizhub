import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { hash } from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET /api/admin/users
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const client = await clientPromise;
  const users = await client.db()
    .collection('users')
    .find(
      {},
      {
        projection: { passwordHash: 0 },
        sort: { createdAt: -1 },
        limit: 100
      }
    )
    .toArray();
  return NextResponse.json(users);
}

// POST /api/admin/users
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { name, email, password, department, level, role, status, phone } = await req.json();
  const passwordHash = await hash(password, 10);
  const joinDate = new Date().toISOString();
  const newUser = {
    name,
    email,
    passwordHash,
    department,
    level,
    role,
    status,
    phone,
    joinDate,
    lastActive: joinDate,
    quizzesCompleted: 0,
    averageScore: 0,
    badges: [],
    createdAt: new Date()
  };
  const client = await clientPromise;
  const result = await client.db().collection('users').insertOne(newUser);
  return NextResponse.json({ _id: result.insertedId, ...newUser });
}
