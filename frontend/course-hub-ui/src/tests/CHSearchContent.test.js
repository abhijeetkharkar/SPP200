import React from 'react';
import CHSearchContent from '../js/CHSearchContent';
import { shallow } from 'enzyme';
const fetch = require('node-fetch');

test('Testing search results fetch - Happy', async () => {
	const handleClick = jest.fn();
	const wrapper = shallow(<CHSearchContent  updateContent={handleClick}/>);
	const response = {
    "number_of_pages": 43,
    "current_page": "0",
    "courses": [
        {
            "Price": 0,
            "Difficulty": "Introductory",
            "Rating": 0,
            "Title": "Analyzing Data with Python",
            "Paid": false,
            "PriceCurrency": "USD",
            "CourseImage": "https://prod-discovery.edx-cdn.org/media/course/image/29a1e3b8-3e84-4b14-b60d-0fa97512e420-f37801543a61.small.png"
        }]};
	fetch.mockResponseOnce(JSON.stringify(response));
	expect(wrapper.exists()).toBe(true);
});

test('Testing search results fetch - Sad', async () => {
	const handleClick = jest.fn();
	const wrapper = shallow(<CHSearchContent updateContent={handleClick}/>);
	const response = { suggestions: ["Deep Learning", "Machine Learning"] };
	fetch.mockResponseOnce(response);
	expect(wrapper.exists()).toBe(true);
});