const Notification = require("./notification.model");
const User = require("../user/user.model");
const Reel = require("../reels/reels.model");

const Booking = require("../booking/booking.model");
const Payment = require("../payment/payment.model");

const Wallet = require("../wallet/wallet.model");


//dayjs
const dayjs = require("dayjs");
const { baseURL } = require("../../config");

//FCM node
var FCM = require("fcm-node");
var config = require("../../config");
var fcm = new FCM(config.SERVER_KEY);

//get all notification
exports.getNotification = async (req, res) => {
  try {
    if (!req.query.userId)
      return res.status(500).json({
        status: false,
        message: "Invalid Details!",
      });
    const user = await User.findById(req.query.userId);
    if (!user)
      return res.status(500).json({
        status: false,
        message: "User Does not Exist!",
      });
    var notification;
    if (req.query.type === "follower") {
      notification = await Notification.find({
        $and: [{ notificationType: 0 }, { userId: user._id }],
      })
        .populate("otherUserId", "name profileImage")
        .sort({ createdAt: -1 })
        .skip(req.query.start ? parseInt(req.query.start) : 0)
        .limit(req.query.limit ? parseInt(req.query.limit) : 20);
    } else if (req.query.type === "like") {
      notification = await Notification.find({
        $and: [{ notificationType: 1 }, { userId: user._id }],
      })
        .populate("otherUserId", "name profileImage")
        .sort({ createdAt: -1 })
        .skip(req.query.start ? parseInt(req.query.start) : 0)
        .limit(req.query.limit ? parseInt(req.query.limit) : 20);
    } else if (req.query.type === "comment") {
      notification = await Notification.find({
        $and: [{ notificationType: 2 }, { userId: user._id }],
      })
        .populate("otherUserId", "name profileImage")
        .sort({ createdAt: -1 })
        .skip(req.query.start ? parseInt(req.query.start) : 0)
        .limit(req.query.limit ? parseInt(req.query.limit) : 20);
    } else if (req.query.type === "gift") {
      notification = await Notification.find({
        $and: [{ notificationType: 3 }, { userId: user._id }],
      })
        .populate("otherUserId", "name profileImage")
        .sort({ createdAt: -1 })
        .skip(req.query.start ? parseInt(req.query.start) : 0)
        .limit(req.query.limit ? parseInt(req.query.limit) : 20);
    } else if (req.query.type === "mention") {
      notification = await Notification.find({
        $and: [{ notificationType: 4 }, { userId: user._id }],
      })
        .populate("otherUserId", "name profileImage")
        .sort({ createdAt: -1 })
        .skip(req.query.start ? parseInt(req.query.start) : 0)
        .limit(req.query.limit ? parseInt(req.query.limit) : 20);
    } else if (req.query.type === "chat") {
      notification = await Notification.find({
        $and: [{ notificationType: 5 }, { userId: user._id }],
      })
        .populate("otherUserId", "name profileImage")
        .sort({ createdAt: -1 })
        .skip(req.query.start ? parseInt(req.query.start) : 0)
        .limit(req.query.limit ? parseInt(req.query.limit) : 20);
    } else if (req.query.type === "ALL") {
      notification = await Notification.find({
        $and: [{ userId: user._id }, { notificationType: { $ne: 5 } }],
      })
        .populate("otherUserId", "name profileImage")
        .sort({ createdAt: -1 })
        .skip(req.query.start ? parseInt(req.query.start) : 0)
        .limit(req.query.limit ? parseInt(req.query.limit) : 20);
    }
    const now = dayjs();
    const notifications = await notification.map((data) => ({
      _id: data._id,
      userId: data.userId,
      otherUserId: data.otherUserId._id,
      reelId: data.reelId,
      image: data.otherUserId.profileImage,
      name: data.otherUserId.name,
      message: `${data.message}`,
      date: data.date,

      time:
        now.diff(data.createdAt, "minute") <= 60 &&
        now.diff(data.createdAt, "minute") >= 0
          ? now.diff(data.createdAt, "minute") + " minutes ago"
          : now.diff(data.createdAt, "hour") >= 24
          ? dayjs(data.createdAt).format("DD MMM, YYYY")
          : now.diff(data.createdAt, "hour") + " hour ago",
    }));

    return res
      .status(200)
      .json({ status: true, message: "Successful", notifications });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};

//delete notification
exports.destroy = async (req, res) => {
  try {
    const notification = await Notification.findById(req.query.notificationId);

    if (!notification)
      return res
        .status(200)
        .json({ status: false, message: "Notification Does not Exists !" });

    notification.deleteOne();
    notification.save();
    return res.status(200).json({ status: true, message: "Success!" });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};

//send notification by admin panel
exports.sendNotification = async (req, res) => {
  try {
    //const topic = "/topics/BUZZY";
    const topic = "/topics/TalentCash";
    var message = {
      //this may vary according to the message type (single recipient, multicast, topic, et cetera)
      to: topic,

      notification: {
        body: req.body.description,
        title: req.body.title,
        image: baseURL + req.file.path,
      },
    };

    await fcm.send(message, function (err, response) {
      if (err) {
        console.log("Something has gone wrong!");
      } else {
        res.status(200).json({
          status: 200,
          message: "Successfully sent message",
          data: true,
        });
        console.log("Successfully sent with response: ", response);
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};

// send notification personal user via admin penal
exports.sendNotificationPersonalUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User Doesn't Exist!" });

    var message = {
      //this may vary according to the message type (single recipient, multicast, topic, et cetera)
      to: user.fcm_token,
      notification: {
        body: req.body.description,
        title: "Notify By Admin",
      },
    };

    await fcm.send(message, function (err, response) {
      if (err) {
        console.log("Something has gone wrong!");
        return res
          .status(200)
          .json({ status: false, message: "Something has gone wrong!" });
      } else {
        console.log("Successfully sent with response: ", response);
        return res.status(200).json({
          status: 200,
          message: "Successfully sent message",
          data: true,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};


//By umar 07-09-22
// send notification personal user via admin penal
exports.sendOfferNotificationToTalentProvider = async (req, res) => {
  try {
    if (req.body.userId && req.body.reelId) {
      const user = await User.findById(req.body.userId);// who is sending
      const reel = await Reel.findById(req.body.reelId);

      if (!user)
        return res
          .status(200)
          .json({ status: false, message: " User Does Not Exist !" });
      if (!reel)
        return res
          .status(200)
          .json({ status: false, message: " Reel Does Not Exist !" });

      const reelOwner = await User.findOne({ _id: reel.userId }); //service provider data
      //old
      //console.log(reelOwner.initial_price);
      // if (user.coin < reel.initial_price)
      //   return res
      //     .status(200)
      //     .json({ status: false, message: " Your balance is low for this offer. Please recharge first !" });

      if(reelOwner.coin < reel.initial_price)
      {
        const payload = {
          //to: reelOwner.fcm_token,
          to: reelOwner.fcm_token,
          notification: {
            title: `${user.name} want to hire you but your balance is low for this offer. Please recharge first !`,
          },
          data: {
            data:
              {
                _id: reel._id,
                isDelete: reel.isDelete,
                userId: user._id,
                name: user.name,
                userImage: user.profileImage,
                description: req.body.description ? req.body.description : null,
                service: reel.service ? reel.service : null,
                service_price : reel.service_price ? reel.service_price : 0,
                initial_price: reel.initial_price ? reel.initial_price : 0,
                remaining_price : reel.remaining_price ? reel.remaining_price : 0
              },
            type: "RELOAD",
          },
        };

        await fcm.send(payload, function (err, response) {
          if (err) {
            console.log("Something has gone wrong!", err);
            return res
            .status(200)
            .json({ status: false, message: "Something has gone wrong!" });
          }
          else
          {
            console.log("Successfully sent with response: ", response);
            return res.status(200).json({
              status: true,
              message: "Successfully sent message",
              data: true,
              payload: payload,
            });
          }
        });
      }
      else if (req.body.userId.toString())
      {
        //console.log(reelOwner._id.toString() + '--user_id--' +req.body.userId.toString());
        //console.log(user.name);
        const payload = {
          //to: reelOwner.fcm_token,
          to: reelOwner.fcm_token,
          notification: {
            title: `${user.name} want to hire you.`,
          },
          data: {
            data:
              {
                _id: reel._id,
                isDelete: reel.isDelete,
                userId: user._id,
                name: user.name,
                userImage: user.profileImage,
                description: req.body.description ? req.body.description : null,
                service: reel.service ? reel.service : null,
                service_price : reel.service_price ? reel.service_price : 0,
                initial_price: reel.initial_price ? reel.initial_price : 0,
                remaining_price : reel.remaining_price ? reel.remaining_price : 0
              },
            type: "TALL",
          },
        };

        // console.log("payload", payload);

        await fcm.send(payload, function (err, response) {
          if (err) {
            console.log("Something has gone wrong!", err);
            return res
            .status(200)
            .json({ status: false, message: "Something has gone wrong!" });
          }
          else
          {
            console.log("Successfully sent with response: ", response);
            return res.status(200).json({
              status: true,
              message: "Successfully sent message",
              data: true,
              payload: payload,
            });
          }
        });

      }
      else
      {
        console.log('error');
      }


      console.log(reelOwner.fcm_token);
      

    }else {
      return res.status(200).json({
        status: false,
        message: "Invalid Details !",
      });
    }

  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};


// send notification
exports.acceptRejectOfferNotificationToUser = async (req, res) => {
  try {
    if (req.body.userId && req.body.talentId && req.body.reelId && req.body.status) {
      const user = await User.findById(req.body.userId);// who is sending
      const talent = await User.findById(req.body.talentId);
      const reel = await Reel.findById(req.body.reelId);
      const status = req.body.status;
      
      // console.log(user);
      if (!user)
        return res
          .status(200)
          .json({ status: false, message: " User Does Not Exist !" });
      if (!talent)
        return res
          .status(200)
          .json({ status: false, message: " Talent Does Not Exist !" });    
      if (!reel)
        return res
          .status(200)
          .json({ status: false, message: " Reel Does Not Exist !" });

      const reelOwner = await User.findOne({ _id: reel.userId }); //service provider data
      // Save data in booking and sent notification to User if accept
      if (status.toString() == 'accepted')
      {
        const Last_Book_Record = await Booking.find().sort({ $natural: -1 }).limit(1);
        if(!Last_Book_Record[0] || !Last_Book_Record[0].booking_id)
        {
          var booking_id = 'TC-'+'1'.padStart(5, '0');//first booking id in case of no booking id available
        }
        else
        {
          var last_booking_id = Last_Book_Record[0].booking_id.split("-");
          var val = parseInt(last_booking_id[1]) + 1;
          var booking_id = 'TC-'+val.toString().padStart(5, '0');
        }
        //console.log(bookingLast_Book_Record_id);

         // Save the order in booking
         const booking = new Booking();
         booking.booking_id = booking_id;
         booking.talentUserId = talent._id;
         booking.userId = user._id;
         booking.reelId = reel._id;
         booking.time = reel.availabileTime;
         booking.service = reel.service;
         booking.price = reel.service_price ? reel.service_price : 0;
         booking.initial_price = reel.initial_price ? reel.initial_price : 0;
         booking.remaining_price = reel.remaining_price ? reel.remaining_price : 0;
         booking.description = req.body.description ? req.body.description : null,
         booking.status = 0; //inprogress
         booking.accept_date = new Date().toLocaleString("en-US");
         booking.completed_date = null;
         booking.isDelete = false;
         // console.log(booking);
         booking.save();
       
         var booking_last_id = booking._id;

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
         
         // Save Data in Payment Table
        //  const payment = new Payment();
        //  payment.invoice_id = invoice_id;
        //  payment.talentUserId = talent._id;
        //  payment.userId = user._id;
        //  payment.reelId = reel._id;
        //  payment.bookingId = booking_last_id;
        //  payment.pay_datetime = new Date().toLocaleString("en-US");
        //  payment.amount = reel.initial_price;
        //  payment.payment_type = 0;//initial
        //  payment.payment_method = req.payment_method ? req.payment_method : 1;//wallet
        //  payment.transaction_id = req.transaction_id ? req.transaction_id : null;
        //  payment.payment_status = 1;//paid
        //  payment.isDelete = false;
        //  payment.save();

         
        // Save data in Wallet
        //  const wallet = new Wallet();
        //  wallet.userId = user._id;
        //  wallet.type = 0;//SIGN up gift
        //  wallet.isIncome = false;
        //  wallet.coin = reel.initial_price;
        //  wallet.date = new Date().toLocaleString("en-US");
        //  wallet.save();

        // Update the coins in user table
        //  var remaining_user_coins = user.coin - reel.initial_price;
        //  user.coin = remaining_user_coins;
        //  user.save();
   
        
        const payload = {
          to: user.fcm_token,
          notification: {
            title: `${reelOwner.name} accepted your offer.`,
          },
          data: {
            data: 
              {
                _id: reel._id,
                isDelete: reel.isDelete,
                userId: reelOwner._id,
                bookingId: booking_last_id,
                booking_cus_id : booking_id,
                caption: reel.caption,
                name: talent.name,
                userImage: talent.profileImage,
                description: req.body.description ? req.body.description : null,
                service: reel.service ? reel.service : null,
                service_price : reel.service_price ? reel.service_price : 0,
                initial_price: reel.initial_price ? reel.initial_price : 0,
                remaining_price : reel.remaining_price ? reel.remaining_price : 0,
                lat : reel.lat ? reel.lat : null,
                long : reel.long ? reel.long : null,
                status:"accepted",
                
              },
            
            type: "SMALL",
            // type: "USER",
          },
        };

        //console.log("payload", payload);

        await fcm.send(payload, function (err, response) {
          if (err) {
            console.log("Something has gone wrong!", err);
            return res
            .status(200)
            .json({ status: false, message: "Something has gone wrong!", payload});
          }
          else
          {
          
            console.log("Successfully sent with response: ", response);
            return res.status(200).json({
              status: true,
              message: "Successfully sent message",
              data: true,
              payload: payload,
              // booking
            });
          }
        });

      }
      //Rejected Case
      else
      {
        // console.log('rejected')
        const payload = {
          to: user.fcm_token,
          notification: {
            title: `${reelOwner.name} rejected your offer.`,
          },
          data: {
            data: 
              {
                _id: reel._id,
                isDelete: reel.isDelete,
                userId: reelOwner._id,
                bookingId: null,
                caption: reel.caption,
                name: talent.name,
                userImage: talent.profileImage,
                description: req.body.description ? req.body.description : null,
                service: reel.service ? reel.service : null,
                service_price : reel.service_price ? reel.service_price : 0,
                initial_price: reel.initial_price ? reel.initial_price : 0,
                remaining_price : reel.remaining_price ? reel.remaining_price : 0,
                lat : reel.lat ? reel.lat : null,
                long : reel.long ? reel.long : null,
                status:"rejected",
                
              },
            
            type: "SMALL",
          },
        };

        await fcm.send(payload, function (err, response) {
          if (err) {
            console.log("Something has gone wrong!", err);
            return res
            .status(200)
            .json({ status: false, message: "Something has gone wrong!" });
          }
          else
          {
            console.log("Successfully sent with response: ", response);
            return res.status(200).json({
              status: true,
              message: "Successfully sent message",
              data: true,
              payload: payload,
            });
          }
        });
      }

    }else {
      return res.status(200).json({
        status: false,
        message: "Invalid Details !",
      });
    }

  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};
