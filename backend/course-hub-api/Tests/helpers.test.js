'use strict';
const fetch = require('node-fetch');
const mockData = require('./mockData');
const helpers = require('../controller/helpers');

describe("GET COURSES TESTING SUITE", async () => {
	test("Happy Path", async () => {
		fetch.mockResponseOnce(JSON.stringify(mockData.mockResponseIntro));
		const current = await helpers.getcourses("test term", "Introductory");
		expect(current.courses.length).toEqual(2);
	});

	test("Sad Path - Invalid JSON", async () => {
		fetch.mockResponseOnce(mockData.mockResponseIntro);
		const current = await helpers.getcourses("test term", "Introductory");
		expect(current.error).toEqual("invalid json response body at undefined reason: Unexpected token o in JSON at position 1");
	});	
});