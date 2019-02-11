from unittest import TestCase
from unittest.mock import patch,Mock,mock_open

from awslambda.udacity.loader import *

def mockGet():
    return

class Testudacity(TestCase):
    def setUp(self):
        self.file_content = (
            'www.sep2019.com\n'
        )
        self.mock_open = mock_open(read_data=self.file_content)
        self.mock_open.return_value.__iter__ = lambda self: self
        self.mock_open.return_value.__next__ = lambda self: self.readline()

    def test_url_file_not_found(self):
        self.assertRaises(IOError,fetch_records_udacity,"info1.txt")

    def test_invalid_url(self):
        with patch('builtins.open',self.mock_open):
            self.assertRaises(Exception, fetch_records_udacity, "../udacity/info.txt")


if __name__ == '__main__':
    suite=TestCase.loadTestsFromTestCase(Testudacity)
    TestCase.TextTestRunner().run(suite)


