import React, { useEffect, useState } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import { getRedeemPlan, deleteRedeemPlan } from "../../Store/RedeemPlan/action";

//routing
import { Link } from "react-router-dom";

// type
import { OPEN_REDEEM_PLAN_DIALOG } from "../../Store/RedeemPlan/types";

//MUI
import { makeStyles, TablePagination } from "@material-ui/core";

//sweet alert
import { alert, permissionError, warning } from "../../util/Alert";

//table pagination
import TablePaginationActions from "./TablePagination";
import RedeemPlanDialog from "../Dialog/RedeemPlanDialog";

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

const RedeemPlan = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles2();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const hasPermission = useSelector((state) => state.admin.user.flag);

  useEffect(() => {
    props.getRedeemPlan(); // eslint-disable-next-line
  }, []);

  const redeemPlan = useSelector((state) => state.redeemPlan.redeemPlan);
  console.log(redeemPlan);

  useEffect(() => {
    setData(redeemPlan);
  }, [redeemPlan]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toUpperCase()
      ? e.target.value.trim().toUpperCase()
      : e.target.value.trim();

    if (value) {
      const data = redeemPlan.filter((data) => {
        return (
          data?.tag?.toUpperCase()?.indexOf(value) > -1 ||
          data?.dollar?.toString()?.indexOf(value) > -1 ||
          data?.rupee?.toString()?.indexOf(value) > -1 ||
          data?.diamond?.toString()?.indexOf(value) > -1
        );
      });
      setData(data);
    } else {
      return setData(redeemPlan);
    }
  };

  const handleOpen = () => {
    dispatch({ type: OPEN_REDEEM_PLAN_DIALOG });
  };

  const handleDelete = (planId) => {
    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          if (!hasPermission) return permissionError();
          props.deleteRedeemPlan(planId);
          alert("Deleted!", `Plan has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (data) => {
    dispatch({ type: OPEN_REDEEM_PLAN_DIALOG, payload: data });
  };

  return (
    <>
      <div id="content" class="main-content">
        <div class="layout-px-spacing mt-4">
          <div className="row py-2">
            <div class="col-xl-6 col-md-6 col-sm-12 col-12">
              <h4>Redeem Plan </h4>
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
                    <a href="javscript:void(0);"> Redeem Plan </a>
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
                        class="btn text-white  text-center bg-primary-gradient"
                        onClick={handleOpen}
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
                            class="btn  bg-primary-gradient  text-white"
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
                    <table class="table text-center  mb-4 table-striped">
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>Diamonds</th>
                          <th>Dollar</th>
                          <th>Rupee</th>
                          <th>Tag</th>
                          <th>Edit</th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.length > 0 ? (
                          (rowsPerPage > 0
                            ? data.slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                            : data
                          ).map((data, index) => {
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{data.diamond}</td>
                                <td>{data.dollar}</td>
                                <td>{data.rupee}</td>
                                <td>{data.tag ? data.tag : "-"}</td>
                                <td>
                                  {" "}
                                  <a
                                    class="shadow-none edit-button badge badge-lg p-2"
                                    onClick={() => handleEdit(data)}
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
                                    onClick={() => handleDelete(data._id)}
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
                          })
                        ) : (
                          <tr>
                            <td colSpan="7" align="center">
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
      <RedeemPlanDialog />
    </>
  );
};

export default connect(null, { getRedeemPlan, deleteRedeemPlan })(RedeemPlan);
