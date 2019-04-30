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

    def test_add_deal_sad_path(self):
        driver = self.driver
        driver.get("http://localhost:8080/deals")
        self.assertIn("Course-Hub", driver.title)
        driver.find_element_by_id("dealSubmitButton").click()
        time.sleep(1)
        alert = driver.switch_to.alert
        alert.accept();
        

    def test_add_deal_happy_path(self):
        driver = self.driver
        driver.get("http://localhost:8080/deals")

        driver.find_element_by_id("loginButtonNavigator").click()
        time.sleep(2)

        username = driver.find_element_by_id("formGridEmail")
        username.send_keys("test1@test.com"+Keys.TAB+"test1234"+Keys.TAB+Keys.ENTER)
        time.sleep(2)

        self.assertIn("Hello, Test1", driver.page_source)

        driver.find_element_by_id("dealSubmitButton").click()
        time.sleep(1)
        
        heading = driver.find_element_by_id("newCourseDeal").text

        self.assertIn(heading, " ADD NEW COURSE DEALS ")

        driver.find_element_by_id("signedInOptions").click()
        time.sleep(1)

        driver.find_element_by_id("logout-button").click()

    def test_add_new_deal(self):
        driver = self.driver
        driver.get("http://localhost:8080/deals")
        driver.find_element_by_id("loginButtonNavigator").click()
        time.sleep(2)

        username = driver.find_element_by_id("formGridEmail")
        username.send_keys("test1@test.com"+Keys.TAB+"test1234"+Keys.TAB+Keys.ENTER)
        time.sleep(2)

        self.assertIn("Hello, Test1", driver.page_source)

        driver.find_element_by_id("dealSubmitButton").click()
        time.sleep(1)
        
        heading = driver.find_element_by_id("newCourseDeal").text
        
        title = driver.find_element_by_id("formGridTitle")
        title.send_keys('Random Title for test cases')

        description = driver.find_element_by_id("formGridDescription")
        description.send_keys("some random description")

        link = driver.find_element_by_id("formGridLink")
        link.send_keys("http://course-hub.com")

        original_price = driver.find_element_by_id("formGridOriginalPrice")
        original_price.send_keys("10")

        discounted_price = driver.find_element_by_id("formGridDiscountedPrice")
        discounted_price.send_keys("5")

        date_posted = driver.find_element_by_id("formGridDatePosted")
        date_posted.click()
        date_posted.send_keys("04042020")

        driver.find_element_by_id("addNewDealButton").click()
        time.sleep(2)

        success_text = driver.find_element_by_id("adddealsuccess").text

        id_value = driver.find_element_by_id("dealIDValue")
        id_value = id_value.get_attribute('innerHTML')
        print("ID is ", id_value)
        API_ENDPOINT = "https://search-coursehub-mmrw23yio2a4ylx2cgmx34eiyy.us-east-2.es.amazonaws.com/deals/deal/" + id_value
        HEADERS = {'Content-Type': 'application/json'}
        response = requests.delete(API_ENDPOINT, headers=HEADERS)
        self.assertIn(success_text, "SUCCESS!!!")

        driver.find_element_by_id("signedInOptions").click()
        time.sleep(1)

        driver.find_element_by_id("logout-button").click()



    def tearDown(self):
        self.driver.close()
    

##### Main Execution Starts Here
if __name__ == "__main__":
    unittest.main()
