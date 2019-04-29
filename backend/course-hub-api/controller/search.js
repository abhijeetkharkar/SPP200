// //All search Related query
const config = require('../config/config.json');
const fetch = require("node-fetch");
const helpers = require('./helpers');

exports.autosuggest = function (request, response) {
    if (request.query.term == undefined) {
        // console.log('StatusCode: 400');
        console.log('Error: BAD REQUEST!! Could not find the search query');
        response.json({
            "status": 400,
            "message": "BAD REQUEST!! Could not find the search query"
        });
    }
    else {
        var searchterm = request.query.term
        const url = config.elasticsearch.endpoint + 'courses/_search'
        const searchquery = {
            query: {
                multi_match: {
                    query: `${searchterm}`,
                    fields: ["Title", "CourseProvider"],
                    fuzziness: "AUTO"
                }
            },
            _source: ["Title"],
            size: 10
        }
        fetch(url, {
            method: 'post',
            body: JSON.stringify(searchquery),
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
        }).then(res => {
            // console.log('search query: ', JSON.stringify(searchquery))
            // console.log("StatusCode: ", res.status);
            if (res.status == 200) {
                return res.json();
            } else {
                console.log('Error: ', res.statusText)
                error = {
                    "status": res.status,
                    "message": res.statusText
                };
                return error
            }
        }).then(body => {
            if (body.status != undefined && body.status != 200) {
                response.json(body);
            }
            else {
                var suggestions = {}
                suggestions['suggestions'] = []
                var duplicatemap = {}
                suggestioncount = 0
                dbsuggestionlist = body['hits']['hits']
                for (index in dbsuggestionlist) {
                    doc = dbsuggestionlist[index]
                    if (duplicatemap[doc['_source']['Title'].toLowerCase()] == undefined) {
                        duplicatemap[doc['_source']['Title'].toLocaleLowerCase()] = 1
                        suggestions['suggestions'].push(doc['_source']['Title'])
                        suggestioncount = suggestioncount + 1
                        if (suggestioncount == 5) {
                            break;
                        }
                    }
                }
                // console.log('suggestions: ',suggestions);
                response.json(suggestions);
            }
        });
    }
}

