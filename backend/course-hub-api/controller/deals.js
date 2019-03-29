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
            provider: 'Udemy',
            link: 'http://www.dummylink.com',
            originalPrice: 50,
            discountedPrice: 20,
            description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.',
            datePosted: 'December 17, 2018 03:24:00',
            title: 'Big Discount on Udemy AI course'
        },
        {
            provider: 'Udemy',
            link: 'http://www.dummylink.com',
            originalPrice: 50,
            discountedPrice: 20,
            description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.',
            datePosted: 'December 17, 2018 03:24:00',
            title: 'Big Discount on Udemy AI course'
        },{
            provider: 'Udemy',
            link: 'http://www.dummylink.com',
            originalPrice: 50,
            discountedPrice: 20,
            description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.',
            datePosted: 'December 17, 2018 03:24:00',
            title: 'Big Discount on Udemy AI course'
        },
        {
            provider: 'Udemy',
            link: 'http://www.dummylink.com',
            originalPrice: 50,
            discountedPrice: 20,
            description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.',
            datePosted: 'December 17, 2018 03:24:00',
            title: 'Big Discount on Udemy AI course'
        },{
            provider: 'Udemy',
            link: 'http://www.dummylink.com',
            originalPrice: 50,
            discountedPrice: 20,
            description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.',
            datePosted: 'December 17, 2018 03:24:00',
            title: 'Big Discount on Udemy AI course'
        },
        {
            provider: 'Udemy',
            link: 'http://www.dummylink.com',
            originalPrice: 50,
            discountedPrice: 20,
            description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.',
            datePosted: 'December 17, 2018 03:24:00',
            title: 'Big Discount on Udemy AI course'
        },{
            provider: 'Udemy',
            link: 'http://www.dummylink.com',
            originalPrice: 50,
            discountedPrice: 20,
            description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.',
            datePosted: 'December 17, 2018 03:24:00',
            title: 'Big Discount on Udemy AI course'
        },
        {
            provider: 'Udemy',
            link: 'http://www.dummylink.com',
            originalPrice: 50,
            discountedPrice: 20,
            description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.',
            datePosted: 'December 17, 2018 03:24:00',
            title: 'Big Discount on Udemy AI course'
        }];
        response.json({
            total_deals: 9,
            number_of_pages: 2,
            current_page: 1,
            deals: result
        });
    }    
}