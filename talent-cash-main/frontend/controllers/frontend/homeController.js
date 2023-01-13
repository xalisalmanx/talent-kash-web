//config file
const config = require("../../../config");
var sendSms = require("../../../util/smsApi");

var axios = require('axios');
const dayjs = require("dayjs");
const crypto = require("crypto");

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));



exports.index = async (req, res) => {

  // sendSms('03088814560','this is for testing from node');

  const users = await getRandomUsers();
        
  if(req.query.page > 0){
    var page = req.query.page;
  }
  else{
    var page = 1;
  }
    var axiosConfig = {
        method: 'get',
        url: config.api_base_url+'reels?start='+page+'&limit='+config.limit+'&startDate=ALL&endDate=ALL',
        headers: { 
          'key': config.devKey,
        }
      };
      axios(axiosConfig)
      .then(function (response) {
        var result = response.data;

        if(result.totalReel > config.limit){
          totalPages = Math.round(result.totalReel/config.limit);
        }else{
          totalPages = 1;
        }
        console.log(result.reel);
        
        res.render('index',{title:'Home', reels: result.reel, total: result.totalReel,base_url:config.baseURL,api_base_url:config.api_base_url ,
         pages:totalPages, current :1,users:users.user  });
      })
      .catch(function (error) {
        console.log(error);
      });
};

exports.specificVideo = async (req, res) => {

  // sendSms('03088814560','this is for testing from node');

  const users = await getRandomUsers();
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  if(req.originalUrl.split('/')[1] == 'video')
  {
    var videoId = req.originalUrl.split('/')[2];
  }
  else
  {
    var videoId = '';
  }

  // console.log(videoId);
    if(videoId)
    {
      var axiosConfig = {
          method: 'get',
          url: config.api_base_url+'reels/getSpecificReel?reelId='+videoId,
          headers: { 
            'key': config.devKey,
          }
        };
        axios(axiosConfig)
        .then(function (response) {
          var result = response.data;
          console.log(result);

          if(result.status == true){
            res.render('specific_video',{title:'Video', reels: result.reel, base_url:config.baseURL,api_base_url:config.api_base_url,users:users.user });
          }
          else
          {
            // console.log('no record found');
            res.redirect('/');
          }
        })
        .catch(function (error) {
          //console.log(error);
          res.redirect('/');
        });
    }
};

function getRandomUsers(){
  var userAxiosConfig = {
    method: 'get',
    url: config.api_base_url+'user/getRandomUser',
    headers: { 
      'key': config.devKey,
    },
  };

  return axios(userAxiosConfig)
  .then(function (response) {
    //console.log(JSON.stringify(response.data));
    return response.data;
    
  })
  .catch(function (error) {
        return res.send({ status: false, error: `Server Error` });
    });
}

exports.videos =  (req, res) => {
    res.render('videos');
};

exports.videoDetail =  (req, res) => {
    res.render('video-detail');
};

exports.profile =  (req, res) => {
    res.render('profile');
};

exports.login =  (req, res) => {
    res.render('login');
};

exports.tandc =  (req, res) => {
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  if(req.originalUrl.split('/')[1] == 'app')
  {
    var app_user = 1;//req.originalUrl.split('/')[1];
  }
  else
  {
    var app_user = 0;
  }

  res.render('tandc', { app_user : app_user,title:'Terms and Conditions'} );
};

exports.privacy_policy =  (req, res) => {
  res.render('privacy_policy');
};
exports.about =  (req, res) => {
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  if(req.originalUrl.split('/')[1] == 'app')
  {
    var app_user = 1;//req.originalUrl.split('/')[1];
  }
  else
  {
    var app_user = 0;
  }
  
  //console.log(fullUrl +'--'+app_user);
  res.render('about-us', { app_user : app_user,title:'About Us'} );
};

exports.privacy_policy =  (req, res) => {
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  if(req.originalUrl.split('/')[1] == 'app')
  {
    var app_user = 1;//req.originalUrl.split('/')[1];
  }
  else
  {
    var app_user = 0;
  }
  res.render('privacy_policy', { app_user : app_user,title:'Privacy Policy'} );
};


exports.apple =  (req, res) => {
  
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(
    {
      "applinks": {
        "apps": [],
        "details": [
          {
            "appID": "48UVHF64S6.com.soft.Talent-Cash",
            "paths": [
              "/video/*"
            ]
          }
        ]
      }
    }
  ));


  // return res
  // .status(500)
  // .setHeader('Content-Type', 'application/json')
  // .json({
  //   "applinks": {
  //     "apps": [],
  //     "details": [
  //       {
  //         "appID": "48UVHF64S6.com.soft.Talent-Cash",
  //         "paths": [
  //           "/video/*"
  //         ]
  //       }
  //     ]
  //   }
  // });
};


