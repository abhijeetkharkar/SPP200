'use strict';

import { 	addUser, searchUser, getUserDetails, updateUser, elasticDeleteUser, 
			addDeal, addReview, getReviews, updateReview, addUserReviewLike, getUserReviewLikes, updateUserReviewLike, 
			getCourseDetails, updateCourseRating } from '../elasticSearch';
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

const elasticResponse81 = {
	"took": 1,
	"timed_out": false,
	"_shards": {
		"total": 3,
		"successful": 3,
		"skipped": 0,
		"failed": 0
	},
	"hits": {
		"total": 1,
		"max_score": 1,
		"hits": [{
				"_index": "reviews",
				"_type": "review",
				"_id": "eFN5-2kBH8XOSEpfq0q6",
				"_score": 1,
				"_source": {
					"ReviewId": "test1@testmail.com$2019-4-8$0:44:6",
					"CourseId": "EDX-IBM+DL0120EN",
					"Description": "Machine Learning is one of the first programming MOOCs Coursera put online by Coursera founder and Stanford Professor Andrew Ng. ",
					"Rating": 4,
					"UserId": "test1@testmail.com",
					"ParentReviewId": "test1@testmail.com$2019-4-8$0:44:6",
					"Edited": false,
					"PostedByInstructor": false,
					"CommentedOn": {
						"Date": "2019-4-8",
						"Time": "0:44:6"
					},
					"EditedOn": {
						"Date": "2019-4-8",
						"Time": "0:44:6"
					},
					"PostedBy": "Test1",
					"NoofLikes": 1,
					"NoofdisLikes": 0,
					"URL": "https://firebasestorage.googleapis.com/v0/b/course-hub-73ea7.appspot.com/o/images%2Ftest1_profile.txt?alt=media&token=0612b56d-6d9d-4877-b22f-96cc25805b22"
				}
			}
		]
	}
}
const elasticResponse81_1 = [{
	"id": "eFN5-2kBH8XOSEpfq0q6",
	"ReviewId": "test1@testmail.com$2019-4-8$0:44:6",
	"CourseId": "EDX-IBM+DL0120EN",
	"Description": "Machine Learning is one of the first programming MOOCs Coursera put online by Coursera founder and Stanford Professor Andrew Ng. ",
	"Rating": 4,
	"UserId": "test1@testmail.com",
	"ParentReviewId": "test1@testmail.com$2019-4-8$0:44:6",
	"Edited": false,
	"PostedByInstructor": false,
	"CommentedOn": {
		"Date": "2019-4-8",
		"Time": "0:44:6"
	},
	"EditedOn": {
		"Date": "2019-4-8",
		"Time": "0:44:6"
	},
	"PostedBy": "Test1",
	"NoofLikes": 1,
	"NoofdisLikes": 0,
	"URL": "https://firebasestorage.googleapis.com/v0/b/course-hub-73ea7.appspot.com/o/images%2Ftest1_profile.txt?alt=media&token=0612b56d-6d9d-4877-b22f-96cc25805b22"
}];

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

	test('Delete User - Happy Path 1', async () => {
		fetch.mockResponseOnce(JSON.stringify({deleted: 1}));

		const current = await elasticDeleteUser(payload);

		expect(current).toEqual(true);
	});

	test('Delete User - Sad Path 1', async () => {
		fetch.mockResponseOnce(JSON.stringify({deleted: 0}));

		const current = await elasticDeleteUser(payload);

		expect(current).toEqual(false);
	});

	test('Delete User - Sad Path 2', async () => {
		fetch.mockResponseOnce(elasticResponse43);

		const current = await elasticDeleteUser(payload);

		expect(current).toEqual(false);
	});

	test('Add Deal - Happy Path 1', async () => {
		fetch.mockResponseOnce(JSON.stringify({result: "created"}));

		const current = await addDeal(payload);

		expect(current).toEqual(true);
	});

	test('Add Deal - Sad Path 1', async () => {
		fetch.mockResponseOnce(JSON.stringify({result: "notcreated"}));

		const current = await addDeal(payload);

		expect(current).toEqual(false);
	});

	test('Add Deal - Sad Path 2', async () => {
		fetch.mockResponseOnce(elasticResponse43);

		const current = await addDeal(payload);

		expect(current).toEqual(false);
	});

	test('Add Review - Happy Path 1', async () => {
		fetch.mockResponseOnce(JSON.stringify({result: "created"}));

		const current = await addReview(payload);

		expect(current).toEqual(true);
	});

	test('Add Review - Sad Path 1', async () => {
		fetch.mockResponseOnce(JSON.stringify({result: "notcreated"}));

		const current = await addReview(payload);

		expect(current).toEqual(false);
	});

	test('Add Review - Sad Path 2', async () => {
		fetch.mockResponseOnce(elasticResponse43);

		const current = await addReview(payload);

		expect(current).toEqual(false);
	});

	test('Get Reviews - Happy Path 1', async () => {
		fetch.mockResponseOnce(JSON.stringify(elasticResponse81));

		const current = await getReviews(payload);

		expect(current).toEqual(elasticResponse81_1);
	});

	test('Get Reviews - Sad Path 1', async () => {
		fetch.mockResponseOnce(JSON.stringify({hits: {total: 0}}));

		const current = await getReviews(payload);

		expect(current).toEqual(null);
	});

	test('Get Reviews - Sad Path 2', async () => {
		fetch.mockResponseOnce(elasticResponse43);

		const current = await getReviews(payload);

		expect(current).toEqual(null);
	});

	test('Update Review - Happy Path 1', async () => {
		fetch.mockResponseOnce(JSON.stringify({result: "updated"}));

		const current = await updateReview("1".payload);

		expect(current).toEqual(true);
	});

	test('Update Review - Happy Path 2', async () => {
		fetch.mockResponseOnce(JSON.stringify({result: "noop"}));

		const current = await updateReview("1".payload);

		expect(current).toEqual(true);
	});

	test('Update Review - Sad Path 1', async () => {
		fetch.mockResponseOnce(JSON.stringify({result: "notcreated"}));

		const current = await updateReview("1", payload);

		expect(current).toEqual(false);
	});

	test('Update Review - Sad Path 2', async () => {
		fetch.mockResponseOnce(elasticResponse43);

		const current = await updateReview("1", payload);

		expect(current).toEqual(false);
	});

	test('Add UserReviewLike - Happy Path 1', async () => {
		fetch.mockResponseOnce(JSON.stringify({result: "created"}));

		const current = await addUserReviewLike(payload);

		expect(current).toEqual(true);
	});

	test('Add UserReviewLike - Sad Path 1', async () => {
		fetch.mockResponseOnce(JSON.stringify({result: "notcreated"}));

		const current = await addUserReviewLike(payload);

		expect(current).toEqual(false);
	});

	test('Add UserReviewLike - Sad Path 2', async () => {
		fetch.mockResponseOnce(elasticResponse43);

		const current = await addUserReviewLike(payload);

		expect(current).toEqual(false);
	});

	test('Get UserReviewLike - Happy Path 1', async () => {
		fetch.mockResponseOnce(JSON.stringify(elasticResponse81));

		const current = await getUserReviewLikes(payload);

		expect(current).toEqual(elasticResponse81_1);
	});

	test('Get UserReviewLike - Sad Path 1', async () => {
		fetch.mockResponseOnce(JSON.stringify({hits: {total: 0}}));

		const current = await getUserReviewLikes(payload);

		expect(current).toEqual(null);
	});

	test('Get UserReviewLike - Sad Path 2', async () => {
		fetch.mockResponseOnce(elasticResponse43);

		const current = await getUserReviewLikes(payload);

		expect(current).toEqual(null);
	});

	test('Update UserReviewLike - Happy Path 1', async () => {
		fetch.mockResponseOnce(JSON.stringify({result: "updated"}));

		const current = await updateUserReviewLike("1".payload);

		expect(current).toEqual(true);
	});

	test('Update UserReviewLike - Happy Path 2', async () => {
		fetch.mockResponseOnce(JSON.stringify({result: "noop"}));

		const current = await updateUserReviewLike("1".payload);

		expect(current).toEqual(true);
	});

	test('Update UserReviewLike - Sad Path 1', async () => {
		fetch.mockResponseOnce(JSON.stringify({result: "notcreated"}));

		const current = await updateUserReviewLike("1", payload);

		expect(current).toEqual(false);
	});

	test('Update UserReviewLike - Sad Path 2', async () => {
		fetch.mockResponseOnce(elasticResponse43);

		const current = await updateUserReviewLike("1", payload);

		expect(current).toEqual(false);
	});

	test('Get Course Details - Happy Path 1', async () => {
		fetch.mockResponseOnce(JSON.stringify(elasticResponse81));

		const current = await getCourseDetails(payload);

		expect(current).toEqual(elasticResponse81_1[0]);
	});

	test('Get Course Details - Sad Path 1', async () => {
		fetch.mockResponseOnce(JSON.stringify({hits: {total: 0}}));

		const current = await getCourseDetails(payload);

		expect(current).toEqual(null);
	});

	test('Get Course Details - Sad Path 2', async () => {
		fetch.mockResponseOnce(elasticResponse43);

		const current = await getCourseDetails(payload);

		expect(current).toEqual(null);
	});

	test('Update Course Rating - Happy Path 1', async () => {
		fetch.mockResponseOnce(JSON.stringify({result: "updated"}));

		const current = await updateCourseRating("1".payload);

		expect(current).toEqual(true);
	});

	test('Update Course Rating - Happy Path 2', async () => {
		fetch.mockResponseOnce(JSON.stringify({result: "noop"}));

		const current = await updateCourseRating("1".payload);

		expect(current).toEqual(true);
	});

	test('Update Course Rating - Sad Path 1', async () => {
		fetch.mockResponseOnce(JSON.stringify({result: "notcreated"}));

		const current = await updateCourseRating("1", payload);

		expect(current).toEqual(false);
	});

	test('Update Course Rating - Sad Path 2', async () => {
		fetch.mockResponseOnce(elasticResponse43);

		const current = await updateCourseRating("1", payload);

		expect(current).toEqual(false);
	});
});