exports.microdegree = async (request, response) => {
    // console.log("timeframe");
    var timeframe = request.body.duration;
    var introinterval = timeframe * 0.6;
    var interinterval = timeframe * 0.2;
    var advancedinterval = timeframe * 0.2;
    // console.log(request.body.tags);
    // console.log("CHECK 1");
    if (request.body.tags == undefined) {
        // console.log('StatusCode: 400');
        // console.log('Error: BAD REQUEST!! Could not find the microdegree tags');
        response.json({
            "status": 400,
            "message": "BAD REQUEST!! Could not find the microdegree tags"
        });
    }
    else {
        var searchterm = request.body.tags;
        var microdegrees = {};
        recommendanded_microdegree = {}
        helpers.getcourses(searchterm, 'Introductory').then(res => {
            microdegrees["Introcourses"] = res;
            helpers.getcourses(searchterm, 'Intermediate').then(res => {
                microdegrees["Intermediatecourses"] = res;
                helpers.getcourses(searchterm, 'Advanced').then(res => {
                    microdegrees["Advancedcourses"] = res;
                    console.log("RESPONSE======================", microdegrees.Introcourses.courses);
                    var introindex = 0;
                    var interindex = 0;
                    var advanceindex = 0;
                    var totalnoofmicrodegree = 0;
<<<<<<< HEAD
                    var degreeadded=1;
                    while (totalnoofmicrodegree < 3 && microdegrees.Introcourses.courses.length>0 &&
                        microdegrees.Intermediatecourses.courses.length>0 && microdegrees.Advancedcourses.courses.length>0&&degreeadded==1) {
                        console.log("No of Intro Courses: ", microdegrees.Introcourses.courses.length);
                        console.log("No of Intermediate Courses: ", microdegrees.Intermediatecourses.courses.length);
                        console.log("No of Advanced Courses: ", microdegrees.Advancedcourses.courses.length);
                        degreeadded=0;
=======
                    var degreeadded = 1;
                    while (totalnoofmicrodegree <= 10 && microdegrees.Introcourses.courses.length > 0 &&
                        microdegrees.Intermediatecourses.courses.length > 0 && microdegrees.Advancedcourses.courses.length > 0
                        && degreeadded == 1) {
                        degreeadded = 0;
>>>>>>> 17a164b239661528c2b8939cda748673be80e6da
                        var introarray = [];
                        var interarray = [];
                        var advancedarray = [];
                        var microdegree_object = {}
                        var tempinterval = introinterval;
                        introindex = 0;
                        interindex = 0;
                        advanceindex = 0;

                        for (; introindex < microdegrees.Introcourses.courses.length && tempinterval > 0; introindex++) {
                            var introcourse = microdegrees.Introcourses.courses[introindex];
                            var time = 0;
                            if (introcourse.CourseDuration.Unit.toLowerCase() == "weeks") {
                                time = introcourse.CourseDuration.Value * 7 * 24;
                            }
                            else if (introcourse.CourseDuration.Unit.toLowerCase() == "days") {
                                time = introcourse.CourseDuration.Value * 24;
                            }
                            else if (introcourse.CourseDuration.Unit.toLowerCase() == "months") {
                                time = introcourse.CourseDuration.Value * 30 * 24;
                            }
                            else time = introcourse.CourseDuration.Value;
                            if (time < tempinterval) {
                                introarray.push(introcourse); tempinterval = tempinterval - time;
                                microdegrees.Introcourses.courses.splice(introindex, 1);
                                degreeadded = 1;
                            }
                        }
                        microdegree_object['introductory'] = introarray;

                        tempinterval = interinterval;
                        for (; interindex < microdegrees.Intermediatecourses.courses.length && tempinterval > 0; interindex++) {
                            var introcourse = microdegrees.Intermediatecourses.courses[interindex];
                            var time = 0;
                            if (introcourse.CourseDuration.Unit.toLowerCase() == "weeks") {
                                time = introcourse.CourseDuration.Value * 7 * 24;
                            }
                            else if (introcourse.CourseDuration.Unit.toLowerCase() == "days") {
                                time = introcourse.CourseDuration.Value * 24;
                            }
                            else if (introcourse.CourseDuration.Unit.toLowerCase() == "months") {
                                time = introcourse.CourseDuration.Value * 30 * 24;
                            }
                            else time = introcourse.CourseDuration.Value;
                            if (time < tempinterval) {
                                interarray.push(introcourse); tempinterval = tempinterval - time;
                                microdegrees.Intermediatecourses.courses.splice(interindex, 1);
                                degreeadded = 1;
                            }

                        }
                        microdegree_object['intermediate'] = interarray;

                        tempinterval = advancedinterval;
                        for (; advanceindex < microdegrees.Advancedcourses.courses.length && tempinterval > 0; advanceindex++) {
                            var introcourse = microdegrees.Advancedcourses.courses[advanceindex];
                            var time = 0;
                            if (introcourse.CourseDuration.Unit.toLowerCase() == "weeks") {
                                time = introcourse.CourseDuration.Value * 7 * 24;
                            }
                            else if (introcourse.CourseDuration.Unit.toLowerCase() == "days") {
                                time = introcourse.CourseDuration.Value * 24;
                            }
                            else if (introcourse.CourseDuration.Unit.toLowerCase() == "months") {
                                time = introcourse.CourseDuration.Value * 30 * 24;
                            }
                            else time = introcourse.CourseDuration.Value;
                            if (time < tempinterval) {
                                advancedarray.push(introcourse); tempinterval = tempinterval - time;
                                microdegrees.Advancedcourses.courses.splice(advanceindex, 1);
                                degreeadded = 1;
                            }
                        }
                        microdegree_object['advanced'] = advancedarray;
                        if(microdegree_object['introductory'].length>0 && microdegree_object['intermediate'].length>0 
                                            && microdegree_object['advanced'].length>0){
                            recommendanded_microdegree[totalnoofmicrodegree] = microdegree_object;
                            totalnoofmicrodegree = totalnoofmicrodegree + 1;
                        }
                        
                    }
                    if(totalnoofmicrodegree>0)
                        response.json(recommendanded_microdegree);
                    else{
                        response.json({
                            "status": 400,
                            "message": "Could not find any microdegrees"
                        })
                    }
                })
            })
        }).catch(error => {
            response.json({ error: error.message });
        });
    }
}