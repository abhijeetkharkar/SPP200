import json
import time
import requests

headers = {'Content-type': 'application/json'}

def add_data_elastic_search(url, data):
    try:
        response = requests.post(url, data=str(json.dumps(data)), headers=headers)
    except Exception as e:
        print("[X] Exception occured during data populate query(", data['CourseId'], "): ", e)
        return False

    if response.status_code != 201:
        print('[X] Course not added -- Response Code:', response.status_code, '\t Response text', response.text)
        return False

    print('[#] Successfully populated data')
    return True


def search_data_elastic_search(url, key_value):
    try:
        response = requests.post(url, data=str(json.dumps({"query": {"term": key_value}})), headers=headers)
    except Exception as e:
        print("Exception occured during search query: ", e)
        return False

    response = response.json()
    return True if response["hits"]["total"] >= 1 else False


def fetch_data(URL, retry_limit, waiting_time):
    retry = 1
    while True:
        try:
            response = requests.get(URL)
            courses = response.json()['courses']
            return courses
        except Exception as e:
            if retry == retry_limit:
                print('Coulnot fetch data... Exiting')
                return False
            retry += 1
            print('Could not fetch data... Retrying in %s seconds' % waiting_time)
            time.sleep(waiting_time)

