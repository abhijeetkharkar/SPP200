import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer'
import ForgotPasswordPage from '../js/CHForgotPassword';
import { shallow, render, mount } from 'enzyme';
import {Form} from 'react-bootstrap';

const fetch = require('node-fetch');
const firebase = require('../FirebaseUtils');
const elastic = require('../elasticSearch');

jest.mock('../FirebaseUtils');
jest.mock('../elasticSearch');

describe('Testing SignUp', () => {
    test('Testing Loading of LandingPage', () => {
        const wrapper = shallow(<ForgotPasswordPage />);
        expect(wrapper.exists()).toBe(true);
    });

    test('Testing HandleSubmit - Happy', () => {
        firebase.doPasswordReset.mockImplementationOnce(() => {return Promise.resolve(true)});
        const wrapper = shallow(<ForgotPasswordPage />);
        const instance = wrapper.instance();
        const event = {
            currentTarget: { 
                checkValidity: () => true
            },
            preventDefault() { },
            stopPropagation() { },
        };

        instance.handleSubmit(event);
        
        // expect(instance.state.showMessage).toBe(true);
        // expect(instance.state.serverMsg).toBe("Password Reset Email sent successfully. Please check your mailbox.");
    });

    test('Testing HandleSubmit - Sad 1', () => {
        const wrapper = shallow(<ForgotPasswordPage />);
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
        firebase.doPasswordReset.mockImplementationOnce(() => {return Promise.reject(new Error("Error"))});
        const wrapper = shallow(<ForgotPasswordPage />);
        const instance = wrapper.instance();
        const event = {
            currentTarget: { 
                checkValidity: () => true
            },
            preventDefault() { },
            stopPropagation() { },
        };
        
        instance.handleSubmit(event);
        
        // expect(instance.state.showMessage).toBe(true);
        // expect(instance.state.serverMsg).toBe("Please try again later");
    });

    test('Testing update email', async () => {
        const wrapper = shallow(<ForgotPasswordPage />);
        const instance = wrapper.instance();
        const event = {
            target: { value: 'test1@test.com' },
        };
        instance.handleEmailChange(event);
        expect(instance.state.email).toBe('test1@test.com');
    });

    test('Testing handle show', async () => {
        const wrapper = shallow(<ForgotPasswordPage />);
        const instance = wrapper.instance();
        instance.handleShow();
        expect(instance.state.show).toBe(true);
    });

    test('Testing handle hide', async () => {
        const handleClick = jest.fn();
        const wrapper = shallow(<ForgotPasswordPage updateContent={handleClick}/>);
        const instance = wrapper.instance();
        instance.handleHide();
        expect(instance.state.show).toBe(false);
        expect(handleClick.mock.calls.length).toBe(1);
    });

    test('Testing Close Button', async () => {
        const handleClick = jest.fn();
        const wrapper = shallow(<ForgotPasswordPage updateContent={handleClick} />);
        const instance = wrapper.instance();
        wrapper.find('#forgotPasswordCloseButton').simulate("click");
        expect(handleClick.mock.calls.length).toBe(1);
    });
})