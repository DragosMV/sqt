import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '@/firebase'


export const getUserField = async (userId: string, field: string): Promise<any | null> => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data()?.[field] ?? null;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user field:", error);
    return null;
  }
};

export const updateUserField = async (
  userId: string,
  field: string,
  valueOrUpdater: any | ((prevValue: any) => any)
): Promise<boolean> => {
  try {
    const userRef = doc(db, "users", userId);

    // If the updater is a function, first fetch the existing value
    if (typeof valueOrUpdater === "function") {
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        console.error("User not found");
        return false;
      }
      const prevValue = userSnap.data()?.[field] ?? null;
      const newValue = valueOrUpdater(prevValue);

      await updateDoc(userRef, { [field]: newValue });
    } else {
      // If it's a direct value, update the field directly
      await updateDoc(userRef, { [field]: valueOrUpdater });
    }

    return true;
  } catch (error) {
    console.error("Error updating user field:", error);
    return false;
  }

};

  export const fetchUserHighestStage = async (userId: string, course: string): Promise<number> => {
    const userDocRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) return 1; // Default to stage 1 if no user data

    const userData = userSnapshot.data();
    return userData?.[`${course}Stage`] || 1;
  };

 export const getCourse1StageAttempts = async (userId: string, stage: number): Promise<number | null> => {
    if (stage < 1 || stage > 10) {
        throw new Error("Stage must be between 1 and 10");
    }

    const userDocRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
        console.error("User document does not exist.");
        return null;
    }

    const userData = userSnapshot.data();
    if (!userData.course1Attempts || !Array.isArray(userData.course1Attempts)) {
        console.error("course1Attempts field is missing or not an array.");
        return null;
    }

    return userData.course1Attempts[stage - 1] ?? null; // Adjusting for zero-based index
};

// Firebase doesn't support modifying array values by index
// Need to get whole array, change it, and rewrite it back
export const updateCourse1StageAttempts = async (userId: string, stage: number, newAttemptCount: number): Promise<void> => {
  if (stage < 1 || stage > 10) {
      throw new Error("Stage must be between 1 and 10");
  }

  const userDocRef = doc(db, "users", userId);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
      throw new Error("User document does not exist.");
  }

  const userData = userSnapshot.data();
  if (!userData.course1Attempts || !Array.isArray(userData.course1Attempts)) {
      throw new Error("course1Attempts field is missing or not an array.");
  }

  // Clone the array to avoid modifying the original reference
  const updatedAttempts = userData.course1Attempts.slice();
  updatedAttempts[stage - 1] = newAttemptCount; // Adjust for zero-based index

  // Update Firestore document
  await updateDoc(userDocRef, { course1Attempts: updatedAttempts });
};