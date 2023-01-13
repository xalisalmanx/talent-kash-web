const Notification = require("../notification/notification.model");
const User = require("../user/user.model");
const Reel = require("../reels/reels.model");
const Booking = require("./booking.model");
const Payment = require("../payment/payment.model");

const Wallet = require("../wallet/wallet.model");


//FCM node
var FCM = require("fcm-node");
var config = require("../../config");
var fcm = new FCM(config.SERVER_KEY);

//get user by username to check provider available or not
exports.checkAvailability = async (req, res) => {
    //console.log(req.query.talentUserId);
    try {
      if (!req.query.talentUserId)
        return res
          .status(200)
          .json({ status: false, message: "User Id Required !" });
  
      //const checkAvailability = await Booking.findById(req.query.talentUserId);
      const user = await User.findById(req.query.talentUserId);
      //const checkAvailability = await Booking.find();

      const checkAvailability = await Booking.findOne({
        $and: [
          {
            talentUserId: user._id, 
            status: 0, // if talent provider has booking status is inprogress
          },
        ],
      });

     //console.log(checkAvailability);
  
      if (!checkAvailability){
        return res
          .status(200)
          .json({ status: true, message: "Yes User is available !" });
      }
      else{
      return res
        .status(200)
        .json({ status: false, message: "Talent Provider is not free !" });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: false, error: error.message || "Server Error" });
    }
  };

//active booking for user

