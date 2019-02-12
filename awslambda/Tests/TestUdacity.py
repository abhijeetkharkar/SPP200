from unittest import TestCase
from mock import patch, MagicMock,mock_open
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
        self.mock_open.return_value.__next__ = lambda self:  next(iter(self.readline, ''))

    def test_url_file_not_found(self):
        with self.assertRaises(IOError):
            fetch_records_udacity("info1.txt")

    def test_invalid_url(self):
        with patch('__builtin__.open',self.mock_open):
            with self.assertRaises(Exception):
                fetch_records_udacity("../udacity/info.txt")


if __name__ == '__main__':
    suite=TestCase.loadTestsFromTestCase(Testudacity)
    TestCase.TextTestRunner().run(suite)


