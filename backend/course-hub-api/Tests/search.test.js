'use strict';
const fetch = require('node-fetch');
const search = require('../controller/search');
const httpMocks = require('node-mocks-http');
const mockData = require('./mockData');
const helpers = require('../controller/helpers');

const mockRequest = httpMocks.createRequest({
    query: { term: 'deep learning' }
});

const mockRequestnew = httpMocks.createRequest({
    query: { terms: 'deep learning' }
});

const mockRequestMicrodegreeSuccess = httpMocks.createRequest({
    body: { tags: 'deep learning', duration: 100}
});

const mockRequestMicrodegreeFailed = httpMocks.createRequest({
    query: { term: 'deep learning' }
});

const mockResponse = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter });

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

jest.mock('../controller/helpers');

describe('Search', () => {
    test('invalid search term', async () => {
        // fetch.mockResponseOnce(JSON.stringify(mockres));
        await search.autosuggest(mockRequestnew, mockResponse);
        expect(mockResponse.statusCode).toEqual(200);
    });

    test('successfull search', async () => {
        fetch.mockResponseOnce(JSON.stringify(mockres));
        await search.autosuggest(mockRequest, mockResponse);
        expect(mockResponse.statusCode).toEqual(200);
    });
});

describe('Microdegree', () => {

    test('Tags undefined', async () => {
        await search.microdegree(mockRequestMicrodegreeFailed, mockResponse);
        expect(mockResponse.statusCode).toEqual(200);
    });

    test('successful search', async () => {
        helpers.getcourses.mockImplementationOnce(() => {return Promise.resolve(mockData.mockResponseGetCourses)});
        helpers.getcourses.mockImplementationOnce(() => {return Promise.resolve(mockData.mockResponseGetCourses)});
        helpers.getcourses.mockImplementationOnce(() => {return Promise.resolve(mockData.mockResponseGetCourses)});
        await search.microdegree(mockRequestMicrodegreeSuccess, mockResponse);
        expect(mockResponse.statusCode).toEqual(200);
    });
});