//For Transporters JAzzCash PAyment//
exports.jazzCashCheckoutForIOS =  (req, res) => {

  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  var amount = req.originalUrl.split('/')[2];
  var coins = req.originalUrl.split('/')[3];
  var userId = req.originalUrl.split('/')[4];

    var pp_Amount = amount;
    var datetime = dayjs();//new Date();
    var pp_TxnDateTime = dayjs().format('YYYYMMDDHHmmss');//'20221129174322';//dayjs().format('YYYYMDHms');
    //to make expiry date and time add one hour to current date and time
    var pp_TxnExpiryDateTime = dayjs().add(60, 'm').format('YYYYMMDDHHmmss');//'20221129184322';//dayjs().add(60, 'm').format('YYYYMDHms');
    var pp_TxnRefNo = 'JCIOS'+pp_TxnDateTime; //for user amount paid transaction id//
    console.log(pp_TxnDateTime +'---'+ pp_TxnExpiryDateTime);
    //console.log(pp_TxnRefNo);
    var post_data = []; // Creating a new array object
    post_data['pp_Version'] = '1.1';
    post_data['pp_TxnType'] = '';
    post_data['pp_Language'] = 'EN';
    post_data['pp_MerchantID'] = 'MC51240';//'22335878'; //live //'MC51240'; //test
    post_data['pp_SubMerchantID'] = '';
    post_data['pp_Password'] = 'xtzy0tyuux'; // '41czx50s9b';//live //'xtzy0tyuux'; //test;
    post_data['pp_BankID'] = 'TBANK';
    post_data['pp_ProductID'] = 'RETL';
    post_data['pp_TxnRefNo'] = pp_TxnRefNo;
    post_data['pp_Amount'] = amount*100;
    post_data['pp_TxnCurrency'] = 'PKR';
    post_data['pp_TxnDateTime'] = pp_TxnDateTime;
    post_data['pp_BillReference'] = 'billRef';
    post_data['pp_Description'] = 'TalentCash Payment';
    post_data['pp_TxnExpiryDateTime'] = pp_TxnExpiryDateTime;
    post_data['pp_ReturnURL'] = 'https://www.talentcash.pk/';//'http://talentcash.pk/';//for sandbox//'https://31c6-2407-aa80-116-cea2-e183-6db2-ebd7-b6a3.ap.ngrok.io/payWithJazzCash';//'http://localhost/loadx-pk/pay_with_jazzcash';//'http://test.loadx.pk/pay_with_jazzcash';
    post_data['pp_SecureHash'] = '';
    post_data['ppmpf_1'] = userId;
    post_data['ppmpf_2'] = '2';
    post_data['ppmpf_3'] = '3';
    post_data['ppmpf_4'] = '4';
    post_data['ppmpf_5'] = '5';
    pp_SecureHash = get_SecureHash(post_data);
    post_data['pp_SecureHash'] = pp_SecureHash;
    console.log(post_data);
    res.render('jazzcash_redirection', { post_data : post_data} );
}

function get_SecureHash(data_array)
{
    //Quick Sort
    const ordered = Object.keys(data_array).sort().reduce(
      (obj, key) => { 
        obj[key] = data_array[key]; 
        return obj;
      }, 
      {}
    );
    //console.log(ordered);
    var str = '';
      for (var key in ordered) {
        var value = ordered[key];
        if(value){
              str = str +'&'+value;
            }
        //console.log(key, value);
      }
      str = 'tw969v88v1'+str; //for test//
      const a = crypto.createHmac('sha256','tw969v88v1').update(str).digest('hex'); // FORTEST

      // str = 'ez2x9g3061'+str; //FOR LIVE
      // const a = crypto.createHmac('sha256','ez2x9g3061').update(str).digest('hex'); //live
      return a ;
}

exports.payWithJazzCash =  (req, res) => {

  // req.body = post_data;
  jazz_data = req.body;
  console.log('umar');
  console.log(req.body);
  if(req.body.pp_ResponseCode == '000')
  {
    res.render('success', { jazz_data : jazz_data} );
  }
  else
  {
    res.render('error');
  }
}

exports.jazzcashSuccess =  (req, res) => {
  res.render('success' );
}

exports.jazzcashError =  (req, res) => {
  res.render('error' );
}
