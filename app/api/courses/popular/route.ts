import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET /api/courses/popular
export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  
  try {
    // Get courses with the most quiz attempts
    const popularCourses = await db.collection('quizzes').aggregate([
      {
        $group: {
          _id: '$courseId',
          attempts: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      },
      { $sort: { attempts: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course'
        }
      },
      { $unwind: '$course' },
      {
        $project: {
          _id: 0,
          course: '$course.title',
          department: '$course.department',
          questions: '$course.questions',
          attempts: 1,
          averageScore: { $round: ['$averageScore', 1] }
        }
      }
    ]).toArray();

    return NextResponse.json(popularCourses);
  } catch (error) {
    console.error('Error fetching popular courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popular courses' },
      { status: 500 }
    );
  }
}
