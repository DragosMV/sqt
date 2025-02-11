"use client"
import { useEffect, useState } from 'react';
import { getUserField } from '@/utils/database_helpers';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/Loading';
import Login from '@/components/Login';

export default function ProfilePage() {
  const [level, setLevel] = useState(null);
  const [points, setPoints] = useState(null);
  const [title, setTitle] = useState(null);

  const authContext = useAuth();

  if (authContext === null) {
    throw new Error('Auth context is missing!');
  }

  const { currentUser, loading } = authContext;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser) {
        // Fetch all the required fields in parallel
        const [userLevel, userPoints, userTitle] = await Promise.all([
          getUserField(currentUser.uid, 'level'),
          getUserField(currentUser.uid, 'points'),
          getUserField(currentUser.uid, 'title'),
        ]);

        // Update the state with the fetched data
        setLevel(userLevel);
        setPoints(userPoints);
        setTitle(userTitle);
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
    <div className="flex flex-col items-center justify-center flex-1 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Welcome to your profile
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
    </div>
  );
}
