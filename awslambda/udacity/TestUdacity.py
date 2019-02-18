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
        with patch('builtins.open',self.mock_open):
            with self.assertRaises(Exception):
                fetch_records_udacity("info.txt")


    @requests_mock.mock()
    def test_valid_url(self,req):
        req.get('https://www.udacity.com/public-api/v0/courses', text='{"courses":[{}]}')
        with patch("json.loads",MagicMock('{cool}')) as m:
            fetch_records_udacity("info.txt")
            m.called

    @requests_mock.mock()
    def test_api_endpoint_failure(self, req):
        req.get('https://www.udacity.com/public-api/v0/courses', text='{"courses":[{}],"status_code": 404}')
        with patch("json.loads", return_value={"courses":[]}):
            fetch_records_udacity("info.txt")

    @requests_mock.mock()
    def test_response_parsed_properly(self, req):
        req.get('https://www.udacity.com/public-api/v0/courses', text='{"courses":[{}]}')
        with patch("awslambda.udacity.loader.parse_json",return_value={"CourseId":{}}):
            with patch("awslambda.udacity.loader.search_elastic_server",MagicMock('{"CourseId":{}}')) as m:
                fetch_records_udacity("info.txt")
                m.called

    @requests_mock.mock()
    def test_record_found_in_database(self, req):
        req.get('https://www.udacity.com/public-api/v0/courses', text='{"courses":[{}]}')
        with patch("awslambda.udacity.loader.parse_json", return_value={"CourseId": "testid123"}):
            with patch("awslambda.udacity.loader.search_elastic_server", return_value=True):
                fetch_records_udacity("info.txt")

    @requests_mock.mock()
    def test_record_not_found_database(self, req):
        req.get('https://www.udacity.com/public-api/v0/courses', text='{"courses":[{}]}')
        with patch("awslambda.udacity.loader.parse_json", return_value={"CourseId": "testid123"}):
            with patch("awslambda.udacity.loader.search_elastic_server", return_value=True):
                with patch("awslambda.udacity.loader.add_data_elastic_search",MagicMock({"CourseId": "testid123"})) as m:
                    fetch_records_udacity("info.txt")
                    m.called

    def test_record_added_in_ES_insertion(self):
        with requests_mock.Mocker() as m:
            content  = {}
            m.register_uri('POST', requests_mock.ANY, json=content, status_code=201)
            with patch("json.loads", return_value=({"result":"created"})):
                output=add_data_elastic_search({"CourseId":"test123"})
                self.assertEqual(output, True)

    def test_record_Not_added_in_ES_insertion(self):
        with requests_mock.Mocker() as m:
            content  = {}
            m.register_uri('POST', requests_mock.ANY, json=content, status_code=200)
            with patch("json.loads", return_value=({"result":"created"})):
                output=add_data_elastic_search({"CourseId":"test123"})
                self.assertEqual(output, False)

    def test_successful_search_in_ES(self):
        with requests_mock.Mocker() as m:
            content  = {}
            m.register_uri('POST', requests_mock.ANY, json=content, status_code=200)
            with patch("json.loads", return_value=({"hits":{"total":1}})):
                output=search_elastic_server('test123')
                self.assertEqual(output, True)

    def test_unsuccessful_search_in_ES(self):
        with requests_mock.Mocker() as m:
            content  = {}
            m.register_uri('POST', requests_mock.ANY, json=content, status_code=200)
            with patch("json.loads", return_value=({"hits":{"total":0}})):
                output=search_elastic_server('test123')
                self.assertEqual(output, False)

    def test_key_error_parse_json(self):
        response=parse_json({})
        self.assertEqual(response['error'],'something wrong with JSON object.')

    def test_successful_parsing_of_json(self):
        dummyJson={"instructors": [],"key": "testapp","image": "","title": "Intro to Deep Learning",
                   "homepage": "https://www.udacity.com/course/intro-to-deep-learning--ud101app?utm_medium=referral&utm_campaign=api",
                   "short_summary": "","level": "","expected_duration_unit": "","summary": "Learn how to learn.","expected_duration": 0}
        response = parse_json(dummyJson)
        self.assertEqual(response['CourseProvider'], 'udacity')

if __name__ == '__main__':
    suite=TestCase.loadTestsFromTestCase(Testudacity)
    TestCase.TextTestRunner().run(suite)


