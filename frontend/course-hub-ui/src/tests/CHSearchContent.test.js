import React from 'react';
import CHSearchContent from '../js/CHSearchContent';
import { shallow } from 'enzyme';
const fetch = require('node-fetch');

test('Testing search results fetch - Happy 1', async () => {
	const handleClick = jest.fn();
    const handlePagination = jest.fn();
	const wrapper = shallow(<CHSearchContent updateContent={handleClick} updatePage={handlePagination} firstName={"Test1"} email={"test1@test.com"} searchString={"test"} pageNumber={1}/>);
	const response = {
    "number_of_pages": 43,
    "current_page": 1,
    "courses": [
        {
            "Price": 0,
            "Difficulty": "Introductory",
            "Rating": 0,
            "Title": "Analyzing Data with Python",
            "Paid": false,
            "PriceCurrency": "USD",
            "CourseDuration": {"Value": 1, "Unit": "Week"},
            "Instructors": [{"InstructorName": "testInstructor"}],
            "CourseImage": "https://prod-discovery.edx-cdn.org/media/course/image/29a1e3b8-3e84-4b14-b60d-0fa97512e420-f37801543a61.small.png"
        }]};
	fetch.mockResponseOnce(JSON.stringify(response));
	expect(wrapper.exists()).toBe(true);
});

test('Testing search results fetch - Happy 2', async () => {
	const handleClick = jest.fn();
    const handlePagination = jest.fn();
	const wrapper = shallow(<CHSearchContent updateContent={handleClick} updatePage={handlePagination} firstName={"Test1"} email={"test1@test.com"} searchString={"test"} pageNumber={1}/>);
	const response = {
    "number_of_pages": 43,
    "current_page": 1,
    "courses": [
        {
            "Price": 0,
            "Rating": 0,
            "Title": "Analyzing Data with Python",
            "Paid": false,
            "PriceCurrency": "USD"
        }]};
	fetch.mockResponseOnce(JSON.stringify(response));
	expect(wrapper.exists()).toBe(true);
});

test('Testing search results fetch - Sad', async () => {
    const handleClick = jest.fn();
    const handlePagination = jest.fn();
	const wrapper = shallow(<CHSearchContent updateContent={handleClick} updatePage={handlePagination} firstName={"Test1"} email={"test1@test.com"} searchString={"test"} pageNumber={1}/>);
	const response = { suggestions: ["Deep Learning", "Machine Learning"] };
	fetch.mockResponseOnce(response);
	expect(wrapper.exists()).toBe(true);
});


test('Testing search results componentWillReceiveProps - Happy 1', async () => {
	const handleClick = jest.fn();
    const handlePagination = jest.fn();
	const wrapper = shallow(<CHSearchContent updateContent={handleClick} updatePage={handlePagination} firstName={"Test1"} email={"test1@test.com"} searchString={"test"} pageNumber={1}/>);
	const response = {
    "number_of_pages": 43,
    "current_page": 1,
    "courses": [
        {
            "Price": 0,
            "Rating": 0,
            "Title": "Analyzing Data with Python",
            "Paid": false,
            "PriceCurrency": "USD"
        }]};
    fetch.mockResponseOnce(JSON.stringify(response));
    const instance = wrapper.instance();
    instance.componentWillReceiveProps({searchString: "test", pageNumber: 1});
	expect(wrapper.exists()).toBe(true);
});

test('Testing search results componentWillReceiveProps - Sad', async () => {
    const handleClick = jest.fn();
    const handlePagination = jest.fn();
	const wrapper = shallow(<CHSearchContent updateContent={handleClick} updatePage={handlePagination} firstName={"Test1"} email={"test1@test.com"} searchString={"test"} pageNumber={1}/>);
	const response = { suggestions: ["Deep Learning", "Machine Learning"] };
	fetch.mockResponseOnce(response);
    const instance = wrapper.instance();
    instance.componentWillReceiveProps({searchString: "test", pageNumber: 1});
	expect(wrapper.exists()).toBe(true);
});


