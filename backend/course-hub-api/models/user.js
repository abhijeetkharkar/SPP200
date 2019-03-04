var elasticsearch = require('elasticsearch');

index = 'User'
type = 'user'
var elasticClient = new elasticsearch.Client({
    host: 'localhost:3000',
    log: 'trace'
});

async function UserMapping () {
    const schema = {}
    return elasticClient.indices.putMapping({ index, type, body: { properties: schema } })

}

module.exports = {
    elasticClient, index, type
}

module.exports = {
    ping: function(req, res){
        elasticClient.ping({
            requestTimeout: 30000,
        }, function (error) {
            if (error) {
                res.status(500)
                return res.json({status: false, msg: 'Elasticsearch cluster is down!'})
            } else {
                res.status(200);
                return res.json({status: true, msg: 'Success! Elasticsearch cluster is up!'})
            }
        });
    },
};