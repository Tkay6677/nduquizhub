import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
//import { ObjectId } from 'mongodb';

// GET /api/courses (public)
export async function GET(req: NextRequest) {
  const client = await clientPromise;
  const db = client.db();
  
  // Get all courses
  const courses = await db.collection('courses').find().toArray();
  
  // Get average scores for each course
  const coursesWithAverages = await Promise.all(courses.map(async (course: any) => {
    const result = await db.collection('quizzes').aggregate([
      { $match: { courseId: course._id.toString() } },
      { $group: {
          _id: '$courseId',
          averageScore: { $avg: '$score' },
          totalQuizzes: { $sum: 1 }
      }}
    ]).toArray();
    
    return {
      ...course,
      averageScore: result[0] ? Math.round(result[0].averageScore) : 0,
      totalQuizzes: result[0]?.totalQuizzes || 0
    };
  }));
  
  return NextResponse.json(coursesWithAverages);
}
