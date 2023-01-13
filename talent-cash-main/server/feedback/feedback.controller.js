const Notification = require("../notification/notification.model");
const User = require("../user/user.model");
const Reel = require("../reels/reels.model");
const Booking = require("../booking/booking.model");
const Feedback = require("../feedback/feedback.model");

//FCM node
var FCM = require("fcm-node");
var config = require("../../config");
var fcm = new FCM(config.SERVER_KEY);

exports.submitFeedback = async (req, res) => {
    //console.log(req.query.talentUserId);
    try 
    {
        if (!req.body.bookingId && !req.body.rating)
           return res
          .status(200)
          .json({ status: false, message: "Booking Id Required !" });
  
        const booking = await Booking.findById(req.body.bookingId);
        //console.log(booking);
        //const checkAvailability = await Booking.find();
  
        const checkFeedback = await Feedback.findOne({
        $and: [
          {
            bookingId: booking._id, 
            isDelete : false,
          }
        ],
      });
  
    //  console.log(checkFeedback);
  
        if(!checkFeedback)
        {
            const feedback = new Feedback();
            feedback.bookingId = booking._id;
            feedback.userId = booking.userId; // who is submitting
            feedback.talentUserId = booking.talentUserId;
            feedback.reelId = booking.reelId;
            feedback.rating = req.body.rating ? req.body.rating : 0;
            feedback.description = req.body.description ? req.body.description : 0;
            feedback.feedback_date = new Date().toLocaleString("en-US");
            feedback.isDelete = false;

            const insertRec = await feedback.save();
            if(insertRec)
            {
                booking.isFeedbackAdd = true;
                await booking.save()
            }
            return res
                .status(200)
                .json({ status: true, message: "Successful!", insertRec });
            
        }
        else
        {
            return res
            .status(200)
            .json({ status: false, message: "feedback already added."});
        }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: false, error: error.message || "Server Error" });
    }
};

//view existing feedback
exports.viewFeedback = async (req, res) => {
    //console.log(req.query.talentUserId);
    try 
    {
        if (!req.body.booking_id)
           return res
          .status(200)
          .json({ status: false, message: "Feedback Id Required !" });
  
        //const checkFeedback = await Feedback.findById(req.body.feedback_id);
        var checkFeedback = await Feedback.findOne({ bookingId:req.body.booking_id});
        if(checkFeedback)
        {
            return res
                .status(200)
                .json({ status: true, message: "Successful!", checkFeedback });
            
        }
        else
        {
            return res
            .status(200)
            .json({ status: false, message: "feedback not found."});
        }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ status: false, error: error.message || "Server Error" });
    }
};