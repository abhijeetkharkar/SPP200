import firebase from "firebase";

const firebaseInitialization = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
});

// await can be used only in an async function. usage of await returns a "pending" promise. 
// To deal with a "pending" promise, the returned value must be chained with "then".
const doCreateUserWithEmailAndPassword = async (email, password) => {
  const response = await firebaseInitialization.auth().createUserWithEmailAndPassword(email, password);
  return response;
}

const doSignInWithEmailAndPassword = async (email, password) => {
  const response = await firebaseInitialization.auth().signInWithEmailAndPassword(email, password);
  return response;
}

const doSignInWithGoogle = async () => {
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('profile');
  const googleSignInResponse = await firebaseInitialization.auth().signInWithPopup(provider);
  return googleSignInResponse;
}

const doSignOut = async () => {
  const response = await firebaseInitialization.auth().signOut();
  console.log("Response Signout: ", response);
  return response;
}

const isUserSignedIn = async () => {
  const response = await firebaseInitialization.auth().onAuthStateChanged();
  return response;
}

const doPasswordReset = async email => {
  const response = await firebaseInitialization.auth().sendPasswordResetEmail(email);
  return response;
}

const doPasswordUpdate = async password => {
  const response = await firebaseInitialization.auth().updatePassword(password);
  return response;
}

const doDeleteUser = async () => {
  var user = firebaseInitialization.auth().currentUser;
  console.log("In Delete, user: ", user);
  const response = await user.delete().then(function() {
    return true;
  }).catch(function(error) {
    return false;
  });
  console.log("In Delete, response: ", response);
  return response;
}

export default firebaseInitialization;

export {
  doCreateUserWithEmailAndPassword,
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
  doSignOut,
  isUserSignedIn,
  doPasswordReset,
  doPasswordUpdate,
  doDeleteUser
};