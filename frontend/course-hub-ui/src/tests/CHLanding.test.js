import React from 'react';
import LandingPage from '../js/CHLandingContent';
import { shallow, render, mount } from 'enzyme';
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

test('Testing onchange autocomplete fetch - Happy', async () => {
    const handleClick = jest.fn();
    const wrapper = shallow(<LandingPage  updateContent={handleClick}/>);
    const instance = wrapper.instance();
    const event = {
        preventDefault() { },
        target: { value: 'deep' }
    };
    wrapper.setState({ searchquery: "abc", suggestions: ["abc", "def"] });
    const response = { suggestions: ["Deep Learning", "Machine Learning"] };
    fetch.mockResponseOnce(JSON.stringify(response));
    instance.handlesearchqueryChange(event);
    expect(instance.state.suggestions[0]).toBe("abc"); // bad
});

test('Testing onchange autocomplete fetch - Sad', async () => {
    const handleClick = jest.fn();
    const wrapper = shallow(<LandingPage updateContent={handleClick}/>);
    const instance = wrapper.instance();
    const event = {
        preventDefault() { },
        target: { value: 'deep' }
    };
    wrapper.setState({ searchquery: "abc", suggestions: ["abc", "def"] });
    const response = { suggestions: ["Deep Learning", "Machine Learning"] };
    fetch.mockResponseOnce(response);
    instance.handlesearchqueryChange(event);
});

test('Testing handleOnclick', async () => {
    const handleClick = jest.fn();
    const wrapper = shallow(<LandingPage updateContent={handleClick} />);
    wrapper.setState({ searchquery: "abc", suggestions: ["abc", "def"] });
    const instance = wrapper.instance();
    const event = {
        preventDefault() { },
        target: { innerText: 'deep' }
    };
    instance.handleOnclick(event);
    expect(instance.state.showResults).toBe(false);
});

test('Testing handleSearch', async () => {
    const handleClick = jest.fn();
    const wrapper = shallow(<LandingPage updateContent={handleClick}/>);
    wrapper.setState({ searchquery: "abc", suggestions: ["abc", "def"] });
    const instance = wrapper.instance();
    const event = {
        preventDefault() { },
        target: { innerText: 'deep' }
    };
    instance.handleSearch(event);
});