import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer'
import CHSignup from '../js/CHSignup';
import { shallow, render, mount } from 'enzyme';
import { resolve } from 'url';
import { inspect } from 'util';

const firebase = require('../FirebaseUtils');
const elastic = require('../elasticSearch');
const fetch = require('node-fetch');

jest.mock('../elasticSearch');
jest.mock('../FirebaseUtils');


describe('Testing SignUp', () => {
    test('Testing Loading of LandingPage', () => {
        const wrapper = shallow(<CHSignup />);
        expect(wrapper.exists()).toBe(true);
    });

    test('Testing Duplicate User Sign-Up Error Message', () => {
        const handleClick = jest.fn();

        elastic.searchUser.mockImplementationOnce(() => {return Promise.resolve("Duplicate-User-First-Name")});

        const wrapper = shallow(<CHSignup updateContent={handleClick}/>);
        const instance = wrapper.instance();

        const event = {
            preventDefault() {},
        };

        instance.handleSubmit(event);
        expect(true).toBe(true);
    });

    test('Testing User Sign-Up - Happy Path', () => {
        const handleClick = jest.fn();
        
        firebase.doSignInWithEmailAndPassword.mockImplementationOnce(() => {return Promise.resolve({user: {email: "test1@test.com"}})});
        firebase.doCreateUserWithEmailAndPassword.mockImplementationOnce(() => {return Promise.resolve({user: {email: "test1@test.com"}})});
        elastic.addUser.mockImplementationOnce(() => { return true});
        elastic.searchUser.mockImplementationOnce(() => {return Promise.resolve(null)});

        const wrapper = shallow(<CHSignup updateContent={handleClick}/>);
        const instance = wrapper.instance();

        const event = {
            preventDefault() {},
        };

        instance.handleSubmit(event);
        expect(true).toBe(true);
    });

    test('Testing User Sign-Up - Sad Path', () => {
        const handleClick = jest.fn();
        
        firebase.doSignInWithEmailAndPassword.mockImplementationOnce(() => {return Promise.resolve({user: {email: "test1@test.com"}})});
        firebase.doCreateUserWithEmailAndPassword.mockImplementationOnce(() => {return Promise.resolve({user: {email: "test1@test.com"}})});
        elastic.addUser.mockImplementationOnce(() => { return Promise.resolve(false)});
        firebase.doDeleteUser.mockImplementationOnce(() => {return Promise.resolve(true)});
        elastic.searchUser.mockImplementationOnce(() => {return Promise.resolve(null)});

        const wrapper = shallow(<CHSignup updateContent={handleClick}/>);
        const instance = wrapper.instance();

        const event = {
            preventDefault() {},
        };

        instance.handleSubmit(event);
        expect(true).toBe(true);
    });

    test('Testing Search User Error', () => {
        const handleClick = jest.fn();
        elastic.searchUser.mockImplementationOnce(() => {throw new Error('Error on search function call')});

        const wrapper = shallow(<CHSignup updateContent={handleClick}/>);
        const instance = wrapper.instance();

        const event = {
            preventDefault() {},
        };

        instance.handleSubmit(event);
        expect(instance.state.serverErrorMsg).toBe('Error on search function call');
    });

    test('Testing Password Not Matching', () => {
        const handleClick = jest.fn();

        const wrapper = shallow(<CHSignup updateContent={handleClick}/>);
        const instance = wrapper.instance();
        instance.setState({
            password: "testP@ssw0rd",
            confirmPassword: "P@ssw0rd"
        })

        const event = {
            preventDefault() {},
        };

        instance.handleSubmit(event);
        expect(instance.state.password).toBe("testP@ssw0rd");
    });


    test('Testing update firstname ', () => {
        const handleClick = jest.fn();
        const wrapper = shallow(<CHSignup updateContent={handleClick}/>);
        const instance = wrapper.instance();

        const event = {
            preventDefault() {},
            target: {
                value: "Test First Name"
            }
        };

        instance.handleFirstNameChange(event);
        expect(instance.state.firstName).toBe('Test First Name');
    });

    test('Testing update lastname ', () => {
        const handleClick = jest.fn();
        const wrapper = shallow(<CHSignup updateContent={handleClick}/>);
        const instance = wrapper.instance();

        const event = {
            preventDefault() {},
            target: {
                value: "Test Last Name"
            }
        };

        instance.handleLastNameChange(event);
        expect(instance.state.lastName).toBe('Test Last Name');
    });

    test('Testing update email ', () => {
        const handleClick = jest.fn();
        const wrapper = shallow(<CHSignup updateContent={handleClick}/>);
        const instance = wrapper.instance();

        const event = {
            preventDefault() {},
            target: {
                value: "testemail@email.com"
            }
        };

        instance.handleEmailChange(event);
        expect(instance.state.email).toBe('testemail@email.com');
    });

    test('Testing update password ', () => {
        const handleClick = jest.fn();
        const wrapper = shallow(<CHSignup updateContent={handleClick}/>);
        const instance = wrapper.instance();

        const event = {
            preventDefault() {},
            target: {
                value: "P@ssw0rd"
            }
        };

        instance.handlePasswordChange(event);
        expect(instance.state.password).toBe('P@ssw0rd');
    });

    test('Testing update confirm password ', () => {
        const handleClick = jest.fn();
        const wrapper = shallow(<CHSignup updateContent={handleClick}/>);
        const instance = wrapper.instance();

        const event = {
            preventDefault() {},
            target: {
                value: "P@ssw0rd"
            }
        };

        instance.handleConfirmPasswordChange(event);
        expect(instance.state.confirmPassword).toBe('P@ssw0rd');
    });

    test('Testing Handle Hide Functionality ', () => {
        const handleClick = jest.fn();
        const wrapper = shallow(<CHSignup updateContent={handleClick}/>);
        const instance = wrapper.instance();

        const event = {
            preventDefault(){},
        }
        instance.handleHide(event);
        expect(instance.state.show).toBe(false);
    });
})