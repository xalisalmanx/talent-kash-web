import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

//css
import "../../assets/css/tables/table-basic.css";
import "../../assets/css/elements/search.css";

//MUI icon
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

//Date Range Picker
import { DateRangePicker } from "react-date-range";

//Calendar Css
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

//JQUERY
import $ from "jquery";

//pagination
import Pagination from "../../Page/Pagination";

// dayjs
import dayjs from "dayjs";

//alert
import { permissionError } from "../../util/Alert";

//action
import { getRedeem, action } from "../../Store/Redeem/redeem.action";
import { getUser_ } from "../../Store/User/user.action";

const RedeemTable = (props) => {
  const [data, setData] = useState([]);
  const [type, setType] = useState("pending");

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [date, setDate] = useState([]);
  const [sDate, setsDate] = useState("ALL");
  const [eDate, seteDate] = useState("ALL");

  //user select
  const [search, setSearch] = useState("");

  useEffect(() => {
    props.getUser_(); // eslint-disable-next-line
  }, []);

  useEffect(() => {
    $("#tableDropdown").click(() => {
      $("#datePicker").removeClass("show");
    });
  }, []);

  useEffect(() => {
    props.getRedeem(type, page, rowsPerPage, sDate, eDate, search); // eslint-disable-next-line
  }, [type, page, rowsPerPage, sDate, eDate, search]);

  const { redeem, totalRedeem } = useSelector((state) => state.redeem);
  const hasPermission = useSelector((state) => state.admin.user.flag);

  $(document).ready(() => {
    $("#manageRedeem").on("click", "a", function () {
      // remove className 'active' from all li who already has className 'active'
      $("#manageRedeem a.active-history").removeClass("active-history");
      // adding className 'active' to current click li
      $(this).addClass("active-history");
    });
  });

  useEffect(() => {
    setData(redeem);
  }, [redeem]);
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
    setData(redeem);
  }, [date, redeem]);

  //for pagination
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setPage(1);
    setRowsPerPage(value);
  };

  //for get all reel
  const getAllRedeem = () => {
    $("#datePicker").removeClass("show");

    props.getRedeem(type, page, rowsPerPage, "ALL", "ALL", search);
  };

  const collapsedDatePicker = () => {
    $("#datePicker").toggleClass("collapse");
  };

  const handleAccept = (redeemId) => {
    if (!hasPermission) return permissionError();
    props.action(redeemId, "accept");
  };
  const handleDecline = (redeemId) => {
    if (!hasPermission) return permissionError();
    props.action(redeemId, "decline");
  };

  return (
    <>
      <div id="content" class="main-content">
        <div class="layout-px-spacing mt-4">
          <div className="row py-2">
            <div class="col-xl-6 col-md-6 col-sm-12 col-12">
              <h4>Redeem Request</h4>
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

                  <li class="active">
                    <a href="javscript:void(0);"> Redeem Request</a>
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
                      <div className="text-left align-sm-left d-md-flex d-lg-flex justify-content-start">
                        <button className="btn mr-1 bg-purple-gradient  text-white">
                          All
                        </button>
                        <button
                          className="collapsed btn bg-purple-gradient  text-white "
                          value="check"
                          data-toggle="collapse"
                          data-target="#datePicker"
                          onClick={collapsedDatePicker}
                        >
                          Analytics
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
                              const dayStart = dayjs(
                                item.selection.startDate
                              ).format("YYYY-MM-DD");
                              const dayEnd = dayjs(
                                item.selection.endDate
                              ).format("YYYY-MM-DD");
                              setPage(1);
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
                    <div
                      class="col-xl-6 col-md-6 d-flex justify-content-end  col-sm-12 col-12 filtered-list-search"
                      id="manageRedeem"
                    >
                      <a
                        className="badge badge-lg bg-purple-gradient p-2 mx-2 mt-2 active-history"
                        href
                        onClick={() => {
                          setType("pending");
                          setPage(1);
                        }}
                      >
                        Pending
                      </a>

                      <a
                        className="badge badge-lg bg-purple-gradient p-2 mx-2 mt-2"
                        href
                        onClick={() => {
                          setType("accept");
                          setPage(1);
                        }}
                      >
                        Accepted
                      </a>

                      <a
                        className="badge badge-lg bg-purple-gradient p-2 mx-2 mt-2"
                        href
                        onClick={() => {
                          setType("decline");
                          setPage(1);
                        }}
                      >
                        Decline
                      </a>
                    </div>
                  </div>
                  <div className="row">
                    <div class="col-xl-8 col-md-8 col-sm-12 col-12">
                      <h4>
                        {" "}
                        {type === "pending"
                          ? "Pending Redeem Request"
                          : type === "accept"
                          ? "Accepted Redeem Request"
                          : "Decline Redeem Request"}
                      </h4>
                    </div>
                    <div class="col-xl-4 col-md-4 float-right col-sm-12 col-12 filtered-list-search ">
                      <form class="form-inline my-2 my-lg-0 justify-content-center">
                        <div class="w-100">
                          <input
                            type="text"
                            class="w-100 form-control product-search br-30"
                            id="input-search"
                            placeholder="Search Attendees..."
                            onChange={(e) => setSearch(e.target.value)}
                          />
                          <button
                            class="btn bg-primary-gradient  text-white"
                            type="button"
                          >
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
                              class="feather feather-search"
                            >
                              <circle cx="11" cy="11" r="8"></circle>
                              <line
                                x1="21"
                                y1="21"
                                x2="16.65"
                                y2="16.65"
                              ></line>
                            </svg>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div class="table-responsive mt-2">
                    <table class="table text-center table-striped  mb-4 ">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>User</th>
                          <th>Payment Gateway</th>
                          <th>Description</th>
                          <th>Diamond</th>
                          <th>Created At</th>
                          {type === "pending" && (
                            <>
                              <th>Accept</th>
                              <th>Decline</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {data.length > 0 ? (
                          <>
                            {data.map((value, index) => {
                              return (
                                <tr>
                                  <td>{index + 1}</td>

                                  <td>{value?.userName}</td>
                                  <td>{value?.paymentGateway}</td>
                                  <td>{value?.description}</td>
                                  <td>{value?.diamond}</td>
                                  <td>
                                    {dayjs(value?.date).format("DD MMM, YYYY")}
                                  </td>
                                  {type === "pending" && (
                                    <>
                                      <td class="text-center">
                                        <a
                                          class=" shadow-none badge badge-lg badge-success p-2"
                                          onClick={() =>
                                            handleAccept(value?._id)
                                          }
                                          href
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="15"
                                            height="15"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="feather feather-check-circle mr-2"
                                          >
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                          </svg>
                                          Accept
                                        </a>
                                      </td>
                                      <td class="text-center">
                                        <a
                                          class=" shadow-none badge badge-lg badge-danger  p-2"
                                          onClick={() =>
                                            handleDecline(value?._id)
                                          }
                                          href
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="15"
                                            height="15"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="feather feather-x-circle mr-2"
                                          >
                                            <circle
                                              cx="12"
                                              cy="12"
                                              r="10"
                                            ></circle>
                                            <line
                                              x1="15"
                                              y1="9"
                                              x2="9"
                                              y2="15"
                                            ></line>
                                            <line
                                              x1="9"
                                              y1="9"
                                              x2="15"
                                              y2="15"
                                            ></line>
                                          </svg>
                                          Decline
                                        </a>
                                      </td>
                                    </>
                                  )}
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
                    </table>
                    <Pagination
                      activePage={page}
                      rowsPerPage={rowsPerPage}
                      userTotal={totalRedeem}
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

export default connect(null, { getRedeem, getUser_, action })(RedeemTable);