test('Testing search results handlePagination-1', async () => {
    const handleClick = jest.fn();
    // const createPageList = jest.fn(() => [1,2,3]);
    const handlePagination = jest.fn();
	const wrapper = shallow(<CHSearchContent updateContent={handleClick} updatePage={handlePagination} firstName={"Test1"} email={"test1@test.com"} searchString={"test"} pageNumber={1}/>);
    const instance = wrapper.instance();
    expect(instance.createPageList(2, 40)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('Testing search results handlePagination-2', async () => {
    const handleClick = jest.fn();
    const handlePagination = jest.fn();
	const wrapper = shallow(<CHSearchContent updateContent={handleClick} updatePage={handlePagination} firstName={"Test1"} email={"test1@test.com"} searchString={"test"} pageNumber={1}/>);
    const instance = wrapper.instance();
    expect(instance.createPageList(39, 40)).toEqual([30, 31, 32, 33, 34, 35, 36, 37, 38, 39]);
});

test('Testing On-click feature - 1', async () => {
    const handleClick = jest.fn();
    const handlePagination = jest.fn();
	const wrapper = shallow(<CHSearchContent updateContent={handleClick} updatePage={handlePagination} firstName={"Test1"} email={"test1@test.com"} searchString={"test"} pageNumber={1}/>);
    const instance = wrapper.instance();
    wrapper.find('#search-results-table-footer-paginator-first').simulate("click");
});

test('Testing On-click feature - 2', async () => {
    const handleClick = jest.fn();
    const handlePagination = jest.fn();
	const wrapper = shallow(<CHSearchContent updateContent={handleClick} updatePage={handlePagination} firstName={"Test1"} email={"test1@test.com"} searchString={"test"} pageNumber={1}/>);
    const instance = wrapper.instance();
    wrapper.find('#search-results-table-footer-paginator-prev').simulate("click");
});

test('Testing On-click feature - 3', async () => {
    const handleClick = jest.fn();
    const handlePagination = jest.fn();
	const wrapper = shallow(<CHSearchContent updateContent={handleClick} updatePage={handlePagination} firstName={"Test1"} email={"test1@test.com"} searchString={"test"} pageNumber={1}/>);
    const instance = wrapper.instance();
    instance.setState({totalPages: 40, pageList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]})
    wrapper.find('#search-results-table-footer-paginator-item-1').simulate("click");
});

test('Testing On-click feature - 4', async () => {
    const handleClick = jest.fn();
    const handlePagination = jest.fn();
	const wrapper = shallow(<CHSearchContent updateContent={handleClick} updatePage={handlePagination} firstName={"Test1"} email={"test1@test.com"} searchString={"test"} pageNumber={1}/>);
    const instance = wrapper.instance();
    instance.setState({totalPages: 40, pageList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]})
    wrapper.find('#search-results-table-footer-paginator-item-2').simulate("click");
});

test('Testing On-click feature - 5', async () => {
    const handleClick = jest.fn();
    const handlePagination = jest.fn();
	const wrapper = shallow(<CHSearchContent updateContent={handleClick} updatePage={handlePagination} firstName={"Test1"} email={"test1@test.com"} searchString={"test"} pageNumber={0}/>);
    const instance = wrapper.instance();
    instance.setState({totalPages: 43});
    wrapper.find('#search-results-table-footer-paginator-next').simulate("click");
});

test('Testing On-click feature - 6', async () => {
    const handleClick = jest.fn();
    const handlePagination = jest.fn();
	const wrapper = shallow(<CHSearchContent updateContent={handleClick} updatePage={handlePagination} firstName={"Test1"} email={"test1@test.com"} searchString={"test"} pageNumber={1}/>);
    const instance = wrapper.instance();
    wrapper.find('#search-results-table-footer-paginator-last').simulate("click");
});