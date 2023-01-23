import React, { useEffect, useState } from "react";

//redux
import { connect, useDispatch, useSelector } from "react-redux";

//action
import { getSticker, deleteSticker } from "../../Store/sticker/action";

//config
import { baseURL } from "../../util/ServerPath";

//routing
import { Link } from "react-router-dom";

//MUI
import { makeStyles, TablePagination, Tooltip } from "@material-ui/core";

// type
import { OPEN_STICKER_DIALOG } from "../../Store/sticker/types";

// dialog
import StickerDialog from "../Dialog/StickerDialog";

//sweet alert
import { alert, warning, permissionError } from "../../util/Alert";

//image
import noImage from "../../assets/img/de.png";
import dayjs from "dayjs";

//table pagination
import TablePaginationActions from "./TablePagination";

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

const StickerTable = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles2();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const hasPermission = useSelector((state) => state.admin.user.flag);

  useEffect(() => {
    props.getSticker(); // eslint-disable-next-line
  }, []);

  const sticker = useSelector((state) => state.sticker.sticker);

  useEffect(() => {
    setData(sticker);
  }, [sticker]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = () => {
    dispatch({ type: OPEN_STICKER_DIALOG });
  };

  const handleDelete = (id) => {
    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          if (!hasPermission) return permissionError();
          props.deleteSticker(id);
          alert("Deleted!", `Sticker has been deleted!`, "success");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (data) => {
    dispatch({ type: OPEN_STICKER_DIALOG, payload: data });
  };

  return (
    <>
      <div id="content" class="main-content">
        <div class="layout-px-spacing mt-4">
          <div className="row py-2">
            <div class="col-xl-6 col-md-6 col-sm-12 col-12">
              <h4>Sticker </h4>
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
                    <a href="javscript:void(0);"> Sticker </a>
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
                    <div class="col-xl-4 col-md-4 float-right col-sm-12 col-12 filtered-list-search "></div>
                  </div>
                  <div class="table-responsive">
                    <table class="table text-center  mb-4 table-striped">
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>Image</th>
                          <th>Created At</th>
                          <th>Updated At</th>
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
                                <td>
                                  <img
                                    height="50px"
                                    width="50px"
                                    alt="app"
                                    src={
                                      data.sticker
                                        ? baseURL + data.sticker
                                        : noImage
                                    }
                                    style={{
                                      boxShadow:
                                        "0 5px 15px 0 rgb(105 103 103 / 0%)",
                                      border: "2px solid #fff",
                                      borderRadius: 10,
                                      float: "left",
                                    }}
                                  />
                                </td>
                                <td>
                                  {dayjs(data.createdAt).format("DD MMM,YYYY")}
                                </td>
                                <td>
                                  {dayjs(data.updatedAt).format("DD MMM,YYYY")}
                                </td>

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
                            <td colSpan="6" align="center">
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
      <StickerDialog />
    </>
  );
};

export default connect(null, { getSticker, deleteSticker })(StickerTable);
