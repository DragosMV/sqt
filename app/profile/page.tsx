"use client"
import { useEffect, useState } from 'react';
import { getUserField } from '@/utils/database_helpers';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/Loading';
import Login from '@/components/Login';

function scaleScore(score: number, maxScore: number = 70): number {
  return Math.round((score / maxScore) * 100);
}

export default function ProfilePage() {
  const [level, setLevel] = useState<number>(1);
  const [points, setPoints] = useState<number | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [coursesCompleted, setCoursesCompelted] = useState<number>(0);
  const [knowledgePoints, setKnowledgePoints] = useState<number | null>(null);
  const [conceptUnderstandingPoints, setConceptUnderstandingPoints] = useState<number | null>(null);
  const [conceptApplicationPoints, setConceptApplicationPoints] = useState<number | null>(null);

  const authContext = useAuth();

  if (authContext === null) {
    throw new Error('Auth context is missing!');
  }

  const { currentUser, loading } = authContext;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser) {
        // fetch points
        const userPointsRaw = await getUserField(currentUser.uid, "points");
        const userPoints = userPointsRaw ? Number(userPointsRaw) : 0;
        setPoints(userPoints);

        // Determine level based on points
        const calculatedLevel = Math.floor(userPoints / 10) + 1;
        setLevel(calculatedLevel);
        // Determine title based on points
        let calculatedTitle = "Beginner";
        if (userPoints >= 70) calculatedTitle = "Master";
        else if (userPoints >= 50) calculatedTitle = "Expert";
        else if (userPoints >= 30) calculatedTitle = "Intermediate";
        else if (userPoints >= 10) calculatedTitle = "Novice";
        setTitle(calculatedTitle);

        const coursesCompleted = await getUserField(currentUser.uid, "coursesCompleted");
        setCoursesCompelted(coursesCompleted)

        // knowledgePoints
        const knowledgePointsRaw = await getUserField(currentUser.uid, "knowledgePoints");
        setKnowledgePoints(knowledgePointsRaw ? Number(knowledgePointsRaw) : 0);

        // conceptUnderstandingPoints
        const conceptUnderstandingPointsRaw = await getUserField(currentUser.uid, "conceptUnderstandingPoints");
        setConceptUnderstandingPoints(conceptUnderstandingPointsRaw ? Number(conceptUnderstandingPointsRaw) : 0);

        // conceptApplicationPoints
        const conceptApplicationPointsRaw = await getUserField(currentUser.uid, "conceptApplicationPoints");
        setConceptApplicationPoints(conceptApplicationPointsRaw ? Number(conceptApplicationPointsRaw) : 0);
      }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [currentUser]);

  if (loading) {
    return <Loading/>
  }

  if (!currentUser) {
    return <Login/>
  }

  return (
    <div className="flex flex-col items-center justify-start flex-1 p-4 pt-32">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Welcome to your profile!
      </h1>
      <div className="text-xl text-gray-700">
        <p>
          <strong>Level:</strong> {level}
        </p>
        <p>
          <strong>Points:</strong> {points}
        </p>
        <p>
          <strong>Title:</strong> {title}
        </p>
      </div>
      {/* Conditional Course 1 Feedback Section */}
    {coursesCompleted > 0 && (
      <section className="mt-8 w-full max-w-lg p-4 bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Course 1 Feedback
        </h2>

        {/* Progress bars container */}
        <div className="space-y-4">
          {/* Progress Bar 1 */}
          <div>
            <p>Your knowledge retention score is: {knowledgePoints !== null ? scaleScore(knowledgePoints, 40) : 0} / 100</p>
            <div className="w-full bg-gray-300 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{ width: `${knowledgePoints !== null ? scaleScore(knowledgePoints, 40) : 0}%` }}
              />
            </div>
          </div>

          {/* Progress Bar 2 */}
          <div>
            <p>Your concept understanding score is: {conceptUnderstandingPoints !== null ? scaleScore(conceptUnderstandingPoints, 70) : 0} / 100</p>
            <div className="w-full bg-gray-300 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{ width: `${conceptUnderstandingPoints !== null ? scaleScore(conceptUnderstandingPoints, 70) : 0}%` }}
              />
            </div>
          </div>

          {/* Progress Bar 3 */}
          <div>
            <p>Your concept application score is: {conceptApplicationPoints !== null ? scaleScore(conceptApplicationPoints, 30) : 0} / 100</p>
            <div className="w-full bg-gray-300 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{ width: `${conceptApplicationPoints !== null ? scaleScore(conceptApplicationPoints, 30) : 0}%` }}
              />
            </div>
          </div>
        </div>
      </section>
    )}
  </div>
  );
};