# Loading the libraries
import unittest

from selenium import webdriver
from selenium.webdriver.chrome.options import Options

from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

import time
import platform

import urllib.parse as urlparse


class Search(unittest.TestCase):

    def setUp(self):
        # Loading the Chrome Web Driver        
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument("--start-maximized")

        if platform.system() == "Darwin":
            self.driver = webdriver.Chrome(executable_path="./chrome-driver/chromedriver_mac", chrome_options=chrome_options)
        elif platform.system() == "Windows":
            self.driver = webdriver.Chrome(executable_path="./chrome-driver/chromedriver.exe", chrome_options=chrome_options)
        elif platform.system() == "Linux":
            self.driver = webdriver.Chrome(executable_path="./chrome-driver/chromedriver_linux", chrome_options=chrome_options)



    def test_successful_autosuggest(self):
        driver = self.driver

        driver.get("http://localhost:8080/")
        time.sleep(3)

        self.assertIn("Course-Hub", driver.title)

        driver.find_element_by_id("landing-search-box-id").send_keys("d")
        time.sleep(0.3)
        driver.find_element_by_id("landing-search-box-id").send_keys("e")
        time.sleep(0.3)
        driver.find_element_by_id("landing-search-box-id").send_keys("e")
        time.sleep(0.3)
        driver.find_element_by_id("landing-search-box-id").send_keys("p")
        time.sleep(0.3)

        self.assertTrue(driver.find_element_by_id("landing-suggestions-table-id"))


    def test_successful_search(self):
        driver = self.driver

        driver.get("http://localhost:8080/")
        time.sleep(3)

        self.assertIn("Course-Hub", driver.title)

        driver.find_element_by_id("landing-search-box-id").send_keys("python" + Keys.ENTER)
        time.sleep(2)
        
        self.assertTrue(driver.find_element_by_id("search-results-search-box-id"))
        self.assertTrue(driver.find_element_by_id("search-results-table"))


    def test_successful_course_filter_providers(self):
        driver = self.driver

        driver.get("http://localhost:8080/search?searchString=india&pageNumber=0")
        time.sleep(3)

        self.assertIn("Course-Hub", driver.title)
        self.assertTrue(driver.find_element_by_id("search-results-search-box-id"))
        self.assertTrue(driver.find_element_by_id("search-results-table"))
        
        driver.find_element_by_id("udemy").click()
        driver.find_element_by_id("filter-courses").click()
        time.sleep(2)

        self.assertEqual(driver.find_element_by_id("search-results-table-header-id").text, "2 results for 'india'")


    def test_successful_course_filter_price_range(self):
        driver = self.driver

        driver.get("http://localhost:8080/search?searchString=india&pageNumber=0")
        time.sleep(3)

        self.assertIn("Course-Hub", driver.title)
        self.assertTrue(driver.find_element_by_id("search-results-search-box-id"))
        self.assertTrue(driver.find_element_by_id("search-results-table"))
        
        driver.find_element_by_id("udemy").click()
        driver.find_element_by_id("price-range-min").send_keys("10" + Keys.TAB + "30" + Keys.ENTER)
        time.sleep(2)

        self.assertEqual(driver.find_element_by_id("search-results-table-header-id").text, "2 results for 'india'")


    def test_successful_course_next_page(self):
        driver = self.driver

        driver.get("http://localhost:8080/search?searchString=india&pageNumber=0")
        time.sleep(3)

        self.assertIn("Course-Hub", driver.title)
        self.assertTrue(driver.find_element_by_id("search-results-search-box-id"))
        self.assertTrue(driver.find_element_by_id("search-results-table"))
        
        driver.find_element_by_id("search-results-table-footer-paginator-next").click()
        time.sleep(2)

        self.assertEqual(int(urlparse.parse_qs(urlparse.urlparse(driver.current_url).query)['pageNumber'][0]), 1)
    
    
    def test_successful_course_sort_rating(self):
        driver = self.driver

        driver.get("http://localhost:8080/search?searchString=india&pageNumber=0")
        time.sleep(3)

        self.assertIn("Course-Hub", driver.title)
        self.assertTrue(driver.find_element_by_id("search-results-search-box-id"))
        self.assertTrue(driver.find_element_by_id("search-results-table"))

        driver.find_element_by_id("search-results-table-header-sort-toggle-id").click()
        time.sleep(0.5)
        driver.find_element_by_id("search-results-table-header-sort-item-rating").click()
        time.sleep(2)
        
        self.assertEqual(driver.find_element_by_id("search-results-course-data-name-link-0").text, 
                            "Understanding Venture Capitalists: How to Get Money for Your Start Up")
    
    
    def test_successful_course_sort_price(self):
        driver = self.driver

        driver.get("http://localhost:8080/search?searchString=india&pageNumber=0")
        time.sleep(3)

        self.assertIn("Course-Hub", driver.title)
        self.assertTrue(driver.find_element_by_id("search-results-search-box-id"))
        self.assertTrue(driver.find_element_by_id("search-results-table"))

        driver.find_element_by_id("search-results-table-header-sort-toggle-id").click()
        time.sleep(0.5)
        driver.find_element_by_id("search-results-table-header-sort-item-price").click()
        time.sleep(2)
        
        self.assertEqual(driver.find_element_by_id("search-results-course-data-name-link-0").text, 
                            "Reconciliation Through Indigenous Education")

    
    def test_successful_course_compare(self):
        driver = self.driver

        driver.get("http://localhost:8080/search?searchString=india&pageNumber=0")
        time.sleep(3)

        self.assertIn("Course-Hub", driver.title)
        self.assertTrue(driver.find_element_by_id("search-results-search-box-id"))
        self.assertTrue(driver.find_element_by_id("search-results-table"))
        
        driver.find_element_by_id("add-to-compare-0").click()
        time.sleep(0.5)
        driver.find_element_by_id("add-to-compare-1").click()
        time.sleep(0.5)
        driver.find_element_by_id("add-to-compare-2").click()
        time.sleep(0.5)
        driver.find_element_by_id("compare-button-id").click()
        time.sleep(1)
        driver.find_element_by_id("compare-button").click()

        self.assertEqual(driver.find_element_by_id("compare-table-heading-id").text, "Compare Courses")

    
    def test_successful_course_compare_remove(self):
        driver = self.driver

        driver.get("http://localhost:8080/search?searchString=india&pageNumber=0")
        time.sleep(3)

        self.assertIn("Course-Hub", driver.title)
        self.assertTrue(driver.find_element_by_id("search-results-search-box-id"))
        self.assertTrue(driver.find_element_by_id("search-results-table"))
        
        driver.find_element_by_id("add-to-compare-0").click()
        time.sleep(0.5)
        driver.find_element_by_id("add-to-compare-1").click()
        time.sleep(0.5)
        driver.find_element_by_id("add-to-compare-2").click()
        time.sleep(0.5)
        
        self.assertEqual(int(driver.find_element_by_id("compare-number-id").text), 3)

        driver.find_element_by_id("remove-from-compare-0").click()
        time.sleep(0.5)
        driver.find_element_by_id("remove-from-compare-1").click()
        time.sleep(0.5)
        driver.find_element_by_id("remove-from-compare-2").click()
        time.sleep(0.5)

        try:
            driver.find_element_by_id("compare-button-id")
            flag = True
        except:
            flag = False

        self.assertTrue(not flag, True)


    def test_successful_favourite_addition(self):
        driver = self.driver

        driver.get("http://localhost:8080/")
        time.sleep(3)

        self.assertIn("Course-Hub", driver.title)

        driver.find_element_by_id("loginButtonNavigator").click()
        time.sleep(2)

        username = driver.find_element_by_id("formGridEmail")        
        username.send_keys("test1@test.com"+Keys.TAB+"test1234"+Keys.TAB+Keys.ENTER)
        time.sleep(2)

        self.assertIn("Hello, Test1", driver.page_source)

        driver.find_element_by_id("landing-search-box-id").send_keys("india" + Keys.ENTER)
        time.sleep(2)
        
        course_listed = driver.find_element_by_id("search-results-course-data-name-link-0").text
        driver.find_element_by_id("course-list-button-id-0").click()
        time.sleep(0.5)
        driver.find_element_by_id("course-radio-1").click()
        time.sleep(0.5)
        driver.find_element_by_id("signedInOptions").click()
        time.sleep(1)
        driver.find_element_by_id("view-profile-button").click()
        time.sleep(1)
        driver.find_element_by_id("courses_nav_item").click()
        time.sleep(1)
        
        self.assertEqual(driver.find_element_by_id("profile-list-course-title-0").text, course_listed)

        driver.find_element_by_id("course-list-button-id-0").click()
        time.sleep(0.5)
        driver.find_element_by_id("course-list-remove-button-id-0").click()
        driver.find_element_by_id("signedInOptions").click()
        time.sleep(1)
        driver.find_element_by_id("logout-button").click()


    def test_successful_course_details(self):
        driver = self.driver

        driver.get("http://localhost:8080/search?searchString=python&pageNumber=0")
        time.sleep(3)

        self.assertIn("Course-Hub", driver.title)
        self.assertTrue(driver.find_element_by_id("search-results-search-box-id"))
        self.assertTrue(driver.find_element_by_id("search-results-table"))
        
        text1 = driver.find_element_by_id("search-results-course-data-name-link-0").text
        driver.find_element_by_id("search-results-course-data-name-link-0").click()
        time.sleep(2)

        self.assertEqual(driver.find_element_by_id("course-title-link").text.strip(), text1.strip())


    def tearDown(self):
        self.driver.close()
    

##### Main Execution Starts Here
if __name__ == "__main__":
    unittest.main()
