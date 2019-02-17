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
    URL = 'https://www.openlearning.com/api/courses/list?type=free,paid'
    POST_URL = 'https://search-coursehub-mmrw23yio2a4ylx2cgmx34eiyy.us-east-2.es.amazonaws.com/courses/course',
    SEARCH_URL = 'https://search-coursehub-mmrw23yio2a4ylx2cgmx34eiyy.us-east-2.es.amazonaws.com/courses/_search'

    courses = utils.fetch_data(URL, 5, 30)
    if courses != False:
        count = 1
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
                                    "InstructorName": course['creator']['fullName'],
                                    "ProfilePic": course['creator']['imageUrl']}]  if 'creator' in course else None

                    data = {"CourseId": key, "CourseProvider": PROVIDER, "Title": course["name"],
                            "Category": course["category"],
                            "CourseDuration": int(course["duration"].split(' ')[0]),
                            "Paid": True if course["type"] == "paid" else False,
                            "Price": int(str(course["price"]).split(" ")[0]), "PriceCurrency": "USD",
                            "Instructors": instructors,
                            "URL": course["courseUrl"], "Rating": 0, "Description": course["summary"],
                            "CourseImage": course["image"],
                            "StartDate": datetime.strptime(course["startDate"], '%d %b %Y').isoformat().split('T')[
                                0] if "startDate" in course and course["startDate"] is not None else None,
                            "EndDate": datetime.strptime(course["endDate"], '%d %b %Y').isoformat().split('T')[
                                0] if "endDate" in course and course["endDate"] is not None else None,
                            "SelfPaced": course["selfPaced"]}

                    utils.add_data_elastic_search(POST_URL, data)
                except Exception as e:
                    print('[%] Error occured ==>', 'Course Name', course['name'], ':', e)
            else:
                print('[X] Course text not in english', count, '/', total)
            count += 1

        print('Total time taken:', round(time.time() - start, 2), 'sec\n')

if __name__ == "__main__":
    lambda_handler('', '')