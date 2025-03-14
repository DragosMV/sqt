'use client'
import { auth, db } from '@/firebase'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User, UserCredential, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
    loginWithGoogle: () => Promise<void>;
    loading: boolean;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function useAuth(){
    return useContext(AuthContext)
}

const createOrUpdateUserDocument = async (user: User): Promise<void> => {
    if (!user) return;
  
    const userDocRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userDocRef);
  
    if (!userSnapshot.exists()) {
      // Create a new document in Firestore for the new user
      await setDoc(userDocRef, {
        email: user.email,
        createdAt: new Date(),
        lastLogin: new Date(),
        coursesCompleted: 0,
        course1Stage: 1,
        course2Stage: 1,
        course3Stage: 1,
        level: 1,
        points: 0,
        title: "Novice",
        course1Attempts: Array(10).fill(1) 
        // Add other user fields as needed
      });
    } else {
      // Optionally, update existing user data if needed
      // For example, update 'lastLogin' timestamp
      await setDoc(
        userDocRef,
        { lastLogin: new Date() },
        { merge: true } // Merge with existing data
      );
    }
  };

export function AuthProvider({ children } :AuthProviderProps) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userDataObj, setUserDataObj] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true)


    // AUTH HANDLERS
    const signup = async (email : string, password : string): Promise<UserCredential> => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user
            // Use the helper function
            await createOrUpdateUserDocument(user);
            return userCredential 
        } catch (error) {
            console.error("Error signing up:", error);
            throw error;
        }
    }

    function login(email : string, password : string) {
        return signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            // Call the helper function to create or update the Firestore user document
            await createOrUpdateUserDocument(userCredential.user);
            return userCredential;
          })
    }
    
    function logout() {
        setUserDataObj(null)
        setCurrentUser(null)
        return signOut(auth)
    }

    async function loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;
            await createOrUpdateUserDocument(user);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error('Google Sign-In Error:', err.message);
            } else {
                console.error('An unknown error occurred during Google Sign-In');
            }
        } 
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
        loginWithGoogle,
        loading
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}