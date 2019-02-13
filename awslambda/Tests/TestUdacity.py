from unittest import TestCase
from mock import patch, MagicMock,mock_open
from awslambda.udacity.loader import *
import requests_mock

class Testudacity(TestCase):
    def setUp(self):
        self.file_content = (
            'www.sep2019.com\n'
        )
        self.mock_open = mock_open(read_data=self.file_content)
        self.mock_open.return_value.__iter__ = lambda self: self
        self.mock_open.return_value.__next__ = lambda self:  next(iter(self.readline, ''))

    def test_url_file_not_found(self):
        with self.assertRaises(IOError):
            fetch_records_udacity("info1.txt")

    def test_invalid_url(self):
        with patch('__builtin__.open',self.mock_open):
            with self.assertRaises(Exception):
                fetch_records_udacity("../udacity/info.txt")


    @requests_mock.mock()
    def test_valid_url(self,req):
        req.get('https://www.udacity.com/public-api/v0/courses', text='{"courses":[{}]}')
        with patch("json.loads",MagicMock('{cool}')) as m:
            fetch_records_udacity("../udacity/info.txt")
            m.called

    @requests_mock.mock()
    def test_api_endpoint_failure(self, req):
        req.get('https://www.udacity.com/public-api/v0/courses', text='{"courses":[{}],"status_code": 404}')
        with patch("json.loads", return_value={"courses":[]}):
            fetch_records_udacity("../udacity/info.txt")

    @requests_mock.mock()
    def test_response_parsed_properly(self, req):
        req.get('https://www.udacity.com/public-api/v0/courses', text='{"courses":[{}]}')
        with patch("awslambda.udacity.loader.parse_json",return_value={"CourseId":{}}):
            with patch("awslambda.udacity.loader.search_elastic_server",MagicMock('{"CourseId":{}}')) as m:
                fetch_records_udacity("../udacity/info.txt")
                m.called

    @requests_mock.mock()
    def test_record_found_in_database(self, req):
        req.get('https://www.udacity.com/public-api/v0/courses', text='{"courses":[{}]}')
        with patch("awslambda.udacity.loader.parse_json", return_value={"CourseId": "testid123"}):
            with patch("awslambda.udacity.loader.search_elastic_server", return_value=True):
                fetch_records_udacity("../udacity/info.txt")

    @requests_mock.mock()
    def test_record_not_found_database(self, req):
        req.get('https://www.udacity.com/public-api/v0/courses', text='{"courses":[{}]}')
        with patch("awslambda.udacity.loader.parse_json", return_value={"CourseId": "testid123"}):
            with patch("awslambda.udacity.loader.search_elastic_server", return_value=True):
                with patch("awslambda.udacity.loader.add_data_elastic_search",MagicMock({"CourseId": "testid123"})) as m:
                    fetch_records_udacity("../udacity/info.txt")
                    m.called

if __name__ == '__main__':
    suite=TestCase.loadTestsFromTestCase(Testudacity)
    TestCase.TextTestRunner().run(suite)


