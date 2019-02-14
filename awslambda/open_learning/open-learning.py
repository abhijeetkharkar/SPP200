import nltk
import time
from datetime import datetime
from awslambda.utils import search_data_elastic_search, add_data_elastic_search, fetch_data


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

    courses = fetch_data(URL, 5, 30)
    if courses != False:
        count = 1
        start = time.time()
        total = len(courses)

        for course in courses:
            if is_english(course['name']):

                key = PROVIDER + '-' + generate_key(course['courseUrl'])
                if search_data_elastic_search(SEARCH_URL, { "CourseId" : key }):
                    print('[$] Already Processed', count, '/', total)
                    count += 1
                    continue

                instructors = [{"InstructorId": str(generate_key(course['creator']['profileUrl'])), "InstructorName": course['creator']['fullName'],
                                "ProfilePic": course['creator']['imageUrl']}]

                data = {"CourseId":key, "CourseProvider": PROVIDER, "Title": course["name"], "Category":course["category"],
                                "CourseDuration": int(course["duration"].split(' ')[0]), "Paid": True if course["type"] == "paid" else False,
                                "Price": int(str(course["price"]).split(" ")[0]), "PriceCurrency": "USD", "Instructors": instructors,
                                "URL": course["courseUrl"], "Rating": 0, "Description": course["summary"], "CourseImage": course["image"],
                                "StartDate": datetime.strptime(course["startDate"], '%d %b %Y').isoformat().split('T')[0] if "startDate" in course and course["startDate"] is not None else None,
                                "EndDate": datetime.strptime(course["endDate"], '%d %b %Y').isoformat().split('T')[0] if "endDate" in course and course["endDate"] is not None else None,
                                "SelfPaced": course["selfPaced"]}

                add_data_elastic_search(POST_URL, data)
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