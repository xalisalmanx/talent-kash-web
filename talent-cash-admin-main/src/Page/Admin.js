import React, { useEffect } from "react";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";

//navbar
import Navbar from "../component/Navbar/Navbar";
//sidebar
import Sidebar from "../component/Navbar/Sidebar";
//subnavbar
// import SubNavbar from "../component/Navbar/SubNavbar";
import ReelTable from "../component/Table/ReelTable";
import ReportedReelTable from "../component/Table/ReportedReelTable"; //by umar
//css
import "../bootstrap/css/bootstrap.min.css";
import "../assets/css/plugins.css";
import "../assets/css/structure.css";
import "../assets/css/elements/breadcrumb.css";

//js
import "../bootstrap/js/bootstrap.min";
import "../bootstrap/js/popper.min";
import "../assets/js/app";

//component
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import ReelInfo from "../component/Info/ReelInfo";
import UserTable from "../component/Table/UserTable";
import UserInfo from "../component/Info/UserInfo";
import HashtagTable from "../component/Table/HashtagTable";
import UserHistoryTable from "../component/Table/UserHistoryTable";
//By umar//
import UserBookingTable from "../component/Table/UserBookingTable";
import AppDownloadTable from "../component/Table/AppDownloadTable";
import ServiceTable from "../component/Table/ServiceTable";

//time-manager
import { IdleTimeoutManager } from "idle-timer-manager";

//image

import SongTable from "../component/Table/SongTable";
import SongDialog from "../component/Dialog/SongDialog";
import BannerTable from "../component/Table/BannerTable";
import GiftTable from "../component/Table/GiftTable";
import Add from "../component/Dialog/Gift/Add";

//loader
import Spinner from "./Spinner";
import Setting from "./Setting";
import RedeemTable from "../component/Table/RedeemTable";
import StickerTable from "../component/Table/StickerTable";
import Advertisement from "../component/Table/Advertisement";
import CoinPlan from "../component/Table/CoinPlan";
import RedeemPlan from "../component/Table/RedeemPlan";
import DiamondPlan from "../component/Table/DiamondPlan";
import { useSelector } from "react-redux";

const Admin = (props) => {
  const location = useRouteMatch();
  const history = useHistory();

  const { user } = useSelector((state) => state.admin);

  //session expire
  useEffect(() => {
    const manager = new IdleTimeoutManager({
      timeout: 1800, //expired after 10 secs
      onExpired: () => {
        history.push({
          pathname: "/expire",
          state: {
            token: localStorage.getItem("token"),
          },
        });
        localStorage.removeItem("token");
        localStorage.removeItem("key");
      },
    });

    return () => {
      manager.clear();
    }; // eslint-disable-next-line
  }, []);

  // var navData;

  useEffect(() => {
    if (history.location.pathname === "/admin") {
      history.push("/admin/dashboard");
    } // eslint-disable-next-line
  }, []);

  return (
    <>
      <Navbar />

      {/* <SubNavbar /> */}

      <div class="main-container" id="container">
        <div class="overlay"></div>
        <div class="search-overlay"></div>
        <Sidebar />
        <Switch>
          <Route
            path={`${location.path}/dashboard`}
            exact
            component={Dashboard}
          />
          <Route path={`${location.path}/reel`} exact component={ReelTable} />
          <Route
            path={`${location.path}/reel/reelInfo`}
            exact
            component={ReelInfo}
          />
          <Route path={`${location.path}/reportedReel`} exact component={ReportedReelTable} />
          
          <Route path={`${location.path}/user`} exact component={UserTable} />
          <Route
            path={`${location.path}/user/userInfo`}
            exact
            component={UserInfo}
          />
          <Route
            path={`${location.path}/user/history`}
            exact
            component={UserHistoryTable}
          />
          <Route
            path={`${location.path}/user/booking`}
            exact
            component={UserBookingTable}
          />
          <Route
            path={`${location.path}/hashtag`}
            exact
            component={HashtagTable}
          />
          <Route
            path={`${location.path}/redeem`}
            exact
            component={RedeemTable}
          />
          <Route path={`${location.path}/song`} exact component={SongTable} />
          <Route
            path={`${location.path}/song/dialog`}
            exact
            component={SongDialog}
          />
          <Route
            path={`${location.path}/banner`}
            exact
            component={BannerTable}
          />
          <Route path={`${location.path}/gift`} exact component={GiftTable} />
          <Route path={`${location.path}/gift/add`} exact component={Add} />
          <Route path={`${location.path}/setting`} exact component={Setting} />
          <Route
            path={`${location.path}/sticker`}
            exact
            component={StickerTable}
          />
          <Route path={`${location.path}/profile`} exact component={Profile} />
          <Route path={`${location.path}/ad`} exact component={Advertisement} />
          <Route
            path={`${location.path}/coinPlan`}
            exact
            component={CoinPlan}
          />
          <Route
            path={`${location.path}/diamondPlan`}
            exact
            component={DiamondPlan}
          />
          <Route
            path={`${location.path}/redeemPlan`}
            exact
            component={RedeemPlan}
          />
          <Route
            path={`${location.path}/appDownload`}
            exact
            component={AppDownloadTable}
          />
          <Route
            path={`${location.path}/serviceList`}
            exact
            component={ServiceTable}
          />
        </Switch>
        <Spinner />
      </div>
    </>
  );
};

export default Admin;
