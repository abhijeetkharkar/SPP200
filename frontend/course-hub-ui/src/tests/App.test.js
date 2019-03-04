import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer'
import App from '../App';
import Footer from '../js/CHFooter'
import { shallow } from 'enzyme';
import { render } from 'enzyme';
import { mount } from 'enzyme';
import * as firebase from 'firebase';
import firebaseInitialization from '../FirebaseUtils';

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
  wrapper.setState({ choice: "home", optional1: "", optional2 : "", optional3: ""  });
  expect(wrapper.exists()).toBe(true);
});

test('Login Screen', () => {
  
  const wrapper = shallow(<App />);
  wrapper.setState({ choice: "loginScreen", optional1: "", optional2 : "", optional3: ""  });
  expect(wrapper.exists()).toBe(true);
});

test('Signup Screen', () => {
  
  const wrapper = shallow(<App />);
  wrapper.setState({ choice: "signupScreen", optional1: "", optional2 : "", optional3: ""  });
  expect(wrapper.exists()).toBe(true);
});

test('Forgot Password Screen', () => {
  
  const wrapper = shallow(<App />);
  wrapper.setState({ choice: "forgotPasswordScreen", optional1: "", optional2 : "", optional3: ""  });
  expect(wrapper.exists()).toBe(true);
});

test('Home Screen after signing in', () => {
  
  const wrapper = shallow(<App />);
  wrapper.setState({ choice: "homeSignedIn", optional1: "Test1", optional2 : "test1@test.com", optional3: ""  });
  expect(wrapper.exists()).toBe(true);
});

test('Profile after signing in', () => {
  
  const wrapper = shallow(<App />);
  wrapper.setState({ choice: "profile", optional1: "Test1", optional2 : "test1@test.com", optional3: ""  });
  expect(wrapper.exists()).toBe(true);
});

test("test handle click", () => {
  var app = new App();
  app.handleClick("home", "", "", "");
  expect(app.state.choice).toBe("");
});