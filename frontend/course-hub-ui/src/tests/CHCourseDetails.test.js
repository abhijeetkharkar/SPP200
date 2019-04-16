import React from 'react';
import CHCourseDetails from '../js/CHCourseDetails';
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
  const location = { search: "?searchString=Algorithms" }
  const wrapper = shallow(<CHCourseDetails location={location} />);
  wrapper.setState({ choice: "home", firstName: "", email: "", queryString: "", courseId: "test course" });
  expect(wrapper.exists()).toBe(true);
});

test('Login Screen', () => {
  const location = { search: "?searchString=Algorithms&firstName=Test1&&email=test1@test.com" }
  const wrapper = shallow(<CHCourseDetails location={location} />);
  wrapper.setState({ choice: "loginScreen", firstName: "", email: "", queryString: "", courseId: "test course" });
  expect(wrapper.exists()).toBe(true);
});

test('Signup Screen', () => {
  const location = { search: { searchString: "testString", firstName: "Test1", email: "test1@test.com" } }
  const wrapper = shallow(<CHCourseDetails location={location} />);
  wrapper.setState({ choice: "signupScreen", firstName: "", email: "", queryString: "", courseId: "test course" });
  expect(wrapper.exists()).toBe(true);
});

test('Forgot Password Screen', () => {
  const location = { search: { searchString: "testString", firstName: "Test1", email: "test1@test.com" } }
  const wrapper = shallow(<CHCourseDetails location={location} />);
  wrapper.setState({ choice: "forgotPasswordScreen", firstName: "", email: "", queryString: "", courseId: "test course" });
  expect(wrapper.exists()).toBe(true);
});

test('Home Screen after signing in', () => {
  const location = { search: { searchString: "testString", firstName: "Test1", email: "test1@test.com" } }
  const wrapper = shallow(<CHCourseDetails location={location} />);
  wrapper.setState({ choice: "homeSignedIn", firstName: "Test1", email: "test1@test.com", queryString: "", courseId: "test course" });
  expect(wrapper.exists()).toBe(true);
});

test('Profile after signing in', () => {
  const location = { search: { searchString: "testString", firstName: "Test1", email: "test1@test.com" } }
  const wrapper = shallow(<CHCourseDetails location={location} />);
  wrapper.setState({ choice: "profile", firstName: "Test1", email: "test1@test.com", queryString: "", courseId: "test course" });
  expect(wrapper.exists()).toBe(true);
});

test('Testing handleclick', async () => {
  const location = { search: { searchString: "testString", firstName: "Test1", email: "test1@test.com" } }
  const wrapper = shallow(<CHCourseDetails location={location} />);
  wrapper.setState({ choice: "home", firstName: "", email: "", queryString: "", courseId: "test course" });
  const instance = wrapper.instance();
  instance.handleClick("test", "", "", "", "");
  expect(instance.state.choice).toBe("test");
});

test('Testing handleAuthStateChange - SignedIn', async () => {
  const location = { search: { searchString: "testString", firstName: "Test1", email: "test1@test.com" } }
  const wrapper = shallow(<CHCourseDetails location={location} />);
  wrapper.setState({ choice: "home", firstName: "", email: "", queryString: "", courseId: "test course" });
  const instance = wrapper.instance();
  elastic.searchUser.mockImplementationOnce(() => { return Promise.resolve("Test1") });
  instance.handleAuthStateChange({
    displayName: 'testDisplayName',
    email: 'test@test.com',
    emailVerified: true
  });
  expect(instance.state.choice).toBe("home");
});

test('Testing handleAuthStateChange - Not Signed In', async () => {
  const location = { search: { searchString: "testString", firstName: "Test1", email: "test1@test.com" } }
  const wrapper = shallow(<CHCourseDetails location={location} />);
  wrapper.setState({ choice: "home", firstName: "", email: "", queryString: "", courseId: "test course" });
  const instance = wrapper.instance();
  instance.handleAuthStateChange(null);
  expect(instance.state.choice).toBe("home");
});

test('Search results handlePagination', () => {
  const location = { search: { searchString: "testString", firstName: "Test1", email: "test1@test.com" } }
  const wrapper = shallow(<CHCourseDetails history={[]} location={location} />);
  wrapper.setState({ choice: "home", firstName: "", email: "", queryString: "", courseId: "test course" });
  const instance = wrapper.instance();
  instance.handlePagination("deep", 1);
  expect(instance.state.pageNumber).toBe(1);
});