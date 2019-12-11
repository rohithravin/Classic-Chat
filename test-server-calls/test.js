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

const body = {
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


function intervalFunc() {
  const options = {
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
       }
       else{
          console.log('ERROR IN AQUIRING TOKEN. CHECK DATABASE CREDENTIALS.')
       }

  })
}

setInterval(intervalFunc, 1500);
