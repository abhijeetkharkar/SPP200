import * as firebase from 'firebase';
import firebaseInitialization, {doCreateUserWithEmailAndPassword, doSignInWithEmailAndPassword, doSignInWithGoogle, doSignOut, doPasswordReset, doPasswordUpdate, doDeleteUser} from '../FirebaseUtils';

const onAuthStateChanged = jest.fn();

const getRedirectResult = jest.fn(() => {
	return Promise.resolve({
		user: {
			displayName: 'redirectResultTestDisplayName',
			email: 'redirectTest@test.com',
			emailVerified: true
		}
	})
});

const sendEmailVerification = jest.fn(() => {
	return Promise.resolve('result of sendEmailVerification')
});

const sendPasswordResetEmail = jest.fn(() => {
	return Promise.resolve('result of sendPasswordResetEmail');
});

const updatePassword = jest.fn(() => {
	return Promise.resolve('result of updatePassword');
});

const createUserWithEmailAndPassword = jest.fn(() => {
	return Promise.resolve('result of createUserWithEmailAndPassword');
});

const signInWithEmailAndPassword = jest.fn(() => {
	return Promise.resolve('result of signInWithEmailAndPassword');
});

const signInWithRedirect = jest.fn(() => {
	return Promise.resolve('result of signInWithRedirect');
});

const signInWithPopup = jest.fn(() => {
	return Promise.resolve('result of signInWithPopup');
});

const signOut = jest.fn(() => {
	return Promise.resolve('result of signOut');
});

/* const delete = jest.fn(() => {
	return Promise.resolve('result of delete');
}); */

jest.spyOn(firebaseInitialization, 'auth').mockImplementation(() => {
	return {
		onAuthStateChanged,
		currentUser: {
			displayName: 'testDisplayName',
			email: 'test@test.com',
			emailVerified: true
		},
		getRedirectResult,
		sendPasswordResetEmail,
		createUserWithEmailAndPassword,
		signInWithEmailAndPassword,
		signInWithRedirect,
		signInWithPopup,
		signOut,
		updatePassword, 
	}
});

/* jest.spyOn(firebaseInitialization, 'auth', 'currentUser').mockImplementation(() => {
	return {
		delete
	}
}); */

firebase.auth.FacebookAuthProvider = jest.fn(() => { })
firebase.auth.GoogleAuthProvider.addScope = jest.fn(() => { })

describe('Firebase API', () => {
	test('doCreateUserWithEmailAndPassword', async () => {
		const result = await doCreateUserWithEmailAndPassword();
		expect(result).toEqual("result of createUserWithEmailAndPassword");
		// expect(firebase.auth).toHaveBeenCalled();
	});

	test('doSignInWithEmailAndPassword', async () => {
		const result = await doSignInWithEmailAndPassword();
		expect(result).toEqual("result of signInWithEmailAndPassword");
		// expect(firebase.auth).toHaveBeenCalled();
	});

	test('doSignInWithGoogle', async () => {
		const result = await doSignInWithGoogle();
		expect(result).toEqual("result of signInWithPopup");
		// expect(firebase.auth).toHaveBeenCalled();
	});

	test('doSignOut', async () => {
		const result = await doSignOut();
		expect(result).toEqual("result of signOut");
		// expect(firebase.auth).toHaveBeenCalled();
	});

	test('doPasswordReset', async () => {
		const result = await doPasswordReset();
		expect(result).toEqual(true);
		// expect(firebase.auth).toHaveBeenCalled();
	});

	test('doPasswordUpdate', async () => {
		const result = await doPasswordUpdate();
		expect(result).toEqual("result of updatePassword");
		// expect(firebase.auth).toHaveBeenCalled();
	});

	/* test('doDeleteUser - Success', async () => {
		const result = await doDeleteUser();
		expect(result).toEqual("result of deleteS");
		expect(firebase.auth).toHaveBeenCalled();
	}); */
});