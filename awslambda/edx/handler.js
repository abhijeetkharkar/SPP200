'use strict';

var dotenv = require('dotenv');
const fetch = require("node-fetch");
const { URLSearchParams } = require('url');
const helpers = require('./helpers');
dotenv.load();

module.exports.edxDaily = async (event, context) => {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', process.env.EDX_CLIENT_ID);
  params.append('client_secret', process.env.EDX_CLIENT_SECRET);
  params.append('token_type', 'jwt');

  var accessToken;

  return new Promise((resolve, reject) => {
    fetch(process.env.EDX_GET_TOKEN, { method: 'POST', body: params }).then(response => {
      // console.log("Status: ", response.status);
      if (response.status === 200) {
        return response.json();
      } else {
        throw Error(response.status + ": " + response.statusText);
      }
    }).then(tokenData => {
      // console.log("Access Token: ", tokenData.access_token);
      accessToken = tokenData.access_token;
      return fetch(process.env.EDX_FETCH_COURSES, { headers: { 'Authorization': 'JWT ' + tokenData.access_token } });
    }).then(catalog => {
      // console.log("Response Status: ", catalog.status, " :: Response Status Text: ", catalog);
      if (catalog.status === 200) {
        return catalog.json();
      } else {
        throw Error(catalog.status + ": " + catalog.statusText);
      }
    }).then(catalogData => {
      var courses = catalogData.results.
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
      if (catalogData.next != null) {
        // console.log("Length: ", courses.length, " :: Next: ", catalogData.next);
        return helpers.doRecursiveRequest(catalogData.next, accessToken, courses);
        // return helpers.doRecursiveRequest("https://prod-edx-discovery.edx.org/api/v1/catalogs/420/courses/?limit=20&offset=1300", accessToken, courses);
      } else {
        return courses;
      }
    }).then(courses => {
      console.log("Courses Length: ", courses.length);
      return helpers.doRecursiveInsert(courses, 0, 0);
    }).then(finalResponse => {
      if (finalResponse.status === 222) {
        resolve({ status: 200, body: JSON.stringify({ statusText: 'Success', message: finalResponse.body.recordsProcessed + ' records processed | ' + finalResponse.body.recordsInserted + ' records inserted' }) });
      } else {
        throw Error("Insert Failed Due to an Unknown Reason");
      }
    }).catch(error => {
      reject(error);
    });
  });
};