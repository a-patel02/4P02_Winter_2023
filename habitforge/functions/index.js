const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

// Weights
let completionRateWeight = 0.6;
let goalWeight = 0.2;
let failedWeight = -0.1;
let skippedWeight = -0.1;
let streakWeight = 0.5;

exports.createUserInFirestore = functions.auth.user().onCreate((user) => {
  // Get the user's UID and other information
  const uid = user.uid;
  const email = user.email;
  const displayName = user.displayName;
  const photoURL = user.photoURL;

  // Create a reference to the Firestore collection
  const usersCollection = admin.firestore().collection("users");

  // Add the user to the "users" collection with UID as the document ID
  return usersCollection.doc(uid).set({
    uid: uid,
    email: email,
    displayName: displayName,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    level: 1,
    habitCoins: 1,
    rank: 1,
    habitScore: 0,
    photoURL: photoURL,
  });
});

exports.resetHabits = functions.pubsub
  .schedule("every day 00:00")
  .timeZone("America/Toronto")
  .onRun(async () => {
    try {
      const usersSnapshot = await db.collection("users").get();

      usersSnapshot.forEach(async (userDoc) => {
        const batch = db.batch(); // Create a new batch for each user

        const habitsSnapshot = await db
          .collection("users")
          .doc(userDoc.id)
          .collection("habits")
          .get();

        habitsSnapshot.forEach((habitDoc) => {
          batch.update(habitDoc.ref, {
            tracked: false,
            completed: false,
            skipped: false,
            failed: false,
          });
        });

        await batch.commit(); // Commit batch for each user
      });

      console.log("Habit booleans reset successfully.");

      return null;
    } catch (error) {
      console.error("Error resetting habit booleans:", error);
      return null;
    }
  });

exports.calculateStreaks = functions.pubsub
  .schedule("every day 00:00")
  .timeZone("America/Toronto")
  .onRun(async () => {
    try {
      // Get all users from users collection
      const usersSnapshot = await db.collection("users").get();
      // Fetch habits data for each user
      usersSnapshot.forEach(async (userDoc) => {
        const userId = userDoc.id;
        const habitsSnapshot = await db
          .collection("users")
          .doc(userDoc.id)
          .collection("habits")
          .get();

        habitsSnapshot.forEach(async (habitDoc) => {
          const habitData = habitDoc.data();
          const habit = habitDoc.data().habitName;
          const habitLastCompleted = habitDoc.data().lastCompletedDate.seconds;
          const getStreak = habitDoc.data().streak;
          console.log("habit name: ", habit);
          console.log("time: ", habitLastCompleted);
          console.log("streak: ", getStreak);

          // Update streak based on lastCompletedDate
          let habitStreak = 0;
          const currentTime = Math.floor(Date.now() / 1000);
          console.log("currentTime: ", currentTime);
          let timeDifference = currentTime - habitLastCompleted;
          if (habitData.completed === true && timeDifference <= 86400) {
            habitStreak = habitData.streak + 1;
            console.log("streak +1");
          } else {
            habitStreak = 0;
            console.log("no streak");
          }
          await admin
            .firestore()
            .collection("users")
            .doc(userId)
            .collection("habits")
            .doc(habitDoc.id)
            .update({
              streak: habitStreak,
            });
        });
      });
    } catch (error) {
      console.error("Error calculating streaks", error);
      return null;
    }
  });

exports.resetHabitsBasedOnGoal = functions.pubsub
  .schedule("every hour")
  .onRun(async () => {
    try {
      const usersSnapshot = await db.collection("users").get();

      usersSnapshot.forEach(async (userDoc) => {
        const batch = db.batch(); // Create a new batch for each user

        const habitsSnapshot = await db
          .collection("users")
          .doc(userDoc.id)
          .collection("habits")
          .get();

        habitsSnapshot.forEach((habitDoc) => {
          const habitData = habitDoc.data();
          const goal = habitData.goal || 1; // Default goal to 1 if not provided
          const interval = 24 / goal; // Calculate interval based on goal
          const currentTime = new Date();
          const lastResetTime = habitData.lastReset
            ? new Date(habitData.lastReset.toDate())
            : new Date(0); // Default to epoch if last reset time not set

          // Check if it's time to reset based on interval
          if (currentTime - lastResetTime >= interval * 60 * 60 * 1000) {
            batch.update(habitDoc.ref, {
              tracked: false,
              completed: false,
              skipped: false,
              failed: false,
              lastReset: admin.firestore.Timestamp.fromDate(currentTime),
            });
          }
        });

        await batch.commit(); // Commit batch for each user
      });

      console.log("Habit booleans reset successfully.");

      return null;
    } catch (error) {
      console.error("Error resetting habit booleans:", error);
      return null;
    }
  });

exports.updateLeaderboards = functions.pubsub
  .schedule("every day 01:00")
  .timeZone("America/Toronto")
  .onRun(async () => {
    try {
      // Get all users from users collection
      const usersSnapshot = await db.collection("users").get();

      // Iterate through users
      usersSnapshot.forEach(async (userDoc) => {
        const userData = userDoc.data();
        const userId = userDoc.id;

        // Set data for the user in the "leaderboards" collection
        await admin.firestore().collection("leaderboards").doc(userId).set({
          userName: userData.displayName,
          rank: userData.rank,
          photoURL: userData.photoURL,
        });
      });

      console.log("Daily leaderboard updated successfully.");
      return null;
    } catch (error) {
      console.error("Error updating leaderboards", error);
      return null;
    }
  });

// Calculate user ranks
exports.calculateRanks = functions.pubsub
  .schedule("every day 00:05")
  .timeZone("America/Toronto")
  .onRun(async () => {
    try {
      // Get all users from users collection
      const usersSnapshot = await db.collection("users").get();

      // Fetch habits data for each user
      usersSnapshot.forEach(async (userDoc) => {
        const userId = userDoc.id;
        const habitsSnapshot = await db
          .collection("users")
          .doc(userDoc.id)
          .collection("habits")
          .get();

        let totalCompleted = 0;
        let totalHabits = 0;
        let goal = 0;
        let failed = 0;
        let skipped = 0;
        let streak = 0;

        habitsSnapshot.forEach((habitDoc) => {
          const habitData = habitDoc.data();

          totalHabits++;
          if (habitData.completed === true) {
            totalCompleted++;
          }
          if (habitData.goal > 0 && habitData.completed === true) {
            goal++;
          }
          if (habitData.failed === true) {
            failed++;
          }
          if (habitData.skipped === true) {
            skipped++;
          }
          if (habitData.streak > 0) {
            streak = habitData.streak;
            console.log(streak + " Streak");
          }
        });
        // Calculate completion rate
        let completionRate = totalCompleted / totalHabits;
        // Calculate users weights
        let completionScore = completionRate * completionRateWeight;
        let goalScore = goal * goalWeight;
        let failedScore = failed * failedWeight;
        let skippedScore = skipped * skippedWeight;
        let streakScore = streak * streakWeight;

        // Sum up all rank scores
        let userRank =
          completionScore +
          goalScore +
          failedScore +
          skippedScore +
          streakScore;

        console.log(
          completionScore +
            " " +
            goalScore +
            " " +
            failedScore +
            " " +
            skippedScore +
            " " +
            streakScore
        );
        console.log(userRank + " userRank");

        await admin
          .firestore()
          .collection("users")
          .doc(userId)
          .update({
            rank: Math.trunc(userRank * 100),
          });
      });

      console.log("Daily ranks calculator updated successfully.");
      return null;
    } catch (error) {
      console.error("Error calculating ranks", error);
      return null;
    }
  });
