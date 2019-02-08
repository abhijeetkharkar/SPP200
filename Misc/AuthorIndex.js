{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 2
  },
  "mappings": {
    "authors": {
      "properties": {
        "Address": {
          "properties": {
            "City": {
              "type": "keyword"
            },
            "State": {
              "type": "keyword"
            },
            "Street": {
              "type": "text"
            },
            "ZipCode": {
              "type": "keyword"
            }
          }
        },
        "Bio": {
          "type": "text"
        },
        "Browser": {
          "type": "text"
        },
        "BrowserVersion": {
          "type": "text"
        },
        "Company": {
          "type": "keyword"
        },
        "CoursesCreated": {
          "properties": {
            "CourseId": {
              "type": "keyword"
            },
            "WebsiteId": {
              "type": "keyword"
            }
          }
        },
        "CoursesTaught": {
          "type": "text",
          "analyzer": "standard"
        },
        "DOB": {
          "type": "date",
          "format": "yyyy-MM-dd"
        },
        "Email": {
          "type": "keyword"
        },
        "InstructorId": {
          "type": "text"
        },
        "InstructorName": {
          "properties": {
            "First": {
              "type": "text"
            },
            "Last": {
              "type": "text"
            }
          }
        },
        "JoiningDate": {
          "type": "date",
          "format": "yyyy-MM-dd"
        },
        "LastLogin": {
          "type": "date",
          "format": "yyyy-MM-dd"
        },
        "LastLoginIP": {
          "type": "ip"
        },
        "NoofCoursesCreated": {
          "type": "integer"
        },
        "NoofCoursesTaught": {
          "type": "integer"
        },
        "NoofPostsCommented": {
          "type": "integer"
        },
        "NoofPostsCreated": {
          "type": "integer"
        },
        "PhoneNo": {
          "type": "text"
        },
        "PhotoURL": {
          "type": "text"
        },
        "Platform": {
          "type": "text"
        }
      }
    }
  }
}