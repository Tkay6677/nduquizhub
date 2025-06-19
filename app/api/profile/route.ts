import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const client = await clientPromise;
  const db = client.db();
  
  // Get user profile
  const user = await db.collection('users').findOne(
    { email: session.user.email },
    { projection: { passwordHash: 0 } }
  );
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  
  // Get recent activities with course details
  const activities = user.recentActivity || [];
  const activitiesWithCourse = await Promise.all(activities.map(async (activity: any) => {
    let courseTitle = 'Unknown Course';
    
    try {
      if (activity.courseId) {
        const course = await db.collection('courses').findOne(
          { _id: new ObjectId(activity.courseId) },
          { projection: { title: 1 } }
        );
        courseTitle = course?.title || 'Unknown Course';
      } else if (activity.course) {
        // Fallback for older entries that might have course name directly
        courseTitle = activity.course;
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    }
    
    // Format date as 'X days ago'
    const now = new Date();
    const activityDate = new Date(activity.date);
    const diffTime = Math.abs(now.getTime() - activityDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const dateText = diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    
    return {
      course: courseTitle,
      score: activity.score,
      date: dateText
    };
  }));
  
  return NextResponse.json({
    ...user,
    recentActivity: activitiesWithCourse
  });
}
