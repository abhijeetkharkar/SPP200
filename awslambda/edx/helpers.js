'use strict';

var dotenv = require('dotenv');
const fetch = require("node-fetch");
const { URLSearchParams } = require('url');
dotenv.load();

var doRecursiveRequest = (url, token, courses) =>
	fetch(url, { headers: { 'Authorization': 'JWT ' + token } }).then(response => {
		// console.log("Response Status in doRecursiveRequest: ", response.status);
		if (response.status === 200) {
			return response.json();
		} else {
			throw Error(response.status + ": " + response.statusText);
		}
	}).then(catalogData => {
		if (catalogData.next !== null) {
			var temp = catalogData.results.
				filter(course => course.key !== null && course.key !== '' && typeof course.course_runs !== 'undefined').
				map(course => ({
					"CourseId": "EDX-" + course.key, //id
					"CourseProvider": "EDX", //provider
					"Title": course.title, //title
					"Category": typeof course.subjects === 'undefined' ? [] : course.subjects.filter(subject => subject.slug !== 'undefined' && subject.slug !== null).map(subject => subject.slug), //category
					"CourseDuration": { "Value": course.course_runs[0].max_effort * course.course_runs[0].weeks_to_complete, "Unit": "hrs" }, //duration
					"Paid": typeof course.course_runs[0].seats === 'undefined' ? false : course.course_runs[0].seats.filter(seat => typeof seat.price !== 'undefined' && seat.price === "0.00").length === 0, //paid?
					"Price": typeof course.course_runs[0].seats === 'undefined' ? false : course.course_runs[0].seats.filter(seat => typeof seat.price !== 'undefined' && seat.price === "0.00").length !== 0 ? 0.0 : parseFloat(course.course_runs[0].seats.filter(seat => seat.price !== "0.00")[0].price), //price
					"PriceCurrency": typeof course.course_runs[0].seats === 'undefined' ? null : course.course_runs[0].seats[0].currency,
					"Instructors": (typeof course.course_runs[0].staff === 'undefined' || course.course_runs[0].staff.length === 0) ? [] : course.course_runs[0].staff.map(staff => ({ InstructorId: staff.uuid, InstructorName: staff.given_name + " " + staff.family_name, ProfilePic: staff.profile_image_url })),
					"URL": typeof course.course_runs[0].marketing_url === 'undefined' ? null : course.course_runs[0].marketing_url,
					"Rating": 0.0,
					"Description": typeof course.course_runs[0].full_description === 'undefined' ? null : course.course_runs[0].full_description,
					"CourseImage": (typeof course.course_runs[0].image === 'undefined' || typeof course.course_runs[0].image.src === 'undefined') ? null : course.course_runs[0].image.src,
					"StartDate": (typeof course.course_runs[0].start === 'undefined' || course.course_runs[0].start === null) ? null : (isNaN(Date.parse(course.course_runs[0].start)) ? null : new Date(Date.parse(course.course_runs[0].start)).getFullYear() + "-" + (parseInt(new Date(Date.parse(course.course_runs[0].start)).getMonth()) + 1) + "-" + new Date(Date.parse(course.course_runs[0].start)).getDate()),
					"EndDate": (typeof course.course_runs[0].end === 'undefined' || course.course_runs[0].end === null) ? null : (isNaN(Date.parse(course.course_runs[0].end)) ? null : new Date(Date.parse(course.course_runs[0].end)).getFullYear() + "-" + (parseInt(new Date(Date.parse(course.course_runs[0].end)).getMonth()) + 1) + "-" + new Date(Date.parse(course.course_runs[0].end)).getDate()),
					"SelfPaced": (typeof course.course_runs[0].pacing_type === 'undefined' || course.course_runs[0].pacing_type === null || course.course_runs[0].pacing_type !== 'self_paced') ? false : true,
					"Difficulty": typeof course.course_runs[0].level_type === 'undefined' ? null : course.course_runs[0].level_type
				}));
			courses = courses.concat(temp);
			console.log("Length: ", courses.length, " :: Next: ", catalogData.next);
			return doRecursiveRequest(catalogData.next, token, courses);
		} else {
			console.log("Final Length: ", courses.length);
			return courses;
		}
	}).catch(error => {
		return error.message;
	});

var doRecursiveInsert = (courses, index, insertCount) =>
	fetch(process.env.AWS_ELASTIC_SEARCH_URL + "_search/", { method: 'POST', body: JSON.stringify({ "query": { "term": { "CourseId": courses[index].CourseId } } }), headers: { 'Content-Type': 'application/json' } }).then(response => {
		return response.json();
	}).then(elasticData => {
		if (elasticData.hits.total === 0) {
			return fetch(process.env.AWS_ELASTIC_SEARCH_URL + "course/", { method: 'POST', body: JSON.stringify(courses[index]), headers: { 'Content-Type': 'application/json' } });
		} else {
			return { status: 200, body: JSON.stringify({ message: 'dummy' }) }
		}
	}).then(insertStatusResponse => {
		if (insertStatusResponse.status === 200 || insertStatusResponse.status === 201) {
			// console.log("\rIndex: ", index);
			index++;
			if (insertStatusResponse.status === 201) {
				insertCount++;
			}
			if (index < courses.length) {
				return doRecursiveInsert(courses, index, insertCount);
			} else {
				return { status: 222, body: { recordsProcessed: courses.length, recordsInserted: insertCount } }
			}
		} else {
			throw Error("JSON Request: ", JSON.stringify(courses[index]) + "\nResponse: ", insertStatusResponse);
		}
	}).catch(error => {
		console.log(error.message);
	});


module.exports.doRecursiveRequest = doRecursiveRequest
module.exports.doRecursiveInsert = doRecursiveInsert