exports.activeBookingListUser = async (req, res) => {
  //console.log(req.query.talentUserId);
  try {

    const start = req.query.start ? parseInt(req.query.start) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    if (!req.query.userId)
      return res
        .status(200)
        .json({ status: false, message: "User Id Required !" });

    //const checkAvailability = await Booking.findById(req.query.talentUserId);
    const user = await User.findById(req.query.userId);
    //const checkAvailability = await Booking.find();

    const activeBookingList = await Booking.find({
      $and: [
        {
          userId: user._id, 
          status: 0, // if user has booking status is inprogress/active
          isDelete : false,
        }
      ],
    }).populate({
      "path": "talentUserId",
      "match": { "user_role": ["talent_provider"] }
  })
    .limit(limit)
    .skip(start * limit);

   //console.log(activeBookingList);

    if (activeBookingList){
      return res
        .status(200)
        .json({ status: true, message: "result found.", activeBookingList, totalUser: activeBookingList.length > 0 ? activeBookingList.length : 0});
    }
    else{
    return res
      .status(200)
      .json({ status: false, message: "no record found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//completed booking for user

exports.completedBookingListUser = async (req, res) => {
  //console.log(req.query.talentUserId);
  try {

    const start = req.query.start ? parseInt(req.query.start) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    if (!req.query.userId)
      return res
        .status(200)
        .json({ status: false, message: "User Id Required !" });

    //const checkAvailability = await Booking.findById(req.query.talentUserId);
    const user = await User.findById(req.query.userId);
    //const checkAvailability = await Booking.find();

    const completeBookingList = await Booking.find({
      $and: [
        {
          userId: user._id, 
          status: 1, // if user has booking status is inprogress/active
          isDelete : false,
        }
      ],
    }).populate({
      "path": "talentUserId",
      "match": { "user_role": ["talent_provider"] }
  })
    .limit(limit)
    .skip(start * limit);

   //console.log(completeBookingList);

    if (completeBookingList){
      return res
        .status(200)
        .json({ status: true, message: "result found.", completeBookingList, totalUser: completeBookingList.length > 0 ? completeBookingList.length : 0});
    }
    else{
    return res
      .status(200)
      .json({ status: false, message: "no record found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// User Order Summary 
exports.trackOrderSummary = async (req, res) => {
  try {

    if (!req.query.bookingId)
      return res
        .status(200)
        .json({ status: false, message: "Booking Id is Required !" });

    const booking = await Booking.findById(req.query.bookingId)
    .populate({
          "path": "talentUserId",
          "select" : "_id name username profileImage user_phone user_id",
          "match": { "user_role": ["talent_provider"] }
      })
      .populate({
        "path": "reelId",
        "select":'_id lat long'
      });
    

    if (booking){
      return res
        .status(200)
        .json({ status: true, message: "result found.", booking});
    }
    else{
    return res
      .status(200)
      .json({ status: false, message: "no record found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//Talent Provider Active Bookings

exports.activeBookingListTalent = async (req, res) => {
  try {

    const start = req.query.start ? parseInt(req.query.start) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    if (!req.query.talentUserId)
      return res
        .status(200)
        .json({ status: false, message: "Talent Provider Id is Required !" });

    const talent = await User.findById(req.query.talentUserId);

    if (!talent)
      return res
        .status(200)
        .json({ status: false, message: "Talent Provider not found !" });
    

    const activeBookingList = await Booking.find({
      $and: [
        {
          talentUserId: talent._id, 
          status: 0, // if talent provider has booking status is inprogress/active
          isDelete: false,
        }
      ],
    }).populate({
      "path": "userId",
      "match": { "user_role": ["user"] }
  }).limit(limit)
    .skip(start * limit);

   //console.log(activeBookingList);

    if (activeBookingList){
      return res
        .status(200)
        .json({ status: true, message: "result found.", activeBookingList, totalUser: activeBookingList.length > 0 ? activeBookingList.length : 0});
    }
    else{
    return res
      .status(200)
      .json({ status: false, message: "no record found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//completed Booking
exports.completedBookingListTalent = async (req, res) => {
  try {

    const start = req.query.start ? parseInt(req.query.start) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    if (!req.query.talentUserId)
      return res
        .status(200)
        .json({ status: false, message: "Talent Provider Id Required !" });

    const talent = await User.findById(req.query.talentUserId);
    
    if (!talent)
    return res
      .status(200)
      .json({ status: false, message: "Talent Provider not found !" });

    const completedBookingList = await Booking.find({
      $and: [
        {
          talentUserId: talent._id, 
          status: 1, // if talent provider has booking status is inprogress/active
          isDelete: false,
        }
      ],
    }).populate({
      "path": "userId",
      "match": { "user_role": ["user"] }
  }).limit(limit)
    .skip(start * limit);

    const totalCount = await Booking.find( {
      talentUserId: talent._id, 
      status: 1, // if talent provider has booking status is inprogress/active
      isDelete: false,
    }).count();
    // console.log(totalCount);

   //console.log(completedBookingList);

    if (completedBookingList){
      return res
        .status(200)
        .json({ status: true, message: "result found.", completedBookingList, totalUser: completedBookingList.length > 0 ? completedBookingList.length : 0 , totalCount });
    }
    else{
    return res
      .status(200)
      .json({ status: false, message: "no record found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};


// Talent Provider Order Summary 
exports.trackTalentProviderOrderSummary = async (req, res) => {
  try {

    if (!req.query.bookingId)
      return res
        .status(200)
        .json({ status: false, message: "Booking Id is Required !" });

    const booking = await Booking.findById(req.query.bookingId)
    .populate({
          "path": "userId",
          "match": { "user_role": ["user"] }
      });
    

    if (booking){
      return res
        .status(200)
        .json({ status: true, message: "result found.", booking});
    }
    else{
    return res
      .status(200)
      .json({ status: false, message: "no record found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// Complete Talent Provider Order 
exports.completeTalentProviderOrder = async (req, res) => {
  try {

    if (!req.query.bookingId)
      return res
        .status(200)
        .json({ status: false, message: "Booking Id is Required !" });

    const booking = await Booking.findById(req.query.bookingId)
   
    if (!booking)
      return res
        .status(200)
        .json({ status: false, message: "Booking record not found !" });
    
    
    booking.status = 1;//completed
    booking.completed_date = new Date().toLocaleString("en-US");

    await booking.save();

    const Last_Payment_Record = await Payment.find().sort({ $natural: -1 }).limit(1);
    if(!Last_Payment_Record[0] || !Last_Payment_Record[0].invoice_id)
    {
      var invoice_id = 'TCI-'+'1'.padStart(5, '0');//first invoice id in case of no invoice id available
    }
    else
    {
      var last_invoice_id = Last_Payment_Record[0].invoice_id.split("-");
      var inv_val = parseInt(last_invoice_id[1]) + 1;
      var invoice_id = 'TCI-'+inv_val.toString().padStart(5, '0');
    }
    var booking_last_id = booking._id;

    const payment = new Payment();
    payment.invoice_id = invoice_id;
    payment.talentUserId = booking.talentUserId;
    payment.userId = booking.userId;
    payment.reelId = booking.reelId;
    payment.bookingId = booking_last_id;
    payment.pay_datetime = new Date().toLocaleString("en-US");
    payment.amount = booking.remaining_price;
    payment.payment_type = 1;//remaining
    payment.payment_method = 0;//cash on delivery
    payment.transaction_id = req.transaction_id ? req.transaction_id : null;
    payment.payment_status = 1;//paid
    payment.isDelete = false;
    await payment.save();

    const user = await User.findById(booking.userId);
    //12-27-22
    const tp = await User.findById(booking.talentUserId);

    // Save data in Wallet for user
    // const wallet = new Wallet();
    // wallet.userId = user._id;
    // wallet.type = 0;//SIGN up gift
    // wallet.isIncome = false;
    // wallet.coin = booking.initial_price;
    // wallet.date = new Date().toLocaleString("en-US");
    // wallet.save();

    //save data for talent provider 
    const wallet = new Wallet();
    wallet.userId = tp._id;
    wallet.type = 0;//SIGN up gift
    wallet.isIncome = false;
    wallet.coin = booking.initial_price;
    wallet.date = new Date().toLocaleString("en-US");
    wallet.save();

    // Update the coins in user table
    // var remaining_user_coins = user.coin - booking.initial_price;
    // user.coin = remaining_user_coins;
    // user.save();

    var remaining_user_coins = tp.coin - booking.initial_price;
    tp.coin = remaining_user_coins;
    tp.save();

    return res.status(200).json({ status: true, message: "Success!!", booking });

  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

