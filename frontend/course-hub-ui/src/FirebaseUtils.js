import firebase from "firebase";

const firebaseInitialization = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET
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
  // console.log("Response Signout: ", response);
  return response;
}

/* const isUserSignedIn = async () => {
  const response = await firebaseInitialization.auth().onAuthStateChanged();
  return response;
} */

const doPasswordReset = async email => {
  const response = await firebaseInitialization.auth().sendPasswordResetEmail(email).then(function() {
    return true;
  }).catch(function(error) {
    // console.log("In PasswordReset, response: ", error.message);
    return false;
  });
  // console.log("In PasswordReset, response: ", response);;
  return response;
}

const doPasswordUpdate = async (currentPassword, newPassword) => {
  console.log('In password firebase');

  function reauthenticateWithCredential(currentPassword) {
    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    return user.reauthenticateAndRetrieveDataWithCredential(cred);
  }

  const response = await reauthenticateWithCredential(currentPassword).then(() => {
    var user = firebase.auth().currentUser;
    return user.updatePassword(newPassword).then(() => {
      return "SUCCESS";
    }).catch((error) => {
      console.log(error);
      return "REJECTED";
    });
  }).catch((error) => {
    console.log(error);
    return "INVALID";
  });
  return response;
};

const doUploadProfilePicture = async (file) =>{
  console.log('In Firebase Picture upload');
  var user = firebase.auth().currentUser;

  var storageRef = await firebase.storage().ref('/images/' + user.email.split('@')[0] + '_profile.txt');
  return await storageRef.put(file).then(response => {
    return "SUCCESS"
  }).catch((error) => {
    console.log(error);
    return "ERROR";
  });
};

const doGetProfilePicture = async () =>{
    var user = firebase.auth().currentUser;
    var path = '/images/' + user.email.split('@')[0] + '_profile.txt';
    var image = firebase.storage().ref();
    const url = await image.child(path).getDownloadURL().then(url =>{
      return url;
    }).catch((error) => {
      console.log(error);
      return null;
  });
    return url;
}

const doDeleteProfilePicture = async () =>{
  var user = firebase.auth().currentUser;
  var path = '/images/' + user.email.split('@')[0] + '_profile.txt';
  var image = firebase.storage().ref().child(path);
  return await image.delete().then(response => {
    return true;
  }).catch(function (error) {
    console.log(error.message)
    return false;
  })
};

const doDeleteUser = async () => {
  const response = await firebaseInitialization.auth().currentUser.delete().then(function() {
    return true;
  }).catch(error => {
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
  //isUserSignedIn,
  doPasswordReset,
  doPasswordUpdate,
  doDeleteUser,
  doUploadProfilePicture,
  doGetProfilePicture,
  doDeleteProfilePicture
};