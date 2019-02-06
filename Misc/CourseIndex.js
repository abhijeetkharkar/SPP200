{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 2
  },
  "mappings": {
    "course": {
      "properties": {
        "CourseId": {
          "type": "keyword"
        },
        "CourseProvider": {
          "type": "text"
        },
        "Title": {
          "type": "text",
          "analyzer": "standard"
        },
        "Category": {
          "type": "text",
          "analyzer": "standard"
        },
        "CourseDuration": {
          "type": "integer"
        },
        "Paid": {
          "type": "boolean"
        },
        "Price": {
          "type": "double"
        },
        "PriceCurrency": {
          "type": "text"
        },
        "Instructors": {
          "properties": {
            "InstructorId": {
              "type": "keyword"
            },
            "InstructorName": {
              "type": "text"
            },
            "ProfilePic": {
              "type": "text"
            }
          }
        },
        "URL": {
          "type": "keyword"
        },
        "Rating": {
          "type": "integer"
        },
        "Description": {
          "type": "text",
          "analyzer": "standard"
        },
        "CourseImage": {
          "type": "text"
        },
        "StartDate": {
          "type": "date",
          "format": "yyyy-MM-dd"
        },
        "EndDate": {
          "type": "date",
          "format": "yyyy-MM-dd"
        },
        "SelfPaced": {
          "type": "boolean"
        }
      }
    }
  }
}