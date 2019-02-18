import json
import time
import nltk
from os import sys, path
from datetime import datetime

sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))
import utils

def lambda_handler(event, context):
    try:
        nltk.corpus.words.words()
    except LookupError:
        nltk.download('words')

    PROVIDER = 'Open Learning'
    words_set = set(nltk.corpus.words.words())

    URL = "https://www.openlearning.com/api/courses/list?type=free,paid"
    POST_URL = "https://search-coursehub-mmrw23yio2a4ylx2cgmx34eiyy.us-east-2.es.amazonaws.com/courses/course"
    SEARCH_URL = "https://search-coursehub-mmrw23yio2a4ylx2cgmx34eiyy.us-east-2.es.amazonaws.com/courses/_search"

    courses = utils.fetch_data(URL, 5, 30)
    if courses != False:
        count = 1
        add_count = 0
        start = time.time()
        total = len(courses)

        for course in courses:
            if utils.is_english(course['name'], words_set):
                try:
                    key = PROVIDER + '-' + utils.generate_key(course['courseUrl'])
                    if utils.search_data_elastic_search(SEARCH_URL, {"CourseId": key}):
                        print('[$] Already Processed', count, '/', total)
                        count += 1
                        continue

                    instructors = [{"InstructorId": str(utils.generate_key(course['creator']['profileUrl'])),
                                    "InstructorName": course['creator']['fullName'] if 'fullName' in course['creator'] else None,
                                    "ProfilePic": course['creator']['imageUrl'] if 'imageUrl' in course['creator'] else None}]  if 'creator' in course else None

                    data = {"CourseId": key, "CourseProvider": PROVIDER,
                            "Title": course["name"] if 'name' in course else None,
                            "Category": course["category"] if 'category' in course else None,
                            "CourseDuration": {'Unit': 'hour', 'Value': int(course["duration"].split(' ')[0])}  if 'duration' in course else None,
                            "Paid": True if 'type' in course and course["type"] == "paid" else False,
                            "Price": int(str(course["price"]).split(" ")[0]) if 'price' in course else None,
                            "PriceCurrency": "USD", "Instructors": instructors,
                            "URL": course["courseUrl"], "Rating": 0,
                            "Description": course["summary"] if 'summary' in course else None,
                            "CourseImage": course["image"] ,
                            "StartDate": datetime.strptime(course["startDate"], '%d %b %Y').isoformat().split('T')[
                                0] if "startDate" in course and course["startDate"] is not None else None,
                            "EndDate": datetime.strptime(course["endDate"], '%d %b %Y').isoformat().split('T')[
                                0] if "endDate" in course and course["endDate"] is not None else None,
                            "SelfPaced": course["selfPaced"] if 'selfPaced' in course else None}

                    utils.add_data_elastic_search(POST_URL, data)
                    add_count += 1
                except Exception as e:
                    print('[%] Error occured ==>', 'Course Name', course['name'], ':', e)
            else:
                print('[X] Course text not in english', count, '/', total)
            count += 1

        print("\nCourse Catalog Update Complete")
        print("Total Courses Fetch:", total)
        print("Total Courses Added:", add_count)
        print('Total time taken:', round(time.time() - start, 2), 'sec\n')


if __name__ == '__main__':
    lambda_handler('', '')