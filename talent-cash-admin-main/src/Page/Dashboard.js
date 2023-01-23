/* eslint-disable array-callback-return */

import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { connect, useSelector } from "react-redux";
import { Link } from "react-router-dom";

//js
import "../assets/js/chart/canvasjs.min.js";
import CanvasJSReact from "../assets/js/chart/canvasjs.react";

//css

import "../assets/css/custom.css";

//action
import { getDashboard } from "../Store/Dashboard/dashboard.action";

//MUI icon
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

//Date Range Picker
import { DateRangePicker } from "react-date-range";

import { appName } from "../util/ServerPath";
//Calendar Css
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

//JQUERY
import $ from "jquery";

import dayjs from "dayjs";
import "chart.js/auto";
import { Doughnut } from "react-chartjs-2";

const Dashboard = (props) => {
  var CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const [data, setData] = useState([]);
  const [type, setType] = useState("ALL");

  const [date, setDate] = useState([]);
  const [sDate, setsDate] = useState("ALL");
  const [eDate, seteDate] = useState("ALL");

  var ignoreClickOnMeElement = document.getElementById("datePicker");
  document.addEventListener("click", function (event) {
    var isClickInsideElement = ignoreClickOnMeElement.contains(event.target);

    if (!isClickInsideElement) {
      $("#datePicker").removeClass("show");
    }
  });

  useEffect(() => {
    props.getDashboard(sDate, eDate); // eslint-disable-next-line
  }, [sDate, eDate]);

  const { dashboard } = useSelector((state) => state.dashboard);

  useEffect(() => {
    setData(dashboard);
  }, [dashboard]);

  useEffect(() => {
    if (date.length === 0) {
      setDate([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ]);
    }
    $("#datePicker").removeClass("show");
    setData(dashboard);
  }, [date, dashboard]);

  //for get all reel
  const getAll = () => {
    $("#datePicker").removeClass("show");
    setsDate("ALL");
    seteDate("ALL");
    setType("ALL");

    props.getDashboard("ALL", "ALL");
  };

  const collapsedDatePicker = () => {
    $("#datePicker").toggleClass("collapse");
  };

  // all about chart
  const date_ = new Date();
  const firstDay = sDate !== "ALL" ? sDate : new Date(date_.getFullYear(), 0);
  const lastDay = eDate !== "ALL" ? eDate : new Date(date_);

  const getDatesBetweenDates = (startDate, endDate) => {
    let dates = [];
    //to avoid modifying the original date
    const theDate = new Date(startDate);
    while (theDate < new Date(endDate)) {
      dates = [...dates, new Date(theDate)];
      theDate.setDate(theDate.getDate() + 1);
    }
    dates = [...dates, new Date(endDate)];

    return dates;
  };

  var labelsForUser = [];
  var userData_ = [];
  var userDate = [];
  var userData = [];
  var labelsForEarning = [];
  var earningData_ = [];
  var earningDate = [];
  var earningData = [];
  const label = getDatesBetweenDates(firstDay, lastDay);
  labelsForUser = label.map((label) => dayjs(label).format("DD MMM, YYYY"));
  labelsForEarning = label.map((label) => dayjs(label).format("DD MMM, YYYY"));

  data?.user?.user.length > 0 &&
    data?.user?.user.map((value) => {
      const date_ = dayjs(value?._id).format("DD MMM, YYYY").toString();
      userDate.push(date_);
      userData.push(value?.count);
    });

  data?.revenue?.revenue.length > 0 &&
    data?.revenue?.revenue.map((value) => {
      const date_ = dayjs(value?._id).format("DD MMM, YYYY").toString();
      earningDate.push(date_);
      earningData.push(value?.total);
    });

  labelsForUser.map((value) => {
    if (userDate.includes(value)) {
      userData_.push();
    }
  });
  labelsForEarning.map((value) => {
    if (earningDate.includes(value)) {
      earningData_.push();
    }
  });

  var arrayForUser = Array(labelsForUser.length).fill(0);
  var arrayForEarning = Array(labelsForUser.length).fill(0);

  for (var i = 0; i < labelsForUser.length; i++) {
    for (var j = 0; j < userDate.length; j++) {
      if (labelsForUser[i] === userDate[j]) {
        arrayForUser[i] = userData[j];
      }
    }
  }
  for (var k = 0; k < labelsForEarning.length; k++) {
    for (var l = 0; l < earningDate.length; l++) {
      if (labelsForEarning[k] === earningDate[l]) {
        arrayForEarning[k] = earningData[l];
      }
    }
  }

  const countForUser = {};

  for (const element of arrayForUser) {
    if (countForUser[element]) {
      countForUser[element] += 1;
    } else {
      countForUser[element] = 1;
    }
  }
  const countForEarning = {};

  for (const element of arrayForEarning) {
    if (countForEarning[element]) {
      countForEarning[element] += 1;
    } else {
      countForEarning[element] = 1;
    }
  }

  console.log("countForEarning -----------------------", countForEarning);

  var resultForUser = labelsForUser.map(function (x, i) {
    return { label: x, y: arrayForUser[i] };
  });

  console.log("resultForUser -----------------------", resultForUser);
  var resultForEarning = labelsForEarning.map(function (x, i) {
    return { label: x, y: arrayForEarning[i] };
  });

  console.log("resultForEarning -----------------------", resultForEarning);
  //canvas chart

  const optionForUser = {
    animationEnabled: true,
    exportEnabled: false,
    backgroundColor: "#1F2940",

    theme: "dark2", //"light1", "dark1", "dark2"
    title: {
      text: `User Chart`,
      fontSize: 20,
      fontColor: "#faf0e6",
    },

    dataPointWidth: 35,
    axisY: {
      includeZero: true,

      title: `Number Of User`,

      // labelFormatter: function (e) {
      //   if (type === "Revenue") {
      //     return "$ " + e.value;
      //   } else {
      //     return e.value;
      //   }
      // },
      labelFontSize: 10,
      titleMaxWidth: 200,
      titleFontColor: "#fffff0",
      titleFontSize: 12,
      margin: 10,
      labelAutoFit: true,
      titleFontWeight: "italic",
      titleFontFamily: "calibri",
      labelFontColor: "#faf0e6",
      lineThickness: 1,
      gridThickness: 0.1,
      tickLength: 1,
      lineColor: "#faf0e6",
    },
    axisX: {
      title: `Date`,
      titleMaxWidth: 200,
      titleFontColor: "#faf0e6",
      titleFontSize: 12,
      margin: 10,
      labelAutoFit: true,
      gridThickness: 0.1,
      labelMaxWidth: 70,
      labelFontColor: "#faf0e6",
      titleFontWeight: "italic",
      titleFontFamily: "calibri",
      labelTextAlign: "center",
      lineColor: "#faf0e6",

      lineThickness: 1,
      labelFontSize: 10,
      tickThickness: 1,
    },

    toolbar: {
      itemBackgroundColor: "#060818",
      itemBackgroundColorOnHover: "#060818",
      buttonBorderColor: "#eccaa0",
      buttonBorderThickness: 1,
      fontColor: "#d6d6d6",
      fontColorOnHover: "#d3d3d3",
    },
    data: [
      {
        type: "column", //change type to bar, line, area, pie, etc
        // indexLabel: "{y}", //Shows y value on all Data Points
        indexLabelFontColor: "#5A5757",
        indexLabelPlacement: "outside",
        dataPoints: resultForUser,
      },
    ],
  };
  const optionForEarning = {
    animationEnabled: true,
    exportEnabled: false,
    backgroundColor: "#1F2940",

    theme: "dark2", //"light1", "dark1", "dark2"
    title: {
      text: `Earning Chart`,
      fontSize: 20,
      fontColor: "#faf0e6",
    },
    dataPointWidth: 35,
    axisY: {
      includeZero: true,

      title: `Total Earning`,

      // labelFormatter: function (e) {
      //   if (type === "Revenue") {
      //     return "$ " + e.value;
      //   } else {
      //     return e.value;
      //   }
      // },
      labelFontSize: 10,
      titleMaxWidth: 200,
      titleFontColor: "#fffff0",
      titleFontSize: 12,
      margin: 10,
      labelAutoFit: true,
      titleFontWeight: "italic",
      titleFontFamily: "calibri",
      labelFontColor: "#faf0e6",
      lineThickness: 1,
      gridThickness: 0.1,
      tickLength: 1,
      lineColor: "#faf0e6",
    },
    axisX: {
      title: `Date`,
      titleMaxWidth: 200,
      titleFontColor: "#faf0e6",
      titleFontSize: 12,
      margin: 10,
      labelAutoFit: true,
      labelMaxWidth: 70,
      gridThickness: 0.1,
      labelFontColor: "#faf0e6",
      titleFontWeight: "italic",
      titleFontFamily: "calibri",
      labelTextAlign: "center",
      lineColor: "#faf0e6",

      lineThickness: 1,
      labelFontSize: 10,
      tickThickness: 1,
    },

    toolbar: {
      itemBackgroundColor: "#060818",
      itemBackgroundColorOnHover: "#060818",
      buttonBorderColor: "#eccaa0",
      buttonBorderThickness: 1,
      fontColor: "#d6d6d6",
      fontColorOnHover: "#d3d3d3",
    },
    data: [
      {
        type: "column", //change type to bar, line, area, pie, etc
        // indexLabel: "{y}", //Shows y value on all Data Points
        indexLabelFontColor: "#5A5757",
        indexLabelPlacement: "outside",
        dataPoints: resultForEarning,
      },
    ],
  };

  return (
    <>
      <div id="content" class="main-content">
        <div class="layout-px-spacing">
          <div className="row my-2">
            <div class="col-xl-6 col-md-6 col-sm-12 col-12">
              <h4>Hi, Welcome back!</h4>
              <p>{appName} monitoring dashboard.</p>
            </div>
            <div class="col-xl-6 col-md-6 col-sm-12 col-12 ">
              <div class="breadcrumb-four float-right">
                <ul class="breadcrumb">
                  <li className="active">
                    <Link to="/admin/dashboard">
                      {" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-home"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="row my-2 ">
            <div class="col-xl-8 col-md-8 col-sm-12 col-12">
              <div className="text-left align-sm-left d-md-flex d-lg-flex justify-content-start">
                <button
                  className="btn bg-purple-gradient text-white mr-2"
                  onClick={getAll}
                >
                  Life Time
                </button>
                <button
                  className="collapsed btn bg-purple-gradient text-white  "
                  value="check"
                  data-toggle="collapse"
                  data-target="#datePicker"
                  onClick={collapsedDatePicker}
                >
                  Filter
                  <ExpandMoreIcon />
                </button>
                <p style={{ paddingLeft: 10 }} className="my-2 ">
                  {sDate !== "ALL" && sDate + " to " + eDate}
                </p>
              </div>
            </div>

            <div
              id="datePicker"
              className="collapse mt-5 pt-5 position-absolute"
              aria-expanded="false"
            >
              <div className="container table-responsive">
                <div key={JSON.stringify(date)}>
                  <DateRangePicker
                    onChange={(item) => {
                      setDate([item.selection]);
                      const dayStart = dayjs(item.selection.startDate).format(
                        "YYYY-MM-DD"
                      );
                      const dayEnd = dayjs(item.selection.endDate).format(
                        "YYYY-MM-DD"
                      );

                      setsDate(dayStart);
                      seteDate(dayEnd);
                    }}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    ranges={date}
                    direction="horizontal"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="row row-sm mt-3">
            <div class="col-xl-3 mt-2 col-lg-6 col-md-6 col-xm-12">
              <div
                class="card overflow-hidden sales-card bg-primary-gradient"
                // onClick={() => setType("User")}
                style={{ cursor: "pointer" }}
              >
                <div class="pl-3  pt-3 pr-3 pb-2 pt-0">
                  <div class="">
                    <h6 class="mb-3 tx-12 text-white">TOTAL USERS</h6>
                  </div>
                  <div class="pb-0 mt-0">
                    <div class="d-flex">
                      <div class="">
                        <h4 class="tx-20 font-weight-bold mb-1 text-white">
                          {data?.user?.totalUser}
                        </h4>
                        <p class="mb-0 tx-12 text-white op-7"></p>
                      </div>
                      <span class="float-right my-auto ml-auto">
                        {/* <i class="fas fa-arrow-circle-up text-white"></i>
                        <span class="text-white op-7"> +427</span> */}
                      </span>
                    </div>
                  </div>
                </div>
                <span id="compositeline" class="pt-1">
                  <canvas
                    width="332"
                    height="30"
                    style={{
                      display: "inline-block",
                      width: "332px",
                      height: "30px",
                      verticalAlign: "top",
                    }}
                    class=""
                  ></canvas>
                </span>
              </div>
            </div>
            <div class="col-xl-3 mt-2 col-lg-6 col-md-6 col-xm-12">
              <div
                class="card overflow-hidden sales-card bg-danger-gradient"
                // onClick={() => setType("Reel")}
                style={{ cursor: "pointer" }}
              >
                <div class="pl-3 pt-3 pr-3 pb-2 pt-0">
                  <div class="">
                    <h6 class="mb-3 tx-12 text-white">TOTAL REELS</h6>
                  </div>
                  <div class="pb-0 mt-0">
                    <div class="d-flex">
                      <div class="">
                        <h4 class="tx-20 font-weight-bold mb-1 text-white">
                          {data?.reel?.totalReel}
                        </h4>
                        <p class="mb-0 tx-12 text-white op-7"></p>
                      </div>
                      <span class="float-right my-auto ml-auto">
                        {/* <i class="fas fa-arrow-circle-down text-white"></i>
                        <span class="text-white op-7"> -23.09%</span> */}
                      </span>
                    </div>
                  </div>
                </div>
                <span id="compositeline2" class="pt-1">
                  <canvas
                    width="332"
                    height="30"
                    style={{
                      display: "inline-block",
                      width: "332px",
                      height: "30px",
                      verticalAlign: "top",
                    }}
                    class=""
                  ></canvas>
                </span>
              </div>
            </div>


            <div class="col-xl-3  mt-2  col-lg-6 col-md-6 col-xm-12">
              <div
                class="card overflow-hidden sales-card bg-success-gradient"
                // onClick={() => setType("Revenue")}
                style={{ cursor: "pointer" }}
              >
                <div class="pl-3 pt-3 pr-3 pb-2 pt-0">
                  <div class="">
                  <h6 class="mb-3 tx-12 text-white">TOTAL Business Earning</h6>
                    {/* <h6 class="mb-3 tx-12 text-white">TOTAL EARNINGS</h6> */}
                  </div>
                  <div class="pb-0 mt-0">
                    <div class="d-flex">
                      <div class="">
                        <h4 class="tx-20 font-weight-bold mb-1 text-white">
                          {/* $ {data?.revenue?.totalRevenue} */}
                          PKR {data?.talent?.totalTalentEarning}
                        </h4>
                        <p class="mb-0 tx-12 text-white op-7"></p>
                      </div>
                      <span class="float-right my-auto ml-auto">
                        {/* <i class="fas fa-arrow-circle-up text-white"></i>
                        <span class="text-white op-7"> 52.09%</span> */}
                      </span>
                    </div>
                  </div>
                </div>
                <span id="compositeline3" class="pt-1">
                  <canvas
                    width="332"
                    height="30"
                    style={{
                      display: "inline-block",
                      width: "332px",
                      height: "30px",
                      verticalAlign: "top",
                    }}
                  ></canvas>
                </span>
              </div>
            </div>


            <div class="col-xl-3  mt-2 col-lg-6 col-md-6 col-xm-12">
              <div
                class="card overflow-hidden sales-card bg-warning-gradient"
                // onClick={() => setType("Withdraw")}
                style={{ cursor: "pointer" }}
              >
                <div class="pl-3 pt-3 pr-3 pb-2 pt-0">
                  <div class="">
                    <h6 class="mb-3 tx-12 text-white">TOTAL Talent Cash Share</h6>
                    {/* <h6 class="mb-3 tx-12 text-white">TOTAL WITHDRAWAL</h6> */}
                  </div>
                  <div class="pb-0 mt-0">
                    <div class="d-flex">
                      <div class="">
                        <h4 class="tx-20 font-weight-bold mb-1 text-white">
                        {/* $ {data?.withdraw?.totalWithdraw} */}
                        PKR {data?.talentCashShare?.totalTalentCashShareEarning}
                        </h4>
                        <p class="mb-0 tx-12 text-white op-7"></p>
                      </div>
                      <span class="float-right my-auto ml-auto">
                        {/* <i class="fas fa-arrow-circle-down text-white"></i>
                        <span class="text-white op-7"> -152.3</span> */}
                      </span>
                    </div>
                  </div>
                </div>
                <span id="compositeline4" class="pt-1">
                  <canvas
                    width="332"
                    height="30"
                    style={{
                      display: "inline-block",
                      width: "332px",
                      height: "30px",
                      verticalAlign: "top",
                    }}
                  ></canvas>
                </span>
              </div>
            </div>

            <div class="col-xl-3  mt-2 col-lg-6 col-md-6 col-xm-12">
              <div
                class="card overflow-hidden sales-card bg-warning-gradient"
                // onClick={() => setType("Withdraw")}
                style={{ cursor: "pointer" }}
              >
                <div class="pl-3 pt-3 pr-3 pb-2 pt-0">
                  <div class="">
                    <h6 class="mb-3 tx-12 text-white">Deals Booked Today</h6>
                  </div>
                  <div class="pb-0 mt-0">
                    <div class="d-flex">
                      <div class="">
                        <h4 class="tx-20 font-weight-bold mb-1 text-white">
                         {data?.todayTotalBooking?.todayBookings}
                        </h4>
                        <p class="mb-0 tx-12 text-white op-7"></p>
                      </div>
                      <span class="float-right my-auto ml-auto">
                        {/* <i class="fas fa-arrow-circle-down text-white"></i>
                        <span class="text-white op-7"> -152.3</span> */}
                      </span>
                    </div>
                  </div>
                </div>
                <span id="compositeline4" class="pt-1">
                  <canvas
                    width="332"
                    height="30"
                    style={{
                      display: "inline-block",
                      width: "332px",
                      height: "30px",
                      verticalAlign: "top",
                    }}
                  ></canvas>
                </span>
              </div>
            </div>

            <div class="col-xl-3  mt-2 col-lg-6 col-md-6 col-xm-12">
              <div
                class="card overflow-hidden sales-card bg-warning-gradient"
                // onClick={() => setType("Withdraw")}
                style={{ cursor: "pointer" }}
              >
                <div class="pl-3 pt-3 pr-3 pb-2 pt-0">
                  <div class="">
                    <h6 class="mb-3 tx-12 text-white"> Android APP Downloads</h6>
                  </div>
                  <div class="pb-0 mt-0">
                    <div class="d-flex">
                      <div class="">
                        <h4 class="tx-20 font-weight-bold mb-1 text-white">
                         {data?.appDownload?.android}
                        </h4>
                        <p class="mb-0 tx-12 text-white op-7"></p>
                      </div>
                      <span class="float-right my-auto ml-auto">
                        {/* <i class="fas fa-arrow-circle-down text-white"></i>
                        <span class="text-white op-7"> -152.3</span> */}
                      </span>
                    </div>
                  </div>
                </div>
                <span id="compositeline4" class="pt-1">
                  <canvas
                    width="332"
                    height="30"
                    style={{
                      display: "inline-block",
                      width: "332px",
                      height: "30px",
                      verticalAlign: "top",
                    }}
                  ></canvas>
                </span>
              </div>
            </div>

            <div class="col-xl-3  mt-2 col-lg-6 col-md-6 col-xm-12">
              <div
                class="card overflow-hidden sales-card bg-warning-gradient"
                // onClick={() => setType("Withdraw")}
                style={{ cursor: "pointer" }}
              >
                <div class="pl-3 pt-3 pr-3 pb-2 pt-0">
                  <div class="">
                    <h6 class="mb-3 tx-12 text-white"> IOS APP Downloads</h6>
                  </div>
                  <div class="pb-0 mt-0">
                    <div class="d-flex">
                      <div class="">
                        <h4 class="tx-20 font-weight-bold mb-1 text-white">
                        {data?.appDownload?.ios}
                         {/* 100 */}
                        </h4>
                        <p class="mb-0 tx-12 text-white op-7"></p>
                      </div>
                      <span class="float-right my-auto ml-auto">
                        {/* <i class="fas fa-arrow-circle-down text-white"></i>
                        <span class="text-white op-7"> -152.3</span> */}
                      </span>
                    </div>
                  </div>
                </div>
                <span id="compositeline4" class="pt-1">
                  <canvas
                    width="332"
                    height="30"
                    style={{
                      display: "inline-block",
                      width: "332px",
                      height: "30px",
                      verticalAlign: "top",
                    }}
                  ></canvas>
                </span>
              </div>
            </div>
          </div>

          <div className="row mt-3"></div>

          <div className="row ">
            <div className="col-md-6">
              <>
                {arrayForUser?.length !== countForUser[0] ? (
                  <div className="mt-5">
                    <div className="card p-3">
                      <CanvasJSChart options={optionForUser} />
                    </div>
                  </div>
                ) : (
                  <p className="text-center">Chart not Available</p>
                )}
              </>
            </div>
            <div className="col-md-6">
              <>
                {arrayForEarning?.length !== countForEarning[0] ? (
                  <div className="mt-5">
                    <div className="card p-3">
                      <CanvasJSChart options={optionForEarning} />
                    </div>
                  </div>
                ) : (
                  <p className="text-center"></p>
                  // <p className="text-center">Chart not Available</p>
                )}
              </>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { getDashboard })(Dashboard);
