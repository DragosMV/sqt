import { getCourse1StageAttempts, updateCourse1StageAttempts, updateUserField, getUserField } from "@/utils/database_helpers";
import { User } from "firebase/auth"; // Adjust the import based on your auth setup

export const handleIncorrectAnswer = async (user: User | null | undefined, stageNumber: number): Promise<void> => {
  if (!user) return;

  try {
    const currentAttempts = await getCourse1StageAttempts(user.uid, stageNumber);
    
    if (currentAttempts !== null) {
      await updateCourse1StageAttempts(user.uid, stageNumber, currentAttempts + 1);
    } else {
      console.error("Could not retrieve current attempt count.");
    }
  } catch (error) {
    console.error("Error updating attempt count:", error);
  }
};

export const handleCorrectAnswer = async (user: User | null | undefined, stageNumber: number): Promise<number | null> => {
  if (!user) return null;

  try {
    const currentAttempts = await getCourse1StageAttempts(user.uid, stageNumber);

    if (currentAttempts !== null) {
      let pointsEarned = 3; // Default lowest score
      if (currentAttempts === 1) pointsEarned = 10;
      else if (currentAttempts === 2) pointsEarned = 7;
      else if (currentAttempts > 999) return null; // user already answered question correctly

      const pointsRaw = await getUserField(user.uid, "points");
      const currentPoints = pointsRaw !== null ? Number(pointsRaw) : 0;

      await updateUserField(user.uid, "points", currentPoints + pointsEarned);
      console.log(`User earned ${pointsEarned} points for Stage ${stageNumber}`);

      await updateCourse1StageAttempts(user.uid, stageNumber, 1000);
      return pointsEarned;
    }
  } catch (error) {
    console.error("Error updating user points:", error);
  }
  return null
};