'use strict';
const fetch = require('node-fetch');
var search = require('../controller/search');
var httpMocks = require('node-mocks-http');
var MockExpressResponse = require('mock-express-response');
var mockRequest  = httpMocks.createRequest({
    query: { term: 'deep learning' }
});

var mockResponse=httpMocks.createResponse({ eventEmitter: require('events').EventEmitter});

describe('testing autosuggest', () => {
    test('Successfully fetches suggestions', done => {
    mockResponse.on('end', function() {
            expect(mockResponse.statusCode ).toEqual(200);
            done();
        });
    search.autosuggest(mockRequest, mockResponse);
    });
});
