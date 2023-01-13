// const Notification = require("../notification/notification.model");
const User = require("../user/user.model");
// const Reel = require("../reels/reels.model");
// const Booking = require("../booking/booking.model");
const OrderCoin = require("./orderCoin.model");
const payProToken = require("./payProToken.model");
const Wallet = require("../wallet/wallet.model");
const dayjs = require("dayjs");
const crypto = require("crypto");

const axios = require("axios");
//FCM node
var FCM = require("fcm-node");
var config = require("../../config");
var fcm = new FCM(config.SERVER_KEY);

//create new order for purchase coins
exports.createOrder = async (req, res) => {
    try {
      if (!req.body.userId || !req.body.coins ||  !req.body.amount)
        return res
          .status(200)
          .json({ status: false, message: "Invalid details !" });
  
      const user = await User.findById(req.body.userId);
      if(!user)
        return res
          .status(200)
          .json({ status: false, message: "user not found !" });

      const Last_Order_Record = await OrderCoin.find().sort({ $natural: -1 }).limit(1);
        if(!Last_Order_Record[0] || !Last_Order_Record[0].order_id)
        {
          var order_id = 'TalentCashTest-'+'1'.padStart(5, '0');//first order id in case of no order id available
        }
        else
        {
          var last_order_id = Last_Order_Record[0].order_id.split("-");
          var inv_val = parseInt(last_order_id[1]) + 1;
          var order_id = 'TalentCashTest-'+inv_val.toString().padStart(5, '0');
        }

        var order_date = dayjs().format('DD/MM/YYYY');
        var due_date = dayjs().add(1, 'M').format('DD/MM/YYYY');
        var order_datetime = dayjs().format('DD/MM/YYYY, h:mm A');

        const order = new OrderCoin();
        order.userId = user._id;
        order.order_id = order_id;
        order.coins = req.body.coins;
        order.amount = req.body.amount;
        order.order_date = order_date;
        order.order_due_date = due_date;
        order.order_datetime = order_datetime;
        order_result = await order.save();
        //console.log(order_result);

      //user info
      const user_info = [];
      user_info.user_name = user.name;
      user_info.user_phone =  '0'+user.user_phone;
      user_info.email =  user.email;

      //process.exit();
      const result  = await payProCreateOrder(order, user_info, req, res);
      //console.log(result[0].Status );
      if(result[0].Status == 00)
      {
        //callBack url//
        var fullUrl = req.protocol + '://' + req.get('host') + '/orderCoin/payProResponse';
        var callbackurl = result[1].Click2Pay+'&callback_url='+fullUrl;
        order.Click2Pay = callbackurl;
        order.payProId = result[1].PayProId;
        order.payProInvURL = result[1].BillUrl;
        order.ConnectPayFee = result[1].PayProFee;
        //update order record
        await order.save();

        return res
          .status(200)
          .json({ status: true, message: " order successfully created !" , click2Pay: callbackurl , payProStatus : result[0].Status,  
          PayProId:result[1].PayProId, orderDate:result[1].Created_on , order_id: result[1].OrderNumber ,  result });
      }
      else if(result[0].Status == 01)
      {
        return res
          .status(200)
          .json({ status: false, message: "same order already created ! Please change order id" , result });
      }
      else
      {
        return res
          .status(200)
          .json({ status: false, message: "something went wrong" , result });
      }
    } catch (error) {
      //console.log(error);
      return res
        .status(500)
        .json({ status: false, error: error.message || "Server Error" });
    }
};

//For PayPro order creation API
const payProCreateOrder = async (order_detail, user_info, data_, res) => {
    
    //console.log(user_info.user_name +'--'+user_info.user_phone);
    //process.exit();
    //await payProToken.deleteOne();
    //const payProResult = await payProToken.find().sort({ $natural: -1 }).limit(1);
      checkAuthResult  = await checkAuth(data_, res);//create new token
      if(checkAuthResult)
      {
        token = checkAuthResult;
      }
      else
      {
        checkAuthResultResult = [{}];
        return checkAuthResultResult;
        //return res.send({ status: false, error: `Server Error` });
      }
    
    var data = JSON.stringify([
      {
        "MerchantId": "Talent_Cash"
      },
      {
        "OrderNumber": order_detail.order_id,
        "OrderAmount": order_detail.amount,
        "OrderDueDate": order_detail.order_due_date,
        "OrderType": "Service",
        "IssueDate": order_detail.order_date,
        "OrderExpireAfterSeconds": "0",
        "CustomerName": user_info.user_name,//"M Umar",
        "CustomerMobile": "",//"03238881054",
        "CustomerEmail": "",
        "CustomerAddress": "",
      }
    ]);

    var config = {
      method: 'post',
      // url: 'https://demoapi.paypro.com.pk/v2/ppro/co', //for demo
      url: 'https://api.PayPro.com.pk/v2/ppro/co', //for live
      headers: { 
        'Token': token, 
        'Content-Type': 'application/json'
      },
      data : data
    };

    return axios(config)
    .then(function (response) {
      //console.log(JSON.stringify(response.data));
      return response.data;
      
    })
    .catch(function (error) {
          return res.send({ status: false, error: `Server Error` });
      });
};


