{
  "settings": {
  "number_of_shards": 3,
      "number_of_replicas": 2,
      "analysis": {
    "analyzer": {
      "ngram_tokenizer_analyzer": {
        "type": "custom",
            "tokenizer": "ngram_tokenizer"
      }
    },
    "tokenizer": {
      "ngram_tokenizer": {
        "type": "ngram",
            "min_gram": 3,
            "max_gram": 6,
            "token_chars": [
          "letter",
          "digit"
        ]
      }
    }
  }
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
            "term_vector": "yes",
            "analyzer": "ngram_tokenizer_analyzer"
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
            "term_vector": "yes",
            "analyzer": "ngram_tokenizer_analyzer"
      },
      "URL": {
        "type": "keyword"
      }
    }
  }
}
}