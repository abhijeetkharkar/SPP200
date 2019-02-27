// SignUp Controller
var app = require('../app')


exports.addUsers = function(request, response){
    console.log("request received in add users")
    console.log("request method is ", request.method)
    console.log("POST data received is 2 ", request.body)

    // Check wheather all the parameters are non empty

    // Check password & confirm password is matching

    // TODO: Create the Profile in Elastic Search

    app.firebase.auth().createUserWithEmailAndPassword(request.body.email, request.body.password)
    .then(function(){
        app.firebase.auth().signInWithEmailAndPassword(request.body.email, request.body.password)
        .then(function(){
            var user = app.firebase.auth().currentUser;
            user.updateProfile({
              displayName: request.body.firstname,
            }).then(function() {
              console.log('Display aNAME UPdated')
              app.firebase.auth().signOut()
                .then(function(){
                    console.log('Successfully SignOout')
                })
                .catch(function(err){

                })
            }).catch(function(error) {
              // An error happened.
            });                
        });
        // console.log('CURRENT USER EMAIL ID IS ', user.email);
        output.message = 'User Succesfully registered'
        response.render('login', output);
    })
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        

        output.message = errorCode

        response.render('login', output);
    });

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