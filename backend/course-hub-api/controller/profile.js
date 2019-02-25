// Profile Controller

exports.viewProfile = function(request, response){
    console.log("request received in viewProfile");
    console.log("request method is ", request.method);
    response.json({
        "status" : "success",
        "body" : "You have reached the Profile API of Course-Hub"
    })
},
    function(err){
    response.json({
        "status" : "error",
        "message" : err
    })
};