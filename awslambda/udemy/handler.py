# Lambda to update courses in elastic search from udemy API's

import json
import requests
import base64
# from awslambda.udemy.crawler import *
from crawler import *
import hashlib
import sys
import time
from time import sleep

def add_data_elastic_search(serialized_response, elastic_search_add_data_url):
    headers = {
                "Content-Type": "application/json"
              }
    try:
        response = requests.post(elastic_search_add_data_url, data=str(json.dumps(serialized_response)), headers = headers)
    except Exception as e:
        print ("\n Response is ",response.status_code)
        print ("\n Error is ", e)
        print("\t Course not added, POST request Error")
        return False

    add_response = json.loads(response.content)
    
    if response.status_code == 201 and add_response["result"] == "created":
        return True
    else:
        print("\t Course not added, Response Code : ", response.status_code)
        return False


def search_elastic_server(course_id, elastic_search_search_data_url):
    headers = {
                "Content-Type": "application/json"
              }
    try:
        response = requests.post(elastic_search_search_data_url, json={
                                                "query" : {
                                                            "term" : { "CourseId" : course_id }
                                                        }
                                            }, headers = headers)
    except Exception as e:
        print ("Error is ", e)
        return False
    
    search_response = json.loads(response.content)
    return True if search_response["hits"]["total"] >= 1 else False


def parse_json(json_data):
    course_object = {}
    global course_level

    if 'url' not in json_data.keys():
        return False

    url_to_crawl = "https://www.udemy.com" + json_data['url']
    
    extra_data = crawl(url_to_crawl)
    if extra_data['duration'] == None:
        print("Crawler returned None for this URl : ",url_to_crawl, extra_data)
        return False
    try:
        instructers = []
        for val in json_data['visible_instructors']:
            temp = {}
            temp['InstructorName'] = val["title"]
            temp['ProfilePic'] = val["image_100x100"]
            temp['InstructorId'] = hashlib.md5(val["image_100x100"].encode()).hexdigest()
            instructers.append(temp)
        course_object['CourseId'] = "udemy-" + str(json_data['id'])
        course_object['Title'] = json_data['title']
        course_object['CourseProvider'] = "Udemy"
        course_object['Category'] = extra_data["category"] \
            if extra_data["category"] != None \
            else None
        course_object['CourseDuration'] = { 'Unit' : 'hours', 'Value' : extra_data["duration"] } \
            if extra_data["duration"] != None \
            else None    
        course_object['Paid'] = json_data['is_paid']        
        course_object['Price'] = float(extra_data["price"]) \
            if extra_data["price"] != None \
            else json_data['price_detail']['amount']        
        course_object['PriceCurrency'] = json_data['price_detail']['currency']
        course_object['Instructors'] = instructers if instructers != [] \
            else None
        course_object['URL'] = "www.udemy.com" + json_data['url']
        course_object['CourseImage'] = json_data['image_480x270']
        course_object['SelfPaced'] = True
        course_object['last_updated'] = extra_data["last_update"] \
            if extra_data["last_update"] != None \
            else None        
        course_object['StartDate'] = None
        course_object['EndDate'] = None

        if course_level == "beginner":
            course_object['Difficulty'] = "Introductory"
        elif course_level == "intermediate":
            course_object['Difficulty'] = "Intermediate"
        elif course_level == "expert":
            course_object['Difficulty'] = "Advanced"
        elif course_level == "all":
            course_object['Difficulty'] = "all"
        else:
            course_object['Difficulty'] = "all"

        course_object['Description'] = extra_data["description"] \
            if extra_data != None \
            else None        
        course_object['Rating']=0
        course_object['NoofRatings']=0
        course_object['hits']=0
    except KeyError:
        print("\t Something wrong with parsing JSON object - parse_json(json_data)")
        return False
    
    print ("Object is ", course_object)
    return course_object


def lambda_handler(file_name):
    
    try:
        with open(file_name) as data_file:
            udemy_keys = json.load(data_file)
    except Exception as e:
        print("Exception in opening keys.json file : ", file_name)
        print("Exception : ", e)
        raise IOError

    page_number = udemy_keys['page_number'] # Pagination Parameters
    page_size = udemy_keys['page_size']   # Pagination Parameters
    elastic_search_add_data_url = udemy_keys['elastic_search_add_data_url']
    elastic_search_search_data_url = udemy_keys['elastic_search_search_data_url']
    global course_level
    difficulty = ["beginner", "intermediate", "expert", "all"] 
    course_dict = {
                    'courses' : []
                }

    count = 0
    courses_added = 0
    courses_not_added = 0
    course_already_present = 0


    for level in difficulty:
        count = 1
        course_level = level
        while True:
            page_number += 1
            url = udemy_keys['url']+str(page_number)+"&page_size="+str(page_size)+"&instructional_level="+course_level
            # print("URL is ", url)
            client_secret = udemy_keys["udemy"]["clientid"] + ":" + udemy_keys["udemy"]["clientsecret"]
            authorization_token = "Basic " + base64.b64encode(client_secret.encode('utf-8')).decode('UTF-8')
            headers = {
                        "Accept": "application/json, text/plain, */*",
                        "Authorization": authorization_token,
                        "Content-Type": "application/json;charset=utf-8"
                    }

            try:
                response = requests.get(url, headers=headers)
                json_response = json.loads(response.content)
            except Exception as e:
                print ("Exception while loading data from the API")
                print("Exception : ", e)
                raise Exception
             
            # Parsing JSON data into defined data set and pushing it into Elastic Search Server
            if response.status_code == 200 and len(json_response['results']) > 0:
                courses = json_response['results']
                for course in courses:
                    count += 1
                    
                    
                    # Search Course in Elastic Search Server
                    search_query = search_elastic_server("udemy-"+str(course['id']), elastic_search_search_data_url)

                    # course_dict['courses'].append(serialized_response)
                    
                    if search_query == False:
                        serialized_response = parse_json(course)
                        if serialized_response == False:
                            courses_not_added += 1
                            print("System Waiting due to failure")
                            for x in range (1800, -1, -1):
                                print("Time Remaining : " + str(x) + " sec")
                                sys.stdout.write("\033[F")
                                time.sleep(1.0)
                            continue
                        
                        print("Course ID is : ", serialized_response['CourseId'], level, count)

                        add_data_response = add_data_elastic_search(serialized_response, elastic_search_add_data_url)
                        if add_data_response:
                            print("Course Successfully added ")
                            courses_added += 1
                        else:
                            courses_not_added += 1
                        
                        # Sleep before the next request
                        print("System Waiting local")
                        for x in range (10, -1, -1):
                            print("Time Remaining : " + str(x) + " sec")
                            sys.stdout.write("\033[F")
                            time.sleep(1.0)
                    else:
                        course_already_present += 1
                        print("Course already present in Elastic Search Server : ", course['id'])

            else:
                print("Unsuccessful Response Code : ", response.status_code)
                continue

            print("Total course added are ", courses_added)

            if json_response['next'] == None or count >= udemy_keys['number_of_courses']:
                break

    # with open(course_level+'-data.json', 'w') as outfile:
    #     json.dump(course_dict, outfile)
    
    print("Course Catalog Update Complete")
    print("Total Operations : ", count)
    print("Total Courses Added : ", courses_added)
    print("Total Courses Not Added : ", courses_not_added)
    print("Total Courses Already Present in the Database : ", course_already_present)

    return True


if __name__ == "__main__":
    lambda_handler('keys.json')