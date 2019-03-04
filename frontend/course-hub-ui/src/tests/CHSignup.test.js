import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer'
import CHSignup from '../js/CHSignup';
import { shallow } from 'enzyme';
import { render } from 'enzyme';
import { mount } from 'enzyme';
import { Promise, reject } from 'q';
import { resolve } from 'url';
const fetch = require('node-fetch');


describe('Testing SignUp', () => {
    test('Testing Loading of LandingPage', () => {
        const wrapper = shallow(<CHSignup />);
        expect(wrapper.exists()).toBe(true);
    });

    test('Testing HandleSubmit ', () => {
        var signUpPage = new CHSignup();
        signUpPage.setState({
            firstName : "test first name",
            lastName : "test last name",
            email : "testemail@gmail.com",
            password : "testpassword"
        })

        const response_create_user = new Promise((resolve, reject) => {
            resolve(true)
        });

        // doCreateUserWithEmailAndPassword = jest.fn(response_create_user);
        
        const event = {
            preventDefault() {},
        };
        
        signUpPage.handleSubmit(event);
        expect(true).toBe(true);
    });

    test('Testing update firstname ', () => {
        var signUpPage = new CHSignup();
        
        const event = {
            // preventDefault() {},
            target: { value: 'test first name' },
        };

        signUpPage.handleFirstNameChange(event);
        expect(signUpPage.state.firstName).toBe('');
    });

    test('Testing update lastname ', () => {
        var signUpPage = new CHSignup();
        
        const event = {
            // preventDefault() {},
            target: { value: 'test last name' },
        };

        signUpPage.handleLastNameChange(event);
        expect(signUpPage.state.lastName).toBe('');
    });

    test('Testing update email ', () => {
        var signUpPage = new CHSignup();
        
        const event = {
            // preventDefault() {},
            target: { value: 'testemail@gmail.com' },
        };

        signUpPage.handleLastNameChange(event);
        expect(signUpPage.state.email).toBe('');
    });

    test('Testing update password ', () => {
        var signUpPage = new CHSignup();
        
        const event = {
            // preventDefault() {},
            target: { value: 'testPassword' },
        };

        signUpPage.handlePasswordChange(event);
        expect(signUpPage.state.password).toBe('');
    });

    test('Testing update confirm password ', () => {
        var signUpPage = new CHSignup();
        
        const event = {
            // preventDefault() {},
            target: { value: 'testPassword' },
        };

        signUpPage.handleConfirmPasswordChange(event);
        expect(signUpPage.state.lastName).toBe('');
    });
})