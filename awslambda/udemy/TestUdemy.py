# from unittest import TestCase
import unittest
from mock import patch, MagicMock, mock_open, mock, Mock
from awslambda.udemy.handler import *
from awslambda.udemy.crawler import *
import requests_mock
import json

class Testudemy(unittest.TestCase):
    
    def setUp(self):
        self.file_content = (
            '{\n'
                '"udemy": \n'
                        '{\n'
                            '"clientid" : "some_bull_shit_client_id",\n'
                            '"clientsecret" : "some_bull_shit_client_secret"\n'
                        '},\n'
                '"page_number" : 0,\n'
                '"page_size" : 1,\n'
                '"url" : "https://www.wrong-url.com/api-2.0/courses/?page=",\n'
                '"number_of_courses" : 1,\n'
                '"elastic_search_add_data_url" : "https://search-coursehub-mmrw23yio2a4ylx2cgmx34eiyy.us-east-2.es.amazonaws.com/courses/course",\n'
                '"elastic_search_search_data_url" : "https://search-coursehub-mmrw23yio2a4ylx2cgmx34eiyy.us-east-2.es.amazonaws.com/courses/_search"\n'
            '}\n'
        )
        self.mock_open = mock_open(read_data=self.file_content)
        self.mock_open.return_value.__iter__ = lambda self: self
        self.mock_open.return_value.__next__ = lambda self:  next(iter(self.readline, ''))
    
    # Code should raise IOError when keys.json file is not present
    def test_keys_file_not_present(self):
        file_name = "wrong_name.json"
        with self.assertRaises(IOError):
            lambda_handler('file_name')

    def test_invalid_url(self):
        with patch('awslambda.udemy.handler.open', self.mock_open):
            with self.assertRaises(Exception):
                lambda_handler('keys.json')

    @mock.patch('awslambda.udemy.handler.search_elastic_server', return_value = True)
    @mock.patch('awslambda.udemy.handler.add_data_elastic_search', return_value = True)
    def test_lambda_handler(self, search, add_data):
        with patch('awslambda.udemy.handler.open', self.mock_open):
            with requests_mock.Mocker() as m:
                content  = { 'results' : [ {'id' : 1234 }, {'id' : 1257 } ], 'next' : None }
                m.register_uri('GET', requests_mock.ANY, json=content, status_code=200)
                result = lambda_handler('keys.json')
                self.assertEqual(result, True)

    @mock.patch('awslambda.udemy.handler.search_elastic_server', return_value = False)
    @mock.patch('awslambda.udemy.handler.add_data_elastic_search', return_value = True)
    @mock.patch('awslambda.udemy.crawler.crawl', return_value = {
        "price" : 10,
        "duration" : 10,
        "last_update" : None,
        "category" : None,
        "description" : None
    })
    def test_lambda_handler_with_response(self, search, add_data, crawl):
        with patch('handler.open', self.mock_open):
            with requests_mock.Mocker() as m:
                mock_result_in_json = {
                                        "id": 567828,
                                        "title": "Complete Python Bootcamp: Go from zero to hero in Python 3",
                                        "url": "/complete-python-bootcamp/",
                                        "is_paid": True,
                                        "price": "$194.99",
                                        "price_detail": {
                                            "currency": "USD",
                                            "currency_symbol": "$",
                                            "price_string": "$194.99",
                                            "amount": 194.99
                                        },
                                        "visible_instructors": [
                                            {
                                            "_class": "user",
                                            "name": "Pierian Data International",
                                            "title": "Pierian Data International by Jose Portilla",
                                            "image_100x100": "https://udemy-images.udemy.com/user/100x100/38701326_414a.jpg",
                                            "image_50x50": "https://udemy-images.udemy.com/user/50x50/38701326_414a.jpg",
                                            "url": "/user/pierian-data-international/",
                                            "display_name": "Pierian Data International by Jose Portilla",
                                            "job_title": "Jose Portilla's Pierian Data Inc. International Translations",
                                            "initials": "PB"
                                            }
                                        ],
                                        "image_125_H": "https://udemy-images.udemy.com/course/125_H/567828_67d0.jpg",
                                        "image_240x135": "https://udemy-images.udemy.com/course/240x135/567828_67d0.jpg",
                                        "image_480x270": "https://udemy-images.udemy.com/course/480x270/567828_67d0.jpg",
                                        "published_title": "complete-python-bootcamp",
                                        }
                content  = { 'results' : [ mock_result_in_json ], 'next' : None }
                m.register_uri('GET', requests_mock.ANY, json=content, status_code=200)
                result = lambda_handler('keys.json')
                self.assertEqual(result, True)


    def test_add_data_elastic_search_positive_response(self):
        with requests_mock.Mocker() as m:
            content  = { 'result' : 'created'}
            m.register_uri('POST', requests_mock.ANY, json=content, status_code=201)
            output = add_data_elastic_search({'sample_object' : True}, "https://www.add-data-url.com")
            self.assertEqual(output, True)
    
    def test_add_data_elastic_search_negative_response(self):
        with requests_mock.Mocker() as m:
            content  = {}
            m.register_uri('POST', requests_mock.ANY, json=content, status_code=400)
            output = add_data_elastic_search({'sample_object' : True}, "https://www.add-data-url.com")
            self.assertEqual(output, False)
    
    def test_search_data_elastic_search_positive_response(self):
        with requests_mock.Mocker() as m:
            content  = { 'hits' : { 'total' : 1 } }
            m.register_uri('POST', requests_mock.ANY, json=content, status_code=201)
            output = search_elastic_server(1234, "https://www.search-data-url.com")
            self.assertEqual(output, True)

    def test_search_data_elastic_search_negative_response(self):
        with requests_mock.Mocker() as m:
            content  = { 'hits' : { 'total' : 0 } }
            m.register_uri('POST', requests_mock.ANY, json=content, status_code=201)
            output = search_elastic_server(1234, "https://www.search-data-url.com")
            self.assertEqual(output, False)

    def test_crawler_positive(self):
        with requests_mock.Mocker() as m:
            response = '<meta name="description" content="Learn Python like a Professional! Start from the basics and go all the way to creating your own applications and games!"><meta property="udemy_com:category" content="Development"><span class="price-text__current" data-purpose="discount-price-text">\n<span class="sr-only">Current price:</span> $11.99\n</span> <span class="curriculum-header-length"> 24:10:28 </span> <div class="" data-purpose="last-update-date"> Last updated 1/2019 </div>'
            m.register_uri('GET', requests_mock.ANY, text=response, status_code=201)
            output = crawl("https://dummy-url.com")
            expected_response = {'price': 11.99, 'duration': '24', 'last_update': '2019-1-1', 'category': ['Development'], 'description': 'Learn Python like a Professional! Start from the basics and go all the way to creating your own applications and games!'}
            self.assertEqual(output, expected_response)

    def test_crawler_negative(self):
        with requests_mock.Mocker() as m:
            response = ''
            m.register_uri('GET', requests_mock.ANY, text=response, status_code=201)
            output = crawler.crawl("https://dummy-url.com")
            expected_response = {'price': None, 'duration': None, 'last_update': None, 'category': None, 'description': None}
            self.assertEqual(output, expected_response)

if __name__ == '__main__':
    unittest.main()