// ------------- Generate Token By PostMan--------------- //
const checkAuth = async (req, res) => {
  try {
        var data = JSON.stringify({
          // for demo//
          // "clientid": "wIDslNVla5P5aOv",
          // "clientsecret": "j8r6QfRYbmFzfSO"

          //For Live//
          "clientid": "D4gfXskcUh8eNhd",
          "clientsecret": "N1Ow0VKfj43dNXP"
        });
        var config = {
          method: 'post',
          // url: 'https://demoapi.paypro.com.pk/v2/ppro/auth', //for demo
          url: 'https://api.PayPro.com.pk/v2/ppro/auth', //for live
          headers: {
            'Content-Type': 'application/json'
          },
          data : data
        };
        return axios(config)
        .then(function (response) {

          console.log(JSON.stringify(response.data));
          console.log(JSON.stringify(response.headers.token));
          result = JSON.stringify(response.data);
          if(result && result === '"Authorized"')
          {
            // return res.json({
            //   status: true,
            //   token: response.headers.token,
            // });
              return response.headers.token;
          }
          else
          {
            // return res.send({
            //   status: false,
            //   token: '',
            // });
            var result = '';
            return result;
          }
          
        })
        .catch(function (error) {
          //console.log(error);
          // return res.send({
          //   status: false,
          //   token: '',
          // });
          var result = '';
          return result;
        });
      }
    catch (error) {
      return res.status(500).json({
        status: false,
        error: error.message || "Internal Server Error !",
      });
    }
}
// ------------- End Generate Token --------------- //

