//All search Related query
const config = require('../config/config.json');
const fetch = require("node-fetch");
var dateFormat = require('dateformat');
const page_size = config.pagination_parameters.page_size;
const url = config.elasticsearch.endpoint + 'courses/_search';

function parseCourses(courses){
    var course_array = []
    for (i=0; i< courses.length; i++){
        if (courses[i]._source){
            course_array.push(courses[i]._source);
        }
    }
    return course_array;
}

function addDateRange(searchQuery, startDate, endDate){
    var dateRange = {
        range : {
            StartDate : {
                gte : startDate,
                lt :  endDate,
                format: "yyyy-MM-dd"
            }
        }
    }
    console.log("Date Range is : ", dateRange);

    searchQuery.query.bool.must.push(dateRange);
    return searchQuery;
}

function addLastUpdated(searchQuery, lastUpdated){
    var currentDate = dateFormat(new Date(), "yyyy-mm-dd");
    var dateRange = {
        range : {
            lastupdated : {
                gte : lastUpdated,
                lt :  currentDate,
                format: "yyyy-MM-dd"
            }
        }
    };
    searchQuery.query.bool.must.push(dateRange);

    return searchQuery;
}

function addPriceRange(searchQuery, gte, lt){
    var priceRange = {
        range : {
            Price : {
                gte : gte,
                lt : lt
            }
        }
    }

    searchQuery.query.bool.must.push(priceRange);
    return searchQuery;
}

function addCourseProvider(searchQuery, courseProvider) {
    var course = {
        match : {
            CourseProvider : courseProvider
        }
    }
    
    searchQuery.query.bool.must.push(course);
    return searchQuery;
}

exports.searchquery = function(request, response){
    // page_number is Pagination parameters
    page_number = request.body.page_number || 0;

    // search_query contains the searched Term
    search_query = request.body.term;

    console.log("body is ", request.body);
    console.log("params is ", request.params);
    console.log("PAGE NUMBERS IS ", page_number);
    console.log("SEARCH QUERY IS ", search_query);

    var searchQuery = {
        query: {
            bool : {
                must : [
                    {
                        multi_match: {
                            query: `${search_query}`,
                            fields: ["Title^3", "Description^2", "CourseProvider^1"],
                            fuzziness: "AUTO"
                        }
                    }
                ]
            }
        },
        _source: ["Title", "Date", "CourseImage", "Difficulty", "Price", "PriceCurrency", "Paid", "Rating", "last_updated"],
        from: page_number * page_size,
        size: page_size
    }

    // TODO: Check startDate and endDate is in "yyyy-MM-dd" format
    if (request.body.daterange && request.body.daterange.startdate && request.body.daterange.enddate){
        searchQuery = addDateRange(searchQuery, request.body.daterange.startdate, request.body.daterange.enddate);
    }

    // TODO: Check lastupdated is in "yyyy-MM-dd" format
    if (request.body.lastupdated){
        searchQuery = addLastUpdated(searchQuery, request.body.lastupdated);
    }

    if (request.body.pricerange && request.body.pricerange.gte && request.body.pricerange.lt){
        searchQuery = addPriceRange(searchQuery, request.body.pricerange.gte, request.body.pricerange.lt);
    }

    if (request.body.courseprovider){
        searchQuery = addCourseProvider(searchQuery, request.body.courseprovider);
    }

    // Loading Data from Elastic Search
    fetch(url, {
        method: 'post',
        body: JSON.stringify(searchQuery),
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
    }).then(res => {
        if (res.status == 200) {
            return res.json();
        } else {
            console.log('Error: ',res.status)
            console.log('Error: ',res.statusText)
            error={
                "status": res.status,
                "message": res.statusText
            };
            response.json(error);
        }
    }).then(body => {
        if (body.hits){
            var search_response = {};
            search_response['number_of_pages'] = Math.floor(body.hits.total / page_size) - 1;
            search_response['current_page'] = page_number;
            search_response['courses'] = parseCourses(body.hits.hits);
            console.log("Total Courses are ", body.hits.total);
            response.json(search_response);
        }else{
            error={
                "status": 500,
                "message": "Unable to get any data for the request"
            };
            response.json(error);
        }
    });
}