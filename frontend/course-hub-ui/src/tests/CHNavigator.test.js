import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer'
import CHNavigator from '../js/CHNavigator';
import Footer from '../js/CHFooter'
import { shallow } from 'enzyme';
import { render } from 'enzyme';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';
const firebase = require('../FirebaseUtils');

const fetch = require('node-fetch');

jest.mock('../FirebaseUtils');

test('Testing Loading of Navigator webpage', () => {
    const handleClick = jest.fn();
    const wrapper = shallow(<CHNavigator updateContent={handleClick} signedIn={false} />);
    expect(wrapper.exists()).toBe(true);
});

test('Testing Loading of Navigator webpage', () => {
    const handleClick = jest.fn();
    const wrapper = shallow(<CHNavigator updateContent={handleClick} signedIn={true} firstName={"Test1"} email={"test1@test.com"} />);
    expect(wrapper.exists()).toBe(true);
});


test('Testing Signout feature - Happy Path', async () => {
    const handleClick = jest.fn();
    firebase.doSignOut.mockImplementationOnce(() => {return Promise.resolve('result of signOut')});
    const wrapper = shallow(<CHNavigator updateContent={handleClick} signedIn={true} firstName={"Test1"} email={"test1@test.com"} />);
    const instance = wrapper.instance();
    const event = {
        preventDefault() { }
    };
    instance.handleSignOut(event);
    expect(firebase.doSignOut).toHaveBeenCalledTimes(1);
});


test('Testing Signout feature - Sad Path', async () => {
    const handleClick = jest.fn();
    firebase.doSignOut.mockImplementationOnce(() => {return Promise.reject('result of signOut')});
    const wrapper = shallow(<CHNavigator updateContent={handleClick} signedIn={true} firstName={undefined} email={"test1@test.com"} />);
    const instance = wrapper.instance();
    const event = {
        preventDefault() { }
    };
    instance.handleSignOut(event);
    expect(firebase.doSignOut).toHaveBeenCalledTimes(1);
    expect(handleClick.mock.calls.length).toBe(0);
});

test('Testing View Profile feature', async () => {
    const handleClick = jest.fn();
    const wrapper = shallow(<CHNavigator updateContent={handleClick} signedIn={true} firstName={"Test1"} email={"test1@test.com"} />);
    const instance = wrapper.instance();
    const event = {
        preventDefault() { }
    };
    instance.handleViewProfile(event);
    expect(handleClick.mock.calls.length).toBe(1);
});

test('Testing On-click feature', async () => {
    const handleClick = jest.fn();
    const wrapper = shallow(<CHNavigator updateContent={handleClick} signedIn={false} firstName={"Test1"} email={"test1@test.com"} />);
    const instance = wrapper.instance();
    wrapper.find('#loginButtonNavigator').simulate("click");
    expect(handleClick.mock.calls.length).toBe(1);
});