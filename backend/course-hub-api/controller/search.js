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
        suggestions['suggestions']=[]
        
        dbsuggestionlist=body['hits']['hits']
        for(index in dbsuggestionlist){
            doc=dbsuggestionlist[index]
            suggestions['suggestions'].push(doc['_source']['Title'])
        }

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