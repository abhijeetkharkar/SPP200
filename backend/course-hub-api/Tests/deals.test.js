const fetch = require('node-fetch');
var searchQuery = require('../controller/searchquery');
var httpMocks = require('node-mocks-http');

var validRequest = httpMocks.createRequest({
    method : 'POST',
    body : {
        page_number : 0,
        category: "General"
    }
});

var inValidRequest = httpMocks.createRequest({
    method : 'POST',
    body : {
        tems : "python"
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
                        Title: 'Course 1'
                    }
                },
                {
                    _source:
                    {
                        Title: 'Course 2'
                    }
                }
            ]
    }
};

const fetchMockResErr = {
}

test('search query - Good Path', async () => {
    fetch.mockResponseOnce(JSON.stringify(fetchMockRes));
    await searchQuery.searchquery(validRequest, mockResponse);
    expect(mockResponse.statusCode).toEqual(200);
});

test('search query - Bad Path', async () => {
    fetch.mockResponseOnce(JSON.stringify(fetchMockResErr));
    await searchQuery.searchquery(inValidRequest, mockResponse);
    expect(mockResponse.statusCode).toEqual(200);
});