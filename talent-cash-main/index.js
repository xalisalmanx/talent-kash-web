// import express
const express = require("express");
const app = express();
const path = require("path");
const config = require("./config");

//socket io
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

// Front Template
//settings for template engine
app.set('view engine', 'ejs');

app.set('views', 'frontend/views');


//import cors
const cors = require("cors");
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
//public storage
app.use("/storage", express.static(path.join(__dirname, "storage")));

//User Route
const UserRoute = require("./server/user/user.route");
app.use("/user", UserRoute);
//Reel Route
const ReelRoute = require("./server/reels/reels.route");
app.use("/reels", ReelRoute);
// //ReelType Route
const ReelTypeRoute = require("./server/reelCategory/reelCategory.route");
app.use("/reelType", ReelTypeRoute);
//follower Route
const FollowerRoute = require("./server/Follower/follower.route");
app.use("/follower", FollowerRoute);
//like Route
const LikeRoute = require("./server/like/like.route");
app.use("/like", LikeRoute);
//comment Route
const CommentRoute = require("./server/comment/comment.route");
app.use("/comment", CommentRoute);
//admin Route
const AdminRoute = require("./server/admin/admin.route");
app.use("/admin", AdminRoute);
//hashtag Route
const HashtagRoute = require("./server/hashtag/hashtag.route");
app.use("/hashtag", HashtagRoute);
//song Route
const SongRoute = require("./server/song/song.route");
app.use("/song", SongRoute);
//banner Route
const BannerRoute = require("./server/banner/banner.route");
app.use("/banner", BannerRoute);
//gift route
const GiftRoute = require("./server/gift/gift.route");
app.use("/gift", GiftRoute);
//setting route
const SettingRoute = require("./server/setting/setting.route");
app.use("/setting", SettingRoute);
//coinPlan route
const CoinPlanRoute = require("./server/coinPlan/coinPlan.route");
app.use("/coinPlan", CoinPlanRoute);
//diamondPlan route
const DiamondPlan = require("./server/diamondPlan/diamondPlan.route");
app.use("/diamondPlan", DiamondPlan);
//Wallet route
const WalletRoute = require("./server/wallet/wallet.route");
app.use("/wallet", WalletRoute);
//Redeem Plan route
const RedeemPlanRoute = require("./server/redeemPlan/redeemPlan.route");
app.use("/redeemPlan", RedeemPlanRoute);
//Redeem route
const RedeemRoute = require("./server/redeem/redeem.route");
app.use("/redeem", RedeemRoute);
//chat-topic route
const chatTopicRoute = require("./server/chatTopic/chatTopic.route");
app.use("/chatTopic", chatTopicRoute);

//chat route
const chatRoute = require("./server/chat/chat.route");
app.use("/chat", chatRoute);

//notification route
const NotificationRoute = require("./server/notification/notification.route");
app.use("/notification", NotificationRoute);
//dashboard route
const DashboardRoute = require("./server/dashboard/dashboard.route");
app.use("/dashboard", DashboardRoute);

// sticker route
const StickerRoute = require("./server/sticker/sticker.route");
app.use("/sticker", StickerRoute);
// location route
const LocationRoute = require("./server/location/location.route");
app.use("/location", LocationRoute);

// ad route
const AdRoute = require("./server/advertisement/advertisement.route");
app.use("/ad", AdRoute);

// custom ad route
const CustomAdRoute = require("./server/customAd/customAd.route");
app.use("/customAd", CustomAdRoute);

//by umar
// service route
const Service = require("./server/service/service.route");
app.use("/service", Service);

// booking route
const Booking = require("./server/booking/booking.route");
app.use("/booking", Booking);
//payment route
const Payment = require("./server/payment/payment.route");
app.use("/payment", Payment);
//feedback route
const Feedback = require("./server/feedback/feedback.route");
app.use("/feedback", Feedback);
//backend Appdownload for admin
const appDownload = require("./server/appDownload/appDownload.route");
app.use("/appDownload", appDownload);
//coin purchase orders
const orderCoin = require("./server/orderCoin/orderCoin.route");
app.use("/orderCoin", orderCoin);
//block
const block = require("./server/block/block.route");
app.use("/block", block);

//Frontend
app.use(express.static(path.join(__dirname, '/public')));
// Include the Frontend Routes
app.use('/',require(path.join(__dirname,"frontend/routes/web.js")))

// For react Login
app.get('/admin-login',(req,res)=>{
  res.redirect('https://admin.talentcash.pk/');
});

//Public File
// app.get("/*", (req, res) => {
//   res.status(200).sendFile(path.join(__dirname, "public", "index.html"));
// });

//import mongoose
const mongoose = require("mongoose");

