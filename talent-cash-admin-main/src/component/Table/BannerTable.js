import React, { useEffect, useState } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import {
  getBanner,
  handleVIPSwitch,
  deleteBanner,
} from "../../Store/banner/action";

// dayjs
import dayjs from "dayjs";

//config
import { baseURL } from "../../util/ServerPath";

//routing
import { Link } from "react-router-dom";

//MUI
import { makeStyles, TablePagination } from "@material-ui/core";

// type
import { OPEN_BANNER_DIALOG } from "../../Store/banner/types";

// dialog
// import BannerDialog from "../dialog/Banner";

//sweet alert
import { alert, permissionError, warning } from "../../util/Alert";

//table pagination
import TablePaginationActions from "./TablePagination";
import BannerDialog from "../Dialog/BannerDialog";

const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
  selectDropdown: { color: "#fff", backgroundColor: "#1b1f38" },
  menuItem: {
    "&:hover": {
      backgroundColor: "#3b3f58",
    },
  },
});

const BannerTable = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles2();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    props.getBanner(); // eslint-disable-next-line
  }, []);

  const banner = useSelector((state) => state.banner.banner);
  const hasPermission = useSelector((state) => state.admin.user.flag);

  useEffect(() => {
    setData(banner);
  }, [banner]);

  //search
  const handleSearch = (e) => {
    const value = e.target.value.toUpperCase()
      ? e.target.value.trim().toUpperCase()
      : e.target.value.trim();
    if (value) {
      const data = banner.filter((data) => {
        return data?.URL?.toUpperCase()?.indexOf(value) > -1;
      });
      setData(data);
    } else {
      return setData(banner);
    }
  };

  //pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //   const handleVIPSwitch_ = (bannerId) => {
  //     props.handleVIPSwitch(bannerId);
  //   };

  const handleOpen = () => {
    dispatch({ type: OPEN_BANNER_DIALOG });
  };

  const handleDelete = (bannerId) => {
    const data = warning();
    data
      .then((isDeleted) => {
        if (!hasPermission) return permissionError();
        if (isDeleted) {
          props.deleteBanner(bannerId);
          alert("Deleted!", `Banner has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (data) => {
    dispatch({ type: OPEN_BANNER_DIALOG, payload: data });
  };

  return (
    <>
      <div id="content" class="main-content">
        <div class="layout-px-spacing mt-4">
          <div className="row py-2">
            <div class="col-xl-6 col-md-6 col-sm-12 col-12">
              <h4>Banner </h4>
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
                    <a href="javscript:void(0);"> Banner </a>
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
                      <button
                        class="btn text-white add-button bg-primary-gradient  text-center"
                        onClick={handleOpen}
                        // style={{ backgroundColor: "#D9386A" }}
                      >
                        <i class="fa fa-plus pr-1" aria-hidden="true"></i> Add
                      </button>
                    </div>
                    <div class="col-xl-4 col-md-4 float-right col-sm-12 col-12 filtered-list-search ">
                      <form class="form-inline my-2 my-lg-0 justify-content-center">
                        <div class="w-100">
                          <input
                            type="text"
                            class="w-100 form-control product-search br-30"
                            id="input-search"
                            placeholder="Search Attendees..."
                            onChange={handleSearch}
                          />
                          <button
                            class="btn bg-primary-gradient  text-white"
                            type="button"
                            onClick={handleSearch}
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
                    <table class="table text-center table-striped  mb-4">
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>Image</th>
                          <th>URL</th>
                          <th>Create At</th>
                          <th>Edit</th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.length > 0 ? (
                          <>
                            {data
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((value, index) => {
                                return (
                                  <tr>
                                    <td>{index + 1}</td>
                                    <td className="">
                                      <img
                                        height="50px"
                                        width="50px"
                                        alt="app"
                                        // src={baseURL + value?.image}
                                        src={value?.image}
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
                                    <td>{value?.URL}</td>

                                    <td>
                                      {dayjs(data.createdAt).format(
                                        "DD MMM, YYYY"
                                      )}
                                    </td>
                                    <td>
                                      {" "}
                                      <a
                                        class="shadow-none edit-button badge badge-lg  p-2"
                                        onClick={() => handleEdit(value)}
                                        href
                                      >
                                        <i
                                          class="fas fa-edit "
                                          aria-hidden="true"
                                        ></i>{" "}
                                        {"  "} Edit
                                        {"  "}
                                      </a>
                                    </td>
                                    <td>
                                      {" "}
                                      <a
                                        class="shadow-none delete-button badge badge-lg  p-2"
                                        onClick={() => handleDelete(value._id)}
                                        href
                                      >
                                        <i
                                          class="fas fa-trash-alt"
                                          aria-hidden="true"
                                        ></i>{" "}
                                        Delete
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
                    <div style={{ color: "white" }}>
                      <TablePagination
                        id="pagination"
                        component="div"
                        class=" pagination-custom_outline"
                        rowsPerPageOptions={[
                          5,
                          10,
                          25,
                          100,
                          { label: "All", value: -1 },
                        ]}
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{
                          inputProps: { "aria-label": "rows per page" },
                          MenuProps: {
                            classes: { paper: classes.selectDropdown },
                          },
                        }}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BannerDialog />
    </>
  );
};

export default connect(null, { getBanner, handleVIPSwitch, deleteBanner })(
  BannerTable
);
