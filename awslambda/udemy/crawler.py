# Crawling web page to fetch current data
from lxml import html
import requests
from datetime import datetime
import time


def crawl(url):
    try:
        # Fake Header
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) '\
        'Gecko/20100101 Firefox/20.0'}
        page = requests.get(url, headers=headers)
        tree = html.fromstring(page.content)
    except Exception as e:
        print("Exception occured : ",e)
        return {
                    "price" : None,
                    "duration" : None,
                    "last_update" : None,
                    "category" : None,
                    "description" : None
                }

    # Fetching Data from Crawled Page
    current_price = tree.xpath('//span[@class="price-text__current"]/text()')
    duration = tree.xpath('//span[@class="curriculum-header-length"]/text()')
    last_updated = tree.xpath('//div[@data-purpose="last-update-date"]/text()')
    category = tree.xpath('//meta[@property="udemy_com:category"]/@content')
    # description = tree.xpath('//meta[@name="description"]/@content')
    description = tree.xpath('//div[@class="js-simple-collapse-inner"][@data-purpose="collapse-description-text"]/*')
    
    print ("URL : ", url)
    updatedDescription = ""
    for elem in description:
        if elem.text:
            updatedDescription += elem.text.strip().replace('\n', ' ').replace(u'\xa0', u' ') + " <br /> "

    current_price = None if current_price == [] else float(current_price[1].strip()[1:])
    duration = None if duration == [] else duration[0].strip().split(":")[0]
    category = None if category == [] else [category[0]]
    # description = None if description == [] else description[0]
    
    last_updated = None if last_updated == [] else \
        "{}-{}-{}".format(
                            datetime.strptime(last_updated[0].strip()[13:], "%m/%Y").year,
                            datetime.strptime(last_updated[0].strip()[13:], "%m/%Y").month, 
                            datetime.strptime(last_updated[0].strip()[13:], "%m/%Y").day
                        )
    
    return {
        "price" : current_price,
        "duration" : duration,
        "last_update" : last_updated,
        "category" : category,
        "description" : updatedDescription
    }

# time1 = time.time()
# # print (crawl("https://www.udemy.com/aws-certified-cloud-practitioner/"))
# print (crawl("https://www.udemy.com/complete-python-bootcamp/"))
# time2 = time.time()
# print("Time taken is ", time2-time1)