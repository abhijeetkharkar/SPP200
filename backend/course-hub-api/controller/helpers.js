const config = require('../config/config.json');
const fetch = require("node-fetch");

const getcourses = async (searchterm, difficulty) => {
    // console.log("!!!!!!!!!!!!!!!!!!!!!!GET COURSES!!!!!!!!!!!!!!!!!!!!!!!!");
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
        // console.log('search query: ', res.status);
        if (res.status == 200) {
            return res.json();
        } else {
            throw Error(res.statusText);
        }
    }).then(body => {
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
    }).catch(error => {
        return { error: error.message };
    });
    return response;
}

module.exports.getcourses = getcourses