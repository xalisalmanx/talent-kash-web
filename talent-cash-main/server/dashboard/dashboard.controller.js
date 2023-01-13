const User = require("../user/user.model");
const Reel = require("../reels/reels.model");
const CoinPlan = require("../coinPlan/coinPlan.model");
const Redeem = require("../redeem/redeem.model");
const Wallet = require("../wallet/wallet.model");
const Booking = require("../booking/booking.model");
const AppDownload = require("../appDownload/appDownload.model");

exports.dashboard = async (req, res) => {
  try {
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
      {
        $addFields: {
          analyticDate: {
            $toDate: { $arrayElemAt: [{ $split: ["$analyticDate", ", "] }, 0] },
          },
        },
      },
      { $match: dateFilterQuery },
      {
        $facet: {
          user: [{ $group: { _id: "$analyticDate", count: { $sum: 1 } } }],
        },
      },
      { $addFields: { totalUser: { $sum: "$user.count" } } },
    ]);

    const reel = await Reel.aggregate([
      {
        $addFields: {
          analyticDate: {
            $toDate: { $arrayElemAt: [{ $split: ["$date", ", "] }, 0] },
          },
        },
      },
      {
        $match: dateFilterQuery,
      },
      {
        $facet: {
          reel: [{ $group: { _id: "$analyticDate", count: { $sum: 1 } } }],
        },
      },
      { $addFields: { totalReel: { $sum: "$reel.count" } } },
    ]);

    const revenue = await Wallet.aggregate([
      { $match: { type: 2 } },
      {
        $addFields: {
          analyticDate: {
            $toDate: { $arrayElemAt: [{ $split: ["$date", ", "] }, 0] },
          },
        },
      },
      { $match: dateFilterQuery },
      {
        $lookup: {
          from: "coinplans",
          localField: "planId",
          foreignField: "_id",
          as: "plan",
        },
      },
      {
        $unwind: { path: "$plan", preserveNullAndEmptyArrays: false },
      },
      {
        $project: {
          _id: 0,
          dollar: "$plan.dollar",
          analyticDate: 1,
        },
      },
      {
        $facet: {
          revenue: [
            { $group: { _id: "$analyticDate", total: { $sum: "$dollar" } } },
          ],
        },
      },
      { $addFields: { totalRevenue: { $sum: "$revenue.total" } } },
    ]);

    const withdraw = await Wallet.aggregate([
      { $match: { type: 4 } },
      {
        $addFields: {
          analyticDate: {
            $toDate: { $arrayElemAt: [{ $split: ["$date", ", "] }, 0] },
          },
        },
      },
      { $match: dateFilterQuery },
      {
        $project: {
          dollar: { $multiply: ["$diamond", "$convertRate"] },
          analyticDate: -1,
        },
      },
      {
        $facet: {
          withdraw: [
            { $group: { _id: "$analyticDate", total: { $sum: "$dollar" } } },
          ],
        },
      },
      { $addFields: { totalWithdraw: { $sum: "$withdraw.total" } } },
    ]);
    //by umar
    const talent = await Booking.aggregate([
      { $match: { status: 1 } },
      {
        $addFields: {
          analyticDate: {
            $toDate: { $arrayElemAt: [{ $split: ["$date", ", "] }, 0] },
          },
        },
      },
      { $match: dateFilterQuery },
      {
        $lookup: {
          from: "reels",
          localField: "reelId",
          foreignField: "_id",
          as: "reel",
        },
      },
      {
        $unwind: { path: "$reel", preserveNullAndEmptyArrays: false },
      },
      {
        $project: {
          _id: 0,
          dollar: "$reel.remaining_price",
          analyticDate: 1,
        },
      },
      {
        $facet: {
          revenue: [
            { $group: { _id: "$analyticDate", total: { $sum: "$dollar" } } },
          ],
        },
      },
      { $addFields: { totalTalentEarning: { $sum: "$revenue.total" } } },
    ]);

    const talentCashShare = await Booking.aggregate([
      { $match: { status: 1 } },
      {
        $addFields: {
          analyticDate: {
            $toDate: { $arrayElemAt: [{ $split: ["$date", ", "] }, 0] },
          },
        },
      },
      { $match: dateFilterQuery },
      {
        $lookup: {
          from: "reels",
          localField: "reelId",
          foreignField: "_id",
          as: "reel",
        },
      },
      {
        $unwind: { path: "$reel", preserveNullAndEmptyArrays: false },
      },
      {
        $project: {
          _id: 0,
          dollar: "$reel.initial_price",
          analyticDate: 1,
        },
      },
      {
        $facet: {
          revenue: [
            { $group: { _id: "$analyticDate", total: { $sum: "$dollar" } } },
          ],
        },
      },
      { $addFields: { totalTalentCashShareEarning: { $sum: "$revenue.total" } } },
    ]);

    //by umar//
    var start = new Date();
        start.setHours(0,0,0,0);
    var end = new Date();
        end.setHours(23,59,59,999);
    var todayDate = {};
    todayDate = {
      createdAt: {$gte: start, $lt: end},
    };
        
    const todayTotalBooking = await Booking.aggregate([
      { $match: { status: 0 } },
      {
        $addFields: {
          analyticDate: {
            $toDate: { $arrayElemAt: [{ $split: ["$analyticDate", ", "] }, 0] },
          },
        },
      },
      { $match: todayDate },
      {
        $facet: {
          book: [{ $group: { _id: "$analyticDate", count: { $sum: 1 } } }],
        },
      },
      { $addFields: { todayBookings : { $sum: "$book.count" } } },
    ]);

    const appDownload = await AppDownload.find({ isDelete: false }).sort({
      createdAt: -1,
    });


    const dashboard = {
      user: {
        user: user[0].user.length > 0 ? user[0].user : 0,
        totalUser: user[0].totalUser,
      },
      reel: {
        reel: reel[0].reel.length > 0 ? reel[0].reel : 0,
        totalReel: reel[0].totalReel,
      },
      revenue: {
        revenue: revenue[0].revenue.length > 0 ? revenue[0].revenue : 0,
        totalRevenue: revenue[0].totalRevenue,
      },
      withdraw: {
        withdraw: withdraw[0].withdraw.length > 0 ? withdraw[0].withdraw : 0,
        totalWithdraw: withdraw[0].totalWithdraw,
      },
      talent: {
        talent: talent[0].revenue.length > 0 ? talent[0].revenue : 0,
        // totalRevenue: revenue[0].totalRevenue,
        totalTalentEarning: talent[0].totalTalentEarning,
      },
      talentCashShare: {
        talentCashShare: talentCashShare[0].revenue.length > 0 ? talentCashShare[0].revenue : 0,
        // totalRevenue: revenue[0].totalRevenue,
        totalTalentCashShareEarning: talentCashShare[0].totalTalentCashShareEarning,
      },
      todayTotalBooking: {
        //todayTotalBooking: todayTotalBooking[0].todayBookings.length > 0 ? talentCashShare[0].todayBookings : 0,
        // totalRevenue: revenue[0].totalRevenue,
        todayBookings : todayTotalBooking[0].todayBookings,
      },
      appDownload: {
        android: appDownload[0].androidDownload,
        ios: appDownload[0].iosDownload,
      },
      total:
        user[0].totalUser +
        reel[0].totalReel +
        revenue[0].totalRevenue +
        withdraw[0].totalWithdraw +
        talent[0].totalTalentEarning +
        talentCashShare[0].totalTalentCashShareEarning,
    };

    return res
      .status(200)
      .json({ status: true, message: "Success!", dashboard });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server error!",
    });
  }
};
