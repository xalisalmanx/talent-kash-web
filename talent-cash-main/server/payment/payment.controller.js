const Notification = require("../notification/notification.model");
const User = require("../user/user.model");
const Reel = require("../reels/reels.model");
const Booking = require("../booking/booking.model");
const Payment = require("./payment.model");

//FCM node
var FCM = require("fcm-node");
var config = require("../../config");
var fcm = new FCM(config.SERVER_KEY);

//get all invoices list ( payment histroy )
exports.userInvoice = async (req, res) => {
    //console.log(req.query.talentUserId);
    try {
      const start = req.query.start ? parseInt(req.query.start) : 0;
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      if (!req.query.userId)
        return res
          .status(200)
          .json({ status: false, message: "user Id Required !" });
  
        const user = await User.findById(req.query.userId);
        const userInvoice = await Payment.find({
          $and: [
            {
              userId: user._id, 
              isDelete: false, // if not dleeted invoice
            },
          ],
        })
      .populate({
        "path": "talentUserId",
        //"select": ("user_role"),
        "match": { "user_role": ["talent_provider"] }
      })
      .limit(limit)
      .skip(start * limit);

      //res.send(userInvoice);
      if (!userInvoice || userInvoice.length == 0)
      return res.status(200).json({ status: false, message: "No data found!" });

      return res.status(200).json({ status: true, message: "Success!!", userInvoice });
      
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: false, error: error.message || "Server Error" });
    }
};

//in case of completed booking case (remaining case invoice )...
exports.userCompleteBookingInvoice = async (req, res) => {
  //console.log(req.query.talentUserId);
  try {
    if (!req.query.bookingId)
      return res
        .status(200)
        .json({ status: false, message: "booking Id Required !" });

      const booking = await Booking.findById(req.query.bookingId);
      const userCompleteBookingInvoice = await Payment.find({
        $and: [
          {
            bookingId: booking._id, 
            isDelete: false, // if record not deleted
            payment_type: 1, //remaining
          },
        ],
      })
    .populate({
      "path": "talentUserId",
      select:'name gender username user_id',
      "match": { "user_role": ["talent_provider"] }
    })
    .populate({
      "path": "userId",
      select:'name gender username user_id',
      "match": { "user_role": ["user"] }
    }).populate({
      "path": "bookingId",
      //"select": ("name","gender"),
      select:'_id reelId service price time accept_date booking_id',
    });

    //res.send(userInvoice);

    if (userCompleteBookingInvoice){
      userCompleteBookingInvoice[0]['amount'] = userCompleteBookingInvoice[0]['bookingId'].price;
      return res
        .status(200)
        .json({ status: true, message: "record found !",userCompleteBookingInvoice });
    }
    else{
    return res
      .status(200)
      .json({ status: false, message: "no record found !" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};


//Talent Provider of completed booking case (remaining case invoice )...
exports.talentCompleteBookingInvoice = async (req, res) => {
  //console.log(req.query.talentUserId);
  try {
    if (!req.query.bookingId)
      return res
        .status(200)
        .json({ status: false, message: "booking Id Required !" });

      const booking = await Booking.findById(req.query.bookingId);
      const talentCompleteBookingInvoice = await Payment.find({
        $and: [
          {
            bookingId: booking._id, 
            isDelete: false, // if record not deleted
            payment_type: 1, //remaining
          },
        ],
      })
    .populate({
      "path": "userId",
      select:'name gender username user_id',
      "match": { "user_role": ["user"] }
    })
    .populate({
      "path": "talentUserId",
      select:'name gender username user_id',
      "match": { "user_role": ["talent_provider"] }
    }).populate({
      "path": "bookingId",
      //"select": ("name","gender"),
      select:'_id reelId service price time accept_date booking_id',
    });

    //res.send(userInvoice);

    if (talentCompleteBookingInvoice){
      //console.log(talentCompleteBookingInvoice[0]['bookingId'].price);
      talentCompleteBookingInvoice[0]['amount'] = talentCompleteBookingInvoice[0]['bookingId'].price;
      return res
        .status(200)
        .json({ status: true, message: "record found !",talentCompleteBookingInvoice });
    }
    else{
    return res
      .status(200)
      .json({ status: false, message: "no record found !" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//Talent Provider Total Earning//
exports.talentProviderTotalEarning = async (req, res) => {
  try {
    if (!req.query.talentUserId)
      return res
        .status(200)
        .json({ status: false, message: "invalid detail !" });
      
      const talent = await User.findById(req.query.talentUserId);
        if (!talent)
          return res
            .status(200)
            .json({ status: false, message: "Talent Provider not found !" });

      conditions = {
              "payment_type": 1,
              "talentUserId" : talent._id,
              "isDelete" : false 
              // More conditions in future...
            }

        const talentTotalEarning = await Payment.aggregate([
          //{ $match: { talentUserId: talent._id} },
          { $match: conditions },
          // {
          //   $match: {
          //   talentUserId: talent._id ,
          // }},
          //{$sum : "amount" },
          { $group: { _id: "", totalEarning: { $sum: "$amount" } } },
        ]);

    console.log(talentTotalEarning);
    return res
      .status(200)
      .json({ status: true, message: "record found !", totalEarning : talentTotalEarning[0] ? talentTotalEarning[0].totalEarning : 0 });
  }
  catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};