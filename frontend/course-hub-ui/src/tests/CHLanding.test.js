import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer'
import LandingPage from '../js/CHLandingContent';
import Footer from '../js/CHFooter'
import { shallow } from 'enzyme';
import { render } from 'enzyme';
import { mount } from 'enzyme';
const fetch = require('node-fetch');
test('Testing Loading of LandingPage', () => {
    const wrapper = shallow(<LandingPage />);
    expect(wrapper.exists()).toBe(true);
});

test('Testing autocomplete Landing Page', () => {
    const wrapper = shallow(<LandingPage />);
    wrapper.setState({ searchquery: "abc", suggestions: ["abc", "def"] });
    expect(wrapper.exists()).toBe(true);
});

test('Testing onchange autocomplete fetch', async () => {
    var LP = new LandingPage();
    const event = {
        preventDefault() {},
        target: { value: 'deep' }
      };
    const response ={ suggestions: ["Deep Learning","Machine Learning"]};
    fetch.mockResponseOnce(response);
    LP.handlesearchqueryChange(event);
    expect(response['suggestions'][0]).toBe("Deep Learning");
});