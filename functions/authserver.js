
var fs = require('fs');

exports.handler = (request, response) => {
    
    // Replace REDIRECT_URI and STATE in html form with values provides by Google Assistant, and then show loginpage.html to user
    // Before use this Login form, we need enable 'Email and Password' Authentication in Firebase, and create the user with 'Add User' button
    fs.readFile('./loginpage.html', 'utf8', function (err, html) {
        if (err)
            response.status(400).send(err);
        else {
            var finalHtml = html.replace(/-REDIRECT_URI-/g, request.query.redirect_uri)
                                .replace(/-STATE-/g, request.query.state);
            response.status(200).send(finalHtml);
        }
    });

};