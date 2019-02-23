// SignUp Controller


exports.addUsers = function(request, response){
    console.log("request received in add users")
    console.log("request method is ", request.method)
    console.log("POST data received is 2 ", request.body)
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