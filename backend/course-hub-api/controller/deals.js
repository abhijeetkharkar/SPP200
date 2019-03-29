const config = require('../config/config.json');
const fetch = require("node-fetch");

exports.courseDeals = function(request, response){
    if(request.body.category == undefined){
        // console.log('StatusCode: 400');
        console.log('Error: BAD REQUEST!!! Could not find the search query');
        response.json ({
            "status" : 400,
            "message" : "BAD REQUEST!!! Could not find the search query"
        });
    }else{
        console.log("Search Query Received is ", request.query.category);
        var result = [{
            title: 'Big Discount on Udemy AI course',
            description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.',
            link: 'http://www.dummylink.com',
            imageLink: 'https://firebasestorage.googleapis.com/v0/b/course-hub-73ea7.appspot.com/o/images%2F276*180px.svg?alt=media&token=0d8e5d9d-9087-4135-944b-fe9b87b96fb0',
            originalPrice: 20,
            discountedPrice: 10,
            thumbsUp: 4,
            datePosted: 'December 17, 2018 03:24:00',
            user: 'user-id',
            userName: 'Dummy User',
            provider: 'Udemy',
        }];
        response.json({
            total_deals: 1,
            number_of_pages: 1,
            current_page: 0,
            deals: result
        });
    }
}