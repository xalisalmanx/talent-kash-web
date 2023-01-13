//model
const User = require("./user.model");
const Follower = require("../Follower/follower.model");
const Block = require("../block/block.model"); //blocked by other profile
const Wallet = require("../wallet/wallet.model");
//fs
const fs = require("fs");

//moment
const date = require("luxon");

//deleteFile
const { deleteFile } = require("../../util/deleteFile");

//config
const config = require("../../config");
var sendSms = require("../../util/smsApi");

//bcrypt
const bcrypt = require("bcryptjs");
const { debug } = require("console");

//jwt token
const jwt = require("jsonwebtoken");

//get user list[backend]
exports.index = async (req, res) => {
  try {
    var matchQuery = {};

    const start = req.query.start ? parseInt(req.query.start) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    if (req.query.search) {
      if (req.query.search !== "") {
        matchQuery = {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { username: { $regex: req.query.search, $options: "i" } },
          ],
        };
      }
    }
    let dateFilterQuery = {};
    let sDate, eDate;
    if (req.query.startDate !== "ALL" && req.query.endDate !== "ALL") {
      sDate = req.query.startDate + "T00:00:00.000Z";
      eDate = req.query.endDate + "T00:00:00.000Z";

      //for date query
      dateFilterQuery = {
        analyticDate: { $gte: new Date(sDate), $lte: new Date(eDate) },
      };
    }

    const user = await User.aggregate([
      { $match: matchQuery },
      {
        $addFields: {
          analyticDate: {
            $toDate: { $arrayElemAt: [{ $split: ["$analyticDate", ", "] }, 0] },
          },
        },
      },

      {
        $match: dateFilterQuery,
      },

      {
        $sort: { analyticDate: -1 },
      },
      {
        $facet: {
          user: [
            { $skip: (start - 1) * limit }, // how many records you want to skip
            { $limit: limit },
          ],
          pageInfo: [
            { $group: { _id: null, totalRecord: { $sum: 1 } } }, // get total records count
          ],
        },
      },
    ]);
    return res.status(200).json({
      status: true,
      message: "Success !",
      user: user[0].user,
      totalUser:
        user[0].pageInfo.length > 0 ? user[0].pageInfo[0].totalRecord : 0,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};

//get all user list without analytic
exports.get = async (req, res) => {
  try {
    const user = await User.find();
    return res.status(200).json({
      status: true,
      message: "Success",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};
//get Random Records ( umar )
exports.getRandomUser = async (req, res) => {
  try {
    const user = await User.aggregate([
      // { $match: matchQuery },
      {
        $sample: {
           size: 6
        }
     },
    ])
    return res.status(200).json({
      status: true,
      message: "Success",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};

//create user or login user
exports.store = async (req, res) => {
  try {
    // console.log(req.body.email);
    if (!req.body.email || !req.body.identity)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });
    if (!req.body.name || !req.body.username)
      return res
        .status(200)
        .json({ status: true, message: "name and username is require" });
    
    req.body.name = clean(req.body.name);
    req.body.username = cleanAndCheckUsername(req.body.username);
    console.log(req.body.name);
    console.log(req.body.username);
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      const user = await userFunction(userExist, req);
      return res
        .status(200)
        .json({ status: true, message: "Successful!", user });
    }
    const userNameExist = await User.find({
      username: req.body.username,
    }).countDocuments();
    if (userNameExist > 0) {
      return res
        .status(200)
        .json({ status: false, message: "Username already taken!" });
    }

    const newUser = new User();
    const user = await userFunction(newUser, req);

    return res
      .status(200)
      .json({ status: true, message: "Login Success!!", user });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error ! ",
    });
  }
};

//user function
const userFunction = async (user, data_) => {

  const Last_User_Record = await User.find().sort({ $natural: -1 }).limit(1);
  if(!Last_User_Record || !Last_User_Record[0].user_id)
  {
    var user_id = 'TCU-'+'1'.padStart(5, '0');//first user id in case of no user id available
  }
  else
  {
    var last_user_id = Last_User_Record[0].user_id.split("-");
    var u_val = parseInt(last_user_id[1]) + 1;
    var user_id = 'TCU-'+u_val.toString().padStart(5, '0');
  }

  user.user_id = user_id;

  const data = data_.body;
  const file = data_.file;
  user.name = data.name ? data.name : user.name;
  user.identity = data.identity;
  user.loginType = data.loginType ? data.loginType : user.loginType;
  user.username = data.username ? data.username : user.username;
  user.email = data.email;
  user.profileImage = !file ? `${config.baseURL}storage/female.png` : file.location;
  user.gender = data.gender ? data.gender : user.gender;
  user.fcm_token = data.fcm_token;
  user.coin = data.coin ? data.coin : 0;//quick login
  user.lastLogin = new Date().toLocaleString("en-US");

  await user.save();

  const token = jwt.sign(
    { user_id: user._id, user_email : user.email },
    config.jwtToken
    // {
    //   expiresIn: "2h",
    // }
  );

  user.jwtToken = token;
  //by umar
  const wallet = new Wallet();
  wallet.userId = user._id;
  wallet.type = 0;//SIGN up gift
  wallet.coin = user.coin;
  wallet.date = new Date().toLocaleString("en-US");
  await wallet.save();

  return user;
};

// check username is already exist or not
exports.checkUsername = async (req, res) => {
  try {
    if (!req.query.username)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });

    User.findOne({
      username: { $regex: req.query.username, $options: "i" },
    }).exec((error, user) => {
      if (error)
        return res
          .status(200)
          .json({ status: false, message: "Internal Server Error" });
      else {
        if (user) {
          return res
            .status(200)
            .json({ status: false, message: "Username already taken!" });
        } else
          return res.status(200).json({
            status: true,
            message: "Username generated successfully!",
          });
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// update profile of user
exports.updateProfile = async (req, res) => {
  try {
    
    if (!req.body.userId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });
    const user = await User.findById(req.body.userId);

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });

    if (req.files.coverImage) {
      if (user.coverImage) {
        const coverImage_ = user.coverImage.split("storage");
        if (coverImage_) {
          if (coverImage_[1] == "/female.png" || coverImage_[1] == "/male.png"){}
          else{
            if (fs.existsSync("storage" + coverImage_[1])) {
              fs.unlinkSync("storage" + coverImage_[1]);
            }
          }
            
        }
      }
      user.coverImage = req.files.coverImage[0].location;
    }

    if (req.files.profileImage) {
      if (user.profileImage) {
        const profileImage_ = user.profileImage.split("storage");
        if (profileImage_) {
          if(profileImage_[1] == "/female.png" || profileImage_[1] == "/male.png"){}
          else{
            if (fs.existsSync("storage" + profileImage_[1])) {
              fs.unlinkSync("storage" + profileImage_[1]);
            }
          }
         
        }
      }
      user.profileImage = req.files.profileImage[0].location;
    }

    req.body.name = clean(req.body.name);
    req.body.username = cleanAndCheckUsername(req.body.username);

    user.name = req.body.name && req.body.name;
    user.username = req.body.username && req.body.username;
    user.bio = req.body.bio && req.body.bio;
    user.gender = req.body.gender && req.body.gender;

    await user.save();

    return res.status(200).json({ status: true, message: "Success!!", user });
  } catch (error) {
    if (req.files.coverImage) deleteFile(req.files.coverImage[0]);
    if (req.files.profileImage) deleteFile(req.files.profileImage[0]);
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//get user profile who login
exports.getProfile = async (req, res) => {
  try {
    if (!req.query.userId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details !" });

    const userExist = await User.findById(req.query.userId);
    if (!userExist)
      return res
        .status(200)
        .json({ status: false, message: "User Does Not Exist !" });

    const user = await User.aggregate([
      { $match: { _id: userExist._id } },
      // {
      //   $lookup: {
      //     from: "reels",
      //     let: { userIds: "$_id" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [
      //               { $eq: ["$userId", "$$userIds"] },
      //               { $eq: ["$isDelete", false] },
      //             ],
      //           },
      //         },
      //       },
      //     ],
      //     as: "reel",
      //   },
      // },
      
      { $project : { _id : 0 , ad: 0, analyticDate : 0, diamond: 0 , requestForWithdrawDiamond : 0,  isOnline : 0, loginType: 0, socialId:0, gift :0, lastLogin:0, password:0,identity:0} } ,
    ]);

    console.log(user[0]);
    return res
      .status(200)
      .json({ status: true, message: "Success!!", user: user[0] });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//get user profile who search by login user
exports.getOtherProfile = async (req, res) => {
  try {
    if (!req.query.fromUserId)
      return res
        .status(200)
        .json({ status: false, message: "From User Id Required !" });
    if (!req.query.toUserId)
      return res
        .status(200)
        .json({ status: false, message: "To User Id Required !" });

    const fromUser = await User.findById(req.query.fromUserId);
    const toUser = await User.findById(req.query.toUserId);

    if (!fromUser)
      return res
        .status(200)
        .json({ status: false, message: "From User Not Exist !" });
    if (!toUser)
      return res
        .status(200)
        .json({ status: false, message: "To User Not Exist !" });

    const isFollow = await Follower.exists({
      $and: [{ fromUserId: fromUser._id }, { toUserId: toUser._id }],
    });

    const isBlockedbyYou = await Block.exists({
      $and: [{ fromUserId: fromUser._id }, { toUserId: toUser._id }],
    });

    const user = await User.aggregate([
      {
        $match: { _id: toUser._id },
      },
      // {
      //   $lookup: {
      //     from: "reels",
      //     let: { userIds: "$_id" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [
      //               { $eq: ["$userId", "$$userIds"] },
      //               { $eq: ["$isDelete", false] },
      //             ],
      //           },
      //         },
      //       },
      //     ],
      //     as: "reel",
      //   },
      // },
      {
        $addFields: { isFollow: isFollow , isBlockedbyYou: isBlockedbyYou },
      },
    ]);
    return res
      .status(200)
      .json({ status: true, message: "Success!", user: user[0] });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//user block or unblock
exports.isBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "user does not Exist!" });

    user.isBlock = !user.isBlock;
    await user.save();

    return res.status(200).json({ status: true, message: "account deleted!", user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
//user notification  on off (android)
exports.notification = async (req, res) => {
  try {
    const user = await User.findById(req.query.userId);

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "user does not Exist!" });

    user.notification = !user.notification;
    await user.save();

    return res.status(200).json({ status: true, message: "Success!", user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//search user
exports.search = async (req, res) => {
  try {
    const user = await User.find({
      $or: [
        { name: { $regex: req.body.search, $options: "i" } },
        { username: { $regex: req.body.search, $options: "i" } },
      ],
    })
      .skip(req.query.start ? parseInt(req.query.start) : 0)
      .limit(req.query.limit ? parseInt(req.query.limit) : 10);
    return res.status(200).json({ status: true, message: "Success!", user });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//get trending user list
exports.getTrendingUser = async (req, res) => {
  try {
    if (!req.query.userId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details" });
    const user = await User.findById(req.query.userId);

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "user does not Exist!" });

    const follower = await Follower.find({ fromUserId: user._id });

    const user_ = await User.aggregate([
      {
        $match: {
          $and: [
            { _id: { $nin: follower.map((d) => d.toUserId) } },
            { _id: { $ne: user._id } },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: 1,
          username: 1,
          gender: 1,
          profileImage: 1,
          bio: 1,
          like: 1,
          view: 1,
        },
      },
      {
        $sort: { like: -1, view: -1 },
      },
      {
        $facet: {
          user: [
            { $skip: req.query.start ? parseInt(req.query.start) : 0 }, // how many records you want to skip
            { $limit: req.query.limit ? parseInt(req.query.limit) : 20 },
          ],
        },
      },
    ]);

    return res.status(200).json({
      status: true,
      message: " Success !",
      user: user_[0].user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//user Online
exports.isOnline = async (req, res) => {
  try {
    if (!req.query.userId)
      return res
        .status(200)
        .json({ status: false, message: "invalid Details!" });
    const user = await User.findById(req.query.userId);
    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User Doesn't Exist" });
    user.isOnline = true;
    user.save();

    return res.status(200).json({ status: true, message: "Success", user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Internal Server Error" });
  }
};

//user search for [android]
exports.searchUser = async (req, res) => {
  try {
    if (!req.body.userId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });
    const user = await User.findById(req.body.userId);
    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "user Doesn't exist!" });

    const search = await User.aggregate([
      {
        $match: {
          $and: [
            { _id: { $ne: user._id } },
            {
              $or: [
                { name: { $regex: req.body.search, $options: "i" } },
                { username: { $regex: req.body.search, $options: "i" } },
              ],
            },
          ],
        },
      },

      {
        $lookup: {
          from: "followers",
          localField: "_id",
          foreignField: "toUserId",
          as: "follower",
        },
      },
      {
        $unwind: { path: "$follower", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          isFollow: {
            $cond: {
              if: { $eq: [user._id, "$follower.fromUserId"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          follower: 0,
        },
      },
      {
        $facet: {
          search: [
            { $skip: req.body.start ? parseInt(req.body.start) : 0 }, // how many records you want to skip
            { $limit: req.body.limit ? parseInt(req.body.limit) : 20 },
          ],
        },
      },
    ]);
    return res.status(200).json({
      status: true,
      message: "Success",
      search: search[0].search,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error !",
    });
  }
};

//get user by username
exports.userByUserName = async (req, res) => {
  try {
    if (!req.query.userId)
      return res
        .status(200)
        .json({ status: false, message: "From User Id Required !" });
    if (!req.query.username)
      return res
        .status(200)
        .json({ status: false, message: "Username is Required !" });

    const fromUser = await User.findById(req.query.userId);
    const toUser = await User.findOne({ username: req.query.username });

    if (!fromUser)
      return res
        .status(200)
        .json({ status: false, message: "From User Not Exist !" });
    if (!toUser)
      return res
        .status(200)
        .json({ status: false, message: "To User Not Exist !" });

    const isFollow = await Follower.exists({
      $and: [{ fromUserId: fromUser._id }, { toUserId: toUser._id }],
    });

    const user = await User.aggregate([
      {
        $match: { _id: toUser._id },
      },
      {
        $lookup: {
          from: "reels",
          let: { userIds: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$userIds"] },
                    { $eq: ["$isDelete", false] },
                  ],
                },
              },
            },
          ],
          as: "reel",
        },
      },
      {
        $addFields: { isFollow: isFollow },
      },
    ]);
    return res
      .status(200)
      .json({ status: true, message: "Success!", user: user[0] });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//addORLessDiamondAndCoin
exports.addORLessDiamondAndCoin = async (req, res) => {
  try {
    if (!req.body.userId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details" });

    const user = await User.findById(req.body.userId);
    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User Does not Exist !" });
    if (
      (req.body.coin && parseInt(req.body.coin) === user.coin) ||
      (req.body.diamond && parseInt(req.body.diamond) === user.diamond)
    )
      return res.status(200).json({ status: true, message: "Success!!", user });

    const wallet = new Wallet();

    if (req.body.coin) {
      if (user.coin > req.body.coin) {
        // put entry on history in outgoing
        wallet.isIncome = false;
        wallet.coin = user.coin - req.body.coin;
      } else {
        // put entry on history in income
        wallet.isIncome = true;
        wallet.coin = req.body.coin - user.coin;
      }
      user.coin = req.body.coin;
    }
    if (req.body.diamond) {
      if (user.diamond > req.body.diamond) {
        // put entry on history in outgoing
        wallet.isIncome = false;
        wallet.diamond = user.diamond - req.body.diamond;
      } else {
        // put entry on history in income
        wallet.isIncome = true;
        wallet.diamond = req.body.diamond - user.diamond;
      }
      user.diamond = req.body.diamond;
    }
    await user.save();

    wallet.userId = user._id;
    wallet.type = 5;
    wallet.date = new Date().toLocaleString("en-US");
    await wallet.save();

    return res.status(200).json({ status: true, message: "Success!!", user });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};


//By Umar (06-09-22)
// update role of user //default will be user
exports.updateUserRole = async (req, res) => {
  
  try {
    console.log(req.body.user_role);
    console.log("userId", req.body.userId);
    if (!req.body.userId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });
    const user = await User.findById(req.body.userId);

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });

    user.user_role = req.body.user_role ? req.body.user_role : null;;

    await user.save();

    return res.status(200).json({ status: true, message: "Success!!", user });
  } catch (error) {
    
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//update user number 
exports.updateUserInfo = async (req, res) => {
  try {
      if (!req.body.userId)
        return res
          .status(200)
          .json({ status: false, message: "Invalid Details!" });
      const user = await User.findById(req.body.userId);
  
      if (!user)
        return res
          .status(200)
          .json({ status: false, message: "User does not Exist!" });
      
      if (!req.body.phone_number)
      {
          const user_phone_record = await User.findOne({ user_phone : req.body.phone_number});
          if (user_phone_record)
            return res
              .status(200)
              .json({ status: false, message: "Same Number already Exist!" });
      }

      req.body.name = clean(req.body.name);
  
      user.user_role = req.body.user_role ? req.body.user_role : null;
      user.name = req.body.name ? req.body.name : user.name;
      user.user_phone = req.body.phone_number ? req.body.phone_number : null;
      //user.is_number_verify = req.body.is_number_verify ? req.body.is_number_verify : false;
  
      //res.send(user);
      //console.log(user);
  
      await user.save();
  
      return res.status(200).json({ status: true, message: "Success!!", user });
    } catch (error) {
      
      console.log(error);
      return res
        .status(500)
        .json({ status: false, error: error.message || "Server Error" });
    }
};

//check user number exists..
exports.checkNumberExist = async (req, res) => {
  try {

      if (!req.body.userNumber)
        return res
          .status(200)
          .json({ status: false, message: "Invalid Details!" });
      const user = await User.findOne({ user_phone : req.body.userNumber});
  
      if (!user)
        return res
          .status(200)
          .json({ status: false, message: "Number does not Exist!" });
  
      return res.status(200).json({ status: true, message: "Success!!",user} );
    } catch (error) {
      
      console.log(error);
      return res
        .status(500)
        .json({ status: false, error: error.message || "Server Error" });
    }
};
// send OTP
exports.generateOTP = async (req, res) => {
  try {
      var number =  req.body.userNumber;
      var number =number.replace(/^0+/, '');
      console.log(number);
      if (!number)
        return res
          .status(200)
          .json({ status: false, message: "User Number is required" });
      
          
      var randomNumber = Math.floor(1000 + Math.random() * 9000);

      const result = await sendSms(number,'Your OTP code is:'+randomNumber+'. Please do not share this any one.');


      return res.status(200).json({ status: true, message: "Success!!",otp:randomNumber});
    } catch (error) {
      
      console.log(error);
      return res
        .status(500)
        .json({ status: false, error: error.message || "Server Error" });
    }
};
//login with number
exports.loginWithNumber = async (req, res) => {
  try {
      if (!req.body.userNumber)
        return res
          .status(200)
          .json({ status: false, message: "Invalid Detail!" });

      if (!req.body.password)
        return res
          .status(200)
          .json({ status: false, message: "passowrd field is required!" });

      if (!req.body.fcm_token)
          return res
            .status(200)
            .json({ status: false, message: "fcm_token field is required!" });

      const user = await User.findOne({ user_phone : req.body.userNumber});
        
  
      if (!user)
        return res
          .status(200)
          .json({ status: false, message: "Number does not Exist!",user:{} });
      
      const validPassword = bcrypt.compareSync(req.body.password, user.password);

          if (!validPassword)
            return res
              .status(200)
              .json({ status: false, message: "Incorrect Password !" });
      
          if(user.isBlock === true)
            return res
                  .status(200)
                  .json({ status: false, message: "Your account is deleted. Please contact to admin  !!!" });
          
      // if (!req.body.fcm_token)
      // {
      //   return res.status(200).json({ status: true, message: "Success!!", user });
      // }

      user.fcm_token = req.body.fcm_token;
      const user_ = await user.save();

      const token = jwt.sign(
        { user_id: user._id, user_phone : user.user_phone },
        config.jwtToken
        // {
        //   expiresIn: "2h",
        // }
      );

      user_.jwtToken = token;
        console.log(token);
      // const user_ = await user.save();
      return res.status(200).json({ status: true, message: "Success!!", user : user_ });


    } catch (error) {
      
      console.log(error);
      return res
        .status(500)
        .json({ status: false, error: error.message || "Server Error" });
    }
};

//login with number
exports.forgotPassword = async (req, res) => {
  try {
      if (!req.body.userId || !req.body.newPass || !req.body.confirmPass)
        return res
          .status(200)
          .json({ status: false, message: "Invalid detail!" });

      const user = await User.findById(req.body.userId);  

      if (!user)
        return res
          .status(200)
          .json({ status: false, message: "user does not Exist!",user:{} });

      if (req.body.newPass !== req.body.confirmPass) {
        return res.status(200).json({
          status: false,
          message: "Oops ! New Password and Confirm Password doesn't match",
        });
      }

      let user_ = {};

      const hash = bcrypt.hashSync(req.body.newPass, 10);
      user_.password = hash;

      //console.log(hash);

      await User.updateOne(
        { _id: user._id },
        { $set: user_ }
      ).exec((error, user) => {
        if (error)
          return res.status(500).send({
            status: false,
            message: "Oops ! Internal server error",
          });
        else
          return res.status(200).send({
            status: true,
            message: "Password changed Successfully",
            //user
          });
      });


    } catch (error) {
      
      console.log(error);
      return res
        .status(500)
        .json({ status: false, error: error.message || "Server Error" });
    }
};

//manually signup API
exports.userSignup = async (req, res) => {
  try {

    
    if (!req.body.phone_number && !req.body.user_role && !req.body.name)
        return res
          .status(200)
          .json({ status: false, message: "Invalid Details!" });

      if(req.body.loginType == 3 && !req.body.password)
        return res
          .status(200)
          .json({ status: false, message: "Password field is required!" });
    
    // Remove special Characters from name
    req.body.name = clean(req.body.name);
    req.body.username = cleanAndCheckUsername(req.body.name);
    
    const user_phone_record = await User.findOne({ user_phone : req.body.phone_number});

    if (user_phone_record)
      return res
        .status(200)
        .json({ status: false, message: "Same Number already exist!", user:{}});

    if (req.body.user_email)
    {
      const userEmailExist = await User.findOne({ email: req.body.user_email });
      if (userEmailExist) 
      {
          return res
            .status(200)
            .json({ status: false, message: "Same email already exist!", user:{} });
      }  
    }    
    
    const newUser = new User();
    const user = await userSignupFunction(newUser, req);

    var randomNumber = Math.floor(1000 + Math.random() * 9000);

    return res
      .status(200)
      .json({ status: true, message: "Login Success!!", user, otp:randomNumber });
  } catch (error) {
    
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//user function
const userSignupFunction = async (user, data_) => {

  const Last_User_Record = await User.find().sort({ $natural: -1 }).limit(1);
  if(!Last_User_Record[0].user_id)
  {
    var user_id = 'TCU-'+'1'.padStart(5, '0');//first user id in case of no user id available
  }
  else
  {
    var last_user_id = Last_User_Record[0].user_id.split("-");
    var u_val = parseInt(last_user_id[1]) + 1;
    var user_id = 'TCU-'+u_val.toString().padStart(5, '0');
  }

  user.user_id = user_id;

  const data = data_.body;
  const file = data_.file;
  user.name = data.name ? data.name : 'Talent Case User';
  user.identity = data.user_email ? data.user_email : null; //data.identity
  user.loginType = data.loginType ? data.loginType : user.loginType;
  user.username = user.name ? user.name : user.username;
  user.email = data.user_email ? data.user_email : null;//data.email;
  user.password = data.password ? bcrypt.hashSync(data.password, 10) : null;//data.password;
  user.profileImage = !file ? `${config.baseURL}storage/female.png` : file.location; //baseurl will be deleted
  user.gender = data.gender ? data.gender : user.gender;
  user.fcm_token = data.fcm_token;
  user.lastLogin = new Date().toLocaleString("en-US");
  user.user_role = data.user_role ? data.user_role : 'user';
  if(user.user_role == 'talent_provider')
  {
    user.coin = data.coin ? data.coin : 4000; //default coin on signup
  }
  else
  {
    user.coin = 0;
  }
  user.user_phone = data.phone_number ? data.phone_number : null;
  user.social_id = data.social_id ? data.social_id : null;
  //user.is_number_verify = data.is_number_verify ? data.is_number_verify : false;

  //console.log(user);

  await user.save();
  // Create token
  const token = jwt.sign(
    { user_id: user._id, user_phone : user.user_phone },
    config.jwtToken
    // {
    //   expiresIn: "2h",
    // }
  );

  user.jwtToken = token;
  //by umar
  const wallet = new Wallet();
  wallet.userId = user._id;
  wallet.type = 0;//SIGN up gift
  wallet.coin = user.coin;
  wallet.date = new Date().toLocaleString("en-US");
  await wallet.save();

  return user;
};

exports.checkSocialUserExists = async (req, res) => {
  try {
   
      if (!req.body.social_id)
        return res
          .status(200)
          .json({ status: false, message: "Social Id is required!" });
          
      if (!req.body.loginType)
          return res
            .status(200)
            .json({ status: false, message: "login type is required!" });    

      var user = await User.findOne({ loginType:req.body.loginType,social_id:req.body.social_id});
  
  
      if (!user)
        return res
          .status(200)
          .json({ status: false, message: "Record not found!",user:{} });

        if(user.isBlock === true)
          return res
                .status(200)
                .json({ status: false, message: "Your account is deleted. Please contact to admin  !!!" });
      
      // if (!req.body.fcm_token)
      // {
      //   return res.status(200).json({ status: true, message: "User already registered",user });
      // }

      user.fcm_token = req.body.fcm_token;
      const user_ = await user.save();

      const token = jwt.sign(
        { user_id: user_._id, user_phone : user_.user_phone },
        config.jwtToken
        // {
        //   expiresIn: "2h",
        // }
      );

      user_.jwtToken = token;
      return res.status(200).json({ status: true, message: "User already registered", user:user_ });

    } catch (error) {
      
      console.log(error);
      return res
        .status(500)
        .json({ status: false, error: error.message || "Server Error" });
    }
};

//to empty fcm token after logout
exports.logout = async (req, res) => {
  try {
    // console.log(req.body.userId);
      if (!req.body.userId)
        return res
          .status(200)
          .json({ status: false, message: "Invalid Details!" });
      const user = await User.findById(req.body.userId);
  
      if (!user)
        return res
          .status(200)
          .json({ status: false, message: "User does not Exist!" });

      
      user.fcm_token = "";
  
      await user.save();

      return res.status(200).json({ status: true, message: "Success!!" });
    } catch (error) {
      
      console.log(error);
      return res
        .status(500)
        .json({ status: false, error: error.message || "Server Error" });
    }
};

//Report user from other user
exports.reportUser = async (req, res) => {
  try {
    if (!req.body.userId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details" });
    const user = await User.findById(req.body.userId);
    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "user does not Exist!" });
    
    user.isReport = true;

    await user.save();
    return res
      .status(200)
      .json({ status: true, message: "User Reported Successfully!!" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//delete account by user himself
exports.userDeleteAccount = async (req, res) => {
  try {
    if (!req.query.userId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });
    const user = await User.findById(req.query.userId);

    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "user does not Exist!" });

    user.isBlock = !user.isBlock;
    await user.save();

    return res.status(200).json({ status: true, message: "Account deleted!", user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }

  
};

function clean(name){
  return name.replace(/[^A-Z0-9]+/ig, " ");
}
function cleanAndCheckUsername(name){
  name = name.replace(/[^A-Z0-9]/ig, "");
  const userNameExist = User.find({
    username: name,
  }).countDocuments();
  if (userNameExist > 0) {
    var randomNumber = Math.floor(1000 + Math.random() * 9000);
    return name+randomNumber;
  }
  else{
    return name;
  }
  
}