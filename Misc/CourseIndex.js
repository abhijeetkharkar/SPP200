{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 2
  },
  "mappings": {
    "course": {
      "properties": {
        "Category": {
          "type": "text",
          "analyzer": "standard"
        },
        "CourseDuration": {
           "properties": {
            "Value": {
              "type": "integer"
            },
            "Unit": {
              "type": "keyword"
            }
          }
        },
        "CourseId": {
          "type": "keyword"
        },
        "CourseImage": {
          "type": "text"
        },
        "CourseProvider": {
          "type": "text"
        },
        "Description": {
          "type": "text",
          "analyzer": "standard"
        },
        "Difficulty": {
          "type": "text"
        },
        "EndDate": {
          "type": "date",
          "format": "yyyy-MM-dd"
        },
        "last_updated": {
          "type": "date",
          "format": "yyyy-MM-dd"
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
        "Paid": {
          "type": "boolean"
        },
        "Price": {
          "type": "double"
        },
        "PriceCurrency": {
          "type": "text"
        },
        "Rating": {
          "type": "float"
        },
        "SelfPaced": {
          "type": "boolean"
        },
        "StartDate": {
          "type": "date",
          "format": "yyyy-MM-dd"
        },
        "Title": {
          "type": "text",
          "analyzer": "standard"
        },
        "URL": {
          "type": "keyword"
        }
      }
    }
  }
}