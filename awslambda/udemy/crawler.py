# Crawling web page to find certain parameters
from lxml import html
import requests
from datetime import datetime
import time

def crawl(url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0'}
        page = requests.get(url, headers=headers)
        tree = html.fromstring(page.content)
    except Exception as e:
        print("Exception occured : ",e)
        return {
                    "price" : None,
                    "duration" : None,
                    "last_update" : None,
                    "category" : None
                }

    
    # with open('page_content.html', 'w') as fid:
    #     fid.write(page.content)

    # with open('page_content.html', 'r') as f:
    #     page = f.read()
    # tree = html.fromstring(page)

    # print("current page is ", tree)
    current_price = tree.xpath('//span[@class="price-text__current"]/text()')
    duration = tree.xpath('//span[@class="curriculum-header-length"]/text()')
    last_updated = tree.xpath('//div[@data-purpose="last-update-date"]/text()')
    category = tree.xpath('//meta[@property="udemy_com:category"]/@content')
    if current_price == []:
        current_price = None
        price = None
    else:
        price = float(current_price[1].strip()[1:])
    
    if duration == []:
        duration = None
        course_duration = None
    else:
        course_duration = duration[0].strip().split(":")[0]
    
    if last_updated == []:
        last_updated = None
        course_start_date = None
    else:
        course_last_updated = last_updated[0].strip()[13:]
        course_start_date = datetime.strptime(course_last_updated, "%m/%Y")
        course_start_date = "{}-{}-{}".format(course_start_date.year, course_start_date.month, course_start_date.day)
    
    if category == []:
        category = None
        course_category = []
    else:
        course_category = [category[0]]

    

    # print("\n current price is : ", price)
    # print("\n duration is ", course_duration)
    # print("\n last_update is ", course_start_date)
    # print("\n category is ", category[0])

    return {
        "price" : price,
        "duration" : course_duration,
        "last_update" : course_start_date,
        "category" : course_category
    }

# time1 = time.time()
# print (crawl("https://www.udemy.com/complete-python-bootcamp/"))
# time2 = time.time()
# print("Time taken is ", time2-time1)