// ----- Call Back Url API for Status update ------- //
exports.callBackAPIforPayProResponse = async (req, res) => {
  try {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    var url = new URL(fullUrl);
    var status = url.searchParams.get("status");
    var orderId = url.searchParams.get("ordId");
    var msg = url.searchParams.get("msg");
    //get payProid Result from db//
    const orderCoin = await OrderCoin.findOne({payProId: orderId});
    if(status && status === 'Success' && orderCoin.payment_status == "0")
    {
      const user = await User.findById(orderCoin.userId);
      // console.log(user);
      // console.log(status +'--'+orderId +'--'+msg);
      orderCoin.order_status = 2; //complete
      orderCoin.payment_status = 1; //paid
      orderCoin.order_paydate = dayjs().format('DD/MM/YYYY, h:mm A'); //pay date time
      orderCoin.save();
      //console.log(orderCoin);

      //update walledt record
      const wallet = new Wallet();
      wallet.userId = user._id;
      wallet.type = 2;
      wallet.coin = orderCoin.coins;
      wallet.date = new Date().toLocaleString("en-US");
      await wallet.save();

      //add coin in users account //
      user.coin = parseInt(orderCoin.coins) + user.coin;
      //console.log(user.coin);
      await user.save();

      return res
      .status(200)
      .json({ status: true, message: "Payment done Successfully !"});
    }
    else
    {
      return res
      .status(200)
      .json({ status: false, message: "Something went wrong !"});
    }
    
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
// ------------- End Call Back Url API --------------- //

// ----- Get All Histroy ------- //
exports.coinsHistroy = async (req, res) => {
  try {
    const start = req.query.start ? parseInt(req.query.start) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    if (!req.query.userId)
      return res
        .status(200)
        .json({ status: false, message: "user Id Required !" });

      const user = await User.findById(req.query.userId);
      if (!user)
      return res
          .status(200)
          .json({ status: false, message: "user not exists !" });

      const orderCoin = await OrderCoin.find({
        $and: [
          {
            userId: user._id, 
            order_status: 2, //for completed
            payment_status: 1, 
            isDelete: false, // if not dleeted invoice
          },
        ],
      })
    .limit(limit)
    .skip(start * limit);

    const totalCount = await OrderCoin.find( {
      userId: user._id, 
      order_status: 2, //for completed
      payment_status: 1, 
      isDelete: false, // if not dleeted invoice
    }).count();

    //res.send(userInvoice);
    // if (!orderCoin || orderCoin.length == 0)
    //return res.status(200).json({ status: false, message: "No data found!" });

    return res.status(200).json({ status: true, message: "Success!!", orderCoin , totalCount : totalCount});
    
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// ------------- End Get All Histroy --------------- //

// ----- Get Coin Inv Detail ------- //
exports.coinRechargeDetail = async (req, res) => {
  try {

    if (!req.query.userId || !req.query.orderId)
      return res
        .status(200)
        .json({ status: false, message: "invalid details !" });


      const user = await User.findById(req.query.userId);
      if (!user)
      return res
          .status(200)
          .json({ status: false, message: "user not exists !" });

      const coinDetails = await OrderCoin.find({
        $and: [
          {
            order_id: req.query.orderId,
            isDelete: false, // if not dleeted invoice
          },
        ],
      });

    //res.send(userInvoice);
    if (!coinDetails[0])
    return res.status(200).json({ status: false, message: "No data found!" });

    return res.status(200).json({ status: true, message: "Success!!", coinDetails : coinDetails[0] });
    
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// ------------- End Coin invoice  --------------- //


// ------------- Mark Order As Paid --------------//

//create new order for purchase coins
exports.markOrderAsPaid = async (req, res) => {
  try {
    if (!req.query.username || !req.query.password ||  !req.query.csvinvoiceids )
      return res
        .status(200)
        .json([{ StatusCode: "01", Description: "Invalid Data" }]);

      const userName = req.query.username;
      const password = req.query.password;
    //for demo account

    if(userName != 'Talent_Cash' || password != 'Demo@cash22')//for demo
    //if(userName != 'Talent_Cash' || password != 'Live@cash22')//for Live
      return res
        .status(200)
        .json([{ StatusCode: "02", Description: "Service Failed. User is not Authorized for this service" }]);


    //let count = 0;
    var mystr = req.query.csvinvoiceids;

    //Splitting it with : as the separator
    var newArr = mystr.split(",");
    //console.log(newArr);
    //console.log(newArr.length);
    var result = [];
    for (let i = 0; i < newArr.length; i++) 
    {
        const orderCoin = await OrderCoin.findOne({order_id: newArr[i]});
        if(orderCoin && orderCoin.payment_status == "0")
        {
          const user = await User.findById(orderCoin.userId);
          
          orderCoin.order_status = 2; //complete
          orderCoin.payment_status = 1; //paid
          orderCoin.order_paydate = dayjs().format('DD/MM/YYYY, h:mm A'); //pay date time
          orderCoin.save()

          //update walledt record
          const wallet = new Wallet();
          wallet.userId = user._id;
          wallet.type = 2;
          wallet.coin = orderCoin.coins;
          wallet.date = new Date().toLocaleString("en-US");
          await wallet.save();

          //add coin in users account //
          user.coin = parseInt(orderCoin.coins) + user.coin;
          //console.log(user.coin);
          await user.save();


          result.push({StatusCode: '00', Description: "Invoice successfully marked as paid" , InvoiceID:newArr[i]});
        }
        else if(orderCoin && orderCoin.payment_status == "1")
        {
          result.push({StatusCode: '03', Description: "Invoice already marked as paid" , InvoiceID:newArr[i]});
        }
        else
        {
          result.push({StatusCode: '03', Description: "No Record Found" , InvoiceID:newArr[i]});
        }

    }
    
      //console.log(result);

      return res
        .status(200)
        .json(result);
        //.json([{ StatusCode: '00', Description: "Invoice successfully marked as paid" , InvoiceID:req.query.csvinvoiceids}]);
  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json({ StatusCode: "02", Description: "Server Error" });
  }
};

exports.markOrderAsPaidForJazzcash = async (req, res) => {
  try {
    if (!req.body.userId || !req.body.coins ||  !req.body.amount ||  !req.body.transaction_id)
      return res
        .status(200)
        .json([{ status: false, Description: "Invalid Data" }]);
      
    const user = await User.findById(req.body.userId);
    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "user not exists !" });

    const transaction_id = req.body.transaction_id;

    const transaction_record = await OrderCoin.find({ transaction_id : transaction_id }).countDocuments();
    if (transaction_record > 0)
      return res
        .status(200)
        .json({ status: false, message: "same transaction already exists !" });

    const Last_Order_Record = await OrderCoin.find().sort({ $natural: -1 }).limit(1);
    if(!Last_Order_Record[0] || !Last_Order_Record[0].order_id)
    {
      var order_id = 'TalentCashTest-'+'1'.padStart(5, '0');//first order id in case of no order id available
    }
    else
    {
      var last_order_id = Last_Order_Record[0].order_id.split("-");
      var inv_val = parseInt(last_order_id[1]) + 1;
      var order_id = 'TalentCashTest-'+inv_val.toString().padStart(5, '0');
    }

    var order_date = dayjs().format('DD/MM/YYYY');
    var due_date = dayjs().add(1, 'M').format('DD/MM/YYYY');
    var order_datetime = dayjs().format('DD/MM/YYYY, h:mm A');
    
    const order = new OrderCoin();
    order.userId = req.body.userId;
    order.order_id = order_id;
    order.coins = req.body.coins;
    order.transaction_id = req.body.transaction_id;
    order.amount = req.body.amount;
    order.order_date = order_date;
    order.order_due_date = due_date;
    order.order_datetime = order_datetime;
    order.order_status = 2; //complete
    order.payment_status = 1; //paid
    order.order_paydate = dayjs().format('DD/MM/YYYY, h:mm A'); //pay date time
    order_result = await order.save();

    //update wallet record
    const wallet = new Wallet();
    wallet.userId = user._id;
    wallet.type = 2;
    wallet.coin = order.coins;
    wallet.date = new Date().toLocaleString("en-US");
    await wallet.save();

    //add coin in users account //
    user.coin = parseInt(order.coins) + user.coin;
    //console.log(user.coin);
    await user.save();

    return res
        .status(200)
        .json({ status: true, message: "Invoice successfully marked as paid" });
    
  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json({ StatusCode: "02", Description: "Server Error" });
  }
};

exports.jazzCashSecureHashForIOS_old = async (req, res) => {
  try {
    if (!req.body.userId || !req.body.coins ||  !req.body.amount || !req.body.phone || !req.body.app_type)
      return res
        .status(200)
        .json([{ status: false, Description: "Invalid Data" }]);
      
    const user = await User.findById(req.body.userId);
    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "user not exists !" });
        var phone_no = req.body.phone;
        var pp_Amount = req.body.amount;
        var app_type = req.body.app_type;
        console.log(user._id);
        var datetime = dayjs();//new Date();
        var pp_TxnDateTime = dayjs().format('YYYYMMDDHHmmss');//'20221129174322';//dayjs().format('YYYYMDHms');
        //to make expiry date and time add one hour to current date and time
        var pp_TxnExpiryDateTime = dayjs().add(60, 'm').format('YYYYMMDDHHmmss');//'20221129184322';//dayjs().add(60, 'm').format('YYYYMDHms');
        if(app_type == 'android'){
          var pp_TxnRefNo = 'JCA'+pp_TxnDateTime; //for user amount paid transaction id//
        }
        else if(app_type == 'ios'){
          var pp_TxnRefNo = 'JCIOS'+pp_TxnDateTime; //for user amount paid transaction id//
        }
        
        console.log(pp_TxnDateTime +'---'+ pp_TxnExpiryDateTime);
        //console.log(pp_TxnRefNo);
        var post_data = []; // Creating a new array object
        post_data['pp_Version'] = '1.1';
        post_data['pp_TxnType'] = 'MWALLET';
        post_data['pp_Language'] = 'EN';
        post_data['pp_MerchantID'] = '22335878'; //live //'MC51240'; //test
        post_data['pp_SubMerchantID'] = '';
        post_data['pp_Password'] = '41czx50s9b';//live //'xtzy0tyuux'; //test;
        post_data['pp_BankID'] = 'TBANK';
        post_data['pp_ProductID'] = 'RETL';
        post_data['pp_TxnRefNo'] = pp_TxnRefNo;
        post_data['pp_Amount'] = pp_Amount*100;
        post_data['pp_TxnCurrency'] = 'PKR';
        post_data['pp_TxnDateTime'] = pp_TxnDateTime;
        post_data['pp_BillReference'] = 'billRef';
        post_data['pp_Description'] = 'TalentCash Payment';
        post_data['pp_TxnExpiryDateTime'] = pp_TxnExpiryDateTime;
        post_data['pp_ReturnURL'] = 'https://www.talentcash.pk/';//'http://talentcash.pk/';for sandbox////'http://localhost/loadx-pk/pay_with_jazzcash';//'http://test.loadx.pk/pay_with_jazzcash';
        post_data['pp_SecureHash'] = '';
        post_data['ppmpf_1'] = phone_no;
        post_data['ppmpf_2'] = user._id;
        post_data['ppmpf_3'] = '3';
        post_data['ppmpf_4'] = '4';
        post_data['ppmpf_5'] = '5';
        pp_SecureHash = get_SecureHash(post_data);
        post_data['pp_SecureHash'] = pp_SecureHash;
        postData = []
        postData.push({
          pp_Version: post_data['pp_Version'],
          pp_TxnType: post_data['pp_TxnType'],
          pp_Language: post_data['pp_Language'],
          pp_MerchantID: post_data['pp_MerchantID'],
          pp_SubMerchantID: post_data['pp_SubMerchantID'],
          pp_Password: post_data['pp_Password'],
          pp_BankID: post_data['pp_BankID'],
          pp_ProductID: post_data['pp_ProductID'],
          pp_TxnRefNo: post_data['pp_TxnRefNo'],
          pp_Amount: post_data['pp_Amount'],
          pp_TxnCurrency: post_data['pp_TxnCurrency'],
          pp_TxnDateTime: post_data['pp_TxnDateTime'],
          pp_BillReference: post_data['pp_BillReference'],
          pp_Description: post_data['pp_Description'],
          pp_TxnExpiryDateTime: post_data['pp_TxnExpiryDateTime'],
          pp_ReturnURL: post_data['pp_ReturnURL'],
          pp_SecureHash: post_data['pp_SecureHash'],
          ppmpf_1: post_data['ppmpf_1'],
          ppmpf_2: post_data['ppmpf_2'],
          ppmpf_3: post_data['ppmpf_3'],
          ppmpf_4: post_data['ppmpf_4'],
          ppmpf_5: post_data['ppmpf_5'],
         });
        console.log(post_data);
        
        return res
        .status(200)
        .json({ status: true, message: "secure hash created successfully" , postData  });

  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json({ StatusCode: "02", Description: "Server Error" });
  }
};

exports.jazzCashSecureHashForIOS = async (req, res) => {
  try {
    if (!req.body.userId || !req.body.coins ||  !req.body.amount || !req.body.phone || !req.body.app_type || !req.body.cnic)
      return res
        .status(200)
        .json([{ status: false, Description: "Invalid Data" }]);
      
    const user = await User.findById(req.body.userId);
    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "user not exists !" });
        var phone_no = req.body.phone;
        var cnic = req.body.cnic;
        var pp_Amount = req.body.amount*100;
        var app_type = req.body.app_type;
        console.log(user._id);
        var datetime = dayjs();//new Date();
        var pp_TxnDateTime = dayjs().format('YYYYMMDDHHmmss');//'20221129174322';//dayjs().format('YYYYMDHms');
        //to make expiry date and time add one hour to current date and time
        var pp_TxnExpiryDateTime = dayjs().add(60, 'm').format('YYYYMMDDHHmmss');//'20221129184322';//dayjs().add(60, 'm').format('YYYYMDHms');
        if(app_type == 'android'){
          var pp_TxnRefNo = 'JCA'+pp_TxnDateTime; //for user amount paid transaction id//
        }
        else if(app_type == 'ios'){
          var pp_TxnRefNo = 'JCIOS'+pp_TxnDateTime; //for user amount paid transaction id//
        }
        
        console.log(pp_TxnDateTime +'---'+ pp_TxnExpiryDateTime);
        //console.log(pp_TxnRefNo);
        var post_data = []; // Creating a new array object
        
        //post_data['pp_Version'] = '2.0'; //comnt in sandbox
        //post_data['pp_TxnType'] = 'MWALLET'; //comnt in sandbox

        post_data['pp_Version'] = '';//comment this in sandbox
        post_data['pp_TxnType'] = '';//comment this in sandbox
        post_data['pp_Language'] = 'EN';
        post_data['pp_MerchantID'] = '22335878';//'22335878'; //live //'MC51240'; //test
        post_data['pp_SubMerchantID'] = '';
        post_data['pp_Password'] = '41czx50s9b'; // '41czx50s9b';//live //'xtzy0tyuux'; //test;
        post_data['pp_TxnRefNo'] = pp_TxnRefNo;
        post_data['pp_MobileNumber'] = phone_no;//'03123456789'; //test
        post_data['pp_CNIC'] = cnic;
        post_data['pp_Amount'] = pp_Amount;
        post_data['pp_DiscountedAmount'] = '';
        post_data['pp_TxnCurrency'] = 'PKR';
        post_data['pp_TxnDateTime'] = pp_TxnDateTime;
        post_data['pp_BillReference'] = 'billRef';
        post_data['pp_Description'] = 'TalentCash Payment';
        post_data['pp_TxnExpiryDateTime'] = pp_TxnExpiryDateTime;

        //post_data['pp_BankID'] = 'TBANK';
        //post_data['pp_ProductID'] = 'RETL';
        
        
        
        //post_data['pp_ReturnURL'] = 'https://www.talentcash.pk/';//'http://talentcash.pk/';for sandbox////'http://localhost/loadx-pk/pay_with_jazzcash';//'http://test.loadx.pk/pay_with_jazzcash';
        post_data['pp_SecureHash'] = '';
        post_data['ppmpf_1'] = phone_no;
        post_data['ppmpf_2'] = user._id;
        post_data['ppmpf_3'] = '';
        post_data['ppmpf_4'] = '';
        post_data['ppmpf_5'] = '';
        pp_SecureHash = get_SecureHash(post_data);
        post_data['pp_SecureHash'] = pp_SecureHash;
        postData = []
        postData.push({
          pp_Version: post_data['pp_Version'], //comnt in sandbox
          pp_TxnType: post_data['pp_TxnType'],//comnt in sandbox
          pp_Language: post_data['pp_Language'],
          pp_MerchantID: post_data['pp_MerchantID'],
          pp_SubMerchantID: post_data['pp_SubMerchantID'],
          pp_Password: post_data['pp_Password'],
          //pp_BankID: post_data['pp_BankID'],
          //pp_ProductID: post_data['pp_ProductID'],
          pp_TxnRefNo: post_data['pp_TxnRefNo'],
          pp_MobileNumber : post_data['pp_MobileNumber'],
          pp_CNIC : post_data['pp_CNIC'],
          pp_Amount: post_data['pp_Amount'],
          pp_DiscountedAmount: post_data['pp_DiscountedAmount'],
          
          pp_TxnCurrency: post_data['pp_TxnCurrency'],
          pp_TxnDateTime: post_data['pp_TxnDateTime'],
          pp_BillReference: post_data['pp_BillReference'],
          pp_Description: post_data['pp_Description'],
          pp_TxnExpiryDateTime: post_data['pp_TxnExpiryDateTime'],
          // pp_ReturnURL: post_data['pp_ReturnURL'],
          pp_SecureHash: post_data['pp_SecureHash'],
          ppmpf_1: post_data['ppmpf_1'],
          ppmpf_2: post_data['ppmpf_2'],
          ppmpf_3: post_data['ppmpf_3'],
          ppmpf_4: post_data['ppmpf_4'],
          ppmpf_5: post_data['ppmpf_5'],
         });
        console.log(post_data);
        
        return res
        .status(200)
        .json({ status: true, message: "secure hash created successfully" , postData  });

  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json({ StatusCode: "02", Description: "Server Error" });
  }
};

function get_SecureHash(data_array)
{
  //console.log(data_array);
    //Quick Sort
    const ordered = Object.keys(data_array).sort().reduce(
      (obj, key) => { 
        obj[key] = data_array[key]; 
        return obj;
      }, 
      {}
    );
    var str = '';
      for (var key in ordered) {
        var value = ordered[key];
        if(value){
              str = str +'&'+value;
            }
        //console.log(key, value);
      }
      //for sandbox
      // str = 'tw969v88v1'+str;
      // const a = crypto.createHmac('sha256','tw969v88v1').update(str).digest('hex');

      //for live
      str = 'ez2x9g3061'+str;
      const a = crypto.createHmac('sha256','ez2x9g3061').update(str).digest('hex');
      
      return a ;
}