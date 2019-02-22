// SignUp Controller


exports.addUsers = function(request, response){
    console.log("POST data received is ", request.body)
    response.json({
                    "status" : "success",
                    "body" : "You have reached the SignUp API of Course-Hub"
                  })
}, function(err){
    response.json({
                    "status" : "error",
                    "message" : err
                 })
}