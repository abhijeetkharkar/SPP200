import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer'
import LoginPage from '../js/CHLogin';
import { shallow, render, mount } from 'enzyme';
import {Form} from 'react-bootstrap';

const fetch = require('node-fetch');
const firebase = require('../FirebaseUtils');
const elastic = require('../elasticSearch');

jest.mock('../FirebaseUtils');
jest.mock('../elasticSearch');

describe('Testing SignUp', () => {
    test('Testing Loading of LandingPage', () => {
        const wrapper = shallow(<LoginPage />);
        expect(wrapper.exists()).toBe(true);
    });

    test('Testing HandleSubmit - Happy', () => {
        const handleClick = jest.fn();
        firebase.doSignInWithEmailAndPassword.mockImplementationOnce(() => {return Promise.resolve({user: {email: "test1@test.com"}})});
        elastic.searchUser.mockImplementationOnce(() => {return Promise.resolve("Test1")});
        const wrapper = shallow(<LoginPage updateContent={handleClick}/>);
        const instance = wrapper.instance();
        const event = {
            currentTarget: {
                checkValidity: () => true
            },
            preventDefault() { },
            stopPropagation() { },
        };
        instance.handleSubmit(event);
        // expect(instance.state.loggedIn).toBe(true);
        expect(instance.state.validated).toBe(false);
    });

    test('Testing HandleSubmit - Sad 1', () => {
        const wrapper = shallow(<LoginPage />);
        const instance = wrapper.instance();
        const event = {
            currentTarget: { 
                checkValidity: () => false
            },
            preventDefault() { },
            stopPropagation() { },
        };
        instance.handleSubmit(event);
        expect(instance.state.validated).toBe(true);
    });

    test('Testing HandleSubmit - Sad 2', () => {
        firebase.doSignInWithEmailAndPassword.mockImplementationOnce(() => {return Promise.resolve({user: {email: "test1@test.com"}})});
        elastic.searchUser.mockImplementationOnce(() => {return Promise.reject("Test1")});
        const wrapper = shallow(<LoginPage />);
        const instance = wrapper.instance();
        const event = {
            currentTarget: { 
                checkValidity: () => true
            },
            preventDefault() { },
            stopPropagation() { },
        };
        instance.handleSubmit(event);
        // expect(instance.state.validated).toBe(true);
    });

    test('Testing handleGoogleSignin - Happy 1', () => {
        firebase.doSignInWithGoogle.mockImplementationOnce(() => {return Promise.resolve({credential: {accessToken: "testToken"}, additionalUserInfo: {profile: {email: "test1@test.com", given_name: "Test1", family_name: "Tester", gender: "Trans", picture: "url://my_picture"}}})});
        elastic.searchUser.mockImplementationOnce(() => {return Promise.resolve(null)});
        elastic.addUser.mockImplementationOnce(() => {return Promise.resolve(true)});
        // firebase.doDeleteUser.mockImplementationOnce(() => {return Promise.resolve(true)});
        const handleClick = jest.fn();
        const wrapper = shallow(<LoginPage updateContent={handleClick}/>);
        const instance = wrapper.instance();
        instance.handleGoogleSignin();
        // expect(instance.state.loggedIn).toBe(true);
    });

    test('Testing handleGoogleSignin - Happy 2', () => {
        firebase.doSignInWithGoogle.mockImplementationOnce(() => {return Promise.resolve({credential: {accessToken: "testToken"}, additionalUserInfo: {profile: {email: "test1@test.com", given_name: "Test1", family_name: "Tester", gender: "Trans", picture: "url://my_picture"}}})});
        elastic.searchUser.mockImplementationOnce(() => {return Promise.resolve("Test1")});
        // elastic.addUser.mockImplementationOnce(() => {return Promise.resolve(true)});
        // firebase.doDeleteUser.mockImplementationOnce(() => {return Promise.resolve(true)});
        const handleClick = jest.fn();
        const wrapper = shallow(<LoginPage updateContent={handleClick}/>);
        const instance = wrapper.instance();
        instance.handleGoogleSignin();
        // expect(instance.state.loggedIn).toBe(true);
    });

    test('Testing handleGoogleSignin - Sad 1 - Error during signing in at Firebase side', () => {
        firebase.doSignInWithGoogle.mockImplementationOnce(() => {return Promise.reject({credential: {accessToken: "testToken"}, additionalUserInfo: {profile: {email: "test1@test.com", given_name: "Test1", family_name: "Tester", gender: "Trans", picture: "url://my_picture"}}})});
        // elastic.searchUser.mockImplementationOnce(() => {return Promise.resolve(null)});
        // elastic.addUser.mockImplementationOnce(() => {return Promise.resolve(true)});
        // firebase.doDeleteUser.mockImplementationOnce(() => {return Promise.resolve(true)});
        const handleClick = jest.fn();
        const wrapper = shallow(<LoginPage updateContent={handleClick}/>);
        const instance = wrapper.instance();
        instance.handleGoogleSignin();
        // expect(instance.state.loggedIn).toBe(true);
    });

    test('Testing handleGoogleSignin - Sad 2 - User not added in Elastic Search', () => {
        firebase.doSignInWithGoogle.mockImplementationOnce(() => {return Promise.resolve({credential: {accessToken: "testToken"}, additionalUserInfo: {profile: {email: "test1@test.com", given_name: "Test1", family_name: "Tester", gender: "Trans", picture: "url://my_picture"}}})});
        elastic.searchUser.mockImplementationOnce(() => {return Promise.resolve(null)});
        elastic.addUser.mockImplementationOnce(() => {return Promise.resolve(false)});
        firebase.doDeleteUser.mockImplementationOnce(() => {return Promise.resolve(true)});
        const handleClick = jest.fn();
        const wrapper = shallow(<LoginPage updateContent={handleClick}/>);
        const instance = wrapper.instance();
        instance.handleGoogleSignin();
        // expect(instance.state.loggedIn).toBe(true);
    });

    test('Testing handleGoogleSignin - Sad 3 - Delete User Failed', () => {
        firebase.doSignInWithGoogle.mockImplementationOnce(() => {return Promise.resolve({credential: {accessToken: "testToken"}, additionalUserInfo: {profile: {email: "test1@test.com", given_name: "Test1", family_name: "Tester", gender: "Trans", picture: "url://my_picture"}}})});
        elastic.searchUser.mockImplementationOnce(() => {return Promise.resolve(null)});
        elastic.addUser.mockImplementationOnce(() => {return Promise.resolve(false)});
        firebase.doDeleteUser.mockImplementationOnce(() => {return Promise.reject(true)});
        const handleClick = jest.fn();
        const wrapper = shallow(<LoginPage updateContent={handleClick}/>);
        const instance = wrapper.instance();
        instance.handleGoogleSignin();
        // expect(instance.state.loggedIn).toBe(true);
    });

    test('Testing handleGoogleSignin - Sad 4', () => {
        firebase.doSignInWithGoogle.mockImplementationOnce(() => {return Promise.resolve({credential: {accessToken: "testToken"}, additionalUserInfo: {profile: {email: "test1@test.com", given_name: "Test1", family_name: "Tester", gender: "Trans", picture: "url://my_picture"}}})});
        elastic.searchUser.mockImplementationOnce(() => {return Promise.resolve(null)});
        elastic.addUser.mockImplementationOnce(() => {return Promise.reject(false)});
        const handleClick = jest.fn();
        const wrapper = shallow(<LoginPage updateContent={handleClick}/>);
        const instance = wrapper.instance();
        instance.handleGoogleSignin();
        // expect(instance.state.loggedIn).toBe(true);
    });

    test('Testing update email', async () => {
        const wrapper = shallow(<LoginPage />);
        const instance = wrapper.instance();
        const event = {
            target: { value: 'test1@test.com' },
        };
        instance.handleEmailChange(event);
        expect(instance.state.email).toBe('test1@test.com');
    });

    test('Testing update password', async () => {
        const wrapper = shallow(<LoginPage />);
        const instance = wrapper.instance();
        const event = {
            target: { value: 'testPassword' },
        };
        instance.handlePasswordChange(event);
        expect(instance.state.password).toBe('testPassword');
    });

    test('Testing handle show', async () => {
        const wrapper = shallow(<LoginPage />);
        const instance = wrapper.instance();
        instance.handleShow();
        expect(instance.state.show).toBe(true);
    });

    test('Testing handle hide', async () => {
        const handleClick = jest.fn();
        const wrapper = shallow(<LoginPage updateContent={handleClick}/>);
        const instance = wrapper.instance();
        instance.handleHide();
        expect(instance.state.show).toBe(false);
        expect(handleClick.mock.calls.length).toBe(1);
    });

    test('Testing forgot password', async () => {
        const handleClick = jest.fn();
        const wrapper = shallow(<LoginPage updateContent={handleClick}/>);
        const instance = wrapper.instance();
        instance.handleForgotPassword();
        expect(handleClick.mock.calls.length).toBe(1);
    });

    test('Testing Close Button', async () => {
        const handleClick = jest.fn();
        const wrapper = shallow(<LoginPage updateContent={handleClick} />);
        const instance = wrapper.instance();
        wrapper.find('#loginCloseButton').simulate("click");
        expect(handleClick.mock.calls.length).toBe(1);
    });

    test('Testing Close Button', async () => {
        const handleClick = jest.fn();
        const wrapper = shallow(<LoginPage updateContent={handleClick} />);
        const instance = wrapper.instance();
        wrapper.find('#loginRegisterButton').simulate("click");
        expect(handleClick.mock.calls.length).toBe(1);
    });
})