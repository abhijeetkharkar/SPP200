'use strict';

import { addUser, searchUser, getUserDetails, updateUser } from '../elasticSearch';
const fetch = require('node-fetch');

const elasticResponse11 = { result: "created" };
const elasticResponse12 = { result: "notcreated" };
const elasticResponse21 = {
	"hits": {
		  "total": 1,
		  "hits": [
			  {
				  "_id": "test1Id",
				  "_source": {
					  "UserName": {
						  "First": "Test1",
						  "Last": "Tester"
					  },
					  "Email": "test1@test.com"
				  }
			  }
		  ]
	  }
  };
const elasticResponse22 = {
	"hits": {
		  "total": 0
	  }
  };
const elasticResponse23 = { hits: { total: 0 } };
const elasticResponse31 = {
	"hits": {
		  "total": 1,
		  "hits": [
			  {
				  "_id": "test1Id",
				  "_source": {
					  "UserName": {
						  "First": "Test1",
						  "Last": "Tester"
					  },
					  "Email": "test1@test.com"
				  }
			  }
		  ]
	  }
  };
const elasticResponse32 = {
	"hits": {
		  "total": 0
	  }
  };
const elasticResponse33 = { hits: { total: 0 } };
const elasticResponse41 = { result: "updated" };
const elasticResponse42 = { result: "noop" };
const elasticResponse43 = { result: "noop1" };
const payload = {
	"Email": "test1@test.com",
	"UserName": {
		"First": "Test1",
		"Last": "Tester"
	}
}

describe('Elastic Search API', () => {
	test('Add User - Happy Path', async () => {
		fetch.mockResponseOnce(JSON.stringify(elasticResponse11));

		const current = await addUser(payload);

		expect(current).toEqual(true);
	});
	
	test('Add User - Sad Path 1', async () => {
		fetch.mockResponseOnce(JSON.stringify(elasticResponse12));

		const current = await addUser(payload);

		expect(current).toEqual(false);
	});
	
	test('Add User - Sad Path 2', async () => {
		fetch.mockResponseOnce(elasticResponse12);

		const current = await addUser(payload);

		expect(current).toEqual(false);
	});

	test('Search User - Happy Path', async () => {
		fetch.mockResponseOnce(JSON.stringify(elasticResponse21));

		const current = await searchUser("test1@test.com");

		expect(current).toEqual("Test1");
	});

	test('Search User - Sad Path 1', async () => {
		fetch.mockResponseOnce(JSON.stringify(elasticResponse22));

		const current = await searchUser("test1@test.com");

		expect(current).toEqual(null);
	});

	test('Search User - Sad Path 2', async () => {
		fetch.mockResponseOnce(elasticResponse23);

		const current = await searchUser("test1@test.com");

		expect(current).toEqual(null);
	});

	test('Get User Details - Happy Path', async () => {
		fetch.mockResponseOnce(JSON.stringify(elasticResponse31));

		const current = await getUserDetails("test1@test.com");

		expect(current).toEqual({ "id": "test1Id", "data": { UserName: { First: "Test1", Last: "Tester" }, Email: "test1@test.com" } });
	});

	test('Get User Details - Sad Path 1', async () => {
		fetch.mockResponseOnce(JSON.stringify(elasticResponse32));

		const current = await getUserDetails("test1@test.com");

		expect(current).toEqual(null);
	});

	test('Get User Details - Sad Path 2', async () => {
		fetch.mockResponseOnce(elasticResponse33);

		const current = await getUserDetails("test1@test.com");

		expect(current).toEqual(null);
	});

	test('Update User - Happy Path 1', async () => {
		fetch.mockResponseOnce(JSON.stringify(elasticResponse41));

		const current = await updateUser("test1Id", payload);

		expect(current).toEqual(true);
	});

	test('Update User - Happy Path 2', async () => {
		fetch.mockResponseOnce(JSON.stringify(elasticResponse42));

		const current = await updateUser("test1Id", payload);

		expect(current).toEqual(true);
	});

	test('Update User - Sad Path 1', async () => {
		fetch.mockResponseOnce(JSON.stringify(elasticResponse43));

		const current = await updateUser("test1Id", payload);

		expect(current).toEqual(false);
	});

	test('Update User - Sad Path 2', async () => {
		fetch.mockResponseOnce(elasticResponse43);

		const current = await updateUser("test1Id", payload);

		expect(current).toEqual(false);
	});
});