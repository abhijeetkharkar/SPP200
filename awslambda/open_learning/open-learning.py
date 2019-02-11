import nltk
import time
import requests, json
from datetime import datetime

def is_english(name):
    for word in nltk.wordpunct_tokenize(name):
        if word.lower() not in words_set:
            return False
    return True

def generate_key(url):
    c = ''.join([str(ord(c)) for c in url if c.isalpha()])
    c = int(c) % (2 ** 32 - 1)
    return str(c)

def main():
    URL = 'https://www.openlearning.com/api/courses/list?type=free,paid'
    SEARCH_URL = 'https://search-coursehub-mmrw23yio2a4ylx2cgmx34eiyy.us-east-2.es.amazonaws.com/courses/_search'
    POST_URL = 'https://search-coursehub-mmrw23yio2a4ylx2cgmx34eiyy.us-east-2.es.amazonaws.com/courses/course'

    response = requests.get(URL)
    courses = response.json()['courses']
    headers = {'Content-type': 'application/json'}
    start = time.time()
    count = 1
    total = len(courses)
    for course in courses:
        if is_english(course['name']):
            key = PROVIDER + '-' + generate_key(course['courseUrl'])
            res = requests.post(SEARCH_URL, data=str(json.dumps({"query" : {"term" : { "CourseId" : key }}})), headers=headers)
            if json.loads(res.text)['hits']['total'] > 0:
                print('[$] Already Processed', count, '/', total)
                count += 1
                continue
            print('[#] Processing', course['name'], count, '/', total)
            instructors = [{"InstructorId": str(generate_key(course['creator']['profileUrl'])), "InstructorName": course['creator']['fullName'],
                            "ProfilePic": course['creator']['imageUrl']}]

            data = str(json.dumps({"CourseId":key, "CourseProvider": PROVIDER, "Title": course["name"], "Category":course["category"],
                            "CourseDuration": int(course["duration"].split(' ')[0]), "Paid": True if course["type"] == "paid" else False,
                            "Price": int(str(course["price"]).split(" ")[0]), "PriceCurrency": "USD", "Instructors": instructors,
                            "URL": course["courseUrl"], "Rating": 0, "Description": course["summary"], "CourseImage": course["image"],
                            "StartDate": datetime.strptime(course["startDate"], '%d %b %Y').isoformat().split('T')[0] if "startDate" in course and course["startDate"] is not None else None,
                            "EndDate": datetime.strptime(course["endDate"], '%d %b %Y').isoformat().split('T')[0] if "endDate" in course and course["endDate"] is not None else None,
                            "SelfPaced": course["selfPaced"]}))

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

    PROVIDER = 'Open Learning'
    words_set = set(nltk.corpus.words.words())

    exit(main())