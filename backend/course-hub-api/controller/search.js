// //All search Related query
const config = require('../config/config.json');
const fetch = require("node-fetch");

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

const getcourses = async function (searchterm, difficulty) {
    const url = config.elasticsearch.endpoint + 'courses/_search'
    const searchquery = {
        query: {
            bool: {
                must: [
                    {
                        multi_match: {
                            query: `${searchterm}`,
                            fields: ["Title^3", "Description"],
                            fuzziness: "AUTO"
                        }
                    },
                    {
                        bool: {
                            should: [{
                                match: {
                                    Difficulty: `${difficulty}`
                                }
                            }]
                        }
                    }
                ]
            }
        },
        size: 100
    }
    const response = await fetch(url, {
        method: 'post',
        body: JSON.stringify(searchquery),
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    }).then(res => {
        // console.log('search query: ', JSON.stringify(searchquery))
        if (res.status == 200) {
            return res.json();
        } else {
            throw Error(res.statusText);
        }
    }).then(body => {
        // console.log("STATUS CHECK 1");
        console.log("!!!!!!!!!!!!!!!!!!!Response!!!!!!!!!!!!!!!!!!!!!!!!!: ", body);
        if (body.status != undefined && body.status != 200) {
            return body;
        }
        else {
            var degreecourses = {}
            degreecourses['courses'] = []
            var duplicatemap = {}
            degreecoursecount = 0
            dbsuggestionlist = body['hits']['hits']
            for (index in dbsuggestionlist) {
                doc = dbsuggestionlist[index]
                if (duplicatemap[doc['_source']['Title'].toLowerCase()] == undefined) {
                    duplicatemap[doc['_source']['Title'].toLocaleLowerCase()] = 1
                    degreecourses['courses'].push(doc['_source'])
                    degreecoursecount = degreecoursecount + 1
                }
            }
            // console.log("MICRODEGREE IS ", degreecourses);
            // console.log("STATUS CHECK 2", degreecourses['courses'].length);
            return degreecourses;
        }
    }).catch(error => {
        return { error: error.message };
    });
    return response;
}

exports.microdegree = async (request, response) => {
    // console.log("timeframe");
    var timeframe = request.body.duration;
    var introinterval = timeframe*0.6;
    var interinterval =timeframe*0.2;
    var advancedinterval =timeframe*0.2;
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
        getcourses(searchterm, 'Introductory').then(res => {
            microdegrees["Introcourses"] = res;
            getcourses(searchterm, 'Intermediate').then(res => {
                console.log("RESPONSE======================", res);
                microdegrees["Intermediatecourses"] = res;
                getcourses(searchterm, 'Advanced').then(res => {
                    microdegrees["Advancedcourses"] = res;
                    var introindex = 0;
                    var interindex = 0;
                    var advanceindex = 0;
                    var totalnoofmicrodegree = 0;
                    var degreeadded=1;
                    while (totalnoofmicrodegree <= 10 && microdegrees.Introcourses.courses.length>0 &&
                        microdegrees.Intermediatecourses.courses.length>0 && microdegrees.Advancedcourses.courses.length>0&&degreeadded==1) {
                        console.log("No of Intro Courses: ", microdegrees.Introcourses.courses.length);
                        console.log("No of Intermediate Courses: ", microdegrees.Intermediatecourses.courses.length);
                        console.log("No of Advanced Courses: ", microdegrees.Advancedcourses.courses.length);
                        degreeadded=0;
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
                            if (introcourse.CourseDuration.Unit.toLowerCase == "weeks") {
                                time = introcourse.CourseDuration.Value * 7 * 24;
                            }
                            else if (introcourse.CourseDuration.Unit.toLowerCase == "days") {
                                time = introcourse.CourseDuration.Value * 24;
                            }
                            else if (introcourse.CourseDuration.Unit.toLowerCase == "months") {
                                time = introcourse.CourseDuration.Value * 30 * 24;
                            }
                            else time = introcourse.CourseDuration.Value;
                            if (time < tempinterval) {
                                introarray.push(introcourse); tempinterval = tempinterval - time;
                                microdegrees.Introcourses.courses.splice(introindex, 1);
                                degreeadded=1;
                            }
                        }
                        microdegree_object['introductory'] = introarray;

                       tempinterval = interinterval;
                        for (; interindex < microdegrees.Intermediatecourses.courses.length && tempinterval > 0; interindex++) {
                            var introcourse = microdegrees.Intermediatecourses.courses[interindex];
                            var time = 0;
                            if (introcourse.CourseDuration.Unit.toLowerCase == "weeks") {
                                time = introcourse.CourseDuration.Value * 7 * 24;
                            }
                            else if (introcourse.CourseDuration.Unit.toLowerCase == "days") {
                                time = introcourse.CourseDuration.Value * 24;
                            }
                            else if (introcourse.CourseDuration.Unit.toLowerCase == "months") {
                                time = introcourse.CourseDuration.Value * 30 * 24;
                            }
                            else time = introcourse.CourseDuration.Value;
                            if (time < tempinterval) {
                                interarray.push(introcourse); tempinterval = tempinterval - time;
                                microdegrees.Intermediatecourses.courses.splice(interindex, 1);
                                degreeadded=1;
                            }

                        }
                        microdegree_object['intermediate'] = interarray;

                        tempinterval = advancedinterval;
                        for (; advanceindex < microdegrees.Advancedcourses.courses.length && tempinterval > 0; advanceindex++) {
                            var introcourse = microdegrees.Advancedcourses.courses[advanceindex];
                            var time = 0;
                            if (introcourse.CourseDuration.Unit.toLowerCase == "weeks") {
                                time = introcourse.CourseDuration.Value * 7 * 24;
                            }
                            else if (introcourse.CourseDuration.Unit.toLowerCase == "days") {
                                time = introcourse.CourseDuration.Value * 24;
                            }
                            else if (introcourse.CourseDuration.Unit.toLowerCase == "months") {
                                time = introcourse.CourseDuration.Value * 30 * 24;
                            }
                            else time = introcourse.CourseDuration.Value;
                            if (time < tempinterval) {
                                advancedarray.push(introcourse); tempinterval = tempinterval - time;
                                microdegrees.Advancedcourses.courses.splice(advanceindex, 1);
                                degreeadded=1;
                            }
                        }
                        microdegree_object['advanced'] = advancedarray;
                        recommendanded_microdegree[totalnoofmicrodegree] = microdegree_object;
                        totalnoofmicrodegree = totalnoofmicrodegree + 1;
                        
                    }

                    response.json(recommendanded_microdegree);
                })
            })
        }).catch(error => {
            response.json({ error: error.message });
        });
    }
}

module.exports.getcourses = getcourses;