// mongoose.connect(`mongodb+srv://buzzy:dVfCHaCA5Lpaf7gB@cluster0.gh1py5i.mongodb.net/LiveHunt`, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// mongoose.connect(`mongodb+srv://umar:minffkK69BqSI38g@cluster0.iljx7ps.mongodb.net/LiveHunt`, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
mongoose.connect(`mongodb+srv://talent-cash-db-user:zXnFTnNExdnRfK0i@cluster0.o5sx7am.mongodb.net/talent-cash-db`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", async () => {
  console.log("Mongo: successfully connected to db");
});

//model
const User = require("./server/user/user.model");
const ChatTopic = require("./server/chatTopic/chatTopic.model");
const Chat = require("./server/chat/chat.model");
const Wallet = require("./server/wallet/wallet.model");
const Setting = require("./server/setting/setting.model");
const Notification = require("./server/notification/notification.model");
const Gift = require("./server/gift/gift.model");
const dayjs = require("dayjs");

//FCM node
var FCM = require("fcm-node");

var fcm = new FCM(config.SERVER_KEY);

//socket-io
io.on("connect", (socket) => {
  //The moment one of your client connected to socket.io server it will obtain socket id
  //Let's print this out.

  // chatRoom for chat
  const { chatRoom } = socket.handshake.query;
  const { userRoom } = socket.handshake.query;

  socket.join(chatRoom);

  console.log("User Connect With Chat Room", chatRoom);

  socket.on("chat", async (data) => {
    console.log("chat data", data);
    let now = dayjs();
    if (data.messageType === 2) {
      console.log("Gift CHat In");

      const chatTopic = await ChatTopic.findById(data.topic);

      const gift = await Gift.findById(data.giftId);

      if (!gift) return io.in(chatRoom).emit("chat", "Gift Not Found");
      if (chatTopic) {
        const chat = new Chat();
        chat.senderId = data.senderId;
        chat.messageType = 2;
        chat.message = "🎁 Gift";
        chat.image = gift.image;
        chat.topic = chatTopic._id;
        chat.date = new Date().toLocaleString("en-US");

        await chat.save();
        console.log("Gift CHat", chat);

        let data_ = {};
        if (chat) {
          //chat time
          let time = "";
          time =
            now.diff(chat.date, "minute") <= 60 &&
            now.diff(chat.date, "minute") >= 0
              ? now.diff(chat.date, "minute") + " minutes ago"
              : now.diff(chat.date, "hour") >= 24
              ? now.diff(chat.date, "day") >= 30
                ? now.diff(chat.date, "month") + " months ago"
                : now.diff(chat.date, "day") + " days ago"
              : now.diff(chat.date, "hour") + " hours ago";

          data_ = {
            ...chat._doc,
            time: time === "0 minutes ago" ? "now" : time,
          };
        }

        var receiverUserIds;
        if (chatTopic.senderUserId.toString() === data.senderId.toString()) {
          receiverUserIds = chatTopic.receiverUserId;
        } else {
          receiverUserIds = chatTopic.senderUserId;
        }

        //add gift in user
        //find gift is present in user and update the count of gift
        const user = await User.findOneAndUpdate(
          {
            _id: receiverUserIds,
            "gift.gift": data.giftId,
          },
          { $inc: { "gift.$.count": 1 } },
          {
            new: true,
          }
        );

        // add new gift in user
        const receiverUser = await User.findById(receiverUserIds);

        const senderUser = await User.findById(data.senderId);
        if (!user) {
          const list = {
            gift: data.giftId,
            count: 1,
          };

          receiverUser.gift.push(list);
          await receiverUser.save();
        }

        //update in user coin and diamond

        senderUser.coin -= data.coin;
        await senderUser.save();

        receiverUser.diamond += data.coin;
        await receiverUser.save();

        console.log("chatTopic", chatTopic);
        console.log("senderUser", senderUser);
        console.log("receiverUser", receiverUser);

        //add notification

        if (
          receiverUser &&
          !receiverUser.isBlock &&
          receiverUser.notification
        ) {
          const payload = {
            to: receiverUser.fcm_token,
            notification: {
              body: chat.message,
              title: `${senderUser.name}`,
            },
            data: {
              data: {
                topic: chatTopic._id,
                message: chat.message,
                date: chat.date,
                chatDate: chat.date,
                userId: senderUser._id,
                name: senderUser.name,
                username: senderUser.username,
                image: senderUser.profileImage,
                time: "Just Now",
              },
              type: "MESSAGE",
            },
          };

          notificationData = {
            userId: receiverUser._id,
            otherUserId: senderUser._id,
            notificationType: 3,
            message: `${senderUser.name} Send You ${chat.message}`,
            date: new Date().toLocaleString("en-US"),
          };

          const notification = new Notification(notificationData);
          await notification.save();

          await fcm.send(payload, function (err, response) {
            if (err) {
              console.log("Something has gone wrong!", err);
            }
          });

          chatTopic.chat = chat._id;
          await chatTopic.save();
        }
        //add gift in user history

        //entry in receiver
        const income = new Wallet();
        income.userId =
          chatTopic.senderUserId === data.senderId
            ? chatTopic.receiverUserId
            : data.senderId;
        income.otherUserId =
          chatTopic.senderUserId === data.senderId
            ? data.senderId
            : chatTopic.receiverUserId;
        income.type = 0;
        income.isIncome = true;
        income.diamond = data.coin;
        income.date = new Date().toLocaleString("en-US");
        await income.save();

        //entry in sender
        const outgoing = new Wallet();
        outgoing.userId =
          chatTopic.senderUserId === data.senderId
            ? data.senderId
            : chatTopic.receiverUserId;
        outgoing.otherUserId =
          chatTopic.senderUserId === data.senderId
            ? chatTopic.receiverUserId
            : data.senderId;
        outgoing.type = 0;
        outgoing.isIncome = false;
        outgoing.coin = data.coin;
        outgoing.date = new Date().toLocaleString("en-US");
        await outgoing.save();

        console.log("Gift Data", data_);

        //emit msg in chat room
        io.in(chatRoom).emit("chat", data_);
      }
    } else if (data.messageType === 0) {
      const chatTopic = await ChatTopic.findById(data.topic);
      if (chatTopic) {
        const chat = new Chat();
        chat.senderId = data.senderId;
        chat.messageType = 0;
        chat.message = data.message;
        chat.image = null;
        chat.topic = chatTopic._id;
        chat.date = new Date().toLocaleString("en-US");

        await chat.save();

        let data_ = {};
        if (chat) {
          //chat time
          let time = "";
          time =
            now.diff(chat.date, "minute") <= 60 &&
            now.diff(chat.date, "minute") >= 0
              ? now.diff(chat.date, "minute") + " minutes ago"
              : now.diff(chat.date, "hour") >= 24
              ? now.diff(chat.date, "day") >= 30
                ? now.diff(chat.date, "month") + " months ago"
                : now.diff(chat.date, "day") + " days ago"
              : now.diff(chat.date, "hour") + " hours ago";

          data_ = {
            ...chat._doc,
            time: time === "0 minutes ago" ? "now" : time,
          };
        }
        var receiverUserIds;
        if (chatTopic.senderUserId.toString() === data.senderId.toString()) {
          receiverUserIds = chatTopic.receiverUserId;
        } else {
          receiverUserIds = chatTopic.senderUserId;
        }
        const receiverUser = await User.findById(receiverUserIds);

        const senderUser = await User.findById(data.senderId);

        console.log("chatTopic", chatTopic);
        console.log("senderUser", senderUser);
        console.log("receiverUser", receiverUser);

        if (
          receiverUser &&
          !receiverUser.isBlock &&
          receiverUser.notification
        ) {
          const payload = {
            to: receiverUser.fcm_token,
            notification: {
              body: chat.message,
              title: senderUser.name,
            },
            data: {
              data: {
                topic: chatTopic._id,
                message: chat.message,
                date: chat.date,
                chatDate: chat.date,
                userId: senderUser._id,
                name: senderUser.name,
                username: senderUser.username,
                image: senderUser.profileImage,
                time: "Just Now",
              },
              type: "MESSAGE",
            },
          };

          notificationData = {
            userId: receiverUser._id,
            otherUserId: senderUser._id,
            notificationType: 5,
            message: `${senderUser.name}: ${chat.message}`,
            date: new Date().toLocaleString("en-US"),
          };

          const notification = new Notification(notificationData);
          await notification.save();

          await fcm.send(payload, function (err, response) {
            if (err) {
              console.log("Something has gone wrong!", err);
            }
          });
          chatTopic.chat = chat._id;
          await chatTopic.save();
        }

        console.log("Data", data_);

        io.in(chatRoom).emit("chat", data_);
      }
    } else {
      io.in(chatRoom).emit("chat", data);
    }
  });

  socket.on("disconnect", async () => {
    const user = await User.findById(userRoom);
    console.log("user", user);
    if (user) {
      user.isOnline = false;
      await user.save();
    }
  });
});


// Prevent the server to down the app

var myErrorHandler = function(err,req,next,res){
  
  if(err){
    // console.log('testttt')
    console.log(err);
    // return res
    // .status(200)
    // .json({ status: false, message: "User Does not Exist" });
    
  }
  else{
    next();
  }

};
process.on('uncaughtException',myErrorHandler)




server.listen(config.PORT, () => {
  console.log("Magic happens on port: " + config.PORT);
});
