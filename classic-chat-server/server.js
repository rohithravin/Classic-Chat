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


app.post('/sendMessage', function(req, response){
  var groupid = JSON.parse(req.body['info']);
  console.log('(INFO) POST /sendMessage REQUEST: ' , groupid)



    var body2 = {
     "parameters": {
             "message": groupid[0],
             "groupid": groupid[1],
             "userid": groupid[2]
         },
         "sync": true
   }

    var options = {
       url: process.env.REST_URL + '/v1/services/addmessagetogroup/0.1',
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
        console.log('(INFO) POST /sendMessage RESPONSE: -3');
        return response.json({success:-3, message:'Server Error.'});
      }
      else if (res.statusCode == 200) {
        let json = JSON.parse(body);
        console.log(json)
        console.log('(INFO) POST /sendMessage RESPONSE: 1');
        return response.json({success:1, message:'Message Sent!'});
      }
      else{
        console.log('(INFO) POST /sendMessage RESPONSE: -4');
        return response.json({success:-4, message:"ERROR"});
      }
   })
})




app.post('/getMessages', function(req, response){
  var groupid = JSON.parse(req.body['groupid']);
  console.log('(INFO) POST /getMessages REQUEST: ' , req.body['groupid'])

  var body2 = {
   "parameters": {
           "group_id": groupid
       },
       "sync": true
 }

  var options = {
     url: process.env.REST_URL + '/v1/services/getmessages/0.1',
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
      console.log('(INFO) POST /getMessages RESPONSE: -3');
      return response.json({success:-3, message:'Server Error.'});
    }
    else if (res.statusCode == 200) {
      let json = JSON.parse(body);
      console.log('(INFO) POST /getMessages RESPONSE: 1');
      return response.json({success:1, message:'Got Messages!', data:json.resultSet});
    }
    else{
      console.log('(INFO) POST /getMessages RESPONSE: -4');
      return response.json({success:-4, message:"ERROR"});
    }
 })
})






app.post('/getRecentMessage', function(req, response){
  var group_ids = JSON.parse(req.body['groupids']);
  console.log('(INFO) POST /getRecentMessage REQUEST: ' , group_ids)
  var list = [];
  var y = 0;
  var x;
  for (x = 0; x < group_ids.length; x++){
     var body2 = {
      "parameters": {
              "groupid": group_ids[x]
          },
          "sync": true
    }
     var options = {
        url: process.env.REST_URL + '/v1/services/getrecentmessage/0.1',
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
        y = y +1
       if (err){
         console.log('(INFO) POST /getRecentMessage RESPONSE: -3');

       }
       else if (res.statusCode == 200) {
         let json = JSON.parse(body);
         if (json.rowCount == 1){
           list.push(json.resultSet[0])
           if (y == group_ids.length){
              if (list.length == group_ids.length){
                console.log('(INFO) POST /getRecentMessage RESPONSE: 1');
                return response.json({success:1, message:"Got Recent Messages!", data: list});
              }
              else{
                console.log('(INFO) POST /getRecentMessage RESPONSE: -1');
                return response.json({success:-1, message:"Couldn't Load Messages!"});
              }
           }
         }
         else{
           console.log('(INFO) POST /getRecentMessage RESPONSE: -10');
         }
       }
       else{
         console.log('(INFO) POST /getRecentMessage RESPONSE: -4');
       }
    })
  }
})

app.post('/getChatRoomsForUser', function(req, response){
  var userid = JSON.parse(req.body['userid']);
  console.log('(INFO) POST /getChatRoomsForUser REQUEST: ' , userid)

  var body2 = {
   "parameters": {
           "userid": userid,
       },
       "sync": true
 }

  var options = {
     url: process.env.REST_URL + '/v1/services/getchatgroups/0.1',
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
      console.log('(INFO) POST /getChatRoomsForUser RESPONSE: -3');
      return response.json({success:-3, message:'Server Error.'});
    }
    else if (res.statusCode == 200) {
      let json = JSON.parse(body);
      console.log('(INFO) POST /getChatRoomsForUser RESPONSE: 1');
      return response.json({success:1, message:"Got Chat Rooms!", data: json.resultSet});
    }
    else{
      console.log('(INFO) POST /verifyLoginCredentials RESPONSE: -4');
      return response.json({success:-1, message:json});
    }
 })


})


