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

app.post('/createNewChatRoom', function(req, response){
  var userid = JSON.parse(req.body['new_message']);
  console.log('(INFO) POST /createNewChatRoom REQUEST: ' , req.body['new_message'])


  




  console.log('(INFO) POST /createNewChatRoom RESPONSE: 1');
  return response.json({success:1, message:"Chat Group Created!"});

})



app.post('/getUserByID', function(req, response){
  var userid = JSON.parse(req.body['user_id']);
  console.log('(INFO) POST /getUserByID REQUEST: ' , req.body['user_id'])
  var body2 = {
   "parameters": {
           "id": userid
       },
       "sync": true
 }
  var options = {
     url: process.env.REST_URL + '/v1/services/getuserbyid/0.1',
     method: 'POST',
     headers: {
         'content-type': 'application/json',
         'authorization': REST_SERVICE_API_TOKEN
     },
     body: JSON.stringify(body2),
     rejectUnhauthorized : false,
     strictSSL: false
 }

 request(options, function(err, res, body) {
    if (err){
      console.log('(INFO) POST /getUserByID RESPONSE: -3');
      return response.json({success:-3, message:'Server Error.'});
    }
    else if (res.statusCode == 200) {
      let json = JSON.parse(body);
      if (json.rowCount == 1){
        console.log('(INFO) POST /getUserByID RESPONSE: 1');
        return response.json({success:1, message:"User Retrived!", data: json.resultSet});
      }
      else{
        console.log('(INFO) POST /getUserByID RESPONSE: -1');
        return response.json({success:-1, message:"Invalid Credentials"});
      }
    }
    else{
      console.log('(INFO) POST /getUserByID RESPONSE: -4');
      return response.json({success:-4, message:"ERROR"});
    }
 })
})



app.post('/verifyLoginCredentials', function(req, response){
  var login_info = JSON.parse(req.body['login_credentials']);
  console.log('(INFO) POST /verifyLoginCredentials REQUEST: ' , req.body['login_credentials'])

  var body2 = {
   "parameters": {
           "username": login_info.username,
           "password": login_info.password
       },
       "sync": true
 }
  var options = {
     url: process.env.REST_URL + '/v1/services/verifylogin/0.1',
     method: 'POST',
     headers: {
         'content-type': 'application/json',
         'authorization': REST_SERVICE_API_TOKEN
     },
     body: JSON.stringify(body2),
     rejectUnhauthorized : false,
     strictSSL: false
 }

 request(options, function(err, res, body) {
    if (err){
      console.log('(INFO) POST /verifyLoginCredentials RESPONSE: -3');
      return response.json({success:-3, message:'Server Error.'});
    }
    else if (res.statusCode == 200) {
      let json = JSON.parse(body);
      if (json.rowCount == 1){
        console.log('(INFO) POST /createAccount RESPONSE: 1');
        return response.json({success:1, message:"Login Successful!", data: json.resultSet});
      }
      else{
        console.log('(INFO) POST /createAccount RESPONSE: -1');
        return response.json({success:-1, message:"Invalid Credentials"});
      }
    }
    else{
      console.log('(INFO) POST /verifyLoginCredentials RESPONSE: -4');
      return response.json({success:-4, message:json});
    }
 })
})

app.post('/createAccount', function(req, response){

  var account_info = JSON.parse(req.body['account_information']);
  console.log('(INFO) POST /createAccount REQUEST: ' , account_info.first_name)
  var body2 = {
   "parameters": {
           "username": account_info.username
       },
       "sync": true
 }
  var options = {
     url: process.env.REST_URL + '/v1/services/finduser/0.1',
     method: 'POST',
     headers: {
         'content-type': 'application/json',
         'authorization': REST_SERVICE_API_TOKEN
     },
     body: JSON.stringify(body2),
     rejectUnhauthorized : false,
     strictSSL: false
 }
 request(options, function(err, res, body) {
    if (err){
      console.log('(INFO) POST /createAccount RESPONSE: -3');
      return response.json({success:-3, message:'Server Error.'});
    }
     else if (res.statusCode == 200) {
         let json = JSON.parse(body);
         if (json.rowCount == 0){

           var body3 = {
             "parameters": {
                     "firstname": account_info.first_name,
                     "lastname": account_info.last_name,
                     "username": account_info.username,
                     "password": account_info.password
                 },
                 "sync": true
           }
           var options = {
               url: process.env.REST_URL + '/v1/services/adduser/0.1',
               method: 'POST',
               headers: {
                   'content-type': 'application/json',
                   'authorization': REST_SERVICE_API_TOKEN
               },
               body: JSON.stringify(body3),
               rejectUnhauthorized : false,
               strictSSL: false
           }
           request(options, function(err, res, body) {
                if (err) {
                  console.log('(INFO) POST /createAccount RESPONSE: -6');
                  return response.json({success:-6, message:'Server Error.'});
                }
               else if (res.statusCode == 200) {
                   let json = JSON.parse(body);
                   console.log('(INFO) POST /createAccount RESPONSE: 1');
                   return response.json({success:1, message:'Account Created!'});
               }
               else{
                 console.log('(INFO) POST /createAccount RESPONSE: -1');
                 return response.json({success:-1, message:'Error In Adding User to Database.'});
               }
           })
         }
         else{
           console.log('(INFO) POST /createAccount RESPONSE: -2');
           return response.json({success:-2, message:'username Address Is Already Used.'});
         }
     }
     else{
       console.log('(INFO) POST /createAccount RESPONSE: -4');
       return response.json({success:-4, message:body});
     }
 })
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
      if (err) console.log('[ERROR] /getRestServiceToken :'+ err)
        else if (res.statusCode == 200) {
           let json = JSON.parse(body);
           console.log('[POST] Aquired New Rest Service Token: ' + `${json.token}`)
           REST_SERVICE_API_TOKEN = json.token
       }
       else{
          console.log('ERROR IN AQUIRING TOKEN. CHECK DATABASE CREDENTIALS.')
       }
  })
}

setInterval(getRestServiceToken, 15000);

app.listen(8887, function(){
    console.log("Server is listening on port 8887");
})
