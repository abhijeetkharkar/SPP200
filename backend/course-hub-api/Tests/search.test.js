'use strict';
const fetch = require('node-fetch');
var search = require('../controller/search');
var httpMocks = require('node-mocks-http');
var mockRequest = httpMocks.createRequest({
    query: { term: 'deep learning' }
});

var mockRequestnew = httpMocks.createRequest({
    query: { terms: 'deep learning' }
});

var mockResponse = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter });

const mockres = {
    hits:
    {
        total: 2,
        hits:
            [
                {
                    _source:
                    {
                        Title: 'abc'
                    }
                },
                {
                    _source:
                    {
                        Title: 'def'
                    }
                }
            ]
    }
}
test('invalid search term', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockres));
    await search.autosuggest(mockRequestnew, mockResponse);
    expect(mockResponse.statusCode).toEqual(200);
});

test('successfull search', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockres));
    await search.autosuggest(mockRequest, mockResponse);
    expect(mockResponse.statusCode).toEqual(200);
});