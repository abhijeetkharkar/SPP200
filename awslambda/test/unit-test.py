import unittest
import requests_mock
from mock import patch
from awslambda.iversity.handler import lambda_handler as iversity_lambda_handler
from awslambda.open_learning.handler import lambda_handler as open_learning_lambda_handler
from awslambda.utils import add_data_elastic_search, search_data_elastic_search, fetch_data


class TestLambdas(unittest.TestCase):
    
    def setUp(self):
        self.search_url = 'https://search-coursehub-mmrw23yio2a4ylx2cgmx34eiyy.us-east-2.es.amazonaws.com/courses/_search'
        self.data_url = 'https://search-coursehub-mmrw23yio2a4ylx2cgmx34eiyy.us-east-2.es.amazonaws.com/courses/course'
        self.url = 'https://iversity.org/api/v1/courses'


    def test_add_data_elastic_search_positive_response(self):
        with requests_mock.Mocker() as mocker:
            content  = { 'result' : 'created' }
            mocker.register_uri('POST', requests_mock.ANY, json=content, status_code=201)
            output = add_data_elastic_search(self.data_url, {'sample_object' : True})
            self.assertEqual(output, True)


    def test_add_data_elastic_search_negative_response(self):
        with requests_mock.Mocker() as mocker:
            content  = {}
            mocker.register_uri('POST', requests_mock.ANY, json=content, status_code=400)
            output = add_data_elastic_search(self.data_url, {'sample_object' : True})
            self.assertEqual(output, False)


    def test_add_data_elastic_search_exception(self):
        with requests_mock.Mocker() as mocker:
            content  = {}
            mocker.register_uri('POST', requests_mock.ANY, json=content, status_code=400)
            output = add_data_elastic_search('', {'CourseId' : 1})
            self.assertEqual(output, False)


    def test_search_data_elastic_search_positive_response(self):
        with requests_mock.Mocker() as mocker:
            content  = { 'hits' : { 'total' : 1 } }
            mocker.register_uri('POST', requests_mock.ANY, json=content, status_code=201)
            output = search_data_elastic_search(self.search_url, {})
            self.assertEqual(output, True)


    def test_search_data_elastic_search_negative_response(self):
        with requests_mock.Mocker() as mocker:
            content  = { 'hits' : { 'total' : 0 } }
            mocker.register_uri('POST', requests_mock.ANY, json=content, status_code=201)
            output = search_data_elastic_search(self.search_url, {})
            self.assertEqual(output, False)


    def test_search_data_elastic_search_exception(self):
        with requests_mock.Mocker() as mocker:
            content  = { 'hits' : { 'total' : 0 } }
            mocker.register_uri('POST', requests_mock.ANY, json=content, status_code=201)
            output = search_data_elastic_search('', {})
            self.assertEqual(output, False)


    def test_fetch_course_data_negative_response(self):
        with requests_mock.Mocker() as mocker:
            mocker.register_uri('GET', requests_mock.ANY, json={}, status_code=201)
            output = fetch_data(self.url, 2, 1)
            self.assertEqual(output, False)


    def test_fetch_course_data_positive_response(self):
        with requests_mock.Mocker() as mocker:
            content = {'courses': []}
            mocker.register_uri('GET', requests_mock.ANY, json=content, status_code=201)
            output = fetch_data(self.url, 2, 1)
            self.assertEqual(output, [])


    course_content = [{"id": 1, "title": 'A', "discipline": 'ABC', "duration": '1', 'url': 'xyz',
                "verifications": [{'price': '1'}], 'description': 'disc', "image": 'abc', "language": 'Eng'}]
    @patch('awslambda.utils.fetch_data', return_value=course_content)
    @patch('awslambda.utils.add_data_elastic_search', return_value=True)
    @patch('awslambda.utils.search_data_elastic_search', return_value=False)
    def test_iversity_lambda_valid_course_data(self, search_data_elastic_search, add_data_elastic_search, fetch_data):
        iversity_lambda_handler(self.data_url, self.search_url)

    @patch('awslambda.utils.fetch_data', return_value=[{'language': 'French'}])
    @patch('awslambda.utils.search_data_elastic_search', return_value=False)
    def test_iversity_lambda_non_english_course_data(self, search_data_elastic_search, fetch_data):
        iversity_lambda_handler(self.data_url, self.search_url)

    @patch('awslambda.utils.search_data_elastic_search', return_value=True)
    def test_iversity_lambda_course_already_processed(self, search_data_elastic_search):
        iversity_lambda_handler(self.data_url, self.search_url)


    course_content = [{"CourseId": 1, "name": 'A', "category": 'ABC', "duration": '1', 'courseUrl': 'xyz',
                       'summary': 'disc', "image": 'abc', "type": '', "price": '0', 'selfPaced': None}]

    @patch('awslambda.utils.is_english', return_value=True)
    @patch('awslambda.utils.fetch_data', return_value=course_content)
    @patch('awslambda.utils.add_data_elastic_search', return_value=True)
    @patch('awslambda.utils.search_data_elastic_search', return_value=False)
    def test_open_learning_lambda_valid_course_data(self, search_data_elastic_search, add_data_elastic_search, fetch_data, is_english):
        open_learning_lambda_handler(self.data_url, self.search_url)

    @patch('awslambda.utils.is_english', return_value=False)
    @patch('awslambda.utils.fetch_data', return_value=[{'name': 'A'}])
    def test_open_learning_lambda_non_english_course_data(self, fetch_data, is_english):
        open_learning_lambda_handler(self.data_url, self.search_url)

    @patch('awslambda.utils.is_english', return_value=True)
    @patch('awslambda.utils.fetch_data', return_value=[{'name': 'A', 'courseUrl': 'B'}])
    @patch('awslambda.utils.search_data_elastic_search', return_value=True)
    def test_open_learning_lambda_course_already_processed(self, search_data_elastic_search, fetch_data, is_english):
        open_learning_lambda_handler(self.data_url, self.search_url)


if __name__ == '__main__':
    unittest.main()