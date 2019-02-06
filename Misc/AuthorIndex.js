{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 2
  },
  "mappings": {
    "authors": {
      "properties": {
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
        "DOB": {
          "type": "date",
          "format": "yyyy-MM-dd"
        },
        "JoiningDate": {
          "type": "date",
          "format": "yyyy-MM-dd"
        },
        "LastLogin": {
          "type": "date",
          "format": "yyyy-MM-dd"
        },
        "CoursesTaught": {
          "type": "text",
          "analyzer": "standard"
        },
        "CoursesCreated": {
          "type": "text",
          "analyzer": "standard"
        },
        "Address": {
          "properties": {
            "Street": {
              "type": "text"
            },
            "City": {
              "type": "keyword"
            },
            "State": {
              "type": "keyword"
            },
            "ZipCode": {
              "type": "keyword"
            }
          }
        },
        "Email": {
          "type": "keyword"
        },
        "PhoneNo": {
          "type": "text"
        },
        "PhotoURL": {
          "type": "text"
        },
        "NoofCoursesCreated": {
          "type": "integer"
        },
        "NoofPostsCommented": {
          "type": "integer"
        },
        "NoofPostsCreated": {
          "type": "integer"
        },
        "NoofCoursesTaught": {
          "type": "integer"
        },
        "Browser": {
          "type": "text"
        },
        "BrowserVersion": {
          "type": "text"
        },
        "Platform": {
          "type": "text"
        },
        "LastLoginIP": {
          "type": "ip"
        }
      }
    }
  }
}