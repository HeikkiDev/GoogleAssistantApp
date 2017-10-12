
const functions = require('firebase-functions');
const firebase = require("firebase");
firebase.initializeApp(functions.config().firebase);

exports.handler = (request, response) => {

    // Using email and password from loginpage.html form, sign in in firebase to obtain user Uid from Firebase Authentication
    // and redirect to REDIRECT_URL with the custom token we just generated (in this case using user Uid)
    firebase.auth().signInWithEmailAndPassword(request.body.email, request.body.password)
        .then(function (firebaseUser) {
            console.log("LOGIN FIREBASE OK!:");
            console.log(firebaseUser.email);
            response.redirect(request.query.redirect_uri + '#access_token=MYACCESSTOKEN' + firebaseUser.uid + '&token_type=bearer&state=' + request.query.state);

        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            response.status(200).send('<br><h2>Login failed</h2><br><br>Email or password incorrect');
        });

};