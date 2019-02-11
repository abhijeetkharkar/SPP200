# Lambda to update courses in elastic search from udemy API's

import json
import requests
import base64
#import crawler
import hashlib


def add_data_elastic_search(serialized_response):
    url = "https://search-coursehub-mmrw23yio2a4ylx2cgmx34eiyy.us-east-2.es.amazonaws.com/courses/course"
    headers = {
                "Content-Type": "application/json"
              }
    # print("Serialized object is ", serialized_response)
    # print("JSON Serialized object is ", json.dumps(serialized_response))
    try:
        print("JSON data is ", str(json.dumps(serialized_response)))
        response = requests.post(url, data=str(json.dumps(serialized_response)), headers = headers)
    except Exception as e:
        print ("\n Response is ",response.status_code)
        print ("\n Error is ", e)
        return response.status_code

    add_response = json.loads(response.content)
    # print("\n Add Response data is ", add_response)
    
    if response.status_code == 201 and add_response["result"] == "created":
        print("Course ID added : ", serialized_response['CourseId'])
        return True
    else:
        print("Course ID not added : ", serialized_response['CourseId'])
        return False


def search_elastic_server(course_id):
    # print("\n Course ID received is ", course_id)
    headers = {
                "Content-Type": "application/json"
              }
    url = "https://search-coursehub-mmrw23yio2a4ylx2cgmx34eiyy.us-east-2.es.amazonaws.com/courses/_search"
    try:
        response = requests.post(url, json={
                                                "query" : {
                                                            "term" : { "CourseId" : course_id }
                                                        }
                                            }, headers = headers)
    except Exception as e:
        print ("Response is ",response.status_code)
        print ("Error is ", e)
        return response.status_code
    
    search_response = json.loads(response.content)
    # print("Search Response data is ", search_response)
    if search_response["hits"]["total"] >= 1:
        return True
    else:
        return False

def parse_json(json_data):
    course_object = {}
    
    try:
        instructers = []
        for val in json_data['instructors']:
            temp = {}
            temp['InstructorName'] = val["name"]
            temp['ProfilePic'] = val["image"]
            temp['InstructorId'] = hashlib.md5(val["image"].encode()).hexdigest()
            instructers.append(temp)

        course_object['CourseId'] = "udacity-" + str(json_data['key'])
        course_object['Title'] = json_data['title']
        course_object['CourseProvider'] = "udacity"
        course_object['Description']=json_data['summary']
        course_object['Category'] = []

        cduration = {}
        cduration['Value'] = json_data["expected_duration"]
        cduration['Unit'] = json_data["expected_duration_unit"]
        course_object['CourseDuration'] = cduration

        course_object['Paid'] = False
        
        course_object['Price'] =0
        
        course_object['PriceCurrency'] = None
        course_object['Instructors'] = instructers
        course_object['URL'] = json_data['homepage']
        course_object['CourseImage'] = json_data['image']
        course_object['SelfPaced'] = True
        course_object['StartDate'] = None
        course_object['EndDate'] = None
        course_object['last_updated'] = None
        course_object['Difficulty']=json_data['level']
        course_object['Rating']=0
    except KeyError:
        return {'error' : "something wrong with JSON object."}
    
    return course_object


def fetch_records_udacity(fname):
    try:
        with open(fname) as f:
            content = f.readlines()
        url=content[0]
    except Exception as e:
        print("Error is ", e)
        raise FileNotFoundError

    headers = {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json;charset=utf-8"
            }
    try:
        response = requests.get(url, headers=headers)
    except Exception as e:
        print ("Response is ",response.status_code)
        print ("Error is ", e)
        
    json_response = json.loads(response.content)
    courseCatalog= json_response['courses']

        # Parsing JSON data into defined data set and pushing it into Elastic Search Server
    if response.status_code == 200 and len(courseCatalog) > 0:
        for course in courseCatalog:
            serialized_response = parse_json(course)
            print("Course ID is : ", serialized_response['CourseId'])
            search_query = search_elastic_server(str(serialized_response['CourseId']))
            if search_query == False:
                add_data_response = add_data_elastic_search(serialized_response)
                print("add_data_response course SuccessFully!!")
            else:
                print("Course already present in Elastic Search Server : ", serialized_response['CourseId'])


    else:
        print("unsuccessful, json parsing error")
        return {
                'status': json.dumps('API returned empty response.')
            }
    
    print("Course Catalog Fetched SuccessFully")


if __name__ == "__main__":
    fetch_records_udacity('info.txt')