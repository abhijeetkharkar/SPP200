# Lambda to update courses in elastic search from udemy API's

import json
import requests
import base64
import crawler
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
    if 'url' in json_data.keys():
        extra_data = crawler.crawl("https://www.udemy.com" + json_data['url'])
    else:
        extra_data = {
                        "price" : None,
                        "duration" : None,
                        "last_update" : None,
                        "category" : None
                    }
    # print("Extra data received is ", extra_data)
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
        
        if extra_data["category"] != None:
            course_object['Category'] = extra_data["category"]
        else:
            course_object['Category'] = []
        
        if extra_data["duration"] != None:
            course_object['CourseDuration'] = extra_data["duration"]
        else:
            course_object['CourseDuration'] = None
        
        course_object['Paid'] = json_data['is_paid']
        
        if extra_data["price"] != None:
            course_object['Price'] = float(extra_data["price"])
        else:
            course_object['Price'] = json_data['price_detail']['amount']
        
        course_object['PriceCurrency'] = json_data['price_detail']['currency']
        course_object['Instructors'] = instructers
        course_object['URL'] = "www.udemy.com" + json_data['url']
        course_object['CourseImage'] = json_data['image_480x270']
        course_object['SelfPaced'] = True
        
        if extra_data["last_update"] != None:
            course_object['StartDate'] = extra_data["last_update"]
        else:
            course_object['StartDate'] = None
        
        course_object['EndDate'] = None
    except KeyError:
        return {'error' : "something wrong with JSON object."}
    
    return course_object
    

def lambda_handler(event, context):
    
    # Loading keys from keys.json file
    with open('keys.json') as data_file:
        udemy_keys = json.load(data_file)

    page_number = 1 # Pagination Parameters
    page_size = 1   # Pagination Parameters

    while True:
        page_number += 1    
        url = "https://www.udemy.com/api-2.0/courses/?page="+str(page_number)+"&page_size="+str(page_size)
        client_secret = udemy_keys["udemy"]["clientid"] + ":" + udemy_keys["udemy"]["clientsecret"]
        authorization_token = "Basic " + base64.b64encode(client_secret.encode('utf-8')).decode('UTF-8')
        headers = {
                    "Accept": "application/json, text/plain, */*",
                    "Authorization": authorization_token,
                    "Content-Type": "application/json;charset=utf-8"
                }
        
        # print("client id is ", str(udemy_keys["udemy"]["clientid"]))
        # print("client secret is ", udemy_keys["udemy"]["clientsecret"])
        # print("authorization token is ", authorization_token)

        try:
            response = requests.get(url, headers=headers)
        # except response.raise_for_status():
        except Exception as e:
            print ("Response is ",response.status_code)
            print ("Error is ", e)
        
        json_response = json.loads(response.content)
        # print("Response is ", json_response['results'])
        
        # Parsing JSON data into defined data set and pushing it into Elastic Search Server
        if response.status_code == 200 and len(json_response['results']) > 0:
            courses = json_response['results']
            for course in courses:
                serialized_response = parse_json(course)
                # print("\n JSON Object is ", serialized_response)
                print("Course ID is : ", serialized_response['CourseId'])
                # Update Data in Elastic Search Server
                search_query = search_elastic_server("udemy-"+str(course['id']))
                # print ("\n Search Query returned : ", search_query)
                if search_query == False:
                    add_data_response = add_data_elastic_search(serialized_response)
                    # print("\n Data Added : ", add_data_response)
                else:
                    print("Course already present in Elastic Search Server : ", serialized_response['CourseId'])
        else:
            print("unsuccessful, json parsing error")
            return {
                    'status': json.dumps('API returned empty response.')
                }

        if json_response['next'] == None:
            break
        #TODO: Remove this break statement once done.
        break
    
    print("Course Catalog Update Complete")

if __name__ == "__main__":
    lambda_handler('', '')