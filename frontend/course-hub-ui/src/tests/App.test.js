import React from 'react';
import App from '../App';
import { shallow } from 'enzyme';
import firebaseInitialization from '../FirebaseUtils';

const elastic = require('../elasticSearch');

jest.mock('../elasticSearch');

const onAuthStateChanged = jest.fn(() => {
  return Promise.resolve({
    displayName: 'testDisplayName',
    email: 'test@test.com',
    emailVerified: true
  })
});

jest.spyOn(firebaseInitialization, 'auth').mockImplementation(() => {
  return {
    onAuthStateChanged,
    currentUser: {
      displayName: 'testDisplayName',
      email: 'test@test.com',
      emailVerified: true
    }
  }
})


test('Loading Home Page', () => {

  const wrapper = shallow(<App />);
  wrapper.setState({ choice: "home", optional1: "", optional2: "", optional3: "" });
  expect(wrapper.exists()).toBe(true);
  expect(firebaseInitialization.auth).toHaveBeenCalled();
});

test('Login Screen', () => {

  const wrapper = shallow(<App />);
  wrapper.setState({ choice: "loginScreen", optional1: "", optional2: "", optional3: "" });
  expect(wrapper.exists()).toBe(true);
});

test('Signup Screen', () => {

  const wrapper = shallow(<App />);
  wrapper.setState({ choice: "signupScreen", optional1: "", optional2: "", optional3: "" });
  expect(wrapper.exists()).toBe(true);
});

test('Forgot Password Screen', () => {

  const wrapper = shallow(<App />);
  wrapper.setState({ choice: "forgotPasswordScreen", optional1: "", optional2: "", optional3: "" });
  expect(wrapper.exists()).toBe(true);
});

test('Home Screen after signing in', () => {

  const wrapper = shallow(<App />);
  wrapper.setState({ choice: "homeSignedIn", optional1: "Test1", optional2: "test1@test.com", optional3: "" });
  expect(wrapper.exists()).toBe(true);
});

test('Search Results after Signing in', () => {

  const wrapper = shallow(<App history={[]} />);
  wrapper.setState({ choice: "searchResultsSignedIn", optional3: "" });
  expect(wrapper.exists()).toBe(true);
});

test('Search results without signin', () => {

  const wrapper = shallow(<App history={[]} />);
  wrapper.setState({ choice: "searchResultsNotSignedIn", optional3: "" });
  expect(wrapper.exists()).toBe(true);
});

test('Testing handleclick', async () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  instance.handleClick("test", "", "", "");
  expect(instance.state.choice).toBe("test");
});

test('Testing handleAuthStateChange - SignedIn', async () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  elastic.searchUser.mockImplementationOnce(() => { return Promise.resolve("Test1") });
  instance.handleAuthStateChange({
    displayName: 'testDisplayName',
    email: 'test@test.com',
    emailVerified: true
  });
  expect(instance.state.choice).toBe("");
});

test('Testing handleAuthStateChange - Not Signed In', async () => {
  const wrapper = shallow(<App />);
  const instance = wrapper.instance();
  instance.handleAuthStateChange(null);
  expect(instance.state.choice).toBe("home");
});