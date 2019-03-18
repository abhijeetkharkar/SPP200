import React from 'react';
import CHNavigator from '../js/CHNavigator';
import { shallow } from 'enzyme';
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



test('Testing onchange autocomplete fetch - Happy 1', async () => {
    const handleClick = jest.fn();
    const wrapper = shallow(<CHNavigator  updateContent={handleClick}/>);
    const instance = wrapper.instance();
    const event = {
        preventDefault() { },
        target: { value: 'deep' }
    };
    wrapper.setState({ searchString: "abc", suggestions: ["abc", "def"] });
    const response = { suggestions: ["Deep Learning", "Machine Learning"] };
    fetch.mockResponseOnce(JSON.stringify(response));
    instance.handleSearchStringChange(event);
    expect(instance.state.suggestions[0]).toBe("abc"); // bad
});

test('Testing onchange autocomplete fetch - Happy 2', async () => {
    const handleClick = jest.fn();
    const wrapper = shallow(<CHNavigator  updateContent={handleClick}/>);
    const instance = wrapper.instance();
    const event = {
        preventDefault() { },
        target: { value: 'deep' }
    };
    wrapper.setState({ searchString: "ab", suggestions: ["abc", "def"] });
    const response = { suggestions: ["Deep Learning", "Machine Learning"] };
    fetch.mockResponseOnce(JSON.stringify(response));
    instance.handleSearchStringChange(event);
});

test('Testing onchange autocomplete fetch - Sad', async () => {
    const handleClick = jest.fn();
    const wrapper = shallow(<CHNavigator updateContent={handleClick}/>);
    const instance = wrapper.instance();
    const event = {
        preventDefault() { },
        target: { value: 'deep' }
    };
    wrapper.setState({ searchString: "abc", suggestions: ["abc", "def"] });
    const response = { suggestions: ["Deep Learning", "Machine Learning"] };
    fetch.mockResponseOnce(response);
    instance.handleSearchStringChange(event);
});

test('Testing handleOnclick', async () => {
    const handleClick = jest.fn();
    const wrapper = shallow(<CHNavigator updateContent={handleClick} />);
    wrapper.setState({ searchString: "abc", suggestions: ["abc", "def"] });
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
    const handlePagination = jest.fn();
    const wrapper = shallow(<CHNavigator updateContent={handleClick} updatePage={handlePagination}/>);
    wrapper.setState({ searchString: "abc", suggestions: ["abc", "def"] });
    const instance = wrapper.instance();
    const event = {
        preventDefault() { },
        target: { innerText: 'deep' }
    };
    instance.handleSearch(event);
});

test('Testing search results componentWillReceiveProps', async () => {
    const handleClick = jest.fn();
    const handlePagination = jest.fn();
	const wrapper = shallow(<CHNavigator updateContent={handleClick} updatePage={handlePagination} firstName={"Test1"} email={"test1@test.com"} searchString={"test"} pageNumber={1}/>);
	const instance = wrapper.instance();
    instance.componentWillReceiveProps();
	expect(wrapper.exists()).toBe(true);
});