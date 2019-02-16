'use strict';

const fetch = require('node-fetch');
const helpers = require('./helpers');
const dotenv = require('dotenv');
const edxMocks = require('./__mocks__/edxMocks');

dotenv.load();

describe('doRecursiveRequest', () => {
	test('Happy Path', async () => {
		fetch.mockResponseOnce(JSON.stringify(edxMocks.catalog));
		fetch.mockResponseOnce(JSON.stringify(edxMocks.catalogNull));

		const current = await helpers.doRecursiveRequest("", "", []);

		expect(current).toEqual(edxMocks.courseList);
	});
});

describe('doRecursiveInsert', () => {
	test('Happy Path', async () => {
		const response1 = JSON.stringify( {hits: {total: 1}} );
		const response2 = JSON.stringify( {hits: {total: 0}} );
		fetch.mockResponseOnce(response1);
		fetch.mockResponseOnce(response2);
		fetch.mockResponseOnce(response2);

		const current = await helpers.doRecursiveInsert(edxMocks.courseList, 0, 0);

		expect(current).toEqual(edxMocks.elasticResponse2);
	});
});