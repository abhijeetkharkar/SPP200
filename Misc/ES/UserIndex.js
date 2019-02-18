{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 2
  },
  "mappings": {
    "user": {
      "properties": {
        "UserId": {
          "type": "text"
        },
        "UserName": {
          "properties": {
            "First": {
              "type": "text"
            },
            "Last": {
              "type": "text"
            }
          }
        },
        "Bio": {
          "type": "text"
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
        "CoursesTaken": {
          "properties": {
            "CourseId": {
              "type": "keyword"
            },
            "WebsiteId": {
              "type": "keyword"
            }
          }
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
        "CoursesClicked": {
          "type": "text",
          "analyzer": "standard"
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
        "NoofPostsCreated": {
          "type": "integer"
        },
        "NoofPostsCommented": {
          "type": "integer"
        },
        "NoofCoursesTaken": {
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