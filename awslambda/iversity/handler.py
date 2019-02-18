import json
import time
from os import sys, path
from datetime import datetime

sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))
import utils


def lambda_handler(event, context):
    PROVIDER = 'Iversity'

    URL = "https://iversity.org/api/v1/courses"
    POST_URL = "https://search-coursehub-mmrw23yio2a4ylx2cgmx34eiyy.us-east-2.es.amazonaws.com/courses/course"
    SEARCH_URL = "https://search-coursehub-mmrw23yio2a4ylx2cgmx34eiyy.us-east-2.es.amazonaws.com/courses/_search"

    courses = utils.fetch_data(URL, 5, 30)
    if courses != False:
        count = 1
        add_count = 0
        start = time.time()
        total = len(courses)

        for course in courses:
            try:
                if 'Eng' in course['language']:
                    key = PROVIDER + '-'
                    key += str(course['id']) if 'id' in course else course['url']

                    if utils.search_data_elastic_search(SEARCH_URL, {"CourseId": key}):
                        print('[$] Already Processed', count, '/', total)
                        count += 1
                        continue

                    instructors = [{"InstructorId": ins['id'] if 'id' in ins else None,
                                    "InstructorName": ins['name'] if 'name' in ins else None,
                                    "ProfilePic": ins['image'] if 'image' in ins else None}
                                   for ins in course['instructors']] if 'instructors' in course else None

                    data = ({"CourseId": key, "CourseProvider": PROVIDER,
                             "Title": course["title"] if 'title' in course else None,
                             "Category": course["discipline"] if 'discipline' in course else None,
                             "CourseDuration": int(course["duration"]) if 'duration' in course and len(course["duration"]) != 0 else None,
                             "Paid": True if 'verifications' in course and course["verifications"][0]['price'] is not None else False,
                             "Price": int(course["verifications"][0]['price'].split(" ")[0]) if 'verifications' in course and course["verifications"][0]["price"] is not None else None,
                             "PriceCurrency": "Euro", "Instructors": instructors,
                             "URL": course["url"] if 'url' in course else None,
                             "Rating": 0, "Description": course["description"] if 'description' in course else None,
                             "CourseImage": course["image"] if "image" in course else None,
                             "StartDate": datetime.strptime(course["start_date"].split('T')[0], '%Y-%m-%d').isoformat().split('T')[0]
                             if "start_date" in course and course["start_date"] is not None else None,
                             "EndDate":datetime.strptime(course["end_date"].split('T')[0], '%Y-%m-%d').isoformat().split('T')[0]
                             if "end_date" in course and course["end_date"] is not None else None,
                             "SelfPaced": None})

                    utils.add_data_elastic_search(POST_URL, data)
                    add_count += 1
                else:
                    print('[X] Course text not in english', count, '/', total)
                count += 1
            except Exception as e:
                print('[%] Error occured ', count, '/', total, ':', e)


        print("\nCourse Catalog Update Complete")
        print("Total Courses Fetch:", total)
        print("Total Courses Added:", add_count)
        print('Total time taken:', round(time.time() - start, 2), 'sec\n')
        return True

if __name__ == '__main__':
    lambda_handler('', '')