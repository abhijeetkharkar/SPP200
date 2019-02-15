import unittest
import requests_mock
from mock import patch
from awslambda.iversity import handler
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
        handler.lambda_handler(self.data_url, self.search_url)

    @patch('awslambda.utils.fetch_data', return_value=[{'language': 'French'}])
    @patch('awslambda.utils.search_data_elastic_search', return_value=False)
    def test_iversity_lambda_non_english_course_data(self, search_data_elastic_search, fetch_data):
        handler.lambda_handler(self.data_url, self.search_url)

    @patch('awslambda.utils.search_data_elastic_search', return_value=True)
    def test_iversity_lambda_course_already_processed(self, search_data_elastic_search):
        handler.lambda_handler(self.data_url, self.search_url)


if __name__ == '__main__':
    unittest.main()