// HomePage Controller


exports.indexpage = function(request, response){
    response.json({
                    "status" : "success",
                    "body" : "You have reached the Home Page of Course-Hub API"
                  })
}, function(err){
    response.json({
                    "status" : "error",
                    "message" : err
                 })
}