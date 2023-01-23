import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";

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

//action
import { getReel, deleteReel , unBanReel } from "../../Store/ReportReels/reel.action";

// dayjs
import dayjs from "dayjs";

// import { baseURL } from "../../util/ServerPath";
import { permissionError, warning, alert } from "../../util/Alert";

const ReelTable = (props) => {
  const history = useHistory();
  const [data, setData] = useState([]);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [date, setDate] = useState([]);
  const [sDate, setsDate] = useState("ALL");
  const [eDate, seteDate] = useState("ALL");

  // useEffect(() => {
  //   $("#tableDropdown").click(() => {
  //     $("#datePicker").removeClass("show");
  //   });
  // }, []);

  useEffect(() => {
    props.getReel(page, rowsPerPage, sDate, eDate); // eslint-disable-next-line
  }, [page, rowsPerPage, sDate, eDate]);

  const { reel, totalReel } = useSelector((state) => state.reel);
  const hasPermission = useSelector((state) => state.admin.user.flag);

  useEffect(() => {
    setData(reel);
  }, [reel]);

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
    setData(reel);
  }, [date, reel]);

  //for pagination
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setPage(1);
    setRowsPerPage(value);
  };

  //for get all reel
  const getAllReel = () => {
    $("#datePicker").removeClass("show");

    props.getReel(page, rowsPerPage, "ALL", "ALL");
  };

  const collapsedDatePicker = () => {
    $("#datePicker").toggleClass("collapse");
  };

  //delete hashtag
  const handleDelete = (reelId) => {
    const data = warning();
    data
      .then((isDeleted) => {
        if (!hasPermission) return permissionError();
        if (isDeleted) {
          props.deleteReel(reelId);
          alert("Deleted!", `Reel has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  //remove ban 
  const handleUnban = (reelId) => {
    const data = warning();
    data
      .then((isDeleted) => {
        if (!hasPermission) return permissionError();
        if (isDeleted) {
          props.unBanReel(reelId);
          alert("Remove !", `Reel has been unban!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };
  // const handleProductShow = (id, value) => {
  //   if (!hasPermission) return permissionError();
  //   setProductShow(!productShow);
  //   props.showProduct(id, value);
  // };

  return (
    <>
      <div id="content" class="main-content">
        <div class="layout-px-spacing mt-4">
          <div className="row py-2">
            <div class="col-xl-6 col-md-6 col-sm-12 col-12">
              <h4>Report Reels</h4>
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
                    <a href="javscript:void(0);"> Video </a>
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
                          className="btn bg-purple-gradient text-white mr-2"
                          onClick={getAllReel}
                        >
                          Life Time
                        </button>
                        <button
                          className="collapsed btn bg-purple-gradient text-white"
                          value="check"
                          data-toggle="collapse"
                          data-target="#datePicker"
                          onClick={collapsedDatePicker}
                          style={{
                            backgroundColor: "#D9386A",
                            color: "white",
                          }}
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
                  <div class="table-responsive mt-5">
                    <table class="table text-center table-striped mb-4 ">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Video</th>
                          <th>User</th>
                          <th>View</th>
                          <th>Like</th>
                          <th>Comment</th>
                          <th>Created At</th>
                          <th>Details</th>

                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.length > 0 ? (
                          <>
                            {data.map((value, index) => {
                              return (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>
                                    <video
                                      src={ value?.video}
                                      className=" rounded"
                                      height={70}
                                      width={70}
                                      controls
                                      style={{
                                        objectFit: "cover",
                                        borderRadius: "50%",
                                      }}
                                    />
                                  </td>
                                  <td>{value?.user?.name}</td>
                                  <td class="text-center">
                                    {value.view ? value.view : 0}
                                  </td>
                                  <td class="text-center">{value?.like}</td>
                                  <td class="text-center">{value?.comment}</td>
                                  <td>
                                    {dayjs(value.createdAt).format(
                                      "DD MMM, YYYY"
                                    )}
                                  </td>
                                  <td class="text-center">
                                    <a
                                      class=" shadow-none info-button badge badge-lg badge-info p-2"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => {
                                        localStorage.setItem(
                                          "ReelInfo",
                                          JSON.stringify(value)
                                        );
                                        history.push("/admin/reel/reelInfo");
                                      }}
                                      href
                                    >
                                      <i class="fas fa-info "></i> Info
                                    </a>
                                  </td>

                                  <td>
                                    <a
                                      class="shadow-none delete-button badge badge-lg  p-2"
                                      onClick={() => handleDelete(value?._id)}
                                      href
                                    >
                                      <i
                                        class="fas fa-trash-alt"
                                        aria-hidden="true"
                                      ></i>
                                      Delete
                                    </a>
                                      &nbsp;
                                    <a
                                      class="shadow-none delete-button badge badge-lg  p-2"
                                      onClick={() => handleUnban(value?._id)}
                                      href
                                    >
                                      <i
                                        class="fas fa-undo-alt"
                                        aria-hidden="true"
                                      ></i>
                                      Un Report
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
                      userTotal={totalReel}
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

export default connect(null, { getReel, deleteReel, unBanReel })(ReelTable);