app.post('/getUserIDS', function(req, response){
  var usernames = JSON.parse(req.body['usernames']);
  console.log('(INFO) POST /getUserIDS REQUEST: ' , usernames)
  var user_ids = [];
  var x;
  var y = 0;
  for (x = 0; x < usernames.length;x++){
      var body2 = {
       "parameters": {
               "username": usernames[x]
           },
           "sync": true
     }
      var options = {
         url: process.env.REST_URL + '/v1/services/getuserid/0.1',
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
       y = y +1;
        if (err){
          console.log('(INFO) POST /getUserIDS RESPONSE: -3');
        }
        else if (res.statusCode == 200) {
          let json = JSON.parse(body);

          if (json.rowCount == 1){
            user_ids.push(json.resultSet[0].USER_ID)
            if ( y == usernames.length){
              console.log(y)
              console.log(user_ids)
              if (user_ids.length == usernames.length){
                console.log('(INFO) POST /getUserIDS RESPONSE: 1');
                return response.json({success:1, message:"User Ids Retrived!", data: user_ids});
              }
              else{
                console.log('(INFO) POST /getUserIDS RESPONSE: -1');
                return response.json({success:-1, message:"Couldn't get some user ids."});
              }
            }
          }
          else{
            console.log('(INFO) POST /getUserIDS RESPONSE: -10');
          }
        }
        else{
          console.log('(INFO) POST /getUserIDS RESPONSE: -4');
        }
     })
  }
})

