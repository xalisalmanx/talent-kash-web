//Redux
import { combineReducers } from "redux";

//Define All the Reducers
import adminReducer from "./Admin/admin.reducer";
import advertisementReducer from "./advertisement/reducer";
import bannerReducer from "./banner/reducer";
import coinPlanReducer from "./coinPlan/reducer";
import dashboardReducer from "./Dashboard/dashboard.reducer";
import followerReducer from "./Follower/follower.reducer";
import giftReducer from "./Gift/gift.reducer";
import hashtagReducer from "./Hashtag/hashtag.reducer";
import historyReducer from "./History/history.reducer";
import redeemReducer from "./Redeem/redeem.reducer";
import reelReducer from "./Reels/reel.reducer";
import settingReducer from "./setting/setting.reducer";
import songReducer from "./song/reducer";
import spinnerReducer from "./spinner/reducer";
import stickerReducer from "./sticker/reducer";
import userReducer from "./User/user.reducer";
import diamondPlanReducer from "./diamondPlan/reducer";
import redeemPlanReducer from "./RedeemPlan/reducer";

export default combineReducers({
  admin: adminReducer,
  reel: reelReducer,
  user: userReducer,
  hashtag: hashtagReducer,
  song: songReducer,
  banner: bannerReducer,
  gift: giftReducer,
  follower: followerReducer,
  spinner: spinnerReducer,
  setting: settingReducer,
  history: historyReducer,
  redeem: redeemReducer,
  dashboard: dashboardReducer,
  sticker: stickerReducer,
  advertisement: advertisementReducer,
  coinPlan: coinPlanReducer,
  diamondPlan: diamondPlanReducer,
  redeemPlan: redeemPlanReducer,
});
