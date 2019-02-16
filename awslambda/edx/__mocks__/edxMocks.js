'use strict';

const catalog = {
	"count": 1386,
	"next": "https://prod-edx-discovery.edx.org/api/v1/catalogs/420/courses/?limit=20&offset=1380",
	"previous": "https://prod-edx-discovery.edx.org/api/v1/catalogs/420/courses/?limit=20&offset=1340",
	"results": [{
		"key": "A1",
		"title": "Title 1",
		"course_runs": [{
			"image": {
				"src": "someImage11.png"
			},
			"marketing_url": "someUrl11",
			"seats": [{
				"price": "49.00",
				"currency": "USD"
			}, {
				"price": "0.00",
				"currency": "USD"
			}
			],
			"start": "2019-02-05T00:00:00Z",
			"end": "2019-03-25T23:59:00Z",
			"pacing_type": "instructor_paced",
			"full_description": "Some Description11",
			"staff": [{
				"uuid": "Staff1",
				"given_name": "Ruth",
				"family_name": "Cobos Pérez",
				"profile_image_url": "Some profile Image 1"
			}, {
				"uuid": "Staff2",
				"given_name": "Álvaro",
				"family_name": "Ortigosa",
				"profile_image_url": "Some profile Image 2"
			}
			],
			"min_effort": 4,
			"max_effort": 5,
			"weeks_to_complete": 5,
			"modified": "2019-02-08T21:47:59.170024Z",
			"level_type": "Introductory"
		},
		],
		"subjects": [{
			"slug": "computer-science"
		}, {
			"slug": "engineering"
		}
		],
		"modified": "2019-02-08T14:21:25.492159Z"
	}, {
		"key": "A2",
		"title": "Title 2",
		"course_runs": [{
			"image": {
				"src": "someImage21.png"
			},
			"marketing_url": "someUrl21",
			"seats": [{
				"price": "49.00",
				"currency": "USD"
			}
			],
			"start": "2019-05-05T00:00:00Z",
			"end": "2019-06-25T23:59:00Z",
			"pacing_type": "self_paced",
			"full_description": "Some Description21",
			"staff": [{
				"uuid": "Staff3",
				"given_name": "Some",
				"family_name": "Name3",
				"profile_image_url": "Some profile Image 3"
			}
			],
			"min_effort": 4,
			"max_effort": 6,
			"weeks_to_complete": 5,
			"modified": "2019-02-08T21:47:59.170024Z",
			"level_type": "Introductory"
		},
		],
		"subjects": [{
			"slug": "computer-science"
		}, {
			"slug": "mechanical"
		}
		],
		"modified": "2019-02-08T14:21:25.492159Z"
	}
	]
}


const catalogNull = {
	"count": 1386,
	"next": null,
	"previous": "https://prod-edx-discovery.edx.org/api/v1/catalogs/420/courses/?limit=20&offset=1360",
	"results": [{
		"key": "A1",
		"title": "Title 1",
		"course_runs": [{
			"image": {
				"src": "someImage11.png"
			},
			"marketing_url": "someUrl11",
			"seats": [{
				"price": "49.00",
				"currency": "USD"
			}, {
				"price": "0.00",
				"currency": "USD"
			}
			],
			"start": "2019-02-05T00:00:00Z",
			"end": "2019-03-25T23:59:00Z",
			"pacing_type": "instructor_paced",
			"full_description": "Some Description11",
			"staff": [{
				"uuid": "Staff1",
				"given_name": "Ruth",
				"family_name": "Cobos Pérez",
				"profile_image_url": "Some profile Image 1"
			}, {
				"uuid": "Staff2",
				"given_name": "Álvaro",
				"family_name": "Ortigosa",
				"profile_image_url": "Some profile Image 2"
			}
			],
			"min_effort": 4,
			"max_effort": 5,
			"weeks_to_complete": 5,
			"modified": "2019-02-08T21:47:59.170024Z",
			"level_type": "Introductory"
		},
		],
		"subjects": [{
			"slug": "computer-science"
		}, {
			"slug": "engineering"
		}
		],
		"modified": "2019-02-08T14:21:25.492159Z"
	}, {
		"key": "A2",
		"title": "Title 2",
		"course_runs": [{
			"image": {
				"src": "someImage21.png"
			},
			"marketing_url": "someUrl21",
			"seats": [{
				"price": "49.00",
				"currency": "USD"
			}
			],
			"start": "2019-05-05T00:00:00Z",
			"end": "2019-06-25T23:59:00Z",
			"pacing_type": "self_paced",
			"full_description": "Some Description21",
			"staff": [{
				"uuid": "Staff3",
				"given_name": "Some",
				"family_name": "Name3",
				"profile_image_url": "Some profile Image 3"
			}
			],
			"min_effort": 4,
			"max_effort": 6,
			"weeks_to_complete": 5,
			"modified": "2019-02-08T21:47:59.170024Z",
			"level_type": "Introductory"
		},
		],
		"subjects": [{
			"slug": "computer-science"
		}, {
			"slug": "mechanical"
		}
		],
		"modified": "2019-02-08T14:21:25.492159Z"
	}
	]
}


const courseList = [
	{
		"CourseId": "EDX-A1", //id
		"CourseProvider": "EDX", //provider
		"Title": "Title 1", //title
		"Category": ["computer-science", "engineering"],
		"CourseDuration": { "Value": 25, "Unit": "hrs" }, //duration
		"Paid": false, //paid?
		"Price": 0.0, //price
		"PriceCurrency": "USD",
		"Instructors": [{ InstructorId: "Staff1", InstructorName: "Ruth Cobos Pérez", ProfilePic: "Some profile Image 1" }, { InstructorId: "Staff2", InstructorName: "Álvaro Ortigosa", ProfilePic: "Some profile Image 2" }],
		"URL": "someUrl11",
		"Rating": 0.0,
		"Description": "Some Description11",
		"CourseImage": "someImage11.png",
		"StartDate": "2019-2-4",
		"EndDate": "2019-3-25",
		"SelfPaced": false,
		"Difficulty": "Introductory"
	},
	{
		"CourseId": "EDX-A2", //id
		"CourseProvider": "EDX", //provider
		"Title": "Title 2", //title
		"Category": ["computer-science", "mechanical"],
		"CourseDuration": { "Value": 30, "Unit": "hrs" }, //duration
		"Paid": true, //paid?
		"Price": 49.0, //price
		"PriceCurrency": "USD",
		"Instructors": [{ InstructorId: "Staff3", InstructorName: "Some Name3", ProfilePic: "Some profile Image 3" }],
		"URL": "someUrl21",
		"Rating": 0.0,
		"Description": "Some Description21",
		"CourseImage": "someImage21.png",
		"StartDate": "2019-5-4",
		"EndDate": "2019-6-25",
		"SelfPaced": true,
		"Difficulty": "Introductory"
	}
];


const elasticResponse = { status: 222, body: { recordsProcessed: 2, recordsInserted: 2 } };

const elasticResponse2 = { status: 222, body: { recordsProcessed: 2, recordsInserted: 0 } };

const finalResponse = { status: 200, body: JSON.stringify({ statusText: 'Success', message: '2 records processed | 2 records inserted' }) };

module.exports.catalog = catalog;
module.exports.catalogNull = catalogNull;
module.exports.courseList = courseList;
module.exports.elasticResponse = elasticResponse;
module.exports.elasticResponse2 = elasticResponse2;
module.exports.finalResponse = finalResponse;