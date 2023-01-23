import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

//MUI icon
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

//Date Range Picker
import { DateRangePicker } from "react-date-range";

//Calendar Css
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

//css
import "../../assets/css/tables/table-basic.css";
import "../../assets/css/elements/search.css";
import "../../assets/css/forms/switches.css";

//JQUERY
import $ from "jquery";

//action
import { getUser, isBlock } from "../../Store/User/user.action";

//pagination
import Pagination from "../../Page/Pagination";

//image
import boy from "../../assets/img/boy.png";
import girl from "../../assets/img/girl-3.png";

// dayjs
import dayjs from "dayjs";
import { useHistory } from "react-router-dom";
import { permissionError } from "../../util/Alert";

const UserTable = (props) => {
  const history = useHistory();
  const [data, setData] = useState([]);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const [date, setDate] = useState([]);
  const [sDate, setsDate] = useState("ALL");
  const [eDate, seteDate] = useState("ALL");

  const hasPermission = useSelector((state) => state.admin.user.flag);

  var ignoreClickOnMeElement = document.getElementById("datePicker");
  document.addEventListener("click", function (event) {
    var isClickInsideElement = ignoreClickOnMeElement.contains(event.target);
    if (!isClickInsideElement) {
      $("#datePicker").removeClass("show");
    }
  });

  useEffect(() => {
    props.getUser(page, rowsPerPage, search, sDate, eDate); // eslint-disable-next-line
  }, [page, rowsPerPage, search, sDate, eDate]);

  const { user, totalUser } = useSelector((state) => state.user);

  useEffect(() => {
    setData(user);
  }, [user]);

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
    setData(user);
  }, [date, user]);

  //for pagination
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setPage(1);
    setRowsPerPage(value);
  };

  //for get all user
  const getAllUser = () => {
    setsDate("ALL");
    seteDate("ALL");
    $("#datePicker").removeClass("show");
    props.getUser(page, rowsPerPage, search, sDate, eDate);
  };

  const collapsedDatePicker = () => {
    $("#datePicker").toggleClass("collapse");
  };

  //block user
  const blockUser = (value) => {
    if (!hasPermission) return permissionError();
    props.isBlock(value._id, value.isBlock);
  };

  const handleUserInfo = (user) => {
    localStorage.setItem("user", JSON.stringify(user));

    history.push("/admin/user/userInfo");
  };
  const handleUserHistory = (user) => {
    localStorage.setItem("HistoryUser", JSON.stringify(user));

    history.push("/admin/user/history");
  };

  // By umar//
  const handleUserBooking = (user) => {
    localStorage.setItem("UserBooking", JSON.stringify(user));

    history.push("/admin/user/booking");
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
              <h4>User </h4>
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
                    <a href="javscript:void(0);"> User </a>
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
                    <div class="col-xl-8 col-md-8 col-sm-12 col-12">
                      <div className="text-left align-sm-left d-md-flex d-lg-flex justify-content-start">
                        <button
                          className="btn bg-purple-gradient text-white mr-2 "
                          onClick={getAllUser}
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
                              const dayStart = dayjs(
                                item.selection.startDate
                              ).format("YYYY-MM-DD");
                              const dayEnd = dayjs(
                                item.selection.endDate
                              ).format("YYYY-MM-DD");
                              setPage(1);
                              setsDate(dayStart);
                              seteDate(dayEnd);
                              props.getUser(
                                page,
                                rowsPerPage,
                                search,
                                sDate,
                                eDate
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
                  <div class="table-responsive">
                    <table class="table text-center  mb-4 table-striped">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>User Id</th>
                          <th>Image</th>

                          <th>Name</th>
                          <th>Username</th>
                          <th>Followers</th>
                          <th>Following</th>
                          <th>Identity</th>
                          <th>Created At</th>
                          <th>isBlock</th>
                          <th class="text-center">Details</th>
                          <th class="text-center">History</th>
                          <th class="text-center">Booking</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.length > 0 ? (
                          <>
                            {data.map((value, index) => {
                              return (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>{value?.user_id}</td>
                                  <td>
                                    <img
                                      height="50px"
                                      width="50px"
                                      alt="app"
                                      src={
                                        value?.profileImage
                                          ? value?.profileImage
                                          : value?.gender === "female"
                                          ? girl
                                          : boy
                                      }
                                      className=""
                                      style={{
                                        boxShadow:
                                          "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                        border: "2px solid #fff",
                                        borderRadius: 10,
                                        float: "left",
                                      }}
                                    />
                                  </td>

                                  <td>{value?.name}</td>
                                  <td>{value?.username}</td>
                                  <td>{value?.followers}</td>
                                  <td>{value?.following}</td>
                                  <td>{value?.identity}</td>
                                  <td>
                                    {dayjs(value.analyticDate).format(
                                      "DD MMM, YYYY"
                                    )}
                                  </td>
                                  <td>
                                    <label class="switch s-icons s-outline  s-outline-primary mb-0">
                                      <input
                                        type="checkbox"
                                        checked={value?.isBlock}
                                        onClick={() => blockUser(value)}
                                      />
                                      <span class="slider round"></span>
                                    </label>
                                  </td>
                                  <td class="text-center">
                                    <a
                                      class=" shadow-none info-button badge badge-lg badge-info p-2"
                                      to="/admin/userInfo"
                                      onClick={() => handleUserInfo(value)}
                                      href
                                    >
                                      <i class="fas fa-info "></i> Info
                                    </a>
                                  </td>
                                  <td>
                                    {" "}
                                    <a
                                      class="shadow-none history-button badge badge-lg  p-2"
                                      onClick={() => handleUserHistory(value)}
                                      href
                                    >
                                      <i class="fas fa-clock"></i>
                                      {/* <i
                                        class="fas fa-edit "
                                        aria-hidden="true"
                                      ></i>{" "} */}
                                      {"  "} History
                                      {"  "}
                                    </a>
                                  </td>
                                  <td>
                                    {" "}
                                    <a
                                      class="shadow-none history-button badge badge-lg  p-2"
                                      onClick={() => handleUserBooking (value)}
                                      href
                                    >
                                      <i class="fas fa-eye"></i>
                                      {/* <i
                                        class="fas fa-edit "
                                        aria-hidden="true"
                                      ></i>{" "} */}
                                      {"  "} Booking
                                      {"  "}
                                    </a>
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

export default connect(null, { getUser, isBlock })(UserTable);
