require('dotenv').config()
var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var request = require('request');

//Token used to authenticate REST calls
var REST_SERVICE_API_TOKEN = ""

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/verifyLoginCredentials', function(request, response){
  var login_info = JSON.parse(request.body['login_credentials']);
  console.log('(INFO) POST /verifyLoginCredentials REQUEST: ' , request.body['login_credentials'])

  console.log('(INFO) POST /verifyLoginCredentials RESPONSE: 1');
  return response.json({success:-1});

})

app.post('/createAccount', function(request, response){
  var account_info = JSON.parse(request.body['account_information']);
  console.log('(INFO) POST /createAccount REQUEST: ' , request.body['account_information'])

  console.log('(INFO) POST /verifyLoginCredentials RESPONSE: 1');
  return response.json({success:1, message:'Success!'});

})

function getRestServiceToken() {
  var body = {
    "dbParms": {
        "dbHost": process.env.DB_HOSTNAME,
        "dbName": process.env.DB_DATABASE,
        "dbPort": Number(process.env.DB_PORT),
        "isSSLConnection": true,
        "username": process.env.DB_UID,
        "password": process.env.DB_PWD
    },
    "expiredTime": '72h'
  }
  var options = {
      url: process.env.REST_URL + '/v1/auth',
      method: 'POST',
      headers: {
          'content-type': 'application/json'
      },
      body: JSON.stringify(body),
      rejectUnhauthorized : false,
      strictSSL: false
  }
  request(options, function(err, res, body) {
       if (res.statusCode == 200) {
           let json = JSON.parse(body);
           console.log('[POST] Aquired New Rest Service Token: ' + `${json.token}`)
           REST_SERVICE_API_TOKEN = json.token
       }
       else{
          console.log('ERROR IN AQUIRING TOKEN. CHECK DATABASE CREDENTIALS.')
       }
  })
}

setInterval(getRestServiceToken, 30000);
app.listen(8888, function(){
    console.log("Server is listening on port 8888");
})
