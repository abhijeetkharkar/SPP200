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


class Profile(unittest.TestCase):

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

    def test_successful_profile_update(self):
        driver = self.driver

        driver.get("http://localhost:8080/")
        time.sleep(3)

        self.assertIn("Course-Hub", driver.title)

        driver.find_element_by_id("loginButtonNavigator").click()
        time.sleep(2)

        username = driver.find_element_by_id("formGridEmail")
        username.send_keys("test1@test.com" + Keys.TAB + "test1234" + Keys.TAB + Keys.ENTER)
        time.sleep(2)

        self.assertIn("Hello, Test1", driver.page_source)

        driver.find_element_by_id("signedInOptions").click()
        time.sleep(1)
        driver.find_element_by_id("view-profile-button").click()
        time.sleep(1)
        driver.find_element_by_id("profile_nav_item").click()
        time.sleep(1)

        first_name = driver.find_element_by_id("formGridfname").text
        driver.find_element_by_id("formGridfname").send_keys("2" + Keys.ENTER)
        time.sleep(2)

        alert = driver.switch_to.alert

        self.assertEqual("Profile Updated Successfully", alert.text)

        alert.accept()

        self.assertIn("Hello, Test12", driver.page_source)

        driver.find_element_by_id("formGridfname").send_keys(Keys.BACKSPACE + first_name + Keys.ENTER)
        time.sleep(2)

        driver.switch_to.alert.accept()

        driver.find_element_by_id("signedInOptions").click()
        time.sleep(1)

        driver.find_element_by_id("logout-button").click()
        
        
    def tearDown(self):
        self.driver.close()


##### Main Execution Starts Here
if __name__ == "__main__":
    unittest.main()