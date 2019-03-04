import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer'
import CHProfileNavigator from '../js/CHProfileNavigator';
import Footer from '../js/CHFooter'
import { shallow } from 'enzyme';
import { render } from 'enzyme';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';

const fetch = require('node-fetch');

test('Testing Loading of Profile Navigator webpage', () => {
    const wrapper = shallow(<CHProfileNavigator />);
    expect(wrapper.exists()).toBe(true);
});