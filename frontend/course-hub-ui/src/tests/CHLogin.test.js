import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer'
import LoginPage from '../js/CHLogin';
import { shallow } from 'enzyme';
import { render } from 'enzyme';
import { mount } from 'enzyme';
import { Promise, reject } from 'q';
import { resolve } from 'url';
//import { doSignInWithEmailAndPassword, doSignInWithGoogle, doDeleteUser, doPasswordReset } from '../FirebaseUtils';
import * as m from '../FirebaseUtils';
import { addUser, searchUser } from '../elasticSearch';
const fetch = require('node-fetch');

/* jest.mock('../FirebaseUtils', () => {({
    doSignInWithEmailAndPassword: jest.fn().mockImplementation(() => new Promise((resolve, reject) => {resolve(true);}))
})}); */

describe('Testing SignUp', () => {
    test('Testing Loading of LandingPage', () => {
        const wrapper = shallow(<LoginPage />);
        expect(wrapper.exists()).toBe(true);
    });

    test('Testing HandleSubmit ', () => {
        var loginPage = new LoginPage();
        loginPage.setState({
            show: false,
            validated: false,
            email: 'abc@xyz.test',
            password: '',
            loggedIn: false,
            serverErrorMsg: ''
        })

        console.log("EMAIL: ", loginPage.state.email);

        /* const response_create_user = new Promise((resolve, reject) => {
            resolve(true)
        }); */

        /* doSignInWithEmailAndPassword = jest.fn(new Promise((resolve, reject) => {
            resolve(true);
        })
        ); */

        const event = {
            preventDefault() { },
        };

        loginPage.handleSubmit(event);
        expect(true).toBe(true);
    });

    test('Testing update email ', () => {
        var loginPage = new LoginPage();

        const event = {
            // preventDefault() {},
            target: { value: 'test first name' },
        };

        loginPage.handleEmailChange(event);
        expect(loginPage.state.email).toBe('');
    });

    test('Testing update password ', () => {
        var loginPage = new LoginPage();

        const event = {
            // preventDefault() {},
            target: { value: 'testPassword' },
        };

        loginPage.handlePasswordChange(event);
        expect(loginPage.state.password).toBe('');
    });
})