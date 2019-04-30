# Loading the libraries
import unittest

from selenium import webdriver 
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

import time
import platform
import requests


class Authentication(unittest.TestCase):

    def setUp(self):
        # self.driver = webdriver.Chrome(executable_path="./chrome-driver/chromedriver")
        # Loading the Chrome Web Driver
        if platform.system() == "Darwin":
            self.driver = webdriver.Chrome(executable_path="./chrome-driver/chromedriver_mac")
        elif platform.system() == "Windows":
            self.driver = webdriver.Chrome(executable_path="./chrome-driver/chromedriver.exe")
        elif platform.system() == "Linux":
            self.driver = webdriver.Chrome(executable_path="./chrome-driver/chromedriver_linux")

    def test_microdegree_load_page(self):
        driver = self.driver
        driver.get("http://localhost:8080/microdegree")

        tags = driver.find_element_by_id("degreeTags")
        self.assertIn("Degree Tags", tags.text)

    def test_microdegree_recommendation(self):
        driver = self.driver
        driver.get("http://localhost:8080/microdegree")

        tags = driver.find_element_by_id("degreeTags")
        self.assertIn("Degree Tags", tags.text)

        chips = driver.find_element_by_id("chipsTags")
        chips.send_keys("python"+Keys.ENTER)

        time_interval = driver.find_element_by_id("timeInterval")
        time_interval.send_keys("20"+Keys.TAB+Keys.ENTER)
        time.sleep(5)

        microdegree = driver.find_element_by_class_name('jumboMicroDegreeTitle').text
        
        self.assertIn(microdegree, "Microdegree Suggestion 1")

    def test_microdegree_recommendation_saving_happy_path(self):
        driver = self.driver
        driver.get("http://localhost:8080/microdegree")

        driver.find_element_by_id("loginButtonNavigator").click()
        time.sleep(1)

        username = driver.find_element_by_id("formGridEmail")        
        username.send_keys("test1@test.com"+Keys.TAB+"test1234"+Keys.TAB+Keys.ENTER)
        time.sleep(2)

        tags = driver.find_element_by_id("degreeTags")
        self.assertIn("Degree Tags", tags.text)

        chips = driver.find_element_by_id("chipsTags")
        chips.send_keys("python"+Keys.ENTER)

        time_interval = driver.find_element_by_id("timeInterval")
        time_interval.send_keys("20"+Keys.TAB+Keys.ENTER)
        time.sleep(5)

        microdegree = driver.find_element_by_class_name('jumboMicroDegreeTitle').text
        
        self.assertIn(microdegree, "Microdegree Suggestion 1")

        button = driver.find_element_by_id("registerMicroDegree0").click()
        time.sleep(1)

        saved_button = driver.find_element_by_id('degreeSaved0').text

        self.assertIn(saved_button, "Saved")

        driver.find_element_by_id("signedInOptions").click()
        time.sleep(1)

        driver.find_element_by_id("logout-button").click()


    def tearDown(self):
        self.driver.close()
    

##### Main Execution Starts Here
if __name__ == "__main__":
    unittest.main()
