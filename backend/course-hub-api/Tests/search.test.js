'use strict';
const fetch = require('node-fetch');
const search = require('../controller/search');
const httpMocks = require('node-mocks-http');
const mockData = require('./mockData');

const mockRequest = httpMocks.createRequest({
    query: { term: 'deep learning' }
});

const mockRequestnew = httpMocks.createRequest({
    query: { terms: 'deep learning' }
});

const mockRequestMicrodegreeSuccess = httpMocks.createRequest({
    body: { tags: 'deep learning' }
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

// jest.mock('../controller/search');

describe('Search', () => {
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
});

describe('Microdegree', () => {
    test('Tags undefined', async () => {
        await search.microdegree(mockRequestMicrodegreeFailed, mockResponse);
        expect(mockResponse.statusCode).toEqual(200);
    });

    test('successful search', async () => {
        // const mockResponseIntroFunc = jest.fn(() => { return Promise.resolve(JSON.stringify(mockData.mockResponseGetCourses)) });
        // jest.mock('../controller/search');
        /* search.getcourses.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(mockData.mockResponseGetCourses))});
        search.getcourses.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(mockData.mockResponseGetCourses))});
        search.getcourses.mockImplementationOnce(() => {return Promise.resolve(JSON.stringify(mockData.mockResponseGetCourses))}); */
        fetch.mockResponseOnce(mockData.mockResponseGetCourses);
        fetch.mockResponseOnce(mockData.mockResponseGetCourses);
        fetch.mockResponseOnce(mockData.mockResponseGetCourses);
        await search.microdegree(mockRequestMicrodegreeSuccess, mockResponse);
        expect(mockResponse.statusCode).toEqual(200);
    });
});