app.post('/createNewChatRoom', function(req, response){
  var new_message = JSON.parse(req.body['new_message']);
  console.log('(INFO) POST /createNewChatRoom REQUEST: ' , req.body['new_message'])

  var body2 = {
   "parameters": {
           "groupname": new_message.groupname
       },
       "sync": true
 }
  var options = {
     url: process.env.REST_URL + '/v1/services/findgroupname/0.1',
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
      console.log('(INFO) POST /createNewChatRoom RESPONSE: -3');
      return response.json({success:-3, message:'Server Error.'});
    }
    else if (res.statusCode == 200) {
      let json = JSON.parse(body);
      if (json.rowCount == 0){
        var is_groupchat = 0
        if (new_message.usernames.length >2){
          is_groupchat = 1
        }

        var body3 = {
         "parameters": {
                 "groupname": new_message.groupname,
                 "isgroupchat": is_groupchat
             },
             "sync": true
       }
        var options2 = {
           url: process.env.REST_URL + '/v1/services/creategroup/0.1',
           method: 'POST',
           headers: {
               'content-type': 'application/json',
               'authorization': REST_SERVICE_API_TOKEN
           },
           body: JSON.stringify(body3),
           rejectUnhauthorized : false,
           strictSSL: false
       }

       request(options2, function(err, res, body) {
          if (err){
            console.log('(INFO) POST /createNewChatRoom RESPONSE: -10');
            return response.json({success:-3, message:'Server Error.'});
          }
          else if (res.statusCode == 200) {
            let json = JSON.parse(body);
            if (res.statusCode == 200){
              console.log("Group Chat Created")
              var body4 = {
               "parameters": {
                       "groupname": new_message.groupname
                   },
                   "sync": true
             }
              var options3 = {
                 url: process.env.REST_URL + '/v1/services/getgroupid/0.1',
                 method: 'POST',
                 headers: {
                     'content-type': 'application/json',
                     'authorization': REST_SERVICE_API_TOKEN
                 },
                 body: JSON.stringify(body4),
                 rejectUnhauthorized : false,
                 strictSSL: false
             }

             request(options3, function(err, res, body) {
                if (err){
                  console.log(err)
                  console.log('(INFO) POST /createNewChatRoom RESPONSE: -20');
                  return response.json({success:-3, message:'Server Error.'});
                }
                else if (res.statusCode == 200) {
                  let json2 = JSON.parse(body);
                  if (json.rowCount == 1){
                      console.log(json2.resultSet[0].GROUP_ID)
                      console.log(new_message.usernames)
                      var y =0;
                      var list = []
                      var x;
                      for (x = 0; x < new_message.usernames.length; x++ ){

                        var body5 = {
                         "parameters": {
                                 "groupid": json2.resultSet[0].GROUP_ID,
                                 "userid" : new_message.usernames[x]
                             },
                             "sync": true
                        }
                        var options5 = {
                           url: process.env.REST_URL + '/v1/services/addusertogroup/0.1',
                           method: 'POST',
                           headers: {
                               'content-type': 'application/json',
                               'authorization': REST_SERVICE_API_TOKEN
                           },
                           body: JSON.stringify(body5),
                           rejectUnhauthorized : false,
                           strictSSL: false
                        }

                        request(options5, function(err, res, body) {
                          y = y +1
                          if (err){
                            console.log('(INFO) POST /createNewChatRoom RESPONSE: -3');
                          }
                          else if (res.statusCode == 200) {
                            let json = JSON.parse(body);
                            list.push(0)
                            if (y == new_message.usernames.length){
                                if (new_message.usernames.length == list.length){
                                  console.log(new_message.usernames[new_message.usernames.length-1])
                                  console.log(new_message.message)
                                  var body22 = {
                                   "parameters": {
                                       "groupid": json2.resultSet[0].GROUP_ID,
                                       "userid" : new_message.usernames[new_message.usernames.length-1],
                                       "message": new_message.message

                                       },
                                       "sync": true
                                 }
                                  var options11 = {
                                     url: process.env.REST_URL + '/v1/services/addmessagetogroup/0.1',
                                     method: 'POST',
                                     headers: {
                                         'content-type': 'application/json',
                                         'authorization': REST_SERVICE_API_TOKEN
                                     },
                                     body: JSON.stringify(body22),
                                     rejectUnhauthorized : false,
                                     strictSSL: false
                                 }

                                 request(options11, function(err, res, body) {
                                    if (err){
                                      console.log('(INFO) POST /createNewChatRoom RESPONSE: -33');
                                      return response.json({success:-33, message:'Server Error.'});
                                    }
                                    else if (res.statusCode == 200) {
                                      console.log('(INFO) POST /createNewChatRoom RESPONSE: 1');
                                      return response.json({success:1, message:'New Group Chat Created!'});
                                    }
                                    else{
                                      console.log('(INFO) POST /createNewChatRoom RESPONSE: -43');

                                      console.log(body)
                                      return response.json({success:-43, message:"ERROR"});
                                    }
                                 })
                                }
                                else{
                                  console.log('(INFO) POST /createNewChatRoom RESPONSE: -21');
                                  return response.json({success:-21, message:'Couldn\'t add user to group'});
                                }
                            }
                          }
                          else{
                            console.log('(INFO) POST /createNewChatRoom RESPONSE: -4');
                          }
                        })

                      }

                  }
                  else{
                    console.log('(INFO) POST /createNewChatRoom RESPONSE: -21');
                    return response.json({success:-1, message:"Invalid Credentials"});
                  }
                }
                else{
                  console.log('(INFO) POST /createNewChatRoom RESPONSE: -24');
                  return response.json({success:-4, message:"ERROR"});
                }
             })















            }
            else{
              console.log('(INFO) POST /createNewChatRoom RESPONSE: -9');
              return response.json({success:-1, message:body});
            }
          }
          else{
            console.log('(INFO) POST /createNewChatRoom RESPONSE: -8');
            return response.json({success:-4, message:"ERROR"});
          }
       })






      }
      else{
        console.log('(INFO) POST /createNewChatRoom RESPONSE: -1');
        return response.json({success:-1, message:"Group Name Already Exits."});
      }
    }
    else{
      console.log('(INFO) POST /createNewChatRoom RESPONSE: -4');
      return response.json({success:-4, message:"ERROR"});
    }
 })

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
      return response.json({success:-4, message:res});
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

setInterval(getRestServiceToken, 120000);

app.listen(8887, function(){
    console.log("Server is listening on port 8887");
})
