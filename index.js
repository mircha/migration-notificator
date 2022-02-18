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
app.post('/firebase/:uid', function (req, res) {
    var content = req.body;
    const admin = require('firebase-admin')
    const acc = require('./assets/mmt-monitor-firebase-adminsdk-t2ec1-63abca1c1f.json')
    admin.initializeApp({
        credential: admin.credential.cert(acc),
        databaseURL: "https://mmt-monitor-default-rtdb.europe-west1.firebasedatabase.app/"
    })
    var fb = admin.database().ref("migrations/" + uid);
    fb.set(content).then(() => { console.log('Data updated.'); admin.app().delete(); });
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