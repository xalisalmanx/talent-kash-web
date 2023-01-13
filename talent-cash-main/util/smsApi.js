
var axios = require('axios');
module.exports = (number,text) => {

    var APIKey = '9313a09c261bef2c820b8ce8c345c2dc';
    var receiver = number;
    var sender = '8583';
    var textmessage = text;

    var config = {
    method: 'get',
    url: 'https://api.veevotech.com/sendsms?hash='+APIKey+'&receivenum='+receiver+'&sendernum='+sender+'&textmessage='+textmessage,
    headers: { }
    };

    axios(config)
    .then(function (response) {
    //console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
    console.log(error);
    });
}
