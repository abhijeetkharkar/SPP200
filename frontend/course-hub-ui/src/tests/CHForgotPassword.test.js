import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer'
import CHForgotPassword from '../js/CHForgotPassword';
import { Form } from 'react-bootstrap';
import { shallow } from 'enzyme';
import { render } from 'enzyme';
import { mount } from 'enzyme';
import { Promise, reject } from 'q';
import { resolve } from 'url';
const fetch = require('node-fetch');


describe('Testing SignUp', () => {
    test('Testing Loading of LandingPage', () => {
        const wrapper = shallow(<CHForgotPassword />);
        expect(wrapper.exists()).toBe(true);
    });

    test('check Email Change ', () => {
        var ForgotPassword = new CHForgotPassword();
        
        const event = {
            preventDefault() {},
            target: { value: 'test first name' },
        };

        ForgotPassword.handleEmailChange(event);
        expect(ForgotPassword.state.email).toBe('');
    });

    test("check handle submit ", () => {
        var ForgotPassword = new CHForgotPassword();
        
        const event = {
            target: { value: 'test first name' },
            // currentTarget : new Form(),
        };

        // TODO: mock doPasswordReset function
        ForgotPassword.handleSubmit(event);
        expect(ForgotPassword.state.showMessage).toBe(false);
    });
})