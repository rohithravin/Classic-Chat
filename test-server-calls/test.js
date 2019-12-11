const request = require('request');


//REST server information
const restURL = "https://sparge1.fyre.ibm.com:50050"

//Db2 database information
const hostName = "sparge1.fyre.ibm.com"
const port = 50001
const databaseName = "BLUDB"
const databaseUName = "bluadmin"
const databasePassword = "password"

//Token used to authenticate REST calls
var REST_SERVICE_API_TOKEN = ""

var body = {
  "dbParms": {
      "dbHost": hostName,
      "dbName": databaseName,
      "dbPort": port,
      "isSSLConnection": true,
      "username": databaseUName,
      "password": databasePassword
  },
  "expiredTime": '72h'
}


  var options = {
      url: restURL + '/v1/auth',
      method: 'POST',
      headers: {
          'content-type': 'application/json'
      },
      body: JSON.stringify(body),
      rejectUnhauthorized : false,
      strictSSL: false
  }
  request(options, function(err, res, body) {
      console.log(res.statusCode)
       if (res.statusCode == 200) {
           let json = JSON.parse(body);
           console.log('[POST] Aquired New Rest Service Token: ' + `${json.token}`)
           REST_SERVICE_API_TOKEN = json.token



           var body2 = {
            "parameters": {
                    "email": "urcool@who.co"
                },
                "sync": true
          }
           options = {
              url: restURL + '/v1/services/finduser/0.1',
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
              if (res.statusCode == 200) {
                  let json = JSON.parse(body);
                  console.log(json.rowCount)
              }
              console.log(body)
          })




       }
       else{
          console.log('ERROR IN AQUIRING TOKEN. CHECK DATABASE CREDENTIALS.')
       }

  })
