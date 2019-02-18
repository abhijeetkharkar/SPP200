'use strict';

const fetch = require('node-fetch');
const edx = require('./handler');
const helpers = require('./helpers');
const dotenv = require('dotenv');
const edxMocks = require('./__mocks__/edxMocks');

dotenv.load();

jest.mock('./helpers');

describe('edxDaily', () => {
	test('Happy Path', async () => {
		const response = JSON.stringify( {access_token: "Test"} );
		fetch.mockResponseOnce(response);
		fetch.mockResponseOnce(JSON.stringify(edxMocks.catalog));

		helpers.doRecursiveRequest.mockImplementationOnce(() => edxMocks.courseList);
		helpers.doRecursiveInsert.mockImplementationOnce(() => edxMocks.elasticResponse);

		const current = await edx.edxDaily(null, null);

		expect(helpers.doRecursiveRequest).toHaveBeenCalled();
		expect(current).toEqual(edxMocks.finalResponse);
	});

	test('fetch calls', () => {
		expect(fetch).toHaveBeenCalledTimes(2);
	});
});