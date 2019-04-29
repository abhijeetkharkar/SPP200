# Loading the libraries
import unittest
from selenium import webdriver 
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
import time
import platform


class Election(unittest.TestCase):

    def setUp(self):
        # Loading the Chrome Web Driver
        if platform.system() == "Darwin":
            self.driver = webdriver.Chrome(executable_path="./chrome-driver/chromedriver_mac")
        elif platform.system() == "Windows":
            self.driver = webdriver.Chrome(executable_path="./chrome-driver/chromedriver.exe")
        elif platform.system() == "Linux":
            self.driver = webdriver.Chrome(executable_path="./chrome-driver/chromedriver_linux")

    def test_Successful_Login(self):
        driver = self.driver
        driver.get("http://localhost:8080/")

        # Assertion to confirm that title has Voting in it
        self.assertIn("Course-Hub", driver.title)

        login_button = driver.find_element_by_id("loginButtonNavigator")

        login_button.click()

        username = driver.find_element_by_id("formGridEmail")
        
        username.send_keys("nabeelahmadkhan@gmail.com"+Keys.TAB+"12345678"+Keys.TAB+Keys.ENTER)
        time.sleep(3)

        assert "Hello," in driver.page_source

    def test_Failed_Login(self):
        driver = self.driver
        driver.get("http://localhost:8080/")

        # Assertion to confirm that title has Voting in it
        self.assertIn("Course-Hub", driver.title)

        login_button = driver.find_element_by_id("loginButtonNavigator")

        login_button.click()

        username = driver.find_element_by_id("formGridEmail")
        
        username.send_keys("nabeelahmadkhan@gmail.com"+Keys.TAB+"123456"+Keys.TAB+Keys.ENTER)
        time.sleep(2)
        error_msg = driver.find_element_by_id("invalidUsernamePwdFeedback").text
        self.assertEqual(error_msg, "The password is invalid or the user does not have a password.")

    def tearDown(self):
        self.driver.close()
    

##### Main Execution Starts Here
if __name__ == "__main__":
    unittest.main()


