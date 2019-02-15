import time
from datetime import datetime
from awslambda import utils


def lambda_handler(POST_URL, SEARCH_URL):
    PROVIDER = 'Iversity'
    URL = 'https://iversity.org/api/v1/courses'

    courses = utils.fetch_data(URL, 5, 30)
    if courses != False:
        count = 1
        add_count = 0
        start = time.time()
        total = len(courses)

        for course in courses:
            if 'Eng' in course['language']:
                key = PROVIDER + '-' + str(course['id'])

                if utils.search_data_elastic_search(SEARCH_URL, {"CourseId": key}):
                    print('[$] Already Processed', count, '/', total)
                    count += 1
                    continue

                instructors = [{"InstructorId": ins['id'], "InstructorName": ins['name'], "ProfilePic": ins['image']}
                               for ins in course['instructors']] if 'instructors' in course else None

                data = ({"CourseId": key, "CourseProvider": PROVIDER, "Title": course["title"],
                         "Category": course["discipline"],
                         "CourseDuration": int(course["duration"]) if len(course["duration"]) != 0 else None,
                         "Paid": True if course["verifications"][0]['price'] is not None else False,
                         "Price": int(course["verifications"][0]['price'].split(" ")[0]) if course["verifications"][0][
                                                                                                "price"] is not None else None,
                         "PriceCurrency": "Euro", "Instructors": instructors,
                         "URL": course["url"], "Rating": 0, "Description": course["description"],
                         "CourseImage": course["image"],
                         "StartDate":
                             datetime.strptime(course["start_date"].split('T')[0], '%Y-%m-%d').isoformat().split('T')[
                                 0] if "start_date" in course and course["start_date"] is not None else None,
                         "EndDate":
                             datetime.strptime(course["end_date"].split('T')[0], '%Y-%m-%d').isoformat().split('T')[
                                 0] if "end_date" in course and course["end_date"] is not None else None,
                         "SelfPaced": None})

                utils.add_data_elastic_search(POST_URL, data)
                add_count += 1
            else:
                print('[X] Course text not in english', count, '/', total)
            count += 1

        print("\nCourse Catalog Update Complete")
        print("Total Courses Fetch:", total)
        print("Total Courses Added:", add_count)
        print('Total time taken:', round(time.time() - start, 2), 'sec\n')

        return True

if __name__ == '__main__':
    exit(lambda_handler('https://search-coursehub-mmrw23yio2a4ylx2cgmx34eiyy.us-east-2.es.amazonaws.com/courses/course',
                        'https://search-coursehub-mmrw23yio2a4ylx2cgmx34eiyy.us-east-2.es.amazonaws.com/courses/_search'))