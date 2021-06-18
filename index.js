var express = require('express');
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser')
var app = express();
var request = require('request')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})
app.post('/webhook/teamsHCNew', function (req, res) {
    var content = req.body;
    hcNotifications(content).then(response => {
        res.send(response)
    })
});
function hcNotifications(content) {
    return new Promise(function (resolve, reject) {
        request.post(`${content.url}`, {
            'content-type': 'application/json',
            body: content,
            json: true
        }, function (error, response, body) {
            console.log(body)
            var response = body
            if (response == 1) {
                resolve('success')
            } else {
                reject(body)
            }
        })
    })
}
app.listen(port, function () {
    //console.log(`Example app listening on port !`);
});