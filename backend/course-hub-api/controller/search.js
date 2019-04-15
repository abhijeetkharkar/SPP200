// //All search Related query
const config = require('../config/config.json');
const fetch = require("node-fetch");

exports.autosuggest = function(request, response){
    if(request.query.term==undefined){
        // console.log('StatusCode: 400');
        console.log('Error: BAD REQUEST!! Could not find the search query');
        response.json ({
            "status" : 400,
            "message" : "BAD REQUEST!! Could not find the search query"
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
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
        }).then(res => {
            // console.log('search query: ', JSON.stringify(searchquery))
            // console.log("StatusCode: ", res.status);
            if (res.status == 200) {
                return res.json();
            } else {
                console.log('Error: ',res.statusText)
                error={
                    "status": res.status,
                    "message": res.statusText
                };
                return error
            }
        }).then(body => {
            if(body.status!=undefined && body.status!=200){
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

getcourses =async function(searchterm,difficulty){
    const url = config.elasticsearch.endpoint + 'courses/_search'
    const searchquery = {
        query: { 
          bool: { 
            must:  [
                    { multi_match : {
                  query : `${searchterm}`,
                  fields: ["Title^3","Description"],
                  fuzziness: "AUTO"
              }
              },
              {
              bool:{
                  should:[{match: {
                  Difficulty: `${difficulty}`
                }}]
              }
              }]
          }
        }
      }
    fetch(url, {
        method: 'post',
        body: JSON.stringify(searchquery),
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
    }).then(res => {
        // console.log('search query: ', JSON.stringify(searchquery))
        console.log("StatusCode: ", res.status);
        if (res.status == 200) {
            return res.json();
        } else {
            console.log('Error: ',res.statusText)
            error={
                "status": res.status,
                "message": res.statusText
            };
            return error
        }
    }).then(body => {
        console.log("STATUS CHECK 1");
        if(body.status!=undefined && body.status!=200){
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
            console.log("STATUS CHECK 2", degreecourses['courses'][0]);
            return degreecourses;
        }
    });
}

exports.microdegree = function(request, response){
    console.log("timeframe")
    timeframe=request.body.duration
    console.log(request.body.tags)
    console.log("CHECK 1");
    if(request.body.tags==undefined){
        // console.log('StatusCode: 400');
        console.log('Error: BAD REQUEST!! Could not find the microdegree tags');
        response.json ({
            "status" : 400,
            "message" : "BAD REQUEST!! Could not find the microdegree tags"
        });
    }
    else {
        console.log("CHECK 2");
        var searchterm = request.body.tags;
        console.log("TAGS ARE ",  searchterm)
        var introductorycourses = getcourses(searchterm, 'Introductory', function(callbackVal){
            console.log("STATUS CHECK CALLBACK 1");
        });
        console.log("INTRDOCTORY are : ",  introductorycourses);
        var intermediatecourses=getcourses(searchterm,'Intermediate');
        var advancedcourses = getcourses(searchterm,'Advanced');
        console.log(introductorycourses);
        microdegrees={}
        microdegrees["Introcourses"]=introductorycourses
        microdegrees["Intermediatecourses"]=intermediatecourses
        microdegrees["Advancedcourses"]=advancedcourses
        response.json(introductorycourses);
    }
}
