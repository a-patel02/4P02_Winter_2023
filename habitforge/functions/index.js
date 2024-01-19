const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.createUserInFirestore = functions.auth.user().onCreate((user) => {
  // Get the user's UID and other information
  const uid = user.uid;
  const email = user.email;
  const displayName = user.displayName;

  // Create a reference to the Firestore collection
  const usersCollection = admin.firestore().collection("users");

  // Add the user to the "users" collection with UID as the document ID
  return usersCollection.doc(uid).set({
    uid: uid,
    email: email,
    displayName: displayName,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});
