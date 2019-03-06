// //All search Related query
const req = require('request')
const config = require('../config/config.json');


exports.autosuggest = function(request, response){
    var searchterm =request.query.term
    const url=config.elasticsearch.endpoint+'courses/_search'
    const searchquery={  query: {
            multi_match : {
                query : `${searchterm}`,
                fields: ["Title","CourseProvider"],
                fuzziness: "AUTO"
            }
        },
        _source: ["Title"],
        size: 10
    }

    req.post(url,{
        json:searchquery
    }, (error, res, body) => {
        console.log(JSON.stringify(searchquery))
        console.log(`statusCode: ${res.statusCode}`)
        var suggestions={}
        suggestions['suggestions']= []
        var  dict = {}
        suggestioncount=0
        dbsuggestionlist=body['hits']['hits']
        for(index in dbsuggestionlist){
            doc=dbsuggestionlist[index]
            if (dict[doc['_source']['Title'].toLowerCase()]==undefined){
                dict[doc['_source']['Title'].toLocaleLowerCase()]=1
                suggestions['suggestions'].push(doc['_source']['Title'])
                suggestioncount=suggestioncount+1
                if(suggestioncount==5) break;
            }
        }
        console.log(suggestions)
        if (error) {
            console.error(error)
            response.json({
                "status" : res.statusCode,
                "message" : error
             })
        }
        response.json(suggestions)
    })

}