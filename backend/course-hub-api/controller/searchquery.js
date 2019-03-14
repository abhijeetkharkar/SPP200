//All search Related query
const config = require('../config/config.json');
const fetch = require("node-fetch");
const page_size = config.pagination_parameters.page_size;
const url = config.elasticsearch.endpoint + 'courses/_search';


exports.searchquery = function(request, response){
    // page_number is Pagination parameters
    page_number = request.body.page_number || 0;

    // search_query contains the searched Term
    search_query = request.body.term;

    console.log("body is ", request.body);
    console.log("params is ", request.params);
    console.log("PAGE NUMBERS IS ", page_number);
    console.log("SEARCH QUERY IS ", search_query);

    const searchquery = {
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
        from: page_number,
        size: page_size
    }

    fetch(url, {
        method: 'post',
        body: JSON.stringify(searchquery),
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
    }).then(res => {
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
        if (body.hits){
            var search_response = {};
            search_response['number_of_pages'] = body.hits.total / page_size;
            search_response['courses'] = parseCourses(body.hits.hits);

            response.json(search_response);
        }else{
            error={
                "status": 500,
                "message": "Unable to get any data for the request"
            };
            return error;
        }
    });
}

function parseCourses(courses){
    var course_array = []
    for (i=0; i< courses.length; i++){
        if (courses[i]._source){
            course_array.push(courses[i]._source);
        }
    }
    return course_array;
}