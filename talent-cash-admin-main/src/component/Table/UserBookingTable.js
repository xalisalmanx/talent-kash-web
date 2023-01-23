import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

//MUI icon
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

// dayjs
import dayjs from "dayjs";

//Date Range Picker
import { DateRangePicker } from "react-date-range";

//action
import { getHistory } from "../../Store/UserBooking/booking.action";

//Calendar Css
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

//css
import "../../assets/css/tables/table-basic.css";
import "../../assets/css/elements/search.css";
import "../../assets/css/forms/switches.css";
import "../../assets/css/custom.css";

//JQUERY
import $ from "jquery";

//pagination
import Pagination from "../../Page/Pagination";
const UserHistoryTable = (props) => {
  const [data, setData] = useState([]);

  const user = JSON.parse(localStorage.getItem("UserBooking"));

  // const [page, setPage] = useState(1);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  //const [type, setType] = useState("coin");
  const [type, setType] = useState(user.user_role ? user.user_role : "");
  const [status, setStatus] = useState(0);
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
    props.getHistory(page, rowsPerPage, type, status, sDate, eDate, user._id); // eslint-disable-next-line
  }, [page, rowsPerPage, sDate, eDate, type, status, user._id]);

  const { history, totalUser, totalIncome, totalOutgoing } = useSelector(
    (state) => state.history
  );

  useEffect(() => {
    setData(history);
  }, [history]);

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
    setData(history);
  }, [date, history]);

  $(document).ready(() => {
    $("#manageHistory").on("click", "a", function () {
      // remove className 'active' from all li who already has className 'active'
      $("#manageHistory a.active-history").removeClass("active-history");
      // adding className 'active' to current click li
      $(this).addClass("active-history");
    });
  });

  //for pagination
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setPage(1);
    setRowsPerPage(value);
  };

  const collapsedDatePicker = () => {
    $("#datePicker").toggleClass("collapse");
  };

  //for get all user
  const getAllHistory = () => {
    setsDate("ALL");
    seteDate("ALL");
    $("#datePicker").removeClass("show");
    props.getHistory(page, rowsPerPage, type, status, sDate, eDate, user._id);
  };

  return (
    <>
      <div id="content" class="main-content">
        <div
          class="layout-px-spacing mt-4"
          // style={{ background: "#060818" }}
        >
          <div className="row py-2">
            <div class="col-xl-6 col-md-6 col-sm-12 col-12">
              <h4>{user.name ? user.name : "User"}'s History</h4>
            </div>
            <div class="col-xl-6 col-md-6 col-sm-12 col-12 ">
              <div class="breadcrumb-four float-right">
                <ul class="breadcrumb">
                  <li>
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

                  <li>
                    <Link to="/admin/user"> User </Link>
                  </li>

                  <li class="active">
                    <a href="javscript:void(0);"> History</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="row layout-top-spacing">
            <div id="tableDropdown" class="col-lg-12 col-12 layout-spacing">
              <div class="statbox widget  ">
                <div class="widget-content widget-content-area">
                  <div class="row ">
                    <div class="col-xl-6 col-md-6 col-sm-12 col-12">
                      {/* <div className="text-left align-sm-left d-md-flex d-lg-flex justify-content-start">
                        <button
                          className="btn bg-purple-gradient text-white mr-2"
                          onClick={getAllHistory}
                        >
                          Life Time
                        </button>
                        <button
                          className="collapsed btn bg-purple-gradient text-white "
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
                      </div> */}
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
                              const dayStart = dayjs(
                                item.selection.startDate
                              ).format("YYYY-MM-DD");
                              const dayEnd = dayjs(
                                item.selection.endDate
                              ).format("YYYY-MM-DD");
                              setPage(1);
                              setsDate(dayStart);
                              seteDate(dayEnd);
                              props.getHistory(
                                page,
                                rowsPerPage,
                                type,
                                status,
                                sDate,
                                eDate,
                                user._id
                              );
                            }}
                            showSelectionPreview={true}
                            moveRangeOnFirstSelection={false}
                            ranges={date}
                            direction="horizontal"
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-xl-6 col-md-6 d-xl-flex justify-content-end col-sm-12 col-12 filtered-list-search user-history"
                      id="manageHistory"
                    >
                      <a
                        className="badge badge-lg bg-purple-gradient active-history mx-2 mt-2 p-2 active-history"
                        href
                        onClick={() => {
                          setType(user.user_role ? user.user_role : "");
                          setStatus(0);
                          setPage(0);
                        }}
                      >
                        Active Booking
                      </a>
                      <a
                        className="badge badge-lg bg-purple-gradient p-2 mx-2 mt-2 "
                        href
                        onClick={() => {
                          setType(user.user_role ? user.user_role : "");
                          setStatus(1);
                          setPage(0);
                        }}
                      >
                        Complete Booking
                      </a>
                      {/* <a
                        className="badge badge-lg bg-purple-gradient p-2 mx-2 mt-2 "
                        href
                        onClick={() => {
                          setType("gift");
                          setPage(1);
                        }}
                      >
                        Gift History
                      </a>

                      <a
                        className="badge badge-lg bg-purple-gradient convert-history p-2 mx-2 mt-2"
                        href
                        onClick={() => {
                          setType("convert");
                          setPage(1);
                        }}
                      >
                        Convert History
                      </a>

                      <a
                        className="badge badge-lg purchase-history p-2 bg-purple-gradient mx-2 mt-2"
                        href
                        onClick={() => {
                          setType("purchase");
                          setPage(1);
                        }}
                      >
                        Purchase History
                      </a>

                      <a
                        className="badge badge-lg ad-history bg-purple-gradient p-2 mx-2 mt-2"
                        href
                        onClick={() => {
                          setType("ad");
                          setPage(1);
                        }}
                      >
                        Ad History
                      </a> */}
                    </div>
                  </div>
                  <div className="row">
                    <div class="col-xl-3 col-md-3 col-sm-12 col-12">
                      <h4>
                        {" "}
                        {   
                          status == "0"
                          ? "Active Booking History"
                          : "Complete Booking History"}
                      </h4>
                    </div>
                    {/* <div class="col-xl-9 col-md-9 text-right col-sm-12 col-12">
                      <span className="text-success mr-3">
                        Total Income : {totalIncome}
                      </span>{" "}
                      <span className="text-danger ">
                        {" "}
                        Total Outgoing : {totalOutgoing}
                      </span>
                    </div> */}
                  </div>
                  <div class="table-responsive">
                    <table class="table text-center  mb-4 table-striped">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Booking Id</th>
                          <th>{user.user_role == 'user' ? 'Talent Provider' : 'User'}</th>
                          <th>Service</th>
                          <th>Price</th>
                          <th>Booking Date</th>
                        </tr>
                      </thead>
                      {type !== "coin" && type !== "diamond" ? (
                        <tbody>
                          {data?.length > 0 ? (
                            <>
                              {data.map((value, index) => {
                                return (
                                  <tr>
                                    <td>{index + 1}</td>
                                    <td>
                                      {/* {value?._id} */}
                                      {value?.booking_id}
                                    </td>
                                    <td>
                                      {" "}
                                      {user.user_role == 'user' ? value?.talentUserId.name : value?.userId.name}
                                    </td>
                                    <td>
                                      {" "}
                                      {value?.service}
                                    </td>
                                    <td>
                                      {" "}
                                      {value?.price+' Rs'}
                                    </td>
                                    <td>
                                      {dayjs(value.accept_date).format(
                                        "DD MMM, YYYY"
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </>
                          ) : (
                            <tr>
                              <td colSpan="10" align="center">
                                Nothing to show!!
                              </td>
                            </tr>
                          )}
                        </tbody>
                      ) : (
                        <tbody>
                          {data?.length > 0 ? (
                            <>
                              {data.map((value, index) => {
                                return (
                                  <tr>
                                    <td>{index + 1}</td>
                                    <td
                                      className={
                                        value?.isIncome
                                          ? "text-success"
                                          : "text-danger"
                                      }
                                    >
                                      {type === "coin" && value?.isIncome
                                        ? "Add Coin By Admin"
                                        : type === "coin" && !value?.isIncome
                                        ? "Less Coin By Admin"
                                        : type === "diamond" && !value?.isIncome
                                        ? "Less Diamond By Admin"
                                        : "Add Diamond By Admin"}
                                    </td>
                                    <td
                                      className={
                                        type !== "coin"
                                          ? value?.isIncome
                                            ? "text-success"
                                            : "text-danger"
                                          : ""
                                      }
                                    >
                                      {" "}
                                      {value?.diamond}
                                    </td>
                                    <td
                                      className={
                                        type !== "diamond"
                                          ? value?.isIncome
                                            ? "text-success"
                                            : "text-danger"
                                          : ""
                                      }
                                    >
                                      {" "}
                                      {value?.coin}
                                    </td>
                                    <td>
                                      {dayjs(data.analyticDate).format(
                                        "DD MMM, YYYY"
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </>
                          ) : (
                            <tr>
                              <td colSpan="10" align="center">
                                Nothing to show!!
                              </td>
                            </tr>
                          )}
                        </tbody>
                      )}
                    </table>

                    <Pagination
                      activePage={page}
                      rowsPerPage={rowsPerPage}
                      userTotal={totalUser}
                      handleRowsPerPage={handleRowsPerPage}
                      handlePageChange={handlePageChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { getHistory })(UserHistoryTable);
