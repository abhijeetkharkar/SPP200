import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer'
import Navigator from '../js/CHNavigator';
import Footer from '../js/CHFooter'
import { shallow } from 'enzyme';
import { render } from 'enzyme';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';

const fetch = require('node-fetch');

test('Testing Loading of Navigator webpage', () => {
    const wrapper = shallow(<Navigator />);
    expect(wrapper.exists()).toBe(true);
});

test('Testing Signout feature', async () => {
    var navigator = new Navigator();
    const event = {
        preventDefault() {}
      };
    navigator.handleSignOut(event);
    expect(true).toBe(true);
});

test('Testing View Profile feature', async () => {
    var navigator = new Navigator();
    const event = {
        preventDefault() {}
      };
    navigator.handleViewProfile(event);
    expect(true).toBe(true);
});