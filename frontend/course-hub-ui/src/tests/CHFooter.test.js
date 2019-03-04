import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer'
import Footer from '../js/CHFooter'
import { shallow } from 'enzyme';
import { render } from 'enzyme';
import { mount } from 'enzyme';
const fetch = require('node-fetch');


test('Testing Loading of LandingPage', () => {
    const wrapper = shallow(<Footer />);
    expect(wrapper.exists()).toBe(true);
});