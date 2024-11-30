'use client'
import { auth, db } from '@/firebase'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User, UserCredential } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore';
import React, {useContext, useState, useEffect} from 'react'

interface AuthProviderProps {
    children: React.ReactNode;  // Explicitly type `children` as ReactNode
}

interface UserData{
    name?: string; //Optional
    email: string;
}

interface AuthContextType {
    currentUser: User | null;
    userDataObj: UserData | null;
    setUserDataObj: React.Dispatch<React.SetStateAction<UserData | null>>;
    signup: (email: string, password: string) => Promise<UserCredential>;
    logout: () => Promise<void>;
    login: (email: string, password: string) => Promise<UserCredential>;
    loading: boolean;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({ children } :AuthProviderProps) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userDataObj, setUserDataObj] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true)


    // AUTH HANDLERS
    function signup(email : string, password : string) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email : string, password : string) {
        return signInWithEmailAndPassword(auth, email, password)
    }
    
    function logout() {
        setUserDataObj(null)
        setCurrentUser(null)
        return signOut(auth)
    }

    // Function below triggers when a state change to user auth happens
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user: User | null)  => {
            try {
                setLoading(true)
                setCurrentUser(user)
                if (!user) {
                    console.log('No User Found')
                    return
                }
                // if user exists, fetch data from firestore database
                console.log('Fetching User Data')
                const docRef = doc(db, 'users', user.uid)
                const docSnap = await getDoc(docRef)
                let firebaseData: UserData = { email: ''}
                if (docSnap.exists()) {
                    console.log('Found User Data')
                    firebaseData = docSnap.data() as UserData;
                    console.log(firebaseData)
                    setUserDataObj(firebaseData);
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.log(err.message);
                } else {
                    console.log('An unknown error occurred');
                }
            } finally {
                setLoading(false)
            }
        })
        return unsubscribe
    }, [])
    const value = {
        currentUser,
        userDataObj,
        setUserDataObj,
        signup,
        logout,
        login,
        loading
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}