import nltk
import time
import requests, json
from datetime import datetime

def generate_key(url):
    c = ''.join([str(ord(c)) for c in url if c.isalpha()])
    c = int(c) % (2 ** 32 - 1)
    return str(c)

def main():
    URL = 'https://iversity.org/api/v1/courses'
    SEARCH_URL = 'https://search-coursehub-mmrw23yio2a4ylx2cgmx34eiyy.us-east-2.es.amazonaws.com/courses/_search'
    POST_URL = 'https://search-coursehub-mmrw23yio2a4ylx2cgmx34eiyy.us-east-2.es.amazonaws.com/courses/course'

    response = requests.get(URL)
    courses = response.json()['courses']
    headers = {'Content-type': 'application/json'}
    start = time.time()
    count = 1
    total = len(courses)
    for course in courses:
        if 'Eng' in course['language']:
            key = PROVIDER + '-' + str(course['id'])
            res = requests.post(SEARCH_URL, data=str(json.dumps({"query" : {"term" : { "CourseId" : key }}})), headers=headers)
            if json.loads(res.text)['hits']['total'] > 0:
                print('[$] Already Processed', count, '/', total)
                count += 1
                continue
            print('[#] Processing', course['title'], count, '/', total)
            instructors = [{"InstructorId": ins['id'], "InstructorName": ins['name'], "ProfilePic": ins['image']}
                           for ins in course['instructors']]

            data = str(json.dumps({"CourseId":key, "CourseProvider": PROVIDER, "Title": course["title"], "Category":course["discipline"],
                            "CourseDuration": int(course["duration"]) if len(course["duration"]) != 0 else None, "Paid": True if course["verifications"][0]['price'] is not None else False,
                            "Price": int(course["verifications"][0]['price'].split(" ")[0]) if course["verifications"][0]["price"] is not None else None, "PriceCurrency": "Euro", "Instructors": instructors,
                            "URL": course["url"], "Rating": 0, "Description": course["description"], "CourseImage": course["image"],
                            "StartDate": datetime.strptime(course["start_date"].split('T')[0], '%Y-%m-%d').isoformat().split('T')[0] if "start_date" in course and course["start_date"] is not None else None,
                            "EndDate": datetime.strptime(course["end_date"].split('T')[0], '%Y-%m-%d').isoformat().split('T')[0] if "end_date" in course and course["end_date"] is not None else None,
                            "SelfPaced": None}))

            database_response = requests.post(POST_URL, headers=headers, data=data)
            if database_response.status_code != 201:
                print(key, database_response.status_code)
        else:
            print('[X] Course text not in english', count, '/', total)
        count += 1

    print('Total time taken:', round(time.time() - start, 2), 'sec')
    print()

if __name__ == '__main__':
    try:
        nltk.corpus.words.words()
    except LookupError:
        nltk.download('words')

    PROVIDER = 'Iversity'
    words_set = set(nltk.corpus.words.words())

    exit(main())