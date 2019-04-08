const config = require('../config/config.json');
const fetch = require("node-fetch");
const url = config.elasticsearch.endpoint + 'deals/_search';
const deals_page_size = config.pagination_parameters.deals_page_size;

function parseDeals(deals){
    var deal_array = [];
    for (i=0; i< deals.length; i++){
        if (deals[i]._source){
            var dealData = deals[i]._source;
            dealData['id'] = deals[i]._id;
            deal_array.push(dealData);
        }
    }
    return deal_array;
}

exports.courseDeals = function(request, response){
    if(request.body.category == undefined){
        console.log('Error: BAD REQUEST!!! Could not find the search query');
        response.json ({
            "status" : 400,
            "message" : "BAD REQUEST!!! Could not find the search query"
        });
    }else{
        console.log("Search Query Received is ", request.query.category);

        page_number = request.body.page_number || 0;
        var currentDate = (new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '-' + ('0' + new Date().getDate()).slice(-2));
        console.log("CURRENT DATE IS ", currentDate);
        
        var dealQuery = {};
        if (request.body.category == "all"){
            dealQuery = {
                sort : {
                    thumbsUp : "desc",
                    thumbsDown : "asc"
                },
                query: {
                    bool : {
                        filter: [
                        { range: { dealExpiry: { gte: currentDate }}}
                        ]
                    }
                },
                from: page_number * deals_page_size,
                size: deals_page_size
            }
        }else{
            dealQuery = {
                sort : {
                    thumbsUp : "desc",
                    thumbsDown : "asc"
                },
                query: {
                    bool : {
                        must : {
                           term : { category : request.body.category } 
                        },
                        filter: [ 
                          { range: { dealExpiry: { gte: currentDate }}}
                        ]
                     }
                },
                from: page_number * deals_page_size,
                size: deals_page_size
            }
        }

        fetch(url, {
            method: 'post',
            body: JSON.stringify(dealQuery),
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
                search_response['total'] = body.hits.total;
                search_response['number_of_pages'] = Math.ceil(body.hits.total / deals_page_size);
                search_response['current_page'] = page_number;
                search_response['deals'] = parseDeals(body.hits.hits);
                console.log("Response is ", search_response);
                response.json(search_response);
            }else{
                error={
                    "status": 500,
                    "message": "Unable to get any data for the request"
                };
                response.json(error);
            }
        });

        // var result = [{
        //     title: 'Big Discount on Udemy AI course',
        //     description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.',
        //     link: 'http://www.dummylink.com',
        //     imageLink: 'https://firebasestorage.googleapis.com/v0/b/course-hub-73ea7.appspot.com/o/images%2Fudemy.png?alt=media&token=0baa8ef1-3f79-4be9-b96e-20fccd7934c8',
        //     originalPrice: 20,
        //     discountedPrice: 10,
        //     thumbsUp: 4,
        //     datePosted: 'December 17, 2018 03:24:00',
        //     user: 'user-id',
        //     userName: 'Dummy User',
        //     provider: 'Udemy',
        // }];
        // response.json({
        //     total_deals: 1,
        //     number_of_pages: 1,
        //     current_page: 0,
        //     deals: result
        // });
    }
}