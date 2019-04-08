const fetch = require('node-fetch');
var dealQuery = require('../controller/deals');
var httpMocks = require('node-mocks-http');

var validRequest = httpMocks.createRequest({
    method : 'POST',
    body : {
        page_number : 0,
        category: "General"
    }
});

var secondValidRequest = httpMocks.createRequest({
    method : 'POST',
    body : {
        page_number : 0,
        category: "all"
    }
});

var inValidRequest = httpMocks.createRequest({
    method : 'POST',
    // Empty request : Invalid
    body : {

    }
});

var mockResponse = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter });

const fetchMockRes = {
    hits:
    {
        total: 2,
        hits:
            [
                {
                    _source:
                    {
                        Title: 'Course Deal 1'
                    }
                },
                {
                    _source:
                    {
                        Title: 'Course Deal 2'
                    }
                }
            ]
    }
};

const fetchMockResErr = {
}

test('deals query - Good Path', async () => {
    fetch.mockResponseOnce(JSON.stringify(fetchMockRes));
    await dealQuery.courseDeals(validRequest, mockResponse);
    expect(mockResponse.statusCode).toEqual(200);
});

test('deals query - Good Path 2', async () => {
    fetch.mockResponseOnce(JSON.stringify(fetchMockRes));
    await dealQuery.courseDeals(secondValidRequest, mockResponse);
    expect(mockResponse.statusCode).toEqual(200);
});

test('deals query - Bad Path', async () => {
    fetch.mockResponseOnce(JSON.stringify(fetchMockResErr));
    await dealQuery.courseDeals(inValidRequest, mockResponse);
    expect(mockResponse.statusCode).toEqual(200);
});