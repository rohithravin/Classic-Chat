require('dotenv').config()
var express=require('express');
var app=express();
var bodyParser=require('body-parser');

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



app.listen(8888, function(){
    console.log("Server is listening on port 8888");
})
