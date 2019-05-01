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


    def test_successful_login(self):
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

        driver.find_element_by_id("signedInOptions").click()
        time.sleep(1)

        driver.find_element_by_id("logout-button").click()
    

    def test_failed_login(self):
        driver = self.driver

        driver.get("http://localhost:8080/")
        time.sleep(3)

        self.assertIn("Course-Hub", driver.title)

        driver.find_element_by_id("loginButtonNavigator").click()
        time.sleep(2)

        driver.find_element_by_id("formGridEmail").send_keys("test1@test.com"+Keys.TAB+"test12345"+Keys.TAB+Keys.ENTER)
        time.sleep(2)

        error_msg = driver.find_element_by_id("invalidUsernamePwdFeedback").text
        time.sleep(2)

        self.assertEqual(error_msg, "The password is invalid or the user does not have a password.")

        driver.find_element_by_id("loginCloseButton").click()
    

    def test_successful_signup(self):
        driver = self.driver

        driver.get("http://localhost:8080/")
        time.sleep(3)

        self.assertIn("Course-Hub", driver.title)

        driver.find_element_by_id("loginButtonNavigator").click()
        time.sleep(1)

        driver.find_element_by_id("loginRegisterButton").click()
        time.sleep(1)

        driver.find_element_by_id("formGridFirstName").send_keys("Selenium" + Keys.TAB 
                                                                + "Tester" + Keys.TAB 
                                                                + "selenium@test.com" + Keys.TAB
                                                                + "test1234" + Keys.TAB
                                                                + "test1234" + Keys.TAB
                                                                + Keys.ENTER)
        time.sleep(3)

        self.assertIn("Hello, Selenium", driver.page_source)

        driver.find_element_by_id("signedInOptions").click()
        time.sleep(1)

        driver.find_element_by_id("view-profile-button").click()
        time.sleep(1)

        driver.find_element_by_id("deactivate_nav_item-button").click()
        time.sleep(1)

        driver.find_element_by_id("formGridNewPassword").send_keys("test1234"
                                                                   + Keys.ENTER)
        time.sleep(3)

        alert = driver.switch_to.alert

        self.assertEqual("Account Deleted... Press OK to sign out", alert.text)
        
        alert.accept()

        driver.find_element_by_id("signedInOptions").click()
        time.sleep(1)

        driver.find_element_by_id("logout-button").click()


    def test_failed_signup_blank_form(self):
        driver = self.driver

        driver.get("http://localhost:8080/")
        time.sleep(3)

        self.assertIn("Course-Hub", driver.title)

        driver.find_element_by_id("loginButtonNavigator").click()
        time.sleep(1)

        driver.find_element_by_id("loginRegisterButton").click()
        time.sleep(1)

        driver.find_element_by_id("formGridFirstName").send_keys(Keys.ENTER)
        time.sleep(1)

        self.assertNotIn("Hello, ", driver.page_source)


    def test_failed_signup_invalid_email(self):
        driver = self.driver

        driver.get("http://localhost:8080/")
        time.sleep(3)

        self.assertIn("Course-Hub", driver.title)

        driver.find_element_by_id("loginButtonNavigator").click()
        time.sleep(1)

        driver.find_element_by_id("loginRegisterButton").click()
        time.sleep(1)

        driver.find_element_by_id("formGridFirstName").send_keys("Selenium" + Keys.TAB 
                                                                + "Tester" + Keys.TAB 
                                                                + "seleniumtest.com" + Keys.TAB
                                                                + "test1234" + Keys.TAB
                                                                + "test1234" + Keys.TAB
                                                                + Keys.ENTER)
        time.sleep(3)

        self.assertNotIn("Hello, Selenium", driver.page_source)
    

    def test_failed_signup_non_matching_password(self):
        driver = self.driver

        driver.get("http://localhost:8080/")
        time.sleep(3)

        self.assertIn("Course-Hub", driver.title)

        driver.find_element_by_id("loginButtonNavigator").click()
        time.sleep(1)

        driver.find_element_by_id("loginRegisterButton").click()
        time.sleep(1)

        driver.find_element_by_id("formGridFirstName").send_keys("Selenium" + Keys.TAB 
                                                                + "Tester" + Keys.TAB 
                                                                + "selenium@test.com" + Keys.TAB
                                                                + "test1234" + Keys.TAB
                                                                + "test12345" + Keys.TAB
                                                                + Keys.ENTER)
        time.sleep(3)

        self.assertEqual("Password not matching", driver.find_element_by_id("invalidUsernamePwdFeedback").text)
    

    def test_failed_signup_already_existing_id(self):
        driver = self.driver

        driver.get("http://localhost:8080/")
        time.sleep(3)

        self.assertIn("Course-Hub", driver.title)

        driver.find_element_by_id("loginButtonNavigator").click()
        time.sleep(1)

        driver.find_element_by_id("loginRegisterButton").click()
        time.sleep(1)

        driver.find_element_by_id("formGridFirstName").send_keys("Test1" + Keys.TAB 
                                                                + "Tester" + Keys.TAB 
                                                                + "test1@test.com" + Keys.TAB
                                                                + "test1234" + Keys.TAB
                                                                + "test1234" + Keys.TAB
                                                                + Keys.ENTER)
        time.sleep(3)

        self.assertEqual("User Account already present.", driver.find_element_by_id("invalidUsernamePwdFeedback").text)
    

    def test_forgot_password(self):
        driver = self.driver

        driver.get("http://localhost:8080/")
        time.sleep(3)

        self.assertIn("Course-Hub", driver.title)

        driver.find_element_by_id("loginButtonNavigator").click()
        time.sleep(1)

        driver.find_element_by_id("forgot-password-button").click()
        time.sleep(1)

        driver.find_element_by_id("formGridEmail").send_keys("test1@test.com"
                                                            + Keys.ENTER)
        time.sleep(2)

        self.assertIn("Password Reset Email sent successfully. Please check your mailbox.", 
                        driver.page_source)


    def tearDown(self):
        self.driver.close()
    

##### Main Execution Starts Here
if __name__ == "__main__":
    unittest.main()
