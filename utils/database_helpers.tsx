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