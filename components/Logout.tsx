'use client'
import React from 'react'
import Button from './Button'
import { useAuth } from '@/context/AuthContext'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Logout() {
    
    const authContext = useAuth();
    const pathname = usePathname()

    if (!authContext) {
      return <div>Loading...</div>;
    }
    const { logout, currentUser } = authContext

    if (!currentUser) {
        return null
    }

    if (pathname === '/') {
        return (
            <Link href={'/summary'}>
                <Button text="Go to dashboard" />
            </Link>
        )
    }

    return (
        <Button text='Logout' clickHandler={logout} />
    )
}