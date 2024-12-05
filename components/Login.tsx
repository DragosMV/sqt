'use client'
import React, { useState} from 'react'
import Button from './Button';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [authenticating, setAuthenticating] = useState(false)

  const authContext = useAuth();

  if (!authContext) {
    return <div>Loading...</div>;
  }
  const {signup, login, loginWithGoogle, loading} = authContext

  async function handleSubmit() {
    if (!email || !password || password.length < 6) {
      return
    }
    setAuthenticating(true)
    try {
      if (isRegister) {
        console.log('Signing up a new user')
        await signup(email, password)
      } else {
        console.log('Logging in existing user')
        await login(email, password)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
          console.log(err.message);
      } else {
          console.log('An unknown error occurred');
    }
  } finally {
    setAuthenticating(false)
  }
}
async function handleGoogleLogin() {
  try {
    console.log('Logging in with Google');
    await loginWithGoogle();
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log('Google login error:', err.message);
    } else {
      console.log('An unknown error occurred during Google login');
    }
  }
}

  return (
    <div className='flex flex-col flex-1 justify-center items-center gap-4'>
      <h3 className={`text-4xl sm:text-5xl md:text-6xl`}>
        {isRegister ? 'Register' : 'Log in'}
      </h3>
      <p>You&#39;re almost there!</p>
      <input value={email} onChange={(e) => {setEmail(e.target.value)}} className='w-full max-w-[400px] mx-auto px-3 duration-200 hover: border-cyan-600 focus:border-cyan-600 
      py-2 sm:py-3 border border-solid border-cyan-400 rounded-full outline-none' placeholder='Email'/>
      <input value={password} onChange={(e) => {setPassword(e.target.value)}} className='w-full max-w-[400px] mx-auto px-3 duration-200 hover: border-cyan-600 focus:border-cyan-600 
      py-2 sm:py-3 border border-solid border-cyan-400 rounded-full outline-none' placeholder='Password' type='password'/>
      <div className='max-w-[400px] w-full mx-auto'>
      <Button clickHandler={handleSubmit} text={authenticating ? 'Submitting' : "Submit"} full />
      </div>
      <p className='text-center'>
      {isRegister ? 'Already have an account? ' : 'Don\'t have an account? '}<button onClick={() => setIsRegister(!isRegister)} className='text-cyan-600'> {isRegister ? 'Sign in' : 'Sign up'}</button>
      </p>
      <div className="flex items-center justify-center mt-4">
        <button
          onClick={handleGoogleLogin}
          disabled={loading || authenticating}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-full hover:bg-gray-100 shadow"
        >
          <img
            src="/google-icon.png" // Use the path to your Google icon or logo
            alt="Google logo"
            className="w-6 h-6"
          />
          {loading ? 'Loading...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  )
}

