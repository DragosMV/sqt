'use client'
import React from 'react'
import Loading from './Loading'
import Login from './Login'
import { useAuth } from '@/context/AuthContext'

export default function Summary() {
  const authContext = useAuth()
  if (authContext === null) {
    // Handle the case when context is null (e.g., throw an error, return null, etc.)
    throw new Error('Auth context is missing!');
  }
  const { currentUser, userDataObj, setUserDataObj, loading } = authContext;

  if (loading) {
    return <Loading/>
  }
  
  if (!currentUser) {
    return <Login/>
  }

  return (
    <div>Summary</div>
  )
}
